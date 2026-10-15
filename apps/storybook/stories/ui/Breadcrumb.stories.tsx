import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import { FileIcon, FolderIcon, HouseIcon, SlashIcon, WorkflowIcon } from "lucide-react"
import { Badge } from "../../../../packages/fasla-ui/registry/ui/badge"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../packages/fasla-ui/registry/ui/breadcrumb"

/** Figma's `Style` axis. The two badge styles are compositions with Badge, not props. */
const STYLES = ["Default", "Custom Separator", "With Badge", "Outline Badge"] as const
/** Figma's `Count` axis. `+4` is the collapsed trail: the first step, the ellipsis, the last two. */
const COUNTS = ["2", "3", "4", "+4"] as const
const THEMES = ["light", "dark"] as const

type Style = (typeof STYLES)[number]
type Count = (typeof COUNTS)[number]

/**
 * The Default story's controls. Breadcrumb itself has no props for these:
 * each is a way of composing the parts, mirrored from Figma's axes so the
 * set can be walked through here.
 */
type StoryArgs = {
  style: Style
  count: Count
  hasIcon: boolean
}

const meta: Meta<StoryArgs> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    style: {
      control: "select",
      options: STYLES,
      description: "Figma `Style`. Custom Separator passes a `SlashIcon` to each `BreadcrumbSeparator`; the badge styles put a Soft or Outline `Badge` in each step.",
    },
    count: {
      control: "inline-radio",
      options: COUNTS,
      description: "Figma `Count`: how many steps are composed. `+4` keeps the first step and the last two, with `BreadcrumbEllipsis` between.",
    },
    hasIcon: {
      control: "boolean",
      description:
        "Figma `Has-Icon`: the `icon` prop on each `BreadcrumbLink` and `BreadcrumbPage`. In the badge styles, Badge's own `icon` instead: house, folder, file.",
    },
  },
  args: {
    style: "Default",
    count: "4",
    hasIcon: true,
  },
}

export default meta
type Story = StoryObj<StoryArgs>

/**
 * Sample copy, per script: Figma's own trail, and its badge trail. The
 * Arabic is Modern Standard Arabic, from design/content/, and matches the
 * docs page.
 */
const COPY = {
  ltr: {
    label: "Breadcrumb",
    crumbs: ["Home", "Projects", "Documents", "Add Document"],
    sections: ["Home", "Departments", "Marketing", "Digital Marketing"],
  },
  rtl: {
    label: "مسار التنقّل",
    crumbs: ["الرئيسية", "المشاريع", "المستندات", "إضافة مستند"],
    sections: ["الرئيسية", "الأقسام", "التسويق", "التسويق الإلكتروني"],
  },
} as const

type Copy = (typeof COPY)["ltr" | "rtl"]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

/** Figma's icons for the four steps: house, workflow, file, folder. */
const ICONS = [HouseIcon, WorkflowIcon, FileIcon, FolderIcon]

/** Which of the four steps each Count shows, by index; `null` is the ellipsis. */
const SHOWN: Record<Count, (number | null)[]> = {
  "2": [0, 3],
  "3": [0, 2, 3],
  "4": [0, 1, 2, 3],
  "+4": [0, null, 2, 3],
}

/**
 * The badge styles' icons, in Badge's own `icon` slot: the house first, a
 * folder for every step between, a file for the current page. Badge sizes
 * them to 12px; the 1.5 stroke is Badge's, as in its own stories.
 */
const badgeIcon = (i: number, last: boolean) => {
  const Icon = i === 0 ? HouseIcon : last ? FileIcon : FolderIcon
  return <Icon strokeWidth={1.5} />
}

/**
 * One trail, composed from the parts the way a developer would, for any Style × Count.
 * `hasIcon` defaults to Figma's set: on for the text styles, off for the badge
 * styles, whose Figma variants carry none. Passing it turns icons on or off
 * in every style.
 */
