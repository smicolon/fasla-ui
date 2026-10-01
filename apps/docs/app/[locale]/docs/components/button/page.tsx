"use client"

import { useTranslations } from "next-intl"

import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "link"] as const

export default function ButtonPage() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.button")

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', fallback: '"default"', description: b.rich("props.variant", richCode) },
    { prop: "size", type: '"default" | "sm" | "lg" | "icon"', fallback: '"default"', description: b.rich("props.size", richCode) },
    { prop: "loading", type: "boolean", fallback: "false", description: b.rich("props.loading", richCode) },
    { prop: "loadingLabel", type: "string", fallback: '"Loading"', description: b.rich("props.loadingLabel", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: b.rich("props.disabled", richCode) },
    { prop: "asChild", type: "boolean", fallback: "false", description: b.rich("props.asChild", richCode) },
    { prop: "onClick", type: "(event) => void", fallback: "", description: b.rich("props.onClick", richCode) },
    { prop: "className", type: "string", fallback: "", description: b.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/button/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="button" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Button>{b("preview")}</Button>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className="flex flex-wrap gap-4">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {b(`variants.${variant}`)}
              </Button>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Button size="sm">{b("sizes.sm")}</Button>
            <Button size="default">{b("sizes.default")}</Button>
            <Button size="lg">{b("sizes.lg")}</Button>
          </div>
        </ComponentPreview>
      </section>

      {/* Loading */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("loadingTitle")}</h2>
        <ComponentPreview>
          <Button loading loadingLabel={b("loadingLabel")}>
            {b("loading")}
          </Button>
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
        <CodeBlock>{`import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="default" size="default">
      ${b("preview")}
    </Button>
  )
}`}</CodeBlock>
      </section>
    </div>
  )
}
