import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import prompts from "prompts"
import fs from "fs-extra"
import path from "path"

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
  { name: "shimmer-button", type: "effect", description: "Button with shimmer effect" },
  { name: "animated-gradient", type: "effect", description: "Animated gradient background" },
]

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
      console.log("Run", chalk.cyan("npx smi-ui init"), "first.")
      process.exit(1)
    }

    const config = await fs.readJson(configPath)

    // If --all flag, add all components
    if (options.all) {
      components = REGISTRY_ITEMS.map((item) => item.name)
    }

    // If no components specified, prompt for selection
    if (components.length === 0) {
      const { selected } = await prompts({
        type: "multiselect",
        name: "selected",
        message: "Which components would you like to add?",
        choices: REGISTRY_ITEMS.map((item) => ({
          title: `${item.name} (${item.type})`,
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
      REGISTRY_ITEMS.some((item) => item.name === c)
    )

    const invalidComponents = components.filter(
      (c) => !REGISTRY_ITEMS.some((item) => item.name === c)
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

    const spinner = ora("Adding components...").start()

    for (const componentName of validComponents) {
      const item = REGISTRY_ITEMS.find((i) => i.name === componentName)
      if (!item) continue

      spinner.text = `Adding ${componentName}...`

      // Determine target directory based on component type
      const targetDir =
        item.type === "ui"
          ? path.join(cwd, "src/components/ui")
          : item.type === "block"
            ? path.join(cwd, "src/components/blocks")
            : path.join(cwd, "src/components/effects")

      await fs.ensureDir(targetDir)

      // In production, this would fetch from the registry and copy files
      // For now, create a placeholder
      const targetFile = path.join(targetDir, `${componentName}.tsx`)

      if ((await fs.pathExists(targetFile)) && !options.overwrite) {
        spinner.warn(`${componentName} already exists, skipping...`)
        continue
      }

      // Placeholder - in production, fetch actual component code
      await fs.writeFile(
        targetFile,
        `// TODO: Fetch from registry\n// Component: ${componentName}\n// Type: ${item.type}\n`
      )
    }

    spinner.succeed(`Added ${validComponents.length} component(s)`)

    console.log(chalk.green("\nComponents added successfully!"))
    console.log("\nImport them in your code:")
    for (const componentName of validComponents) {
      const item = REGISTRY_ITEMS.find((i) => i.name === componentName)
      const importPath =
        item?.type === "ui"
          ? `@/components/ui/${componentName}`
          : item?.type === "block"
            ? `@/components/blocks/${componentName}`
            : `@/components/effects/${componentName}`
      console.log(chalk.cyan(`  import { ... } from "${importPath}"`))
    }
  })
