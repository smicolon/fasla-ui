import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"
import { aliasToPath, outsideAliasMessage, pathToAlias, resolveInsideProject, resolveWritableFile, writeFileIfAbsent, writeFileNoFollow } from "../paths.js"
import { NAMESPACE, namespaceUrl } from "../registry.js"
import { detectPackageManager, install, installCommand, missingPackages, type PackageManager, type Runner } from "../pm.js"
import { isLegacyConfig, type ComponentsConfig } from "../legacy.js"
import { aliasRootOrExit, repairLegacyOrExit, safeOrExit, warnViteAlias } from "./shared.js"

const UTILS_SOURCE = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * This ensures proper class merging and deduplication.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

/** What the cn helper imports. A fresh project has neither. */
export const CN_PACKAGES = ["clsx", "tailwind-merge"]

/**
 * Writes the cn helper at the utils alias when nothing is there yet, and says
 * whether it did. Every registry component imports it.
 */
export async function writeCnHelper(cwd: string, utilsAlias: string, aliasRoot: string): Promise<string | undefined> {
  const utilsRelative = aliasToPath(utilsAlias, aliasRoot)
  const utilsPath = await resolveInsideProject(cwd, `${utilsRelative}.ts`)
  await fs.ensureDir(path.dirname(utilsPath))
  return (await writeFileIfAbsent(utilsPath, UTILS_SOURCE)) ? `${utilsRelative}.ts` : undefined
}

/**
 * Installs clsx and tailwind-merge with the project's package manager, unless
 * package.json already lists them. On failure, or when installing is off or
 * there is no package.json, prints the exact command to run instead. Returns
 * false only when an install was tried and failed.
 */
export async function installCnPackages(
  cwd: string,
  pm: PackageManager,
  { enabled = true, run }: { enabled?: boolean; run?: Runner } = {}
): Promise<boolean> {
  const missing = await missingPackages(cwd, CN_PACKAGES)
  if (missing.length === 0) return true
  const command = installCommand(pm, missing)
  if (!enabled) {
    console.log(`\nInstall the packages the cn helper imports:\n  ${chalk.cyan(command)}`)
    return true
  }
  if (!(await fs.pathExists(path.join(cwd, "package.json")))) {
    console.log(chalk.yellow(`\nNo package.json here, so nothing was installed. In your project, run:`))
    console.log(`  ${chalk.cyan(command)}`)
    return true
  }
  const spinner = ora(`Installing ${missing.join(" and ")} with ${pm}...`).start()
  const result = await install(pm, missing, cwd, run)
  if (result.ok) {
    spinner.succeed(`Installed ${missing.join(" and ")} with ${pm}`)
    return true
  }
  spinner.fail(`Could not install ${missing.join(" and ")} with ${pm}`)
  const tail = result.output.trim().split("\n").slice(-15).join("\n")
  if (tail) console.log(chalk.gray(tail))
  console.log(`\nThe cn helper imports them, so the project won't compile without them. Run this to finish:`)
  console.log(`  ${chalk.cyan(command)}`)
  return false
}

