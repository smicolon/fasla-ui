import { getTranslations } from "next-intl/server"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { cn } from "@/lib/utils"
import { SectionHead, StrokedWord } from "./section-head"

/** Where each review was posted, and the platform marks, drawn in one colour. */
const SOURCE = ["x.com", "linkedin.com", "producthunt.com", "x.com", "linkedin.com", "github.com", "reddit.com", "producthunt.com", "github.com", "linkedin.com", "x.com", "reddit.com"] as const

const MARK: Record<(typeof SOURCE)[number], React.ReactNode> = {
  "x.com": <path d="M17.8 3h3.1l-6.8 7.8 8 10.2h-6.3l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.8 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.4 4.7H5.6z" />,
  "github.com": (
    <path d="M12 1.5a10.5 10.5 0 0 0-3.3 20.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7 0-.7 0-.7 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.3-.3-4.8-1.2-4.8-5.2 0-1.1.4-2.1 1.1-2.8-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 2.9 1.1a10 10 0 0 1 5.2 0c2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.8 0 4-2.5 4.9-4.8 5.2.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.5 10.5 0 0 0 12 1.5z" />
  ),
  "linkedin.com": <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zm7 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6v5.4h-4v-4.8c0-1.2 0-2.6-1.6-2.6s-1.9 1.3-1.9 2.5v4.9h-4z" />,
  "reddit.com": (
    <path d="M20 11.6a1.9 1.9 0 0 0-3.2-1.3 9 9 0 0 0-4.6-1.4l.8-3.6 2.6.6a1.3 1.3 0 1 0 .2-.9l-3-.6a.4.4 0 0 0-.5.3l-.9 4.2a9 9 0 0 0-4.7 1.4 1.9 1.9 0 1 0-2 3.1v.6c0 3 3.4 5.4 7.6 5.4s7.6-2.4 7.6-5.4v-.6A1.9 1.9 0 0 0 20 11.6zM8.6 13a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0zm6.8 3.3a4.5 4.5 0 0 1-3.4 1 4.5 4.5 0 0 1-3.4-1 .3.3 0 0 1 .4-.4 3.9 3.9 0 0 0 3 .8 3.9 3.9 0 0 0 3-.8.3.3 0 0 1 .4.4zm-.2-2.1a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" />
  ),
  "producthunt.com": (
    <path transform="translate(2.4 2.4) scale(.8)" d="M13.6 8.4H10v3.6h3.6a1.8 1.8 0 0 0 0-3.6zM12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm1.6 14.4H10V18H7.6V6h6a4.2 4.2 0 0 1 0 8.4z" />
  ),
}

/** Three columns, each read top to bottom. */
const COLUMNS = [
  [0, 3, 6, 9],
  [1, 4, 7, 10],
  [2, 5, 8, 11],
]

type Review = { name: string; who: string; t: string }

function ReviewCard({ review, i }: { review: Review; i: number }) {
  const source = SOURCE[i]
  return (
    <article className="rounded-[14px] border bg-card px-[22px] py-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <Avatar src={`/landing/img/wall/av-${i}.webp`} name="" radius="rounded" loading="lazy" className="size-11" />
        <span className="flex min-w-0 flex-1 flex-col items-start">
          <b className="w-full truncate text-[15px] font-semibold leading-[1.3]">{review.name}</b>
          <span className="text-[13px] leading-[1.3] text-muted-foreground">{review.who}</span>
        </span>
        <span dir="ltr" className="inline-flex shrink-0 items-center gap-[7px] self-start font-sans text-[13px] text-[color:var(--l-fg-2)]">
          <span className="grid size-[22px] place-items-center rounded-full bg-foreground text-background">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3 fill-current">
              {MARK[source]}
            </svg>
          </span>
          {source}
        </span>
      </div>
      <p className="line-clamp-3 text-[15px] leading-[1.6] text-[color:var(--l-fg-2)] rtl:leading-[1.8]">{review.t}</p>
    </article>
  )
}

/**
 * "The Wall of Love." Twelve reviews in three columns that drift slowly, the
 * middle one the other way, pausing while pointed at. Each column's cards are
 * repeated once, hidden from assistive technology, so the loop is seamless.
 *
 * The reviews are illustrative and labelled so; Yasmin decides on them
 * before the page ships.
 */
export async function ReviewWall() {
  const t = await getTranslations("landing.wall")
  const reviews = t.raw("reviews") as Review[]

  return (
    <section aria-labelledby="wall-h" className="l-sec pt-0">
      <div className="l-wrap">
        <SectionHead
          id="wall-h"
          center
          title={
            <>
              {t("title")}{" "}
              <StrokedWord className="text-fasla-red">{t("love")}</StrokedWord>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="l-heart ms-[.18em] inline-block size-[.78em] align-[-0.04em] text-fasla-red">
                <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.4C.9 8 3 4 7 4c2.1 0 3.6 1.1 5 2.9C13.4 5.1 14.9 4 17 4c4 0 6.1 4 4.6 7.6C19.5 16.4 12 21 12 21z" />
              </svg>
            </>
          }
          lede={t("lede")}
        />

        <div className="l-wall grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
          {COLUMNS.map((column, c) => (
            <div key={c} className={cn("l-wall-col flex flex-col gap-5", c === 2 && "max-[1000px]:hidden", c === 1 && "max-[640px]:hidden")}>
              {column.map((i) => (
                <ReviewCard key={i} review={reviews[i]} i={i} />
              ))}
              <div aria-hidden="true" className="contents">
                {column.map((i) => (
                  <ReviewCard key={i} review={reviews[i]} i={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{t("note")}</p>
      </div>
    </section>
  )
}
