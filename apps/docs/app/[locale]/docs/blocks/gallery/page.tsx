"use client"

import * as React from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import registry from "@fasla-ui/registry.json"
import { ComponentName } from "@/components/component-name"
import { BlockVariantCard } from "@/components/blocks/block-variant-card"
import { cn } from "@/lib/utils"
import { GALLERY_FAMILIES, GALLERY_TYPES, blockRequirements, type GalleryFamily } from "@/lib/blocks"

const items: { name: string; dependencies?: string[]; registryDependencies?: string[] }[] = registry.items

export default function GalleryBlocksPage() {
  const t = useTranslations("docs.galleryBlocks")
  const locale = useLocale()
  const [family, setFamily] = React.useState<GalleryFamily | "all">("all")
  const shown = GALLERY_TYPES.filter((type) => family === "all" || type.family === family)
  const count = (key: GalleryFamily | "all") =>
    key === "all" ? GALLERY_TYPES.length : GALLERY_TYPES.filter((type) => type.family === key).length

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          <ComponentName path="/docs/blocks/gallery/" />
        </h1>
        <p className="text-xl text-muted-foreground">{t("lead", { count: GALLERY_TYPES.length, n: String(GALLERY_TYPES.length) })}</p>
        <p className="text-muted-foreground">
          {t.rich("intro", {
            link: (chunks) => (
              <Link href={`/${locale}/docs/blocks/`} className="font-medium text-foreground underline underline-offset-4">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
        {(["all", ...GALLERY_FAMILIES] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={family === key}
            onClick={() => setFamily(key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red",
              family === key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {t(`families.${key}`)}
            <span className="tabular-nums opacity-70">{count(key)}</span>
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {t("showing", { count: shown.length, n: String(shown.length) })}
      </p>

      <div className="space-y-8">
        {shown.map((type) => (
          <BlockVariantCard key={type.slug} type={type} name={t(`types.${type.slug}`)} {...blockRequirements(type.slug, items)} />
        ))}
      </div>
    </div>
  )
}
