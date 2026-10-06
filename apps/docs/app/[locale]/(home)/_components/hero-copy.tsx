import { createTranslator } from "next-intl"
import { cn } from "@/lib/utils"
import ar from "@/messages/ar.json"
import en from "@/messages/en.json"

/**
 * The hero's title and the line under it, each in a box that keeps one
 * height in both languages, so the switch, the buttons and the toggle under
 * them never move when the page flips.
 *
 * Each box (Reserve) is a one-cell grid holding the visible text and an
 * invisible copy in the other language. The cell takes the taller of the two
 * at every width (the sizes are fluid, so a fixed min-height would drift
 * between breakpoints), and the visible text is centred in it.
 *
 * Styles are picked by language rather than with `rtl:`: that variant matches
 * any RTL ancestor, so the English copy on the Arabic page would take the
 * Arabic sizes. The page's one H1 stays written out in page.tsx.
 */

type Lang = "en" | "ar"

const messages = { en, ar }

const hero = (lang: Lang) => createTranslator({ locale: lang, messages: messages[lang], namespace: "landing.hero" })

export const heroLangs = (locale: string) =>
  (locale === "ar" ? { lang: "ar", other: "en" } : { lang: "en", other: "ar" }) as { lang: Lang; other: Lang }

/** A one-cell grid: the visible text and its other-language `ghost`, centred in the taller of the two. */
export function Reserve({ ghost, className, children }: { ghost: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid place-items-center [&>*]:[grid-area:1/1]", className)}>
      {children}
      {ghost}
    </div>
  )
}

/** The invisible copy: not read, not focusable, not quoted in search results. */
const ghostProps = (lang: Lang) =>
  ({ "aria-hidden": true, "data-nosnippet": "", dir: lang === "ar" ? "rtl" : "ltr", lang }) as const

export const titleClass = (lang: Lang, ghost = false) =>
  cn(
    "inline-block max-w-full bg-background px-3 py-2 tracking-[-0.04em] [text-wrap:balance]",
    lang === "ar"
      ? "font-arabic text-[length:clamp(34px,4.8vw,68px)] font-extrabold leading-[1.34]"
      : "font-sans text-[length:clamp(36px,5vw,72px)] font-bold leading-[1.04]",
    ghost ? "invisible" : "[view-transition-name:hero-title]"
  )

export function TitleText({ lang }: { lang: Lang }) {
  return hero(lang).rich("title", {
    nb: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
    // "components & templates" stays on one line until phones.
    nb3: (chunks) => <span className="min-[761px]:whitespace-nowrap">{chunks}</span>,
    // The red marker behind the first key word, tilted against the reading direction.
    mark: (chunks) => (
      <mark
        className={cn(
          "relative z-0 -mx-[.02em] inline-block bg-transparent px-[.16em] pb-[.02em] text-fasla-white before:absolute before:inset-x-0 before:-z-10 before:rounded-[.14em] before:bg-fasla-red before:content-['']",
          lang === "ar"
            ? "before:bottom-[.06em] before:top-[.2em] before:rotate-[1.6deg]"
            : "before:bottom-[.02em] before:top-[.1em] before:-rotate-[1.6deg]"
        )}
      >
        {chunks}
      </mark>
    ),
    // The brand's comma, in red and in Cairo in both languages.
    comma: (chunks) => <span className="font-arabic text-fasla-red">{chunks}</span>,
    br: () => <br />,
  })
}

export function TitleGhost({ lang }: { lang: Lang }) {
  return (
    <div {...ghostProps(lang)} className={titleClass(lang, true)}>
      <TitleText lang={lang} />
    </div>
  )
}

export function Sub({ lang, ghost = false }: { lang: Lang; ghost?: boolean }) {
  return (
    <p
      {...(ghost ? ghostProps(lang) : {})}
      className={cn(
        "mx-auto bg-background px-2 py-1 text-[length:clamp(16px,1.4vw,19px)] text-foreground/70 dark:text-foreground/[.78]",
        lang === "ar" ? "max-w-[60ch] font-arabic leading-[1.75]" : "max-w-[54ch] font-sans leading-normal",
        ghost && "invisible"
      )}
    >
      {hero(lang)("sub")}
    </p>
  )
}
