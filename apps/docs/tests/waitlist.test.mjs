import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import path from "node:path"
import { MIN_FILL_MS, cleanEmail, handleWaitlist } from "../lib/waitlist"

// The handler logs one code per call; keep the test output quiet.
console.log = () => {}

const docsRoot = path.resolve(import.meta.dir, "..")
const read = (file) => readFileSync(path.join(docsRoot, file), "utf8")
// A made-up token: the tests never need the real one.
const TOKEN = "test-token-not-real"
const live = {
  LISTMONK_URL: "https://lists.example.test",
  LISTMONK_API_USER: "api-user",
  LISTMONK_API_TOKEN: TOKEN,
  LISTMONK_LIST_ID: "7",
}

const post = (body, headers = {}) =>
  new Request("https://fasla.example.test/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  })
const form = (fields) =>
  new Request("https://fasla.example.test/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields).toString(),
  })

/** A fake Listmonk: records the call and answers as told. */
const fake = (status = 200, message) => {
  const calls = []
  const fetchImpl = async (url, init) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(message ? { message } : { data: {} }), { status })
  }
  return { calls, fetchImpl }
}

const run = async (body, env, fetchImpl, headers) => {
  const res = await handleWaitlist(post(body, headers), env, fetchImpl)
  return { res, body: await res.json() }
}

describe("cleanEmail", () => {
  test("accepts one address, lower-cases the domain", () => {
    expect(cleanEmail("  Noura@Sanad.Example ")).toBe("Noura@sanad.example")
    expect(cleanEmail("a+tag@x.io")).toBe("a+tag@x.io")
  })
  test("rejects what is not one address", () => {
    for (const bad of ["", "no-at", "a@b", "a@@b.co", "a b@c.co", "a@b.co,c@d.co", "a@b.co;c@d.co", "<a@b.co>", "a@.co", "a@b..co", 42, null]) {
      expect(cleanEmail(bad), String(bad)).toBeNull()
    }
    expect(cleanEmail(`${"a".repeat(250)}@b.co`)).toBeNull()
  })
})

