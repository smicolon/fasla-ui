"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
  type AlertProps,
} from "@fasla-ui/ui/alert"
import { Avatar } from "@fasla-ui/ui/avatar"
import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VARIANTS = ["default", "info", "success", "warning", "destructive"] as const
const TYPES = ["outline", "soft", "solid"] as const

type Variant = (typeof VARIANTS)[number]
type Sample = { title: string; description: string; action: string }

const PHOTO = "/samples/avatar-portrait.png"

/** One alert, composed from the parts the way a developer would. */
function Composed({
  sample,
  action = true,
  close = true,
  ...props
}: AlertProps & { sample: Sample; action?: boolean; close?: boolean }) {
  return (
    <Alert {...props}>
      <AlertTitle>{sample.title}</AlertTitle>
      <AlertDescription>{sample.description}</AlertDescription>
      {action && <AlertAction>{sample.action}</AlertAction>}
      {close && <AlertClose />}
    </Alert>
  )
}

/**
 * A side row label: left-aligned in both directions, and it never wraps.
 * Above its row on a phone, beside it from `sm` up, centred on the alert.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-left text-sm text-muted-foreground">{children}</span>
)

/**
 * Rows with a label each: the label above on a phone, beside the alert from
 * `sm` up. The alert column takes the rest of the width.
 */
const Rows = ({ children }: { children: React.ReactNode }) => (
  <div className="grid w-full grid-cols-1 items-center gap-x-6 gap-y-2 sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-y-4">
    {children}
  </div>
)

/** A caption above a cell, in the 2-column grid. */
const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-left text-sm text-muted-foreground">{children}</span>
)

