import { getTranslations } from "next-intl/server"
import { SectionHead, StrokedWord } from "./section-head"
import { WallColumns, type WallItem } from "./wall-columns"
import { platformSite, type Platform } from "./wall-platforms"

/**
 * Smicolon's published testimonials, newest first, as smicolon.com shows them
 * (its CMS, read 6 Oct 2026). The quotes and roles are in the message files:
 * the English word for word, the Arabic translated. Names stay as written.
 * A badge links to the review where it was posted; testimonials sent to
 * Smicolon directly have none.
 */
const PEOPLE: { name: string; initials: string; platform?: Platform; href?: string }[] = [
  { name: "Rasmus Aaberg", initials: "RA" },
  { name: "Sean Holland", initials: "SH", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Rad Dougall", initials: "RD", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Kurt Thigpen", initials: "KT", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Raymond Jenkins", initials: "RJ", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Amaroua Zidani", initials: "AZ", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Claudio Kantner", initials: "CK" },
  { name: "Zayad Abeya", initials: "ZA" },
  { name: "Namit Jindal", initials: "NJ", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Jeremy", initials: "J", platform: "upwork", href: "https://www.upwork.com/agencies/smicolon/" },
  { name: "Mahmoud Darweash", initials: "MD" },
  { name: "Melvin Raaj", initials: "MR", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/201975" },
  { name: "Justin Weiland", initials: "JW", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/246485" },
  { name: "Alexander Chumak", initials: "AC", platform: "clutch", href: "https://clutch.co/go-to-review/65426c35-7d85-44c8-bca7-a73fdacc7f0e/322812" },
]

/**
 * "Smicolon clients on the Wall of Love." Smicolon's real testimonials in
 * columns that drift slowly, the middle one the other way, pausing while
 * pointed at or focused (WallColumns).
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
