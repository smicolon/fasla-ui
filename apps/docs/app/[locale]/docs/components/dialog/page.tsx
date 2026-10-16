"use client"

import * as React from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Dialog as DialogRoot } from "@base-ui/react/dialog"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
  type DialogSize,
} from "@fasla-ui/ui/dialog"
import { Button } from "@fasla-ui/ui/button"
import { Checkbox } from "@fasla-ui/ui/checkbox"
import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/** The gap a held dialog keeps from its box on every side: `inset-x-4`, so 16px. */
const GUTTER = 16

type HeldProps = DialogContentProps & {
  /**
   * Keep the real height cap and scrolling, measured against the box instead
   * of the window. The box then needs a height of its own (`box`).
   */
  scrolls?: boolean
  /** Classes for the box, such as a fixed height. */
  box?: string
}

/**
 * A dialog held open inside its own box, so it can sit in the page beside
 * its explanation. The box is a containing block for the dialog's fixed
 * position (its `transform` makes it one), so the overlay fills the box and
 * the dialog sits 16px inside it. The box is the dialog's own height plus
 * that gutter, measured, so the Arabic text gets exactly the room it takes.
 *
 * It is never a scroll container, so scrolling over it scrolls the page —
 * unless `scrolls`, which keeps the dialog's own scrolling inside a box of a
 * set height.
 *
 * Held with Base UI's plain Dialog root, not modal, so several stay open on
 * the page without trapping focus, locking scroll or taking focus on load.
 * The Preview above opens the real one.
 */
