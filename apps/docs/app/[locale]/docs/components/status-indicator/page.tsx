"use client"

import { useLocale, useTranslations } from "next-intl"

import { StatusIndicator, STATUS_LABELS } from "@fasla-ui/ui/status-indicator"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const STATUSES = ["online", "away", "busy", "offline"] as const

export default function StatusIndicatorPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.statusIndicator")

  // The label beside each dot is the site's language only, as the dot's own name is.
  const labels = useLocale() === "ar" ? STATUS_LABELS.ar : STATUS_LABELS.en

  const props: PropRow[] = [
    { prop: "status", type: '"online" | "away" | "busy" | "offline"', fallback: '"online"', description: s.rich("props.status", richCode) },
    { prop: "size", type: '"8" | "4"', fallback: '"8"', description: s.rich("props.size", richCode) },
    { prop: "label", type: "string", fallback: "", description: s.rich("props.label", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/status-indicator/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <CodeBlock language="bash">{`npx @smicolon/cli init
npx @smicolon/cli add status-indicator`}</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            {STATUSES.map((status) => (
              <StatusIndicator key={status} status={status} />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <StatusIndicator status={status} aria-hidden />
                <span className="text-sm">{labels[status]}</span>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{s("sizesBody")}</p>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <StatusIndicator size="8" />
            <StatusIndicator size="4" />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.colour", richCode)}</li>
          <li>{s.rich("a11y.label", richCode)}</li>
          <li>{s.rich("a11y.hidden", richCode)}</li>
          <li>{s.rich("a11y.dir", richCode)}</li>
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
        <p className="text-muted-foreground">{s("onAvatar")}</p>
        <CodeBlock>{`import { StatusIndicator } from "@/components/ui/status-indicator"

<StatusIndicator status="online" />
<StatusIndicator status="busy" size="4" />

// ${s("usage.context")}
<StatusIndicator status="away" label={\`\${user.name} ${s("usage.awayLabel")}\`} />`}</CodeBlock>
      </section>
    </div>
  )
}
