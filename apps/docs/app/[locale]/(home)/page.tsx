import Link from "next/link"
import Image from "next/image"
import { CopyCommand } from "@/components/copy-command"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { localeDirection, type Locale } from "@/i18n/routing"

/**
 * Home page — Fasla Brand Identity V2.5.
 *
 * Palette is the canonical three (§13): red #E40017, ink #0A0A0A, white #FFFFFF,
 * plus cyan #009ED4 for code accent on a dark ground only. Red is reserved for
 * the comma, one CTA per composition, and interactive states.
 *
 * The Arabic comma ، replaces one Latin comma in the headline, once (§15).
 * Type is product tier: Geist and Geist Mono (§14).
 * Nothing decorative: "nothing is added because a surface looks empty" (§02.02).
 */

/**
 * Translated copy set inside a monospace surface. globals.css keeps every
 * `.font-mono` element LTR in Arabic, which is right for code but reverses an
 * Arabic phrase, so the phrase is isolated in its own direction and set in
 * Cairo, the face that carries its glyphs.
 */
function Phrase({ dir, children }: { dir: "ltr" | "rtl"; children: React.ReactNode }) {
  return (
    <bdi dir={dir} className="rtl:font-arabic">
      {children}
    </bdi>
  )
}

function Stat({ value, label }: { value: string; label: React.ReactNode }) {
  return (
    <div className="border-b border-border px-0 py-6 sm:px-7 lg:border-b-0 lg:border-e lg:last:border-e-0 [&:first-child]:ps-0 [&:nth-child(2)]:border-b lg:[&:nth-child(2)]:border-b-0">
      <div className="text-[28px] font-semibold">{value}</div>
      <div className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{label}</div>
    </div>
  )
}

