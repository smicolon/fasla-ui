"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Info } from "lucide-react"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  type TooltipContentProps,
  type TooltipSide,
} from "@fasla-ui/ui/tooltip"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const VARIANTS = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const RADII = ["standard", "rounded"] as const
const SIDES: TooltipSide[] = ["top", "bottom", "left", "right", "inline-start", "inline-end"]
/**
 * `left` and `right` are physical, so their cells stay in the left and right
 * columns in both directions; a right-to-left grid would otherwise swap them
 * and point the two tooltips at each other. The logical sides follow the grid.
 */
const SIDE_CELL: Record<TooltipSide, string> = {
  top: "order-1",
  bottom: "order-2",
  left: "order-3 rtl:order-4",
  right: "order-4 rtl:order-3",
  "inline-start": "order-5",
  "inline-end": "order-6",
}
const PHOTO = "/samples/avatar-portrait.png"

/** The sample trigger: a plain button, styled only so it shows on the page. */
const TRIGGER =
  "rounded-[var(--radius-md)] border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"

/**
 * A preview whose tooltips are held open, to show them without hovering.
 * They portal into the preview itself, so they scroll with the page and stay
 * under the site header (`isolate`), and they hold their side instead of
 * flipping at the window edge. `overflow-x-clip` keeps a narrow screen from
 * scrolling sideways.
 */
