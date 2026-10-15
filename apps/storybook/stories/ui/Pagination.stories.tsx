import * as React from "react"
import type { Decorator, Meta, StoryObj } from "@storybook/react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../packages/fasla-ui/registry/ui/pagination"

const VARIANTS = ["default", "solid", "outlined"] as const
const SHAPES = ["square", "rounded"] as const
const SIZES = ["xs", "sm", "md", "lg"] as const
const THEMES = ["light", "dark"] as const

type Variant = (typeof VARIANTS)[number]
type Shape = (typeof SHAPES)[number]
type Size = (typeof SIZES)[number]
/** Figma's two booleans as one choice: `Next - Pre button`, `Next - Pre icon button`, or neither. */
type Steps = "text" | "icon" | "none"
/** Figma's four pages, or a long range with an ellipsis on each side. */
type Range = "short" | "long"

/**
 * The Default story's controls: Pagination's three props, and two ways of
 * composing the parts (Previous and Next, and the pages shown), mirrored from
 * Figma so the whole set can be walked through here. Behaviour props —
 * `aria-label`, `href`, `asChild`, `disabled`, `onClick` — are on the docs
 * site's Props tables.
 */
type StoryArgs = {
  variant: Variant
  shape: Shape
  size: Size
  steps: Steps
  range: Range
}

const meta: Meta<StoryArgs> = {
  title: "UI/Pagination",
  component: Pagination as unknown as React.ComponentType<StoryArgs>,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: VARIANTS,
      description:
        "Figma `Variants`. `default`: Ghost pages, a Solid current page. `solid`: Soft pages, a Solid current page. `outlined`: Outline pages, a Soft current page, Outline Previous and Next.",
      table: { type: { summary: '"default" | "solid" | "outlined"' }, defaultValue: { summary: '"default"' } },
    },
    shape: {
      control: "inline-radio",
      options: SHAPES,
      description: "Figma `Shape`: Button's standard radius, or its full radius.",
      table: { type: { summary: '"square" | "rounded"' }, defaultValue: { summary: '"square"' } },
    },
    size: {
      control: "inline-radio",
      options: SIZES,
      description: "Figma `size`: every part is 26, 32, 36 or 40px tall.",
      table: { type: { summary: '"xs" | "sm" | "md" | "lg"' }, defaultValue: { summary: '"md"' } },
    },
    steps: {
      control: "inline-radio",
      options: ["text", "icon", "none"],
      description:
        "Figma `Next - Pre button` (`text`) and `Next - Pre icon button` (`icon`): `PaginationPrevious` and `PaginationNext` with a label, with `iconOnly`, or left out.",
    },
    range: {
      control: "inline-radio",
      options: ["short", "long"],
      description: "Figma's pages 1 to 4, or a long range, 1 … 5 6 7 … 20, with `PaginationEllipsis` on each side.",
    },
  },
  args: {
    variant: "default",
    shape: "square",
    size: "md",
    steps: "text",
    range: "short",
  },
}

export default meta
type Story = StoryObj<StoryArgs>

const LABEL = { ltr: "Pagination", rtl: "التنقّل بين الصفحات" } as const
type StoryCtx = { globals: { direction?: string } }
const label = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? LABEL.rtl : LABEL.ltr)

/** Which pages each range shows, and the current one; `null` is the ellipsis. */
const RANGES: Record<Range, { pages: (number | null)[]; current: number }> = {
  short: { pages: [1, 2, 3, 4], current: 2 },
  long: { pages: [1, null, 5, 6, 7, null, 20], current: 6 },
}

/**
 * One row, composed from the parts the way a developer would. Numbers stay
 * Western in Arabic, and Previous and Next take their labels from the page's
 * language on their own.
 */
