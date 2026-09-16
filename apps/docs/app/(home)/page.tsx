import Link from "next/link"
import Image from "next/image"

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

function Stat({ value, label }: { value: string; label: React.ReactNode }) {
  return (
    <div className="px-0 py-7 sm:px-8 first:pl-0 last:pr-0 border-b sm:border-b-0 sm:border-r border-border last:border-0">
      <div className="text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{label}</div>
    </div>
  )
}

function CategoryCard({
  title,
  description,
  href,
  count,
}: {
  title: string
  description: string
  href: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="group relative rounded-xl border border-border p-6 transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="font-mono text-sm text-muted-foreground">{count}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        Browse
        <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-6 pt-24 md:px-16 md:pt-32">
        <div className="mb-8 flex items-center gap-2.5">
          {/* The comma at 26px tall = 13px wide, above the 12px minimum (§10) */}
          <Image src="/brand/fasla-comma.svg" alt="" width={13} height={26} className="h-[26px] w-auto" aria-hidden="true" />
          <span className="font-mono text-[13px] tracking-wide text-muted-foreground">
            27 components · MIT core
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.035em] sm:text-6xl md:text-[78px] [text-wrap:pretty]">
          Add a component<span className="text-primary">،</span>
          <br />
          own the source.
        </h1>

        <p className="mt-8 max-w-[640px] text-lg leading-relaxed text-muted-foreground md:text-xl">
          Fasla is a React component library from Smicolon GmbH, built on shadcn/ui
          primitives. The CLI copies a component&rsquo;s source into your project — you
          own it, you edit it, there is no black box to fight. MIT-licensed core.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3.5 rounded-lg bg-foreground px-5 py-3.5">
            <code className="font-mono text-[15px] text-background">npx fasla-ui add button</code>
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3.5 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Read the docs
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Proof row — one claim, one proof (§04) */}
        <div className="mt-16 grid grid-cols-1 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          <Stat value="27" label={<>components across<br />primitives, blocks and effects</>} />
          <Stat value="MIT" label={<>licensed core<br />no runtime lock-in</>} />
          <Stat value="0" label={<>required runtime deps<br />beyond your own React</>} />
          <Stat value="DE" label={<>Built in Germany by<br />Smicolon GmbH</>} />
        </div>
      </section>

      {/* ── One command, one component ───────────────────────── */}
      <section className="mt-24 bg-fasla-ink px-6 py-16 md:px-16">
        <div className="mx-auto max-w-[1120px]">
          <div className="mb-9 flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.08em] text-white/50">
              One command, one component
            </h2>
            <span className="font-mono text-[13px] text-white/35">add › own</span>
          </div>

          <div className="grid items-stretch gap-6 md:grid-cols-[1fr_64px_1fr] md:gap-0">
            {/* the command */}
            <div className="overflow-hidden rounded-[10px] border border-white/[0.12]">
              <div className="border-b border-white/[0.12] px-[18px] py-3 font-mono text-xs text-white/45">
                terminal
              </div>
              <div className="px-[18px] py-5 font-mono text-[13px] leading-[2.05] text-white/85">
                <div>
                  <span className="text-fasla-cyan">$</span> npx fasla-ui add button
                </div>
                <div className="text-white/50">✓ registry resolved</div>
                <div className="text-white/50">✓ button.tsx → components/ui</div>
                <div className="text-white/50">✓ cva + tailwind-merge wired</div>
                <div className="pt-2">
                  <span className="text-fasla-cyan">$</span> git diff --stat
                </div>
                <div className="text-white/50">1 file changed, 54 insertions</div>
              </div>
            </div>

            {/* the pause — the brand's own idea, drawn */}
            <div className="flex items-center justify-center md:flex-col md:gap-3.5">
              <div className="hidden w-px flex-1 bg-white/[0.12] md:block" />
              <Image src="/brand/fasla-comma.svg" alt="" width={13} height={26} className="h-[26px] w-auto" aria-hidden="true" />
              <div className="hidden w-px flex-1 bg-white/[0.12] md:block" />
            </div>

            {/* what you own afterwards */}
            <div className="flex flex-col overflow-hidden rounded-[10px] border border-white/[0.12]">
              <div className="border-b border-white/[0.12] px-[18px] py-3 font-mono text-xs text-white/45">
                components/ui/button.tsx — yours
              </div>
              <div className="flex-1 px-[18px] py-5 font-mono text-[13px] leading-[2.05] text-white/85">
                <div>
                  <span className="text-fasla-cyan">const</span> buttonVariants = cva(
                </div>
                <div className="pl-[18px] text-white/50">&quot;inline-flex items-center…&quot;,</div>
                <div className="pl-[18px]">
                  &#123; <span className="text-fasla-cyan">variants</span>: &#123; variant, size &#125; &#125;
                </div>
                <div>)</div>
                <div className="pt-3 text-white/32">edit it · rename it · delete it</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-6 py-24 md:px-16">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">What is in the registry</h2>
        <p className="mt-3 max-w-[560px] text-base leading-relaxed text-muted-foreground">
          Three categories, one install path. Every component ships its loading, empty,
          error and disabled states.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <CategoryCard
            title="UI primitives"
            description="Button, Input, Card, Badge, Skeleton, Avatar, Checkbox, Switch, Select, Combobox, Tabs, Textarea."
            href="/docs/components/button"
            count={12}
          />
          <CategoryCard
            title="Blocks"
            description="AppShell, PageHeader, EmptyState, Sidebar, Navbar, StatsCard, DataTable, FormSection."
            href="/docs/components/app-shell"
            count={8}
          />
          <CategoryCard
            title="Effects"
            description="ShimmerButton, AnimatedGradient, TextReveal, BorderBeam, Spotlight, GlowCard, TypewriterText."
            href="/docs/components/shimmer-button"
            count={7}
          />
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 md:px-16">
        <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
          What you get either way
        </h2>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
          <Feature
            title="Accessible by default"
            description="Keyboard navigation and screen reader support are built in. Icon-only buttons carry an aria-label; focus styles stay visible."
          />
          <Feature
            title="Reduced motion respected"
            description="Every animation reads prefers-reduced-motion from the shared motion presets. No opt-in required."
          />
          <Feature
            title="TypeScript throughout"
            description="Typed props and variants, so autocomplete works the moment a component lands in your project."
          />
          <Feature
            title="Semantic tokens"
            description="Colours come from CSS variables and the Tailwind theme. Retheme the set by editing tokens, not components."
          />
          <Feature
            title="Three density profiles"
            description="Compact, comfortable and spacious, so the same components suit a dense console and a marketing page."
          />
          <Feature
            title="Yours after install"
            description="The CLI copies source, not a dependency. Nothing stops you rewriting a component the day after you add it."
          />
        </div>
      </section>

      {/* ── Bilingual by construction (§02.04, §15) ───────────── */}
      <section className="mx-auto max-w-[1120px] px-6 pb-24 md:px-16">
        <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-2">
          <div className="border-b border-border p-9 md:border-b-0 md:border-r">
            <Image src="/brand/fasla-lockup-ltr.svg" alt="Fasla" width={93} height={30} className="h-[30px] w-auto dark:hidden" />
            <Image src="/brand/fasla-lockup-ltr-onDark.svg" alt="Fasla" width={93} height={30} className="hidden h-[30px] w-auto dark:block" />
            <div className="mb-2.5 mt-6 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              LTR · 273 × 88
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Fasla is a React component library for teams who would rather own their
              components than import them.
            </p>
          </div>
          <div dir="rtl" className="p-9 text-right">
            <Image src="/brand/fasla-lockup-rtl.svg" alt="فاصلة" width={105} height={30} className="ms-auto h-[30px] w-auto dark:hidden" />
            <Image src="/brand/fasla-lockup-rtl-onDark.svg" alt="فاصلة" width={105} height={30} className="ms-auto hidden h-[30px] w-auto dark:block" />
            <div className="mb-2.5 mt-6 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
              RTL · 307 × 88
            </div>
            <p className="text-base leading-[1.8] text-muted-foreground">
              فاصلة مكتبة مكوّنات <span dir="ltr" className="font-sans">React</span> تملك شيفرتها
              بنفسك بعد التثبيت، من تطوير شركة{" "}
              <span dir="ltr" className="font-sans">Smicolon GmbH</span>.
            </p>
          </div>
        </div>
        <p className="mt-3.5 text-[13px] text-muted-foreground">
          Both lockups set to the same height, never the same width — the mark is identical
          in both directions (§09).
        </p>
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
              className="font-medium text-foreground hover:text-primary"
            >
              by Smicolon GmbH
            </Link>
          </span>
          <span className="flex items-center gap-5">
            <Link
              href="https://github.com/smicolon/fasla-ui"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </Link>
            <span className="font-mono text-[13px]">MIT · Kirchheim b. München</span>
          </span>
        </div>
      </footer>
    </div>
  )
}
