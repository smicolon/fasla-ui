import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import { fetchRegistry, type RegistryItem } from "../registry.js"

/**
 * A command that adds one of the components just listed: button when it is
 * among them, otherwise the first. A placeholder like `add <component>` is a
 * shell redirect when pasted, so this names a real one.
 */
export function addExample(items: Pick<RegistryItem, "name">[]): string | undefined {
  const name = items.find((item) => item.name === "button")?.name ?? items[0]?.name
  return name ? `npx @smicolon/fasla-ui@latest add ${name}` : undefined
}

/** `list`: prints the registry's components by type. */
export function listCommand() {
  return new Command()
    .name("list")
    .description("List available components")
    .option("-t, --type <type>", "Filter by type (ui, effect)")
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

      // The registry types effects as registry:ui too; their category tells them apart.
      const kindOf = (item: (typeof items)[number]) =>
        item.categories?.includes("effects") ? "effect" : item.type.replace("registry:", "")

      if (options.type) {
        items = items.filter((item) => kindOf(item) === options.type.replace("registry:", ""))
      }

      // Group by kind
      const grouped = items.reduce(
        (acc, item) => {
          const type = kindOf(item)
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
        effect: "Effects & Animations",
      }

      for (const [type, typeItems] of Object.entries(grouped)) {
        console.log(chalk.cyan.bold(`${typeLabels[type] || type} (${typeItems.length})`))
        for (const item of typeItems) {
          const name = item.name.padEnd(20)
          const desc = item.description || ""
          console.log(`  ${chalk.green(name)} ${chalk.gray(desc)}`)
        }
        console.log()
      }

      console.log(chalk.gray(`Total: ${items.length} components`))
      const example = addExample(items)
      if (example) console.log(chalk.gray(`\nAdd one with: ${example}`))
    })
}
