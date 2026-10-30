import { describe, expect, test } from "bun:test"
import { existsSync } from "node:fs"
import path from "node:path"
import { VIDEO_CALL_PHOTO_TYPES, videoCallPhoto } from "../components/blocks/video-call-photos"

const docsRoot = path.resolve(import.meta.dir, "..")

// The Video Call previews and stories show photos the repo already has. Each
// exists and is described in both languages.
describe("Video Call demo photos", () => {
  test("exist, with alt text in English and Arabic", () => {
    for (const type of VIDEO_CALL_PHOTO_TYPES) {
      for (const locale of ["en", "ar"]) {
        const photo = videoCallPhoto(type, locale)
        expect(existsSync(path.join(docsRoot, "public", photo.src)), photo.src).toBe(true)
        expect(photo.alt.length, `${photo.src} (${locale})`).toBeGreaterThan(0)
      }
    }
  })

  test("bring no new file: every photo is already in the repo", () => {
    for (const type of VIDEO_CALL_PHOTO_TYPES) {
      expect(videoCallPhoto(type, "en").src.startsWith("/images/video-call/")).toBe(false)
    }
  })
})
