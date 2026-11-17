"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Button } from "@fasla-ui/ui/button/button"
import { MobileMenuButton, MobileMenuPanel, useMobileMenu } from "@/components/mobile-menu"
import { cn } from "@/lib/utils"
import { MoonIcon, SunIcon } from "./icons"
import { Lockup } from "./lockup"
import { landingLinks } from "./links"
import { useLocaleFlip } from "./locale-flip"

const navLink =
  "rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

/**
 * The home page's own header: a full-width sticky bar, where the docs keep the
 * floating SiteHeader. Its three groups carry view-transition names so they
 * cross-fade in place, rather than slide, when the page flips direction.
 * Below 760px the links fold into the same phone menu the docs header uses.
 */
export function LandingNav() {
  const locale = useLocale()
  const t = useTranslations("landing.nav")
  const tc = useTranslations("landing.cta")
  const tn = useTranslations("nav")
  const menu = useMobileMenu("landing-menu")
  const { flip } = useLocaleFlip()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="l-wrap flex h-16 items-center gap-6 max-[760px]:gap-3">
        <Link
          href={`/${locale}/`}
          aria-label={t("home")}
          className="inline-flex rounded-md [view-transition-name:nav-logo]"
        >
          <Lockup height={30} />
        </Link>

        <nav aria-label={t("label")} className="ms-2 flex gap-1 [view-transition-name:nav-links] max-[760px]:hidden">
          <Link href={landingLinks.docs(locale)} className={navLink}>
            {t("docs")}
          </Link>
          <Link href={landingLinks.components(locale)} className={navLink}>
            {t("components")}
          </Link>
          <Link href={landingLinks.blocks(locale)} className={navLink}>
            {t("blocks")}
          </Link>
          <Link href={landingLinks.templates(locale)} className={navLink}>
            {t("templates")}
          </Link>
          <a href={landingLinks.github} target="_blank" rel="noopener noreferrer" className={navLink}>
            {t("github")}
          </a>
        </nav>

        <div className="ms-auto flex items-center gap-2 [view-transition-name:nav-end]">
          {/* Named in the language it switches to, set in that language's face. */}
          <Button
            variant="ghost"
            onClick={() => flip()}
            aria-label={t("langLabel")}
            lang={locale === "ar" ? "en" : "ar"}
            className={cn(
              "h-9 px-2.5 text-sm font-normal text-muted-foreground",
              locale === "ar" ? "font-sans" : "font-arabic"
            )}
          >
            {t("lang")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="text-muted-foreground [&_svg]:size-[18px]"
          >
            {/* The theme in effect, as the docs header shows it: the sun while the
                page is light, the moon while it is dark. Both drawn, and both
                names, CSS picks one, so the server render never guesses the
                theme. The name says what a press does. */}
            <SunIcon className="dark:hidden" />
            <MoonIcon className="hidden dark:block" />
            <span className="sr-only dark:hidden">{tn("themeToDark")}</span>
            <span className="sr-only hidden dark:inline">{tn("themeToLight")}</span>
          </Button>
          <Button asChild size="sm" className="max-[760px]:hidden">
            <Link href={landingLinks.docs(locale)}>{tc("start")}</Link>
          </Button>
          <MobileMenuButton
            menu={menu}
            label={tn("toggleMenu")}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[761px]:hidden"
          />
        </div>
      </div>

      <MobileMenuPanel
        menu={menu}
        links={[
          { href: landingLinks.docs(locale), label: t("docs") },
          { href: landingLinks.components(locale), label: t("components") },
          { href: landingLinks.blocks(locale), label: t("blocks") },
          { href: landingLinks.templates(locale), label: t("templates") },
          { href: landingLinks.github, label: t("github"), newTab: true },
        ]}
        cta={{ href: landingLinks.docs(locale), label: tc("start") }}
        className="absolute inset-x-0 top-full border-b bg-background px-4 pb-4 pt-2 shadow-lg min-[761px]:hidden"
      />
    </header>
  )
}
