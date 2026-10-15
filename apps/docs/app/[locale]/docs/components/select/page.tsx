"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { MapPin, Store, Truck } from "lucide-react"

import { Select, type SelectProps } from "@fasla-ui/ui/select"
import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const SIZES = ["xs", "sm", "md", "lg"] as const
/** The cities' values: Latin identifiers in both locales. The labels are the locale's. */
const CITIES = ["riyadh", "jeddah", "dammam", "makkah", "madinah", "khobar"] as const

/** A grid of fields that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-6 gap-y-5 sm:grid-cols-2"

/**
 * A select held open, with exactly the room its menu takes reserved under it.
 * The menu renders into this cell, so it scrolls with the page and stays in
 * the preview. The room is the list's own height plus the menu's padding,
 * border and 4px gap: the menu itself is capped at the space Base UI sees
 * below the trigger, so measuring it would read back its own cap. It changes
 * only when it is more than a pixel off. The menu never flips above the
 * trigger, and the page stays live (`modal={false}`).
 */
function HeldSelect(props: SelectProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + 4 * 2 + 1 * 2 + 4
      setRoom((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const list = cell.querySelector("[data-slot=select-list]")
      if (list && list !== observed) {
        if (observed) resize.unobserve(observed)
        observed = list
        resize.observe(list)
      }
    }
    const mutations = new MutationObserver(find)
    mutations.observe(cell, { childList: true, subtree: true })
    find()
    return () => {
      mutations.disconnect()
      resize.disconnect()
    }
  }, [cell])

  // Base UI misses a change caused by a parent's padding; a resize makes it
  // measure and place the menu again.
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
    return () => cancelAnimationFrame(frame)
  }, [room])

  return (
    <div ref={setCell} className="relative w-full" style={{ paddingBottom: room }}>
      {cell && <Select open modal={false} collisionAvoidance={{ side: "none" }} container={cell} {...props} />}
    </div>
  )
}

/** A preview with menus held open: `isolate` keeps them under the site header. */
function HeldPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <ComponentPreview>{children}</ComponentPreview>
    </div>
  )
}