function HeldPreview({ children }: { children: (container: HTMLElement) => React.ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  return (
    <div ref={setContainer} className="relative isolate overflow-x-clip">
      <ComponentPreview className="py-16">{container && children(container)}</ComponentPreview>
    </div>
  )
}

function Held({
  label,
  container,
  caption,
  cellClassName,
  ...content
}: Partial<TooltipContentProps> & {
  label: string
  container: HTMLElement
  caption?: React.ReactNode
  cellClassName?: string
}) {
  // The caption sits on the side the tooltip leaves free: under the trigger,
  // or above it when the tooltip opens below.
  const captionNode = caption && <code className="text-xs text-muted-foreground">{caption}</code>
  const below = content.side === "bottom"
  return (
    <div className={`flex flex-col items-center gap-3 ${cellClassName ?? ""}`}>
      {below && captionNode}
      <Tooltip open>
        <TooltipTrigger className={TRIGGER}>{label}</TooltipTrigger>
        <TooltipContent
          container={container}
          collisionAvoidance={{ side: "none", align: "none" }}
          {...content}
        />
      </Tooltip>
      {!below && captionNode}
    </div>
  )
}

export default function TooltipPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.tooltip")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code }

  const trigger = a("sample.trigger")
  const title = a("sample.title")

  // One table per part, as shadcn and Base UI document them.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: a.rich(`props.${key}`, rich),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "Tooltip",
      rows: [
        row("open", "boolean", "", "open"),
        row("defaultOpen", "boolean", "false", "defaultOpen"),
        row("onOpenChange", "(open, eventDetails) => void", "", "onOpenChange"),
        row("disabled", "boolean", "false", "disabled"),
      ],
    },
    {
      part: "TooltipTrigger",
      rows: [
        row("render", "ReactElement", "", "render"),
        row("delay", "number", "0", "delay"),
      ],
    },
    {
      part: "TooltipContent",
      rows: [
        row("variant", '"primary" | "secondary" | "info" | "success" | "warning" | "destructive"', '"primary"', "variant"),
        row("radius", '"standard" | "rounded"', '"standard"', "radius"),
        row("side", '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"', '"top"', "side"),
        row("align", '"start" | "center" | "end"', '"center"', "align"),
        row("sideOffset", "number", "", "sideOffset"),
        row("arrow", "boolean", "true", "arrow"),
        row("description", "ReactNode", "", "description"),
        row("icon", "ReactNode", "", "icon"),
        row("avatar", "AvatarProps", "", "avatar"),
        row("container", "HTMLElement", "", "container"),
        row("className", "string", "", "className"),
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/tooltip/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="tooltip" />
        <p className="text-muted-foreground">{a.rich("installNote", rich)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview className="py-16">
          <Tooltip>
            <TooltipTrigger className={TRIGGER}>{trigger}</TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{a("previewHint")}</p>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{a.rich("variantsBody", rich)}</p>
        <HeldPreview>
          {(container) => (
            <div className="grid grid-cols-2 gap-x-6 gap-y-16 pt-6 sm:grid-cols-3">
              {RADII.flatMap((radius) =>
                VARIANTS.map((variant) => (
                  <Held
                    key={`${radius}-${variant}`}
                    container={container}
                    label={trigger}
                    variant={variant}
                    radius={radius}
                    caption={radius === "rounded" ? `${variant} · rounded` : variant}
                  >
                    {title}
                  </Held>
                ))
              )}
            </div>
          )}
        </HeldPreview>
      </section>

      {/* Placement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("placement.title")}</h2>
        <p className="text-muted-foreground">{a.rich("placement.body", rich)}</p>
        <HeldPreview>
          {(container) => (
            <div className="grid grid-cols-2 gap-x-6 gap-y-24 py-6 sm:gap-x-16">
              {SIDES.map((side) => (
                <Held
                  key={side}
                  container={container}
                  label={trigger}
                  side={side}
                  caption={side}
                  cellClassName={SIDE_CELL[side]}
                >
                  {title}
                </Held>
              ))}
            </div>
          )}
        </HeldPreview>
        <HeldPreview>
          {(container) => (
            <Held container={container} label={trigger} arrow={false} caption="arrow={false}">
              {title}
            </Held>
          )}
        </HeldPreview>
      </section>

      {/* Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("content.title")}</h2>
        <p className="text-muted-foreground">{a.rich("content.body", rich)}</p>
        <HeldPreview>
          {(container) => (
            <div className="flex flex-col items-center gap-28 pt-10">
              <Held container={container} label={trigger} description={a("sample.description")} caption="description">
                {title}
              </Held>
              <Held
                container={container}
                label={trigger}
                icon={<Info />}
                description={a("sample.description")}
                caption="icon"
              >
                {title}
              </Held>
              <Held
                container={container}
                label={trigger}
                avatar={{ src: PHOTO, name: "" }}
                description={a("sample.edited")}
                caption="avatar"
              >
                {a("sample.name")}
              </Held>
              <Held container={container} label={trigger} description={a("sample.longDescription")} caption="296px">
                {a("sample.longTitle")}
              </Held>
            </div>
          )}
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{a.rich("a11y.hint", rich)}</li>
          <li>{a.rich("a11y.keyboard", rich)}</li>
          <li>{a.rich("a11y.interactive", rich)}</li>
          <li>{a.rich("a11y.colour", rich)}</li>
          <li>{a.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={a("usage.basic")}>{`import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ShareTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>${trigger}</TooltipTrigger>
      <TooltipContent>${title}</TooltipContent>
    </Tooltip>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.iconButton")}>{`import { Link } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function CopyLinkButton() {
  return (
    <Tooltip>
      <TooltipTrigger aria-label="${title}">
        <Link aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>${title}</TooltipContent>
    </Tooltip>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.styled")}>{`import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ShareInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>${trigger}</TooltipTrigger>
      <TooltipContent
        variant="info"
        side="bottom"
        icon={<Info />}
        description="${a("sample.description")}"
      >
        ${title}
      </TooltipContent>
    </Tooltip>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.avatar")}>{`import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function LastEditedTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>${trigger}</TooltipTrigger>
      <TooltipContent
        variant="secondary"
        avatar={{ src: "/avatars/layla.png", name: "" }}
        description="${a("sample.edited")}"
      >
        ${a("sample.name")}
      </TooltipContent>
    </Tooltip>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.logical")}>{`import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function EndSideTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>${trigger}</TooltipTrigger>
      <TooltipContent side="inline-end">${title}</TooltipContent>
    </Tooltip>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
