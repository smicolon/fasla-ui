"use client"

import { useTranslations } from "next-intl"

import { StatusIndicator, STATUS_LABELS } from "@fasla-ui/ui/status-indicator"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

const STATUSES = ["online", "away", "busy", "offline"] as const

const PROPS = [
  ["status", "\"online\" | \"away\" | \"busy\" | \"offline\"", "\"online\""],
  ["size", "\"8\" | \"4\"", "\"8\""],
  ["label", "string", "the status in the page's language"],
] as const

export default function StatusIndicatorPage() {
  const t = useTranslations("docs.sections")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Status Indicator</h1>
        {/*
         * `dir="ltr"` on every English run: the page prose is untranslated, and
         * in the Arabic locale a trailing full stop is bidi-neutral and would
         * jump to the head of the line.
         */}
        <p dir="ltr" className="text-xl text-muted-foreground">
          A presence dot — online, away, busy or offline — with an accessible name, so
          colour never carries the status alone.
        </p>
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
        <p dir="ltr" className="text-muted-foreground">
          <code className="text-sm">status</code> sets the colour: success for online,
          warning for away, destructive for busy and muted for offline.
        </p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-6">
            {STATUSES.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <StatusIndicator status={status} aria-hidden />
                <span dir="ltr" className="text-sm">
                  {STATUS_LABELS.en[status]}
                </span>
                <span dir="rtl" lang="ar" className="text-sm text-muted-foreground">
                  {STATUS_LABELS.ar[status]}
                </span>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          8px with a 2px ring, or 4px with a 1px ring for the smallest avatar. The ring
          is the page background, drawn outside the dot, so it never changes its size.
        </p>
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
        <ul dir="ltr" className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>
            Colour alone can&apos;t carry the status. Each dot carries hidden text:
            &quot;Online&quot;, &quot;Away&quot;, &quot;Busy&quot; or &quot;Offline&quot;,
            or &quot;متصل&quot;, &quot;بعيد&quot;, &quot;مشغول&quot; or &quot;غير متصل&quot;
            when the nearest <code className="text-sm">lang</code> is Arabic. It follows a
            language change without a reload.
          </li>
          <li>
            Pass <code className="text-sm">label</code> for more context, such as
            &quot;Layla is online&quot;.
          </li>
          <li>
            When the status is already written next to the dot, hide the dot with{" "}
            <code className="text-sm">aria-hidden</code> so it isn&apos;t announced twice.
          </li>
          <li>
            The dot is a circle, so it has no direction. The parent decides where it
            sits; Avatar pins it to the end corner.
          </li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <div dir="ltr" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start font-semibold">Prop</th>
                <th className="px-4 py-2 text-start font-semibold">Type</th>
                <th className="px-4 py-2 text-start font-semibold">Default</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map(([prop, type, fallback]) => (
                <tr key={prop} className="border-b">
                  <td className="px-4 py-2 font-mono text-xs">{prop}</td>
                  <td className="px-4 py-2 font-mono text-xs">{type}</td>
                  <td className="px-4 py-2 font-mono text-xs">{fallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { StatusIndicator } from "@/components/ui/status-indicator"

<StatusIndicator status="online" />
<StatusIndicator status="busy" size="4" />

// More context for screen readers
<StatusIndicator status="away" label={\`\${user.name} is away\`} />`}</CodeBlock>
      </section>
    </div>
  )
}
