import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { FaqSearchCategories } from "../../../../../packages/fasla-ui/registry/blocks/faq-search-categories/FaqSearchCategories"
import { FaqTabsByTopic } from "../../../../../packages/fasla-ui/registry/blocks/faq-tabs-by-topic/FaqTabsByTopic"
import { FaqSidebarNav } from "../../../../../packages/fasla-ui/registry/blocks/faq-sidebar-nav/FaqSidebarNav"
import { FaqCategoryChipGrid } from "../../../../../packages/fasla-ui/registry/blocks/faq-category-chip-grid/FaqCategoryChipGrid"
import { FaqTopicTiles } from "../../../../../packages/fasla-ui/registry/blocks/faq-topic-tiles/FaqTopicTiles"
import { FaqHelpHeroPopular } from "../../../../../packages/fasla-ui/registry/blocks/faq-help-hero-popular/FaqHelpHeroPopular"
import { faqViewports, hiddenArgTypes, localeOf } from "./faq-story-kit"

/**
 * The FAQ blocks that help a reader find the question: search, tabs, a
 * sidebar, chips and topic tiles. Viewport, direction and theme come from
 * the toolbar.
 */
const meta: Meta = {
  title: "Blocks/FAQ/Navigation and search",
  parameters: { layout: "fullscreen", viewport: { viewports: faqViewports } },
  tags: ["autodocs"],
}

export default meta

/** Type in the field or press a chip: the questions filter as you go. */
export const SearchCategories: StoryObj<typeof FaqSearchCategories> = {
  name: "Search + Categories",
  argTypes: { ...hiddenArgTypes, noResults: { table: { disable: true } }, resultCount: { table: { disable: true } } },
  render: (args, context) => <FaqSearchCategories locale={localeOf(context)} {...args} />,
}

/** Nothing matches the search: the list gives way to a message naming it. */
export const SearchCategoriesNoResults: StoryObj<typeof FaqSearchCategories> = {
  ...SearchCategories,
  name: "Search + Categories: No results",
  args: { defaultQuery: "pricing in yen" },
}

export const TabsByTopic: StoryObj<typeof FaqTabsByTopic> = {
  name: "Tabs by Topic",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqTabsByTopic locale={localeOf(context)} {...args} />,
}

/** The topics are vertical tabs: Up and Down move through them. */
export const SidebarNav: StoryObj<typeof FaqSidebarNav> = {
  name: "Sidebar Nav",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqSidebarNav locale={localeOf(context)} {...args} />,
}

/** As in Figma, no chip is pressed. Press one to see its questions. */
export const CategoryChipGrid: StoryObj<typeof FaqCategoryChipGrid> = {
  name: "Category Chip Grid",
  argTypes: hiddenArgTypes,
  args: { onCategoryChange: fn() },
  render: (args, context) => <FaqCategoryChipGrid locale={localeOf(context)} {...args} />,
}

/** A chip pressed: the selected filter, and its questions below. */
export const CategoryChipGridPressed: StoryObj<typeof FaqCategoryChipGrid> = {
  ...CategoryChipGrid,
  name: "Category Chip Grid: Pressed",
  args: { onCategoryChange: fn(), defaultCategory: "theming" },
}

export const TopicTiles: StoryObj<typeof FaqTopicTiles> = {
  name: "Topic Tiles",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqTopicTiles locale={localeOf(context)} {...args} />,
}

/** Press Enter in the field, or choose a popular search: `onSearch` gets the query. */
export const HelpHeroPopular: StoryObj<typeof FaqHelpHeroPopular> = {
  name: "Help Hero + Popular",
  argTypes: hiddenArgTypes,
  args: { onSearch: fn() },
  render: (args, context) => <FaqHelpHeroPopular locale={localeOf(context)} {...args} />,
}
