"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { PencilLine, Settings, Share, Trash2, User } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@fasla-ui/ui/dropdown-menu"
import { Button } from "@fasla-ui/ui/button"
import { Avatar } from "@fasla-ui/ui/avatar"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const PHOTO = "/samples/avatar-portrait.png"

/** Menus side by side from `sm` up, sharing a top edge; one column on a phone. */
const GRID = "grid w-full items-start justify-items-center gap-x-6 gap-y-5 sm:grid-cols-2"

// The page is prerendered, and useLayoutEffect warns on the server.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * A menu held open under its trigger, with exactly the room it takes reserved
 * under it. The menu renders into this cell, so it scrolls with the page and
 * stays in the preview.
 *
 * The room is the menu's content height (`scrollHeight`, which its cap at the
 * space Base UI sees below the trigger does not shorten) plus its 1px borders
 * and 4px gap, never a position. It changes only when it is more than a pixel
 * off. The menu never flips above the trigger, and the page stays live
 * (`modal={false}`).
 */
function HeldMenu({ trigger, className, children }: { trigger: string; className?: string; children: React.ReactNode }) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [room, setRoom] = React.useState(0)

  useIsomorphicLayoutEffect(() => {
    if (!cell) return
    let observed: HTMLElement | null = null
    const measure = () => {
      if (!observed) return
      const next = Math.ceil(observed.scrollHeight + 2) + 4
      setRoom((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    }
    const resize = new ResizeObserver(measure)
    const find = () => {
      const popup = cell.querySelector<HTMLElement>("[data-slot=dropdown-menu-content]")
      if (popup && popup !== observed) {
        if (observed) resize.unobserve(observed)
        observed = popup
        resize.observe(popup)
        measure()
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
    <div ref={setCell} className="relative flex w-56 max-w-full items-start" style={{ paddingBottom: room }}>
      {cell && (
        <DropdownMenu open modal={false}>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>{trigger}</DropdownMenuTrigger>
          <DropdownMenuContent
            container={cell}
            collisionAvoidance={{ side: "none", align: "none" }}
            className={className ?? "w-56 max-w-full"}
          >
            {children}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
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

export default function DropdownMenuPage() {
  const t = useTranslations("docs.sections")
  const d = useTranslations("docs.dropdownMenu")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: d.rich(`props.${key}`, rich),
  })
  const children = row("children", "ReactNode", "", "children")
  const className = row("className", "string", "", "className")
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "DropdownMenu",
      rows: [
        row("open", "boolean", "", "open"),
        row("defaultOpen", "boolean", "false", "defaultOpen"),
        row("onOpenChange", "(open, eventDetails) => void", "", "onOpenChange"),
        row("onOpenChangeComplete", "(open) => void", "", "onOpenChangeComplete"),
        row("modal", "boolean", "true", "modal"),
        row("disabled", "boolean", "false", "disabled"),
        row("loopFocus", "boolean", "true", "loopFocus"),
        row("highlightItemOnHover", "boolean", "true", "highlightItemOnHover"),
        row("orientation", '"vertical" | "horizontal"', '"vertical"', "orientation"),
        row("actionsRef", "RefObject<{ close, unmount }>", "", "actionsRef"),
        row("handle", "MenuHandle", "", "handle"),
        row("triggerId", "string | null", "", "triggerId"),
        row("defaultTriggerId", "string | null", "", "defaultTriggerId"),
        children,
      ],
    },
    {
      part: "DropdownMenuTrigger",
      rows: [
        row("render", "ReactElement", "", "render"),
        row("disabled", "boolean", "false", "triggerDisabled"),
        row("openOnHover", "boolean", "false", "openOnHover"),
        row("delay", "number", "100", "delay"),
        row("closeDelay", "number", "0", "closeDelay"),
        row("handle", "MenuHandle", "", "triggerHandle"),
        row("payload", "unknown", "", "payload"),
        children,
        className,
      ],
    },
    {
      part: "DropdownMenuContent",
      rows: [
        row("side", '"bottom" | "top" | "left" | "right" | "inline-start" | "inline-end"', '"bottom"', "side"),
        row("align", '"start" | "center" | "end"', '"start"', "align"),
        row("sideOffset", "number", "4", "sideOffset"),
        row("alignOffset", "number", "0", "alignOffset"),
        row("collisionAvoidance", "{ side, align, fallbackAxisSide }", "", "collisionAvoidance"),
        row("container", "HTMLElement", "", "container"),
        row("finalFocus", "boolean | RefObject | (closeType) => …", "", "finalFocus"),
        children,
        row("className", "string", "", "contentClassName"),
      ],
    },
    { part: "DropdownMenuGroup", rows: [children, className] },
    {
      part: "DropdownMenuLabel",
      rows: [row("inset", "boolean", "false", "inset"), children, className],
    },
    {
      part: "DropdownMenuItem",
      rows: [
        row("variant", '"default" | "destructive"', '"default"', "variant"),
        row("icon", "ReactNode", "", "icon"),
        row("inset", "boolean", "false", "inset"),
        row("disabled", "boolean", "false", "itemDisabled"),
        row("onClick", "(event) => void", "", "onClick"),
        row("closeOnClick", "boolean", "true", "closeOnClick"),
        row("label", "string", "", "label"),
        children,
        className,
      ],
    },
    {
      part: "DropdownMenuCheckboxItem",
      rows: [
        row("indicator", '"check" | "switch"', '"check"', "indicator"),
        row("checked", "boolean", "", "checked"),
        row("defaultChecked", "boolean", "false", "defaultChecked"),
        row("onCheckedChange", "(checked, eventDetails) => void", "", "onCheckedChange"),
        row("disabled", "boolean", "false", "itemDisabled"),
        row("closeOnClick", "boolean", "false", "closeOnClickChoice"),
        row("label", "string", "", "label"),
        children,
        className,
      ],
    },
    {
      part: "DropdownMenuRadioGroup",
      rows: [
        row("value", "unknown", "", "value"),
        row("defaultValue", "unknown", "", "defaultValue"),
        row("onValueChange", "(value, eventDetails) => void", "", "onValueChange"),
        row("disabled", "boolean", "false", "groupDisabled"),
        children,
        className,
      ],
    },
    {
      part: "DropdownMenuRadioItem",
      rows: [
        row("value", "unknown", "", "radioValue"),
        row("disabled", "boolean", "false", "itemDisabled"),
        row("closeOnClick", "boolean", "false", "closeOnClickChoice"),
        row("label", "string", "", "label"),
        children,
        className,
      ],
    },
    { part: "DropdownMenuSeparator", rows: [className] },
    { part: "DropdownMenuShortcut", rows: [row("children", "ReactNode", "", "shortcutChildren"), className] },
    {
      part: "DropdownMenuSub",
      rows: [
        row("open", "boolean", "", "subOpen"),
        row("defaultOpen", "boolean", "false", "subDefaultOpen"),
        row("onOpenChange", "(open, eventDetails) => void", "", "subOnOpenChange"),
        row("disabled", "boolean", "false", "subDisabled"),
        row("closeParentOnEsc", "boolean", "false", "closeParentOnEsc"),
        children,
      ],
    },
    {
      part: "DropdownMenuSubTrigger",
      rows: [
        row("icon", "ReactNode", "", "icon"),
        row("inset", "boolean", "false", "inset"),
        row("disabled", "boolean", "false", "itemDisabled"),
        row("openOnHover", "boolean", "true", "subOpenOnHover"),
        row("delay", "number", "100", "delay"),
        row("closeDelay", "number", "0", "closeDelay"),
        row("label", "string", "", "label"),
        children,
        className,
      ],
    },
    {
      part: "DropdownMenuSubContent",
      rows: [
        row("sideOffset", "number", "0", "subSideOffset"),
        row("alignOffset", "number", "-5", "subAlignOffset"),
        row("collisionAvoidance", "{ side, align, fallbackAxisSide }", "", "collisionAvoidance"),
        row("container", "HTMLElement", "", "subContainer"),
        children,
        row("className", "string", "", "contentClassName"),
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/dropdown-menu/" /></h1>
        <p className="text-xl text-muted-foreground">{d("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="dropdown-menu" />
        <p className="text-muted-foreground">{d.rich("installNote", rich)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview className="py-12">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>{d("sample.open")}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{d("sample.myAccount")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {d("sample.profile")}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                {d("sample.billing")}
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>{d("sample.inviteUsers")}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>{d("sample.email")}</DropdownMenuItem>
                  <DropdownMenuItem>{d("sample.message")}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>{d("sample.support")}</DropdownMenuItem>
              <DropdownMenuItem disabled>{d("sample.api")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">{d("sample.signOut")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{d("previewHint")}</p>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{d.rich("variantsBody", rich)}</p>
        <HeldPreview>
          <div className={GRID}>
            <HeldMenu trigger={d("sample.open")}>
              <DropdownMenuItem icon={<PencilLine strokeWidth={1.5} />}>{d("sample.edit")}</DropdownMenuItem>
              <DropdownMenuItem icon={<Share strokeWidth={1.5} />}>{d("sample.share")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" icon={<Trash2 strokeWidth={1.5} />}>
                {d("sample.delete")}
              </DropdownMenuItem>
            </HeldMenu>
            <HeldMenu trigger={d("sample.open")}>
              <DropdownMenuItem>{d("sample.edit")}</DropdownMenuItem>
              <DropdownMenuItem>{d("sample.share")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">{d("sample.delete")}</DropdownMenuItem>
            </HeldMenu>
          </div>
        </HeldPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{d.rich("statesBody", rich)}</p>
        <HeldPreview>
          <HeldMenu trigger={d("sample.open")}>
            <DropdownMenuItem>{d("sample.profile")}</DropdownMenuItem>
            <DropdownMenuItem>{d("sample.billing")}</DropdownMenuItem>
            <DropdownMenuItem disabled>{d("sample.api")}</DropdownMenuItem>
          </HeldMenu>
        </HeldPreview>
      </section>

      {/* Labels, groups and icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("labels.title")}</h2>
        <p className="text-muted-foreground">{d.rich("labels.body", rich)}</p>
        <HeldPreview>
          <div className={GRID}>
            <HeldMenu trigger={d("sample.open")}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{d("sample.userProfile")}</DropdownMenuLabel>
                <DropdownMenuItem icon={<User strokeWidth={1.5} />}>{d("sample.profile")}</DropdownMenuItem>
                <DropdownMenuItem icon={<Settings strokeWidth={1.5} />}>{d("sample.settings")}</DropdownMenuItem>
              </DropdownMenuGroup>
            </HeldMenu>
            <HeldMenu trigger={d("sample.open")}>
              <DropdownMenuLabel className="py-1.5 font-normal">
                {/* Decorative: the name is printed beside it, so the image has an empty alt. */}
                <Avatar src={PHOTO} name="" size="32" radius="rounded" />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-semibold">{d("sample.name")}</span>
                  <span className="truncate text-xs text-muted-foreground">layla@example.com</span>
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{d("sample.profile")}</DropdownMenuItem>
              <DropdownMenuItem>{d("sample.billing")}</DropdownMenuItem>
            </HeldMenu>
          </div>
        </HeldPreview>
      </section>

      {/* Checkbox items */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("checkbox.title")}</h2>
        <p className="text-muted-foreground">{d.rich("checkbox.body", rich)}</p>
        <HeldPreview>
          <div className={GRID}>
            <HeldMenu trigger={d("sample.view")}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{d("sample.show")}</DropdownMenuLabel>
                <DropdownMenuCheckboxItem defaultChecked>{d("sample.statusBar")}</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>{d("sample.activityBar")}</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem disabled>{d("sample.panel")}</DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </HeldMenu>
            <HeldMenu trigger={d("sample.notifications")}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{d("sample.notifyBy")}</DropdownMenuLabel>
                <DropdownMenuCheckboxItem indicator="switch" defaultChecked>
                  {d("sample.email")}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem indicator="switch">{d("sample.sms")}</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem indicator="switch" defaultChecked>
                  {d("sample.push")}
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </HeldMenu>
          </div>
        </HeldPreview>
      </section>

      {/* Radio group */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("radio.title")}</h2>
        <p className="text-muted-foreground">{d.rich("radio.body", rich)}</p>
        <HeldPreview>
          <HeldMenu trigger={d("sample.panelPosition")}>
            <DropdownMenuRadioGroup defaultValue="top">
              <DropdownMenuLabel>{d("sample.panelPosition")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="top">{d("sample.top")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">{d("sample.bottom")}</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="end">{d("sample.end")}</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </HeldMenu>
        </HeldPreview>
      </section>

      {/* Submenus and shortcuts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("sub.title")}</h2>
        <p className="text-muted-foreground">{d.rich("sub.body", rich)}</p>
        <HeldPreview>
          <HeldMenu trigger={d("sample.open")}>
            <DropdownMenuItem>
              {d("sample.newTab")}
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {d("sample.newWindow")}
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{d("sample.share")}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>{d("sample.email")}</DropdownMenuItem>
                <DropdownMenuItem>{d("sample.message")}</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </HeldMenu>
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{d.rich("a11y.roles", rich)}</li>
          <li>{d.rich("a11y.keyboard", rich)}</li>
          <li>{d.rich("a11y.labels", rich)}</li>
          <li>{d.rich("a11y.switch", rich)}</li>
          <li>{d.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={d("usage.basic")}>{`import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>${d("sample.open")}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>${d("sample.myAccount")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          ${d("sample.profile")}
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>${d("sample.billing")}</DropdownMenuItem>
        <DropdownMenuItem disabled>${d("sample.api")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">${d("sample.signOut")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.icons")}>{`import { PencilLine, Share, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FileActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>${d("sample.open")}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon={<PencilLine strokeWidth={1.5} />}>${d("sample.edit")}</DropdownMenuItem>
        <DropdownMenuItem icon={<Share strokeWidth={1.5} />}>${d("sample.share")}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" icon={<Trash2 strokeWidth={1.5} />}>
          ${d("sample.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.checkbox")}>{`"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsMenu() {
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>${d("sample.notifications")}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>${d("sample.notifyBy")}</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={email} onCheckedChange={setEmail}>
            ${d("sample.email")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem indicator="switch" checked={sms} onCheckedChange={setSms}>
            ${d("sample.sms")}
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.radio")}>{`"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PanelPositionMenu() {
  const [position, setPosition] = useState("top")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>${d("sample.panelPosition")}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuLabel>${d("sample.panelPosition")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="top">${d("sample.top")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">${d("sample.bottom")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="end">${d("sample.end")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.sub")}>{`import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ShareMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>${d("sample.open")}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>${d("sample.newTab")}</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>${d("sample.share")}</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>${d("sample.email")}</DropdownMenuItem>
            <DropdownMenuItem>${d("sample.message")}</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