describe("the handler", () => {
  test("only POST", async () => {
    const res = await handleWaitlist(new Request("https://fasla.example.test/api/waitlist"), live, fake().fetchImpl)
    expect(res.status).toBe(405)
    expect(res.headers.get("allow")).toBe("POST")
  })

  test("sends Listmonk exactly what the plan says", async () => {
    const { calls, fetchImpl } = fake()
    const { res, body } = await run({ email: "Noura@Sanad.Example", lang: "ar", source: "coming-soon" }, live, fetchImpl)
    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe("https://lists.example.test/api/subscribers")
    expect(calls[0].init.headers.authorization).toBe(`token api-user:${TOKEN}`)
    const sent = JSON.parse(calls[0].init.body)
    // Confirmed at once: no opt-in e-mail. The record is the source, the language and the time.
    expect(sent).toMatchObject({
      email: "Noura@sanad.example",
      name: "Noura",
      status: "enabled",
      lists: [7],
      preconfirm_subscriptions: true,
      attribs: { source: "waitlist-form", page: "coming-soon", lang: "ar" },
    })
    expect(Object.keys(sent.attribs).sort()).toEqual(["lang", "page", "signed_up_at", "source"])
    expect(new Date(sent.attribs.signed_up_at).toISOString()).toBe(sent.attribs.signed_up_at)
    expect(Math.abs(Date.now() - Date.parse(sent.attribs.signed_up_at))).toBeLessThan(5000)
  })

  test("an unknown language or source is replaced by the default", async () => {
    const { calls, fetchImpl } = fake()
    await run({ email: "a@b.co", lang: "fr", source: "elsewhere" }, live, fetchImpl)
    expect(JSON.parse(calls[0].init.body).attribs).toMatchObject({ lang: "en", page: "coming-soon" })
  })

  test("a duplicate answers like a new address", async () => {
    for (const [status, message] of [[409, "E-mail already exists."], [400, "E-mail already exists"]]) {
      const { res, body } = await run({ email: "a@b.co" }, live, fake(status, message).fetchImpl)
      expect(res.status, String(status)).toBe(200)
      expect(body.ok).toBe(true)
    }
  })

  test("an address Listmonk refuses is invalid; other failures fall back", async () => {
    expect((await run({ email: "a@b.co" }, live, fake(422, "Invalid e-mail").fetchImpl)).res.status).toBe(422)
    for (const status of [400, 401, 403, 500, 502]) {
      const out = await run({ email: "a@b.co" }, live, fake(status, "nope").fetchImpl)
      expect(out.res.status, String(status)).toBe(503)
      expect(out.body.error).toBe("fallback")
    }
  })

  test("a network failure falls back", async () => {
    const out = await run({ email: "a@b.co" }, live, async () => {
      throw new Error("down")
    })
    expect(out.res.status).toBe(503)
  })

  test("a missing or unsafe configuration falls back, and calls nothing", async () => {
    const { calls, fetchImpl } = fake()
    for (const env of [
      {},
      { ...live, LISTMONK_API_TOKEN: undefined },
      { ...live, LISTMONK_API_USER: "" },
      { ...live, LISTMONK_LIST_ID: "x" },
      { ...live, LISTMONK_LIST_ID: "0" },
      { ...live, LISTMONK_URL: "http://lists.example.test" },
      { ...live, LISTMONK_URL: "not a url" },
    ]) {
      const out = await run({ email: "a@b.co" }, env, fetchImpl)
      expect(out.res.status, JSON.stringify(Object.keys(env))).toBe(503)
    }
    expect(calls).toHaveLength(0)
  })

  test("http is allowed for a local Listmonk only", async () => {
    const { calls, fetchImpl } = fake()
    const out = await run({ email: "a@b.co" }, { ...live, LISTMONK_URL: "http://localhost:9000/" }, fetchImpl)
    expect(out.res.status).toBe(200)
    expect(calls[0].url).toBe("http://localhost:9000/api/subscribers")
  })

  test("a bad address is invalid and calls nothing", async () => {
    const { calls, fetchImpl } = fake()
    expect((await run({ email: "nope" }, live, fetchImpl)).res.status).toBe(422)
    expect((await run({}, live, fetchImpl)).res.status).toBe(422)
    expect(calls).toHaveLength(0)
  })

  test("the honeypot and a too-fast submit look like success and call nothing", async () => {
    const { calls, fetchImpl } = fake()
    expect((await run({ email: "a@b.co", website: "http://spam" }, live, fetchImpl)).body.ok).toBe(true)
    expect((await run({ email: "a@b.co", t: Date.now() - (MIN_FILL_MS - 1000) }, live, fetchImpl)).body.ok).toBe(true)
    expect(calls).toHaveLength(0)
    // A person who took a while is let through.
    expect((await run({ email: "a@b.co", t: Date.now() - MIN_FILL_MS - 1000 }, live, fetchImpl)).res.status).toBe(200)
    expect(calls).toHaveLength(1)
  })

  test("another site's Origin is refused", async () => {
    const { calls, fetchImpl } = fake()
    const out = await run({ email: "a@b.co" }, live, fetchImpl, { origin: "https://evil.example" })
    expect(out.res.status).toBe(403)
    expect((await run({ email: "a@b.co" }, live, fetchImpl, { origin: "https://fasla.example.test" })).res.status).toBe(200)
    expect(calls).toHaveLength(1)
  })

  test("dry mode checks the address and answers ok without a token or a call", async () => {
    const { calls, fetchImpl } = fake()
    const dry = { WAITLIST_MODE: "dry" }
    expect((await run({ email: "a@b.co" }, dry, fetchImpl)).res.status).toBe(200)
    expect((await run({ email: "nope" }, dry, fetchImpl)).res.status).toBe(422)
    expect(calls).toHaveLength(0)
  })

  test("test mode marks the record so it can be found and deleted", async () => {
    const { calls, fetchImpl } = fake()
    await run({ email: "a@b.co", source: "coming-soon" }, { ...live, WAITLIST_MODE: "test" }, fetchImpl)
    expect(JSON.parse(calls[0].init.body).attribs.source).toBe("preview-test")
  })

  test("a browser form without JavaScript is sent back to the page with the result", async () => {
    const { fetchImpl } = fake()
    const ok = await handleWaitlist(form({ email: "a@b.co", lang: "ar" }), live, fetchImpl)
    expect(ok.status).toBe(303)
    expect(ok.headers.get("location")).toBe("/ar/coming-soon/?waitlist=ok")
    const bad = await handleWaitlist(form({ email: "nope", lang: "en" }), live, fetchImpl)
    expect(bad.headers.get("location")).toBe("/en/coming-soon/?waitlist=invalid")
    const down = await handleWaitlist(form({ email: "a@b.co", lang: "en" }), {}, fetchImpl)
    expect(down.headers.get("location")).toBe("/en/coming-soon/?waitlist=fallback")
  })

  test("the token is never in a response or a log line", async () => {
    const lines = []
    const original = console.log
    console.log = (...args) => lines.push(args.join(" "))
    try {
      const cases = [
        [200],
        [500, "boom"],
        [409, "E-mail already exists"],
      ]
      for (const [status, message] of cases) {
        const res = await handleWaitlist(post({ email: "noura@sanad.example" }), live, fake(status, message).fetchImpl)
        const text = await res.text()
        expect(text).not.toContain(TOKEN)
        expect(text).not.toContain("noura")
      }
      await handleWaitlist(post({ email: "noura@sanad.example" }), live, async () => {
        throw new Error(`failed with ${TOKEN}`)
      })
    } finally {
      console.log = original
    }
    expect(lines.length).toBeGreaterThan(0)
    for (const line of lines) {
      expect(line).toMatch(/^waitlist_[a-z_0-9]+$/)
    }
  })

  test("it answers with no-store, and sets no cookie", async () => {
    const res = await handleWaitlist(post({ email: "a@b.co" }), live, fake().fetchImpl)
    expect(res.headers.get("cache-control")).toBe("no-store")
    expect(res.headers.get("set-cookie")).toBeNull()
  })
})

