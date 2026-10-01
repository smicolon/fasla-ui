"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"

export type PropRow = {
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
 * The one props table every component page uses: four columns, one short line
 * per description (design/content/arabic-writing-guide.md). Cells keep the
 * page's direction, so on /ar every column aligns to the start (right); a code
 * value sits in an inline <code>, which globals.css isolates left to right
 * inside the RTL cell.
 */
export function PropsTable({ rows }: { rows: PropRow[] }) {
  const t = useTranslations("docs.propsTable")
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-3 py-2 text-start font-semibold">{t("prop")}</th>
            <th className="px-3 py-2 text-start font-semibold">{t("type")}</th>
            <th className="px-3 py-2 text-start font-semibold">{t("default")}</th>
            <th className="min-w-[15rem] px-3 py-2 text-start font-semibold">{t("description")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} className="border-b align-top">
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
