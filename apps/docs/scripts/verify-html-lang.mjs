import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

// Reads the static export, so it runs after `next build` (CI's build job),
// not under `bun test`, where out/ does not exist.

/** Every exported page must declare the language and direction it is in. */
export function expectedLangDir(relativePath) {
  const [first] = relativePath.split(/[\\/]/)
  return first === "ar" ? { lang: "ar", dir: "rtl" } : { lang: "en", dir: "ltr" }
}

/** Cloudflare Pages picks the closest of these, so all three must exist. */
export const requiredNotFoundPages = ["404.html", "en/404.html", "ar/404.html"]

export function verifyHtmlLang(pages) {
  const failures = []

  for (const [relativePath, html] of pages) {
    const tag = html.match(/<html\b[^>]*>/i)?.[0]
    if (!tag) {
      failures.push(`${relativePath}: no <html> element`)
      continue
    }
    const lang = tag.match(/\slang="([^"]*)"/)?.[1]
    const dir = tag.match(/\sdir="([^"]*)"/)?.[1]
    const expected = expectedLangDir(relativePath)
    if (lang !== expected.lang || dir !== expected.dir) {
      failures.push(
        `${relativePath}: ${tag} — expected lang="${expected.lang}" dir="${expected.dir}"`
      )
    }
  }

  const exported = new Set(pages.map(([relativePath]) => relativePath.split(path.sep).join("/")))
  for (const page of requiredNotFoundPages) {
    if (!exported.has(page)) failures.push(`${page}: missing`)
  }

  if (failures.length > 0) {
    throw new Error(`lang/dir check failed:\n  ${failures.join("\n  ")}`)
  }
}

function collectPages(directory, root = directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      // Storybook is copied in under /components by build:pages; it has its
      // own head check and is English-only.
      if (directory === root && entry.name === "components") return []
      return collectPages(fullPath, root)
    }
    return entry.name.endsWith(".html")
      ? [[path.relative(root, fullPath), readFileSync(fullPath, "utf8")]]
      : []
  })
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ""

if (import.meta.url === invokedPath) {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
  const outputDirectory = path.resolve(scriptDirectory, "../out")
  if (!existsSync(outputDirectory)) {
    throw new Error("apps/docs/out does not exist; run the docs build first")
  }

  const pages = collectPages(outputDirectory)
  verifyHtmlLang(pages)
  console.log(`Verified lang and dir on ${pages.length} exported pages`)
}
