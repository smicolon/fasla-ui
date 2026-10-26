"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type InputOTPProps,
} from "@fasla-ui/ui/input-otp"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** Figma's four Types, in its order. */
const TYPES = ["simple", "digits", "separator", "spacing"] as const
type OtpType = (typeof TYPES)[number]

/** The code that unlocks the Label and error example. */
const SAMPLE_CODE = "123456"

/** The slots of one group, from `from`, `count` of them. */
const slots = (from: number, count: number) =>
  Array.from({ length: count }, (_, i) => <InputOTPSlot key={from + i} index={from + i} />)

/** The parts of each Figma Type, composed as a developer would. */
function Parts({ type }: { type: OtpType }) {
  switch (type) {
    case "simple":
      return (
        <>
          <InputOTPGroup>{slots(0, 3)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(3, 3)}</InputOTPGroup>
        </>
      )
    case "digits":
      return <InputOTPGroup>{slots(0, 6)}</InputOTPGroup>
    case "separator":
      return (
        <>
          <InputOTPGroup>{slots(0, 2)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(2, 2)}</InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>{slots(4, 2)}</InputOTPGroup>
        </>
      )
    case "spacing":
      return (
        <>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPGroup key={i}>{slots(i, 1)}</InputOTPGroup>
          ))}
        </>
      )
  }
}

/** A six-digit field in any Figma Type, at the component's 8px gap. */
function Code({
  type = "simple",
  ...props
}: { type?: OtpType } & Omit<InputOTPProps, "maxLength" | "children" | "render">) {
  return (
    <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...props}>
      <Parts type={type} />
    </InputOTP>
  )
}

/**
 * A field held in its Active state. A slot is Active while the field has
 * focus, and only one field on a page can have it; this sets the slot's own
 * `data-active` attribute, so the example draws the component's own ring
 * without taking the page's focus.
 */
function HeldActive({ index, children }: { index: number; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ref.current?.querySelectorAll("[data-slot=input-otp-slot]")[index]?.setAttribute("data-active", "")
  })
  return <div ref={ref}>{children}</div>
}

/**
 * Rows of fields with a side label each, the label above the field on a
 * phone. The label column is as wide as its longest label and never wraps;
 * the labels are left-aligned in both directions, one column gap from the
 * field, and centred on its 36px line.
 */
const ROWS =
  "grid w-full grid-cols-1 items-center gap-x-6 gap-y-2 sm:mx-auto sm:w-max sm:grid-cols-[max-content_max-content] sm:gap-y-5"
const ROW_LABEL = "whitespace-nowrap text-left text-sm text-muted-foreground"

/** A grid of examples that shares a top edge per row, two columns from `sm` up. */
const GRID = "grid w-full items-start justify-items-center gap-x-8 gap-y-6 sm:grid-cols-2"

/** A caption over an example. */
const CAPTION = "text-sm text-muted-foreground"

/** A visible label over a field, as Input sets its label. */
const LABEL = "text-sm font-medium text-foreground"

/**
 * Previews holding the widest types, 296px: 8px of side padding on a phone,
 * as the Tooltip page does, so they fit its preview box.
 */
const NARROW = "px-2 sm:px-6"

