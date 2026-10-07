import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { ImageIcon } from "lucide-react"
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonListItem,
  SkeletonCard,
} from "../../../../packages/fasla-ui/registry/ui/skeleton"

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "circular", "rectangular"] },
    animate: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Skeleton>

/**
 * Sample copy, per script, for the stories that show real content beside the
 * skeleton. The skeleton itself has no text.
 *
 * Only the *rendered values* change — prop names stay English everywhere. The
 * Arabic follows design/content/: real situations, never placeholders.
 */
const COPY = {
  ltr: {
    comments: "Comments",
    person: { initial: "L", name: "Layla Hassan", comment: "Shared the final draft for review" },
    paragraph: "Your order ships within two working days of payment.",
    cardTitle: "Autumn reading list",
    cardBody: "Twelve books for the cooler months",
    orders: "Recent orders",
  },
  rtl: {
    comments: "التعليقات",
    person: { initial: "ل", name: "ليلى حسن", comment: "شاركتُ المسودة النهائية للمراجعة" },
    paragraph: "يُشحن طلبك خلال يومَي عمل من تاريخ الدفع.",
    cardTitle: "قائمة قراءة الخريف",
    cardBody: "اثنا عشر كتابًا للأشهر الباردة",
    orders: "الطلبات الأخيرة",
  },
} as const

type Copy = (typeof COPY)[keyof typeof COPY]
type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx): Copy =>
  ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr

const VARIANTS = ["default", "circular", "rectangular"] as const

/** Figma's sizes: text and card are 210px wide, the list item 373px. */
const TEXT_WIDTH = "w-[210px]"
const LIST_ITEM_WIDTH = "w-[373px]"

const Head = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="w-fit font-sans text-xs text-muted-foreground">
    {children}
  </span>
)

/** Every control in the Controls panel drives this one: a 16px bar. */
export const Default: Story = {
  args: { className: "h-4 w-48" },
}

/** `variant` sets the shape: a 4px-radius bar, a circle, or square corners. */
export const Variants: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-start gap-3">
          <Skeleton
            variant={variant}
            className={variant === "circular" ? "h-12 w-12" : "h-12 w-24"}
          />
          <Head>{variant}</Head>
        </div>
      ))}
    </div>
  ),
}

/** `animate={false}` on every shape and composition: no pulse at all. */
export const NoAnimation: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Skeleton animate={false} className="h-4 w-48" />
      <SkeletonListItem animate={false} className={LIST_ITEM_WIDTH} />
      <SkeletonCard animate={false} className={TEXT_WIDTH} />
    </div>
  ),
}

/** Figma's Text: full-width 16px lines, 8px apart. 2 by default; `lines` sets more. */
export const Text: Story = {
  render: () => (
    <div className="flex items-start gap-10">
      <div className="flex flex-col gap-3">
        <Head>default · 2 lines</Head>
        <SkeletonText className={TEXT_WIDTH} />
      </div>
      <div className="flex flex-col gap-3">
        <Head>lines = 4</Head>
        <SkeletonText lines={4} className={TEXT_WIDTH} />
      </div>
    </div>
  ),
}

/** A 48px circle by default; `className` resizes it. */
export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SkeletonAvatar />
      <SkeletonAvatar className="h-16 w-16" />
    </div>
  ),
}

/**
 * Figma's List item (formerly Default): a 48px circle at the inline start,
 * then 2 lines, 16px apart. Flip the Direction toolbar: the circle moves to
 * the right with the line, from layout alone.
 */
export const ListItem: Story = {
  render: () => <SkeletonListItem className={LIST_ITEM_WIDTH} />,
}

/** Figma's Card: a 122px media block, then 2 lines, with no card surface. */
export const Card: Story = {
  render: () => <SkeletonCard className={TEXT_WIDTH} />,
}