function CategoryCard({
  title,
  description,
  href,
  count,
  browseLabel,
}: {
  title: string
  description: string
  href: string
  count: number
  browseLabel: string
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl border border-border p-6 transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red focus-visible:ring-offset-2"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="font-mono text-sm text-muted-foreground">{count}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-fasla-red">
        {browseLabel}
        <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-t border-border pt-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("home")
  const tf = await getTranslations("footer")
  const tn = await getTranslations("nav")
  const p = (path: string) => `/${locale}${path}`
  const dir = localeDirection[locale as Locale]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────
          Split: the claim on the left, the product proving it on the right.
          Dev-tool heroes that work (Frontify, Antimetal, Anchor, Cursor) all
          put the real surface above the fold rather than below it.

          Motion is one orchestrated reveal, not scattered micro-interactions
          (§02.02). Everything here is turned off by prefers-reduced-motion,
          handled globally in globals.css.
      ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1220px] px-6 pb-4 pt-20 md:px-12 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">

          {/* ── the claim ── */}
          <div>
            <div className="rise mb-7 flex items-center gap-2.5" style={{ animationDelay: "0ms" }}>
              {/* Comma at 26px tall = 13px wide, above the 12px minimum (§10) */}
              <Image src="/brand/fasla-comma.svg" alt="" width={13} height={26} className="h-[22px] w-auto" aria-hidden="true" />
              {/* Not font-mono in Arabic: the mono rule would force it LTR, and
                  Arabic is never letter-spaced (§15). */}
              <span
                className={`text-[13px] text-muted-foreground ${
                  dir === "rtl" ? "font-arabic" : "font-mono tracking-wide"
                }`}
              >
                {t("eyebrow", { count: 27 })}
              </span>
            </div>

            <h1
              className="rise text-4xl font-semibold sm:text-5xl lg:text-6xl [text-wrap:balance]"
              style={{ animationDelay: "60ms" }}
            >
              {t("headlineLead")}
              {/* The brand's punctuation, used once (§15). Geist carries no
                  Arabic glyph, so .fasla-comma names faces that do. */}
              <span className="fasla-comma text-fasla-red" aria-hidden="true">،</span>
              <br />
              {t("headlineTail")}
            </h1>

            <p
              className="rise mt-6 max-w-[520px] text-[17px] leading-relaxed text-muted-foreground md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {t("intro")}
            </p>

            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "180ms" }}>
              <CopyCommand command="npx fasla-ui add button" />
              <Link
                href={p("/docs")}
                className="inline-flex items-center gap-2 rounded-lg bg-fasla-red px-5 py-3 text-[15px] font-medium text-fasla-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red focus-visible:ring-offset-2"
              >
                {t("readDocs")}
                <svg className="h-3.5 w-3.5 rtl:-scale-x-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── the proof ── */}
          <div className="rise" style={{ animationDelay: "240ms" }}>
            <div className="overflow-hidden rounded-xl border border-border bg-terminal shadow-2xl shadow-foreground/10">
              <div className="flex items-center justify-between border-b border-terminal-border px-4 py-2.5">
                <span className="font-mono text-[11px] text-terminal-muted"><Phrase dir={dir}>{t("terminal.title")}</Phrase></span>
                <span className="font-mono text-[11px] text-terminal-subtle">{t("terminal.cwd")}</span>
              </div>

              <div className="space-y-1 px-4 py-4 font-mono text-[12.5px] leading-[1.9] text-terminal-foreground">
                <div className="rise" style={{ animationDelay: "420ms" }}>
                  <span className="text-terminal-accent">$</span> npx fasla-ui add button
                </div>
                <div className="rise text-terminal-muted" style={{ animationDelay: "700ms" }}>✓ <Phrase dir={dir}>{t("terminal.resolved")}</Phrase></div>
                <div className="rise text-terminal-muted" style={{ animationDelay: "850ms" }}>✓ <Phrase dir={dir}>{t("terminal.written")}</Phrase></div>
                <div className="rise text-terminal-muted" style={{ animationDelay: "1000ms" }}>✓ <Phrase dir={dir}>{t("terminal.wired")}</Phrase></div>
                <div className="rise flex items-center gap-1.5 pt-1" style={{ animationDelay: "1150ms" }}>
                  <span className="text-terminal-accent">$</span>
                  <span className="caret inline-block h-[14px] w-[7px] bg-terminal-caret" aria-hidden="true" />
                </div>
              </div>

              {/* what you own once it lands */}
              <div className="border-t border-terminal-border px-4 py-4">
                <div className="mb-2.5 font-mono text-[11px] text-terminal-subtle">
                  <Phrase dir={dir}>{t("terminal.ownedFile")}</Phrase>
                </div>
                <div className="font-mono text-[12.5px] leading-[1.9] text-terminal-foreground">
                  <div><span className="text-terminal-accent">const</span> buttonVariants = cva(</div>
                  <div className="pl-4 text-terminal-muted">&quot;inline-flex items-center…&quot;,</div>
                  <div className="pl-4">&#123; <span className="text-terminal-accent">variants</span>: &#123; variant, size &#125; &#125;</div>
                  <div>)</div>
                </div>
              </div>
            </div>

            <p
              className={`mt-3 text-center text-[11px] text-muted-foreground lg:text-end ${
                dir === "rtl" ? "font-arabic" : "font-mono"
              }`}
            >
              {t("terminal.ownership")}
            </p>
          </div>
        </div>

        {/* Proof row — one claim, one proof (§04) */}
        <div className="rise mt-16 grid grid-cols-2 border-t border-border lg:grid-cols-4" style={{ animationDelay: "300ms" }}>
          <Stat value="27" label={t("stats.componentsLabel")} />
          <Stat value="MIT" label={t("stats.licenceLabel")} />
          <Stat value="0" label={t("stats.depsLabel")} />
          <Stat value={t("stats.countryValue")} label={t("stats.countryLabel")} />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-6 py-24 md:px-16">
        <h2 className="text-3xl font-semibold md:text-4xl">{t("registry.title")}</h2>
        <p className="mt-3 max-w-[560px] text-base leading-relaxed text-muted-foreground">
          {t("registry.intro")}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <CategoryCard
            title={t("registry.primitives.title")}
            description={t("registry.primitives.description")}
            href={p("/docs/components/button")}
            count={12}
            browseLabel={t("registry.browse")}
          />
          <CategoryCard
            title={t("registry.blocks.title")}
            description={t("registry.blocks.description")}
            href={p("/docs/components/app-shell")}
            count={8}
            browseLabel={t("registry.browse")}
          />
          <CategoryCard
            title={t("registry.effects.title")}
            description={t("registry.effects.description")}
            href={p("/docs/components/shimmer-button")}
            count={7}
            browseLabel={t("registry.browse")}
          />
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 md:px-16">
        <h2 className="mb-10 text-3xl font-semibold md:text-4xl">
          {t("features.title")}
        </h2>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
          <Feature
            title={t("features.accessible.title")}
            description={t("features.accessible.description")}
          />
          <Feature
            title={t("features.motion.title")}
            description={t("features.motion.description")}
          />
          <Feature
            title={t("features.typescript.title")}
            description={t("features.typescript.description")}
          />
          <Feature
            title={t("features.tokens.title")}
            description={t("features.tokens.description")}
          />
          <Feature
            title={t("features.density.title")}
            description={t("features.density.description")}
          />
          <Feature
            title={t("features.ownership.title")}
            description={t("features.ownership.description")}
          />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-16">
          <span>
            fasla.dev ·{" "}
            <Link
              href="https://smicolon.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground hover:text-fasla-red"
            >
              {tf("by")}
            </Link>
          </span>
          <span className="flex items-center gap-5">
            <Link
              href="https://github.com/smicolon/fasla-ui"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {tn("github")}
            </Link>
            <span className="font-mono text-[13px]">{tf("licence")}</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
