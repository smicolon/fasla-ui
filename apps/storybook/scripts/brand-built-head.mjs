import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const title = "SMI-UI Component Explorer | Smicolon"

export function brandManagerHtml(html) {
  const titles = html.match(/<title>[\s\S]*?<\/title>/gi) ?? []

  if (titles.length === 0) {
    throw new Error("Built Storybook manager is missing a title element")
  }

  const withoutTitles = html.replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
  return withoutTitles.replace("</head>", `    <title>${title}</title>\n  </head>`)
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : ""

if (import.meta.url === invokedPath) {
  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
  const managerPath = path.resolve(scriptDirectory, "../storybook-static/index.html")
  const brandedHtml = brandManagerHtml(readFileSync(managerPath, "utf8"))

  writeFileSync(managerPath, brandedHtml)
  console.log("Branded built Storybook manager head")
}
