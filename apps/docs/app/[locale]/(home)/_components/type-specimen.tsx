import { getTranslations } from "next-intl/server"
import { LEADING, SIZE_PX } from "@fasla-ui/tailwind-preset"
import { cn } from "@/lib/utils"
import { SectionHead, Stroked } from "./section-head"

/**
 * Six rungs of the shared type ramp, the same utility on both sides. The
 * numbers are read from the preset, so they are the ones the code ships:
 * size and weight match, and Arabic takes a taller line from the
 * `[dir="rtl"]` leading the preset sets.
 */
const ROWS = [
  { rung: "5xl", weight: 600, size: "text-5xl" },
  { rung: "4xl", weight: 600, size: "text-4xl" },
  { rung: "2xl", weight: 600, size: "text-2xl" },
  { rung: "base", weight: 400, size: "text-base" },
  { rung: "sm", weight: 400, size: "text-sm" },
  { rung: "xs", weight: 500, size: "text-xs" },
] as const

const WEIGHT = { 400: "font-normal", 500: "font-medium", 600: "font-semibold" } as const

/** A rung's token and its size, weight and line height, in English or Arabic. */
function Token({ rung, weight, rtl, className }: { rung: (typeof ROWS)[number]["rung"]; weight: number; rtl: boolean; className?: string }) {
  const [en, ar] = LEADING[rung]
  return (
    <span className={cn("flex gap-3 font-mono text-xs text-muted-foreground", className)}>
      <b className="font-medium text-foreground">text-{rung}</b>
      <span>
        {SIZE_PX[rung]} / {weight} / {rtl ? ar : en}
      </span>
    </span>
  )
}

/** A dot between a face and its language, drawn rather than typed (no middle dot in Arabic copy). */
const Dot = () => <i aria-hidden="true" className="mx-1.5 inline-block size-[3px] rounded-full bg-current align-middle" />

/**
 * Cairo is a 1:1 twin of Geist: each rung set once in English and once in
 * Arabic, sharing a baseline. The columns follow the page direction, so
 * flipping the page swaps them; the type itself does not change.
 */
export async function TypeSpecimen() {
  const t = await getTranslations("landing.type")

  return (
    <section aria-labelledby="type-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="type-h" title={<Stroked text={t("title")} />} lede={t("lede")} />

        {/* One hairline down the middle, between the two columns. */}
        <div className="border-t border-foreground/15 bg-[length:1px_100%] bg-center bg-no-repeat [background-image:linear-gradient(var(--border),var(--border))] max-[760px]:[background-image:none]">
          <div className="grid grid-cols-2 gap-x-[clamp(24px,4vw,64px)] border-b py-3.5 text-[13px] text-[color:var(--l-fg-2)] max-[760px]:hidden">
            <span>
              <b className="font-semibold text-foreground">Geist</b>
              <Dot />
              {t("en")}
            </span>
            <span>
              <b className="font-semibold text-foreground">Cairo</b>
              <Dot />
              {t("ar")}
            </span>
          </div>

          {ROWS.map((row) => (
            <div
              key={row.rung}
              className="grid grid-cols-2 items-baseline gap-x-[clamp(24px,4vw,64px)] gap-y-2 border-b pb-[18px] pt-[22px] [align-items:last_baseline] max-[760px]:grid-cols-1"
            >
              {/* Tokens read as code (LTR) and sit on the outer edge of their column. */}
              <Token
                rung={row.rung}
                weight={row.weight}
                rtl={false}
                className="row-start-1 rtl:justify-end max-[760px]:row-auto max-[760px]:rtl:justify-start"
              />
              <Token
                rung={row.rung}
                weight={row.weight}
                rtl
                className="row-start-1 justify-end rtl:justify-start max-[760px]:order-3 max-[760px]:row-auto max-[760px]:mt-2.5 max-[760px]:justify-start max-[760px]:rtl:justify-end"
              />
              <div
                dir="ltr"
                lang="en"
                className={cn(
                  "row-start-2 min-w-0 overflow-hidden whitespace-nowrap text-left font-sans [mask-image:linear-gradient(to_right,black_70%,transparent_96%)] max-[760px]:order-2 max-[760px]:row-auto",
                  row.size,
                  WEIGHT[row.weight]
                )}
              >
                {t("sampleEn")}
              </div>
              <div
                dir="rtl"
                lang="ar"
                className={cn(
                  "row-start-2 min-w-0 overflow-hidden whitespace-nowrap text-right font-arabic [mask-image:linear-gradient(to_left,black_70%,transparent_96%)] max-[760px]:order-4 max-[760px]:row-auto",
                  row.size,
                  WEIGHT[row.weight]
                )}
              >
                {t("sampleAr")}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[13px] text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  )
}