function Held({ children, className, scrolls = false, box, ...content }: HeldProps) {
  const [cell, setCell] = React.useState<HTMLDivElement | null>(null)
  const [height, setHeight] = React.useState(0)

  React.useLayoutEffect(() => {
    if (!cell || scrolls) return
    let observed: Element | null = null
    const resize = new ResizeObserver(([entry]) => {
      const next = Math.ceil(entry!.borderBoxSize[0]!.blockSize) + GUTTER * 2
      setHeight((prev) => (Math.abs(prev - next) > 1 ? next : prev))
    })
    const find = () => {
      const popup = cell.querySelector("[data-slot=dialog-content]")
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
  }, [cell, scrolls])

  return (
    <div
      ref={setCell}
      className={["relative w-full overflow-hidden rounded-md [transform:translateZ(0)]", box].filter(Boolean).join(" ")}
      style={scrolls ? undefined : { minHeight: height }}
    >
      {cell && (
        <DialogRoot.Root open modal={false} disablePointerDismissal>
          <DialogContent
            container={cell}
            initialFocus={false}
            finalFocus={false}
            // Pinned to the top of its box. Never a scroll container, unless
            // `scrolls`: the real dialog caps its height and scrolls inside,
            // which here would catch the wheel and stop the page scrolling
            // past the preview.
            className={[
              "top-4 translate-y-0",
              scrolls ? "max-h-[calc(100%-2rem)]" : "max-h-none [&_[data-slot=dialog-scroll]]:overflow-visible",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...content}
          >
            {children}
          </DialogContent>
        </DialogRoot.Root>
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

const SIZES: DialogSize[] = ["lg", "xl", "2xl"]

export default function DialogPage() {
  const locale = useLocale()
  const t = useTranslations("docs.sections")
  const d = useTranslations("docs.dialog")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  /** The profile form: Figma's Edit profile example. */
  const profile = (
    <>
      <DialogHeader>
        <DialogTitle>{d("profile.title")}</DialogTitle>
        <DialogDescription>{d("profile.description")}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        <Input label={d("profile.email")} type="email" placeholder={d("profile.placeholder")} />
        <Input label={d("profile.password")} type="password" placeholder={d("profile.placeholder")} />
        <Checkbox label={d("profile.agree")} />
      </div>
      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>{d("cancel")}</DialogClose>
        <Button>{d("profile.action")}</Button>
      </DialogFooter>
    </>
  )

  const parts: { part: string; rows: PropRow[] }[] = [
    {
      part: "Dialog",
      rows: [
        { prop: "open", type: "boolean", fallback: "", description: d.rich("rootProps.open", rich) },
        { prop: "defaultOpen", type: "boolean", fallback: "false", description: d.rich("rootProps.defaultOpen", rich) },
        { prop: "onOpenChange", type: "(open, details) => void", fallback: "", description: d.rich("rootProps.onOpenChange", rich) },
        { prop: "modal", type: 'boolean | "trap-focus"', fallback: "true", description: d.rich("rootProps.modal", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("rootProps.children", rich) },
      ],
    },
    {
      part: "DialogTrigger",
      rows: [
        { prop: "render", type: "ReactElement", fallback: "", description: d.rich("triggerProps.render", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: d.rich("triggerProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("triggerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("triggerProps.className", rich) },
      ],
    },
    {
      part: "DialogContent",
      rows: [
        { prop: "size", type: '"lg" | "xl" | "2xl"', fallback: '"lg"', description: d.rich("contentProps.size", rich) },
        { prop: "showCloseButton", type: "boolean", fallback: "true", description: d.rich("contentProps.showCloseButton", rich) },
        { prop: "closeLabel", type: "string", fallback: '"Close"', description: d.rich("contentProps.closeLabel", rich) },
        { prop: "container", type: "HTMLElement", fallback: "", description: d.rich("contentProps.container", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("contentProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("contentProps.className", rich) },
      ],
    },
    {
      part: "DialogHeader",
      rows: [
        { prop: "onBack", type: "(event) => void", fallback: "", description: d.rich("headerProps.onBack", rich) },
        { prop: "backLabel", type: "string", fallback: '"Back"', description: d.rich("headerProps.backLabel", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("headerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("headerProps.className", rich) },
      ],
    },
    {
      part: "DialogTitle",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("titleProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("titleProps.className", rich) },
      ],
    },
    {
      part: "DialogDescription",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("descriptionProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("descriptionProps.className", rich) },
      ],
    },
    {
      part: "DialogFooter",
      rows: [
        { prop: "layout", type: '"horizontal" | "stacked"', fallback: '"horizontal"', description: d.rich("footerProps.layout", rich) },
        { prop: "showCloseButton", type: "boolean", fallback: "false", description: d.rich("footerProps.showCloseButton", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("footerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("footerProps.className", rich) },
      ],
    },
    {
      part: "DialogClose",
      rows: [
        { prop: "render", type: "ReactElement", fallback: "", description: d.rich("closeProps.render", rich) },
        { prop: "onClick", type: "(event) => void", fallback: "", description: d.rich("closeProps.onClick", rich) },
        { prop: "disabled", type: "boolean", fallback: "false", description: d.rich("closeProps.disabled", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: d.rich("closeProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: d.rich("closeProps.className", rich) },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/dialog/" /></h1>
        <p className="text-muted-foreground">
          {d.rich("whenToUse", {
            ...rich,
            link: (chunks) => (
              <Link
                href={`/${locale}/docs/components/alert-dialog/`}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="dialog" />
        <p className="text-muted-foreground">{d.rich("installNote", rich)}</p>
      </section>

      {/* Preview: the real modal */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>{d("trigger")}</DialogTrigger>
            <DialogContent>{profile}</DialogContent>
          </Dialog>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{d("previewHint")}</p>
      </section>

      {/* Sizes: real modals, since a held 2xl would not fit the preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{d.rich("size.body", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap justify-center gap-2">
            {SIZES.map((size) => (
              <Dialog key={size}>
                <DialogTrigger render={<Button variant="outline" />}>{d("size.open", { size })}</DialogTrigger>
                <DialogContent size={size}>{profile}</DialogContent>
              </Dialog>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Header */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("header.title")}</h2>
        <p className="text-muted-foreground">{d.rich("header.body", rich)}</p>
        <HeldPreview>
          <Held>
            <DialogHeader>
              <DialogTitle>{d("profile.title")}</DialogTitle>
              <DialogDescription>{d("profile.description")}</DialogDescription>
            </DialogHeader>
            <Input label={d("profile.email")} type="email" placeholder={d("profile.placeholder")} />
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>{d("cancel")}</DialogClose>
              <Button>{d("profile.action")}</Button>
            </DialogFooter>
          </Held>
          <Held>
            <DialogHeader onBack={() => {}}>
              <DialogTitle>{d("header.step.title")}</DialogTitle>
              <DialogDescription>{d("header.step.description")}</DialogDescription>
            </DialogHeader>
            <Input label={d("header.workspace")} placeholder={d("header.workspacePlaceholder")} />
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>{d("cancel")}</DialogClose>
              <Button>{d("header.next")}</Button>
            </DialogFooter>
          </Held>
        </HeldPreview>
      </section>

      {/* Actions */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("footer.title")}</h2>
        <p className="text-muted-foreground">{d.rich("footer.body", rich)}</p>
        <HeldPreview>
          <Held showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>{d("footer.tour.title")}</DialogTitle>
              <DialogDescription>{d("footer.tour.description")}</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{d("footer.tour.body")}</p>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>{d("footer.tour.skip")}</DialogClose>
              <Button variant="outline">
                <ArrowLeftIcon aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
                {d("footer.tour.previous")}
              </Button>
              <Button>
                {d("footer.tour.next")}
                <ArrowRightIcon aria-hidden="true" strokeWidth={1.5} className="[&:dir(rtl)]:-scale-x-100" />
              </Button>
            </DialogFooter>
          </Held>
          <Held>
            <DialogHeader>
              <DialogTitle>{d("footer.danger.title")}</DialogTitle>
              <DialogDescription>{d("footer.danger.description")}</DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{d("footer.danger.body")}</p>
            <DialogFooter layout="stacked">
              <Button variant="destructive">{d("footer.danger.action")}</Button>
              <DialogClose render={<Button variant="outline" />}>{d("cancel")}</DialogClose>
            </DialogFooter>
          </Held>
        </HeldPreview>
      </section>

      {/* Long content */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("long.title")}</h2>
        <p className="text-muted-foreground">{d.rich("long.body", rich)}</p>
        <HeldPreview>
          <Held scrolls box="h-[26rem]">
            <DialogHeader>
              <DialogTitle>{d("long.dialogTitle")}</DialogTitle>
              <DialogDescription>{d("long.description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              {(["p1", "p2", "p3", "p4", "p5"] as const).map((key) => (
                <p key={key}>{d(`long.paragraphs.${key}`)}</p>
              ))}
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>{d("long.decline")}</DialogClose>
              <Button>{d("long.accept")}</Button>
            </DialogFooter>
          </Held>
        </HeldPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{d.rich("a11y.role", rich)}</li>
          <li>{d.rich("a11y.focus", rich)}</li>
          <li>{d.rich("a11y.dismiss", rich)}</li>
          <li>{d.rich("a11y.buttons", rich)}</li>
          <li>{d.rich("a11y.page", rich)}</li>
          <li>{d.rich("a11y.motion", rich)}</li>
          <li>{d.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={d("usage.basic")}>{`import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>${d("trigger")}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>${d("profile.title")}</DialogTitle>
          <DialogDescription>
            ${d("profile.description")}
          </DialogDescription>
        </DialogHeader>
        <Input label="${d("profile.email")}" type="email" placeholder="${d("profile.placeholder")}" />
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>${d("cancel")}</DialogClose>
          <Button type="submit">${d("profile.action")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.steps")}>{`"use client"

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NewProject() {
  const [step, setStep] = React.useState(1)

  return (
    <Dialog onOpenChange={(open) => open && setStep(1)}>
      <DialogTrigger render={<Button />}>${d("header.newProject")}</DialogTrigger>
      <DialogContent>
        {step === 1 ? (
          <DialogHeader>
            <DialogTitle>${d("header.first.title")}</DialogTitle>
            <DialogDescription>${d("header.first.description")}</DialogDescription>
          </DialogHeader>
        ) : (
          <DialogHeader onBack={() => setStep(1)}>
            <DialogTitle>${d("header.step.title")}</DialogTitle>
            <DialogDescription>${d("header.step.description")}</DialogDescription>
          </DialogHeader>
        )}
        {step === 1 ? (
          <Input label="${d("header.project")}" placeholder="${d("header.projectPlaceholder")}" />
        ) : (
          <Input label="${d("header.workspace")}" placeholder="${d("header.workspacePlaceholder")}" />
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>${d("cancel")}</DialogClose>
          {step === 1 ? (
            <Button onClick={() => setStep(2)}>${d("header.next")}</Button>
          ) : (
            <DialogClose render={<Button />}>${d("header.create")}</DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`}</UsageExample>
        <UsageExample title={d("usage.controlled")}>{`"use client"

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function EditProfileAndSave({ onSave }: { onSave: (email: string) => Promise<void> }) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [email, setEmail] = React.useState("")

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <DialogTrigger render={<Button variant="outline" />}>${d("trigger")}</DialogTrigger>
      <DialogContent>
        <form
          className="contents"
          onSubmit={async (event) => {
            event.preventDefault()
            setPending(true)
            try {
              await onSave(email)
              setOpen(false)
            } finally {
              setPending(false)
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>${d("profile.title")}</DialogTitle>
          </DialogHeader>
          <Input
            label="${d("profile.email")}"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <DialogFooter>
            <DialogClose disabled={pending} render={<Button variant="outline" />}>
              ${d("cancel")}
            </DialogClose>
            <Button type="submit" loading={pending} loadingLabel="${d("usage.saving")}">
              ${d("profile.action")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
