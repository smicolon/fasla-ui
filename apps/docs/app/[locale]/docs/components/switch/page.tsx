"use client"

import { useTranslations } from "next-intl"

import { Switch } from "@fasla-ui/ui/switch"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function SwitchPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.switch")

  const props: PropRow[] = [
    { prop: "size", type: '"sm" | "default" | "lg"', fallback: '"default"', description: s.rich("props.size", richCode) },
    { prop: "checked", type: "boolean", fallback: "", description: s.rich("props.checked", richCode) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", richCode) },
    { prop: "label", type: "string", fallback: "", description: s.rich("props.label", richCode) },
    { prop: "description", type: "string", fallback: "", description: s.rich("props.description", richCode) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", richCode) },
    { prop: "onChange", type: "(event) => void", fallback: "", description: s.rich("props.onChange", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/switch/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="switch" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex max-w-xs flex-col gap-4">
            <div className="flex items-center gap-6">
              <Switch />
              <Switch defaultChecked />
            </div>
            {/* Long enough to wrap: the track must stay on the first line. */}
            <Switch label={s("preview.long")} defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Switch size="sm" />
            <Switch size="default" />
            <Switch size="lg" />
          </div>
        </ComponentPreview>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("withLabelTitle")}</h2>
        <ComponentPreview>
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Switch label={s("withLabel.airplane")} />
            <Switch label={s("withLabel.dark")} description={s("withLabel.darkDescription")} />
            <Switch
              label={s("withLabel.notifications")}
              description={s("withLabel.notificationsDescription")}
              defaultChecked
            />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
            <Switch disabled />
            <Switch disabled defaultChecked />
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
        <CodeBlock>{`import { Switch } from "@/components/ui/switch"

// ${s("usage.basic")}
<Switch />

// ${s("usage.withLabel")}
<Switch label="${s("withLabel.airplane")}" />

// ${s("usage.withDescription")}
<Switch
  label="${s("withLabel.dark")}"
  description="${s("withLabel.darkDescription")}"
/>

// ${s("usage.sizes")}
<Switch size="sm" />
<Switch size="default" />
<Switch size="lg" />

// ${s("usage.controlled")}
const [enabled, setEnabled] = useState(false)

<Switch
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>`}</CodeBlock>
      </section>
    </div>
  )
}
