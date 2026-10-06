"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Button } from "@fasla-ui/ui/button/button"
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
 */
export function LandingNav() {
  const locale = useLocale()
  const t = useTranslations("landing.nav")
  const tc = useTranslations("landing.cta")
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
          <a href={landingLinks.github} className={navLink}>
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
            aria-label={t("theme")}
            className="text-muted-foreground [&_svg]:size-[18px]"
          >
            {/* Both drawn, CSS picks one, so the server render never guesses the theme. */}
            <MoonIcon className="dark:hidden" />
            <SunIcon className="hidden dark:block" />
          </Button>
          <Button asChild size="sm" className="max-[760px]:hidden">
            <Link href={landingLinks.docs(locale)}>{tc("start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
