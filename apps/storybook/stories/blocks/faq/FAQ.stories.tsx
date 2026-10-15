import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { FaqAccentActiveCard, faqAccentActiveCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-accent-active-card/FaqAccentActiveCard"
import { FaqClassicCentered, faqClassicCenteredCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-classic-centered/FaqClassicCentered"
import { FaqDarkPanel, faqDarkPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-dark-panel/FaqDarkPanel"
import { FaqFeaturedQuestion, faqFeaturedQuestionCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-featured-question/FaqFeaturedQuestion"
import { FaqMonoIndex, faqMonoIndexCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-mono-index/FaqMonoIndex"
import { FaqNumberedEditorial, faqNumberedEditorialCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-numbered-editorial/FaqNumberedEditorial"
import { FaqSoftFilledRows, faqSoftFilledRowsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-soft-filled-rows/FaqSoftFilledRows"
import { FaqTableCompact, faqTableCompactCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-table-compact/FaqTableCompact"
import { FaqUppercaseDense, faqUppercaseDenseCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-uppercase-dense/FaqUppercaseDense"
import { FaqSplitSticky, faqSplitStickyCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-split-sticky/FaqSplitSticky"
import { FaqTwoColumnGrid, faqTwoColumnGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-two-column-grid/FaqTwoColumnGrid"
import { FaqMasonryCards, faqMasonryCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-masonry-cards/FaqMasonryCards"
import { FaqCategoryColumns, faqCategoryColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-category-columns/FaqCategoryColumns"
import { FaqGroupedSections, faqGroupedSectionsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-grouped-sections/FaqGroupedSections"
import { FaqMediaSplit, faqMediaSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-media-split/FaqMediaSplit"
import { FaqSearchCategories, faqSearchCategoriesCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-search-categories/FaqSearchCategories"
import { FaqTabsByTopic, faqTabsByTopicCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-tabs-by-topic/FaqTabsByTopic"
import { FaqSidebarNav, faqSidebarNavCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-sidebar-nav/FaqSidebarNav"
import { FaqCategoryChipGrid, faqCategoryChipGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-category-chip-grid/FaqCategoryChipGrid"
import { FaqTopicTiles, faqTopicTilesCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-topic-tiles/FaqTopicTiles"
import { FaqHelpHeroPopular, faqHelpHeroPopularCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-help-hero-popular/FaqHelpHeroPopular"
import { FaqContactCtaCard, faqContactCtaCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-contact-cta-card/FaqContactCtaCard"
import { FaqSupportChannels, faqSupportChannelsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-support-channels/FaqSupportChannels"
import { FaqNewsletterClose, faqNewsletterCloseCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-newsletter-close/FaqNewsletterClose"
import { FaqSupportStats, faqSupportStatsCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-support-stats/FaqSupportStats"
import { FaqChatThread, faqChatThreadCopy } from "../../../../../packages/fasla-ui/registry/blocks/faq-chat-thread/FaqChatThread"
import { faqViewports, faqArgTypes, localeOf, withForeignTheme } from "./faq-story-kit"

/**
 * FAQ: the 26 Types of the Figma set, one block each. They are in Figma's
 * families: the question lists, the layouts that arrange the questions around
 * something else, the navigation and search blocks, and the ways to reach
 * support. Each Type's extra states follow it. Viewport, direction and theme
 * come from the toolbar.
 */
/*
 * The sidebar and the Docs page list the 26 Figma Types only. The extra
 * states (a theme without the inverse tokens, keyboard focus, empty, error
 * and disabled) are tagged `!dev` and `!autodocs`: hidden from both, but
 * still built, so tests and visual checks reach them by id. The tags are
 * written out on each story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/FAQ",
  parameters: { layout: "fullscreen", viewport: { viewports: faqViewports } },
  tags: ["autodocs"],
}

export default meta

// Lists

export const ClassicCentered: StoryObj<typeof FaqClassicCentered> = {
  name: "Classic Centered",
  argTypes: faqArgTypes(FaqClassicCentered, faqClassicCenteredCopy),
  render: (args, context) => <FaqClassicCentered locale={localeOf(context)} {...args} />,
}

export const AccentActiveCard: StoryObj<typeof FaqAccentActiveCard> = {
  name: "Accent Active Card",
  argTypes: faqArgTypes(FaqAccentActiveCard, faqAccentActiveCardCopy),
  render: (args, context) => <FaqAccentActiveCard locale={localeOf(context)} {...args} />,
}

export const SoftFilledRows: StoryObj<typeof FaqSoftFilledRows> = {
  name: "Soft Filled Rows",
  argTypes: faqArgTypes(FaqSoftFilledRows, faqSoftFilledRowsCopy),
  render: (args, context) => <FaqSoftFilledRows locale={localeOf(context)} {...args} />,
}

export const NumberedEditorial: StoryObj<typeof FaqNumberedEditorial> = {
  name: "Numbered Editorial",
  argTypes: faqArgTypes(FaqNumberedEditorial, faqNumberedEditorialCopy),
  render: (args, context) => <FaqNumberedEditorial locale={localeOf(context)} {...args} />,
}

export const DarkPanel: StoryObj<typeof FaqDarkPanel> = {
  name: "Dark Panel",
  argTypes: faqArgTypes(FaqDarkPanel, faqDarkPanelCopy),
  render: (args, context) => <FaqDarkPanel locale={localeOf(context)} {...args} />,
}

/**
 * In a theme without the inverse tokens, the mapping falls back to the page
 * colours swapped, so the panel still reads.
 */
export const DarkPanelForeignTheme: StoryObj<typeof FaqDarkPanel> = {
  tags: ["!dev", "!autodocs"],
  ...DarkPanel,
  name: "Dark Panel: Theme without inverse tokens",
  decorators: [withForeignTheme],
}

/** Keyboard focus on the panel: the ring is drawn in the inverse foreground. */
export const DarkPanelFocus: StoryObj<typeof FaqDarkPanel> = {
  tags: ["!dev", "!autodocs"],
  ...DarkPanel,
  name: "Dark Panel: Keyboard focus",
  parameters: { pseudo: { focusVisible: ["[data-slot=accordion-item]:nth-child(2) [data-slot=accordion-trigger]"] } },
}

export const MonoIndex: StoryObj<typeof FaqMonoIndex> = {
  name: "Mono Index",
  argTypes: faqArgTypes(FaqMonoIndex, faqMonoIndexCopy),
  render: (args, context) => <FaqMonoIndex locale={localeOf(context)} {...args} />,
}

/**
 * In a theme without the inverse tokens, the mapping falls back to the page
 * colours swapped, so the band still reads.
 */
export const MonoIndexForeignTheme: StoryObj<typeof FaqMonoIndex> = {
  tags: ["!dev", "!autodocs"],
  ...MonoIndex,
  name: "Mono Index: Theme without inverse tokens",
  decorators: [withForeignTheme],
}

/** Keyboard focus on the band: the ring is drawn in the inverse foreground. */
export const MonoIndexFocus: StoryObj<typeof FaqMonoIndex> = {
  tags: ["!dev", "!autodocs"],
  ...MonoIndex,
  name: "Mono Index: Keyboard focus",
  parameters: { pseudo: { focusVisible: ["[data-slot=accordion-item]:nth-child(2) [data-slot=accordion-trigger]"] } },
}

export const UppercaseDense: StoryObj<typeof FaqUppercaseDense> = {
  name: "Uppercase Dense",
  argTypes: faqArgTypes(FaqUppercaseDense, faqUppercaseDenseCopy),
  render: (args, context) => <FaqUppercaseDense locale={localeOf(context)} {...args} />,
}

export const TableCompact: StoryObj<typeof FaqTableCompact> = {
  name: "Table Compact",
  argTypes: faqArgTypes(FaqTableCompact, faqTableCompactCopy),
  render: (args, context) => <FaqTableCompact locale={localeOf(context)} {...args} />,
}

export const FeaturedQuestion: StoryObj<typeof FaqFeaturedQuestion> = {
  name: "Featured Question",
  argTypes: faqArgTypes(FaqFeaturedQuestion, faqFeaturedQuestionCopy),
  render: (args, context) => <FaqFeaturedQuestion locale={localeOf(context)} {...args} />,
}

// Layouts

export const SplitSticky: StoryObj<typeof FaqSplitSticky> = {
  name: "Split Sticky",
  argTypes: faqArgTypes(FaqSplitSticky, faqSplitStickyCopy),
  render: (args, context) => <FaqSplitSticky locale={localeOf(context)} {...args} />,
}

export const TwoColumnGrid: StoryObj<typeof FaqTwoColumnGrid> = {
  name: "Two-Column Grid",
  argTypes: faqArgTypes(FaqTwoColumnGrid, faqTwoColumnGridCopy),
  render: (args, context) => <FaqTwoColumnGrid locale={localeOf(context)} {...args} />,
}

export const MasonryCards: StoryObj<typeof FaqMasonryCards> = {
  name: "Masonry Cards",
  argTypes: faqArgTypes(FaqMasonryCards, faqMasonryCardsCopy),
  render: (args, context) => <FaqMasonryCards locale={localeOf(context)} {...args} />,
}

export const CategoryColumns: StoryObj<typeof FaqCategoryColumns> = {
  name: "Category Columns",
  argTypes: faqArgTypes(FaqCategoryColumns, faqCategoryColumnsCopy),
  render: (args, context) => <FaqCategoryColumns locale={localeOf(context)} {...args} />,
}

export const GroupedSections: StoryObj<typeof FaqGroupedSections> = {
  name: "Grouped Sections",
  argTypes: faqArgTypes(FaqGroupedSections, faqGroupedSectionsCopy),
  render: (args, context) => <FaqGroupedSections locale={localeOf(context)} {...args} />,
}

/** The photo is Figma's, from the docs site's public folder; the block ships without one. */
export const MediaSplit: StoryObj<typeof FaqMediaSplit> = {
  name: "Media Split",
  argTypes: faqArgTypes(FaqMediaSplit, faqMediaSplitCopy),
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
  tags: ["!dev", "!autodocs"],
  name: "Media Split: No image",
  argTypes: faqArgTypes(FaqMediaSplit, faqMediaSplitCopy),
  render: (args, context) => <FaqMediaSplit locale={localeOf(context)} {...args} />,
}

// Navigation and search

/** Type in the field or press a chip: the questions filter as you go. */
export const SearchCategories: StoryObj<typeof FaqSearchCategories> = {
  name: "Search + Categories",
  argTypes: faqArgTypes(FaqSearchCategories, faqSearchCategoriesCopy),
  render: (args, context) => <FaqSearchCategories locale={localeOf(context)} {...args} />,
}

/** Nothing matches the search: the list gives way to a message naming it. */
export const SearchCategoriesNoResults: StoryObj<typeof FaqSearchCategories> = {
  tags: ["!dev", "!autodocs"],
  ...SearchCategories,
  name: "Search + Categories: No results",
  args: { defaultQuery: "pricing in yen" },
}

export const TabsByTopic: StoryObj<typeof FaqTabsByTopic> = {
  name: "Tabs by Topic",
  argTypes: faqArgTypes(FaqTabsByTopic, faqTabsByTopicCopy),
  render: (args, context) => <FaqTabsByTopic locale={localeOf(context)} {...args} />,
}

/** The topics are vertical tabs: Up and Down move through them. */
export const SidebarNav: StoryObj<typeof FaqSidebarNav> = {
  name: "Sidebar Nav",
  argTypes: faqArgTypes(FaqSidebarNav, faqSidebarNavCopy),
  render: (args, context) => <FaqSidebarNav locale={localeOf(context)} {...args} />,
}

/** As in Figma, Getting started is pressed and its questions show below. */
export const CategoryChipGrid: StoryObj<typeof FaqCategoryChipGrid> = {
  name: "Category Chip Grid",
  argTypes: faqArgTypes(FaqCategoryChipGrid, faqCategoryChipGridCopy),
  args: { onCategoryChange: fn() },
  render: (args, context) => <FaqCategoryChipGrid locale={localeOf(context)} {...args} />,
}

/** No chip pressed: the heading and the chips alone. */
export const CategoryChipGridNonePressed: StoryObj<typeof FaqCategoryChipGrid> = {
  tags: ["!dev", "!autodocs"],
  ...CategoryChipGrid,
  name: "Category Chip Grid: None pressed",
  args: { onCategoryChange: fn(), defaultCategory: null },
}

export const TopicTiles: StoryObj<typeof FaqTopicTiles> = {
  name: "Topic Tiles",
  argTypes: faqArgTypes(FaqTopicTiles, faqTopicTilesCopy),
  render: (args, context) => <FaqTopicTiles locale={localeOf(context)} {...args} />,
}

/** Press Enter in the field, or choose a popular search: `onSearch` gets the query. */
export const HelpHeroPopular: StoryObj<typeof FaqHelpHeroPopular> = {
  name: "Help Hero + Popular",
  argTypes: faqArgTypes(FaqHelpHeroPopular, faqHelpHeroPopularCopy),
  args: { onSearch: fn() },
  render: (args, context) => <FaqHelpHeroPopular locale={localeOf(context)} {...args} />,
}

// Support and contact

/** The blocks ship no photos. These are Figma's, from apps/docs/public. */
const PEOPLE = {
  en: [
    { name: "Layla Haddad", src: "/blocks/faq/avatar-1.jpg" },
    { name: "Omar Khalil", src: "/blocks/faq/avatar-2.jpg" },
    { name: "Sara Mansour", src: "/blocks/faq/avatar-3.jpg" },
  ],
  ar: [
    { name: "ليلى حداد", src: "/blocks/faq/avatar-1.jpg" },
    { name: "عمر خليل", src: "/blocks/faq/avatar-2.jpg" },
    { name: "سارة منصور", src: "/blocks/faq/avatar-3.jpg" },
  ],
}

/** Settles after a moment, so the pending state shows. */
const later = (fail = false) => () =>
  new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new Error("Failed")) : resolve()), 1200))

export const ContactCtaCard: StoryObj<typeof FaqContactCtaCard> = {
  name: "Contact CTA Card",
  argTypes: faqArgTypes(FaqContactCtaCard, faqContactCtaCardCopy),
  render: (args, context) => (
    <FaqContactCtaCard locale={localeOf(context)} people={PEOPLE[localeOf(context)]} {...args} />
  ),
}

export const SupportChannels: StoryObj<typeof FaqSupportChannels> = {
  name: "Support Channels",
  argTypes: faqArgTypes(FaqSupportChannels, faqSupportChannelsCopy),
  render: (args, context) => <FaqSupportChannels locale={localeOf(context)} {...args} />,
}

/** Subscribe shows the button's loading state, then the success line. */
export const NewsletterClose: StoryObj<typeof FaqNewsletterClose> = {
  name: "Newsletter Close",
  argTypes: faqArgTypes(FaqNewsletterClose, faqNewsletterCloseCopy),
  render: (args, context) => <FaqNewsletterClose locale={localeOf(context)} {...args} onSubmit={later()} />,
}

/** The sign-up fails: the error line shows and the form keeps what was typed. */
export const NewsletterCloseError: StoryObj<typeof FaqNewsletterClose> = {
  tags: ["!dev", "!autodocs"],
  ...NewsletterClose,
  name: "Newsletter Close: Sign-up fails",
  render: (args, context) => <FaqNewsletterClose locale={localeOf(context)} {...args} onSubmit={later(true)} />,
}

/** The sign-up is turned off. */
export const NewsletterCloseDisabled: StoryObj<typeof FaqNewsletterClose> = {
  tags: ["!dev", "!autodocs"],
  ...NewsletterClose,
  name: "Newsletter Close: Disabled",
  args: { disabled: true },
}

export const SupportStats: StoryObj<typeof FaqSupportStats> = {
  name: "Support Stats",
  argTypes: faqArgTypes(FaqSupportStats, faqSupportStatsCopy),
  render: (args, context) => <FaqSupportStats locale={localeOf(context)} {...args} />,
}

/** Send stays disabled until something is typed, then loads while the question is sent. */
export const ChatThread: StoryObj<typeof FaqChatThread> = {
  name: "Chat Thread",
  argTypes: faqArgTypes(FaqChatThread, faqChatThreadCopy),
  render: (args, context) => (
    <FaqChatThread
      locale={localeOf(context)}
      supportAvatar="/blocks/faq/avatar-support.png"
      {...args}
      onSend={later()}
    />
  ),
}

/** No messages yet: the empty line takes the thread's place. */
export const ChatThreadEmpty: StoryObj<typeof FaqChatThread> = {
  tags: ["!dev", "!autodocs"],
  ...ChatThread,
  name: "Chat Thread: Empty",
  args: { messages: [] },
}
