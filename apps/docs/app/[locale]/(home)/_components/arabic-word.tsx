import { getTranslations } from "next-intl/server"
import { StrokedWord } from "./section-head"

/**
 * "Arabic is a launch language." «العربية» set huge, the AlUla dunes showing
 * through its letters and panning slowly (landing.css, .l-word), over a ruled
 * row: a short caption on the start side, the heading and lede on the other.
 * The word stays Arabic in both languages and is decoration, so screen
 * readers skip it.
 */
export async function ArabicWord() {
  const t = await getTranslations("landing.launch")

  return (
    <section aria-labelledby="launch-h" className="overflow-hidden pb-[clamp(48px,6vw,88px)] pt-[clamp(56px,8vw,112px)]">
      <div className="l-wrap">
        <p aria-hidden="true" lang="ar" dir="rtl" className="text-center leading-[1.05]">
          <span className="l-word font-arabic">العربية</span>
        </p>
        <div className="mt-[clamp(8px,1vw,16px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-x-[clamp(24px,5vw,80px)] gap-y-8 border-t pt-7 max-[760px]:grid-cols-1">
          <p className="flex items-center gap-2.5 text-sm text-[color:var(--l-fg-2)]">
            <i aria-hidden="true" className="h-[1.5px] w-7 shrink-0 bg-fasla-red" />
            {t("caption")}
          </p>
          <div>
            <h2 id="launch-h" className="l-h2">
              {t.rich("title", {
                comma: (chunks) => <span className="font-arabic text-fasla-red">{chunks}</span>,
                stroke: (chunks) => <StrokedWord>{chunks}</StrokedWord>,
              })}
            </h2>
            {/* .l-lede is unlayered CSS, so only an important utility tightens its 20px to the reference's 16px. */}
            <p className="l-lede !mt-4">{t("lede")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
