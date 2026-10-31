import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { HOW_IT_WORKS_PHOTO_FILES, HOW_IT_WORKS_PHOTO_TYPES, howItWorksPhotos } from "../components/blocks/how-it-works-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const ownDir = path.join(docsRoot, "public/images/how-it-works")
const ownFiles = readdirSync(ownDir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(ownDir, "CREDITS.md"), "utf8")

// The How it Works previews and stories show these photos. Each exists, is
// described in both languages, is used by a Type, and is credited.
describe("How it Works demo photos", () => {
  test("use every photo file in the folder, and no other", () => {
    const used = new Set(
      HOW_IT_WORKS_PHOTO_TYPES.flatMap((type) => howItWorksPhotos(type, "en").map((photo) => path.basename(photo.src)))
    )
    expect([...used].sort()).toEqual([...ownFiles].sort())
    expect(HOW_IT_WORKS_PHOTO_FILES.length).toBe(ownFiles.length)
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of HOW_IT_WORKS_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        for (const photo of howItWorksPhotos(type, locale)) {
          expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
          expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
        }
      }
    }
  })

  test("credit each file", () => {
    for (const file of ownFiles) expect(credits, file).toContain(`\`${file}\``)
  })
})
