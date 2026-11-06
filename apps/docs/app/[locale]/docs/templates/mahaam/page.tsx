"use client"

import * as React from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import registry from "@fasla-ui/registry.json"
import { BlockVariantCard } from "@/components/blocks/block-variant-card"
import { PropsTable, type PropRow } from "@/components/props-table"
import { blockRequirements } from "@/lib/blocks"

const items: { name: string; dependencies?: string[]; registryDependencies?: string[] }[] = registry.items

const SECTIONS = ["navbar", "hero", "logo-marquee", "features", "ask", "banner", "testimonials", "plans", "faq", "footer"] as const
const MOTION = ["reduced", "visible", "pause", "css"] as const
const TINTS = ["soft", "built"] as const
const CREDITS = ["painting", "faisal", "freepik", "footer"] as const

const previewUrl = (locale: string) => `/${locale}/templates-preview/mahaam/`

/** A two-to-three column table in the same markup as the props table. */
function DocTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {head.map((cell) => (
              <th key={cell} className="px-3 py-2 text-start font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b align-top">
              {row.map((cell, column) => (
                <td key={column} className={column === 0 ? "px-3 py-2 text-start" : "px-3 py-2 text-start text-muted-foreground"}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function MahaamTemplatePage() {
  const t = useTranslations("docs.mahaamTemplate")
  const locale = useLocale()

  const props: PropRow[] = [
    { prop: "locale", type: '"en" | "ar"', fallback: '"en"', description: t("props.locale") },
    { prop: "photos", type: "MahaamTemplatePhotos", fallback: "", description: t("props.photos") },
    { prop: "defaultPaused", type: "boolean", fallback: "false", description: t("props.defaultPaused") },
    { prop: "still", type: "boolean", fallback: "false", description: t("props.still") },
    { prop: "reducedMotion", type: "boolean", fallback: "", description: t("props.reducedMotion") },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("lead")}</p>
        <p className="text-muted-foreground">
          {t("intro")}{" "}
          <Link href={`/${locale}/docs/templates/`} className="font-medium text-foreground underline underline-offset-4">
            {t("allTemplates")}
          </Link>
        </p>
      </div>

      <BlockVariantCard
        type={{ slug: "template-mahaam" }}
        name={t("title")}
        {...blockRequirements("template-mahaam", items)}
        previewUrl={(frameLocale) => previewUrl(frameLocale)}
        file="components/templates/mahaam-template.tsx"
      />

      <section className="space-y-4" aria-labelledby="mahaam-sections">
        <h2 id="mahaam-sections" className="text-2xl font-semibold">
          {t("sectionsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("sectionsLead")}</p>
        <DocTable
          head={[t("sectionsTable.section"), t("sectionsTable.item"), t("sectionsTable.description")]}
          rows={SECTIONS.map((key) => [
            t(`sectionNames.${key}`),
            <code key="item" className="whitespace-nowrap text-xs">{`mahaam-${key}`}</code>,
            t(`sections.${key}`),
          ])}
        />
      </section>

      <section className="space-y-4" aria-labelledby="mahaam-props">
        <h2 id="mahaam-props" className="text-2xl font-semibold">
          {t("propsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("propsLead")}</p>
        <PropsTable rows={props} />
      </section>

      <section className="space-y-4" aria-labelledby="mahaam-motion">
        <h2 id="mahaam-motion" className="text-2xl font-semibold">
          {t("motionTitle")}
        </h2>
        <p className="text-muted-foreground">{t("motionLead")}</p>
        <DocTable head={[t("motionTable.condition"), t("motionTable.behaviour")]} rows={MOTION.map((key) => [t(`motion.${key}.name`), t(`motion.${key}.text`)])} />
      </section>

      <section className="space-y-4" aria-labelledby="mahaam-tints">
        <h2 id="mahaam-tints" className="text-2xl font-semibold">
          {t("tintsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("tints")}</p>
        <DocTable
          head={[t("tintsTable.figma"), t("tintsTable.code")]}
          rows={TINTS.map((key) => [<code key="n" className="text-xs">{t(`tintRows.${key}.name`)}</code>, t(`tintRows.${key}.text`)])}
        />
      </section>

      <section className="space-y-4" aria-labelledby="mahaam-credits">
        <h2 id="mahaam-credits" className="text-2xl font-semibold">
          {t("creditsTitle")}
        </h2>
        <p className="text-muted-foreground">{t("creditsLead")}</p>
        <ul className="list-disc space-y-2 ps-5 text-muted-foreground">
          {CREDITS.map((key) => (
            <li key={key}>{t(`credits.${key}`)}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
