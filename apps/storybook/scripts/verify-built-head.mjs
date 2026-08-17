import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const title = "SMI-UI Component Explorer | Smicolon"
const canonical = "https://ui.smicolon.com/components/"

function requireMarkup(html, markup, label) {
  if (!html.includes(markup)) {
    throw new Error(`Missing ${label} in built Storybook head`)
  }
}

export function verifyBuiltHead(managerHtml, previewHtml) {
  const titles = managerHtml.match(/<title>/g) ?? []

  if (titles.length !== 1) {
    throw new Error(`Expected one manager title, found ${titles.length}`)
  }

  requireMarkup(managerHtml, `<title>${title}</title>`, "manager title")
  requireMarkup(managerHtml, 'name="description"', "manager description")
  requireMarkup(
    managerHtml,
    `rel="canonical" href="${canonical}"`,
    "manager canonical"
  )
  requireMarkup(managerHtml, 'property="og:title"', "manager Open Graph title")
  requireMarkup(managerHtml, 'name="twitter:card"', "manager Twitter card")
  requireMarkup(
    previewHtml,
    'name="robots" content="noindex,follow"',
    "preview robots"
  )

  if (previewHtml.includes('rel="canonical"')) {
    throw new Error("Preview HTML must not declare a canonical landing page")
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ""

if (import.meta.url === invokedPath) {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
  const outputDirectory = path.resolve(scriptDirectory, "../storybook-static")
  const managerHtml = readFileSync(path.join(outputDirectory, "index.html"), "utf8")
  const previewHtml = readFileSync(path.join(outputDirectory, "iframe.html"), "utf8")

  verifyBuiltHead(managerHtml, previewHtml)
  console.log("Verified built Storybook manager and preview heads")
}
