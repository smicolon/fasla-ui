import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { VIDEO_CALL_PHOTO_TYPES, videoCallPeople, videoCallPhoto } from "../components/blocks/video-call-photos"

const docsRoot = path.resolve(import.meta.dir, "..")

// Every face the Video Call blocks show carries its own focal point, so a tile of any shape crops around the face. The two
// recordings' stills are scenes, not people, and carry none.
describe("Video Call demo photos", () => {
  test("every person has a file that exists and a focal point as `x% y%`", () => {
    for (const locale of ["en", "ar"]) {
      for (const [id, photo] of Object.entries(videoCallPeople(locale))) {
        expect(existsSync(path.join(docsRoot, "public", photo.src)), `${id}: ${photo.src}`).toBe(true)
        expect(photo.position, id).toMatch(/^\d{1,3}% \d{1,3}%$/)
      }
    }
  })

  test("a file has one focal point wherever it is used", () => {
    const positions = new Map()
    for (const photo of Object.values(videoCallPeople("en"))) positions.set(photo.src, photo.position)
    for (const type of VIDEO_CALL_PHOTO_TYPES) {
      const photo = videoCallPhoto(type, "en")
      if (positions.has(photo.src)) expect(photo.position, `${type}: ${photo.src}`).toBe(positions.get(photo.src))
    }
  })

  test("no photo is used by two different people; Adam and the Captions speaker are one person and share one", () => {
    const owners = new Map()
    for (const [id, photo] of Object.entries(videoCallPeople("en"))) {
      expect(owners.has(photo.src), `${id} shares ${photo.src} with ${owners.get(photo.src)}`).toBe(false)
      owners.set(photo.src, id)
    }
    // The Captions speaker is Adam Farouk in the copy, so the stage shows Adam's photo.
    const captions = videoCallPhoto("captions-reactions", "en")
    expect(owners.get(captions.src)).toBe("adam")
    expect(videoCallPhoto("captions-reactions", "ar").src).toBe(captions.src)
  })

  test("the Pre-Join camera still is its own file, used by nobody else", () => {
    const owners = new Set(Object.values(videoCallPeople("en")).map((photo) => photo.src))
    const camera = videoCallPhoto("pre-join-lobby", "en").src
    expect(owners.has(camera)).toBe(false)
    expect(camera).not.toBe(videoCallPhoto("captions-reactions", "en").src)
  })

  test("a person keeps the same photo and alt text pair in both languages", () => {
    const en = videoCallPeople("en"), ar = videoCallPeople("ar")
    for (const id of Object.keys(en)) {
      expect(ar[id].src, id).toBe(en[id].src)
      expect(ar[id].position, id).toBe(en[id].position)
      expect(ar[id].alt, id).not.toBe(en[id].alt)
    }
  })

  test("Video Call's own photos are used, credited and sized like the other photo sets", () => {
    const dir = path.join(docsRoot, "public/images/video-call")
    const files = readdirSync(dir).filter((file) => file.endsWith(".webp"))
    const credits = readFileSync(path.join(dir, "CREDITS.md"), "utf8")
    const used = new Set()
    for (const locale of ["en", "ar"]) {
      for (const photo of [...Object.values(videoCallPeople(locale)), ...VIDEO_CALL_PHOTO_TYPES.map((type) => videoCallPhoto(type, locale))]) {
        if (photo.src.startsWith("/images/video-call/")) used.add(path.basename(photo.src))
      }
    }
    expect([...used].sort()).toEqual([...files].sort())
    for (const file of files) {
      expect(credits, file).toContain(`\`${file}\``)
      expect(readFileSync(path.join(dir, file)).subarray(0, 4).toString("latin1"), file).toBe("RIFF")
    }
    expect(credits).toContain("Unsplash License")
    expect(credits).toContain("7uoMmzPd2JA")
    expect(credits).toContain("BKqjDo3r4UA")
  })

  test("the recordings' stills are left centred", () => {
    expect(videoCallPhoto("call-ended-summary", "en").position).toBeUndefined()
    expect(videoCallPhoto("ai-meeting-recap", "en").position).toBeUndefined()
  })

  test("the Pre-Join and Captions stills have faces, so they have focal points", () => {
    expect(videoCallPhoto("pre-join-lobby", "ar").position).toBeDefined()
    expect(videoCallPhoto("captions-reactions", "ar").position).toBeDefined()
  })
})
