"use client"

import { useTranslations } from "next-intl"

import { Checkbox } from "@fasla-ui/ui/checkbox"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function CheckboxPage() {
  const t = useTranslations("docs.sections")
  const c = useTranslations("docs.checkbox")

  const props: PropRow[] = [
    { prop: "checked", type: "boolean", fallback: "", description: c.rich("props.checked", richCode) },
    { prop: "indeterminate", type: "boolean", fallback: "false", description: c.rich("props.indeterminate", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: c.rich("props.disabled", richCode) },
    { prop: "error", type: "boolean", fallback: "false", description: c.rich("props.error", richCode) },
    { prop: "label", type: "string", fallback: "", description: c.rich("props.label", richCode) },
    { prop: "description", type: "string", fallback: "", description: c.rich("props.description", richCode) },
    { prop: "name", type: "string", fallback: "", description: c.rich("props.name", richCode) },
    { prop: "value", type: "string", fallback: "", description: c.rich("props.value", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: c.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: c.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/checkbox/" /></h1>
        <p className="text-xl text-muted-foreground">{c("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="checkbox" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex max-w-xs flex-col gap-4">
            <div className="flex items-center gap-6">
              <Checkbox />
              <Checkbox defaultChecked />
            </div>
            <Checkbox label={c("preview.terms")} />
            {/* Long enough to wrap: the box must stay on the first line. */}
            <Checkbox label={c("preview.long")} />
          </div>
        </ComponentPreview>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{c("withLabelTitle")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Checkbox label={c("withLabel.email")} />
            <Checkbox label={c("withLabel.marketing")} description={c("withLabel.marketingDescription")} />
            <Checkbox
              label={c("withLabel.security")}
              description={c("withLabel.securityDescription")}
              defaultChecked
            />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Checkbox label={c("states.default")} />
            <Checkbox label={c("states.checked")} defaultChecked />
            <Checkbox label={c("states.indeterminate")} indeterminate />
            <Checkbox label={c("states.disabled")} disabled />
            <Checkbox label={c("states.error")} error />
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
        <UsageExample title={c("usage.basic")}>{`"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function TermsCheckbox() {
  return <Checkbox name="terms" aria-label="${c("usage.terms")}" />
}`}</UsageExample>
        <UsageExample title={c("usage.withLabel")}>{`"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function TermsCheckbox() {
  return <Checkbox name="terms" label="${c("usage.terms")}" />
}`}</UsageExample>
        <UsageExample title={c("usage.withDescription")}>{`"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function MarketingCheckbox() {
  return (
    <Checkbox
      name="marketing"
      label="${c("usage.marketing")}"
      description="${c("usage.marketingDescription")}"
    />
  )
}`}</UsageExample>
        <UsageExample title={c("usage.indeterminate")}>{`"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function SelectAllCheckbox() {
  return <Checkbox label="${c("usage.selectAll")}" indeterminate />
}`}</UsageExample>
        <UsageExample title={c("usage.error")}>{`"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function RequiredCheckbox() {
  return <Checkbox name="terms" label="${c("usage.required")}" required error />
}`}</UsageExample>
      </section>
    </div>
  )
}
