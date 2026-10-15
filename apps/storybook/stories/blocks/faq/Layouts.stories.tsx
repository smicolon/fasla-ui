import type { Meta, StoryObj } from "@storybook/react"
import { FaqSplitSticky } from "../../../../../packages/fasla-ui/registry/blocks/faq-split-sticky/FaqSplitSticky"
import { FaqTwoColumnGrid } from "../../../../../packages/fasla-ui/registry/blocks/faq-two-column-grid/FaqTwoColumnGrid"
import { FaqMasonryCards } from "../../../../../packages/fasla-ui/registry/blocks/faq-masonry-cards/FaqMasonryCards"
import { FaqCategoryColumns } from "../../../../../packages/fasla-ui/registry/blocks/faq-category-columns/FaqCategoryColumns"
import { FaqGroupedSections } from "../../../../../packages/fasla-ui/registry/blocks/faq-grouped-sections/FaqGroupedSections"
import { FaqMediaSplit } from "../../../../../packages/fasla-ui/registry/blocks/faq-media-split/FaqMediaSplit"
import { faqViewports, hiddenArgTypes, localeOf } from "./faq-story-kit"

/**
 * The FAQ blocks that arrange the questions around something else: an intro,
 * a second column, topic groups or a photo. Viewport, direction and theme
 * come from the toolbar.
 */
const meta: Meta = {
  title: "Blocks/FAQ/Layouts",
  parameters: { layout: "fullscreen", viewport: { viewports: faqViewports } },
  tags: ["autodocs"],
}

export default meta

export const SplitSticky: StoryObj<typeof FaqSplitSticky> = {
  name: "Split Sticky",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqSplitSticky locale={localeOf(context)} {...args} />,
}

export const TwoColumnGrid: StoryObj<typeof FaqTwoColumnGrid> = {
  name: "Two-Column Grid",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqTwoColumnGrid locale={localeOf(context)} {...args} />,
}

export const MasonryCards: StoryObj<typeof FaqMasonryCards> = {
  name: "Masonry Cards",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqMasonryCards locale={localeOf(context)} {...args} />,
}

export const CategoryColumns: StoryObj<typeof FaqCategoryColumns> = {
  name: "Category Columns",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqCategoryColumns locale={localeOf(context)} {...args} />,
}

export const GroupedSections: StoryObj<typeof FaqGroupedSections> = {
  name: "Grouped Sections",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqGroupedSections locale={localeOf(context)} {...args} />,
}

/** The photo is Figma's, from the docs site's public folder; the block ships without one. */
export const MediaSplit: StoryObj<typeof FaqMediaSplit> = {
  name: "Media Split",
  argTypes: hiddenArgTypes,
  render: (args, context) => (
    <FaqMediaSplit
      locale={localeOf(context)}
      image={{
        src: "/blocks/faq/media-split.jpg",
        alt: localeOf(context) === "ar" ? "شخصان من فريق الدعم يعملان على حاسوبيهما" : "Two support specialists working at their laptops",
      }}
      {...args}
    />
  ),
}

/** Without `image`, the frame is a token-coloured placeholder of the same size. */
export const MediaSplitNoImage: StoryObj<typeof FaqMediaSplit> = {
  name: "Media Split: No image",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqMediaSplit locale={localeOf(context)} {...args} />,
}
