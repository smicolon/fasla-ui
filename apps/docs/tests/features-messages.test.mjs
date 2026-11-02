import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")

// The Features page reads docs.featuresBlocks. Both languages must hold it
// there, with a name for every family and every Type the page lists, or the
// page prints raw message keys.
describe("docs.featuresBlocks messages", () => {
  for (const locale of ["en", "ar"]) {
    test(`${locale} names the page's copy, every family and every Type`, async () => {
      const { FEATURES_FAMILIES, FEATURES_TYPES } = await import("../lib/blocks")
      const messages = JSON.parse(readFileSync(path.join(docsRoot, `messages/${locale}.json`), "utf8"))
      const block = messages.docs?.featuresBlocks
      expect(block, "docs.featuresBlocks").toBeTruthy()
      for (const key of ["lead", "intro", "filterLabel", "showing"]) expect(typeof block[key], key).toBe("string")
      for (const family of ["all", ...FEATURES_FAMILIES]) expect(typeof block.families?.[family], `families.${family}`).toBe("string")
      for (const type of FEATURES_TYPES) expect(typeof block.types?.[type.slug], `types.${type.slug}`).toBe("string")
      expect(messages.landing?.featuresBlocks, "not nested under landing").toBeUndefined()
    })
  }
})
