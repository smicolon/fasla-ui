"use client"

import { useTranslations } from "next-intl"

import { Spotlight, SpotlightCard } from "@fasla-ui/effects/spotlight/spotlight"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["pointer", "motion"] as const
const LIGHT = "color-mix(in oklch, var(--chart-1) 35%, transparent)"

export default function SpotlightPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.spotlight")

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: s.rich("props.children", richCode) },
    { prop: "color", type: "string", fallback: '"color-mix(in oklch, var(--primary) 15%, transparent)"', description: s.rich("props.color", richCode) },
    { prop: "size", type: "number", fallback: "400", description: s.rich("props.size", richCode) },
    { prop: "blur", type: "number", fallback: "80", description: s.rich("props.blur", richCode) },
    { prop: "opacity", type: "number", fallback: "1", description: s.rich("props.opacity", richCode) },
    { prop: "SpotlightCard", type: "{ spotlightColor, spotlightSize }", fallback: "", description: s.rich("props.spotlightCard", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/spotlight/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="spotlight" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Spotlight color={LIGHT} className="flex h-64 w-full items-center justify-center rounded-lg border bg-card">
            <div className="space-y-2 px-6 text-center">
              <h3 className="text-2xl font-bold">{s("panel.title")}</h3>
              <p className="text-muted-foreground">{s("panel.body")}</p>
            </div>
          </Spotlight>
        </ComponentPreview>
      </section>

      {/* Spotlight card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("cardTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("cardBody", richCode)}</p>
        <ComponentPreview>
          <SpotlightCard spotlightColor={LIGHT} className="w-72">
            <p className="font-semibold">{s("card.title")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s("card.body")}</p>
          </SpotlightCard>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{s.rich(`a11y.${key}`, richCode)}</li>
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
        <UsageExample title="Spotlight">{`import { Spotlight } from "@/components/ui/spotlight"

export function CollectionPanel() {
  return (
    <Spotlight className="h-64 rounded-lg border bg-card" size={300}>
      <h2>${s("panel.title")}</h2>
    </Spotlight>
  )
}`}</UsageExample>
        <UsageExample title="SpotlightCard">{`import { SpotlightCard } from "@/components/ui/spotlight"

export function DeliveryCard() {
  return (
    <SpotlightCard>
      <p>${s("card.title")}</p>
    </SpotlightCard>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
