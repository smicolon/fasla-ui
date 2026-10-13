"use client"

import type { ReactNode } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Progress } from "@fasla-ui/ui/progress"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VALUES = [0, 25, 50, 75, 100] as const

/** Storybook is copied into the site at /components, outside the locale tree. */
const STORY = "/components/?path=/story/ui-progress--without-percentage"
const SIZES = ["sm", "md", "lg"] as const

/** Numbers inside Arabic sentences keep their own left-to-right run. */
const rich = {
  ...richCode,
  num: (chunks: ReactNode) => <bdi dir="ltr">{chunks}</bdi>,
}

export default function ProgressPage() {
  const t = useTranslations("docs.sections")
  const p = useTranslations("docs.progress")
  const locale = useLocale()

  const props: PropRow[] = [
    { prop: "value", type: "number", fallback: "0", description: p.rich("props.value", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: p.rich("props.size", rich) },
    { prop: "showPercentage", type: "boolean", fallback: "true", description: p.rich("props.showPercentage", rich) },
    { prop: "aria-label", type: "string", fallback: "", description: p.rich("props.ariaLabel", rich) },
    { prop: "getAriaValueText", type: "(text, value) => string", fallback: "", description: p.rich("props.getAriaValueText", rich) },
    { prop: "locale", type: "string", fallback: '"en-US"', description: p.rich("props.locale", rich) },
    { prop: "className", type: "string", fallback: "", description: p.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/progress/" /></h1>
        <p className="text-xl text-muted-foreground">{p.rich("lead", rich)}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="progress" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Progress value={60} aria-label={p("preview")} className="max-w-xs" />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's Percentage steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className="grid w-full gap-x-8 gap-y-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <Progress key={value} value={value} aria-label={p("preview")} />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex w-full max-w-xs flex-col gap-4">
            {SIZES.map((size) => (
              <Progress key={size} size={size} value={50} aria-label={p("preview")} />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Percentage label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("showPercentageTitle")}</h2>
        <p className="text-muted-foreground">
          {p.rich("showPercentageBody", {
            ...rich,
            story: (chunks) => (
              // A plain link: the story opens in the Storybook app, in this
              // page's direction.
              <a
                href={locale === "ar" ? `${STORY}&globals=direction:rtl` : STORY}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <ComponentPreview>
          <div className="grid w-full gap-x-8 gap-y-4 sm:grid-cols-2">
            <Progress value={60} aria-label={p("preview")} />
            <Progress value={60} showPercentage={false} aria-label={p("preview")} />
          </div>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample>{`import { Progress } from "@/components/ui/progress"

export function UploadProgress({ value }: { value: number }) {
  return (
    <Progress
      value={value}
      size="md"
      aria-label="${p("preview")}"
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
