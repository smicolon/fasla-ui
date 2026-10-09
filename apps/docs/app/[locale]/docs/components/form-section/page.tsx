"use client"

import { useTranslations } from "next-intl"

import { FormSection, FormField, FormActions } from "@fasla-ui/blocks/form-section/FormSection"
import { Input } from "@fasla-ui/ui/input"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function FormSectionPage() {
  const t = useTranslations("docs.sections")
  const f = useTranslations("docs.formSection")

  const props: PropRow[] = [
    { prop: "title", type: "string", fallback: "", description: f.rich("props.title", richCode) },
    { prop: "description", type: "string", fallback: "", description: f.rich("props.description", richCode) },
    { prop: "divider", type: "boolean", fallback: "true", description: f.rich("props.divider", richCode) },
    { prop: "label", type: "string", fallback: "", description: f.rich("props.label", richCode) },
    { prop: "error", type: "string", fallback: "", description: f.rich("props.error", richCode) },
    { prop: "required", type: "boolean", fallback: "false", description: f.rich("props.required", richCode) },
    { prop: "htmlFor", type: "string", fallback: "", description: f.rich("props.htmlFor", richCode) },
    { prop: "align", type: '"left" | "right" | "center" | "between"', fallback: '"right"', description: f.rich("props.align", richCode) },
    { prop: "sticky", type: "boolean", fallback: "false", description: f.rich("props.sticky", richCode) },
    { prop: "className", type: "string", fallback: "", description: f.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/form-section/" /></h1>
        <p className="text-xl text-muted-foreground">{f("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="form-section" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <FormSection title={f("preview.title")} description={f("preview.description")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={f("preview.first")} required>
                <Input placeholder={f("preview.firstPlaceholder")} />
              </FormField>
              <FormField label={f("preview.last")} required>
                <Input placeholder={f("preview.lastPlaceholder")} />
              </FormField>
            </div>
          </FormSection>
        </ComponentPreview>
      </section>

      {/* With Error */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{f("errorTitle")}</h2>
        <ComponentPreview>
          <FormField label={f("error.label")} error={f("error.message")} required>
            <Input variant="error" type="email" defaultValue="layla@example.com" />
          </FormField>
        </ComponentPreview>
      </section>

      {/* Form Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{f("actionsTitle")}</h2>
        <ComponentPreview>
          <FormActions>
            <Button variant="outline">{f("actions.cancel")}</Button>
            <Button>{f("actions.save")}</Button>
          </FormActions>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <p className="text-muted-foreground">{f.rich("partsNote", richCode)}</p>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample>{`import { FormSection, FormField, FormActions } from "@/components/blocks/form-section"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function AccountForm() {
  return (
    <form>
      <FormSection title="${f("usage.title")}" description="${f("usage.description")}">
        <FormField label="${f("usage.email")}" htmlFor="email" required>
          <Input id="email" name="email" type="email" required />
        </FormField>
      </FormSection>

      <FormActions>
        <Button type="reset" variant="outline">${f("actions.cancel")}</Button>
        <Button type="submit">${f("actions.save")}</Button>
      </FormActions>
    </form>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
