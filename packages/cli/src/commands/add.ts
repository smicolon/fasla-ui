import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"
import { DEFAULT_REGISTRY_URL, REGISTRY_URL, fetchRegistry, fetchComponent, getTargetDirectory, type RegistryFile, type RegistryItem } from "../registry.js"
import { registryItemName, resolveWithDependencies, rewriteComponentImports } from "../resolve.js"
import { aliasToPath, checkDestination, installFile, resolveInsideProject } from "../paths.js"
import { detectPackageManager, installCommand, missingPackages } from "../pm.js"
import { isLegacyConfig } from "../legacy.js"
import { writeCnHelper } from "./init.js"
import { aliasRootOrExit, repairLegacyOrExit, resumeRepairOrExit, safeOrExit } from "./shared.js"

/** `add`: copies registry components, and what they import, into the project. */
export function addCommand() {
  return new Command()
    .name("add")
    .description("Add components to your project")
    .argument("[components...]", "Components to add")
    .option("-y, --yes", "Skip confirmation")
    .option("-o, --overwrite", "Overwrite existing files")
    .option("-a, --all", "Add all available components")
    .option("-c, --cwd <path>", "Working directory", process.cwd())
    .action(async (components: string[], options) => {
      const cwd = path.resolve(options.cwd)

      // Check for components.json
      const configPath = path.join(cwd, "components.json")
      const hasConfig = await fs.pathExists(configPath)

      if (!hasConfig) {
        console.log(chalk.red("Error: components.json not found."))
        console.log("Run", chalk.cyan("npx @smicolon/cli init"), "first.")
        process.exit(1)
      }

      let config = await fs.readJson(configPath)
      const yes = Boolean(options.yes)
      const pm = await detectPackageManager(cwd)
      // A --yes run stops here, before anything is written, when "@/" is a guess.
      const aliasRoot = await aliasRootOrExit(cwd, yes, pm)

      // Fetch registry
      const spinner = ora("Fetching registry...").start()
      let registry
      try {
        registry = await fetchRegistry()
        spinner.succeed("Registry fetched")
      } catch (error) {
        spinner.fail("Failed to fetch registry")
        console.error(chalk.red((error as Error).message))
        process.exit(1)
      }

      // If --all flag, add all components
      if (options.all) {
        components = registry.items.map((item) => item.name)
      }

      // If no components specified, prompt for selection
      if (components.length === 0) {
        const { selected } = await prompts({
          type: "multiselect",
          name: "selected",
          message: "Which components would you like to add?",
          choices: registry.items.map((item) => ({
            title: `${item.name} ${chalk.gray(`(${item.type.replace("registry:", "")})`)}`,
            value: item.name,
            description: item.description,
          })),
          hint: "Space to select, Enter to confirm",
        })

        if (!selected || selected.length === 0) {
          console.log(chalk.yellow("No components selected."))
          process.exit(0)
        }

        components = selected
      }

      // Validate components exist
      const validComponents = components.filter((c) =>
        registry.items.some((item) => item.name === c)
      )

      const invalidComponents = components.filter(
        (c) => !registry.items.some((item) => item.name === c)
      )

      if (invalidComponents.length > 0) {
        console.log(
          chalk.yellow(`Unknown components: ${invalidComponents.join(", ")}`)
        )
      }

      if (validComponents.length === 0) {
        console.log(chalk.red("No valid components to add."))
        process.exit(1)
      }

      // Confirm
      if (!options.yes) {
        const { confirm } = await prompts({
          type: "confirm",
          name: "confirm",
          message: `Add ${validComponents.length} component(s)?`,
          initial: true,
        })

        if (!confirm) {
          console.log(chalk.yellow("Cancelled."))
          process.exit(0)
        }
      }

      // Only now, with the names checked and the add confirmed, is a 0.3
      // project repaired, so a typo or a failed fetch changes nothing. A
      // repair an earlier run left unfinished is finished first.
      let repaired = await resumeRepairOrExit(cwd)
      if (!repaired && (await isLegacyConfig(cwd, config))) {
        repaired = await repairLegacyOrExit(cwd, config, aliasRoot.root, yes)
        console.log(chalk.green("Repaired components.json.\n"))
      }
      if (repaired) {
        config = repaired
        await safeOrExit(() => writeCnHelper(cwd, config.aliases?.utils ?? "@/lib/utils", aliasRoot.root))
      }
      const componentsAlias: string = config.aliases?.components || "@/components"
      const componentsDir = aliasToPath(componentsAlias, aliasRoot.root)
      await safeOrExit(() => resolveInsideProject(cwd, componentsDir))

      const addSpinner = ora("Resolving dependencies...").start()
      const allDependencies: Set<string> = new Set()
      const baseDir = path.join(cwd, componentsDir)

      // Pull in every registry component the requested ones import, so `add
      // avatar` also writes status-indicator.tsx, which avatar.tsx imports.
      // Dependencies on other Fasla items are full URLs, so the shadcn CLI can
      // follow them too. Map each back to its name here, under the registry this
      // run reads from or the default one the published URLs point at.
      const known = new Set(registry.items.map((item) => item.name))
      const nameOf = (dep: string) => registryItemName(dep, known, [REGISTRY_URL, DEFAULT_REGISTRY_URL])
      let resolved
      try {
        resolved = await resolveWithDependencies(validComponents, nameOf, fetchComponent)
      } catch (error) {
        addSpinner.fail("Failed to resolve components")
        console.error(chalk.red((error as Error).message))
        process.exit(1)
      }
      if (resolved.added.length > 0) {
        addSpinner.info(`Also adding ${resolved.added.join(", ")}, which ${validComponents.join(", ")} need(s)`)
      }
      if (resolved.skipped.length > 0) {
        addSpinner.warn(`Not resolvable from this registry, install separately: ${resolved.skipped.join(", ")}`)
      }

      // Where each registry component lands, for rewriting imports between them.
      const targetDirOf = (name: string) => {
        const item = registry.items.find((i) => i.name === name)
        return item ? getTargetDirectory(item.type, baseDir) : undefined
      }

      const targetPathOf = (file: RegistryFile, component: RegistryItem) =>
        path.join(getTargetDirectory(file.type || component.type, baseDir), path.basename(file.target || file.path))

      // Check every destination before writing any, so a path that leads out of
      // the project, or a destination that is itself a symlink, stops the whole
      // install rather than half of it. Without --overwrite, a file already
      // there will be skipped — it won't be written, so a symlink there is no
      // reason to stop. Whether it exists is decided again when it is written.
      addSpinner.stop()
      for (const component of resolved.items) {
        for (const file of component.files ?? []) {
          await safeOrExit(() => checkDestination(cwd, targetPathOf(file, component), Boolean(options.overwrite)))
        }
      }

      // Which component wrote each file in this run, so two registry files with
      // the same destination can't replace each other, with or without -o.
      const writtenBy = new Map<string, string>()

      for (const component of resolved.items) {
        const componentName = component.name
        addSpinner.start(`Adding ${componentName}...`)

        try {
          if (!component.files || component.files.length === 0) {
            addSpinner.warn(`${componentName}: No files found`)
            continue
          }

          // Track dependencies
          component.dependencies?.forEach((dep) => allDependencies.add(dep))

          // Write each file
          for (const file of component.files) {
            if (!file.content) {
              addSpinner.warn(`${componentName}: Missing content for ${file.path}`)
              continue
            }

            const targetPath = targetPathOf(file, component)
            const targetDir = path.dirname(targetPath)
            const filename = path.basename(targetPath)
            await fs.ensureDir(targetDir)

            // Transform the content - fix imports
            let content = file.content
            // Replace relative imports to utils with the configured path
            const utilsPath = config.aliases?.utils || "@/lib/utils"
            content = content.replace(
              /from ["']\.\.\/.*?lib\/utils["']/g,
              `from "${utilsPath}"`
            )
            content = content.replace(
              /from ["']@\/lib\/utils["']/g,
              `from "${utilsPath}"`
            )
            content = rewriteComponentImports(content, targetDir, targetDirOf)

            // Whether the file may be written is decided as it is written, so
            // one created after the check above is skipped, not truncated.
            const outcome = await installFile(targetPath, content, componentName, {
              overwrite: Boolean(options.overwrite),
              writtenBy,
            })
            if (outcome.result === "exists") {
              addSpinner.warn(`${componentName}: ${filename} already exists, skipping (use -o to overwrite)`)
            } else if (outcome.result === "duplicate") {
              addSpinner.warn(`${componentName}: ${filename} was already written by ${outcome.by} in this run, skipping`)
            }
          }
        } catch (error) {
          addSpinner.warn(`${componentName}: ${(error as Error).message}`)
        }
      }

      addSpinner.succeed(`Added ${resolved.items.length} component(s)`)

      // Show the packages still to install, in the project's package manager:
      // `npm install` in a pnpm project fails, and in a bun or yarn one leaves a
      // second lockfile. Ones package.json already lists are left out.
      const toInstall = await missingPackages(cwd, [...allDependencies])
      if (toInstall.length > 0) {
        console.log(chalk.cyan("\nDependencies to install:"))
        console.log(chalk.gray(`  ${installCommand(pm, toInstall)}`))
      }

      // Show import examples
      console.log(chalk.green("\nComponents added successfully!"))
      console.log("\nImport them in your code:")
      for (const componentName of validComponents) {
        const item = registry.items.find((i) => i.name === componentName)
        const importPath = `${getTargetDirectory(item?.type ?? "registry:ui", componentsAlias)}/${componentName}`
        console.log(chalk.cyan(`  import { ... } from "${importPath}"`))
      }
    })
}
