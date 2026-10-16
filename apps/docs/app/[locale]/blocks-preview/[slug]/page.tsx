import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { BlockPreview } from "@/components/blocks/block-preview"
import { ALL_BLOCK_TYPES } from "@/lib/blocks"

/**
 * One block alone on a page, for the preview frames on a block family's docs
 * page: in a frame the block's own breakpoints apply, as they would in an app.
 * The frames, and the full-screen link, point here. Kept out of search and the
 * sitemap: the docs page is the canonical one.
 */
export function generateStaticParams() {
  return ALL_BLOCK_TYPES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return { title: `${slug} | Fasla`, robots: { index: false, follow: false } }
}

export default async function BlockPreviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  // Static export: pin the locale or next-intl reads headers().
  setRequestLocale(locale)
  if (!ALL_BLOCK_TYPES.some((type) => type.slug === slug)) notFound()

  return <BlockPreview slug={slug} locale={locale === "ar" ? "ar" : "en"} />
}
