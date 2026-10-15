"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"

export type PropRow = {
  /**
   * The part of a composed component the prop belongs to, such as
   * `DropdownMenuItem`. When rows carry it, the table gains a Part column and
   * each part's rows sit together under one cell that spans them.
   */
  part?: string
  prop: string
  type: string
  /** The default in code formatting; empty for none. */
  fallback: string
  description: React.ReactNode
}

/**
 * A piece of a type that may break after each `, ` and nowhere else, so an
 * object type such as `{ words, speed, cursor }` wraps inside its column.
 */
function CommaBreaks({ value }: { value: string }) {
  const parts = value.split(", ")
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className="whitespace-nowrap">
            {part}
            {index < parts.length - 1 && ","}
          </span>
        </Fragment>
      ))}
    </>
  )
}

/** Code that may break at its spaces and nowhere else. */
function SpaceBreaks({ value }: { value: string }) {
  const words = value.split(" ")
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className="whitespace-nowrap">{word}</span>
        </Fragment>
      ))}
    </>
  )
}

/**
 * A type that may break before each `|`, never inside a value, so
 * `"sm" | "md" | "lg"` keeps the type column narrow enough for the
 * description. A long part may also break after a comma.
 */
function UnionType({ value }: { value: string }) {
  const parts = value.split(" | ")
  return (
    <code className="text-xs">
      {parts.map((part, index) => (
        <Fragment key={part}>
          {index > 0 && " "}
          <CommaBreaks value={index > 0 ? `| ${part}` : part} />
        </Fragment>
      ))}
    </code>
  )
}

/**
 * The one props table every component page uses: four columns — five with a
 * Part column for a component made of parts — one short line per description (design/content/arabic-writing-guide.md). Cells keep the
 * page's direction, so on /ar every column aligns to the start (right); a code
 * value sits in an inline <code>, which globals.css isolates left to right
 * inside the RTL cell.
 */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  const t = useTranslations("docs.propsTable")
  const hasParts = rows.some((row) => row.part)
  /** How many rows in a row each part's cell spans, keyed by its first row. */
  const spans = new Map<number, number>()
  rows.forEach((row, index) => {
    if (index > 0 && rows[index - 1]!.part === row.part) return
    let count = 1
    while (rows[index + count]?.part === row.part) count++
    spans.set(index, count)
  })
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {hasParts && <th className="px-3 py-2 text-start font-semibold">{t("part")}</th>}
            <th className="px-3 py-2 text-start font-semibold">{t("prop")}</th>
            <th className="px-3 py-2 text-start font-semibold">{t("type")}</th>
            <th className="px-3 py-2 text-start font-semibold">{t("default")}</th>
            <th className="min-w-[15rem] px-3 py-2 text-start font-semibold">{t("description")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.part ?? ""}.${row.prop}`} className="border-b align-top">
              {hasParts && spans.has(index) && (
                <th scope="rowgroup" rowSpan={spans.get(index)} className="border-e px-3 py-2 text-start font-normal">
                  {/* A part name may break between its words, so the column
                      stays as narrow as its longest word, not its longest name. */}
                  <code className="text-xs font-semibold">
                    {row.part!.split(/(?=[A-Z])/).map((word, i) => (
                      <Fragment key={i}>
                        {i > 0 && <wbr />}
                        {word}
                      </Fragment>
                    ))}
                  </code>
                </th>
              )}
              <td className="px-3 py-2 text-start">
                <code className="whitespace-nowrap text-xs">{row.prop}</code>
              </td>
              <td className="px-3 py-2 text-start">
                <UnionType value={row.type} />
              </td>
              <td className="px-3 py-2 text-start text-muted-foreground">
                {row.fallback ? (
                  // A default wraps at its spaces, never inside a token: a plain
                  // wrap would also break after the hyphens of "var(--primary)".
                  <code className="text-xs text-foreground">
                    <SpaceBreaks value={row.fallback} />
                  </code>
                ) : (
                  t("none")
                )}
              </td>
              <td className="px-3 py-2 text-start text-muted-foreground">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** The rich-text renderer for a prop description or prose: code stays one LTR unit. */
export const richCode = {
  code: (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>,
}
