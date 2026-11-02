import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { FOOTER_PHOTO_TYPES, footerPhotoFiles, footerPhotoProps, footerPhotos } from "../components/blocks/footer-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const ownDir = path.join(docsRoot, "public/images/footer")
const ownFiles = readdirSync(ownDir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(ownDir, "CREDITS.md"), "utf8")

// The Footer previews and stories show these photos: Footer's own, and the one
// Hero file it shares. Each exists, is described in both languages, and each of
// Footer's own files is used and credited.
describe("Footer demo photos", () => {
  test("use every one of Footer's own photo files", () => {
    const used = new Set(footerPhotoFiles().filter((src) => src.startsWith("/images/footer/")).map((src) => path.basename(src)))
    expect([...used].sort()).toEqual([...ownFiles].sort())
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of FOOTER_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const [slot, photo] of Object.entries(footerPhotos(type, locale))) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), `${type}/${slot}`).toBe(true)
          expect(photo.alt.length, `${type}/${slot} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("credit each of Footer's own files, and flag the one with an unknown source", () => {
    for (const file of ownFiles) expect(credits, file).toContain(`\`${file}\``)
    expect(credits).toContain("Source unknown")
  })

  test("hand each Type its photos under the prop its block names, and nothing to the rest", () => {
    const copy = { en: { offices: [{ city: "A" }, { city: "B" }] }, ar: { offices: [{ city: "أ" }, { city: "ب" }] } }
    expect(footerPhotoProps("contact-first", "en", copy).offices).toHaveLength(2)
    expect(footerPhotoProps("image-backed-brand", "en", copy)).toHaveProperty("background")
    expect(footerPhotoProps("careers-culture", "ar", copy)).toHaveProperty("team")
    expect(footerPhotoProps("local-business", "en", copy)).toHaveProperty("map")
    expect(footerPhotoProps("four-column-directory", "en", copy)).toEqual({})
  })

  test("never show a photo in Arabic that differs from English, only its description", () => {
    for (const type of FOOTER_PHOTO_TYPES) {
      const en = footerPhotos(type, "en"), ar = footerPhotos(type, "ar")
      for (const slot of Object.keys(en)) expect(ar[slot].src).toBe(en[slot].src)
    }
  })
})
