import { describe, expect, test } from "bun:test"
import { existsSync } from "node:fs"
import path from "node:path"
import { VIDEO_CALL_PHOTO_TYPES, videoCallPeople, videoCallPhoto, videoCallPhotoProps } from "../components/blocks/video-call-photos"

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

  test("give every person on a call stage a photo that exists, described in both languages, from files the repo already has", () => {
    for (const locale of ["en", "ar"]) {
      const people = videoCallPeople(locale)
      expect(Object.keys(people).length).toBeGreaterThanOrEqual(9)
      for (const [id, photo] of Object.entries(people)) {
        expect(existsSync(path.join(docsRoot, "public", photo.src)), `${id}: ${photo.src}`).toBe(true)
        expect(photo.alt.length, `${id} (${locale})`).toBeGreaterThan(0)
        expect(photo.src.startsWith("/images/video-call/")).toBe(false)
      }
    }
  })

  test("hand the people to the four call-stage Types as `photos`, and nothing to the rest", () => {
    for (const type of ["grid-gallery-call", "speaker-filmstrip", "screen-share-stage", "call-with-side-panel"]) {
      expect(videoCallPhotoProps(type, "en")).toHaveProperty("photos")
    }
    expect(videoCallPhotoProps("call-controls-dock", "en")).toEqual({})
  })
})
