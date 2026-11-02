"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Select } from "../../ui/select/select"
import { Switch } from "../../ui/switch/switch"
import { FooterCopyright, FooterLinkItem, FooterLogo, FooterSection, type FooterLink, type FooterLocale } from "../footer/footer"

/*
 * Figma: `Footer` (46380:22515), Type=Inline + Preferences.
 *
 * The logo and five links at the start; at the end the visitor's preferences:
 * a Switch (label first, sm) for dark mode, a Select (sm) for the language,
 * and the short copyright. Under a hairline.
 *
 * Desktop (1440) is one row, 24px above and below, the preferences 16px apart.
 * Tablet (768) stacks: the logo and links above, the preferences below with
 * the controls at their own size, 20px above and below. Mobile (360) stacks the
 * preferences too: the switch above the language field, both full width, then
 * the copyright, 16px above and below. In Arabic everything mirrors by the
 * page's `dir`; the Switch and Select are the atoms, so the thumb and the menu
 * follow the direction on their own.
 *
 * Motion is the atoms' own (the thumb, the menu under the field, flipping above
 * when there is no room). The block itself animates nothing: the demo toggles
 * only its own switch and select, not the page's colours.
 */

export type FooterTheme = "light" | "dark"

export interface FooterInlinePreferencesCopy {
  /** The links beside the logo. Hidden when empty. */
  links: FooterLink[]
  /** The accessible name of the links. */
  navLabel: string
  /** The Switch's label. */
  darkModeLabel: string
  /** The Select's accessible name. */
  languageLabel: string
  /** The Select's options. */
  languages: { value: string; label: string }[]
  /** The copyright line. */
  copyright: string
}

/** Figma's copy, English and Arabic. The language names are written in their own language in both. */
const COPY: Record<FooterLocale, FooterInlinePreferencesCopy> = {
  en: {
    links: ["Components", "Docs", "Pricing", "Blog", "Support"].map((label) => ({ label, href: "#" })),
    navLabel: "Footer",
    darkModeLabel: "Dark mode",
    languageLabel: "Language",
    languages: [
      { value: "en", label: "English (US)" },
      { value: "ar", label: "العربية" },
    ],
    copyright: "© 2026 Fasla",
  },
  ar: {
    links: ["المكوّنات", "التوثيق", "الأسعار", "المدونة", "الدعم"].map((label) => ({ label, href: "#" })),
    navLabel: "التذييل",
    darkModeLabel: "الوضع الداكن",
    languageLabel: "اللغة",
    languages: [
      { value: "en", label: "English (US)" },
      { value: "ar", label: "العربية" },
    ],
    copyright: "© 2026 فاصلة",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const footerInlinePreferencesCopy = COPY

export interface FooterInlinePreferencesProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "onChange">, Partial<FooterInlinePreferencesCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FooterLocale
  /** The theme, when the page controls it. Without it the switch keeps its own state. */
  theme?: FooterTheme
  /** The theme the switch starts on when uncontrolled. */
  defaultTheme?: FooterTheme
  /** Called with the new theme when the switch is toggled. The block never changes the page's colours itself. */
  onThemeChange?: (theme: FooterTheme) => void
  /** The language, when the page controls it. Without it the select keeps its own state. */
  language?: string
  /** The language the select starts on when uncontrolled. Defaults to the copy's own language. */
  defaultLanguage?: string
  /** Called with the chosen language value. */
  onLanguageChange?: (language: string) => void
}

export function FooterInlinePreferences({
  locale = "en",
  links,
  navLabel,
  darkModeLabel,
  languageLabel,
  languages,
  copyright,
  theme,
  defaultTheme = "light",
  onThemeChange,
  language,
  defaultLanguage,
  onLanguageChange,
  className,
  ...props
}: FooterInlinePreferencesProps) {
  const copy = COPY[locale]
  const items = links ?? copy.links
  const options = languages ?? copy.languages
  const [ownTheme, setOwnTheme] = React.useState<FooterTheme>(defaultTheme)
  const [ownLanguage, setOwnLanguage] = React.useState<string>(defaultLanguage ?? locale)
  const dark = (theme ?? ownTheme) === "dark"
  const chosen = language ?? ownLanguage
  return (
    <FooterSection className={cn("border-t border-border py-4 md:py-5 lg:py-6", className)} {...props}>
      <div className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:justify-between [@container(min-width:64rem)]:gap-8">
        <div className="flex flex-col items-start gap-4 [@container(min-width:40rem)]:gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-center [@container(min-width:64rem)]:gap-6">
          <FooterLogo className="h-[26px]" />
          {items.length ? (
            <nav aria-label={navLabel ?? copy.navLabel}>
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 [@container(min-width:40rem)]:gap-x-4 [@container(min-width:64rem)]:gap-x-5">
                {items.map((link) => (
                  <li key={`${link.label}-${link.href}`} className="flex">
                    <FooterLinkItem link={link} className="text-foreground" />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:64rem)]:gap-4">
          <Switch
            variant="solid"
            layout="label-first"
            size="sm"
            label={darkModeLabel ?? copy.darkModeLabel}
            checked={dark}
            onChange={(event) => {
              const next: FooterTheme = event.target.checked ? "dark" : "light"
              setOwnTheme(next)
              onThemeChange?.(next)
            }}
            className="[@container(min-width:40rem)]:shrink-0"
          />
          <Select
            size="sm"
            aria-label={languageLabel ?? copy.languageLabel}
            items={options}
            value={chosen}
            onValueChange={(next) => {
              if (next == null) return
              setOwnLanguage(next)
              onLanguageChange?.(next)
            }}
            className="w-full [@container(min-width:40rem)]:w-[150px] [@container(min-width:40rem)]:shrink-0"
          />
          <FooterCopyright>{copyright ?? copy.copyright}</FooterCopyright>
        </div>
      </div>
    </FooterSection>
  )
}
