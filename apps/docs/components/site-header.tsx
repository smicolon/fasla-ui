"use client"

import Link from "next/link"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import { ThemeToggle } from "./theme-toggle"
import { LocaleSwitcher } from "./locale-switcher"
import { MobileMenuButton, MobileMenuPanel, useMobileMenu } from "./mobile-menu"
import { localeDirection, type Locale } from "@/i18n/routing"

export function SiteHeader() {
  const menu = useMobileMenu("mobile-menu")
  const t = useTranslations("nav")
  const locale = useLocale() as Locale
  const dir = localeDirection[locale]
  // The lockup leads the reading direction: left in LTR, right in RTL (§09).
  const lockup = dir === "rtl" ? "rtl" : "ltr"
  const p = (path: string) => `/${locale}${path}`

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex items-center gap-2 rounded-full border border-border/40 bg-background/80 px-3 sm:px-4 py-2 shadow-lg shadow-foreground/5 backdrop-blur-md">
        {/* Logo */}
        <Link
          href={p("")}
          aria-label={t("home")}
          className="flex items-center pe-4 sm:pe-6 border-e border-border/40 me-1 sm:me-2"
        >
          {/* Drawn lockup, never re-set type (§11). 30px tall = 93px wide, above the
              90px minimum (§10). Wordmark is ink on light, white on dark (§08). */}
          <Image
            src={`/brand/fasla-lockup-${lockup}.svg`}
            alt={t("home")}
            width={93}
            height={30}
            priority
            className="h-[26px] w-auto sm:h-[30px] dark:hidden"
          />
          <Image
            src={`/brand/fasla-lockup-${lockup}-onDark.svg`}
            alt={t("home")}
            width={93}
            height={30}
            priority
            className="hidden h-[26px] w-auto sm:h-[30px] dark:block"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={p("/docs")}
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            {t("docs")}
          </Link>
          <Link
            href={p("/docs/components/button")}
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            {t("components")}
          </Link>
          <Link
            href={p("/coming-soon/")}
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            {t("blocks")}
          </Link>
          <Link
            href={p("/coming-soon/")}
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            {t("templates")}
          </Link>
          <Link
            href="https://github.com/smicolon/fasla-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-full hover:bg-accent"
          >
            {t("github")}
          </Link>
        </div>

        {/* Right: Theme + Get Started + Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-2 ps-1 sm:ps-2 border-s border-border/40">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href={p("/docs")}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-foreground px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {t("getStarted")}
          </Link>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            menu={menu}
            label={t("toggleMenu")}
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          />
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <MobileMenuPanel
        menu={menu}
        links={[
          { href: p("/docs"), label: t("docs") },
          { href: p("/docs/components/button"), label: t("components") },
          { href: p("/coming-soon/"), label: t("blocks") },
          { href: p("/coming-soon/"), label: t("templates") },
          { href: "https://github.com/smicolon/fasla-ui", label: t("github"), newTab: true },
        ]}
        cta={{ href: p("/docs"), label: t("getStarted") }}
        className="md:hidden absolute inset-x-4 top-full mt-2 rounded-2xl border border-border/40 bg-background shadow-lg p-4 animate-in fade-in slide-in-from-top-2"
      />
    </header>
  )
}
