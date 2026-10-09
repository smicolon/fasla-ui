"use client"

import { useTranslations } from "next-intl"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@fasla-ui/ui/card"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function CardPage() {
  const t = useTranslations("docs.sections")
  const c = useTranslations("docs.card")

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: c.rich("props.children", richCode) },
    { prop: "className", type: "string", fallback: "", description: c.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/card/" /></h1>
        <p className="text-xl text-muted-foreground">{c("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="card" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>{c("preview.title")}</CardTitle>
              <CardDescription>{c("preview.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{c("preview.content")}</p>
            </CardContent>
            <CardFooter>
              {/* The library's own Button, never a hand-styled one. */}
              <Button>{c("preview.action")}</Button>
            </CardFooter>
          </Card>
        </ComponentPreview>
      </section>

      {/* Simple Card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{c("simpleTitle")}</h2>
        <ComponentPreview>
          <Card className="w-[350px] p-6">
            <p>{c("simple")}</p>
          </Card>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <p className="text-muted-foreground">{c.rich("partsNote", richCode)}</p>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample>{`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function OrderCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>${c("usage.title")}</CardTitle>
        <CardDescription>${c("usage.description")}</CardDescription>
      </CardHeader>
      <CardContent>${c("usage.content")}</CardContent>
      <CardFooter>${c("usage.footer")}</CardFooter>
    </Card>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
