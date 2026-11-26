import { describe, expect, test } from "bun:test"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
const ADDRESS = "support@smicolon.com"

// Every source file under these folders, to check the address is written once.
const sources = (dir) =>
  readdirSync(path.join(docsRoot, dir)).flatMap((name) => {
    const file = path.join(dir, name)
    if (statSync(path.join(docsRoot, file)).isDirectory()) return sources(file)
    return /\.(tsx?|mjs|json)$/.test(name) ? [file] : []
  })

// The Coming soon page's "Notify me about Pro" link: a plain mailto to
// support, its subject in the page's language. It is now the fallback of the
// waitlist form (tests/waitlist.test.mjs).
describe("Coming soon: Notify me about Pro", () => {
  test("the address lives in one constant", async () => {
    const { supportEmail, notifyProMailto } = await import("../app/[locale]/(home)/_components/links")
    expect(supportEmail).toBe(ADDRESS)
    expect(notifyProMailto("Fasla Pro: notify me")).toBe("mailto:support@smicolon.com?subject=Fasla%20Pro%3A%20notify%20me")
    const writers = [...sources("app"), ...sources("components"), ...sources("lib"), ...sources("messages")].filter((file) =>
      read(file).includes(ADDRESS)
    )
    expect(writers).toEqual([path.join("app/[locale]/(home)/_components/links.ts")])
  })

  test("the subject is percent-encoded in both languages", async () => {
    const { notifyProMailto } = await import("../app/[locale]/(home)/_components/links")
    for (const file of ["messages/en.json", "messages/ar.json"]) {
      const { notify, notifySubject } = JSON.parse(read(file)).landing.soon
      expect(notify.length, file).toBeGreaterThan(0)
      const href = notifyProMailto(notifySubject)
      expect(href, file).toMatch(/^mailto:support@smicolon\.com\?subject=[A-Za-z0-9%._~!*'()-]+$/)
      expect(decodeURIComponent(href.split("subject=")[1]), file).toBe(notifySubject)
    }
  })

  test("the page shows the waitlist form in that place, and the mailto lives only in the fallback", () => {
    const page = read("app/[locale]/(home)/coming-soon/page.tsx")
    expect(page).toContain('<WaitlistForm source="coming-soon"')
    expect(page).not.toContain("mailto:")
    expect(page).not.toContain("notifyProMailto")
    const form = read("app/[locale]/(home)/_components/waitlist-form.tsx")
    expect(form).toContain('href={notifyProMailto(t("notifySubject"))}')
    expect(form).toContain('{t("notify")}')
    expect(form).not.toContain("mailto:")
  })
})
