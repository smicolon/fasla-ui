// @vitest-environment node
import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import ts from "typescript"

const registry = __dirname

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx$/.test(entry.name) && !/\.(test|stories)\.tsx$/.test(entry.name) ? [path] : []
  })
}

/*
 * When shadcn installs a file into a project on one of its base-* styles
 * (base-nova and others, Base UI), it rewrites every element that has an
 * `asChild` attribute and children: the attribute becomes Base UI's `render`
 * prop when the first child is an element, and is removed when it isn't. Fasla's
 * Button is not Base UI's and has no `render` prop, so either way the element
 * changes: Pagination's links rendered as a <button> around an <a>. A
 * self-closing element, or asChild passed in a spread, is left as it is.
 */
function asChildAttributesShadcnRewrites(file: string): string[] {
  const text = readFileSync(file, "utf8")
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const found: string[] = []
  const visit = (node: ts.Node) => {
    if (ts.isJsxElement(node)) {
      const attribute = node.openingElement.attributes.properties.find(
        (p) => ts.isJsxAttribute(p) && p.name.getText(source) === "asChild"
      )
      if (attribute) {
        const line = source.getLineAndCharacterOfPosition(attribute.getStart(source)).line + 1
        found.push(`${relative(registry, file)}:${line} <${node.openingElement.tagName.getText(source)} asChild>`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return found
}

describe("registry files under shadcn's base-* styles", () => {
  it("have no asChild attribute on an element with children, which shadcn would rewrite", () => {
    expect(sourceFiles(registry).flatMap(asChildAttributesShadcnRewrites)).toEqual([])
  })
})
