"use client"

import * as React from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"
import {
  CalendarIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarSubItem,
  SidebarPlanCard,
  SidebarFooter,
  SidebarProfile,
  type SidebarProps,
} from "@fasla-ui/ui/sidebar"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const PHOTO = "/samples/avatar-portrait.png"

/** Lucide icons at Figma's 1.5 stroke; the item sets them at 16px. */
const icon = (Icon: LucideIcon) => <Icon strokeWidth={1.5} />

/**
 * The Fasla lockup at Figma's size, drawn, never re-set: the English one 90px
 * wide, the Arabic one 28px tall. Ink on light, white on dark, and the Arabic
 * lockup on the Arabic page.
 */
function Logo({ rtl, alt }: { rtl: boolean; alt: string }) {
  const file = rtl ? "rtl" : "ltr"
  const width = rtl ? 98 : 90
  const height = rtl ? 28 : 29
  const style = rtl ? LOCKUP_RTL : LOCKUP_LTR
  return (
    <>
      <Image src={`/brand/fasla-lockup-${file}.svg`} alt={alt} width={width} height={height} style={style} className="dark:hidden" />
      <Image
        src={`/brand/fasla-lockup-${file}-onDark.svg`}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className="hidden dark:block"
      />
    </>
  )
}

const LOCKUP_LTR = { width: 90, height: "auto" } as const
const LOCKUP_RTL = { height: 28, width: "auto" } as const

/** The mark alone, 28px, for the collapsed header. */
function Mark({ alt }: { alt: string }) {
  return <Image src="/brand/fasla-mark.svg" alt={alt} width={28} height={28} className="size-7" />
}

/**
 * Heights that fit the whole sample without scrolling, in English and in
 * Arabic, whose Cairo lines are taller: the sidebar fills its container, as it
 * fills a page in an app.
 */
const HEIGHT = { base: "h-[50rem]", plan: "h-[60rem]" } as const

/**
 * Item rows held in a state, for the States table: a 240px strip of the
 * sidebar's own background, as Figma draws the item set.
 */
const STRIP = "w-full rounded-[var(--radius-md)] bg-sidebar py-1"

/** Hover and Focus held still, as Figma draws them: the same tokens the pointer and keyboard set. */
const HELD = {
  default: "",
  hover: "bg-sidebar-accent text-sidebar-accent-foreground",
  selected: "",
  focus: "border-ring ring-[3px] ring-ring/50",
} as const
const STATES = ["default", "hover", "selected", "focus"] as const

