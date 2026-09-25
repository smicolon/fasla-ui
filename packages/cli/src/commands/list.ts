import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import { fetchRegistry } from "../registry.js"

export const list = new Command()
  .name("list")
  .description("List available components")
  .option("-t, --type <type>", "Filter by type (ui, block, effect)")
  .action(async (options) => {
    const spinner = ora("Fetching components...").start()

    let registry
    try {
      registry = await fetchRegistry()
      spinner.stop()
    } catch (error) {
      spinner.fail("Failed to fetch registry")
      console.error(chalk.red((error as Error).message))
      process.exit(1)
    }

    console.log(chalk.bold("\nAvailable Components\n"))

    let items = registry.items

    if (options.type) {
      const typeFilter = `registry:${options.type}`
      items = items.filter((item) =>
        item.type === options.type || item.type === typeFilter
      )
    }

    // Group by type
    const grouped = items.reduce(
      (acc, item) => {
        // Normalize type (remove registry: prefix if present)
        const type = item.type.replace("registry:", "")
        if (!acc[type]) {
          acc[type] = []
        }
        acc[type].push(item)
        return acc
      },
      {} as Record<string, typeof items>
    )

    const typeLabels: Record<string, string> = {
      ui: "UI Primitives",
      block: "App Blocks",
      effect: "Effects & Animations",
    }

    for (const [type, typeItems] of Object.entries(grouped)) {
      console.log(chalk.cyan.bold(`${typeLabels[type] || type}`))
      for (const item of typeItems) {
        const name = item.name.padEnd(20)
        const desc = item.description || ""
        console.log(`  ${chalk.green(name)} ${chalk.gray(desc)}`)
      }
      console.log()
    }

    console.log(chalk.gray(`Total: ${items.length} components`))
    console.log(chalk.gray("\nAdd components with: npx @smicolon/cli add <component>"))
  })
