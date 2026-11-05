"use client"

import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

export default function TemplatesPage() {
  const t = useTranslations("docs.templates")
  const locale = useLocale()
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("lead")}</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        <li className="rounded-xl border p-5">
          <h2 className="text-lg font-semibold">{t("mahaam.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("mahaam.description")}</p>
          <Link
            href={`/${locale}/docs/templates/mahaam/`}
            className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4"
          >
            {t("open")}
          </Link>
        </li>
      </ul>
    </div>
  )
}
