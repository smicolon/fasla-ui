"use client"

import { useTranslations } from "next-intl"

import { Steps, StepsItem, type StepStatus, type StepsProps } from "@fasla-ui/ui/steps"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/**
 * The sample flow, in order: three steps of a checkout, one done, one current
 * and one to come. Three keep every label on one line in a phone's preview.
 */
const STEPS = ["cart", "shipping", "payment"] as const

const RADII = ["standard", "rounded"] as const

/** A caption over an example. */
const CAPTION = "text-sm text-muted-foreground"

/** A step's status from the current step's number, counting from 1. */
const statusOf = (step: number, current: number): StepStatus =>
  step < current ? "done" : step === current ? "current" : "upcoming"

/**
 * Room for a horizontal row with descriptions: each line may use the space up
 * to halfway to its neighbours' bullets, and "Address and delivery" needs
 * 134px, so three steps need 448px. Narrower, on a phone, the row scrolls
 * sideways inside its preview instead of wrapping.
 */
const WIDE_ROW = "w-full overflow-x-auto"
const WIDE_ROW_INNER = "min-w-[28rem]"

/** The checkout with step 2 current, as a developer would write it. */
function Flow({
  current = 2,
  icon = false,
  descriptions = false,
  ...props
}: { current?: number; icon?: boolean; descriptions?: boolean } & Omit<StepsProps, "children">) {
  const s = useTranslations("docs.steps")
  return (
    <Steps aria-label={s("name")} {...props}>
      {STEPS.map((step, i) => {
        const status = statusOf(i + 1, current)
        return (
          <StepsItem
            key={step}
            status={status}
            icon={icon && status === "done"}
            label={s(`steps.${step}`)}
            description={descriptions ? s(`steps.${step}Text`) : undefined}
          />
        )
      })}
    </Steps>
  )
}

export default function StepsPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.steps")

  // One table per part, as the Breadcrumb page documents its parts.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: s.rich(`props.${key}`, richCode),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "Steps",
      rows: [
        row("orientation", '"horizontal" | "vertical"', '"horizontal"', "steps.orientation"),
        row("radius", '"standard" | "rounded"', '"standard"', "steps.radius"),
        row("aria-label", "string", "", "steps.ariaLabel"),
        row("children", "ReactNode", "", "steps.children"),
        row("className", "string", "", "steps.className"),
      ],
    },
    {
      part: "StepsItem",
      rows: [
        row("status", '"done" | "current" | "upcoming"', '"upcoming"', "item.status"),
        row("label", "ReactNode", "", "item.label"),
        row("description", "ReactNode", "", "item.description"),
        row("icon", "boolean", "false", "item.icon"),
        row("statusLabel", "string", "", "item.statusLabel"),
        row("className", "string", "", "item.className"),
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/steps/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="steps" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Flow />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s("variantsBody")}</p>
        <ComponentPreview>
          <div className="flex w-full flex-col gap-6">
            {RADII.map((radius) => (
              <div key={radius} className="flex flex-col gap-3">
                <span className={CAPTION}>{s(`radius.${radius}`)}</span>
                <Flow radius={radius} />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Orientation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("orientation.title")}</h2>
        <p className="text-muted-foreground">{s("orientation.body")}</p>
        <ComponentPreview>
          <div className="grid w-full grid-cols-2 items-start justify-items-center gap-x-6">
            {RADII.map((radius) => (
              <div key={radius} className="flex flex-col gap-3">
                <span className={CAPTION}>{s(`radius.${radius}`)}</span>
                <Flow orientation="vertical" radius={radius} />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Step icon and description: Figma's Step Icon and Sub Text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("details.title")}</h2>
        <p className="text-muted-foreground">{s("details.body")}</p>
        <ComponentPreview>
          <div className="flex w-full flex-col gap-8">
            <div className={WIDE_ROW}>
              <div className={WIDE_ROW_INNER}>
                <Flow icon descriptions />
              </div>
            </div>
            <Flow orientation="vertical" radius="rounded" icon descriptions className="mx-auto w-max" />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.list", richCode)}</li>
          <li>{s.rich("a11y.current", richCode)}</li>
          <li>{s.rich("a11y.status", richCode)}</li>
          <li>{s.rich("a11y.display", richCode)}</li>
          <li>{s.rich("a11y.direction", richCode)}</li>
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
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { Steps, StepsItem } from "@/components/ui/steps"

export function CheckoutSteps() {
  return (
    <Steps aria-label="${s("name")}">
      <StepsItem status="done" label="${s("steps.cart")}" />
      <StepsItem status="done" label="${s("steps.shipping")}" />
      <StepsItem status="current" label="${s("steps.payment")}" />
      <StepsItem status="upcoming" label="${s("steps.review")}" />
    </Steps>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.current")}>{`import { Steps, StepsItem } from "@/components/ui/steps"

const steps = ["${s("steps.cart")}", "${s("steps.shipping")}", "${s("steps.payment")}", "${s("steps.review")}"]

export function CheckoutProgress({ current }: { current: number }) {
  return (
    <Steps aria-label="${s("name")}" radius="rounded">
      {steps.map((label, index) => (
        <StepsItem
          key={label}
          label={label}
          status={index < current ? "done" : index === current ? "current" : "upcoming"}
          icon={index < current}
        />
      ))}
    </Steps>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.vertical")}>{`import { Steps, StepsItem } from "@/components/ui/steps"

export function OrderSteps() {
  return (
    <Steps aria-label="${s("name")}" orientation="vertical">
      <StepsItem status="done" label="${s("steps.cart")}" description="${s("steps.cartText")}" />
      <StepsItem status="done" label="${s("steps.shipping")}" description="${s("steps.shippingText")}" />
      <StepsItem status="current" label="${s("steps.payment")}" description="${s("steps.paymentText")}" />
      <StepsItem status="upcoming" label="${s("steps.review")}" description="${s("steps.reviewText")}" />
    </Steps>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
