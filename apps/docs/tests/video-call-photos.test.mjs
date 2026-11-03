import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { VIDEO_CALL_PHOTO_TYPES, videoCallPeople, videoCallPersonPhotos, videoCallPhoto, videoCallPhotoProps } from "../components/blocks/video-call-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const LOCALES = ["en", "ar"]
const allPhotos = (locale) => [
  ...Object.entries(videoCallPersonPhotos(locale)).flatMap(([id, photos]) => photos.map((photo) => [id, photo])),
  ...VIDEO_CALL_PHOTO_TYPES.map((type) => [type, videoCallPhoto(type, locale)]),
]

// The photos follow Figma tile by tile. Every face the Video Call blocks show carries its own focal point, so a tile of any
// shape crops the way Figma's fill does. A person has one photo in every Type, except where Figma gives a person two (Adam).
describe("Video Call demo photos", () => {
  test("every photo is a file that exists and has a focal point as `x% y%`", () => {
    for (const locale of LOCALES) {
      for (const [id, photo] of allPhotos(locale)) {
        expect(existsSync(path.join(docsRoot, "public", photo.src)), `${id}: ${photo.src}`).toBe(true)
        expect(photo.position, `${id}: ${photo.src}`).toMatch(/^\d{1,3}% \d{1,3}%$/)
      }
    }
  })

  test("a file has one focal point wherever it is used", () => {
    const positions = new Map()
    for (const [id, photo] of allPhotos("en")) {
      if (positions.has(photo.src)) expect(photo.position, `${id}: ${photo.src}`).toBe(positions.get(photo.src))
      positions.set(photo.src, photo.position)
    }
  })

  test("no photo is used by two different people", () => {
    const owners = new Map()
    for (const [id, photos] of Object.entries(videoCallPersonPhotos("en"))) {
      for (const photo of photos) {
        expect(owners.has(photo.src) && owners.get(photo.src) !== id, `${id} shares ${photo.src} with ${owners.get(photo.src)}`).toBe(false)
        owners.set(photo.src, id)
      }
    }
  })

  test("only Adam has two photos, as in Figma: a close-up everywhere and the cafe photo in the Speaker tile", () => {
    const multi = Object.entries(videoCallPersonPhotos("en")).filter(([, photos]) => photos.length > 1)
    expect(multi.map(([id]) => id)).toEqual(["adam"])
    expect(videoCallPeople("en").adam.src).toBe("/blocks/team/portrait-karim-haddad.webp")
    expect(videoCallPeople("en", "speaker-filmstrip").adam.src).toBe("/images/video-call/cafe-bar-man.webp")
    expect(videoCallPhotoProps("speaker-filmstrip", "en").photos.adam.src).toBe("/images/video-call/cafe-bar-man.webp")
    expect(videoCallPhotoProps("call-with-side-panel", "en").photos.adam.src).toBe("/blocks/team/portrait-karim-haddad.webp")
  })

  test("the Captions speaker is Adam, so it is his cafe photo, and so are both recording thumbnails", () => {
    const cafe = "/images/video-call/cafe-bar-man.webp"
    expect(videoCallPhoto("captions-reactions", "en").src).toBe(cafe)
    expect(videoCallPhoto("captions-reactions", "ar").src).toBe(cafe)
    expect(videoCallPhoto("call-ended-summary", "en").src).toBe(cafe)
    expect(videoCallPhoto("ai-meeting-recap", "en").src).toBe(cafe)
    expect(videoCallPersonPhotos("en").adam.map((photo) => photo.src)).toContain(cafe)
  })

  test("the Pre-Join camera still is its own file, used by nobody else", () => {
    const camera = videoCallPhoto("pre-join-lobby", "en").src
    for (const photos of Object.values(videoCallPersonPhotos("en"))) expect(photos.map((photo) => photo.src)).not.toContain(camera)
    expect(camera).not.toBe(videoCallPhoto("captions-reactions", "en").src)
  })

  test("a person keeps the same photos and positions in both languages", () => {
    const en = videoCallPersonPhotos("en"), ar = videoCallPersonPhotos("ar")
    for (const id of Object.keys(en)) {
      expect(ar[id].map((photo) => [photo.src, photo.position]), id).toEqual(en[id].map((photo) => [photo.src, photo.position]))
      expect(ar[id].map((photo) => photo.alt), id).not.toEqual(en[id].map((photo) => photo.alt))
    }
  })

  test("every person in the call is a man: no alt text describes a woman", () => {
    for (const locale of LOCALES) {
      for (const [id, photo] of allPhotos(locale)) {
        expect(photo.alt, `${id} (${locale})`).not.toMatch(/\bwoman\b|\bwomen\b|\bher\b|امرأة|سيدة/i)
      }
    }
  })

  test("Video Call's own photos are used, credited and sized like the other photo sets", () => {
    const dir = path.join(docsRoot, "public/images/video-call")
    const files = readdirSync(dir).filter((file) => file.endsWith(".webp"))
    const credits = readFileSync(path.join(dir, "CREDITS.md"), "utf8")
    const used = new Set()
    for (const locale of LOCALES) {
      for (const [, photo] of allPhotos(locale)) if (photo.src.startsWith("/images/video-call/")) used.add(path.basename(photo.src))
    }
    expect([...used].sort()).toEqual([...files].sort())
    for (const file of files) {
      expect(credits, file).toContain(`\`${file}\``)
      expect(readFileSync(path.join(dir, file)).subarray(0, 4).toString("latin1"), file).toBe("RIFF")
    }
    expect(credits).toContain("Unsplash License")
    for (const id of ["7uoMmzPd2JA", "BKqjDo3r4UA", "pAtA8xe_iVM"]) expect(credits).toContain(id)
  })
})
