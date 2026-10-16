"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { Slider } from "@fasla-ui/ui/slider"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const SIZES = ["sm", "md", "lg"] as const
/** The minimum, a value between and the maximum: how far the track is filled. */
const VALUES = [
  { key: "min", value: 0 },
  { key: "mid", value: 50 },
  { key: "max", value: 100 },
] as const

/**
 * Rows of sliders with a side label each. The label column is as wide as its
 * longest label and never wraps; the labels are left-aligned in both
 * directions, one column gap from the slider, and centred on its 16px line.
 */
const ROWS = "grid w-full max-w-sm grid-cols-[max-content_minmax(0,1fr)] items-center gap-x-6 gap-y-5"
const ROW_LABEL = "whitespace-nowrap text-left text-sm text-muted-foreground"

/** A grid of examples that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start gap-x-8 gap-y-6 sm:grid-cols-2"

/** A caption over an example. */
const CAPTION = "text-sm text-muted-foreground"

/** A visible label over a slider, as Input sets its label. */
const LABEL = "text-sm font-medium text-foreground"

/**
 * A slider held in its Focus state. The thumb sets `data-focus-visible`
 * itself while keyboard focus is on it; this sets the same attribute, so the
 * example draws the component's own ring without taking the page's focus.
 */
function HeldFocus({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current
      ?.querySelectorAll("[data-slot=slider-thumb]")
      .forEach((thumb) => thumb.setAttribute("data-focus-visible", ""))
  })
  return <div ref={ref}>{children}</div>
}

export default function SliderPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.slider")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const priceLabel = (index: number) => (index === 0 ? s("range.min") : s("range.max"))

  const [volume, setVolume] = React.useState(40)
  const [price, setPrice] = React.useState<readonly number[]>([200, 800])
  const volumeId = React.useId()
  const priceId = React.useId()

  const props: PropRow[] = [
    { prop: "value", type: "number | number[]", fallback: "", description: s.rich("props.value", rich) },
    { prop: "defaultValue", type: "number | number[]", fallback: "", description: s.rich("props.defaultValue", rich) },
    { prop: "onValueChange", type: "(value) => void", fallback: "", description: s.rich("props.onValueChange", rich) },
    { prop: "onValueCommitted", type: "(value) => void", fallback: "", description: s.rich("props.onValueCommitted", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: s.rich("props.size", rich) },
    { prop: "min", type: "number", fallback: "0", description: s.rich("props.min", rich) },
    { prop: "max", type: "number", fallback: "100", description: s.rich("props.max", rich) },
    { prop: "step", type: "number", fallback: "1", description: s.rich("props.step", rich) },
    { prop: "largeStep", type: "number", fallback: "10", description: s.rich("props.largeStep", rich) },
    {
      prop: "minStepsBetweenValues",
      type: "number",
      fallback: "0",
      description: s.rich("props.minStepsBetweenValues", rich),
    },
    { prop: "aria-label", type: "string", fallback: "", description: s.rich("props.ariaLabel", rich) },
    { prop: "aria-labelledby", type: "string", fallback: "", description: s.rich("props.ariaLabelledby", rich) },
    { prop: "getAriaLabel", type: "(index) => string", fallback: "", description: s.rich("props.getAriaLabel", rich) },
    {
      prop: "getAriaValueText",
      type: "(text, value, index) => string",
      fallback: "",
      description: s.rich("props.getAriaValueText", rich),
    },
    { prop: "name", type: "string", fallback: "", description: s.rich("props.name", rich) },
    { prop: "form", type: "string", fallback: "", description: s.rich("props.form", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/slider/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="slider" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Slider defaultValue={60} aria-label={s("volume")} className="max-w-xs" />
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{s.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className={ROWS}>
            {SIZES.map((size) => (
              <React.Fragment key={size}>
                <span className={ROW_LABEL}>{s(`sizes.${size}`)}</span>
                <Slider size={size} defaultValue={50} aria-label={s("volume")} />
              </React.Fragment>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Values */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("values.title")}</h2>
        <p className="text-muted-foreground">{s.rich("values.body", rich)}</p>
        <ComponentPreview>
          <div className={ROWS}>
            {VALUES.map(({ key, value }) => (
              <React.Fragment key={key}>
                <span className={ROW_LABEL}>{s(`values.${key}`)}</span>
                <Slider defaultValue={value} aria-label={s("volume")} />
              </React.Fragment>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{s("states.default")}</span>
              <Slider defaultValue={50} aria-label={s("volume")} />
            </div>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{s("states.focus")}</span>
              <HeldFocus>
                <Slider defaultValue={50} aria-label={s("volume")} />
              </HeldFocus>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Range */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("range.title")}</h2>
        <p className="text-muted-foreground">{s.rich("range.body", rich)}</p>
        <ComponentPreview>
          <Slider defaultValue={[25, 75]} getAriaLabel={priceLabel} className="max-w-xs" />
        </ComponentPreview>
      </section>

      {/* Labels and values */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("parts.title")}</h2>
        <p className="text-muted-foreground">{s.rich("parts.body", rich)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <span id={volumeId} className={LABEL}>
                  {s("volume")}
                </span>
                <span className="text-sm tabular-nums text-muted-foreground">{volume}%</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} aria-labelledby={volumeId} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <span id={priceId} className={LABEL}>
                  {s("price")}
                </span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {/* Strings, so Arabic keeps Latin digits. */}
                  {s("priceValue", { min: String(price[0]), max: String(price[1]) })}
                </span>
              </div>
              <Slider
                value={price}
                onValueChange={setPrice}
                min={0}
                max={1000}
                step={50}
                aria-labelledby={priceId}
                getAriaLabel={priceLabel}
                getAriaValueText={(_text, value) => s("priceThumb", { value: String(value) })}
              />
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.roles", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.label", rich)}</li>
          <li>{s.rich("a11y.value", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            <code dir="ltr">Slider</code>
          </h3>
          <PropsTable rows={props} />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { Slider } from "@/components/ui/slider"

export function VolumeSlider() {
  return <Slider name="volume" defaultValue={60} aria-label="${s("volume")}" />
}`}</UsageExample>
        <UsageExample title={s("usage.range")}>{`"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"

export function PriceFilter() {
  const [price, setPrice] = React.useState<readonly number[]>([200, 800])
  return (
    <Slider
      value={price}
      onValueChange={setPrice}
      min={0}
      max={1000}
      step={50}
      getAriaLabel={(index) => (index === 0 ? "${s("range.min")}" : "${s("range.max")}")}
    />
  )
}`}</UsageExample>
        <UsageExample title={s("usage.label")}>{`"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"

export function VolumeField() {
  const id = React.useId()
  const [volume, setVolume] = React.useState(40)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span id={id} className="text-sm font-medium">
          ${s("volume")}
        </span>
        <span className="text-sm tabular-nums text-muted-foreground">{volume}%</span>
      </div>
      <Slider value={volume} onValueChange={setVolume} aria-labelledby={id} />
    </div>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