describe("the files", () => {
  test("the Pages Function is only wiring, at the repository root", () => {
    const file = readFileSync(path.resolve(docsRoot, "../../functions/api/waitlist.ts"), "utf8")
    expect(file).toContain('from "../../apps/docs/lib/waitlist"')
    expect(file).toContain("handleWaitlist(request, env)")
  })

  test("the handler reads only the five names, and imports nothing from the site", () => {
    const src = read("lib/waitlist.ts")
    expect([...new Set(src.match(/\benv\.([A-Z_]+)/g))].sort()).toEqual(
      ["env.LISTMONK_API_TOKEN", "env.LISTMONK_API_USER", "env.LISTMONK_LIST_ID", "env.LISTMONK_URL", "env.WAITLIST_MODE"].sort()
    )
    expect(src).not.toMatch(/from "@\//)
    expect(src).not.toMatch(/set-cookie|localStorage|sessionStorage/i)
  })

  test("the form: no tracking, no cookie, no storage, one request to /api/waitlist", () => {
    const src = read("app/[locale]/(home)/_components/waitlist-form.tsx")
    expect(src).not.toMatch(/document\.cookie|localStorage|sessionStorage|sendBeacon|gtag|analytics|<script/i)
    expect([...src.matchAll(/fetch\(([^,)]+)/g)].map((m) => m[1])).toEqual(['"/api/waitlist"'])
    // A quick submit waits instead of being dropped by the server's too-fast rule.
    expect(src).toContain("MIN_FILL_MS")
    expect(src).toContain('name="website"')
    expect(src).toContain('type="email"')
  })

  test("the page has the form and nothing else to click, and no text under the form", () => {
    const page = read("app/[locale]/(home)/coming-soon/page.tsx")
    expect(page).not.toMatch(/<Button|<Link|ArrowEndIcon/)
    const src = read("app/[locale]/(home)/_components/waitlist-form.tsx")
    // Same size token for the field and the button, the Input's own error, a hidden label.
    expect(src.match(/size="lg"/g)).toHaveLength(2)
    expect(src).toContain("error={error}")
    expect(src).toContain('className="sr-only"')
    expect(src).not.toMatch(/<details|<summary|<dl|notice/)
    expect(src).not.toMatch(/role="alert"|text-destructive/)
  })

  test("the messages: the one-sentence success, the error and fallback texts, nothing else", () => {
    const expected = {
      en: "You're on the list. We'll email you when Fasla Pro opens.",
      ar: "تم تسجيلك. سنراسلك عند إطلاق فاصلة Pro.",
    }
    for (const [lang, ok] of Object.entries(expected)) {
      const { waitlist } = JSON.parse(read(`messages/${lang}.json`)).landing.soon
      expect(waitlist.ok, lang).toBe(ok)
      expect(Object.keys(waitlist).sort(), lang).toEqual(["fallback", "invalid", "label", "ok", "placeholder", "rate", "sending", "submit"])
      expect(JSON.stringify(waitlist), lang).not.toMatch(/@smicolon\.com|datenschutz/)
    }
  })
})
