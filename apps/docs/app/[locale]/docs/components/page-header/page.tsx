"use client"

import { useTranslations } from "next-intl"

import { PageHeader } from "@fasla-ui/blocks/page-header/PageHeader"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@fasla-ui/ui/breadcrumb"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
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
            breadcrumb={
              <Breadcrumb aria-label={p("breadcrumb.label")}>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">{p("breadcrumb.home")}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{p("breadcrumb.current")}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            }
          />
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
        <UsageExample>{`import { PageHeader } from "@/components/blocks/page-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

export function ProductsHeader() {
  return (
    <PageHeader
      title="${p("actions.title")}"
      description="${p("actions.description")}"
      breadcrumb={
        <Breadcrumb aria-label="${p("breadcrumb.label")}">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">${p("breadcrumb.home")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>${p("actions.title")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      actions={<Button>${p("actions.action")}</Button>}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
