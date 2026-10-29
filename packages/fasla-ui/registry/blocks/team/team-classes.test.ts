import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

/** `${PREFIX}:class`, `${TABLET}class`, `${PREFIX}group-...`: a class name built from a constant. Units such as `${W}px` are fine. */
const CLASS_FROM_PARTS = /\$\{[A-Z_]+\}(?::[a-z\[-]|group-|hover:|(?!(?:px|ms|rem|em)\b)[a-z\[-])/

const blocks = join(dirname(fileURLToPath(import.meta.url)), "..")

describe("Team class names", () => {
  it("catch the forms that broke Member Table and Hairline", () => {
    expect(CLASS_FROM_PARTS.test("`${TABLET}table-cell ${TABLET}px-2`")).toBe(true)
    expect(CLASS_FROM_PARTS.test("`${PENDING}:scale-y-100`")).toBe(true)
    expect(CLASS_FROM_PARTS.test("calc(${ARROW_W}px * 2)")).toBe(false)
  })

  it("are written out whole: Tailwind only generates classes it can read in the source", () => {
    // `${TABLET}table-cell` or `${PENDING}:scale-y-100` never reaches the stylesheet, so the block silently keeps its phone layout or never animates.
    const found = readdirSync(blocks)
      .filter((name) => name === "team" || name.startsWith("team-"))
      .flatMap((dir) =>
        readdirSync(join(blocks, dir))
          .filter((file) => /\.tsx?$/.test(file) && !/\.test\./.test(file))
          .flatMap((file) =>
            readFileSync(join(blocks, dir, file), "utf8")
              .split("\n")
              .map((line, index) => ({ line, at: `${dir}/${file}:${index + 1}` }))
              .filter(({ line }) => CLASS_FROM_PARTS.test(line))
              .map(({ at }) => at)
          )
      )
    expect(found).toEqual([])
  })
})
