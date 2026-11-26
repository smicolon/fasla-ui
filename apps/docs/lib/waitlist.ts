/**
 * The Fasla Pro waitlist, server side: one pure handler that the Cloudflare
 * Pages Function (functions/api/waitlist.ts) wires to its environment.
 *
 * It takes an e-mail address and adds it to one Listmonk list as an already
 * confirmed subscriber (a decision of the product owner: no confirmation
 * e-mail is sent). The record of the sign-up is its source, the page language
 * and the date and time, in the subscriber's attributes: no IP, no tracking.
 * The API token lives only in the Function's environment; it is never in a response, a
 * log line or the page.
 *
 * No imports from the site (no "@/" paths): Cloudflare bundles this file on
 * its own. No cookies, no tracking, nothing about the person is logged.
 */

/** Everything the handler reads from the Function's environment. Names only here, values in Cloudflare. */
export type WaitlistEnv = {
  LISTMONK_URL?: string
  LISTMONK_API_USER?: string
  LISTMONK_API_TOKEN?: string
  /** The numeric id of the "Fasla Pro" list. */
  LISTMONK_LIST_ID?: string
  /**
   * "dry": check the form and answer ok without calling Listmonk (local runs and
   * every preview deployment). "test": a real call, the record marked
   * `preview-test` so it can be found and deleted. Anything else: live.
   */
  WAITLIST_MODE?: string
}

export type WaitlistFetch = (url: string, init: RequestInit) => Promise<Response>

/** A submit sooner than this after the page was ready is a script, not a person. */
export const MIN_FILL_MS = 3000
/** How long we wait for Listmonk before the form falls back to the mailto link. */
export const LISTMONK_TIMEOUT_MS = 5000

export type WaitlistOutcome = "ok" | "invalid" | "rate" | "fallback"

const SOURCES = ["coming-soon", "install-page"] as const
const LANGS = ["en", "ar"] as const

const BAD_CHARS = String.raw`\s@,;<>()"\\`
const EMAIL = new RegExp(`^[^${BAD_CHARS}]{1,64}@[^${BAD_CHARS}]+\\.[^${BAD_CHARS}]{2,}$`)

/** Trimmed, domain lower-cased, or null when it does not look like one address. */
export function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const email = value.trim()
  if (email.length === 0 || email.length > 254 || !EMAIL.test(email)) return null
  const at = email.lastIndexOf("@")
  const domain = email.slice(at + 1)
  if (domain.includes("..") || domain.startsWith(".") || domain.endsWith(".")) return null
  return `${email.slice(0, at)}@${domain.toLowerCase()}`
}

const json = (status: number, outcome: WaitlistOutcome | "method"): Response =>
  new Response(JSON.stringify({ ok: outcome === "ok", error: outcome === "ok" ? undefined : outcome }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  })

const STATUS: Record<WaitlistOutcome, number> = { ok: 200, invalid: 422, rate: 429, fallback: 503 }

/** What a person without JavaScript gets back: the page again, with the result in the address. */
function answer(outcome: WaitlistOutcome, browserForm: boolean, lang: string): Response {
  if (!browserForm) return json(STATUS[outcome], outcome)
  return new Response(null, {
    status: 303,
    headers: { location: `/${lang}/coming-soon/?waitlist=${outcome}`, "cache-control": "no-store" },
  })
}

/** Only the code goes to the log: never the address, the token, the IP or what Listmonk said. */
const log = (code: string) => console.log(`waitlist_${code}`)

const isLocalHost = (host: string) => host === "localhost" || host === "127.0.0.1" || host === "[::1]"

/** The Listmonk address without a trailing slash, or null when it is missing or not https (localhost may use http). */
function listmonkBase(raw: string | undefined): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:" && !(url.protocol === "http:" && isLocalHost(url.hostname))) return null
    return url.origin
  } catch {
    return null
  }
}

