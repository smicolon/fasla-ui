import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { Card } from "@fasla-ui/ui/card/card"
import { atomCounts } from "@/lib/atoms"
import { cn } from "@/lib/utils"
import { landingLinks } from "./links"
import { SectionHead, Stroked } from "./section-head"

const fmt = new Intl.NumberFormat("en-US")

/** Features a plan does not include, by plan: struck through and dimmed. */
const MISSING: Record<string, number[]> = { os: [5, 6], pro: [], team: [] }

/**
 * "Free to start. Pay once for more." Three plans on the Fasla Card: the MIT
 * core, Pro and Team, one-time payments. Pro is raised and marked best value.
 *
 * Prices are final for the landing page (5 Oct). The Pro and Team buttons go
 * where links.ts sends them, pending Mohamed's decision; the component and
 * variant counts in the lists are read from the registry and the Figma index.
 */
export async function PricingSection({ components }: { components: number }) {
  const locale = await getLocale()
  const t = await getTranslations("landing.pricing")

  const plans = [
    { id: "os", price: "$0", per: t("free"), cta: t("start"), href: landingLinks.docs(locale), best: false },
    { id: "pro", price: "$149", per: t("once"), cta: t("choosePro"), href: landingLinks.pro(locale), best: true },
    { id: "team", price: "$399", per: t("once"), cta: t("chooseTeam"), href: landingLinks.team(locale), best: false },
  ]

  return (
    <section id="pricing" aria-labelledby="price-h" className="py-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead id="price-h" title={<Stroked text={t("title")} />} lede={t("lede")} />

        <div className="grid grid-cols-3 items-stretch gap-4 max-[900px]:max-w-[520px] max-[900px]:grid-cols-1">
          {plans.map((plan) => {
            const features = t.raw(`${plan.id}.features`) as string[]
            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col gap-5 rounded-2xl p-7 shadow-none max-[560px]:p-[22px]",
                  plan.best && "border-[1.5px] border-foreground shadow-lg"
                )}
              >
                <div className="flex min-h-6 items-center justify-between gap-3">
                  <h3 className="text-[17px] font-semibold">{t(`${plan.id}.name`)}</h3>
                  {plan.best && (
                    <Badge variant="solid" tone="primary" size="md">
                      {t("best")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <bdi dir="ltr" className="font-sans text-5xl font-[650] leading-none tracking-[-0.03em] tabular-nums">
                    {plan.price}
                  </bdi>
                  <span className="text-sm text-muted-foreground">{plan.per}</span>
                </div>
                <p className="text-sm text-[color:var(--l-fg-2)]">{t(`${plan.id}.desc`)}</p>
                <ul className="grid gap-2.5 border-t pt-5 text-sm">
                  {features.map((_, i) => {
                    const missing = MISSING[plan.id].includes(i)
                    return (
                      <li key={i} className={cn("flex items-start gap-2.5", missing && "opacity-50")}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-[3px] size-4 shrink-0">
                          {missing ? <path d="M6 12h12" /> : <path d="M20 6 9 17l-5-5" />}
                        </svg>
                        <span className={cn(missing && "line-through decoration-current decoration-1")}>
                          {missing && <span className="sr-only">{t("notIncluded")}: </span>}
                          {t(`${plan.id}.features.${i}`, { count: String(components), variants: fmt.format(atomCounts.variants) })}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <Button asChild variant={plan.best ? "default" : "outline"} size="lg" className="mt-auto h-12 w-full rounded-[10px] text-[15px]">
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </Card>
            )
          })}
        </div>
        <p className="mt-7 text-center text-[13.5px] text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  )
}
