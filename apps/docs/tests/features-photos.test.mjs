import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { FEATURES_PHOTO_FILES, FEATURES_PHOTO_TYPES, featuresPhotos } from "../components/blocks/features-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const images = path.join(docsRoot, "public/images")
const credits = readFileSync(path.join(images, "features/CREDITS.md"), "utf8")

// The Features previews and stories add no photo files: every slot uses a
// photo committed for the Hero, Blog Cards, Gallery or About blocks. Each
// exists, is described in both languages, is credited in its own folder, and
// is listed against its slot in features/CREDITS.md.
describe("Features demo photos", () => {
  test("add no image files to public/images/features/", () => {
    const files = readdirSyncSafe(path.join(images, "features"))
    expect(files.filter((file) => /\.(webp|png|jpe?g|svg)$/.test(file))).toEqual([])
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of FEATURES_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const photo of featuresPhotos(type, locale)) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
          expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("never repeat a photo inside one Type", () => {
    for (const type of FEATURES_PHOTO_TYPES) {
      const srcs = featuresPhotos(type, "en").map((photo) => photo.src)
      expect(new Set(srcs).size, type).toBe(srcs.length)
    }
  })

  test("are credited in their own folder", () => {
    for (const file of FEATURES_PHOTO_FILES) {
      const [folder, name] = file.split("/")
      const folderCredits = readFileSync(path.join(images, folder, "CREDITS.md"), "utf8")
      expect(folderCredits, file).toContain(`\`${name}.webp\``)
    }
  })

  test("are listed against their slot in features/CREDITS.md", () => {
    for (const type of FEATURES_PHOTO_TYPES) {
      for (const photo of featuresPhotos(type, "en")) {
        const name = path.relative("/images", photo.src)
        expect(credits, `${type}: ${name}`).toContain(`\`${name}\``)
      }
    }
  })
})

function readdirSyncSafe(dir) {
  const { readdirSync } = require("node:fs")
  return readdirSync(dir)
}
