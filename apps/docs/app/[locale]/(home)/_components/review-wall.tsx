import { getTranslations } from "next-intl/server"
import { SectionHead, StrokedWord } from "./section-head"
import { WallColumns, type WallItem } from "./wall-columns"
import { platformSite, type Platform } from "./wall-platforms"

/**
 * Smicolon's published testimonials, newest first, as smicolon.com shows them
 * (its CMS, read 6 Oct 2026). The quotes and roles are in the message files:
 * the English word for word, the Arabic translated, except that "Smicolon"
 * inside a quote reads "the team" («الفريق»), with only the grammar
 * around it adjusted. Names stay as written.
 * For the three Clutch reviews the quote is the reviewer's own heading there:
 * the body smicolon.com shows for them is Clutch's third-person summary.
 * The pictures are the ones smicolon.com shows: Rasmus Aaberg's photo, and
 * each company's logo for the rest.
 * A badge links to the review where it was posted; testimonials sent to
 * Smicolon directly have none.
 */
const PEOPLE: { name: string; image: string; kind: "photo" | "logo"; platform?: Platform; href?: string }[] = [
  { name: "Rasmus Aaberg", image: "/landing/img/wall/rasmus-aaberg.webp", kind: "photo" },
  { name: "Sean Holland", image: "/landing/img/wall/sean-holland.svg", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Rad Dougall", image: "/landing/img/wall/rad-dougall.png", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Kurt Thigpen", image: "/landing/img/wall/kurt-thigpen.png", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Raymond Jenkins", image: "/landing/img/wall/raymond-jenkins.png", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Amaroua Zidani", image: "/landing/img/wall/amaroua-zidani.svg", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Claudio Kantner", image: "/landing/img/wall/claudio-kantner.png", kind: "logo" },
  { name: "Zayad Abeya", image: "/landing/img/wall/zayad-abeya.svg", kind: "logo" },
  { name: "Namit Jindal", image: "/landing/img/wall/namit-jindal.png", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Jeremy", image: "/landing/img/wall/jeremy.png", kind: "logo", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Mahmoud Darweash", image: "/landing/img/wall/mahmoud-darweash.svg", kind: "logo" },
  { name: "Melvin Raaj", image: "/landing/img/wall/melvin-raaj.png", kind: "logo", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/201975" },
  { name: "Justin Weiland", image: "/landing/img/wall/justin-weiland.png", kind: "logo", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/246485" },
  { name: "Alexander Chumak", image: "/landing/img/wall/alexander-chumak.svg", kind: "logo", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/322812" },
]

/**
 * "The Wall of Love." Smicolon's real testimonials in columns that drift
 * slowly, the middle one the other way, pausing while pointed at or focused
 * (WallColumns).
 */
export async function ReviewWall() {
  const t = await getTranslations("landing.wall")
  const reviews = t.raw("reviews") as { who: string; t: string }[]
  const items: WallItem[] = PEOPLE.map((person, i) => ({
    ...person,
    ...reviews[i],
    label: person.platform ? t("reviewLabel", { name: person.name, site: platformSite(person.platform) }) : undefined,
  }))

  return (
    <section aria-labelledby="wall-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead
          id="wall-h"
          center
          title={
            <>
              {t.rich("title", { love: (chunks) => <StrokedWord className="text-fasla-red">{chunks}</StrokedWord> })}
              <svg viewBox="0 0 24 24" aria-hidden="true" className="l-heart ms-[.18em] inline-block size-[.78em] align-[-0.04em] text-fasla-red">
                <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.4C.9 8 3 4 7 4c2.1 0 3.6 1.1 5 2.9C13.4 5.1 14.9 4 17 4c4 0 6.1 4 4.6 7.6C19.5 16.4 12 21 12 21z" />
              </svg>
            </>
          }
          lede={t("lede")}
        />
        <WallColumns items={items} />
      </div>
    </section>
  )
}
