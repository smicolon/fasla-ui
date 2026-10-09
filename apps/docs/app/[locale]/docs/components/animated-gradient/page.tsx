"use client"

import { useTranslations } from "next-intl"

import { AnimatedGradient } from "@fasla-ui/effects/animated-gradient/animated-gradient"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["decorative", "motion", "contrast"] as const
const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)"]

export default function AnimatedGradientPage() {
  const t = useTranslations("docs.sections")
  const g = useTranslations("docs.animatedGradient")

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: g.rich("props.children", richCode) },
    { prop: "colors", type: "string[]", fallback: '["var(--primary)", "var(--secondary)", …]', description: g.rich("props.colors", richCode) },
    { prop: "speed", type: "number", fallback: "10", description: g.rich("props.speed", richCode) },
    { prop: "blur", type: '"sm" | "md" | "lg" | "xl" | "2xl" | "3xl"', fallback: '"3xl"', description: g.rich("props.blur", richCode) },
    { prop: "AnimatedGradientText", type: "{ colors, speed }", fallback: "", description: g.rich("props.gradientText", richCode) },
    { prop: "className", type: "string", fallback: "", description: g.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/animated-gradient/" /></h1>
        <p className="text-xl text-muted-foreground">{g("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="animated-gradient" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <AnimatedGradient className="h-48 w-full rounded-lg" speed={3} />
        </ComponentPreview>
      </section>

      {/* With content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{g("contentTitle")}</h2>
        <ComponentPreview>
          <AnimatedGradient speed={3} className="flex h-56 w-full items-center justify-center rounded-lg border">
            <div className="space-y-2 px-6 text-center">
              <h3 className="text-2xl font-bold">{g("content.title")}</h3>
              <p className="text-muted-foreground">{g("content.body")}</p>
            </div>
          </AnimatedGradient>
        </ComponentPreview>
      </section>

      {/* Custom colours */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{g("coloursTitle")}</h2>
        <p className="text-muted-foreground">{g.rich("coloursBody", richCode)}</p>
        <ComponentPreview>
          <AnimatedGradient className="h-48 w-full rounded-lg" colors={CHART_COLORS} speed={3} />
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{g.rich(`a11y.${key}`, richCode)}</li>
          ))}
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample>{`import { AnimatedGradient } from "@/components/ui/animated-gradient"

export function CollectionBanner() {
  return (
    <AnimatedGradient
      className="flex h-56 items-center justify-center rounded-lg"
      speed={3}
      colors={["var(--chart-1)", "var(--chart-2)", "var(--chart-4)", "var(--chart-5)"]}
    >
      <h2 className="text-2xl font-bold">${g("content.title")}</h2>
    </AnimatedGradient>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
