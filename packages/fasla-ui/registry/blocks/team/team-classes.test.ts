import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const blocks = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("Team class names", () => {
  it("are written out whole: Tailwind only generates classes it can read in the source", () => {
    // `${TABLET}table-cell` never reaches the stylesheet, so the block silently keeps its phone layout.
    const found = readdirSync(blocks)
      .filter((name) => name === "team" || name.startsWith("team-"))
      .flatMap((dir) =>
        readdirSync(join(blocks, dir))
          .filter((file) => /\.tsx?$/.test(file) && !/\.test\./.test(file))
          .flatMap((file) =>
            readFileSync(join(blocks, dir, file), "utf8")
              .split("\n")
              .map((line, index) => ({ line, at: `${dir}/${file}:${index + 1}` }))
              .filter(({ line }) => /\$\{[A-Z_]+\}(?:[a-z\[-]|group-|hover:)/.test(line) && /class|cn\(|"[^"]*\$\{/.test(line) && !/style=|\bpx\b|ms\b|%/.test(line))
              .map(({ at }) => at)
          )
      )
    expect(found).toEqual([])
  })
})
