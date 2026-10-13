"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Textarea } from "@fasla-ui/ui/textarea"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** A grid of fields that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-6 gap-y-5 sm:grid-cols-2"

const NOTES_MAX = 200

/** Delivery notes with a counter that follows the text, as the usage example builds it. */
function CountedNotes() {
  const a = useTranslations("docs.textarea")
  const [notes, setNotes] = React.useState(a("parts.notesValue"))
  return (
    <Textarea
      label={a("parts.notes")}
      labelEnd={a("parts.optional")}
      description={a("parts.notesHelp")}
      placeholder={a("parts.notesPlaceholder")}
      maxLength={NOTES_MAX}
      value={notes}
      onChange={(event) => setNotes(event.target.value)}
      descriptionEnd={`${notes.length}/${NOTES_MAX}`}
    />
  )
}

export default function TextareaPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.textarea")
  const heightValue = a("height.value")

  const props: PropRow[] = [
    { prop: "status", type: '"default" | "success"', fallback: '"default"', description: a.rich("props.status", richCode) },
    { prop: "invalid", type: "boolean", fallback: "false", description: a.rich("props.invalid", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: a.rich("props.disabled", richCode) },
    { prop: "label", type: "ReactNode", fallback: "", description: a.rich("props.label", richCode) },
    { prop: "labelEnd", type: "ReactNode", fallback: "", description: a.rich("props.labelEnd", richCode) },
    { prop: "description", type: "ReactNode", fallback: "", description: a.rich("props.description", richCode) },
    { prop: "descriptionEnd", type: "ReactNode", fallback: "", description: a.rich("props.descriptionEnd", richCode) },
    { prop: "error", type: "ReactNode", fallback: "", description: a.rich("props.error", richCode) },
    { prop: "placeholder", type: "string", fallback: "", description: a.rich("props.placeholder", richCode) },
    { prop: "maxLength", type: "number", fallback: "", description: a.rich("props.maxLength", richCode) },
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
          <Textarea
            className="max-w-sm"
            label={a("preview.label")}
            placeholder={a("preview.placeholder")}
            description={a("preview.description")}
          />
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className={GRID}>
            <Textarea label={a("variants.default.label")} placeholder={a("variants.default.placeholder")} />
            <Textarea label={a("variants.filled.label")} defaultValue={a("variants.filled.value")} />
            <Textarea
              status="success"
              label={a("variants.success.label")}
              description={a("variants.success.description")}
              defaultValue={a("variants.success.value")}
            />
            <Textarea
              invalid
              label={a("variants.invalid.label")}
              error={a("variants.invalid.error")}
              defaultValue={a("variants.invalid.value")}
            />
            <Textarea
              disabled
              label={a("variants.disabled.label")}
              description={a("variants.disabled.description")}
              defaultValue={a("variants.disabled.value")}
            />
            <Textarea
              label={a("variants.optional.label")}
              labelEnd={a("variants.optional.labelEnd")}
              description={a("variants.optional.description")}
              placeholder={a("variants.optional.placeholder")}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Height */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("heightTitle")}</h2>
        <p className="text-muted-foreground">{a("heightLead")}</p>
        <ComponentPreview>
          <Textarea
            className="max-w-md"
            label={a("height.label")}
            labelEnd={a("height.labelEnd")}
            description={a("height.description")}
            descriptionEnd={`${heightValue.length}/1000`}
            maxLength={1000}
            defaultValue={heightValue}
          />
        </ComponentPreview>
      </section>

      {/* Labels and counter */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("partsTitle")}</h2>
        <ComponentPreview>
          <div className={GRID}>
            <CountedNotes />
            <Textarea
              invalid
              label={a("parts.reason")}
              description={a("parts.reasonHelp")}
              error={a("parts.reasonError")}
              descriptionEnd={`0/${NOTES_MAX}`}
              maxLength={NOTES_MAX}
            />
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
        <UsageExample>{`"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"

export function DeliveryNotes() {
  const [notes, setNotes] = React.useState("")
  return (
    <Textarea
      name="notes"
      label="${a("usage.label")}"
      description="${a("usage.description")}"
      maxLength={200}
      value={notes}
      onChange={(event) => setNotes(event.target.value)}
      descriptionEnd={\`\${notes.length}/200\`}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
