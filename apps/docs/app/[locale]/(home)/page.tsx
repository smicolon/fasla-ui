import Link from "next/link"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Button } from "@fasla-ui/ui/button/button"
import { CopyCommand } from "@/components/copy-command"
import { DirectionSwitch } from "./_components/direction-switch"
import { FaslaComma } from "./_components/fasla-mark"
import { FilmPlayer } from "./_components/film-player"
import { ArrowEndIcon } from "./_components/icons"
import { LandingFooter } from "./_components/landing-footer"
import { LandingNav } from "./_components/landing-nav"
import { installCommand, landingLinks } from "./_components/links"
import { FlipSettled } from "./_components/locale-flip"
import { SanadWindow } from "./_components/sanad-window"
import { XrayStage } from "./_components/xray-stage"

/**
 * The ui.smicolon.com home page: the Fasla landing page, in English and Arabic.
 *
 * Built from the approved reference (fasla-landing-final, 6 Oct 2026) and its
 * handoff. The page is the demo: the hero's direction switch flips the whole
 * page between /en/ and /ar/, and the product window under it is assembled
 * from real Fasla components. Landing-only pieces live in ./_components and
 * have no Storybook stories.
 *
 * Brand red marks the comma, the active direction and the x-ray tags only.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("landing")

  return (
    <div className="l-page">
      <FlipSettled />
      <LandingNav />

      <main id="top">
        {/* ── Hero ─────────────────────────────────────────────────
            A seam runs down the centre, the hinge between the two
            directions. The title, the line under it and the switch label
            sit on the page ground, which breaks the seam around them. */}
        <section aria-labelledby="hero-h" className="relative isolate pt-[clamp(36px,4.5vw,56px)] text-center">
          <div aria-hidden="true" className="absolute inset-y-0 left-1/2 -z-10 w-px -translate-x-1/2 bg-foreground/15 max-[560px]:hidden" />

          <div className="l-wrap">
            <span
              aria-hidden="true"
              className="relative mx-auto mb-[18px] block h-9 w-[18px] [view-transition-name:hinge] before:absolute before:-inset-x-3.5 before:-inset-y-2.5 before:bg-background before:content-['']"
            >
              <FaslaComma className="relative size-full" />
            </span>

            <h1
              id="hero-h"
              className="inline-block max-w-full bg-background px-3 py-2 text-[length:clamp(36px,5vw,72px)] font-bold leading-[1.04] tracking-[-0.04em] [text-wrap:balance] [view-transition-name:hero-title] rtl:text-[length:clamp(34px,4.8vw,68px)] rtl:font-extrabold rtl:leading-[1.34]"
            >
              {t.rich("hero.title", {
                nb: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
                // "components & templates" stays on one line until phones.
                nb3: (chunks) => <span className="min-[761px]:whitespace-nowrap">{chunks}</span>,
                // The red marker behind the first key word, tilted against the reading direction.
                mark: (chunks) => (
                  <mark className="relative z-0 -mx-[.02em] inline-block bg-transparent px-[.16em] pb-[.02em] text-fasla-white before:absolute before:inset-x-0 before:bottom-[.02em] before:top-[.1em] before:-z-10 before:-rotate-[1.6deg] before:rounded-[.14em] before:bg-fasla-red before:content-[''] rtl:before:bottom-[.06em] rtl:before:top-[.2em] rtl:before:rotate-[1.6deg]">
                    {chunks}
                  </mark>
                ),
                // The brand's comma, in red and in Cairo in both languages.
                comma: (chunks) => <span className="font-arabic text-fasla-red">{chunks}</span>,
                br: () => <br />,
              })}
            </h1>

            <p className="mx-auto mt-4 max-w-[54ch] bg-background px-2 py-1 text-[length:clamp(16px,1.4vw,19px)] leading-normal text-muted-foreground rtl:max-w-[60ch] rtl:leading-[1.75]">
              {t("hero.sub")}
            </p>

            {/* Both languages at once, whichever page this is. */}
            <div
              aria-hidden="true"
              className="mb-3 mt-7 grid grid-cols-[1fr_56px_1fr] items-center text-sm text-muted-foreground max-[560px]:grid-cols-[1fr_32px_1fr] max-[560px]:text-[13px]"
            >
              <span lang="en" className="justify-self-end font-sans">
                {t("hero.flipEn")}
              </span>
              <i className="size-[7px] justify-self-center rounded-full bg-foreground" />
              <span lang="ar" dir="rtl" className="justify-self-start font-arabic font-medium">
                {t("hero.flipAr")}
              </span>
            </div>

            <DirectionSwitch label={t("hero.swLabel")} />

            <div className="mt-7 flex flex-wrap justify-center gap-3 [view-transition-name:hero-cta]">
              <CopyCommand
                command={installCommand}
                className="h-12 rounded-[10px] border-foreground/15 bg-background py-0 max-[560px]:w-full max-[560px]:justify-between"
              />
              <Button asChild size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px] max-[560px]:w-full">
                <Link href={landingLinks.docs(locale)}>
                  {t("cta.start")}
                  <ArrowEndIcon />
                </Link>
              </Button>
            </div>
          </div>

          <XrayStage label={t("hero.xray")} windowLabel={t("sanad.label")}>
            <SanadWindow />
          </XrayStage>
        </section>

        {/* ── Film ─────────────────────────────────────────────── */}
        <section aria-label={t("film.label")} className="pb-[var(--l-section)] pt-[clamp(24px,4vw,56px)]">
          <div className="l-wrap">
            <FilmPlayer />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
