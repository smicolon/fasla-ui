"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { CodeBlock } from "@/components/component-preview"
import { cn } from "@/lib/utils"

const BREAKPOINTS = { desktop: 1440, tablet: 768, mobile: 360 } as const
type Breakpoint = keyof typeof BREAKPOINTS
const SECTIONS = ["navbar", "hero", "logo-marquee", "features", "ask", "banner", "testimonials", "plans", "faq", "footer"] as const
const MOTION = ["reduced", "visible", "pause", "css"] as const
const CREDITS = ["painting", "faisal", "freepik", "footer"] as const

export default function MahaamTemplatePage() {
  const t = useTranslations("docs.mahaamTemplate")
  const locale = useLocale()
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop")
  const src = `/${locale}/templates-preview/mahaam/`
  const width = BREAKPOINTS[breakpoint]

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("lead")}</p>
        <p className="text-muted-foreground">{t("intro")}</p>
      </div>

      <section className="space-y-4" aria-labelledby="mahaam-preview">
        <h2 id="mahaam-preview" className="text-2xl font-semibold">
          {t("previewTitle")}
        </h2>
        <div role="group" aria-label={t("previewTitle")} className="flex flex-wrap items-center gap-2">
          {(Object.keys(BREAKPOINTS) as Breakpoint[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={breakpoint === key}
              onClick={() => setBreakpoint(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red",
                breakpoint === key ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`breakpoint.${key}`)}
            </button>
          ))}
          <a href={src} className="ms-auto text-sm font-medium underline underline-offset-4">
            {t("openFull")}
          </a>
        </div>
        <div className="overflow-x-auto rounded-xl border bg-muted/30 p-2">
          <iframe title={t("title")} src={src} style={{ width, height: 720 }} className="mx-auto block max-w-none rounded-lg border-0 bg-background" />
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="mahaam-install">
        <h2 id="mahaam-install" className="text-2xl font-semibold">
          {t("installTitle")}
        </h2>
        <p className="text-muted-foreground">{t("installLead")}</p>
        <CodeBlock language="bash">{"npx @smicolon/fasla-ui@latest add template-mahaam"}</CodeBlock>
      </section>

      <section className="space-y-3" aria-labelledby="mahaam-sections">
        <h2 id="mahaam-sections" className="text-2xl font-semibold">
          {t("sectionsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("sectionsLead")}</p>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {SECTIONS.map((key) => (
            <li key={key}>{t(`sections.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="mahaam-motion">
        <h2 id="mahaam-motion" className="text-2xl font-semibold">
          {t("motionTitle")}
        </h2>
        <p className="text-muted-foreground">{t("motionLead")}</p>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {MOTION.map((key) => (
            <li key={key}>{t(`motion.${key}`)}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="mahaam-tints">
        <h2 id="mahaam-tints" className="text-2xl font-semibold">
          {t("tintsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("tints")}</p>
      </section>

      <section className="space-y-3" aria-labelledby="mahaam-credits">
        <h2 id="mahaam-credits" className="text-2xl font-semibold">
          {t("creditsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("creditsLead")}</p>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {CREDITS.map((key) => (
            <li key={key}>{t(`credits.${key}`)}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
