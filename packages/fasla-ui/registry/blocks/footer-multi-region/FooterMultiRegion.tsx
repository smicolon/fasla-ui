"use client"

import * as React from "react"
import { ClockIcon, LanguagesIcon, MapPinIcon, type LucideIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Select, type SelectOption } from "../../ui/select/select"
import {
  FooterCopyright,
  FooterDot,
  FooterLegalLinks,
  FooterLogo,
  FooterRule,
  FooterSection,
  usePrefersReducedMotion,
  type FooterLink,
  type FooterLocale,
} from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Multi-Region.
 *
 * A region chooser: a title and line with three small Selects (region,
 * language, currency), six region cards (name, cities, languages, support
 * hours), a hairline, and the legal bar (the logo, a line about the prices'
 * currency, and four legal links).
 *
 * Desktop (Figma 1440): the title beside the Selects (200, 150, 150 wide); the
 * cards three across, 16px apart. Tablet (768): the Selects share a row under
 * the title, equal in width; the cards two across. Mobile (360): the Selects
 * stack; the cards one across.
 *
 * Choosing a region (the region Select, or a click or Enter on a card) gives
 * its card the `foreground` border, the same one a hover gives, and scrolls
 * that card into view only if it is below the fold. The cards are toggle
 * buttons (`aria-pressed`). Language and currency only change their Select.
 * There is no separate selected frame in Figma: Europe is chosen at first, as
 * the region Select shows it.
 *
 * Motion: a card's border goes `border` to `foreground` (160ms) on hover and
 * when chosen; from Tablet a hovering card also lifts 2px. Reduced motion
 * keeps the border change and drops the lift and the smooth scroll.
 */

export interface FooterRegion {
  /** The id the region Select and the cards share. */
  id: string
  name: string
  /** The cities, drawn with a small dot between them. */
  cities: string[]
  languages: string
  hours: string
}

export interface FooterMultiRegionCopy {
  title: string
  sub: string
  regionLabel: string
  languageLabel: string
  currencyLabel: string
  languages: SelectOption[]
  currencies: SelectOption[]
  regions: FooterRegion[]
  /** Accessible name of the region cards. */
  cardsLabel: string
  copyright: string
  legal: FooterLink[]
  legalLabel: string
}