export function initCommand() {
  return new Command()
    .name("init")
    .description("Initialize fasla-ui in your project")
    .option("-y, --yes", "Skip confirmation prompts")
    .option("--no-install", "Don't install clsx and tailwind-merge; print the command instead")
    .option("-c, --cwd <path>", "Working directory", process.cwd())
    .action(async (options) => {
      const cwd = path.resolve(options.cwd)
      const yes = Boolean(options.yes)

      console.log(chalk.bold("\nInitializing fasla-ui...\n"))

      const configPath = path.join(cwd, "components.json")
      const pm = await detectPackageManager(cwd)
      // `@/` is wherever the project's tsconfig points it, so the defaults,
      // the stored aliases and the files written all follow it.
      const aliasRoot = await aliasRootOrExit(cwd, yes)

      let config: ComponentsConfig | undefined
      if (await fs.pathExists(configPath)) {
        const existing: ComponentsConfig = await fs.readJson(configPath).catch(() => ({}))
        if (await isLegacyConfig(cwd, existing)) {
          // A 0.3 config is broken, not a choice to keep: repair is the default.
          config = await repairLegacyOrExit(cwd, existing, aliasRoot.root, yes)
        } else if (!yes) {
          const { overwrite } = await prompts({
            type: "confirm",
            name: "overwrite",
            message: "components.json already exists. Overwrite?",
            initial: false,
          })
          if (!overwrite) {
            console.log(chalk.yellow("Cancelled."))
            process.exit(0)
          }
        }
      }

      await warnViteAlias(cwd, aliasRoot, pm)

      if (!config) config = await askForConfig(cwd, aliasRoot.root, yes)
      const aliases = config.aliases ?? {}
      const utilsAlias = aliases.utils ?? "@/lib/utils"

      // Refuse before writing anything if a path would land outside the
      // project or write through a symlink. The cn helper is only written
      // when absent, so an existing one — symlinked or not — is left alone.
      await safeOrExit(async () => {
        await resolveWritableFile(cwd, "components.json")
        await resolveInsideProject(cwd, aliasToPath(aliases.components ?? "@/components", aliasRoot.root))
        await resolveInsideProject(cwd, `${aliasToPath(utilsAlias, aliasRoot.root)}.ts`)
      })

      const spinner = ora("Writing configuration...").start()
      try {
        await writeFileNoFollow(configPath, `${JSON.stringify(config, null, 2)}\n`)
        // Only when absent, decided as it is written: a cn helper that appears
        // after the checks above is kept, not truncated.
        const written = await writeCnHelper(cwd, utilsAlias, aliasRoot.root)
        spinner.succeed(
          written
            ? `Configuration written to components.json, cn helper written to ${written}`
            : "Configuration written to components.json"
        )
      } catch (error) {
        spinner.fail("Failed to write configuration")
        console.error(error)
        process.exit(1)
      }

      if (!(await installCnPackages(cwd, pm, { enabled: options.install !== false }))) process.exit(1)

      console.log(chalk.green("\nSuccess! fasla-ui has been initialized."))
      console.log("\nYou can now add components:")
      console.log(chalk.cyan("  npx @smicolon/cli add button"))
      console.log(chalk.cyan("  npx @smicolon/cli add shimmer-button"))
    })
}

/** The config for a new project, from the prompts or, with `--yes`, the defaults. */
async function askForConfig(cwd: string, aliasRoot: string, yes: boolean): Promise<ComponentsConfig> {
  const under = (p: string) => (aliasRoot ? `${aliasRoot}/${p}` : p)

  let componentsAlias = "@/components"
  let utilsAlias = "@/lib/utils"
  let style = "default"

  if (!yes) {
    // An answer outside `@/`'s folder can't be imported through `@/`, so it
    // is explained and asked again rather than moved inside it.
    const insideAlias = (answer: string) =>
      pathToAlias(answer, aliasRoot) === undefined ? outsideAliasMessage(answer, aliasRoot) : true
    const response = await prompts([
      {
        type: "text",
        name: "componentsDir",
        message: "Where should components be installed?",
        initial: under("components"),
        validate: insideAlias,
      },
      {
        type: "text",
        name: "utilsPath",
        message: "Where is your utils file (cn)?",
        initial: under("lib/utils"),
        validate: insideAlias,
      },
      {
        type: "select",
        name: "style",
        message: "Which style would you like to use?",
        choices: [
          { title: "Default", value: "default" },
          { title: "New York", value: "new-york" },
        ],
        initial: 0,
      },
    ])

    const components = pathToAlias(response.componentsDir ?? "", aliasRoot)
    const utils = pathToAlias(response.utilsPath ?? "", aliasRoot)
    // Only a cancelled prompt gets here without an alias; validate saw the rest.
    if (components === undefined || utils === undefined || response.style === undefined) {
      console.log(chalk.yellow("Cancelled."))
      process.exit(0)
    }
    componentsAlias = components
    utilsAlias = utils
    style = response.style
  }

  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style,
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: under("app/globals.css"),
      baseColor: "slate",
      cssVariables: true,
    },
    aliases: {
      components: componentsAlias,
      utils: utilsAlias,
      ui: `${componentsAlias}/ui`,
      lib: "@/lib",
      hooks: "@/hooks",
    },
    // The shadcn CLI only accepts a namespace that starts with "@" and a URL
    // with {name} in it; the old `smicolon: { url }` entry made every shadcn
    // command in the project fail with "Invalid configuration".
    registries: {
      [NAMESPACE]: namespaceUrl(),
    },
  }
}