async function readBody(request: Request): Promise<{ fields: Record<string, unknown>; browserForm: boolean } | null> {
  const type = request.headers.get("content-type") ?? ""
  try {
    if (type.includes("application/json")) {
      const body = await request.json()
      return body && typeof body === "object" ? { fields: body as Record<string, unknown>, browserForm: false } : null
    }
    if (type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data")) {
      const data = await request.formData()
      return { fields: Object.fromEntries(data.entries()), browserForm: true }
    }
  } catch {
    return null
  }
  return null
}

/** Listmonk says the address is already there. The docs name no code, so 409 and its message are both accepted. */
const isDuplicate = (status: number, message: string) => status === 409 || /already exists/i.test(message)

export async function handleWaitlist(
  request: Request,
  env: WaitlistEnv,
  fetchImpl: WaitlistFetch = (url, init) => fetch(url, init)
): Promise<Response> {
  if (request.method !== "POST") {
    const res = json(405, "method")
    res.headers.set("allow", "POST")
    return res
  }

  // Same site only. A missing Origin (a plain form post from some clients) is allowed.
  const origin = request.headers.get("origin")
  if (origin) {
    let same = false
    try {
      same = new URL(origin).host === new URL(request.url).host
    } catch {}
    if (!same) return json(403, "fallback")
  }

  const body = await readBody(request)
  if (!body) return json(400, "invalid")
  const { fields, browserForm } = body
  const lang = (LANGS as readonly unknown[]).includes(fields.lang) ? (fields.lang as string) : "en"
  const source = (SOURCES as readonly unknown[]).includes(fields.source) ? (fields.source as string) : "coming-soon"
  const reply = (outcome: WaitlistOutcome) => answer(outcome, browserForm, lang)

  // Bots: a filled honeypot, or a submit faster than a person can type. Answered like a success, and dropped.
  const stamp = Number(fields.t)
  const tooFast = Number.isFinite(stamp) && stamp > 0 && Date.now() - stamp < MIN_FILL_MS
  if ((typeof fields.website === "string" && fields.website !== "") || tooFast) {
    log("dropped")
    return reply("ok")
  }

  const email = cleanEmail(fields.email)
  if (!email) return reply("invalid")

  if (env.WAITLIST_MODE === "dry") {
    log("dry")
    return reply("ok")
  }

  const base = listmonkBase(env.LISTMONK_URL)
  const listId = Number(env.LISTMONK_LIST_ID)
  if (!base || !env.LISTMONK_API_USER || !env.LISTMONK_API_TOKEN || !Number.isInteger(listId) || listId <= 0) {
    log("not_configured")
    return reply("fallback")
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LISTMONK_TIMEOUT_MS)
  try {
    const res = await fetchImpl(`${base}/api/subscribers`, {
      method: "POST",
      headers: {
        authorization: `token ${env.LISTMONK_API_USER}:${env.LISTMONK_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        name: email.slice(0, email.lastIndexOf("@")).slice(0, 60),
        status: "enabled",
        lists: [listId],
        // true: the subscription is confirmed at once and Listmonk sends no opt-in e-mail.
        preconfirm_subscriptions: true,
        attribs: {
          source: env.WAITLIST_MODE === "test" ? "preview-test" : "waitlist-form",
          page: source,
          lang,
          signed_up_at: new Date().toISOString(),
        },
      }),
      signal: controller.signal,
    })
    if (res.ok) {
      log("ok")
      return reply("ok")
    }
    let message = ""
    try {
      message = String(((await res.json()) as { message?: unknown }).message ?? "")
    } catch {}
    if (isDuplicate(res.status, message)) {
      // The same answer as a new address, so nobody can use the form to ask who is on the list.
      log("dup")
      return reply("ok")
    }
    if ((res.status === 400 || res.status === 422) && /e-?mail/i.test(message)) {
      log("invalid")
      return reply("invalid")
    }
    log(`listmonk_${res.status}`)
    return reply("fallback")
  } catch {
    log("listmonk_unreachable")
    return reply("fallback")
  } finally {
    clearTimeout(timer)
  }
}