function Trail({
  c,
  style = "Default",
  count = "4",
  hasIcon,
}: {
  c: Copy
  style?: Style
  count?: Count
  hasIcon?: boolean
}) {
  const badge = style === "With Badge" ? "soft" : style === "Outline Badge" ? "outline" : null
  const words = badge ? c.sections : c.crumbs
  const shown = SHOWN[count]
  const icons = hasIcon ?? !badge

  return (
    <Breadcrumb aria-label={c.label}>
      <BreadcrumbList>
        {shown.map((step, i) => {
          const last = i === shown.length - 1
          const Icon = step === null ? undefined : ICONS[step]
          const icon = icons && !badge && Icon ? <Icon /> : undefined
          const chipIcon = icons && badge ? badgeIcon(i, last) : undefined
          const text = step === null ? "" : words[step]
          return (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator>{style === "Default" ? undefined : <SlashIcon />}</BreadcrumbSeparator>}
              <BreadcrumbItem>
                {step === null ? (
                  <BreadcrumbEllipsis />
                ) : badge ? (
                  last ? (
                    <BreadcrumbPage>
                      <Badge variant={badge} size="md" icon={chipIcon}>
                        {text}
                      </Badge>
                    </BreadcrumbPage>
                  ) : (
                    // Figma dims every step before the current page to 60%; the pill radius
                    // keeps the focus outline on the badge's own shape, at full strength.
                    <BreadcrumbLink href="#" className="rounded-full opacity-60 hover:opacity-100 focus-visible:opacity-100">
                      <Badge variant={badge} size="md" icon={chipIcon}>
                        {text}
                      </Badge>
                    </BreadcrumbLink>
                  )
                ) : last ? (
                  <BreadcrumbPage icon={icon}>{text}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#" icon={icon}>
                    {text}
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

/** A column header or panel title: Figma names, so English and left-to-right in both directions. */
const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit whitespace-nowrap font-sans text-xs text-muted-foreground", className].join(" ")}>
    {children}
  </span>
)

/**
 * A side row label: left-aligned in both directions, never wrapped, and a
 * full column gap from the trail beside it.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/**
 * Centres the story in its canvas in either direction, and scrolls it
 * sideways in the story's own direction when it is wider than the canvas (a
 * phone). 4px of padding keeps a link's focus outline clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

/** The playground: walk Figma's Style, Count and Has-Icon axes from the Controls panel. */
export const Default: Story = {
  render: (args, ctx) => <Trail c={copy(ctx)} {...args} />,
}

/**
 * Every Style at every Count, two styles side by side. Rows are Figma's
 * counts; `+4` keeps the first step and the last two, with the ellipsis
 * between them, in the same order in both directions.
 */
export const StylesAndCounts: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      // Two Count=4 trails side by side leave no room for a side label column
      // inside the Docs page's ~940px, so each Count is a caption over its
      // row. The 48px column gap keeps the two trails from reading as one.
      <div className="grid grid-cols-[repeat(2,max-content)] items-center gap-x-12 gap-y-2">
        {[STYLES.slice(0, 2), STYLES.slice(2)].map((pair, p) => (
          <React.Fragment key={p}>
            {pair.map((style) => (
              <Head key={style} className={p > 0 ? "pt-6" : undefined}>
                {style}
              </Head>
            ))}
            {COUNTS.map((count) => (
              <React.Fragment key={count}>
                <Head className="col-span-2 pt-2">Count={count}</Head>
                {pair.map((style) => (
                  <Trail key={style} c={c} style={style} count={count} />
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    )
  },
}

/** The styles with a row in the Icons story: the chevron trail and both badge styles. */
const ICON_STYLES = ["Default", "With Badge", "Outline Badge"] as const

/**
 * Figma's `Has-Icon`, on and off, at Count=3. In the text styles the icon is
 * 14px, 4px before its label, and set on `foreground` like the separators,
 * while the link labels are muted. In the badge styles it sits in Badge's own
 * icon slot (house, folder, file), sized and spaced by Badge md and coloured
 * with the badge's text; the dimmed steps dim their icon with them.
 */
export const Icons: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-8 gap-y-4">
        <span />
        <Head>Has-Icon=true</Head>
        <Head>Has-Icon=false</Head>
        {ICON_STYLES.map((style) => (
          <React.Fragment key={style}>
            <RowHead>{style}</RowHead>
            <Trail c={c} style={style} count="3" hasIcon />
            <Trail c={c} style={style} count="3" hasIcon={false} />
          </React.Fragment>
        ))}
      </div>
    )
  },
}

const PANELS = [
  { dir: "ltr", lang: "en", title: "LTR", copy: COPY.ltr },
  { dir: "rtl", lang: "ar", title: "RTL", copy: COPY.rtl },
] as const

/** The rows of the Directions panels: every Style, in full and collapsed. */
const PANEL_ROWS: { style: Style; count: Count }[] = STYLES.flatMap((style) => [
  { style, count: "4" as const },
  { style, count: "+4" as const },
])

/**
 * The Light And Dark rows: every Style at Count=3 and +4. Two English
 * Count=4 panels would not fit the Docs page side by side; the matrix above
 * and Directions show Count=4.
 */
const THEME_ROWS: { style: Style; count: Count }[] = STYLES.flatMap((style) => [
  { style, count: "3" as const },
  { style, count: "+4" as const },
])

/**
 * English and Arabic side by side, whatever the Direction toolbar says. The
 * trail runs from the inline start, the chevron turns to point along it, and
 * the icon stays before its label. Arabic rows are 24px tall against
 * English's 20px: Cairo's line, from the type ramp. Each panel is a subgrid
 * of the same rows, so the two sides share every row's top edge.
 */
export const Directions: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-[repeat(2,max-content)] gap-4">
      {PANELS.map((panel) => (
        <div
          key={panel.dir}
          dir={panel.dir}
          lang={panel.lang}
          className={[
            "row-span-9 grid grid-rows-subgrid items-center gap-y-4 rounded-lg border p-4",
            panel.dir === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{panel.title}</Head>
          {PANEL_ROWS.map(({ style, count }) => (
            <Trail key={style + count} c={panel.copy} style={style} count={count} />
          ))}
        </div>
      ))}
    </div>
  ),
}

/**
 * Light and Dark side by side, whatever the theme toolbar says. Language and
 * direction follow the Direction toolbar. Each panel's `light` or `dark`
 * class re-points every token for its subtree, on the Docs page too.
 */
export const LightAndDark: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="grid grid-cols-[repeat(2,max-content)] gap-4">
        {THEMES.map((theme) => (
          <div
            key={theme}
            className={[
              "row-span-9 grid grid-rows-subgrid items-center gap-y-4 rounded-lg border bg-background p-4 text-foreground",
              theme,
            ].join(" ")}
          >
            <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
            {THEME_ROWS.map(({ style, count }) => (
              <Trail key={style + count} c={c} style={style} count={count} />
            ))}
          </div>
        ))}
      </div>
    )
  },
}
