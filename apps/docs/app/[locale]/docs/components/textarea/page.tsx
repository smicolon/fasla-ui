"use client"

import { useTranslations } from "next-intl"

import { Textarea } from "@fasla-ui/ui/textarea"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function TextareaPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.textarea")

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "error"', fallback: '"default"', description: a.rich("props.variant", richCode) },
    { prop: "resize", type: '"none" | "vertical" | "horizontal" | "both"', fallback: '"vertical"', description: a.rich("props.resize", richCode) },
    { prop: "showCount", type: "boolean", fallback: "false", description: a.rich("props.showCount", richCode) },
    { prop: "maxLength", type: "number", fallback: "", description: a.rich("props.maxLength", richCode) },
    { prop: "placeholder", type: "string", fallback: "", description: a.rich("props.placeholder", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: a.rich("props.disabled", richCode) },
    { prop: "value", type: "string", fallback: "", description: a.rich("props.value", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: a.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/textarea/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="textarea" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Textarea placeholder={a("placeholder")} className="w-full max-w-sm" />
        </ComponentPreview>
      </section>

      {/* With Character Count */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("countTitle")}</h2>
        <ComponentPreview>
          <Textarea placeholder={a("countPlaceholder")} showCount maxLength={200} className="w-full max-w-sm" />
        </ComponentPreview>
      </section>

      {/* Resize Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("resizeTitle")}</h2>
        <ComponentPreview>
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Textarea placeholder={a("resize.none")} resize="none" />
            <Textarea placeholder={a("resize.vertical")} resize="vertical" />
            <Textarea placeholder={a("resize.both")} resize="both" />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Textarea placeholder={a("states.default")} />
            <Textarea placeholder={a("states.error")} variant="error" />
            <Textarea placeholder={a("states.disabled")} disabled />
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
        <UsageExample title={a("usage.basic")}>{`"use client"

import { Textarea } from "@/components/ui/textarea"

export function MessageField() {
  return (
    <Textarea
      name="message"
      aria-label="${a("usage.messageLabel")}"
      placeholder="${a("usage.codePlaceholder")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={a("usage.count")}>{`"use client"

import { Textarea } from "@/components/ui/textarea"

export function MessageFieldWithCount() {
  return (
    <Textarea
      name="message"
      aria-label="${a("usage.messageLabel")}"
      placeholder="${a("usage.codeCount")}"
      showCount
      maxLength={200}
    />
  )
}`}</UsageExample>
        <UsageExample title={a("usage.resize")}>{`"use client"

import { Textarea } from "@/components/ui/textarea"

export function MessageFieldResize() {
  return (
    <div className="flex flex-col gap-4">
      <Textarea aria-label="${a("usage.messageLabel")}" resize="none" />
      <Textarea aria-label="${a("usage.messageLabel")}" resize="vertical" />
      <Textarea aria-label="${a("usage.messageLabel")}" resize="both" />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.error")}>{`"use client"

import { Textarea } from "@/components/ui/textarea"

export function MessageFieldWithError() {
  return <Textarea name="message" aria-label="${a("usage.messageLabel")}" variant="error" aria-invalid />
}`}</UsageExample>
      </section>
    </div>
  )
}