export default function SidebarPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.sidebar")
  const rtl = useLocale() === "ar"

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const [collapsed, setCollapsed] = React.useState(false)

  /** The sample store, laid out as the Figma frame: two titled groups, one parent open on its selected sub-item. */
  const sidebar = (props: Partial<SidebarProps> & { plan?: boolean } = {}) => {
    const { plan = false, ...root } = props
    return (
      <Sidebar {...root}>
        <SidebarHeader logo={<Logo rtl={rtl} alt={s("logo")} />} logoIcon={<Mark alt={s("logo")} />} />
        <SidebarContent aria-label={s("nav")}>
          <SidebarGroup label={s("groups.store")}>
            <SidebarItem icon={icon(LayoutDashboardIcon)} label={s("items.dashboard")} href="#dashboard" />
            <SidebarItem icon={icon(ShoppingCartIcon)} label={s("items.orders")}>
              <SidebarSubItem label={s("items.allOrders")} href="#orders" selected />
              <SidebarSubItem label={s("items.returns")} href="#returns" />
              <SidebarSubItem label={s("items.drafts")} href="#drafts" />
            </SidebarItem>
            <SidebarItem icon={icon(PackageIcon)} label={s("items.products")} href="#products" />
            <SidebarItem icon={icon(UsersIcon)} label={s("items.customers")}>
              <SidebarSubItem label={s("items.segments")} href="#segments" />
              <SidebarSubItem label={s("items.reviews")} href="#reviews" />
            </SidebarItem>
            <SidebarItem icon={icon(MessageSquareIcon)} label={s("items.messages")} href="#messages" badge />
          </SidebarGroup>
          <SidebarGroup label={s("groups.account")}>
            <SidebarItem icon={icon(SettingsIcon)} label={s("items.settings")} href="#settings" />
            <SidebarItem icon={icon(UsersRoundIcon)} label={s("items.team")} href="#team" />
            <SidebarItem icon={icon(CreditCardIcon)} label={s("items.billing")} href="#billing" />
          </SidebarGroup>
        </SidebarContent>
        {plan && (
          <SidebarPlanCard
            title={s("plan.title")}
            description={s("plan.description")}
            footer={s("plan.footer")}
            footerIcon={icon(CalendarIcon)}
          />
        )}
        <SidebarFooter>
          <SidebarProfile
            name={s("profile.name")}
            description={s("profile.description")}
            avatar={{ src: PHOTO }}
          />
        </SidebarFooter>
      </Sidebar>
    )
  }

  const parts: { part: string; rows: PropRow[] }[] = [
    {
      part: "Sidebar",
      rows: [
        { prop: "collapsed", type: "boolean", fallback: "", description: s.rich("rootProps.collapsed", rich) },
        { prop: "defaultCollapsed", type: "boolean", fallback: "false", description: s.rich("rootProps.defaultCollapsed", rich) },
        { prop: "onCollapsedChange", type: "(collapsed) => void", fallback: "", description: s.rich("rootProps.onCollapsedChange", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("rootProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("rootProps.className", rich) },
      ],
    },
    {
      part: "SidebarHeader",
      rows: [
        { prop: "logo", type: "ReactNode", fallback: "", description: s.rich("headerProps.logo", rich) },
        { prop: "logoIcon", type: "ReactNode", fallback: "", description: s.rich("headerProps.logoIcon", rich) },
        { prop: "collapseLabel", type: "string", fallback: '"Collapse sidebar"', description: s.rich("headerProps.collapseLabel", rich) },
        { prop: "expandLabel", type: "string", fallback: '"Expand sidebar"', description: s.rich("headerProps.expandLabel", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("headerProps.className", rich) },
      ],
    },
    {
      part: "SidebarContent",
      rows: [
        { prop: "aria-label", type: "string", fallback: "", description: s.rich("contentProps.aria-label", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("contentProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("contentProps.className", rich) },
      ],
    },
    {
      part: "SidebarGroup",
      rows: [
        { prop: "label", type: "ReactNode", fallback: "", description: s.rich("groupProps.label", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("groupProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("groupProps.className", rich) },
      ],
    },
    {
      part: "SidebarItem",
      rows: [
        { prop: "label", type: "ReactNode", fallback: "", description: s.rich("itemProps.label", rich) },
        { prop: "icon", type: "ReactNode", fallback: "", description: s.rich("itemProps.icon", rich) },
        { prop: "selected", type: "boolean", fallback: "false", description: s.rich("itemProps.selected", rich) },
        { prop: "badge", type: "boolean", fallback: "false", description: s.rich("itemProps.badge", rich) },
        { prop: "badgeLabel", type: "string", fallback: '"New"', description: s.rich("itemProps.badgeLabel", rich) },
        { prop: "href", type: "string", fallback: "", description: s.rich("itemProps.href", rich) },
        { prop: "render", type: "ReactElement", fallback: "", description: s.rich("itemProps.render", rich) },
        { prop: "open", type: "boolean", fallback: "", description: s.rich("itemProps.open", rich) },
        { prop: "defaultOpen", type: "boolean", fallback: "", description: s.rich("itemProps.defaultOpen", rich) },
        { prop: "onOpenChange", type: "(open) => void", fallback: "", description: s.rich("itemProps.onOpenChange", rich) },
        { prop: "onClick", type: "(event) => void", fallback: "", description: s.rich("itemProps.onClick", rich) },
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("itemProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("itemProps.className", rich) },
      ],
    },
    {
      part: "SidebarSubItem",
      rows: [
        { prop: "label", type: "ReactNode", fallback: "", description: s.rich("subItemProps.label", rich) },
        { prop: "selected", type: "boolean", fallback: "false", description: s.rich("subItemProps.selected", rich) },
        { prop: "badge", type: "boolean", fallback: "false", description: s.rich("subItemProps.badge", rich) },
        { prop: "badgeLabel", type: "string", fallback: '"New"', description: s.rich("subItemProps.badgeLabel", rich) },
        { prop: "href", type: "string", fallback: "", description: s.rich("subItemProps.href", rich) },
        { prop: "render", type: "ReactElement", fallback: "", description: s.rich("subItemProps.render", rich) },
        { prop: "onClick", type: "(event) => void", fallback: "", description: s.rich("subItemProps.onClick", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("subItemProps.className", rich) },
      ],
    },
    {
      part: "SidebarPlanCard",
      rows: [
        { prop: "title", type: "ReactNode", fallback: "", description: s.rich("planProps.title", rich) },
        { prop: "description", type: "ReactNode", fallback: "", description: s.rich("planProps.description", rich) },
        { prop: "footer", type: "ReactNode", fallback: "", description: s.rich("planProps.footer", rich) },
        { prop: "footerIcon", type: "ReactNode", fallback: "", description: s.rich("planProps.footerIcon", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("planProps.className", rich) },
      ],
    },
    {
      part: "SidebarFooter",
      rows: [
        { prop: "children", type: "ReactNode", fallback: "", description: s.rich("footerProps.children", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("footerProps.className", rich) },
      ],
    },
    {
      part: "SidebarProfile",
      rows: [
        { prop: "name", type: "string", fallback: "", description: s.rich("profileProps.name", rich) },
        { prop: "description", type: "ReactNode", fallback: "", description: s.rich("profileProps.description", rich) },
        { prop: "avatar", type: "AvatarProps", fallback: "", description: s.rich("profileProps.avatar", rich) },
        { prop: "onClick", type: "(event) => void", fallback: "", description: s.rich("profileProps.onClick", rich) },
        { prop: "className", type: "string", fallback: "", description: s.rich("profileProps.className", rich) },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/sidebar/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="sidebar" />
        <p className="text-muted-foreground">{s.rich("installNote", rich)}</p>
      </section>

      {/* Preview: the real sidebar, collapsing from its own toggle */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className={HEIGHT.base}>{sidebar({ collapsed, onCollapsedChange: setCollapsed })}</div>
        </ComponentPreview>
        <p className="text-sm text-muted-foreground">{s("previewHint")}</p>
      </section>

      {/* Expanded and collapsed */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("collapsedState.title")}</h2>
        <p className="text-muted-foreground">{s.rich("collapsedState.body", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-start justify-center gap-6">
            {(["expanded", "collapsed"] as const).map((state) => (
              <div key={state} className="flex flex-col items-center gap-2">
                <span className="text-sm text-muted-foreground">{s(`collapsedState.${state}`)}</span>
                <div className={HEIGHT.base}>{sidebar({ defaultCollapsed: state === "collapsed" })}</div>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("states.body", rich)}</p>
        <ComponentPreview>
          {/* Side labels left-aligned in both directions, centred on the first row's 40px line. */}
          {/* Two 240px columns from `sm` up; on a phone the sub-item sits under the item and both narrow to fit. */}
          <div className="grid w-full grid-cols-[max-content_minmax(0,15rem)] items-start gap-x-6 gap-y-3 sm:w-fit sm:grid-cols-[max-content_auto]">
            <span />
            <div className="grid gap-x-4 gap-y-1 sm:grid-cols-[repeat(2,15rem)]">
              <span className="hidden text-sm text-muted-foreground sm:block">{s("states.item")}</span>
              <span className="hidden text-sm text-muted-foreground sm:block">{s("states.subItem")}</span>
            </div>
            {STATES.map((state) => (
              <React.Fragment key={state}>
                <span className="flex h-12 items-center whitespace-nowrap text-left text-sm text-muted-foreground">
                  {s(`states.${state}`)}
                </span>
                <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[repeat(2,15rem)]">
                  <ul className={STRIP}>
                    <SidebarItem
                      icon={icon(LayoutDashboardIcon)}
                      label={s("items.dashboard")}
                      selected={state === "selected"}
                      className={HELD[state]}
                      tabIndex={-1}
                    />
                  </ul>
                  <ul className={STRIP}>
                    <SidebarSubItem
                      label={s("items.allOrders")}
                      selected={state === "selected"}
                      className={HELD[state]}
                      tabIndex={-1}
                    />
                  </ul>
                </div>
              </React.Fragment>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Items and sub-items */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("subItems.title")}</h2>
        <p className="text-muted-foreground">{s.rich("subItems.body", rich)}</p>
        <ComponentPreview>
          <div>
            <Sidebar>
              <SidebarContent aria-label={s("nav")}>
                <SidebarGroup label={s("groups.store")}>
                  <SidebarItem icon={icon(LayoutDashboardIcon)} label={s("items.dashboard")} href="#dashboard" />
                  <SidebarItem icon={icon(ShoppingCartIcon)} label={s("items.orders")}>
                    <SidebarSubItem label={s("items.allOrders")} href="#orders" selected />
                    <SidebarSubItem label={s("items.returns")} href="#returns" badge />
                    <SidebarSubItem label={s("items.drafts")} href="#drafts" />
                  </SidebarItem>
                  <SidebarItem icon={icon(UsersIcon)} label={s("items.customers")}>
                    <SidebarSubItem label={s("items.segments")} href="#segments" />
                    <SidebarSubItem label={s("items.reviews")} href="#reviews" />
                  </SidebarItem>
                  <SidebarItem icon={icon(MessageSquareIcon)} label={s("items.messages")} href="#messages" badge />
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
        </ComponentPreview>
      </section>

      {/* Plan card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("planCard.title")}</h2>
        <p className="text-muted-foreground">{s.rich("planCard.body", rich)}</p>
        <ComponentPreview>
          <div className={HEIGHT.plan}>{sidebar({ plan: true })}</div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.landmarks", rich)}</li>
          <li>{s.rich("a11y.current", rich)}</li>
          <li>{s.rich("a11y.toggle", rich)}</li>
          <li>{s.rich("a11y.subItems", rich)}</li>
          <li>{s.rich("a11y.collapsed", rich)}</li>
          <li>{s.rich("a11y.focus", rich)}</li>
          <li>{s.rich("a11y.badge", rich)}</li>
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
        <UsageExample title={s("usage.basic")}>{`import { LayoutDashboardIcon, SettingsIcon, ShoppingCartIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarProfile,
  SidebarSubItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader
        logo={<img src="/logo.svg" alt="${s("logo")}" className="h-7" />}
        logoIcon={<img src="/logo-icon.svg" alt="${s("logo")}" className="size-7" />}
      />
      <SidebarContent aria-label="${s("nav")}">
        <SidebarGroup label="${s("groups.store")}">
          <SidebarItem icon={<LayoutDashboardIcon strokeWidth={1.5} />} label="${s("items.dashboard")}" href="/dashboard" />
          <SidebarItem icon={<ShoppingCartIcon strokeWidth={1.5} />} label="${s("items.orders")}">
            <SidebarSubItem label="${s("items.allOrders")}" href="/orders" selected />
            <SidebarSubItem label="${s("items.returns")}" href="/orders/returns" />
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup label="${s("groups.account")}">
          <SidebarItem icon={<SettingsIcon strokeWidth={1.5} />} label="${s("items.settings")}" href="/settings" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfile name="${s("profile.name")}" description="${s("profile.description")}" avatar={{ src: "/avatar.png" }} />
      </SidebarFooter>
    </Sidebar>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import { useState } from "react"
import { LayoutDashboardIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "@/components/ui/sidebar"

export function CollapsibleSidebar() {
  // Keep it in your layout state, or in a cookie, to remember it between pages.
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
      <SidebarHeader logo={<img src="/logo.svg" alt="${s("logo")}" className="h-7" />} />
      <SidebarContent>
        <SidebarGroup label="${s("groups.store")}">
          <SidebarItem icon={<LayoutDashboardIcon strokeWidth={1.5} />} label="${s("items.dashboard")}" href="/dashboard" />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.router")}>{`"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, ShoppingCartIcon } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarItem } from "@/components/ui/sidebar"

const links = [
  { href: "/dashboard", label: "${s("items.dashboard")}", icon: LayoutDashboardIcon },
  { href: "/orders", label: "${s("items.orders")}", icon: ShoppingCartIcon },
]

export function RouterSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup label="${s("groups.store")}">
          {links.map(({ href, label, icon: Icon }) => (
            <SidebarItem
              key={href}
              label={label}
              icon={<Icon strokeWidth={1.5} />}
              render={<Link href={href} />}
              selected={pathname === href}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.plan")}>{`import { CalendarIcon, LayoutDashboardIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarItem,
  SidebarPlanCard,
  SidebarProfile,
} from "@/components/ui/sidebar"

export function SidebarWithPlan() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup label="${s("groups.store")}">
          <SidebarItem icon={<LayoutDashboardIcon strokeWidth={1.5} />} label="${s("items.dashboard")}" href="/dashboard" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarPlanCard
        title="${s("plan.title")}"
        description="${s("plan.description")}"
        footer="${s("plan.footer")}"
        footerIcon={<CalendarIcon strokeWidth={1.5} />}
      />
      <SidebarFooter>
        <SidebarProfile name="${s("profile.name")}" description="${s("profile.description")}" />
      </SidebarFooter>
    </Sidebar>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
