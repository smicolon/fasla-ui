"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Dialog } from "@base-ui/react/dialog"

import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetContentProps,
  type SheetSide,
} from "@fasla-ui/ui/sheet"
import { Button } from "@fasla-ui/ui/button"
import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/**
 * A sheet held open inside its own box, so it can sit in the page beside its
 * explanation. The box is a containing block for the sheet's fixed position
 * (its `transform` makes it one), so the overlay fills the box and the sheet
 * slides from the box's edge as it would from the window's: Start and End
 * take its full height, Top and Bottom its full width.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * the page without trapping focus, locking scroll or taking focus on load.
 * The Preview above opens the real one.
 */
function Held({ children, className, box = "h-[32rem]", ...content }: SheetContentProps & { box?: string }) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  return (
    <div
      ref={setCell}
      className={["relative w-full overflow-hidden rounded-md border [transform:translateZ(0)]", box].join(" ")}
    >
      {cell && (
        <Dialog.Root open modal={false} disablePointerDismissal>
          <SheetContent container={cell} initialFocus={false} finalFocus={false} className={className} {...content}>
            {children}
          </SheetContent>
        </Dialog.Root>
      )}
    </div>
  )
}

/** A preview of held sheets, stacked one per row: two side by side would not fit its width. */
function HeldPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <ComponentPreview>
        <div className="grid w-full gap-4">{children}</div>
      </ComponentPreview>
    </div>
  )
}

const SIDES = ["end", "start", "top", "bottom"] as const satisfies readonly SheetSide[]

