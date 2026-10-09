"use client"

import { useTranslations } from "next-intl"

import { EmptyState, EmptySearchResults, EmptyData } from "@fasla-ui/blocks/empty-state/EmptyState"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function EmptyStatePage() {
  const t = useTranslations("docs.sections")
  const e = useTranslations("docs.emptyState")

  const props: PropRow[] = [
    { prop: "icon", type: "ReactNode", fallback: "", description: e.rich("props.icon", richCode) },
    { prop: "title", type: "string", fallback: "", description: e.rich("props.title", richCode) },
    { prop: "description", type: "string", fallback: "", description: e.rich("props.description", richCode) },
    { prop: "action", type: "ReactNode", fallback: "", description: e.rich("props.action", richCode) },
    { prop: "secondaryAction", type: "ReactNode", fallback: "", description: e.rich("props.secondaryAction", richCode) },
    { prop: "size", type: '"sm" | "default" | "lg"', fallback: '"default"', description: e.rich("props.size", richCode) },
    { prop: "className", type: "string", fallback: "", description: e.rich("props.className", richCode) },
  ]

  const query = e("search.query")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/empty-state/" /></h1>
        <p className="text-xl text-muted-foreground">{e("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="empty-state" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <EmptyState
            title={e("preview.title")}
            description={e("preview.description")}
            action={<Button>{e("preview.action")}</Button>}
          />
        </ComponentPreview>
      </section>

      {/* Search Results */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{e("searchTitle")}</h2>
        <ComponentPreview>
          <EmptySearchResults
            query={query}
            title={e("search.title")}
            description={e("search.description", { query })}
          />
        </ComponentPreview>
      </section>

      {/* Empty Data */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{e("dataTitle")}</h2>
        <ComponentPreview>
          <EmptyData title={e("data.title")} description={e("data.description")} />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="space-y-8">
            <EmptyState size="sm" title={e("sizes")} />
            <EmptyState size="default" title={e("sizes")} />
            <EmptyState size="lg" title={e("sizes")} />
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
        <UsageExample>{`import { EmptyState } from "@/components/blocks/empty-state"
import { Button } from "@/components/ui/button"

export function NoProducts() {
  return (
    <EmptyState
      title="${e("preview.title")}"
      description="${e("preview.description")}"
      action={<Button>${e("preview.action")}</Button>}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
