"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
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

// The page is prerendered, and useLayoutEffect warns on the server.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * The room a held tooltip needs around its trigger, in px, so the cell can
 * reserve it.
 *
 * Sized from the tooltip's own width and height, which do not change when
 * the trigger moves. Reading positions instead made a loop: reserving room
 * nudges the trigger, Base UI moves the tooltip a frame later, and a reading
 * taken in between was a pixel off, so the room changed again — the tooltip
 * jittered for ever. The one positional number, the gap to the trigger, is
 * read only right after Base UI places the tooltip, when it is fresh.
 */
function useHeldRoom() {
  const trigger = useRef<HTMLButtonElement>(null)
  const gap = useRef<number | null>(null)
  const [popup, setPopup] = useState<HTMLDivElement | null>(null)
  const [room, setRoom] = useState({ top: 0, right: 0, bottom: 0, left: 0 })

  useIsomorphicLayoutEffect(() => {
    const t = trigger.current
    const positioner = popup?.parentElement
    if (!t || !popup || !positioner) return
    /** The side it opened on, as a physical side. */
    const physicalSide = () => {
      const side = popup.dataset.side ?? "top"
      if (side !== "inline-start" && side !== "inline-end") return side
      const rtl = getComputedStyle(t).direction === "rtl"
      return (side === "inline-start") !== rtl ? "left" : "right"
    }
    const readGap = () => {
      const a = t.getBoundingClientRect()
      const b = popup.getBoundingClientRect()
      const side = physicalSide()
      const reading =
        side === "top" ? a.top - b.bottom : side === "bottom" ? b.top - a.bottom : side === "left" ? a.left - b.right : b.left - a.right
      // Before it is first placed it sits at the page origin; ignore that.
      if (reading < 0 || reading > 24) return
      // Base UI rounds positions to whole device pixels, so the same 8px gap
      // reads anywhere from 7.5 to 8.5 as the trigger moves. Keep the first
      // reading unless a new one is more than a pixel off, or the room would
      // flip by a pixel, move the trigger, and flip back.
      if (gap.current === null || Math.abs(reading - gap.current) > 1) gap.current = reading
    }
    const measure = () => {
      if (gap.current === null) return
      const a = t.getBoundingClientRect()
      const b = popup.getBoundingClientRect()
      if (!b.width) return
      const side = physicalSide()
      const spreadX = Math.max(0, (b.width - a.width) / 2)
      const spreadY = Math.max(0, (b.height - a.height) / 2)
      const reach = (b: DOMRect) => (side === "top" || side === "bottom" ? b.height : b.width) + gap.current!
      const raw =
        side === "top"
          ? { top: reach(b), right: spreadX, bottom: 0, left: spreadX }
          : side === "bottom"
            ? { top: 0, right: spreadX, bottom: reach(b), left: spreadX }
            : side === "left"
              ? { top: spreadY, right: 0, bottom: spreadY, left: reach(b) }
              : { top: spreadY, right: reach(b), bottom: spreadY, left: 0 }
      const next = {
        top: Math.ceil(raw.top),
        right: Math.ceil(raw.right),
        bottom: Math.ceil(raw.bottom),
        left: Math.ceil(raw.left),
      }
      setRoom((prev) =>
        prev.top === next.top && prev.right === next.right && prev.bottom === next.bottom && prev.left === next.left
          ? prev
          : next
      )
    }
    // Base UI writes the positioner's style each time it places the tooltip.
    const placed = new MutationObserver(() => {
      readGap()
      measure()
    })
    placed.observe(positioner, { attributes: true, attributeFilter: ["style"] })
    const resize = new ResizeObserver(measure)
    resize.observe(popup)
    resize.observe(t)
    readGap()
    measure()
    return () => {
      placed.disconnect()
      resize.disconnect()
    }
  }, [popup])

  // Making room moves the trigger, and Base UI does not always notice a move
  // caused by a parent's padding, which would leave the tooltip where it was.
  // A resize event makes it re-place every open tooltip against its trigger.
  useIsomorphicLayoutEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
    return () => cancelAnimationFrame(frame)
  }, [room])

  return { trigger, popup: setPopup, room }
}

/**
 * A preview whose tooltips are held open, to show them without hovering.
 * Each tooltip renders into its own cell, so it scrolls with the page and
 * stays inside the preview; `isolate` keeps it under the site header and
 * `overflow-x-clip` keeps a narrow screen from scrolling sideways.
 */
function HeldPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-x-clip">
      {/* 8px of side padding on a phone, so a 320px tooltip and a row of
          side tooltips still fit the preview. The captions' 24px below
          plus 8px makes the bottom match the 32px top. */}
      <ComponentPreview className="px-2 pb-2 pt-8 sm:px-6">{children}</ComponentPreview>
    </div>
  )
}

