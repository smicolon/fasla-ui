"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { FileIcon, FolderIcon, HouseIcon, SlashIcon, WorkflowIcon, type LucideIcon } from "lucide-react"

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@fasla-ui/ui/dropdown-menu"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** Figma's four Styles, in its order. */
const STYLES = ["default", "separator", "badge", "outline"] as const
type Style = (typeof STYLES)[number]

/** Figma's icons for the four steps: house, workflow, file, folder. */
const ICONS = [HouseIcon, WorkflowIcon, FileIcon, FolderIcon]

type Step = { label: string; icon?: LucideIcon }

/**
 * The ellipsis as a menu trigger: a 24px target drawn around the 14px glyph,
 * its 5px overhang taken back by the negative margin so the trail keeps
 * Figma's spacing. Hover and the open menu fill it with `accent`, as a ghost
 * Button does.
 */
const ELLIPSIS_TRIGGER = [
  "-m-[5px] inline-flex size-6 cursor-pointer items-center justify-center rounded-[var(--radius-sm)]",
  "transition-colors duration-150 hover:bg-accent data-[popup-open]:bg-accent motion-reduce:transition-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
].join(" ")

/** The collapsed trail's ellipsis, opening a menu of the steps it hides, as links. */
function HiddenStepsMenu({ label, steps }: { label: string; steps: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={label} className={ELLIPSIS_TRIGGER}>
        <BreadcrumbEllipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {steps.map((text) => (
          <DropdownMenuItem key={text} render={<a href="#" />}>
            {text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * One trail, in any of Figma's Styles. `steps` are shown in order; with
 * `collapsed`, an ellipsis stands in after the first step, as in Count=+4;
 * with `menu` too, the ellipsis opens a menu of the steps it hides.
 */
function Trail({
  label,
  steps,
  style = "default",
  collapsed = false,
  menu,
  className,
}: {
  label: string
  steps: Step[]
  style?: Style
  collapsed?: boolean
  menu?: { label: string; steps: string[] }
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
          // Badge sizes its own icon slot but leaves the stroke: 1.5, as Badge's stories use.
          const chipIcon = Icon && <Icon strokeWidth={1.5} />
          return (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {step === "ellipsis" ? (
                  menu ? <HiddenStepsMenu {...menu} /> : <BreadcrumbEllipsis />
                ) : badge && last ? (
                  <BreadcrumbPage>
                    <Badge variant={badge} size="md" icon={chipIcon}>
                      {step.label}
                    </Badge>
                  </BreadcrumbPage>
                ) : badge ? (
                  // Figma dims the steps before the current page to 60%; the pill radius
                  // keeps the focus outline on the badge's own shape, at full strength.
                  <BreadcrumbLink href="#" className="rounded-full opacity-60 hover:opacity-100 focus-visible:opacity-100">
                    <Badge variant={badge} size="md" icon={chipIcon}>
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
  const hidden = b.raw("sample.hidden") as string[]
  const hiddenSections = b.raw("sample.hiddenSections") as string[]
  const menuLabel = b("sample.menu")

  const steps = (icons: boolean): Step[] =>
    crumbs.map((text, i) => ({ label: text, icon: icons ? ICONS[i] : undefined }))
  const badgeSteps: Step[] = sections.map((text) => ({ label: text }))
  /** The badge trail with icons: the house first, a folder between, a file for the current page. */
  const badgeIconSteps: Step[] = sections.map((text, i) => ({
    label: text,
    icon: i === 0 ? HouseIcon : i === sections.length - 1 ? FileIcon : FolderIcon,
  }))
  /** The Variants rows are Figma's Count=3: home, then the last two steps. */
  const three = (list: Step[]) => [list[0]!, ...list.slice(-2)]

  // One table per part, as the Tooltip page and shadcn document them.
  const row = (prop: string, type: string, fallback: string, key: string): PropRow => ({
    prop,
    type,
    fallback,
    description: b.rich(`props.${key}`, richCode),
  })
  const propTables: { part: string; rows: PropRow[] }[] = [
    {
      part: "Breadcrumb",
      rows: [
        row("aria-label", "string", '"Breadcrumb"', "breadcrumb.ariaLabel"),
        row("children", "ReactNode", "", "breadcrumb.children"),
        row("className", "string", "", "breadcrumb.className"),
      ],
    },
    {
      part: "BreadcrumbList",
      rows: [
        row("children", "ReactNode", "", "list.children"),
        row("className", "string", "", "list.className"),
      ],
    },
    {
      part: "BreadcrumbItem",
      rows: [
        row("children", "ReactNode", "", "item.children"),
        row("className", "string", "", "item.className"),
      ],
    },
    {
      part: "BreadcrumbLink",
      rows: [
        row("href", "string", "", "link.href"),
        row("asChild", "boolean", "false", "link.asChild"),
        row("icon", "ReactNode", "", "link.icon"),
        row("children", "ReactNode", "", "link.children"),
        row("className", "string", "", "link.className"),
      ],
    },
    {
      part: "BreadcrumbPage",
      rows: [
        row("icon", "ReactNode", "", "page.icon"),
        row("children", "ReactNode", "", "page.children"),
        row("className", "string", "", "page.className"),
      ],
    },
    {
      part: "BreadcrumbSeparator",
      rows: [
        row("children", "ReactNode", "", "separator.children"),
        row("className", "string", "", "separator.className"),
      ],
    },
    {
      part: "BreadcrumbEllipsis",
      rows: [row("className", "string", "", "ellipsis.className")],
    },
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

  /** The collapsed example's menu: one link row per hidden step. */
  const menuItems = (indent: string) =>
    hidden
      .map((text, i) => {
        const href = ["/projects", "/projects/website"][i]
        return element(indent, `<DropdownMenuItem render={<a href="${href}" />}>`, text, "</DropdownMenuItem>")
      })
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
          <div className="flex flex-col items-center gap-4">
            <Trail label={`${label}: ${b("icons.title")}`} steps={steps(true)} />
            <Trail
              label={`${label}: ${b("icons.title")}${comma}${b("styles.badge")}`}
              steps={three(badgeIconSteps)}
              style="badge"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Collapsed: Figma's Count=+4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("collapsed.title")}</h2>
        <p className="text-muted-foreground">{b.rich("collapsed.body", richCode)}</p>
        <ComponentPreview>
          <div className="flex flex-col items-center gap-4">
            <Trail
              label={`${label}: ${b("collapsed.title")}`}
              steps={steps(true)}
              collapsed
              menu={{ label: menuLabel, steps: hidden }}
            />
            <Trail
              label={`${label}: ${b("collapsed.title")}${comma}${b("styles.badge")}`}
              steps={badgeSteps}
              style="badge"
              collapsed
              menu={{ label: menuLabel, steps: hiddenSections }}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{b.rich("a11y.landmark", richCode)}</li>
          <li>{b.rich("a11y.current", richCode)}</li>
          <li>{b.rich("a11y.hidden", richCode)}</li>
          <li>{b.rich("a11y.menu", richCode)}</li>
          <li>{b.rich("a11y.focus", richCode)}</li>
          <li>{b.rich("a11y.direction", richCode)}</li>
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TRIGGER = [
  "-m-[5px] inline-flex size-6 cursor-pointer items-center",
  "justify-center rounded-[var(--radius-sm)] transition-colors",
  "hover:bg-accent data-[popup-open]:bg-accent",
  "focus-visible:outline focus-visible:outline-2",
  "focus-visible:outline-ring motion-reduce:transition-none",
].join(" ")

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
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="${menuLabel}"
              className={TRIGGER}
            >
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
${menuItems("              ")}
            </DropdownMenuContent>
          </DropdownMenu>
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
