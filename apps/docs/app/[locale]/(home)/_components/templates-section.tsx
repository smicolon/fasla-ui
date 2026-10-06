import { getTranslations } from "next-intl/server"
import { SectionHead, Stroked } from "./section-head"
import { TemplatesRail } from "./templates-carousel"

/**
 * "Templates, ready for launch day." Six example sites, each a page stacked
 * from Fasla blocks, in a carousel that runs past the page edge.
 */
export async function TemplatesSection() {
  const t = await getTranslations("landing.templates")

  return (
    <section id="templates" aria-labelledby="tp-h" className="l-sec pt-0">
      <div className="l-wrap">
        <SectionHead id="tp-h" center title={<Stroked text={t("title")} />} lede={t("lede")} />
      </div>
      <TemplatesRail />
    </section>
  )
}
