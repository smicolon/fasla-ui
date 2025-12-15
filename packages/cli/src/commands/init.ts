import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"

export const init = new Command()
  .name("init")
  .description("Initialize smi-ui in your project")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = path.resolve(options.cwd)

    console.log(chalk.bold("\nInitializing smi-ui...\n"))

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

    // Gather configuration
    let config: Record<string, unknown> = {}

    if (!options.yes) {
      const response = await prompts([
        {
          type: "text",
          name: "componentsDir",
          message: "Where should components be installed?",
          initial: "src/components",
        },
        {
          type: "text",
          name: "utilsPath",
          message: "Where is your utils file (cn)?",
          initial: "src/lib/utils",
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

      config = {
        $schema: "https://ui.shadcn.com/schema.json",
        style: response.style,
        rsc: true,
        tsx: true,
        tailwind: {
          config: "tailwind.config.ts",
          css: "src/app/globals.css",
          baseColor: "slate",
          cssVariables: true,
        },
        aliases: {
          components: `@/${response.componentsDir}`,
          utils: `@/${response.utilsPath}`,
          ui: `@/${response.componentsDir}/ui`,
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: {
          smicolon: {
            url: "https://ui.smicolon.com/r",
          },
        },
      }
    } else {
      config = {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "default",
        rsc: true,
        tsx: true,
        tailwind: {
          config: "tailwind.config.ts",
          css: "src/app/globals.css",
          baseColor: "slate",
          cssVariables: true,
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: {
          smicolon: {
            url: "https://ui.smicolon.com/r",
          },
        },
      }
    }

    const spinner = ora("Writing configuration...").start()

    try {
      await fs.writeJson(configPath, config, { spaces: 2 })
      spinner.succeed("Configuration written to components.json")

      console.log(chalk.green("\nSuccess! smi-ui has been initialized."))
      console.log("\nYou can now add components:")
      console.log(chalk.cyan("  npx smi-ui add button"))
      console.log(chalk.cyan("  npx smi-ui add @smicolon/shimmer-button"))
    } catch (error) {
      spinner.fail("Failed to write configuration")
      console.error(error)
      process.exit(1)
    }
  })