export default function SelectPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.select")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const items = CITIES.map((value) => ({ value, label: s(`cities.${value}`) }))
  const four = items.slice(0, 4)

  const selectProps: PropRow[] = [
    { prop: "items", type: "SelectOption[]", fallback: "", description: s.rich("props.items", rich) },
    { prop: "children", type: "ReactNode", fallback: "", description: s.rich("props.children", rich) },
    { prop: "placeholder", type: "ReactNode", fallback: "", description: s.rich("props.placeholder", rich) },
    { prop: "size", type: '"xs" | "sm" | "md" | "lg"', fallback: '"md"', description: s.rich("props.size", rich) },
    { prop: "radius", type: '"standard" | "rounded"', fallback: '"standard"', description: s.rich("props.radius", rich) },
    { prop: "multiple", type: "boolean", fallback: "false", description: s.rich("props.multiple", rich) },
    { prop: "display", type: '"badges" | "text"', fallback: '"badges"', description: s.rich("props.display", rich) },
    { prop: "value", type: "string | string[] | null", fallback: "", description: s.rich("props.value", rich) },
    { prop: "defaultValue", type: "string | string[] | null", fallback: "", description: s.rich("props.defaultValue", rich) },
    { prop: "onValueChange", type: "(value) => void", fallback: "", description: s.rich("props.onValueChange", rich) },
    { prop: "label", type: "ReactNode", fallback: "", description: s.rich("props.label", rich) },
    { prop: "aria-label", type: "string", fallback: "", description: s.rich("props.ariaLabel", rich) },
    { prop: "aria-labelledby", type: "string", fallback: "", description: s.rich("props.ariaLabelledby", rich) },
    { prop: "labelEnd", type: "ReactNode", fallback: "", description: s.rich("props.labelEnd", rich) },
    { prop: "description", type: "ReactNode", fallback: "", description: s.rich("props.description", rich) },
    { prop: "descriptionEnd", type: "ReactNode", fallback: "", description: s.rich("props.descriptionEnd", rich) },
    { prop: "startIcon", type: "ReactNode", fallback: "", description: s.rich("props.startIcon", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("props.disabled", rich) },
    { prop: "readOnly", type: "boolean", fallback: "false", description: s.rich("props.readOnly", rich) },
    { prop: "required", type: "boolean", fallback: "false", description: s.rich("props.required", rich) },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", rich) },
    { prop: "form", type: "string", fallback: "", description: s.rich("props.form", rich) },
    { prop: "id", type: "string", fallback: "", description: s.rich("props.id", rich) },
    { prop: "open", type: "boolean", fallback: "", description: s.rich("props.open", rich) },
    { prop: "defaultOpen", type: "boolean", fallback: "false", description: s.rich("props.defaultOpen", rich) },
    { prop: "onOpenChange", type: "(open) => void", fallback: "", description: s.rich("props.onOpenChange", rich) },
    { prop: "modal", type: "boolean", fallback: "true", description: s.rich("props.modal", rich) },
    {
      prop: "collisionAvoidance",
      type: "{ side, align, fallbackAxisSide }",
      fallback: "",
      description: s.rich("props.collisionAvoidance", rich),
    },
    { prop: "container", type: "HTMLElement", fallback: "", description: s.rich("props.container", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]
  const itemProps: PropRow[] = [
    { prop: "value", type: "string", fallback: "", description: s.rich("itemProps.value", rich) },
    { prop: "label", type: "string", fallback: "", description: s.rich("itemProps.label", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("itemProps.disabled", rich) },
    { prop: "children", type: "ReactNode", fallback: "", description: s.rich("itemProps.children", rich) },
  ]
  const propTables = [
    { part: "Select", rows: selectProps },
    { part: "SelectItem", rows: itemProps },
  ]

  const long = (["airport", "olaya", "park"] as const).map((key, i) => ({
    value: `point-${i}`,
    label: s(`long.options.${key}`),
  }))

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/select/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="select" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Select
            className="max-w-xs"
            label={s("city")}
            description={s("cityHelp")}
            placeholder={s("cityPlaceholder")}
            items={items}
          />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{s.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            {SIZES.map((size) => (
              <Select
                key={size}
                size={size}
                aria-label={s("city")}
                startIcon={<MapPin />}
                placeholder={s(`sizes.${size}`)}
                items={items}
              />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("radius.title")}</h2>
        <p className="text-muted-foreground">{s.rich("radius.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <Select aria-label={s("city")} defaultValue="riyadh" items={items} />
            <Select radius="rounded" aria-label={s("city")} defaultValue="riyadh" items={items} />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <Select label={s("states.enabled")} placeholder={s("cityPlaceholder")} items={items} />
            <Select disabled label={s("states.disabled")} defaultValue="riyadh" items={items} />
          </div>
        </ComponentPreview>
      </section>

      {/* Multiple */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("multiple.title")}</h2>
        <p className="text-muted-foreground">{s.rich("multiple.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <Select
              multiple
              label={s("delivery")}
              description={s("multiple.badges")}
              placeholder={s("deliveryPlaceholder")}
              startIcon={<Truck />}
              defaultValue={["riyadh", "jeddah", "dammam"]}
              items={items}
            />
            <Select
              multiple
              display="text"
              label={s("delivery")}
              description={s("multiple.text")}
              placeholder={s("deliveryPlaceholder")}
              startIcon={<Truck />}
              defaultValue={["riyadh", "jeddah", "dammam"]}
              items={items}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Labels and icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("parts.title")}</h2>
        <p className="text-muted-foreground">{s.rich("parts.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <Input
              label={s("parts.name")}
              labelEnd={s("parts.optional")}
              description={s("parts.nameHelp")}
              placeholder={s("parts.namePlaceholder")}
            />
            <Select
              label={s("parts.branch")}
              labelEnd={s("parts.optional")}
              description={s("parts.branchHelp")}
              descriptionEnd={s("parts.count")}
              startIcon={<Store />}
              placeholder={s("parts.branchPlaceholder")}
              items={items}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* The menu */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("menu.title")}</h2>
        <p className="text-muted-foreground">{s.rich("menu.body", rich)}</p>
        <HeldPreview>
          <div className={GRID}>
            <HeldSelect aria-label={s("city")} defaultValue="riyadh" items={four} />
            <HeldSelect multiple aria-label={s("delivery")} defaultValue={["riyadh", "dammam"]} items={four} />
          </div>
        </HeldPreview>
      </section>

      {/* Long options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("long.title")}</h2>
        <p className="text-muted-foreground">{s.rich("long.body", rich)}</p>
        <HeldPreview>
          <div className="w-full max-w-xs">
            <HeldSelect label={s("long.label")} startIcon={<MapPin />} defaultValue="point-0" items={long} />
          </div>
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.roles", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.label", rich)}</li>
          <li>{s.rich("a11y.badges", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        {propTables.map(({ part, rows }) => (
          <div key={part} className="space-y-3">
            <h3 className="text-lg font-semibold">
              <code dir="ltr">{part}</code>
            </h3>
            <PropsTable rows={rows} />
          </div>
        ))}
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { MapPin } from "lucide-react"
import { Select } from "@/components/ui/select"

const cities = [
  { value: "riyadh", label: "${s("cities.riyadh")}" },
  { value: "jeddah", label: "${s("cities.jeddah")}" },
  { value: "dammam", label: "${s("cities.dammam")}" },
]

export function CityField() {
  return (
    <Select
      name="city"
      label="${s("city")}"
      placeholder="${s("cityPlaceholder")}"
      startIcon={<MapPin />}
      items={cities}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.multiple")}>{`"use client"

import * as React from "react"
import { Select } from "@/components/ui/select"

const cities = [
  { value: "riyadh", label: "${s("cities.riyadh")}" },
  { value: "jeddah", label: "${s("cities.jeddah")}" },
  { value: "dammam", label: "${s("cities.dammam")}" },
]

export function DeliveryCities() {
  const [value, setValue] = React.useState<string[]>(["riyadh"])
  return (
    <Select
      multiple
      label="${s("delivery")}"
      placeholder="${s("deliveryPlaceholder")}"
      items={cities}
      value={value}
      onValueChange={setValue}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.items")}>{`import { Select, SelectItem } from "@/components/ui/select"

export function BranchField() {
  return (
    <Select label="${s("parts.branch")}" placeholder="${s("parts.branchPlaceholder")}">
      <SelectItem value="olaya">${s("usage.olaya")}</SelectItem>
      <SelectItem value="malqa">${s("usage.malqa")}</SelectItem>
      <SelectItem value="nakheel" disabled>
        ${s("usage.nakheel")}
      </SelectItem>
    </Select>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
