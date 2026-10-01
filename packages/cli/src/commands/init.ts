import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"

interface ComponentsConfig {
  aliases?: { utils?: string; [key: string]: string | undefined }
  [key: string]: unknown
}

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
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"
import { aliasToPath, outsideAliasMessage, pathToAlias, resolveInsideProject, resolveWritableFile, writeFileIfAbsent, writeFileNoFollow } from "../paths.js"
import { aliasRootOrExit, safeOrExit } from "./shared.js"

export const init = new Command()
  .name("init")
  .description("Initialize fasla-ui in your project")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd)

    console.log(chalk.bold("\nInitializing fasla-ui...\n"))

    // Check for existing config
    const configPath = path.join(cwd, "components.json")
    const hasConfig = await fs.pathExists(configPath)

    if (hasConfig && !options.yes) {
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

    // Gather configuration. `@/` is wherever the project's tsconfig points it,
    // so the defaults, the stored aliases and the files written all follow it.
    const aliasRoot = await aliasRootOrExit(cwd, Boolean(options.yes))
    const under = (p: string) => (aliasRoot ? `${aliasRoot}/${p}` : p)

    let componentsAlias = "@/components"
    let utilsAlias = "@/lib/utils"
    let style = "default"

    if (!options.yes) {
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

    const config: ComponentsConfig = {
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
      registries: {
        smicolon: {
          url: "https://ui.smicolon.com/r",
        },
      },
    }

    // Every component in the registry imports `cn` from the utils alias.
    // Without this file a fresh install does not compile, so init writes it.
    const utilsRelative = aliasToPath(utilsAlias, aliasRoot)

    // Refuse before writing anything if a path would land outside the project
    // or write through a symlink. The cn helper is only written when absent,
    // so an existing one — symlinked or not — is left alone.
    const utilsPath = await safeOrExit(async () => {
      await resolveWritableFile(cwd, "components.json")
      await resolveInsideProject(cwd, aliasToPath(componentsAlias, aliasRoot))
      return resolveInsideProject(cwd, `${utilsRelative}.ts`)
    })

    const spinner = ora("Writing configuration...").start()

    try {
      await writeFileNoFollow(configPath, `${JSON.stringify(config, null, 2)}\n`)

      // Only when absent, decided as it is written: a cn helper that appears
      // after the checks above is kept, not truncated.
      await fs.ensureDir(path.dirname(utilsPath))
      if (await writeFileIfAbsent(utilsPath, UTILS_SOURCE)) {
        spinner.succeed(`Configuration written to components.json, cn helper written to ${utilsRelative}.ts`)
      } else {
        spinner.succeed("Configuration written to components.json")
      }

      console.log(chalk.green("\nSuccess! fasla-ui has been initialized."))
      console.log("\nYou can now add components:")
      console.log(chalk.cyan("  npx @smicolon/cli add button"))
      console.log(chalk.cyan("  npx @smicolon/cli add shimmer-button"))
    } catch (error) {
      spinner.fail("Failed to write configuration")
      console.error(error)
      process.exit(1)
    }
  })
