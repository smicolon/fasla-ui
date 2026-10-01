import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"
import { fetchRegistry, fetchComponent, getTargetDirectory, type RegistryFile, type RegistryItem } from "../registry.js"
import { resolveWithDependencies, rewriteComponentImports } from "../resolve.js"
import { aliasToPath, checkDestination, resolveInsideProject, writeFileNoFollow } from "../paths.js"
import { aliasRootOrExit, safeOrExit } from "./shared.js"

export const add = new Command()
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

    const config = await fs.readJson(configPath)
    const componentsAlias: string = config.aliases?.components || "@/components"
    const componentsDir = aliasToPath(componentsAlias, await aliasRootOrExit(cwd, Boolean(options.yes)))
    await safeOrExit(() => resolveInsideProject(cwd, componentsDir))

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

    const addSpinner = ora("Resolving dependencies...").start()
    const allDependencies: Set<string> = new Set()
    const baseDir = path.join(cwd, componentsDir)

    // Pull in every registry component the requested ones import, so `add
    // avatar` also writes status-indicator.tsx, which avatar.tsx imports.
    let resolved
    try {
      resolved = await resolveWithDependencies(
        validComponents,
        new Set(registry.items.map((item) => item.name)),
        fetchComponent
      )
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
    // there is skipped instead — it won't be written, so a symlink there is
    // no reason to stop.
    addSpinner.stop()
    const skipped = new Set<string>()
    for (const component of resolved.items) {
      for (const file of component.files ?? []) {
        const targetPath = targetPathOf(file, component)
        if ((await safeOrExit(() => checkDestination(cwd, targetPath, Boolean(options.overwrite)))) === "skip") {
          skipped.add(targetPath)
        }
      }
    }

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

          if (skipped.has(targetPath)) {
            addSpinner.warn(`${componentName}: ${filename} already exists, skipping (use -o to overwrite)`)
            continue
          }

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

          await writeFileNoFollow(targetPath, content)
        }
      } catch (error) {
        addSpinner.warn(`${componentName}: ${(error as Error).message}`)
      }
    }

    addSpinner.succeed(`Added ${resolved.items.length} component(s)`)

    // Show dependencies to install
    if (allDependencies.size > 0) {
      console.log(chalk.cyan("\nDependencies to install:"))
      console.log(chalk.gray(`  npm install ${[...allDependencies].join(" ")}`))
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
