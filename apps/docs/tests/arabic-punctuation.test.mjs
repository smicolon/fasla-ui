import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/

function strings(value, key = "") {
  if (typeof value === "string") return [[key, value]]
  return Object.entries(value).flatMap(([k, v]) => strings(v, key ? `${key}.${k}` : k))
}

const ar = strings(JSON.parse(readFileSync(path.join(docsRoot, "messages/ar.json"), "utf8")))
const seoRoutes = readFileSync(path.join(docsRoot, "lib/seo-routes.ts"), "utf8")

// Rules from design/content/arabic-writing-guide.md.
describe("Arabic punctuation and spelling", () => {
  // Both are bidi-neutral and break direction inside Arabic text.
  test("uses no em dash or middle dot in any Arabic string", () => {
    const offenders = ar
      .filter(([, message]) => ARABIC.test(message) && /[—·]/.test(message))
      .map(([key, message]) => `${key}: ${message}`)
    const seoLines = seoRoutes
      .split("\n")
      .filter((line) => ARABIC.test(line) && /[—·]/.test(line))

    expect(offenders).toEqual([])
    expect(seoLines).toEqual([])
  })

  // Tanween sits on the letter before the alif: غدًا, not غداً.
  test("puts tanween al-fath before the alif, never on it", () => {
    const offenders = ar
      .filter(([, message]) => /اً/.test(message))
      .map(([key, message]) => `${key}: ${message}`)
    const seoLines = seoRoutes.split("\n").filter((line) => /اً/.test(line))

    expect(offenders).toEqual([])
    expect(seoLines).toEqual([])
  })
})
