"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Eye, EyeOff, Search, Ticket, User } from "lucide-react"

import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const SIZES = ["xs", "sm", "md", "lg"] as const

/** A grid of fields that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-6 gap-y-5 sm:grid-cols-2"

/**
 * The show-password toggle: a real button in the end slot. Its name stays put
 * and `aria-pressed` carries the state, so it reads as one toggle.
 */
function PasswordField() {
  const i = useTranslations("docs.input")
  const [visible, setVisible] = React.useState(false)
  return (
    <Input
      label={i("parts.password")}
      description={i("parts.passwordHelp")}
      type={visible ? "text" : "password"}
      defaultValue="correct-horse"
      endIcon={
        <button
          type="button"
          aria-label={i("parts.show")}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="-m-1 flex rounded-[var(--radius-sm)] p-1 text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      }
    />
  )
}

export default function InputPage() {
  const t = useTranslations("docs.sections")
  const i = useTranslations("docs.input")

  const props: PropRow[] = [
    { prop: "size", type: '"xs" | "sm" | "md" | "lg"', fallback: '"md"', description: i.rich("props.size", richCode) },
    { prop: "radius", type: '"standard" | "rounded"', fallback: '"standard"', description: i.rich("props.radius", richCode) },
    { prop: "status", type: '"default" | "success"', fallback: '"default"', description: i.rich("props.status", richCode) },
    { prop: "invalid", type: "boolean", fallback: "false", description: i.rich("props.invalid", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: i.rich("props.disabled", richCode) },
    { prop: "label", type: "ReactNode", fallback: "", description: i.rich("props.label", richCode) },
    { prop: "labelEnd", type: "ReactNode", fallback: "", description: i.rich("props.labelEnd", richCode) },
    { prop: "description", type: "ReactNode", fallback: "", description: i.rich("props.description", richCode) },
    { prop: "descriptionEnd", type: "ReactNode", fallback: "", description: i.rich("props.descriptionEnd", richCode) },
    { prop: "error", type: "ReactNode", fallback: "", description: i.rich("props.error", richCode) },
    { prop: "startIcon", type: "ReactNode", fallback: "", description: i.rich("props.startIcon", richCode) },
    { prop: "endIcon", type: "ReactNode", fallback: "", description: i.rich("props.endIcon", richCode) },
    { prop: "placeholder", type: "string", fallback: "", description: i.rich("props.placeholder", richCode) },
    { prop: "type", type: "string", fallback: '"text"', description: i.rich("props.type", richCode) },
    { prop: "value", type: "string", fallback: "", description: i.rich("props.value", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: i.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: i.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/input/" /></h1>
        <p className="text-xl text-muted-foreground">{i("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="input" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Input
            className="max-w-sm"
            label={i("preview.label")}
            placeholder={i("preview.placeholder")}
            description={i("preview.description")}
          />
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className={GRID}>
            <Input label={i("variants.standard.label")} placeholder={i("variants.standard.placeholder")} />
            <Input
              radius="rounded"
              label={i("variants.rounded.label")}
              placeholder={i("variants.rounded.placeholder")}
              startIcon={<Search />}
            />
            <Input label={i("variants.filled.label")} defaultValue={i("variants.filled.value")} />
            <Input
              status="success"
              label={i("variants.success.label")}
              description={i("variants.success.description")}
              startIcon={<Ticket />}
              defaultValue="AUTUMN20"
            />
            <Input
              invalid
              type="email"
              label={i("variants.invalid.label")}
              error={i("variants.invalid.error")}
              defaultValue="nadia@example"
            />
            <Input
              disabled
              label={i("variants.disabled.label")}
              description={i("variants.disabled.description")}
              defaultValue="SA03 8000 0000 6080 1016 7519"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className={GRID}>
            {SIZES.map((size) => (
              <Input
                key={size}
                size={size}
                aria-label={i("sizes.label")}
                placeholder={i(`sizes.${size}`)}
                startIcon={<Search />}
              />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Labels and icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{i("partsTitle")}</h2>
        <ComponentPreview>
          <div className={GRID}>
            <Input
              label={i("parts.name")}
              labelEnd={i("parts.optional")}
              description={i("parts.nameHelp")}
              descriptionEnd={i("parts.count")}
              startIcon={<User />}
              defaultValue={i("parts.nameValue")}
            />
            <PasswordField />
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
        <UsageExample>{`import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

export function EmailField() {
  return (
    <Input
      name="email"
      type="email"
      label="${i("usage.label")}"
      description="${i("usage.description")}"
      startIcon={<Mail />}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