function Row({
  label,
  variant = "default",
  shape = "square",
  size = "md",
  steps = "text",
  range = "short",
  current,
  firstPage = false,
}: Partial<StoryArgs> & { label: string; current?: number; firstPage?: boolean }) {
  const { pages, current: rangeCurrent } = RANGES[range]
  const active = firstPage ? 1 : (current ?? rangeCurrent)
  return (
    <Pagination aria-label={label} variant={variant} shape={shape} size={size} className="w-auto">
      <PaginationContent>
        {steps !== "none" && (
          <PaginationItem>
            <PaginationPrevious href="#" iconOnly={steps === "icon"} disabled={active === 1} />
          </PaginationItem>
        )}
        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === null ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href="#" isActive={page === active}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        {steps !== "none" && (
          <PaginationItem>
            <PaginationNext href="#" iconOnly={steps === "icon"} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
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
 * full column gap from the row beside it.
 */
const RowHead = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="whitespace-nowrap text-left font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/**
 * Centres the story in its canvas in either direction, and scrolls it
 * sideways in the story's own direction when it is wider than the canvas (a
 * phone). 4px of padding keeps the focus ring clear of the clip.
 */
const framed: Decorator = (Story) => (
  <div data-story-frame className="overflow-x-auto">
    <div className="mx-auto w-max p-1">
      <Story />
    </div>
  </div>
)

const matrix: Pick<Story, "decorators" | "parameters"> = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { disable: true } },
}

/** The playground: walk Figma's Variants, Shape and size, and both kinds of Previous and Next. */
export const Default: Story = {
  render: (args, ctx) => <Row label={label(ctx)} {...args} />,
}

/** Every Variant in both Shapes, at md. Rounded is Button's full radius on every Button in the row. */
export const VariantsAndShapes: Story = {
  name: "Variants and Shapes",
  ...matrix,
  render: (_args, ctx) => (
    <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-8 gap-y-4">
      <span />
      {SHAPES.map((shape) => (
        <Head key={shape}>Shape={shape}</Head>
      ))}
      {VARIANTS.map((variant) => (
        <React.Fragment key={variant}>
          <RowHead>{variant}</RowHead>
          {SHAPES.map((shape) => (
            <Row key={shape} label={`${label(ctx)}: ${variant}, ${shape}`} variant={variant} shape={shape} />
          ))}
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * xs 26px, sm 32px, md 36px, lg 40px, with Previous and Next as text and as
 * icons alone. Page numbers are 14px at every size; the chevrons and the
 * ellipsis 16px.
 */
export const Sizes: Story = {
  ...matrix,
  render: (_args, ctx) => (
    <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-8 gap-y-4">
      <span />
      <Head>Next - Pre button</Head>
      <Head>Next - Pre icon button</Head>
      {SIZES.map((size) => (
        <React.Fragment key={size}>
          <RowHead>{size}</RowHead>
          <Row label={`${label(ctx)}: ${size}`} size={size} />
          <Row label={`${label(ctx)}: ${size}, icons`} size={size} steps="icon" />
        </React.Fragment>
      ))}
    </div>
  ),
}

/**
 * Previous and Next with a label (Figma `Next - Pre button`) and with the
 * chevron alone (`Next - Pre icon button`), whose label is kept for screen
 * readers. On the first page Previous is disabled: dimmed, out of the tab
 * order, and it ignores clicks.
 */
export const PreviousAndNext: Story = {
  name: "Previous and Next",
  ...matrix,
  render: (_args, ctx) => (
    <div className="grid grid-cols-[repeat(3,max-content)] items-center gap-x-8 gap-y-4">
      <span />
      <Head>Next - Pre button</Head>
      <Head>Next - Pre icon button</Head>
      {VARIANTS.map((variant) => (
        <React.Fragment key={variant}>
          <RowHead>{variant}</RowHead>
          <Row label={`${label(ctx)}: ${variant}`} variant={variant} />
          <Row label={`${label(ctx)}: ${variant}, icons`} variant={variant} steps="icon" />
        </React.Fragment>
      ))}
      <RowHead>first page</RowHead>
      <Row label={`${label(ctx)}: first page`} firstPage />
      <Row label={`${label(ctx)}: first page, icons`} steps="icon" firstPage />
    </div>
  ),
}

/**
 * A long range, 1 … 5 6 7 … 20: the first and last pages, the current page
 * with one on each side, and `PaginationEllipsis` where pages are left out.
 * The ellipsis is Icon Button's square, not a link.
 */
export const LongRange: Story = {
  ...matrix,
  render: (_args, ctx) => (
    <div className="grid grid-cols-[repeat(2,max-content)] items-center gap-x-8 gap-y-4">
      {VARIANTS.map((variant) => (
        <React.Fragment key={variant}>
          <RowHead>{variant}</RowHead>
          <Row label={`${label(ctx)}: ${variant}`} variant={variant} range="long" />
        </React.Fragment>
      ))}
      <RowHead>rounded</RowHead>
      <Row label={`${label(ctx)}: rounded`} variant="outlined" shape="rounded" range="long" />
    </div>
  ),
}

/** The page numbers from 1 to 20, and the current one: a live, controlled example. */
const TOTAL = 20

/** The pages to show around `current`: the first, the last, and one on each side of it. */
function pagesAround(current: number, total: number): (number | null)[] {
  const pages: (number | null)[] = []
  for (let page = 1; page <= total; page++) {
    const near = Math.abs(page - current) <= 1
    if (page === 1 || page === total || near) pages.push(page)
    else if (pages[pages.length - 1] !== null) pages.push(null)
  }
  return pages
}

/**
 * Pagination driven by state, as a table or a list would use it: each page
 * link is a `<button>` through `asChild`, and the range moves with the
 * current page. Previous is disabled on the first page and Next on the last.
 */
export const Controlled: Story = {
  decorators: [framed],
  parameters: { layout: "padded", controls: { include: ["variant", "shape", "size"] } },
  render: function Render({ variant, shape, size }, ctx) {
    const [current, setCurrent] = React.useState(6)
    const go = (page: number) => () => setCurrent(page)
    return (
      <Pagination aria-label={label(ctx)} variant={variant} shape={shape} size={size} className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild disabled={current === 1}>
              <button type="button" onClick={go(current - 1)} />
            </PaginationPrevious>
          </PaginationItem>
          {pagesAround(current, TOTAL).map((page, i) => (
            <PaginationItem key={page ?? `gap-${i}`}>
              {page === null ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink asChild isActive={page === current}>
                  <button type="button" onClick={go(page)}>
                    {page}
                  </button>
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext asChild disabled={current === TOTAL}>
              <button type="button" onClick={go(current + 1)} />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  },
}

const PANELS = [
  { dir: "ltr", lang: "en", title: "LTR", label: LABEL.ltr },
  { dir: "rtl", lang: "ar", title: "RTL", label: LABEL.rtl },
] as const

/**
 * English and Arabic side by side, whatever the Direction toolbar says. The
 * row runs from the inline start, Previous on the right in Arabic, and each
 * chevron turns to point outward. Labels read السابق and التالي; the numbers
 * stay Western. Each panel is a subgrid of the same rows, so the two sides
 * share every row's top edge.
 */
export const Directions: Story = {
  ...matrix,
  render: () => (
    <div className="grid grid-cols-[repeat(2,max-content)] gap-4">
      {PANELS.map((panel) => (
        <div
          key={panel.dir}
          dir={panel.dir}
          lang={panel.lang}
          className={[
            "row-span-5 grid grid-rows-subgrid items-center gap-y-4 rounded-lg border p-4",
            panel.dir === "rtl" ? "font-arabic" : "font-sans",
          ].join(" ")}
        >
          <Head>{panel.title}</Head>
          {VARIANTS.map((variant) => (
            <Row key={variant} label={`${panel.label}: ${variant}`} variant={variant} />
          ))}
          <Row label={`${panel.label}: icons`} variant="outlined" shape="rounded" steps="icon" range="long" />
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
  ...matrix,
  render: (_args, ctx) => (
    <div className="grid grid-cols-[repeat(2,max-content)] gap-4">
      {THEMES.map((theme) => (
        <div
          key={theme}
          className={[
            "row-span-7 grid grid-rows-subgrid items-center gap-y-4 rounded-lg border bg-background p-4 text-foreground",
            theme,
          ].join(" ")}
        >
          <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
          {VARIANTS.map((variant) =>
            SHAPES.map((shape) => (
              <Row
                key={variant + shape}
                label={`${label(ctx)}: ${variant}, ${shape}`}
                variant={variant}
                shape={shape}
              />
            ))
          )}
        </div>
      ))}
    </div>
  ),
}
