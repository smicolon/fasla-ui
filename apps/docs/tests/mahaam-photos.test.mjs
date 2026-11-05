import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { mahaamDemoPhotos } from "../components/blocks/mahaam-photos"

const docsRoot = path.resolve(import.meta.dir, "..")
const credits = readFileSync(path.join(docsRoot, "public/images/mahaam/CREDITS.md"), "utf8")

// The Mahaam stories and previews show these images; each exists and is
// credited in the folder's CREDITS.md. Photographs are never shipped with the
// package: the template's sections take them as props.
describe("Mahaam demo photos", () => {
  const srcs = [
    mahaamDemoPhotos.scene,
    ...Object.values(mahaamDemoPhotos.avatars),
    ...Object.values(mahaamDemoPhotos.portraits),
    ...Object.values(mahaamDemoPhotos.flags),
  ]

  test("exist", () => {
    for (const src of srcs) expect(existsSync(path.join(docsRoot, "public", src)), src).toBe(true)
  })

  test("are each credited, the flags as a group", () => {
    for (const src of srcs.filter((value) => !value.includes("/flags/"))) expect(credits, src).toContain(`\`${path.basename(src)}\``)
    expect(credits).toContain("flags/*.svg")
  })

  test("credit Freepik for Noura and Khalid, and say nothing about a licence still to confirm", () => {
    expect(credits).toContain("Image by Freepik")
    expect(credits.toLowerCase()).not.toContain("to be confirmed")
    expect(credits.toLowerCase()).not.toContain("licence to confirm")
  })
})

describe("Mahaam template pages", () => {
  test("have a docs page, its layout, and a preview route", () => {
    for (const file of [
      "app/[locale]/docs/templates/page.tsx",
      "app/[locale]/docs/templates/layout.tsx",
      "app/[locale]/docs/templates/mahaam/page.tsx",
      "app/[locale]/docs/templates/mahaam/layout.tsx",
      "app/[locale]/templates-preview/mahaam/page.tsx",
    ]) {
      expect(existsSync(path.join(docsRoot, file)), file).toBe(true)
    }
  })

  test("are in the route catalogue, in both languages", async () => {
    const { templateRoutes } = await import("../lib/seo-routes")
    expect(templateRoutes.map((route) => route.path)).toEqual(["/docs/templates/", "/docs/templates/mahaam/"])
    for (const route of templateRoutes) expect(route.ar, route.path).toBeTruthy()
  })

  test("write the motion exception and the credits on the docs page, in both languages", () => {
    for (const locale of ["en", "ar"]) {
      const messages = JSON.parse(readFileSync(path.join(docsRoot, `messages/${locale}.json`), "utf8"))
      const page = messages.docs.mahaamTemplate
      expect(page.motionTitle, locale).toBeTruthy()
      expect(Object.keys(page.motion).sort(), locale).toEqual(["css", "pause", "reduced", "visible"])
      expect(page.credits.freepik, locale).toContain("Freepik")
    }
  })
})
