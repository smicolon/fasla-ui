"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

import { Checkbox } from "@fasla-ui/ui/checkbox"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/** The literal element name, passed as a value so ICU does not parse it as a tag. */
const INPUT = '<input type="checkbox">'

const VARIANTS = ["default", "layout"] as const
const SIZES = ["sm", "md", "lg"] as const
const FILES = ["a", "b", "c"] as const

export default function CheckboxPage() {
  const t = useTranslations("docs.sections")
  const c = useTranslations("docs.checkbox")
  const [selected, setSelected] = useState<string[]>(["a"])

  const allSelected = selected.length === FILES.length
  const someSelected = selected.length > 0 && !allSelected

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's. `nowrap` keeps each one
  // a single unit: `aria-describedby` must not break at its hyphen.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code, input: INPUT }

  // One table, in a fixed order: appearance first, then state, then text,
  // then the native <input> props a form needs, then styling.
  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "layout"', fallback: '"default"', description: c.rich("props.variant", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: c.rich("props.size", rich) },
    { prop: "checked", type: "boolean", fallback: "", description: c.rich("props.checked", rich) },
    { prop: "defaultChecked", type: "boolean", fallback: "false", description: c.rich("props.defaultChecked", rich) },
    { prop: "indeterminate", type: "boolean", fallback: "false", description: c.rich("props.indeterminate", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: c.rich("props.disabled", rich) },
    { prop: "label", type: "string", fallback: "", description: c.rich("props.label", rich) },
    { prop: "description", type: "string", fallback: "", description: c.rich("props.description", rich) },
    { prop: "name", type: "string", fallback: "", description: c.rich("props.name", rich) },
    { prop: "value", type: "string", fallback: "", description: c.rich("props.value", rich) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: c.rich("props.onChange", rich) },
    { prop: "className", type: "string", fallback: "", description: c.rich("props.className", rich) },
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
            <Checkbox label={c("examples.terms")} />
            <Checkbox
              label={c("examples.marketing")}
              description={c("examples.marketingDescription")}
              defaultChecked
            />
            {/* Long enough to wrap: the box must stay on the first line. */}
            <Checkbox label={c("examples.long")} />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{c.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full gap-8 md:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-start gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                <Checkbox
                  variant={variant}
                  label={c("examples.marketing")}
                  description={c("examples.marketingDescription")}
                />
                <Checkbox
                  variant={variant}
                  label={c("examples.security")}
                  description={c("examples.securityDescription")}
                  defaultChecked
                />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{c.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full max-w-md gap-8 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-start gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                {SIZES.map((size) => (
                  <Checkbox
                    key={size}
                    variant={variant}
                    size={size}
                    label={c(`sizes.${size}`)}
                    defaultChecked
                  />
                ))}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{c("statesBody")}</p>
        <ComponentPreview>
          <div className="grid w-full gap-8 md:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-start gap-4">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                <Checkbox variant={variant} label={c("states.unchecked")} />
                <Checkbox variant={variant} label={c("states.checked")} defaultChecked />
                <Checkbox variant={variant} label={c("states.indeterminate")} indeterminate />
                <Checkbox variant={variant} label={c("states.disabledUnchecked")} disabled />
                <Checkbox variant={variant} label={c("states.disabledChecked")} disabled defaultChecked />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{c.rich("a11y.nativeInput", rich)}</li>
          <li>{c.rich("a11y.indeterminate", rich)}</li>
          <li>{c.rich("a11y.describedBy", rich)}</li>
          <li>{c.rich("a11y.ariaLabel", rich)}</li>
          <li>{c.rich("a11y.direction", rich)}</li>
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
        <CodeBlock>{`import { Checkbox } from "@/components/ui/checkbox"

// ${c("usage.basic")}
<Checkbox aria-label="${c("examples.terms")}" />

// ${c("usage.withLabel")}
<Checkbox label="${c("examples.terms")}" />

// ${c("usage.withDescription")}
<Checkbox
  label="${c("examples.marketing")}"
  description="${c("examples.marketingDescription")}"
/>

// ${c("usage.layout")}
<Checkbox variant="layout" label="${c("examples.security")}" />

// ${c("usage.sizes")}
<Checkbox size="sm" label="${c("sizes.sm")}" />
<Checkbox size="md" label="${c("sizes.md")}" />
<Checkbox size="lg" label="${c("sizes.lg")}" />

// ${c("usage.indeterminate")}
const all = selected.length === files.length

<Checkbox
  label="${c("examples.selectAll")}"
  checked={all}
  indeterminate={selected.length > 0 && !all}
  onChange={(e) => setSelected(e.target.checked ? files : [])}
/>`}</CodeBlock>
        <ComponentPreview>
          <div className="flex flex-col gap-3">
            <Checkbox
              label={c("examples.selectAll")}
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => setSelected(e.target.checked ? [...FILES] : [])}
            />
            <div className="flex flex-col gap-3 ps-8">
              {FILES.map((file) => (
                <Checkbox
                  key={file}
                  size="sm"
                  label={c(`examples.files.${file}`)}
                  checked={selected.includes(file)}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked ? [...prev, file] : prev.filter((f) => f !== file)
                    )
                  }
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {c("usage.selected")}{" "}
              <span className="font-medium tabular-nums text-foreground">{selected.length}</span>
            </p>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
