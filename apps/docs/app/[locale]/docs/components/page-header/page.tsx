"use client"

import { useTranslations } from "next-intl"

import { PageHeader } from "@fasla-ui/blocks/page-header/PageHeader"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function PageHeaderPage() {
  const t = useTranslations("docs.sections")
  const p = useTranslations("docs.pageHeader")

  const props: PropRow[] = [
    { prop: "title", type: "string", fallback: "", description: p.rich("props.title", richCode) },
    { prop: "description", type: "string", fallback: "", description: p.rich("props.description", richCode) },
    { prop: "actions", type: "ReactNode", fallback: "", description: p.rich("props.actions", richCode) },
    { prop: "breadcrumb", type: "ReactNode", fallback: "", description: p.rich("props.breadcrumb", richCode) },
    { prop: "breadcrumbLabel", type: "string", fallback: '"Breadcrumb"', description: p.rich("props.breadcrumbLabel", richCode) },
    { prop: "bordered", type: "boolean", fallback: "true", description: p.rich("props.bordered", richCode) },
    { prop: "headingLevel", type: "1 | 2 | 3", fallback: "1", description: p.rich("props.headingLevel", richCode) },
    { prop: "className", type: "string", fallback: "", description: p.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/page-header/" /></h1>
        <p className="text-xl text-muted-foreground">{p("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="page-header" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <PageHeader title={p("preview.title")} description={p("preview.description")} headingLevel={3} />
        </ComponentPreview>
      </section>

      {/* With Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("actionsTitle")}</h2>
        <ComponentPreview>
          <PageHeader
            title={p("actions.title")}
            description={p("actions.description")}
            headingLevel={3}
            actions={<Button>{p("actions.action")}</Button>}
          />
        </ComponentPreview>
      </section>

      {/* With Breadcrumb */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{p("breadcrumbTitle")}</h2>
        <ComponentPreview>
          <PageHeader
            title={p("breadcrumb.current")}
            headingLevel={3}
            breadcrumbLabel={p("breadcrumb.label")}
            breadcrumb={
              <div className="flex items-center gap-2 text-sm">
                <a href="#">{p("breadcrumb.home")}</a>
                <span aria-hidden="true">/</span>
                <span>{p("breadcrumb.current")}</span>
              </div>
            }
          />
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>
    </div>
  )
}
