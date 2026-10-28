import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { ABOUT_PHOTO_TYPES, aboutPhotos } from "../components/blocks/about-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const ownDir = path.join(docsRoot, "public/images/about")
const ownFiles = readdirSync(ownDir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(ownDir, "CREDITS.md"), "utf8")

// The About previews and stories show these photos: Gallery's, and the few
// About keeps from Figma. Each exists, is described in both languages, and
// each of About's own files is used and credited.
describe("About demo photos", () => {
  test("use every one of About's own photo files", () => {
    const used = new Set(
      ABOUT_PHOTO_TYPES.flatMap((type) => aboutPhotos(type, "en").map((photo) => photo.src))
        .filter((src) => src.startsWith("/images/about/"))
        .map((src) => path.basename(src))
    )
    expect([...used].sort()).toEqual([...ownFiles].sort())
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of ABOUT_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const photo of aboutPhotos(type, locale)) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
          expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("credit each of About's own files", () => {
    for (const file of ownFiles) expect(credits, file).toContain(`\`${file}\``)
  })
})
