import { setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { MahaamTemplatePreview } from "@/components/blocks/mahaam-template-preview"

/**
 * The Mahaam template alone on a page, for the preview frames on its docs
 * page and for a link that opens it at any width. Kept out of search and the
 * sitemap: the docs page is the canonical one.
 */
export const metadata: Metadata = { title: "Mahaam | Fasla", robots: { index: false, follow: false } }

export default async function MahaamPreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  // Static export: pin the locale or next-intl reads headers().
  setRequestLocale(locale)
  return <MahaamTemplatePreview locale={locale === "ar" ? "ar" : "en"} />
}
