import { Command } from "commander"
import chalk from "chalk"

// Registry items (will be fetched from registry.json in production)
const REGISTRY_ITEMS = [
  { name: "button", type: "ui", description: "Button component with variants" },
  { name: "input", type: "ui", description: "Input component with validation states" },
  { name: "card", type: "ui", description: "Card with header, content, footer" },
  { name: "badge", type: "ui", description: "Badge for status indicators" },
  { name: "skeleton", type: "ui", description: "Loading skeleton placeholders" },
  { name: "app-shell", type: "block", description: "Application shell layout" },
  { name: "page-header", type: "block", description: "Page header with breadcrumb" },
  { name: "empty-state", type: "block", description: "Empty state with action" },
  { name: "form-section", type: "block", description: "Grouped form fields" },
  { name: "data-table", type: "block", description: "Sortable, filterable table" },
  { name: "shimmer-button", type: "effect", description: "Button with shimmer effect" },
  { name: "animated-gradient", type: "effect", description: "Animated gradient background" },
  { name: "text-reveal", type: "effect", description: "Character-by-character reveal" },
  { name: "border-beam", type: "effect", description: "Animated border effect" },
  { name: "spotlight", type: "effect", description: "Cursor-following spotlight" },
]

export const list = new Command()
  .name("list")
  .description("List available components")
  .option("-t, --type <type>", "Filter by type (ui, block, effect)")
  .action(async (options) => {
    console.log(chalk.bold("\nAvailable Components\n"))

    let items = REGISTRY_ITEMS

    if (options.type) {
      items = items.filter((item) => item.type === options.type)
    }

    // Group by type
    const grouped = items.reduce(
      (acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = []
        }
        acc[item.type].push(item)
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
        console.log(`  ${chalk.green(item.name.padEnd(20))} ${chalk.gray(item.description)}`)
      }
      console.log()
    }

    console.log(chalk.gray(`Total: ${items.length} components`))
    console.log(chalk.gray("\nAdd components with: npx smi-ui add <component>"))
  })
