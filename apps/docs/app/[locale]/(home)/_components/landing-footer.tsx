import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { FaslaMark } from "./fasla-mark"
import { landingLinks } from "./links"
import { Lockup } from "./lockup"

const footLink = "text-muted-foreground transition-colors hover:text-foreground"

/**
 * Lockup, the line about who builds Fasla, the links, the description that
 * replaced the photo credits, and the big mark set in the page's language.
 */
export async function LandingFooter() {
  const locale = await getLocale()
  const t = await getTranslations("landing.footer")
  const tn = await getTranslations("landing.nav")

  // The rule sits on <footer>, outside .l-wrap, so it runs edge to edge.
  return (
    <footer className="overflow-hidden border-t border-border pt-14 text-sm text-muted-foreground">
      <div className="l-wrap">
        <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-6">
          <div>
            <Link href={`/${locale}/`} aria-label={tn("home")} className="inline-flex rounded-md">
              <Lockup height={28} />
            </Link>
            <p className="mt-3.5 max-w-[40ch]">{t("line")}</p>
            <p dir="ltr" className="mt-1 text-muted-foreground/80 rtl:text-end">
              {t("place")}
            </p>
          </div>
          <nav aria-label={t("nav")} className="flex flex-wrap gap-x-7 gap-y-2">
            <Link href={landingLinks.docs(locale)} className={footLink}>
              {tn("docs")}
            </Link>
            <Link href={landingLinks.components(locale)} className={footLink}>
              {tn("components")}
            </Link>
            <a href={landingLinks.github} className={footLink}>
              {tn("github")}
            </a>
          </nav>
        </div>
        <p className="mt-6 max-w-[90ch] text-xs text-muted-foreground">{t("credits")}</p>
        {/* Decorative: the page already names Fasla. The word is set in the
            page's language and leads its reading direction. */}
        <div
          aria-hidden="true"
          className="mt-14 flex select-none items-end gap-[.12em] pb-[.04em] text-[clamp(72px,19vw,300px)] font-bold leading-[.8] tracking-[-0.04em] text-foreground rtl:leading-none"
        >
          <FaslaMark className="mb-[.06em] size-[.7em] rtl:mb-[.2em]" />
          <span>{t("word")}</span>
        </div>
      </div>
    </footer>
  )
}
