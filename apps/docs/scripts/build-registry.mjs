#!/usr/bin/env node

/**
 * Build script to generate shadcn-compatible registry files
 * Reads components from packages/fasla-ui and generates JSON files in public/r/
 */

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

import { buildThemeItems } from "../../../packages/fasla-ui/theme/theme-items.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, "../../..")
const Fasla_UI_DIR = path.join(ROOT_DIR, "packages/fasla-ui")
const OUTPUT_DIR = path.join(__dirname, "../public/r")

/**
 * Where the registry is served. Every item's dependencies on other Fasla items
 * are written as full URLs under it. CI builds against a local server by
 * setting FASLA_REGISTRY_URL, so it tests the items in the PR, not the ones
 * already deployed.
 */
export const REGISTRY_URL = (process.env.FASLA_REGISTRY_URL || "https://ui.smicolon.com/r").replace(/\/+$/, "")

/**
 * The first line of every component file. @smicolon/cli's `add` reads it to
 * tell a Fasla file from another library's file of the same name, which it
 * asks before replacing. A comment may come before "use client".
 */
export const fileMarker = (name) => `// From Fasla UI (@fasla/${name}): https://ui.smicolon.com`

/**
 * A dependency on another Fasla item, as a full URL. The shadcn CLI resolves a
 * bare name such as `status-indicator` against shadcn's own registry, never
 * ours, so `shadcn add @fasla/avatar` failed on a 404. A URL resolves the same
 * whatever namespace the developer gave this registry, or none. Names that are
 * not Fasla items stay bare: those are shadcn's own primitives.
 */
export function dependencyUrls(dependencies, ownNames, base = REGISTRY_URL) {
  return dependencies.map((dep) => (ownNames.has(dep) ? `${base}/${dep}.json` : dep))
}

/**
 * Registry source imports `cn` by its path in this repo,
 * `../../../src/lib/utils`, which exists in no developer's project and which
 * the shadcn CLI leaves alone. Publish it as `@/lib/utils`: the shadcn CLI
 * rewrites that to the project's `aliases.utils`, and so does @smicolon/cli.
 */
export function rewriteUtilsImport(content) {
  return content.replace(/from (["'])(?:\.\.?\/)+(?:src\/)?lib\/utils\1/g, `from $1@/lib/utils$1`)
}

/**
 * Registry files import each other the way the source tree lays them out —
 * `../status-indicator/status-indicator` from `registry/ui/avatar/`. Every CLI
 * writes each file to its `target`, so point the import at where that
 * component lands instead: `./status-indicator` beside `avatar.tsx`. Neither
 * the shadcn CLI nor @smicolon/cli 0.3.3 rewrites these imports, so the
 * published JSON has to carry the right ones. Imports of anything that isn't a
 * registry component are left alone.
 */
export function rewriteComponentImports(content, fromTarget, targetOf) {
  return content.replace(
    /from (["'])\.\.\/([a-z0-9-]+)\/([a-z0-9-]+)\1/g,
    (match, quote, folder, file) => {
      const toTarget = folder === file ? targetOf(file) : undefined
      if (!toTarget) return match
      const rel = path.posix.relative(path.posix.dirname(fromTarget), toTarget.replace(/\.tsx?$/, ""))
      return `from ${quote}${rel.startsWith(".") ? rel : `./${rel}`}${quote}`
    }
  )
}

async function main() {
  console.log("Building registry...")

  // Read the source registry
  const registryPath = path.join(Fasla_UI_DIR, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"))

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.mkdir(path.join(OUTPUT_DIR, "styles/default"), { recursive: true })

  // Where each component's main file lands in a consumer's project.
  const targets = new Map(registry.items.map((item) => [item.name, item.files[0]?.target]))
  const targetOf = (name) => targets.get(name)
  const ownNames = new Set(registry.items.map((item) => item.name))

  // Process each component
  const processedItems = []

  for (const item of registry.items) {
    console.log(`  Processing ${item.name}...`)

    // Read source files and embed content
    const filesWithContent = []
    for (const file of item.files) {
      const sourcePath = path.join(Fasla_UI_DIR, file.path)
      try {
        const content = await fs.readFile(sourcePath, "utf-8")
        filesWithContent.push({
          ...file,
          content: `${fileMarker(item.name)}\n${rewriteComponentImports(rewriteUtilsImport(content), file.target, targetOf)}`,
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
      registryDependencies: dependencyUrls(item.registryDependencies || [], ownNames),
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
      registryDependencies: dependencyUrls(item.registryDependencies || [], ownNames),
      categories: item.categories || [],
    })
  }

  // The theme: base, colours and the two fonts, generated from the Figma
  // snapshots. Published beside the components, so `@fasla/theme` resolves,
  // but kept out of the index: they install with `shadcn add` or our `init`,
  // not as components.
  for (const item of buildThemeItems({ registryUrl: REGISTRY_URL })) {
    console.log(`  Processing ${item.name}...`)
    await fs.writeFile(path.join(OUTPUT_DIR, `${item.name}.json`), JSON.stringify(item, null, 2))
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
  console.log(`  - Dependencies point at: ${REGISTRY_URL}`)
}

// Run only when invoked as a script, so tests can import the rewrite.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(console.error)
}
