import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { cn } from "@/lib/utils"
import { ArrowEndIcon } from "./icons"
import { landingLinks } from "./links"
import { ProTemplateRail } from "./pro-template-rail"
import { SectionHead, Stroked } from "./section-head"

/**
 * The Fasla Pro showcase on the home page: the block families and the
 * templates, shown as pictures. The blocks and templates themselves are part
 * of Fasla Pro and are not in this repository; every card opens the Coming
 * soon page.
 *
 * Each picture exists per language and theme in public/landing/pro/, named
 * `<section>-<item>-<en|ar>-<light|dark>.webp`. The language is chosen on the
 * server; the theme by CSS on the `dark` class, so only the visible one loads.
 */

/** A picture in both themes: the light one, and the dark one under `.dark`. */
export function ThemedPicture({
  base,
  width,
  height,
  className,
}: {
  /** The file name without the theme and extension: `blocks-hero-en`. */
  base: string
  width: number
  height: number
  className?: string
}) {
  const img = "block h-auto w-full"
  return (
    <>
      {/* Static export: plain pictures, sized by their width and height. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/landing/pro/${base}-light.webp`} alt="" width={width} height={height} loading="lazy" decoding="async" className={cn(img, "dark:hidden", className)} />
      {/* Static export: plain pictures, sized by their width and height. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/landing/pro/${base}-dark.webp`} alt="" width={width} height={height} loading="lazy" decoding="async" className={cn(img, "hidden dark:block", className)} />
    </>
  )
}

/**
 * The block families, in order: [message key, file name, block count, new
 * this release]. The counts are the figures the home page has always shown.
 */
const FAMILIES: [string, string, number, number][] = [
  ["hero", "hero", 24, 2],
  ["feat", "features", 32, 0],
  ["gallery", "gallery", 14, 3],
  ["ban", "banners", 12, 0],
  ["auth", "auth", 9, 0],
  ["price", "pricing", 11, 1],
  ["checkout", "checkout", 8, 0],
  ["order", "order", 6, 0],
  ["dash", "dashboard", 10, 2],
  ["prod", "product", 16, 0],
  ["chat", "chat", 7, 0],
  ["ai", "assistant", 6, 1],
  ["faq", "faq", 9, 0],
  ["err", "error", 8, 0],
  ["cal", "calendar", 5, 0],
  ["toast", "toast", 6, 1],
]

/** Narrower screens show fewer cards: twelve below 1180px, eight below 860px, four below 640px. */
const hideFrom = (i: number) =>
  cn(i >= 12 && "max-[1180px]:hidden", i >= 8 && "max-[860px]:hidden", i >= 4 && "max-[640px]:hidden")

/** Keeps a count left to right inside Arabic copy. */
const ltr = (chunks: React.ReactNode) => <bdi dir="ltr">{chunks}</bdi>

/**
 * "Blocks for every page, in both directions." Four columns of block
 * families, then three, two and one. The last row fades into the page under
 * "Browse all blocks".
 */
export async function ProBlocksShowcase() {
  const locale = await getLocale()
  const t = await getTranslations("landing.blocks")

  return (
    <section id="blocks" aria-labelledby="bl-h" className="py-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="bl-h" center title={<Stroked text={t("title")} />} lede={t("lede")} />

        <div className="relative">
          <ul className="grid grid-cols-4 gap-5 max-[1180px]:grid-cols-3 max-[860px]:grid-cols-2 max-[860px]:gap-4 max-[640px]:grid-cols-1">
            {FAMILIES.map(([key, file, count, fresh], i) => (
              <li key={key} className={hideFrom(i)}>
                <Link
                  href={landingLinks.blocks(locale)}
                  className="block overflow-hidden rounded-xl border border-transparent bg-muted transition-colors duration-300 hover:border-border hover:bg-[color-mix(in_oklch,var(--muted)_70%,var(--border))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground dark:bg-card"
                >
                  <div className="p-3">
                    <div className="aspect-[4/3] overflow-hidden rounded-md bg-background">
                      <ThemedPicture base={`blocks-${file}-${locale}`} width={542} height={407} className="size-full object-cover" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 px-4 pb-4 pt-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="min-w-0 truncate text-lg font-semibold leading-[1.4] tracking-[-0.01em] rtl:font-bold rtl:tracking-normal max-[640px]:text-[17px]">
                        {t(`families.${key}`)}
                      </h3>
                      {fresh > 0 && (
                        <Badge variant="soft" tone="warning" size="md" className="shrink-0 text-[13px]">
                          {t.rich("new", { num: String(fresh), n: ltr })}
                        </Badge>
                      )}
                    </div>
                    <small className="text-sm font-medium text-muted-foreground">
                      {t.rich("count", { count, num: String(count), n: ltr })}
                    </small>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {/* The last row fades into the page. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-0.5 -bottom-0.5 h-[18%] bg-[linear-gradient(to_bottom,transparent,var(--background)_78%)] max-[640px]:h-[16%]"
          />
        </div>

        <div className="relative z-[1] -mt-16 flex justify-center">
          <Button asChild size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px]">
            <Link href={landingLinks.blocks(locale)}>
              {t("all")}
              <ArrowEndIcon />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/**
 * "Templates, ready for launch day." Six example sites in a rail that runs
 * past the page edge; on hover each card scrolls through its page.
 */
export async function ProTemplatesShowcase() {
  const t = await getTranslations("landing.templates")

  return (
    <section id="templates" aria-labelledby="tp-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="tp-h" center title={<Stroked text={t("title")} />} lede={t("lede")} />
      </div>
      <ProTemplateRail />
    </section>
  )
}
