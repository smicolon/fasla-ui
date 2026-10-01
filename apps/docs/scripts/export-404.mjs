import { existsSync, renameSync, rmSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Cloudflare Pages serves the closest 404.html up the requested path, so each
// locale folder needs its own. Next's static export writes app/[locale]/404
// as out/{locale}/404/index.html; move it to out/{locale}/404.html and drop the
// folder, so /{locale}/404/ is not also published as a 200 page.
const locales = ["en", "ar"]

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const outputDirectory = path.resolve(scriptDirectory, "../out")

for (const locale of locales) {
  const source = path.join(outputDirectory, locale, "404", "index.html")
  const target = path.join(outputDirectory, locale, "404.html")

  if (!existsSync(source)) {
    throw new Error(`Missing ${path.relative(outputDirectory, source)}; did next build run?`)
  }

  renameSync(source, target)
  rmSync(path.join(outputDirectory, locale, "404"), { recursive: true, force: true })
  console.log(`Exported ${path.relative(outputDirectory, target)}`)
}
