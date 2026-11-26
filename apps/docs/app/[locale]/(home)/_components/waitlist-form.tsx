"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { Input } from "@fasla-ui/ui/input/input"
import { cn } from "@/lib/utils"
import { MIN_FILL_MS } from "@/lib/waitlist"
import { MailIcon } from "./icons"
import { notifyProMailto, supportEmail } from "./links"

type State = "idle" | "sending" | "ok" | "invalid" | "rate" | "fallback"

/** The details, in the order the notice lists them. */
const DETAILS = ["who", "what", "double", "unsub", "where", "how", "rights"] as const

/** The old "Notify me about Pro" link, same look as before: what the page falls back to when the form cannot save. */
function MailtoLink({ className }: { className?: string }) {
  const t = useTranslations("landing.soon")
  return (
    <a
      href={notifyProMailto(t("notifySubject"))}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-[10px] px-2 text-[15px] font-medium text-muted-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <MailIcon />
      {t("notify")}
    </a>
  )
}

/**
 * Join the Fasla Pro waitlist: one e-mail field, posted to /api/waitlist (a
 * Cloudflare Pages Function that holds the Listmonk token). It sits where the
 * old mailto link was, on the Coming soon page.
 *
 * Without a working Function (not deployed, no token, Listmonk down, the
 * network gone) the form shows the old mailto link instead, so nobody is
 * left without a way to ask. Without JavaScript the form still posts; the
 * Function sends the reader back here with the result in the address.
 * No cookies, no storage, no tracking.
 */
export function WaitlistForm({ source, className }: { source: "coming-soon" | "install-page"; className?: string }) {
  const t = useTranslations("landing.soon.waitlist")
  const locale = useLocale()
  const [state, setState] = useState<State>("idle")
  // When the page was ready: the server drops a submit that claims to be sooner than MIN_FILL_MS after it.
  const readyAt = useRef(0)
  useEffect(() => {
    readyAt.current = Date.now()
    const result = new URLSearchParams(window.location.search).get("waitlist")
    if (result === "ok" || result === "invalid" || result === "rate" || result === "fallback") setState(result)
  }, [])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === "sending") return
    const data = new FormData(event.currentTarget)
    setState("sending")
    try {
      // A quick submit (autofill and Enter) is held until the page has been ready
      // for MIN_FILL_MS, so the server's too-fast rule never turns a real
      // person's sign-up into a silent drop. It shows "Sending…" meanwhile.
      const wait = readyAt.current + MIN_FILL_MS + 250 - Date.now()
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
          lang: locale,
          source,
          t: readyAt.current,
        }),
      })
      setState(res.ok ? "ok" : res.status === 422 ? "invalid" : res.status === 429 ? "rate" : "fallback")
    } catch {
      setState("fallback")
    }
  }

  if (state === "ok") {
    return (
      <p role="status" className={cn("mx-auto max-w-[52ch] text-[15px] leading-7 text-foreground", className)}>
        {t("ok")}
      </p>
    )
  }

  if (state === "fallback") {
    return (
      <div role="status" className={cn("mx-auto flex max-w-[52ch] flex-col items-center", className)}>
        <p className="text-[15px] leading-7 text-muted-foreground">{t("fallback")}</p>
        <MailtoLink />
      </div>
    )
  }

  const message = state === "invalid" ? t("invalid") : state === "rate" ? t("rate") : null

  return (
    <div className={cn("mx-auto w-full max-w-[520px]", className)}>
      <form
        method="post"
        action="/api/waitlist"
        onSubmit={submit}
        className="relative flex items-start gap-3 text-start max-[560px]:flex-col"
      >
        <input type="hidden" name="lang" value={locale} />
        <input type="hidden" name="source" value={source} />
        {/* The honeypot: out of sight and out of the tab order, for scripts that fill every field. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute size-px overflow-hidden opacity-0 [clip:rect(0,0,0,0)]"
        />
        <Input
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          size="lg"
          aria-label={t("label")}
          placeholder={t("placeholder")}
          invalid={state === "invalid"}
          className="min-w-0 flex-1 max-[560px]:w-full"
        />
        <Button
          type="submit"
          size="lg"
          disabled={state === "sending"}
          aria-busy={state === "sending"}
          className="h-12 rounded-[10px] px-[22px] text-[15px] max-[560px]:w-full"
        >
          {state === "sending" ? t("sending") : t("submit")}
        </Button>
      </form>

      <p role={message ? "alert" : undefined} className={cn("mt-3 text-sm", message ? "text-destructive" : "hidden")}>
        {message}
      </p>

      <p className="mt-4 text-pretty text-[13.5px] leading-6 text-muted-foreground">
        {t("notice")}
      </p>
      <details className="group mt-2 text-start text-[13.5px] leading-6 text-muted-foreground">
        <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-md font-medium text-foreground underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-current focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
          {t("details")}
        </summary>
        <dl className="mt-2 grid gap-3">
          {DETAILS.map((key) => (
            <div key={key}>
              <dt className="font-medium text-foreground">{t(`${key}.k`)}</dt>
              <dd className="text-pretty">
                {t.rich(`${key}.v`, {
                  email: supportEmail,
                  m: (chunks) => (
                    <bdi dir="ltr" className="font-medium text-foreground">
                      {chunks}
                    </bdi>
                  ),
                })}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}
