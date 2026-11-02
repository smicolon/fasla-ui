import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { FEATURES_PHOTO_FILES, FEATURES_PHOTO_TYPES, featuresPhotos } from "../components/blocks/features-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const images = path.join(docsRoot, "public/images")
const credits = readFileSync(path.join(images, "features/CREDITS.md"), "utf8")

// The Features previews and stories use exactly the photos Figma shows. Each
// exists, is described in both languages, is credited (in features/CREDITS.md
// for the files in that folder, in its own folder's CREDITS.md otherwise), and
// no Type repeats one.
describe("Features demo photos", () => {
  test("every file in public/images/features/ is used by a Type and credited with a photographer", () => {
    const own = readdirSync(path.join(images, "features")).filter((file) => file.endsWith(".webp"))
    expect(own.length).toBeGreaterThan(0)
    const used = new Set(FEATURES_PHOTO_FILES.filter((file) => file.startsWith("features/")).map((file) => `${file.slice("features/".length)}.webp`))
    expect([...used].sort()).toEqual(own.sort())
    for (const file of own) {
      const row = credits.split("\n").find((line) => line.startsWith(`| \`${file}\``))
      expect(row, file).toBeTruthy()
      const cells = row.split("|").map((cell) => cell.trim())
      expect(cells[2], `${file} hash`).toMatch(/^`[0-9a-f]{10}`$/)
      expect(cells[5], `${file} photographer`).toMatch(/^\[.+\]\(https:\/\/unsplash\.com\/@.+\)$/)
      expect(cells[4], `${file} photo`).toMatch(/^\[.+\]\(https:\/\/unsplash\.com\/photos\/.+\)$/)
    }
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

  test("are credited in their own folder when they come from another block", () => {
    for (const file of FEATURES_PHOTO_FILES.filter((file) => !file.startsWith("features/"))) {
      const [folder, name] = file.split("/")
      const folderCredits = readFileSync(path.join(images, folder, "CREDITS.md"), "utf8")
      expect(folderCredits, file).toContain(`\`${name}.webp\``)
    }
  })

  test("are listed against their slot in features/CREDITS.md", () => {
    for (const file of FEATURES_PHOTO_FILES) {
      const name = file.startsWith("features/") ? file.slice("features/".length) : file
      expect(credits, file).toContain(`\`${name}.webp\``)
    }
  })

  test("use no photo that is not in Figma's Features set", () => {
    const hashes = [...credits.matchAll(/`([0-9a-f]{10})`/g)].map((match) => match[1])
    expect(hashes.length).toBeGreaterThanOrEqual(FEATURES_PHOTO_FILES.length)
  })
})
