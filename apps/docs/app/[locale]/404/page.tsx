import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Locale } from "@/i18n/routing"

// Cloudflare Pages serves the closest 404.html up the requested path, so
// /ar/anything-missing gets /ar/404.html. Next's static export only writes a
// root 404.html, so this renders as a page at /{locale}/404/ and
// scripts/export-404.mjs moves it to /{locale}/404.html after the build.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: "notFound" })
  return {
    title: t("title"),
    robots: { index: false, follow: true },
  }
}

export default async function LocaleNotFoundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers() and the
  // route drops out of the prerender.
  setRequestLocale(locale)
  const t = await getTranslations("notFound")

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <div className="flex flex-wrap justify-center gap-6">
        <Link href={`/${locale}/`} className="underline underline-offset-4">
          {t("home")}
        </Link>
        <Link href={`/${locale}/docs/`} className="underline underline-offset-4">
          {t("docs")}
        </Link>
      </div>
    </div>
  )
}
