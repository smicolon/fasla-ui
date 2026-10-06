import Link from "next/link"
import type { Metadata, ResolvingMetadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { locales, type Locale } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo-routes"
import { FaslaComma } from "../_components/fasla-mark"
import { ArrowEndIcon, DotIcon } from "../_components/icons"
import { LandingFooter } from "../_components/landing-footer"
import { LandingNav } from "../_components/landing-nav"
import { landingLinks } from "../_components/links"
import { FlipSettled } from "../_components/locale-flip"

/**
 * Title, description and a canonical of its own. The home layout's metadata
 * would otherwise make this page claim to be the home page; like the 404 page,
 * it is kept out of search and out of the sitemap.
 */
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: "landing.soon" })
  const url = (l: string) => new URL(landingLinks.comingSoon(l), SITE_URL).toString()
  const { openGraph } = await parent

  return {
    title: t("meta"),
    description: t("lede"),
    robots: { index: false, follow: true },
    alternates: { canonical: url(locale), languages: Object.fromEntries(locales.map((l) => [l, url(l)])) },
    openGraph: { title: t("meta"), description: t("lede"), url: url(locale), images: openGraph?.images },
  }
}

/**
 * Coming soon: where the Blocks, Templates, Pro and Team links go until each
 * exists. The landing page's nav, hinge comma and footer, so the language
 * switch flips it in place like the home page.
 */
export default async function ComingSoonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("landing.soon")

  return (
    <div className="l-page flex min-h-screen flex-col">
      <FlipSettled />
      <LandingNav />

      <main id="top" className="flex flex-1 items-center">
        <section aria-labelledby="soon-h" className="l-wrap w-full py-[var(--l-section)] text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-9 w-[18px] [view-transition-name:hinge]">
            <FaslaComma className="size-full" />
          </span>
          <Badge variant="soft" tone="primary" size="md" icon={<DotIcon />} className="mb-5">
            {t("badge")}
          </Badge>
          <h1
            id="soon-h"
            className="text-[length:clamp(40px,6vw,80px)] font-bold leading-[1.04] tracking-[-0.04em] [text-wrap:balance] rtl:font-extrabold rtl:leading-[1.34]"
          >
            {t("title")}
          </h1>
          <p className="l-lede mx-auto max-w-[56ch]">{t("lede")}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px] max-[560px]:w-full">
              <Link href={landingLinks.docs(locale)}>
                {t("docs")}
                <ArrowEndIcon />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-[10px] px-[22px] text-[15px] max-[560px]:w-full">
              <Link href={`/${locale}/`}>{t("home")}</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