const COPY: Record<FooterLocale, FooterMultiRegionCopy> = {
  en: {
    title: "Choose your region",
    sub: "Support hours, currency and legal terms differ by region.",
    regionLabel: "Region",
    languageLabel: "Language",
    currencyLabel: "Currency",
    languages: [
      { value: "en-us", label: "English (US)" },
      { value: "ar", label: "Arabic" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
    ],
    currencies: [
      { value: "eur", label: "EUR — Euro" },
      { value: "usd", label: "USD — US dollar" },
      { value: "gbp", label: "GBP — Pound sterling" },
      { value: "aed", label: "AED — Dirham" },
    ],
    regions: [
      { id: "europe", name: "Europe", cities: ["City 1", "City 2", "City 3"], languages: "English, German, French", hours: "Mon–Fri, 09:00–18:00 CET" },
      { id: "mena", name: "Middle East & North Africa", cities: ["City 1", "City 2", "City 3"], languages: "Arabic, English", hours: "Sun–Thu, 09:00–18:00 GST" },
      { id: "north-america", name: "North America", cities: ["City 1", "City 2"], languages: "English, French", hours: "Mon–Fri, 09:00–17:00 ET" },
      { id: "asia-pacific", name: "Asia Pacific", cities: ["City 1", "City 2"], languages: "English", hours: "Mon–Fri, 09:00–18:00 SGT" },
      { id: "south-asia", name: "South Asia", cities: ["City 1"], languages: "English, Hindi", hours: "Mon–Fri, 09:00–18:00 IST" },
      { id: "africa", name: "Africa", cities: ["City 1", "City 2"], languages: "English, French", hours: "Mon–Fri, 09:00–17:00 SAST" },
    ],
    cardsLabel: "Regions",
    copyright: "© 2026 Fasla. Prices shown in EUR.",
    legal: ["Privacy", "Terms", "Regional terms", "Cookies"].map((label) => ({ label, href: "#" })),
    legalLabel: "Legal",
  },
  ar: {
    title: "اختر منطقتك",
    sub: "تختلف ساعات الدعم والعملة والشروط القانونية حسب المنطقة.",
    regionLabel: "المنطقة",
    languageLabel: "اللغة",
    currencyLabel: "العملة",
    languages: [
      { value: "en-us", label: "الإنجليزية الأمريكية" },
      { value: "ar", label: "العربية" },
      { value: "fr", label: "الفرنسية" },
      { value: "de", label: "الألمانية" },
    ],
    currencies: [
      { value: "eur", label: "EUR، يورو" },
      { value: "usd", label: "USD، دولار أمريكي" },
      { value: "gbp", label: "GBP، جنيه إسترليني" },
      { value: "aed", label: "AED، درهم" },
    ],
    regions: [
      { id: "europe", name: "أوروبا", cities: ["مدينة 1", "مدينة 2", "مدينة 3"], languages: "الإنجليزية والألمانية والفرنسية", hours: "الاثنين–الجمعة، 09:00–18:00 CET" },
      { id: "mena", name: "الشرق الأوسط وشمال أفريقيا", cities: ["مدينة 1", "مدينة 2", "مدينة 3"], languages: "العربية والإنجليزية", hours: "الأحد–الخميس، 09:00–18:00 GST" },
      { id: "north-america", name: "أمريكا الشمالية", cities: ["مدينة 1", "مدينة 2"], languages: "الإنجليزية والفرنسية", hours: "الاثنين–الجمعة، 09:00–17:00 ET" },
      { id: "asia-pacific", name: "آسيا والمحيط الهادئ", cities: ["مدينة 1", "مدينة 2"], languages: "الإنجليزية", hours: "الاثنين–الجمعة، 09:00–18:00 SGT" },
      { id: "south-asia", name: "جنوب آسيا", cities: ["مدينة 1"], languages: "الإنجليزية والهندية", hours: "الاثنين–الجمعة، 09:00–18:00 IST" },
      { id: "africa", name: "أفريقيا", cities: ["مدينة 1", "مدينة 2"], languages: "الإنجليزية والفرنسية", hours: "الاثنين–الجمعة، 09:00–17:00 SAST" },
    ],
    cardsLabel: "المناطق",
    copyright: "© 2026 فاصلة. الأسعار معروضة باليورو.",
    legal: ["الخصوصية", "الشروط", "الشروط الإقليمية", "ملفات تعريف الارتباط"].map((label) => ({ label, href: "#" })),
    legalLabel: "قانوني",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerMultiRegionCopy = COPY

export interface FooterMultiRegionProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onChange">, Partial<FooterMultiRegionCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The region chosen at first: an id from `regions`. Pass `null` for none. */
  defaultRegion?: string | null
  /** Called with the id when a region is chosen, by the Select or by a card. */
  onRegionChange?: (id: string) => void
}

/** Latin runs (zones, times) keep their own order inside Arabic text. */
function Bidi({ text, active }: { text: string; active: boolean }) {
  if (!active) return <>{text}</>
  return (
    <>
      {text.split(/([A-Za-z0-9+][A-Za-z0-9:.–@+/ ]*[A-Za-z0-9]|[A-Za-z0-9])/).map((part, i) =>
        i % 2 ? (
          <bdi key={i} dir="ltr">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  )
}

function RegionLine({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">{children}</span>
    </span>
  )
}

export function FooterMultiRegion({
  locale = "en",
  title,
  sub,
  regionLabel,
  languageLabel,
  currencyLabel,
  languages,
  currencies,
  regions,
  cardsLabel,
  copyright,
  legal,
  legalLabel,
  defaultRegion = "europe",
  onRegionChange,
  className,
  ...props
}: FooterMultiRegionProps) {
  const copy = COPY[locale]
  const ar = locale === "ar"
  const reduced = usePrefersReducedMotion()
  const list = regions ?? copy.regions
  const languageItems = languages ?? copy.languages
  const currencyItems = currencies ?? copy.currencies
  const links = legal ?? copy.legal
  const [region, setRegion] = React.useState<string | null>(defaultRegion)
  const cardRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const regionItems = React.useMemo<SelectOption[]>(() => list.map((r) => ({ value: r.id, label: r.name })), [list])

  const choose = (id: string) => {
    setRegion(id)
    onRegionChange?.(id)
    const card = cardRefs.current.get(id)
    if (card && typeof window !== "undefined" && card.getBoundingClientRect().bottom > window.innerHeight) {
      card.scrollIntoView?.({ block: "nearest", behavior: reduced ? "auto" : "smooth" })
    }
  }

  const heading = title ?? copy.title
  const line = sub ?? copy.sub
  const selectClass = "w-full [@container(min-width:40rem)]:flex-1"
  return (
    <FooterSection
      className={cn("border-t border-border py-8 md:py-16 lg:pb-8 lg:pt-16", className)}
      contentClassName="gap-5 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:gap-10"
      {...props}
    >
      <div className="flex flex-col gap-6 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-10">
        <div className="flex min-w-0 flex-col gap-2 [@container(min-width:64rem)]:max-w-[520px]">
          <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
          {line ? <p className="text-sm text-muted-foreground">{line}</p> : null}
        </div>
        <div className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:shrink-0">
          {regionItems.length > 0 ? (
            <Select
              size="sm"
              aria-label={regionLabel ?? copy.regionLabel}
              items={regionItems}
              value={region}
              onValueChange={(value) => value && choose(value)}
              className={cn(selectClass, "[@container(min-width:64rem)]:w-[200px] [@container(min-width:64rem)]:flex-none")}
            />
          ) : null}
          {languageItems.length > 0 ? (
            <Select
              size="sm"
              aria-label={languageLabel ?? copy.languageLabel}
              items={languageItems}
              defaultValue={(ar ? languageItems.find((item) => item.value === "ar") : undefined)?.value ?? languageItems[0]?.value}
              className={cn(selectClass, "[@container(min-width:64rem)]:w-[150px] [@container(min-width:64rem)]:flex-none")}
            />
          ) : null}
          {currencyItems.length > 0 ? (
            <Select
              size="sm"
              aria-label={currencyLabel ?? copy.currencyLabel}
              items={currencyItems}
              defaultValue={currencyItems[0]?.value}
              className={cn(selectClass, "[@container(min-width:64rem)]:w-[150px] [@container(min-width:64rem)]:flex-none")}
            />
          ) : null}
        </div>
      </div>
      {list.length > 0 ? (
        <ul aria-label={cardsLabel ?? copy.cardsLabel} className="grid grid-cols-1 gap-4 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
          {list.map((item) => (
            <li key={item.id} className="flex">
              <button
                type="button"
                ref={(node) => {
                  if (node) cardRefs.current.set(item.id, node)
                  else cardRefs.current.delete(item.id)
                }}
                aria-pressed={region === item.id}
                onClick={() => choose(item.id)}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-stretch gap-2 rounded-lg border bg-card p-3 text-start [@container(min-width:40rem)]:p-4 [@container(min-width:64rem)]:p-5",
                  "transition-[border-color,transform] duration-[160ms] motion-reduce:transition-none",
                  "[outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  region === item.id ? "border-foreground" : "border-border",
                  "hover:[@container(min-width:40rem)]:border-foreground hover:[@container(min-width:40rem)]:motion-safe:-translate-y-0.5"
                )}
              >
                <span className="text-sm font-semibold text-card-foreground">{item.name}</span>
                {item.cities.length > 0 ? (
                  <RegionLine icon={MapPinIcon}>
                    {item.cities.map((city, index) => (
                      <React.Fragment key={`${city}-${index}`}>
                        {index > 0 ? <FooterDot /> : null}
                        <span>{city}</span>
                      </React.Fragment>
                    ))}
                  </RegionLine>
                ) : null}
                {item.languages ? <RegionLine icon={LanguagesIcon}>{item.languages}</RegionLine> : null}
                {item.hours ? (
                  <RegionLine icon={ClockIcon}>
                    <Bidi text={item.hours} active={ar} />
                  </RegionLine>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <FooterRule />
      <div className="flex flex-col gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:justify-between [@container(min-width:40rem)]:gap-6">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-6" />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
        </div>
        {links.length ? <FooterLegalLinks links={links} label={legalLabel ?? copy.legalLabel} /> : null}
      </div>
    </FooterSection>
  )
}
