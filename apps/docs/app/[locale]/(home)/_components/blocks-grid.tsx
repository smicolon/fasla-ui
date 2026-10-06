import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { cn } from "@/lib/utils"
import { Block } from "./block-library"
import { DARK_BLOCKS, type BlockKey } from "./blocks-data"
import { ArrowEndIcon } from "./icons"
import { landingLinks } from "./links"
import { ScaledPreview } from "./scaled-preview"
import { SectionHead, Stroked } from "./section-head"

/**
 * The block families, in the reference's order. The first ten are the real
 * families; the last six come from blocks already on the page.
 *
 * [key, width (W 880 / N 560), natural height for a fitted preview (0 fills),
 * block count, new this release]. The counts and "New" numbers are the
 * reference's placeholders, kept as they are until Yasmin decides on them.
 */
const FAMILIES: [BlockKey, "W" | "N", number, number, number][] = [
  ["hero", "W", 0, 24, 2],
  ["feat", "W", 380, 32, 0],
  ["gallery", "W", 0, 14, 3],
  ["ban", "W", 0, 12, 0],
  ["auth", "W", 0, 9, 0],
  ["price", "W", 400, 11, 1],
  ["checkout", "W", 480, 8, 0],
  ["order", "N", 470, 6, 0],
  ["dash", "W", 0, 10, 2],
  ["prod", "W", 0, 16, 0],
  ["chat", "N", 430, 7, 0],
  ["ai", "N", 0, 6, 1],
  ["faq", "N", 400, 9, 0],
  ["err", "N", 380, 8, 0],
  ["cal", "N", 400, 5, 0],
  ["toast", "N", 330, 6, 1],
]

const WIDTH = { W: 880, N: 560 }
const num = (chunks: React.ReactNode) => <bdi dir="ltr">{chunks}</bdi>

/**
 * "Blocks for every page, in both directions." A four-column grid of block
 * families, each a live preview of one of its blocks in the page's language.
 * The last row fades out under "Browse all blocks"; narrower screens show
 * three, two and one column with fewer cards.
 */
export async function BlocksGrid() {
  const locale = await getLocale()
  const t = await getTranslations("landing.blocks")

  return (
    <section id="blocks" aria-labelledby="bl-h" className="l-sec">
      <div className="l-wrap">
        <SectionHead id="bl-h" center title={<Stroked text={t("title")} />} lede={t("lede")} />

        <ul className="l-fam-grid relative grid grid-cols-4 gap-5 max-[1180px]:grid-cols-3 max-[860px]:grid-cols-2 max-[860px]:gap-4 max-[640px]:grid-cols-1">
          {FAMILIES.map(([k, w, natural, count, fresh]) => (
            <li key={k}>
              <Link
                href={landingLinks.docs(locale)}
                className="block overflow-hidden rounded-xl border border-transparent bg-muted transition-colors duration-300 hover:border-border hover:bg-[color-mix(in_oklch,var(--muted)_70%,var(--border))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground dark:bg-card"
              >
                <div className="p-3">
                  <ScaledPreview
                    width={WIDTH[w]}
                    height={natural || undefined}
                    mode={natural ? "fit" : "fill"}
                    dark={DARK_BLOCKS.includes(k)}
                    className="aspect-[4/3] rounded-md bg-background"
                  >
                    <Block k={k} />
                  </ScaledPreview>
                </div>
                <div className="flex flex-col gap-0.5 px-4 pb-4 pt-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h3 className="min-w-0 truncate text-lg font-semibold leading-[1.4] tracking-[-0.01em] rtl:font-bold rtl:tracking-normal max-[640px]:text-[17px]">
                      {t(`families.${k}`)}
                    </h3>
                    {fresh > 0 && (
                      <Badge variant="soft" tone="warning" size="md" className="shrink-0 text-[13px]">
                        {t.rich("new", { num: String(fresh), n: num })}
                      </Badge>
                    )}
                  </div>
                  <small className="text-sm font-medium text-muted-foreground">{t.rich("count", { count, num: String(count), n: num })}</small>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className={cn("relative z-[1] -mt-16 flex justify-center")}>
          <Button asChild size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px]">
            <Link href={landingLinks.docs(locale)}>
              {t("all")}
              <ArrowEndIcon />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
