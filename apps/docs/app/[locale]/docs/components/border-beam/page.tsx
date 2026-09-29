"use client"

import { useTranslations } from "next-intl"

import { BorderBeam, GlowingBorder } from "@fasla-ui/effects/border-beam/border-beam"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["decorative", "motion"] as const

export default function BorderBeamPage() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.borderBeam")

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: b.rich("props.children", richCode) },
    { prop: "duration", type: "number", fallback: "4", description: b.rich("props.duration", richCode) },
    { prop: "borderWidth", type: "number", fallback: "2", description: b.rich("props.borderWidth", richCode) },
    { prop: "colorFrom", type: "string", fallback: '"var(--primary)"', description: b.rich("props.colorFrom", richCode) },
    { prop: "colorTo", type: "string", fallback: '"transparent"', description: b.rich("props.colorTo", richCode) },
    { prop: "delay", type: "number", fallback: "0", description: b.rich("props.delay", richCode) },
    { prop: "GlowingBorder", type: '{ glowColor, borderRadius, intensity: "sm" | "md" | "lg" }', fallback: "", description: b.rich("props.glowingBorder", richCode) },
    { prop: "className", type: "string", fallback: "", description: b.rich("props.className", richCode) },
  ]

  const card = (
    <div className="space-y-1 p-6">
      <p className="font-semibold">{b("card.title")}</p>
      <p className="text-sm text-muted-foreground">{b("card.body")}</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/border-beam/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="border-beam" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <BorderBeam className="w-72 rounded-xl" duration={3}>{card}</BorderBeam>
        </ComponentPreview>
      </section>

      {/* Glowing border */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("glowTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("glowBody", richCode)}</p>
        <ComponentPreview>
          <GlowingBorder className="w-72 border bg-card" borderRadius="0.75rem">
            {card}
          </GlowingBorder>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{b.rich(`a11y.${key}`, richCode)}</li>
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
        <CodeBlock>{`import { BorderBeam, GlowingBorder } from "@/components/ui/border-beam"

<BorderBeam className="rounded-xl" duration={3}>
  <div className="p-6">${b("card.title")}</div>
</BorderBeam>

<GlowingBorder intensity="lg">
  <div className="p-6">${b("card.title")}</div>
</GlowingBorder>`}</CodeBlock>
      </section>
    </div>
  )
}
