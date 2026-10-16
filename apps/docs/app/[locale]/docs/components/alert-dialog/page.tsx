"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { Dialog } from "@base-ui/react/dialog"
import { LogOutIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
} from "@fasla-ui/ui/alert-dialog"
import { Button } from "@fasla-ui/ui/button"
import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/** The gap a held dialog keeps from its box on every side: `inset-x-4`, so 16px. */
const GUTTER = 16

/**
 * An alert dialog held open inside its own box, so it can sit in the page
 * beside its explanation. The box is a containing block for the dialog's
 * fixed position (its `transform` makes it one), so the overlay fills the box
 * and the dialog sits 16px inside it. The box is the dialog's own height plus
 * that gutter, measured, so the Arabic text gets exactly the room it takes.
 *
 * It is never a scroll container, so scrolling over it scrolls the page.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * the page without trapping focus, locking scroll or taking focus on load.
 * The parts are the same ones Alert Dialog uses; only the role differs. The
 * Preview above opens the real one.
 */
function Held({ children, className, ...content }: AlertDialogContentProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + GUTTER * 2
      setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const popup = cell.querySelector("[data-slot=alert-dialog-content]")
      if (popup && popup !== observed) {
        if (observed) resize.unobserve(observed)
        observed = popup
        resize.observe(popup)
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

  return (
    <div
      ref={setCell}
      className="relative w-full overflow-hidden rounded-md [transform:translateZ(0)]"
      style={{ minHeight: height }}
    >
      {cell && (
        <Dialog.Root open modal={false} disablePointerDismissal>
          <AlertDialogContent
            container={cell}
            initialFocus={false}
            finalFocus={false}
            // Pinned to the top of its box, and never a scroll container: the
            // real dialog caps its height and scrolls inside, which here would
            // catch the wheel and stop the page scrolling past the preview.
            className={["top-4 translate-y-0 max-h-none overflow-visible overscroll-auto", className]
              .filter(Boolean)
              .join(" ")}
            {...content}
          >
            {children}
          </AlertDialogContent>
        </Dialog.Root>
      )}
    </div>
  )
}

/** A preview of held dialogs, stacked one per row: two side by side would not fit its width. */
function HeldPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate">
      <ComponentPreview>
        <div className="grid w-full gap-4">{children}</div>
      </ComponentPreview>
    </div>
  )
}

