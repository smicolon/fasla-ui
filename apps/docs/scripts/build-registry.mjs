#!/usr/bin/env node

/**
 * Build script to generate shadcn-compatible registry files
 * Reads components from packages/smi-ui and generates JSON files in public/r/
 */

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, "../../..")
const SMI_UI_DIR = path.join(ROOT_DIR, "packages/smi-ui")
const OUTPUT_DIR = path.join(__dirname, "../public/r")

async function main() {
  console.log("Building registry...")

  // Read the source registry
  const registryPath = path.join(SMI_UI_DIR, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"))

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.mkdir(path.join(OUTPUT_DIR, "styles/default"), { recursive: true })

  // Process each component
  const processedItems = []

  for (const item of registry.items) {
    console.log(`  Processing ${item.name}...`)

    // Read source files and embed content
    const filesWithContent = []
    for (const file of item.files) {
      const sourcePath = path.join(SMI_UI_DIR, file.path)
      try {
        const content = await fs.readFile(sourcePath, "utf-8")
        filesWithContent.push({
          ...file,
          content,
        })
      } catch (err) {
        console.warn(`    Warning: Could not read ${file.path}`)
      }
    }

    // Create individual component JSON
    const componentJson = {
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies || [],
      devDependencies: item.devDependencies || [],
      registryDependencies: item.registryDependencies || [],
      files: filesWithContent,
      categories: item.categories || [],
    }

    // Write individual component file
    const componentPath = path.join(OUTPUT_DIR, "styles/default", `${item.name}.json`)
    await fs.writeFile(componentPath, JSON.stringify(componentJson, null, 2))

    // Also write at root level for simpler access
    const rootComponentPath = path.join(OUTPUT_DIR, `${item.name}.json`)
    await fs.writeFile(rootComponentPath, JSON.stringify(componentJson, null, 2))

    processedItems.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies || [],
      registryDependencies: item.registryDependencies || [],
      categories: item.categories || [],
    })
  }

  // Write main registry index
  const indexJson = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registry.name,
    homepage: registry.homepage,
    items: processedItems,
  }

  await fs.writeFile(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify(indexJson, null, 2)
  )

  // Also write as registry.json for compatibility
  await fs.writeFile(
    path.join(OUTPUT_DIR, "registry.json"),
    JSON.stringify(indexJson, null, 2)
  )

  console.log(`\nRegistry built successfully!`)
  console.log(`  - ${processedItems.length} components`)
  console.log(`  - Output: ${OUTPUT_DIR}`)
}

main().catch(console.error)