/**
 * Layout rule for every preview grid here: cells in a row share a top edge,
 * captions sit on a shared line, and no tooltip leaves its cell.
 *
 * Shared cells (the default) are four rows of their grid — room above, the
 * trigger, room below, the caption — through `subgrid`, so each row is as
 * tall as the tallest cell needs and every trigger and caption lines up.
 * Put them in a `SHARED_GRID`. A standalone cell keeps only the room its own
 * tooltip needs, for a row whose triggers should not line up.
 */
const SHARED_GRID = "grid items-stretch gap-y-0"

function Held({
  label,
  caption,
  cellClassName,
  standalone = false,
  ...content
}: Partial<TooltipContentProps> & {
  label: string
  caption?: React.ReactNode
  cellClassName?: string
  standalone?: boolean
}) {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null)
  const { trigger, popup, room } = useHeldRoom()
  const layout = standalone ? "flex flex-col items-center" : "row-span-4 grid grid-rows-subgrid justify-items-center"
  return (
    <div className={`relative ${layout} ${cellClassName ?? ""}`}>
      <div style={{ height: room.top }} />
      <div style={{ paddingLeft: room.left, paddingRight: room.right }}>
        <Tooltip open>
          <TooltipTrigger ref={trigger} className={TRIGGER}>
            {label}
          </TooltipTrigger>
          {portal && (
            <TooltipContent
              ref={popup}
              container={portal}
              // Never flips sides. Above or below the trigger it may shift
              // sideways, so a narrow preview narrows the tooltip instead of
              // clipping it; that shift is horizontal only, so it never slides
              // as the page scrolls. Beside the trigger it does not shift at
              // all, or Base UI would pull it toward the visible part of the
              // page and it would slide up and down while scrolling.
              collisionAvoidance={{
                side: "none",
                align: !content.side || content.side === "top" || content.side === "bottom" ? "shift" : "none",
              }}
              {...content}
            />
          )}
        </Tooltip>
      </div>
      <div style={{ height: room.bottom }} />
      <div className="pb-6 pt-3">
        {caption && <code className="text-xs text-muted-foreground">{caption}</code>}
      </div>
      {/* Out of the layout flow, so it takes no row. */}
      <div ref={setPortal} className="absolute left-0 top-0" />
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
        row("sideOffset", "number", "8", "sideOffset"),
        row("arrow", "boolean", "true", "arrow"),
        row("description", "ReactNode", "", "description"),
        row("icon", "ReactNode", "", "icon"),
        row("avatar", 'Omit<AvatarProps, "size">', "", "avatar"),
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
          <div className={`${SHARED_GRID} grid-cols-2 gap-x-6 sm:grid-cols-3`}>
            {RADII.flatMap((radius) =>
              VARIANTS.map((variant) => (
                <Held
                  key={`${radius}-${variant}`}
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
        </HeldPreview>
      </section>

      {/* Placement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("placement.title")}</h2>
        <p className="text-muted-foreground">{a.rich("placement.body", rich)}</p>
        <HeldPreview>
          {/* Standalone cells: top stacks tooltip, button, label; bottom
              stacks button, tooltip, label; both start at the same top edge.
              Each side row's cells are the same height, so they line up.
              One column below 360px: two side tooltips in a row would leave
              each only ~50px beside its button. */}
          <div className="grid grid-cols-1 items-start gap-x-3 min-[360px]:grid-cols-2 sm:gap-x-16">
            {SIDES.map((side) => (
              <Held
                key={side}
                standalone
                label={trigger}
                side={side}
                caption={side}
                cellClassName={SIDE_CELL[side]}
              >
                {title}
              </Held>
            ))}
          </div>
        </HeldPreview>
        <HeldPreview>
          <Held standalone label={trigger} arrow={false} caption="arrow={false}">
            {title}
          </Held>
        </HeldPreview>
      </section>

      {/* Content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("content.title")}</h2>
        <p className="text-muted-foreground">{a.rich("content.body", rich)}</p>
        <HeldPreview>
          {/* Two rows of two, each row sized to its own content so the
              widest pair still fits; one column on a narrow screen. */}
          <div className="flex flex-col items-center">
            <div className={`${SHARED_GRID} grid-cols-1 gap-x-6 sm:grid-cols-[auto_auto]`}>
              <Held label={trigger} description={a("sample.description")} caption="description">
                {title}
              </Held>
              <Held label={trigger} icon={<Info />} description={a("sample.description")} caption="icon">
                {title}
              </Held>
            </div>
            <div className={`${SHARED_GRID} grid-cols-1 gap-x-6 sm:grid-cols-[auto_auto]`}>
              <Held
                label={trigger}
                avatar={{ src: PHOTO, name: "" }}
                description={a("sample.edited")}
                caption="avatar"
              >
                {a("sample.name")}
              </Held>
              <Held label={trigger} description={a("sample.longDescription")} caption="296px">
                {a("sample.longTitle")}
              </Held>
            </div>
          </div>
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