export default function SheetPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.sheet")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  /** The header, the content area, then the footer with the main action first: Figma's order. */
  const body = (options: { title?: string; description?: string; more?: boolean } = {}) => (
    <>
      <SheetHeader>
        <SheetTitle>{options.title ?? s("title")}</SheetTitle>
        <SheetDescription>{options.description ?? s("description")}</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-4">
        <Input label={s("name")} defaultValue={s("nameValue")} />
        <Input label={s("username")} defaultValue={s("usernameValue")} />
        {options.more && (
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">{s("content.about")}</h3>
            <p>{s("content.aboutText")}</p>
            <p>{s("content.aboutText")}</p>
          </div>
        )}
      </div>
      <SheetFooter>
        <Button>{s("save")}</Button>
        <SheetClose render={<Button variant="outline" tone="primary" />}>{s("cancel")}</SheetClose>
      </SheetFooter>
    </>
  )

  const parts: { part: string; rows: PropRow[] }[] = [
    {
      part: "Sheet",
      rows: [
        { prop: "open", type: "boolean", fallback: "", description: s.rich("rootProps.open", rich) },
        { prop: "defaultOpen", type: "boolean", fallback: "false", description: s.rich("rootProps.defaultOpen", rich) },
        { prop: "onOpenChange", type: "(open, details) => void", fallback: "", description: s.rich("rootProps.onOpenChange", rich) },
        { prop: "modal", type: 'boolean | "trap-focus"', fallback: "true", description: s.rich("rootProps.modal", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("rootProps.children", rich) },
      ],
    },
    {
      part: "SheetTrigger",
      rows: [
        { prop: "render", type: "ReactElement", fallback: "", description: s.rich("triggerProps.render", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("triggerProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("triggerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("triggerProps.className", rich) },
      ],
    },
    {
      part: "SheetContent",
      rows: [
        {
          prop: "side",
          type: '"top" | "bottom" | "start" | "end"',
          fallback: '"end"',
          description: s.rich("contentProps.side", rich),
        },
        { prop: "showCloseButton", type: "boolean", fallback: "true", description: s.rich("contentProps.showCloseButton", rich) },
        { prop: "closeLabel", type: "string", fallback: '"Close"', description: s.rich("contentProps.closeLabel", rich) },
        { prop: "container", type: "HTMLElement", fallback: "", description: s.rich("contentProps.container", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("contentProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("contentProps.className", rich) },
      ],
    },
    {
      part: "SheetHeader",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("headerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("headerProps.className", rich) },
      ],
    },
    {
      part: "SheetTitle",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("titleProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("titleProps.className", rich) },
      ],
    },
    {
      part: "SheetDescription",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("descriptionProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("descriptionProps.className", rich) },
      ],
    },
    {
      part: "SheetFooter",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("footerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("footerProps.className", rich) },
      ],
    },
    {
      part: "SheetClose",
      rows: [
        { prop: "render", type: "ReactElement", fallback: "", description: s.rich("closeProps.render", rich) },
        { prop: "onClick", type: "(event) => void", fallback: "", description: s.rich("closeProps.onClick", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: s.rich("closeProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("closeProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("closeProps.className", rich) },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/sheet/" /></h1>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="sheet" />
        <p className="text-muted-foreground">{s.rich("installNote", rich)}</p>
      </section>

      {/* Preview: the real sheet, from each side */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-wrap justify-center gap-2">
            {SIDES.map((side) => (
              <Sheet key={side}>
                <SheetTrigger render={<Button variant="outline" />}>{s(`sides.${side}`)}</SheetTrigger>
                <SheetContent side={side}>{body()}</SheetContent>
              </Sheet>
            ))}
          </div>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{s("previewHint")}</p>
      </section>

      {/* Side */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("side.title")}</h2>
        <p className="text-muted-foreground">{s.rich("side.body", rich)}</p>
        <HeldPreview>
          {SIDES.map((side) => (
            <Held key={side} side={side}>
              {body()}
            </Held>
          ))}
        </HeldPreview>
      </section>

      {/* Content and footer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("content.title")}</h2>
        <p className="text-muted-foreground">{s.rich("content.body", rich)}</p>
        <HeldPreview>
          <Held>{body({ more: true })}</Held>
        </HeldPreview>
      </section>

      {/* Close button */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("close.title")}</h2>
        <p className="text-muted-foreground">{s.rich("close.body", rich)}</p>
        <HeldPreview>
          <Held side="bottom">{body()}</Held>
        </HeldPreview>
      </section>

      {/* Long title */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("long.title")}</h2>
        <p className="text-muted-foreground">{s.rich("long.body", rich)}</p>
        <HeldPreview>
          <Held box="h-[36rem]">{body({ title: s("long.sheetTitle"), description: s("long.description") })}</Held>
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.role", rich)}</li>
          <li>{s.rich("a11y.focus", rich)}</li>
          <li>{s.rich("a11y.dismiss", rich)}</li>
          <li>{s.rich("a11y.close", rich)}</li>
          <li>{s.rich("a11y.page", rich)}</li>
          <li>{s.rich("a11y.motion", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        {parts.map(({ part, rows }) => (
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
        <UsageExample title={s("usage.basic")}>{`import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditProfile() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>${s("trigger")}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>${s("title")}</SheetTitle>
          <SheetDescription>${s("description")}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-4">
          <Input label="${s("name")}" defaultValue="${s("nameValue")}" />
          <Input label="${s("username")}" defaultValue="${s("usernameValue")}" />
        </div>
        <SheetFooter>
          <Button type="submit">${s("save")}</Button>
          <SheetClose render={<Button variant="outline" tone="primary" />}>${s("cancel")}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.start")}>{`import { MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function NavigationMenu() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon-md" aria-label="${s("usage.menu")}" />}>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="start">
        <SheetHeader>
          <SheetTitle>${s("usage.menuTitle")}</SheetTitle>
          <SheetDescription>${s("usage.menuDescription")}</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-1 px-4">
          <a href="/">${s("usage.links.home")}</a>
          <a href="/projects">${s("usage.links.projects")}</a>
          <a href="/settings">${s("usage.links.settings")}</a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import * as React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditProfileAndSave({ onSave }: { onSave: (name: string) => Promise<void> }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("${s("nameValue")}")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" />}>${s("trigger")}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>${s("title")}</SheetTitle>
          <SheetDescription>${s("description")}</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Input label="${s("name")}" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <SheetFooter>
          <Button
            onClick={async () => {
              await onSave(name)
              setOpen(false)
            }}
          >
            ${s("save")}
          </Button>
          <SheetClose render={<Button variant="outline" tone="primary" />}>${s("cancel")}</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
