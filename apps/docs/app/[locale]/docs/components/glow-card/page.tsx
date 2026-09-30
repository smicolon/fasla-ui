"use client"

import { useTranslations } from "next-intl"

import { GlowCard, GlowContainer } from "@fasla-ui/effects/glow-card/glow-card"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["decorative", "hover", "motion"] as const

export default function GlowCardPage() {
  const t = useTranslations("docs.sections")
  const g = useTranslations("docs.glowCard")

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: g.rich("props.children", richCode) },
    { prop: "glowColor", type: "string", fallback: '"var(--primary)"', description: g.rich("props.glowColor", richCode) },
    { prop: "glowIntensity", type: "number", fallback: "60", description: g.rich("props.glowIntensity", richCode) },
    { prop: "followMouse", type: "boolean", fallback: "false", description: g.rich("props.followMouse", richCode) },
    { prop: "hoverOnly", type: "boolean", fallback: "true", description: g.rich("props.hoverOnly", richCode) },
    { prop: "GlowContainer", type: "{ glowColor, duration }", fallback: "", description: g.rich("props.glowContainer", richCode) },
    { prop: "className", type: "string", fallback: "", description: g.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/glow-card/" /></h1>
        <p className="text-xl text-muted-foreground">{g("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="glow-card" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <p className="text-muted-foreground">{g.rich("cardMotion", richCode)}</p>
        <ComponentPreview>
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <GlowCard glowColor="var(--chart-2)">
              <div className="space-y-1 p-6">
                <p className="font-semibold">{g("cards.delivery.title")}</p>
                <p className="text-sm text-muted-foreground">{g("cards.delivery.body")}</p>
              </div>
            </GlowCard>
            <GlowCard glowColor="var(--chart-1)" followMouse>
              <div className="space-y-1 p-6">
                <p className="font-semibold">{g("cards.returns.title")}</p>
                <p className="text-sm text-muted-foreground">{g("cards.returns.body")}</p>
              </div>
            </GlowCard>
          </div>
        </ComponentPreview>
      </section>

      {/* Glow container */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{g("containerTitle")}</h2>
        <p className="text-muted-foreground">{g.rich("containerBody", richCode)}</p>
        <ComponentPreview>
          <GlowContainer className="w-full max-w-sm" duration={2}>
            <p className="p-6 text-center font-medium">{g("container")}</p>
          </GlowContainer>
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
        <CodeBlock>{`import { GlowCard, GlowContainer } from "@/components/ui/glow-card"

<GlowCard glowColor="var(--chart-1)" followMouse>
  <div className="p-6">${g("cards.returns.title")}</div>
</GlowCard>

<GlowContainer duration={2}>
  <p className="p-6">${g("container")}</p>
</GlowContainer>`}</CodeBlock>
      </section>
    </div>
  )
}
