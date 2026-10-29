import { describe, expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { CAREERS_PHOTO_TYPES, careersPhoto } from "../components/blocks/careers-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const ownDir = path.join(docsRoot, "public/images/careers")
const ownFiles = readdirSync(ownDir).filter((file) => file.endsWith(".webp"))
const credits = readFileSync(path.join(ownDir, "CREDITS.md"), "utf8")

// The Careers previews and stories show these photos: Careers' own, and the
// Hero files it shares. Each exists, is described in both languages, and each
// of Careers' own files is used and credited.
describe("Careers demo photos", () => {
  test("use every one of Careers' own photo files", () => {
    const used = new Set(
      CAREERS_PHOTO_TYPES.map((type) => careersPhoto(type, "en").src)
        .filter((src) => src.startsWith("/images/careers/"))
        .map((src) => path.basename(src))
    )
    expect([...used].sort()).toEqual([...ownFiles].sort())
  })

  test("exist, with alt text in English and Arabic", () => {
    for (const type of CAREERS_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        const photo = careersPhoto(type, locale)
        expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
        expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
      }
    }
  })

  test("credit each of Careers' own files", () => {
    for (const file of ownFiles) expect(credits, file).toContain(`\`${file}\``)
  })
})
