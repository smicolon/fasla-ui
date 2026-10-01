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

  // A و written flush against a Latin word or a code span renders as a Latin
  // "g" glued to it ("وFocus" reads "gFocus"), so it takes a space:
  // `<code>name</code> و <code>value</code>`, "Figma و Tailwind".
  test("puts a space after every و that precedes Latin or code in ar.json", () => {
    const ar = JSON.parse(readFileSync(path.join(docsRoot, "messages/ar.json"), "utf8"))
    const offenders = strings(ar)
      .filter(([, message]) => /(^|[\s،(>])و(?=<code>|[A-Za-z])/.test(message))
      .map(([key, message]) => `${key}: ${message}`)

    expect(offenders).toEqual([])
  })

  // Between two Latin words or code values, Cairo's standalone و reads as a
  // Latin "g" even with spaces ("cva و tailwind-merge" reads "cva g
  // tailwind-merge"), so the sentence is reworded: "cva مع tailwind-merge",
  // or a list after مثل with Arabic commas.
  test("never puts و between two Latin words or code values in ar.json", () => {
    const ar = JSON.parse(readFileSync(path.join(docsRoot, "messages/ar.json"), "utf8"))
    const latinBefore = /(?:[A-Za-z0-9)\]'"`]|<\/code>)\s*و\s*(?=<code>|[A-Za-z`])/
    const offenders = strings(ar)
      .filter(([, message]) => latinBefore.test(message))
      .map(([key, message]) => `${key}: ${message}`)

    expect(offenders).toEqual([])
  })
})
