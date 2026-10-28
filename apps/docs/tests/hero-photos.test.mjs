import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { HERO_PHOTO_TYPES, heroDemoImages, heroDemoSrcs, heroPhotoProps } from "../components/blocks/hero-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const credits = readFileSync(path.join(docsRoot, "public/images/hero/CREDITS.md"), "utf8")

// The Hero previews and stories show these photos; each one exists, is
// described in both languages and is listed in the folder's CREDITS.md.
describe("Hero demo photos", () => {
  test("exist and have alt text in English and Arabic", () => {
    for (const type of HERO_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        const images = heroDemoImages(type, locale)
        expect(images.length, `${type} (${locale})`).toBeGreaterThan(0)
        for (const image of images) {
          expect(existsSync(path.join(docsRoot, "public", image.src)), image.src).toBe(true)
          // A photo set inside a heading, or beside a printed name, is decorative on purpose: its alt is "".
          const props = heroPhotoProps(type, locale)
          const decorative = Object.values(props).some((value) => value?.src === image.src && value?.alt === "")
          if (!decorative) expect(image.alt.length, `${image.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("are each listed in CREDITS.md", () => {
    for (const type of HERO_PHOTO_TYPES) {
      for (const image of heroDemoImages(type, "en")) expect(credits, image.src).toContain(`\`${path.basename(image.src)}\``)
      for (const src of heroDemoSrcs(type)) {
        expect(existsSync(path.join(docsRoot, "public", src)), src).toBe(true)
        expect(credits, src).toContain(`\`${path.basename(src)}\``)
      }
    }
  })
})
