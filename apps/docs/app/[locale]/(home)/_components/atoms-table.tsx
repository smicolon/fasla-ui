import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { atomCounts, atoms } from "@/lib/atoms"
import { AtomIcon } from "./atom-icons"
import { SectionHead, Stroked } from "./section-head"

/** Western digits with grouping, in both languages. */
const fmt = new Intl.NumberFormat("en-US")

const cell =
  "group flex min-h-[76px] flex-1 items-center gap-2.5 py-4 pe-4 ps-5 transition-colors max-[760px]:min-h-16 max-[760px]:pe-3 max-[760px]:ps-3.5"

/**
 * Every component in the open-source package, as one contained table: each
 * component's name in the page language, effects marked as such, and a link to
 * its docs page where it has one. Five columns, then four, three, two and one
 * as the screen narrows; one frame closes the table, empty end cells included.
 *
 * Read from the source registry through lib/atoms.ts, so the table lists what
 * the CLI installs. Counts reach the messages as formatted strings: next-intl
 * would set a raw number in Arabic digits on the Arabic page.
 */
export async function AtomsTable() {
  const locale = await getLocale()
  const t = await getTranslations("landing.atoms")

  return (
    <section aria-labelledby="reg-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead
          id="reg-h"
          center
          title={<Stroked text={t("title", { count: atomCounts.total, n: fmt.format(atomCounts.total) })} />}
          lede={t("lede")}
        />

        <ul className="relative grid grid-cols-5 overflow-hidden rounded-[14px] bg-background after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:border after:border-border after:content-[''] max-[1100px]:grid-cols-4 max-[900px]:grid-cols-3 max-[760px]:grid-cols-2 max-[380px]:grid-cols-1">
          {atoms.map((atom) => {
            const name = t.has(`names.${atom.slug}`) ? t(`names.${atom.slug}`) : atom.name
            const body = (
              <>
                <AtomIcon
                  name={atom.name}
                  className="size-[18px] shrink-0 text-[color:var(--l-fg-2)] transition-colors group-hover:text-foreground"
                />
                <span className="line-clamp-2 min-w-0 flex-1 text-[15px] font-medium leading-[1.3] max-[760px]:text-sm">{name}</span>
                {atom.kind === "effects" && (
                  <span className="inline-flex h-5 shrink-0 items-center rounded-full border px-[7px] text-[11.5px] text-[color:var(--l-fg-2)]">
                    {t("effect")}
                  </span>
                )}
              </>
            )
            return (
              <li key={atom.slug} className="relative flex border-b border-e bg-background">
                {atom.path ? (
                  <Link
                    href={`/${locale}${atom.path}`}
                    className={`${cell} hover:bg-[color:var(--l-bg-2)] focus-visible:z-[3] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring`}
                  >
                    {body}
                  </Link>
                ) : (
                  <div className={cell}>{body}</div>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-sm text-[color:var(--l-fg-2)]">
          <span>{t("foot")}</span>
          <span
            dir="ltr"
            className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border bg-background px-3 py-2 font-mono text-[13px] text-foreground [unicode-bidi:isolate]"
          >
            npx @smicolon/fasla-ui@latest add button  →  components/ui/button.tsx
          </span>
        </div>
      </div>
    </section>
  )
}