export default function AlertDialogPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.alertDialog")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  /** The text, the optional slot, then the actions: Figma's order. */
  const body = (tone: "safe" | "danger", options: { field?: boolean; loading?: boolean } = {}) => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{a(`${tone}.title`)}</AlertDialogTitle>
        <AlertDialogDescription>{a(`${tone}.description`)}</AlertDialogDescription>
      </AlertDialogHeader>
      {options.field && <Input label={a("content.label")} placeholder={a("content.placeholder")} />}
      <AlertDialogFooter>
        <AlertDialogCancel disabled={options.loading}>{a("cancel")}</AlertDialogCancel>
        <AlertDialogAction loading={options.loading} loadingLabel={a("pending.label")}>
          {options.loading ? a("pending.action") : a(`${tone}.action`)}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  )

  const parts: { part: string; rows: PropRow[] }[] = [
    {
      part: "AlertDialog",
      rows: [
        { prop: "open", type: "boolean", fallback: "", description: a.rich("rootProps.open", rich) },
        { prop: "defaultOpen", type: "boolean", fallback: "false", description: a.rich("rootProps.defaultOpen", rich) },
        { prop: "onOpenChange", type: "(open, details) => void", fallback: "", description: a.rich("rootProps.onOpenChange", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("rootProps.children", rich) },
      ],
    },
    {
      part: "AlertDialogTrigger",
      rows: [
        { prop: "render", type: "ReactElement", fallback: "", description: a.rich("triggerProps.render", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: a.rich("triggerProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("triggerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("triggerProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogContent",
      rows: [
        { prop: "align", type: '"edge" | "center"', fallback: '"edge"', description: a.rich("contentProps.align", rich) },
        { prop: "destructive", type: "boolean", fallback: "false", description: a.rich("contentProps.destructive", rich) },
        { prop: "icon", type: "boolean | ReactNode", fallback: "false", description: a.rich("contentProps.icon", rich) },
        { prop: "container", type: "HTMLElement", fallback: "", description: a.rich("contentProps.container", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("contentProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("contentProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogHeader",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("headerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("headerProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogTitle",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("titleProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("titleProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogDescription",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("descriptionProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("descriptionProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogFooter",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("footerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("footerProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogCancel",
      rows: [
        { prop: "onClick", type: "(event) => void", fallback: "", description: a.rich("cancelProps.onClick", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: a.rich("cancelProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("cancelProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("cancelProps.className", rich) },
      ],
    },
    {
      part: "AlertDialogAction",
      rows: [
        { prop: "onClick", type: "(event) => void", fallback: "", description: a.rich("actionProps.onClick", rich) },
        { prop: "loading", type: "boolean", fallback: "false", description: a.rich("actionProps.loading", rich) },
        { prop: "loadingLabel", type: "string", fallback: '"Loading"', description: a.rich("actionProps.loadingLabel", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: a.rich("actionProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: a.rich("actionProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: a.rich("actionProps.className", rich) },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/alert-dialog/" /></h1>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="alert-dialog" />
        <p className="text-muted-foreground">{a.rich("installNote", rich)}</p>
      </section>

      {/* Preview: the real modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" tone="destructive" />}>{a("trigger")}</AlertDialogTrigger>
            <AlertDialogContent destructive>{body("danger")}</AlertDialogContent>
          </AlertDialog>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{a("previewHint")}</p>
      </section>

      {/* Alignment */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("align.title")}</h2>
        <p className="text-muted-foreground">{a.rich("align.body", rich)}</p>
        <HeldPreview>
          <Held>{body("safe")}</Held>
          <Held align="center">{body("safe")}</Held>
        </HeldPreview>
      </section>

      {/* Destructive */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("destructive.title")}</h2>
        <p className="text-muted-foreground">{a.rich("destructive.body", rich)}</p>
        <HeldPreview>
          <Held destructive>{body("danger")}</Held>
        </HeldPreview>
      </section>

      {/* Icon */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("icon.title")}</h2>
        <p className="text-muted-foreground">{a.rich("icon.body", rich)}</p>
        <HeldPreview>
          <Held destructive icon>
            {body("danger")}
          </Held>
          <Held align="center" destructive icon>
            {body("danger")}
          </Held>
          {/* Your own icon: the same 24px cell, in the title's colour. Its
              arrow points out of the door, so it mirrors on an Arabic page. */}
          <Held icon={<LogOutIcon strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />}>
            <AlertDialogHeader>
              <AlertDialogTitle>{a("icon.custom.title")}</AlertDialogTitle>
              <AlertDialogDescription>{a("icon.custom.description")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{a("cancel")}</AlertDialogCancel>
              <AlertDialogAction>{a("icon.custom.action")}</AlertDialogAction>
            </AlertDialogFooter>
          </Held>
        </HeldPreview>
      </section>

      {/* Additional content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("content.title")}</h2>
        <p className="text-muted-foreground">{a.rich("content.body", rich)}</p>
        <HeldPreview>
          <Held destructive icon>
            {body("danger", { field: true })}
          </Held>
        </HeldPreview>
      </section>

      {/* Waiting for the action */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("pending.title")}</h2>
        <p className="text-muted-foreground">{a.rich("pending.body", rich)}</p>
        <HeldPreview>
          <Held destructive>{body("danger", { loading: true })}</Held>
        </HeldPreview>
      </section>

      {/* Long text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("long.title")}</h2>
        <p className="text-muted-foreground">{a.rich("long.body", rich)}</p>
        <HeldPreview>
          <Held destructive icon>
            <AlertDialogHeader>
              <AlertDialogTitle>{a("long.dialogTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{a("long.description")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{a("long.cancel")}</AlertDialogCancel>
              <AlertDialogAction>{a("long.action")}</AlertDialogAction>
            </AlertDialogFooter>
          </Held>
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{a.rich("a11y.role", rich)}</li>
          <li>{a.rich("a11y.icon", rich)}</li>
          <li>{a.rich("a11y.focus", rich)}</li>
          <li>{a.rich("a11y.dismiss", rich)}</li>
          <li>{a.rich("a11y.page", rich)}</li>
          <li>{a.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={a("usage.basic")}>{`import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteProject({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" tone="destructive" />}>
        ${a("trigger")}
      </AlertDialogTrigger>
      <AlertDialogContent destructive>
        <AlertDialogHeader>
          <AlertDialogTitle>${a("danger.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            ${a("danger.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>${a("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>${a("danger.action")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.content")}>{`"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DeleteProjectByName({ onDelete }: { onDelete: () => void }) {
  const [name, setName] = React.useState("")
  return (
    <AlertDialog onOpenChange={(open) => open && setName("")}>
      <AlertDialogTrigger render={<Button variant="outline" tone="destructive" />}>
        ${a("trigger")}
      </AlertDialogTrigger>
      <AlertDialogContent destructive icon>
        <AlertDialogHeader>
          <AlertDialogTitle>${a("danger.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            ${a("danger.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          label="${a("content.label")}"
          placeholder="${a("usage.project")}"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>${a("cancel")}</AlertDialogCancel>
          <AlertDialogAction disabled={name !== "${a("usage.project")}"} onClick={onDelete}>
            ${a("danger.action")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.custom")}>{`import { LogOutIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function SignOutEverywhere({ onSignOut }: { onSignOut: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>${a("icon.custom.action")}</AlertDialogTrigger>
      <AlertDialogContent icon={<LogOutIcon strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />}>
        <AlertDialogHeader>
          <AlertDialogTitle>${a("icon.custom.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            ${a("icon.custom.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>${a("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onSignOut}>${a("icon.custom.action")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.pending")}>{`"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteProjectAndWait({ onDelete }: { onDelete: () => Promise<void> }) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger render={<Button variant="outline" tone="destructive" />}>
        ${a("trigger")}
      </AlertDialogTrigger>
      <AlertDialogContent destructive>
        <AlertDialogHeader>
          <AlertDialogTitle>${a("danger.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            ${a("danger.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>${a("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            loading={pending}
            loadingLabel="${a("pending.label")}"
            onClick={async (event) => {
              event.preventBaseUIHandler()
              setPending(true)
              try {
                await onDelete()
                setOpen(false)
              } finally {
                setPending(false)
              }
            }}
          >
            ${a("danger.action")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