export default function InputOTPPage() {
  const t = useTranslations("docs.sections")
  const o = useTranslations("docs.inputOtp")

  const [code, setCode] = React.useState("")
  const labelId = React.useId()
  const messageId = React.useId()
  const wrong = code.length === 6 && code !== SAMPLE_CODE

  // One table per part, as the Breadcrumb page documents its parts.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: o.rich(`props.${key}`, richCode),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "InputOTP",
      rows: [
        row("maxLength", "number", "", "otp.maxLength"),
        row("value", "string", "", "otp.value"),
        row("defaultValue", "string", "", "otp.defaultValue"),
        row("onChange", "(value) => void", "", "otp.onChange"),
        row("onComplete", "(value) => void", "", "otp.onComplete"),
        row("pattern", "string", "", "otp.pattern"),
        row("pasteTransformer", "(text) => string", "", "otp.pasteTransformer"),
        row("inputMode", "string", '"numeric"', "otp.inputMode"),
        row("autoComplete", "string", '"one-time-code"', "otp.autoComplete"),
        row("disabled", "boolean", "false", "otp.disabled"),
        row("aria-invalid", "boolean", "", "otp.ariaInvalid"),
        row("aria-label", "string", "", "otp.ariaLabel"),
        row("aria-labelledby", "string", "", "otp.ariaLabelledby"),
        row("aria-describedby", "string", "", "otp.ariaDescribedby"),
        row("name", "string", "", "otp.name"),
        row("containerClassName", "string", "", "otp.containerClassName"),
        row("children", "ReactNode", "", "otp.children"),
        row("className", "string", "", "otp.className"),
      ],
    },
    {
      part: "InputOTPGroup",
      rows: [row("children", "ReactNode", "", "group.children"), row("className", "string", "", "group.className")],
    },
    {
      part: "InputOTPSlot",
      rows: [
        row("index", "number", "", "slot.index"),
        row("aria-invalid", "boolean", "", "slot.ariaInvalid"),
        row("className", "string", "", "slot.className"),
      ],
    },
    {
      part: "InputOTPSeparator",
      rows: [
        row("children", "ReactNode", "", "separator.children"),
        row("className", "string", "", "separator.className"),
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/input-otp/" /></h1>
        <p className="text-xl text-muted-foreground">{o("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="input-otp" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Code aria-label={o("label")} />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's four Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{o.rich("variantsBody", richCode)}</p>
        <ComponentPreview className={NARROW}>
          <div className={ROWS}>
            {TYPES.map((type) => (
              <div key={type} className="contents">
                <span className={ROW_LABEL}>{o(`types.${type}`)}</span>
                <div className="mb-3 sm:mb-0">
                  <Code type={type} aria-label={o("label")} />
                </div>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States: Figma's Otp Input Item states */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{o.rich("statesBody", richCode)}</p>
        <ComponentPreview>
          <div className={GRID}>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{o("states.default")}</span>
              <Code aria-label={o("label")} />
            </div>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{o("states.active")}</span>
              <HeldActive index={2}>
                <Code defaultValue="12" aria-label={o("label")} />
              </HeldActive>
            </div>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{o("states.invalid")}</span>
              <HeldActive index={5}>
                <Code defaultValue="123456" aria-invalid aria-label={o("label")} />
              </HeldActive>
            </div>
            <div className="flex flex-col gap-3">
              <span className={CAPTION}>{o("states.disabled")}</span>
              <Code defaultValue="123456" disabled aria-label={o("label")} />
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Label and error */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{o("validation.title")}</h2>
        <p className="text-muted-foreground">{o.rich("validation.body", richCode)}</p>
        <ComponentPreview>
          <div className="flex max-w-[252px] flex-col gap-2">
            <span id={labelId} className={LABEL}>
              {o("label")}
            </span>
            <Code
              value={code}
              onChange={setCode}
              aria-labelledby={labelId}
              aria-describedby={messageId}
              aria-invalid={wrong || undefined}
            />
            <p id={messageId} className={wrong ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
              {wrong ? o("validation.error") : o("validation.description", { code: SAMPLE_CODE })}
            </p>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{o.rich("a11y.input", richCode)}</li>
          <li>{o.rich("a11y.label", richCode)}</li>
          <li>{o.rich("a11y.error", richCode)}</li>
          <li>{o.rich("a11y.keyboard", richCode)}</li>
          <li>{o.rich("a11y.digits", richCode)}</li>
          <li>{o.rich("a11y.direction", richCode)}</li>
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
        <UsageExample title={o("usage.basic")}>{`import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function VerificationCode() {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      aria-label="${o("label")}"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}`}</UsageExample>
        <UsageExample title={o("usage.validation")}>{`"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export function VerifyCode({ onVerify }: { onVerify: (code: string) => Promise<boolean> }) {
  const labelId = React.useId()
  const messageId = React.useId()
  const [code, setCode] = React.useState("")
  const [wrong, setWrong] = React.useState(false)

  return (
    <div className="flex flex-col gap-2">
      <span id={labelId} className="text-sm font-medium">
        ${o("label")}
      </span>
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={code}
        onChange={(next) => {
          setCode(next)
          setWrong(false)
        }}
        onComplete={async (next) => setWrong(!(await onVerify(next)))}
        aria-labelledby={labelId}
        aria-describedby={messageId}
        aria-invalid={wrong || undefined}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p id={messageId} className={wrong ? "text-xs text-destructive" : "text-xs text-muted-foreground"}>
        {wrong ? "${o("validation.error")}" : "${o("validation.hint")}"}
      </p>
    </div>
  )
}`}</UsageExample>
        <UsageExample title={o("usage.spacing")}>{`import { REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export function PinField() {
  return (
    <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS} name="pin" aria-label="${o("pin")}">
      {Array.from({ length: 4 }, (_, index) => (
        <InputOTPGroup key={index}>
          <InputOTPSlot index={index} />
        </InputOTPGroup>
      ))}
    </InputOTP>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
