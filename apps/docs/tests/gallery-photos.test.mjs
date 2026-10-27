import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { GALLERY_PHOTO_TYPES, galleryPhotos } from "../components/blocks/gallery-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const photosDir = path.join(docsRoot, "public/images/gallery")
const files = readdirSync(photosDir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(photosDir, "CREDITS.md"), "utf8")

// The Gallery previews and stories show these photos; each one is credited,
// described in both languages, and used by exactly one slot.
describe("Gallery demo photos", () => {
  test("cover every photo file, once", () => {
    const used = GALLERY_PHOTO_TYPES.flatMap((type) => galleryPhotos(type, "en").map((photo) => path.basename(photo.src)))
    expect(used.sort()).toEqual([...files].sort())
  })

  test("have alt text in English and Arabic", () => {
    for (const type of GALLERY_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const photo of galleryPhotos(type, locale)) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
          expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("are each credited", () => {
    for (const file of files) expect(credits, file).toContain(`\`${file}\``)
  })
})
