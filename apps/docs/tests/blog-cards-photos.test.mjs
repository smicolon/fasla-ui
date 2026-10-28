import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { BLOG_CARDS_PHOTO_COUNT, BLOG_CARDS_PHOTO_TYPES, blogCardsPhotos } from "../components/blocks/blog-cards-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const dir = path.join(docsRoot, "public/images/blog-cards")
const files = readdirSync(dir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(dir, "CREDITS.md"), "utf8")

// The Blog Cards previews and stories show these 16 Unsplash photos. Each
// exists, is described in both languages, is used by some Type, and is credited.
describe("Blog Cards demo photos", () => {
  test("has the 16 photos, each used by at least one Type", () => {
    expect(files).toHaveLength(BLOG_CARDS_PHOTO_COUNT)
    const used = new Set(
      BLOG_CARDS_PHOTO_TYPES.flatMap((type) => blogCardsPhotos(type, "en").map((photo) => path.basename(photo.src)))
    )
    expect([...used].sort()).toEqual([...files].sort())
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of BLOG_CARDS_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const photo of blogCardsPhotos(type, locale)) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
          expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("credit every file with a photographer", () => {
    for (const file of files) {
      const row = credits.split("\n").find((line) => line.includes(`\`${file}\``))
      expect(row, file).toBeTruthy()
      expect(row.split("|")[3].trim().length, file).toBeGreaterThan(0)
    }
  })
})
