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
import { aliasToPath, pathToAlias, readAliasRoot } from "../paths.js"

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
    const aliasRoot = await readAliasRoot(cwd)
    const under = (p: string) => (aliasRoot ? `${aliasRoot}/${p}` : p)

    let componentsAlias = "@/components"
    let utilsAlias = "@/lib/utils"
    let style = "default"

    if (!options.yes) {
      const response = await prompts([
        {
          type: "text",
          name: "componentsDir",
          message: "Where should components be installed?",
          initial: under("components"),
        },
        {
          type: "text",
          name: "utilsPath",
          message: "Where is your utils file (cn)?",
          initial: under("lib/utils"),
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

      componentsAlias = pathToAlias(response.componentsDir, aliasRoot)
      utilsAlias = pathToAlias(response.utilsPath, aliasRoot)
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

    const spinner = ora("Writing configuration...").start()

    try {
      await fs.writeJson(configPath, config, { spaces: 2 })

      // Every component in the registry imports `cn` from the utils alias.
      // Without this file a fresh install does not compile, so init writes it.
      const utilsRelative = aliasToPath(utilsAlias, aliasRoot)
      const utilsPath = path.resolve(cwd, `${utilsRelative}.ts`)

      if (!(await fs.pathExists(utilsPath))) {
        await fs.ensureDir(path.dirname(utilsPath))
        await fs.writeFile(utilsPath, UTILS_SOURCE, "utf8")
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
