import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/

function strings(value, key = "") {
  if (typeof value === "string") return [[key, value]]
  return Object.entries(value).flatMap(([k, v]) => strings(v, key ? `${key}.${k}` : k))
}

describe("Arabic and inline code", () => {
  // A code span is an isolated LTR run in the code font. Arabic inside it,
  // even a single و, is set in the wrong face and reordered, so the Arabic
  // stays outside the span: `<code>name</code> و<code>value</code>`.
  test("keeps Arabic letters out of every <code> span in ar.json", () => {
    const ar = JSON.parse(readFileSync(path.join(docsRoot, "messages/ar.json"), "utf8"))
    const offenders = strings(ar).flatMap(([key, message]) =>
      [...message.matchAll(/<code>(.*?)<\/code>/g)]
        .filter(([, inner]) => ARABIC.test(inner))
        .map(([span]) => `${key}: ${span}`)
    )

    expect(offenders).toEqual([])
  })
})