export default function AlertPageDocs() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.alert")

  const sample = (variant: Variant): Sample => ({
    title: a(`sample.${variant}.title`),
    description: a(`sample.${variant}.description`),
    action: a(`sample.${variant}.action`),
  })
  const avatar = {
    title: a("sample.avatar.title"),
    description: a("sample.avatar.description"),
    action: a("sample.avatar.action"),
  }

  const [open, setOpen] = React.useState(true)

  // One table per part, as the Tooltip and Pagination pages document them.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: a.rich(`props.${key}`, richCode),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "Alert",
      rows: [
        row("variant", '"default" | "info" | "success" | "warning" | "destructive"', '"default"', "alert.variant"),
        row("type", '"outline" | "solid" | "soft"', '"outline"', "alert.type"),
        row("icon", "boolean | ReactNode", "true", "alert.icon"),
        row("open", "boolean", "", "alert.open"),
        row("defaultOpen", "boolean", "true", "alert.defaultOpen"),
        row("onOpenChange", "(open: boolean) => void", "", "alert.onOpenChange"),
        row("role", "string", "", "alert.role"),
        row("children", "ReactNode", "", "alert.children"),
        row("className", "string", "", "alert.className"),
      ],
    },
    {
      part: "AlertTitle",
      rows: [row("children", "ReactNode", "", "title.children"), row("className", "string", "", "title.className")],
    },
    {
      part: "AlertDescription",
      rows: [
        row("children", "ReactNode", "", "description.children"),
        row("className", "string", "", "description.className"),
      ],
    },
    {
      part: "AlertAction",
      rows: [
        row("variant", '"default" | "outline" | "ghost" | "soft" | "link"', "", "action.variant"),
        row("tone", '"primary" | "secondary" | "destructive"', "", "action.tone"),
        row("size", '"xs" | "sm" | "md" | "lg"', '"xs"', "action.size"),
        row("asChild", "boolean", "false", "action.asChild"),
        row("onClick", "(event) => void", "", "action.onClick"),
        row("children", "ReactNode", "", "action.children"),
        row("className", "string", "", "action.className"),
      ],
    },
    {
      part: "AlertClose",
      rows: [
        row("label", "string", "", "close.label"),
        row("onClick", "(event) => void", "", "close.onClick"),
        row("children", "ReactNode", "", "close.children"),
        row("className", "string", "", "close.className"),
      ],
    },
  ]

  const info = sample("info")
  const destructive = sample("destructive")
  const long = {
    title: a("sample.long.title"),
    description: a("sample.long.description"),
    more: a("sample.long.more"),
    action: a("sample.long.action"),
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/alert/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="alert" />
        <p className="text-sm text-muted-foreground">{a.rich("installNote", richCode)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Composed variant="info" sample={info} />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's Variants. Two columns from `sm`: title and description only, so each fits half the box. */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{a.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          <div className="grid w-full grid-cols-1 items-start gap-x-4 gap-y-4 sm:grid-cols-2">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-2">
                <Caption>
                  <code>{variant}</code>
                </Caption>
                <Composed variant={variant} sample={sample(variant)} action={false} close={false} />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Types: Figma's Type */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("types.title")}</h2>
        <p className="text-muted-foreground">{a.rich("types.body", richCode)}</p>
        <ComponentPreview>
          <Rows>
            {TYPES.map((type) => (
              <div key={type} className="contents">
                <RowHead>
                  <code>{type}</code>
                </RowHead>
                <Composed type={type} variant="success" sample={sample("success")} className="mb-3 sm:mb-0" />
              </div>
            ))}
          </Rows>
        </ComponentPreview>
      </section>

      {/* Icon and avatar: Figma's Left Icon and Avatar */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("icon.title")}</h2>
        <p className="text-muted-foreground">{a.rich("icon.body", richCode)}</p>
        <ComponentPreview>
          <Rows>
            <RowHead>{a("icon.withIcon")}</RowHead>
            <Composed variant="warning" sample={sample("warning")} close={false} className="mb-3 sm:mb-0" />
            <RowHead>{a("icon.withAvatar")}</RowHead>
            <Composed
              icon={<Avatar src={PHOTO} name="" radius="rounded" />}
              sample={avatar}
              close={false}
              className="mb-3 sm:mb-0"
            />
            <RowHead>{a("icon.none")}</RowHead>
            <Composed variant="warning" icon={false} sample={sample("warning")} close={false} />
          </Rows>
        </ComponentPreview>
      </section>

      {/* Action and close: Figma's Show Actions and Close Icon */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("actions.title")}</h2>
        <p className="text-muted-foreground">{a.rich("actions.body", richCode)}</p>
        <ComponentPreview>
          <Rows>
            <RowHead>{a("actions.both")}</RowHead>
            <Composed type="solid" variant="destructive" sample={destructive} className="mb-3 sm:mb-0" />
            <RowHead>{a("actions.action")}</RowHead>
            <Composed type="solid" variant="destructive" sample={destructive} close={false} className="mb-3 sm:mb-0" />
            <RowHead>{a("actions.close")}</RowHead>
            <Composed type="solid" variant="destructive" sample={destructive} action={false} />
          </Rows>
        </ComponentPreview>
      </section>

      {/* Long text */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("long.title")}</h2>
        <p className="text-muted-foreground">{a.rich("long.body", richCode)}</p>
        <ComponentPreview>
          <Alert variant="warning" type="soft">
            <AlertTitle>{long.title}</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{long.description}</p>
              <p>{long.more}</p>
            </AlertDescription>
            <AlertAction>{long.action}</AlertAction>
            <AlertClose />
          </Alert>
        </ComponentPreview>
      </section>

      {/* Closing: a controlled alert */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("closing.title")}</h2>
        <p className="text-muted-foreground">{a.rich("closing.body", richCode)}</p>
        <ComponentPreview>
          {/* As tall as the alert, so the box doesn't jump when it closes. */}
          <div className="flex min-h-[4.5rem] w-full items-center justify-center">
            <Composed sample={sample("default")} open={open} onOpenChange={setOpen} />
            {!open && (
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <p>{a("closing.closed")}</p>
                <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                  {a("closing.reopen")}
                </Button>
              </div>
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{a.rich("a11y.role", richCode)}</li>
          <li>{a.rich("a11y.live", richCode)}</li>
          <li>{a.rich("a11y.icon", richCode)}</li>
          <li>{a.rich("a11y.close", richCode)}</li>
          <li>{a.rich("a11y.focus", richCode)}</li>
          <li>{a.rich("a11y.forcedColors", richCode)}</li>
          <li>{a.rich("a11y.direction", richCode)}</li>
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
        <UsageExample title={a("usage.basic")}>{`import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MaintenanceNotice() {
  return (
    <Alert variant="info">
      <AlertTitle>${info.title}</AlertTitle>
      <AlertDescription>${info.description}</AlertDescription>
    </Alert>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.dismissible")}>{`import {
  Alert,
  AlertAction,
  AlertClose,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function SaveError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive" type="soft">
      <AlertTitle>${destructive.title}</AlertTitle>
      <AlertDescription>${destructive.description}</AlertDescription>
      <AlertAction onClick={onRetry}>${destructive.action}</AlertAction>
      <AlertClose />
    </Alert>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.controlled")}>{`"use client"

import { useState } from "react"
import { Alert, AlertClose, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function InboxNotice() {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        ${a("closing.reopen")}
      </Button>
    )
  }

  return (
    <Alert open={open} onOpenChange={setOpen}>
      <AlertTitle>${sample("default").title}</AlertTitle>
      <AlertDescription>${sample("default").description}</AlertDescription>
      <AlertClose />
    </Alert>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.avatar")}>{`import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar } from "@/components/ui/avatar"

export function ReplyNotice() {
  return (
    <Alert icon={<Avatar src="/avatars/layla.png" name="" radius="rounded" />}>
      <AlertTitle>${avatar.title}</AlertTitle>
      <AlertDescription>${avatar.description}</AlertDescription>
      <AlertAction asChild>
        <a href="/messages/42">${avatar.action}</a>
      </AlertAction>
    </Alert>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
