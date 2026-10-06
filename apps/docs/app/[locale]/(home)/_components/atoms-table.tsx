import { getTranslations } from "next-intl/server"
import { atomCounts, atoms } from "@/lib/atoms"
import { AtomIcon } from "./atom-icons"
import { SectionHead, Stroked } from "./section-head"

/** Western digits with grouping, in both languages. */
const fmt = new Intl.NumberFormat("en-US")

/**
 * The atoms in the Figma file, as one contained table: each atom's name in the
 * page language and its Figma variant count. Five columns, then four, three,
 * two and one as the screen narrows; one frame closes the table, empty end
 * cells included.
 *
 * Read from design/index-atoms.json through lib/atoms.ts. Counts reach the
 * messages as formatted strings: next-intl would set a raw number in Arabic
 * digits on the Arabic page.
 */
export async function AtomsTable() {
  const t = await getTranslations("landing.atoms")
  const n = fmt.format(atomCounts.atoms)

  return (
    <section aria-labelledby="reg-h" className="pb-[var(--l-section)]">
      <div className="l-wrap">
        <SectionHead
          id="reg-h"
          center
          title={<Stroked text={t("title", { variants: fmt.format(atomCounts.variants) })} />}
          lede={t("lede", { atoms: atomCounts.atoms, n })}
        />

        <ul className="relative grid grid-cols-5 overflow-hidden rounded-[14px] bg-background after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:border after:border-border after:content-[''] max-[1100px]:grid-cols-4 max-[900px]:grid-cols-3 max-[760px]:grid-cols-2 max-[380px]:grid-cols-1">
          {atoms.map((atom) => {
            const name = t.has(`names.${atom.name}`) ? t(`names.${atom.name}`) : atom.name
            const count = fmt.format(atom.variants)
            return (
              <li
                key={atom.name}
                className="group relative flex min-h-[76px] items-center gap-2.5 border-b border-e bg-background py-4 pe-4 ps-5 transition-colors hover:bg-[color:var(--l-bg-2)] max-[760px]:min-h-16 max-[760px]:pe-3 max-[760px]:ps-3.5"
              >
                <AtomIcon
                  name={atom.name}
                  className="size-[18px] shrink-0 text-[color:var(--l-fg-2)] transition-colors group-hover:text-foreground"
                />
                <span className="line-clamp-2 min-w-0 flex-1 text-[15px] font-medium leading-[1.3] max-[760px]:text-sm">{name}</span>
                <span
                  aria-hidden="true"
                  className="inline-flex h-5 shrink-0 items-center rounded-full border px-[7px] font-sans text-[11.5px] tabular-nums text-[color:var(--l-fg-2)]"
                >
                  {count}
                </span>
                <span className="sr-only">
                  {t(atom.rtl ? "count" : "countLtr", { count: atom.variants, n: count })}
                </span>
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
            npx @smicolon/cli add button  →  components/ui/button.tsx
          </span>
        </div>
      </div>
    </section>
  )
}