/**
 * Every variant in the Figma set, for the direction on the toolbar.
 *
 * Figma's axes are Direction × State: List item in LTR and RTL, and Card and
 * Text, which are the same in both (`Both`). Each cell is at Figma's own size.
 * Flip the Direction toolbar for the RTL List item; Card and Text must not
 * change. The axis names stay English in both directions — they are Figma
 * identifiers, not sample copy.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-start gap-12">
      <div className="flex flex-col gap-3">
        <Head>State = List item</Head>
        <SkeletonListItem className={LIST_ITEM_WIDTH} />
      </div>
      <div className="flex flex-col gap-3">
        <Head>State = Card</Head>
        <SkeletonCard className={TEXT_WIDTH} />
      </div>
      <div className="flex flex-col gap-3">
        <Head>State = Text</Head>
        <SkeletonText className={TEXT_WIDTH} />
      </div>
    </div>
  ),
}

const THEMES = ["light", "dark"] as const

/**
 * Light and Dark side by side, whatever the theme toolbar says. Direction
 * follows the Direction toolbar, like every other story.
 *
 * Each panel sets its own theme: the `light` or `dark` class re-points every
 * token for that subtree, so `secondary` takes each mode's value, on the
 * canvas and on the Docs page.
 */
export const LightAndDark: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid gap-4 xl:grid-cols-2">
      {THEMES.map((theme) => (
        <div
          key={theme}
          className={[
            "space-y-6 rounded-lg border bg-background p-6 text-foreground",
            theme,
          ].join(" ")}
        >
          <Head>{theme === "dark" ? "Dark" : "Light"}</Head>
          <div className="flex flex-wrap items-end gap-6">
            {VARIANTS.map((variant) => (
              <Skeleton
                key={variant}
                variant={variant}
                className={variant === "circular" ? "h-12 w-12" : "h-12 w-24"}
              />
            ))}
          </div>
          <SkeletonListItem className={LIST_ITEM_WIDTH} />
          <div className="flex flex-wrap items-start gap-6">
            <SkeletonCard className={TEXT_WIDTH} />
            <SkeletonText className={TEXT_WIDTH} />
          </div>
        </div>
      ))}
    </div>
  ),
}

/** A stand-in for a 48px avatar photo: an initial on `muted`. */
const Initial = ({ children }: { children: React.ReactNode }) => (
  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium text-muted-foreground">
    {children}
  </span>
)

/**
 * Each skeleton beside the content it stands for, at the same width, so the
 * sizes can be compared. In English the text is 20px a line, so two lines are
 * the skeleton's 40px; flip the Direction toolbar to see how Arabic's taller
 * leading compares.
 */
export const WithContent: Story = {
  parameters: { layout: "padded" },
  render: (_args, ctx) => {
    const c = copy(ctx)
    const pair = (label: string, skeleton: React.ReactNode, content: React.ReactNode) => (
      <div className="flex flex-col gap-3">
        <Head>{label}</Head>
        <div className="flex flex-wrap items-start gap-8">
          <div className="outline-dashed outline-1 outline-border">{skeleton}</div>
          <div className="outline-dashed outline-1 outline-border">{content}</div>
        </div>
      </div>
    )
    return (
      <div className="flex flex-col gap-10">
        {pair(
          "List item",
          <SkeletonListItem className={LIST_ITEM_WIDTH} />,
          <div className={`flex items-center gap-4 ${LIST_ITEM_WIDTH}`}>
            <Initial>{c.person.initial}</Initial>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{c.person.name}</p>
              <p className="text-sm text-muted-foreground">{c.person.comment}</p>
            </div>
          </div>
        )}
        {pair(
          "Card",
          <SkeletonCard className={TEXT_WIDTH} />,
          <div className={`flex flex-col gap-4 ${TEXT_WIDTH}`}>
            <div className="flex h-[122px] items-center justify-center rounded bg-muted text-muted-foreground">
              <ImageIcon aria-hidden="true" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium">{c.cardTitle}</p>
              <p className="text-sm text-muted-foreground">{c.cardBody}</p>
            </div>
          </div>
        )}
        {pair(
          "Text",
          <SkeletonText className={TEXT_WIDTH} />,
          <p className={`text-sm ${TEXT_WIDTH}`}>{c.paragraph}</p>
        )}
      </div>
    )
  },
}

/**
 * The pattern the docs recommend: the blocks are `aria-hidden`, and the region
 * that is loading says so with `aria-busy`. Inspect it with the a11y panel.
 */
export const LoadingRegion: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <section
        aria-busy="true"
        aria-labelledby="skeleton-story-comments"
        className={`flex flex-col gap-4 ${LIST_ITEM_WIDTH}`}
      >
        <h3 id="skeleton-story-comments" className="text-sm font-medium">
          {c.comments}
        </h3>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </section>
    )
  },
}

/** A table loading: plain blocks sized per column, in a busy region. */
export const TableLoading: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <section aria-busy="true" aria-label={c.orders} className="flex w-[400px] flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </section>
    )
  },
}
