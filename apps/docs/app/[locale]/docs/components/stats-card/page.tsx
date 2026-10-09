"use client"

import { useTranslations } from "next-intl"

import { StatsCard, StatsGrid } from "@fasla-ui/blocks/stats-card/StatsCard"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const FEATURES = ["value", "trend", "icon", "description", "loading", "grid"] as const

export default function StatsCardPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.statsCard")

  const props: PropRow[] = [
    { prop: "title", type: "string", fallback: "", description: s.rich("props.title", richCode) },
    { prop: "value", type: "string | number", fallback: "", description: s.rich("props.value", richCode) },
    { prop: "description", type: "string", fallback: "", description: s.rich("props.description", richCode) },
    { prop: "icon", type: "ReactNode", fallback: "", description: s.rich("props.icon", richCode) },
    { prop: "trend", type: '{ value, direction: "up" | "down" | "neutral" }', fallback: "", description: s.rich("props.trend", richCode) },
    { prop: "loading", type: "boolean", fallback: "false", description: s.rich("props.loading", richCode) },
    { prop: "StatsGrid", type: "{ columns: 2 | 3 | 4 }", fallback: "", description: s.rich("props.grid", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/stats-card/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="stats-card" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <StatsGrid columns={3} className="w-full">
            <StatsCard
              title={s("cards.revenue")}
              value={s("cards.revenueValue")}
              description={s("cards.vsLastMonth")}
              trend={{ value: 12.5, direction: "up" }}
            />
            <StatsCard
              title={s("cards.orders")}
              value="1,284"
              description={s("cards.vsLastMonth")}
              trend={{ value: 8, direction: "up" }}
            />
            <StatsCard
              title={s("cards.returns")}
              value="36"
              description={s("cards.vsLastMonth")}
              trend={{ value: -2.1, direction: "down" }}
            />
          </StatsGrid>
        </ComponentPreview>
      </section>

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("features")}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {FEATURES.map((feature) => (
            <li key={feature}>{s.rich(`features.${feature}`, richCode)}</li>
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
        <UsageExample>{`import { StatsCard, StatsGrid } from "@/components/blocks/stats-card"

export function StoreStats() {
  return (
    <StatsGrid columns={3}>
      <StatsCard
        title="${s("cards.revenue")}"
        value="${s("cards.revenueValue")}"
        description="${s("cards.vsLastMonth")}"
        trend={{ value: 12.5, direction: "up" }}
      />
      <StatsCard
        title="${s("cards.orders")}"
        value="1,284"
        description="${s("cards.vsLastMonth")}"
        trend={{ value: 8, direction: "up" }}
      />
      <StatsCard
        title="${s("cards.returns")}"
        value="36"
        description="${s("cards.vsLastMonth")}"
        trend={{ value: -2.1, direction: "down" }}
      />
    </StatsGrid>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
