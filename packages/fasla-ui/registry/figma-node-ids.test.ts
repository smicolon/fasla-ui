// @vitest-environment node
import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"

const roots = [__dirname, resolve(__dirname, "../../../apps/storybook/stories")]
const repo = resolve(__dirname, "../../..")

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return files(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

// A Figma node id, as `307:333` or `46207:243282`. A clock time (`09:00`,
// two digits each side) is not one.
const NODE_ID = /(?<![\d:])(?!\d{2}:\d{2}(?!\d))\d{2,6}:\d{2,7}(?![\d:])/g

describe("registry and story comments", () => {
  it("name Figma sets without their node ids, which mean nothing outside the design file", () => {
    const found = roots.flatMap(files).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, i) => (line.match(NODE_ID) ?? []).map((id) => `${relative(repo, file)}:${i + 1} ${id}`))
    )
    expect(found).toEqual([])
  })
})
