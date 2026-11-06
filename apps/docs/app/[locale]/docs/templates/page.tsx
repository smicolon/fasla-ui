"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"

/** The templates the docs offer. Each card shows three sections of the real template, from its Desktop LTR final stories. */
const TEMPLATES = [
  {
    slug: "mahaam",
    thumbs: [
      { key: "hero", src: "/images/templates/mahaam/hero.webp" },
      { key: "features", src: "/images/templates/mahaam/features.webp" },
      { key: "testimonials", src: "/images/templates/mahaam/testimonials.webp" },
    ],
  },
] as const

/** The small tags: the technical names stay as they are, in either language. */
const TAGS = ["LTR · RTL", "React", "Tailwind CSS"] as const

export default function TemplatesPage() {
  const t = useTranslations("docs.templates")
  const locale = useLocale()
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("lead")}</p>
      </div>

      <ul className="space-y-6">
        {TEMPLATES.map((template) => (
          <li key={template.slug} className="grid gap-6 rounded-2xl border bg-card p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:p-6">
            <div className="flex flex-col gap-4 md:py-2">
              <ul aria-label={t("tags")} className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <li key={tag} dir="ltr" className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{t(`${template.slug}.title`)}</h2>
                <p className="text-sm text-muted-foreground">{t(`${template.slug}.description`)}</p>
              </div>
              <Button asChild className="mt-auto w-fit">
                <Link href={`/${locale}/docs/templates/${template.slug}/`}>
                  {t("open")}
                  <span className="sr-only"> {t(`${template.slug}.title`)}</span>
                </Link>
              </Button>
            </div>

            <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
              {template.thumbs.map((thumb) => (
                <li key={thumb.key} className="w-[78%] shrink-0 snap-center md:w-auto">
                  <img
                    src={thumb.src}
                    alt={t(`${template.slug}.thumbs.${thumb.key}`)}
                    width={960}
                    height={640}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/2] w-full rounded-lg border bg-muted object-cover"
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
