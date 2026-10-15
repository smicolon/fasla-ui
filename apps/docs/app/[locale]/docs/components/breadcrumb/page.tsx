"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { FileIcon, FolderIcon, HouseIcon, SlashIcon, WorkflowIcon } from "lucide-react"

import { Badge } from "@fasla-ui/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@fasla-ui/ui/breadcrumb"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** Figma's four Styles, in its order. */
const STYLES = ["default", "separator", "badge", "outline"] as const
type Style = (typeof STYLES)[number]

/** Figma's icons for the four steps: house, workflow, file, folder. */
const ICONS = [HouseIcon, WorkflowIcon, FileIcon, FolderIcon]

type Step = { label: string; icon?: React.ComponentType }

/**
 * One trail, in any of Figma's Styles. `steps` are shown in order; with
 * `collapsed`, an ellipsis stands in after the first step, as in Count=+4.
 */
function Trail({
  label,
  steps,
  style = "default",
  collapsed = false,
  className,
}: {
  label: string
  steps: Step[]
  style?: Style
  collapsed?: boolean
  className?: string
}) {
  const separator = style === "default" ? undefined : <SlashIcon />
  const badge = style === "badge" ? "soft" : style === "outline" ? "outline" : null
  const shown: (Step | "ellipsis")[] = collapsed ? [steps[0]!, "ellipsis", ...steps.slice(-2)] : steps

  return (
    <Breadcrumb aria-label={label} className={className}>
      <BreadcrumbList>
        {shown.map((step, i) => {
          const last = i === shown.length - 1
          const Icon = step === "ellipsis" ? undefined : step.icon
          const icon = Icon && <Icon />
          return (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {step === "ellipsis" ? (
                  <BreadcrumbEllipsis />
                ) : badge && last ? (
                  <BreadcrumbPage>
                    <Badge variant={badge} size="md">
                      {step.label}
                    </Badge>
                  </BreadcrumbPage>
                ) : badge ? (
                  // Figma dims the steps before the current page to 60%; the pill radius
                  // keeps the focus outline on the badge's own shape, at full strength.
                  <BreadcrumbLink href="#" className="rounded-full opacity-60 hover:opacity-100 focus-visible:opacity-100">
                    <Badge variant={badge} size="md">
                      {step.label}
                    </Badge>
                  </BreadcrumbLink>
                ) : last ? (
                  <BreadcrumbPage icon={icon}>{step.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#" icon={icon}>
                    {step.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

/**
 * A side row label: left-aligned in both directions, and it never wraps.
 * Each preview's landmark gets its own name (the label plus its section), so
 * the many trails on this page stay distinguishable; a real page has one.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span className="whitespace-nowrap text-left text-sm text-muted-foreground">{children}</span>
)

export default function BreadcrumbPageDocs() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.breadcrumb")
  /** The list comma of the page's script, for the landmark names below. */
  const comma = useLocale() === "ar" ? "، " : ", "

  const label = b("sample.label")
  const crumbs = b.raw("sample.crumbs") as string[]
  const sections = b.raw("sample.sections") as string[]
  const long = b.raw("sample.long") as string[]

  const steps = (icons: boolean): Step[] =>
    crumbs.map((text, i) => ({ label: text, icon: icons ? ICONS[i] : undefined }))
  const badgeSteps: Step[] = sections.map((text) => ({ label: text }))
  /** The Variants rows are Figma's Count=3: home, then the last two steps. */
  const three = (list: Step[]) => [list[0]!, ...list.slice(-2)]

  const props: PropRow[] = [
    { prop: "aria-label", type: "string", fallback: '"Breadcrumb"', description: b.rich("props.ariaLabel", richCode) },
    { prop: "BreadcrumbList", type: "ReactNode", fallback: "", description: b.rich("props.list", richCode) },
    { prop: "BreadcrumbItem", type: "ReactNode", fallback: "", description: b.rich("props.item", richCode) },
    { prop: "BreadcrumbLink", type: "{ href, asChild, icon }", fallback: "", description: b.rich("props.link", richCode) },
    { prop: "asChild", type: "boolean", fallback: "false", description: b.rich("props.asChild", richCode) },
    { prop: "icon", type: "ReactNode", fallback: "", description: b.rich("props.icon", richCode) },
    { prop: "BreadcrumbPage", type: "{ icon }", fallback: "", description: b.rich("props.page", richCode) },
    { prop: "BreadcrumbSeparator", type: "ReactNode", fallback: "", description: b.rich("props.separator", richCode) },
    { prop: "BreadcrumbEllipsis", type: "", fallback: "", description: b.rich("props.ellipsis", richCode) },
    { prop: "className", type: "string", fallback: "", description: b.rich("props.className", richCode) },
  ]

  /**
   * One JSX element at the given indent: on one line when it fits the code
   * block (about 64 characters), else with its text on a line of its own.
   */
  const element = (indent: string, open: string, text: string, close: string) =>
    `${indent}${open}${text}${close}`.length <= 64
      ? `${indent}${open}${text}${close}`
      : `${indent}${open}\n${indent}  ${text}\n${indent}${close}`

  /** The usage examples' trail, as JSX lines at the given indent. */
  const items = (list: string[], indent: string, separator = "<BreadcrumbSeparator />") =>
    list
      .map((text, i) =>
        i === list.length - 1
          ? `${indent}<BreadcrumbItem>
${element(`${indent}  `, "<BreadcrumbPage>", text, "</BreadcrumbPage>")}
${indent}</BreadcrumbItem>`
          : `${indent}<BreadcrumbItem>
${element(`${indent}  `, `<BreadcrumbLink href="${["/", "/projects", "/docs"][i]}">`, text, "</BreadcrumbLink>")}
${indent}</BreadcrumbItem>
${indent}${separator}`
      )
      .join("\n")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/breadcrumb/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="breadcrumb" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Trail label={label} steps={three(steps(false))} />
        </ComponentPreview>
      </section>

      {/* Variants: Figma's four Styles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{b.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          {/* Label above the trail on a phone, beside it from sm up. */}
          <div className="grid w-full grid-cols-1 items-center gap-x-6 gap-y-2 sm:mx-auto sm:w-max sm:grid-cols-[max-content_max-content] sm:gap-y-5">
            {STYLES.map((style) => (
              <div key={style} className="contents">
                <RowHead>{b(`styles.${style}`)}</RowHead>
                <Trail
                  label={`${label}: ${b(`styles.${style}`)}`}
                  style={style}
                  steps={three(style === "badge" || style === "outline" ? badgeSteps : steps(true))}
                  className="mb-3 sm:mb-0"
                />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Icons: Figma's Has-Icon */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("icons.title")}</h2>
        <p className="text-muted-foreground">{b.rich("icons.body", richCode)}</p>
        <ComponentPreview>
          <Trail label={`${label}: ${b("icons.title")}`} steps={steps(true)} />
        </ComponentPreview>
      </section>

      {/* Collapsed: Figma's Count=+4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("collapsed.title")}</h2>
        <p className="text-muted-foreground">{b.rich("collapsed.body", richCode)}</p>
        <ComponentPreview>
          <div className="flex flex-col items-center gap-4">
            <Trail label={`${label}: ${b("collapsed.title")}`} steps={steps(true)} collapsed />
            <Trail
              label={`${label}: ${b("collapsed.title")}${comma}${b("styles.badge")}`}
              steps={badgeSteps}
              style="badge"
              collapsed
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Long labels */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("wrapping.title")}</h2>
        <p className="text-muted-foreground">{b.rich("wrapping.body", richCode)}</p>
        <ComponentPreview>
          <Trail
            label={`${label}: ${b("wrapping.title")}`}
            steps={long.map((text, i) => ({ label: text, icon: ICONS[i] }))}
            className="w-full max-w-xs"
          />
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{b.rich("a11y.landmark", richCode)}</li>
          <li>{b.rich("a11y.current", richCode)}</li>
          <li>{b.rich("a11y.hidden", richCode)}</li>
          <li>{b.rich("a11y.focus", richCode)}</li>
          <li>{b.rich("a11y.direction", richCode)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={b("usage.basic")}>{`import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DocumentBreadcrumb() {
  return (
    <Breadcrumb aria-label="${label}">
      <BreadcrumbList>
${items(crumbs, "        ")}
      </BreadcrumbList>
    </Breadcrumb>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.collapsed")}>{`import { HouseIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CollapsedBreadcrumb() {
  return (
    <Breadcrumb aria-label="${label}">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" icon={<HouseIcon />}>
            ${crumbs[0]}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">${crumbs[2]}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>${crumbs[3]}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.separator")}>{`import { SlashIcon } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function SlashBreadcrumb() {
  return (
    <Breadcrumb aria-label="${label}">
      <BreadcrumbList>
${items([crumbs[0]!, crumbs[3]!], "        ", `<BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>`)}
      </BreadcrumbList>
    </Breadcrumb>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.router")}>{`import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function ProjectBreadcrumb() {
  return (
    <Breadcrumb aria-label="${label}">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/projects">${crumbs[1]}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>${crumbs[2]}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.badge")}>{`import { SlashIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const DIMMED = [
  "rounded-full opacity-60",
  "hover:opacity-100 focus-visible:opacity-100",
].join(" ")

export function DepartmentBreadcrumb() {
  return (
    <Breadcrumb aria-label="${label}">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/marketing" className={DIMMED}>
            <Badge variant="soft" size="md">
              ${sections[2]}
            </Badge>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Badge variant="soft" size="md">
              ${sections[3]}
            </Badge>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
