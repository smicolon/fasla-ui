import type { Meta, StoryObj } from "@storybook/react"
import { BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-classic-3-up-grid/BlogCardsClassic3UpGrid"
import { BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-featured-two-up/BlogCardsFeaturedTwoUp"
import { BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-compact-4-up-thumb-grid/BlogCardsCompact4UpThumbGrid"
import { BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-bento-editorial-grid/BlogCardsBentoEditorialGrid"
import { BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-overlay-photo-trio/BlogCardsOverlayPhotoTrio"
import { BlogCardsLeftThumbRowCards, blogCardsLeftThumbRowCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-left-thumb-row-cards/BlogCardsLeftThumbRowCards"
import { BlogCardsHairlineTextIndex, blogCardsHairlineTextIndexCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-hairline-text-index/BlogCardsHairlineTextIndex"
import { BlogCardsNumberedReadingList, blogCardsNumberedReadingListCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-numbered-reading-list/BlogCardsNumberedReadingList"
import { BlogCardsLatestPopularSplit, blogCardsLatestPopularSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-latest-popular-split/BlogCardsLatestPopularSplit"
import { BlogCardsJournalBento, blogCardsJournalBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-journal-bento/BlogCardsJournalBento"
import { BlogCardsSplitFeature, blogCardsSplitFeatureCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-split-feature/BlogCardsSplitFeature"
import { BlogCardsLeadRankedPicks, blogCardsLeadRankedPicksCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-lead-ranked-picks/BlogCardsLeadRankedPicks"
import { BlogCardsDarkEditorialFeature, blogCardsDarkEditorialFeatureCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-dark-editorial-feature/BlogCardsDarkEditorialFeature"
import { BlogCardsMagazineCoverStory, blogCardsMagazineCoverStoryCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-magazine-cover-story/BlogCardsMagazineCoverStory"
import { BlogCardsPullQuoteFeature, blogCardsPullQuoteFeatureCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-pull-quote-feature/BlogCardsPullQuoteFeature"
import { blogCardsArgTypes, blogCardsViewports, emptyPropsOf, localeOf, photoPropsOf } from "./blog-cards-story-kit"

/**
 * Blog Cards: the Types of the Figma set, one block each, from card grids and
 * features to lists, panels beside a post and browsing controls. The photos
 * are the docs site's demo set, described in the toolbar's language.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states, without photos (the `muted` placeholders) and empty (the block's
 * "No articles yet." line), are tagged `!dev` and `!autodocs`: hidden from
 * both, but still built, so tests and visual checks reach them by id. The
 * tags are written out on each story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Blog Cards",
  parameters: { layout: "fullscreen", viewport: { viewports: blogCardsViewports } },
  tags: ["autodocs"],
}

export default meta

export const Classic3UpGrid: StoryObj<typeof BlogCardsClassic3UpGrid> = {
  name: "Classic 3-Up Grid",
  argTypes: blogCardsArgTypes(BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsClassic3UpGrid locale={localeOf(context)} {...photoPropsOf("classic-3-up-grid", context, blogCardsClassic3UpGridCopy)} {...args} />,
}

export const Classic3UpGridWithoutPhotos: StoryObj<typeof BlogCardsClassic3UpGrid> = {
  name: "Classic 3-Up Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsClassic3UpGrid locale={localeOf(context)} {...args} />,
}

export const Classic3UpGridEmpty: StoryObj<typeof BlogCardsClassic3UpGrid> = {
  name: "Classic 3-Up Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsClassic3UpGrid locale={localeOf(context)} {...emptyPropsOf(blogCardsClassic3UpGridCopy)} {...args} />,
}

export const FeaturedTwoUp: StoryObj<typeof BlogCardsFeaturedTwoUp> = {
  name: "Featured + Two-Up",
  argTypes: blogCardsArgTypes(BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsFeaturedTwoUp locale={localeOf(context)} {...photoPropsOf("featured-two-up", context, blogCardsFeaturedTwoUpCopy)} {...args} />,
}

export const FeaturedTwoUpWithoutPhotos: StoryObj<typeof BlogCardsFeaturedTwoUp> = {
  name: "Featured + Two-Up: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsFeaturedTwoUp locale={localeOf(context)} {...args} />,
}

export const FeaturedTwoUpEmpty: StoryObj<typeof BlogCardsFeaturedTwoUp> = {
  name: "Featured + Two-Up: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsFeaturedTwoUp locale={localeOf(context)} {...emptyPropsOf(blogCardsFeaturedTwoUpCopy)} {...args} />,
}

export const Compact4UpThumbGrid: StoryObj<typeof BlogCardsCompact4UpThumbGrid> = {
  name: "Compact 4-Up Thumb Grid",
  argTypes: blogCardsArgTypes(BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsCompact4UpThumbGrid locale={localeOf(context)} {...photoPropsOf("compact-4-up-thumb-grid", context, blogCardsCompact4UpThumbGridCopy)} {...args} />,
}

export const Compact4UpThumbGridWithoutPhotos: StoryObj<typeof BlogCardsCompact4UpThumbGrid> = {
  name: "Compact 4-Up Thumb Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsCompact4UpThumbGrid locale={localeOf(context)} {...args} />,
}

export const Compact4UpThumbGridEmpty: StoryObj<typeof BlogCardsCompact4UpThumbGrid> = {
  name: "Compact 4-Up Thumb Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsCompact4UpThumbGrid locale={localeOf(context)} {...emptyPropsOf(blogCardsCompact4UpThumbGridCopy)} {...args} />,
}

export const BentoEditorialGrid: StoryObj<typeof BlogCardsBentoEditorialGrid> = {
  name: "Bento Editorial Grid",
  argTypes: blogCardsArgTypes(BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsBentoEditorialGrid locale={localeOf(context)} {...photoPropsOf("bento-editorial-grid", context, blogCardsBentoEditorialGridCopy)} {...args} />,
}

export const BentoEditorialGridWithoutPhotos: StoryObj<typeof BlogCardsBentoEditorialGrid> = {
  name: "Bento Editorial Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsBentoEditorialGrid locale={localeOf(context)} {...args} />,
}

export const BentoEditorialGridEmpty: StoryObj<typeof BlogCardsBentoEditorialGrid> = {
  name: "Bento Editorial Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsBentoEditorialGrid locale={localeOf(context)} {...emptyPropsOf(blogCardsBentoEditorialGridCopy)} quote={{ text: "", author: "", role: "" }} post={{ category: "", title: "", summary: "", href: "#" }} stat={{ label: "", value: "", note: "" }} subscribe={{ title: "", note: "", label: "", href: "#" }} {...args} />,
}

export const OverlayPhotoTrio: StoryObj<typeof BlogCardsOverlayPhotoTrio> = {
  name: "Overlay Photo Trio",
  argTypes: blogCardsArgTypes(BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsOverlayPhotoTrio locale={localeOf(context)} {...photoPropsOf("overlay-photo-trio", context, blogCardsOverlayPhotoTrioCopy)} {...args} />,
}

export const OverlayPhotoTrioWithoutPhotos: StoryObj<typeof BlogCardsOverlayPhotoTrio> = {
  name: "Overlay Photo Trio: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsOverlayPhotoTrio locale={localeOf(context)} {...args} />,
}

export const OverlayPhotoTrioEmpty: StoryObj<typeof BlogCardsOverlayPhotoTrio> = {
  name: "Overlay Photo Trio: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsOverlayPhotoTrio locale={localeOf(context)} {...emptyPropsOf(blogCardsOverlayPhotoTrioCopy)} {...args} />,
}

export const LeftThumbRowCards: StoryObj<typeof BlogCardsLeftThumbRowCards> = {
  name: "Left-Thumb Row Cards",
  argTypes: blogCardsArgTypes(BlogCardsLeftThumbRowCards, blogCardsLeftThumbRowCardsCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeftThumbRowCards locale={localeOf(context)} {...photoPropsOf("left-thumb-row-cards", context, blogCardsLeftThumbRowCardsCopy)} {...args} />,
}

export const LeftThumbRowCardsWithoutPhotos: StoryObj<typeof BlogCardsLeftThumbRowCards> = {
  name: "Left-Thumb Row Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLeftThumbRowCards, blogCardsLeftThumbRowCardsCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeftThumbRowCards locale={localeOf(context)} {...args} />,
}

export const LeftThumbRowCardsEmpty: StoryObj<typeof BlogCardsLeftThumbRowCards> = {
  name: "Left-Thumb Row Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLeftThumbRowCards, blogCardsLeftThumbRowCardsCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeftThumbRowCards locale={localeOf(context)} {...emptyPropsOf(blogCardsLeftThumbRowCardsCopy)} {...args} />,
}

export const HairlineTextIndex: StoryObj<typeof BlogCardsHairlineTextIndex> = {
  name: "Hairline Text Index",
  argTypes: blogCardsArgTypes(BlogCardsHairlineTextIndex, blogCardsHairlineTextIndexCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsHairlineTextIndex locale={localeOf(context)} {...photoPropsOf("hairline-text-index", context, blogCardsHairlineTextIndexCopy)} {...args} />,
}

export const HairlineTextIndexWithoutPhotos: StoryObj<typeof BlogCardsHairlineTextIndex> = {
  name: "Hairline Text Index: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsHairlineTextIndex, blogCardsHairlineTextIndexCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsHairlineTextIndex locale={localeOf(context)} {...args} />,
}

export const HairlineTextIndexEmpty: StoryObj<typeof BlogCardsHairlineTextIndex> = {
  name: "Hairline Text Index: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsHairlineTextIndex, blogCardsHairlineTextIndexCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsHairlineTextIndex locale={localeOf(context)} {...emptyPropsOf(blogCardsHairlineTextIndexCopy)} {...args} />,
}

export const NumberedReadingList: StoryObj<typeof BlogCardsNumberedReadingList> = {
  name: "Numbered Reading List",
  argTypes: blogCardsArgTypes(BlogCardsNumberedReadingList, blogCardsNumberedReadingListCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsNumberedReadingList locale={localeOf(context)} {...photoPropsOf("numbered-reading-list", context, blogCardsNumberedReadingListCopy)} {...args} />,
}

export const NumberedReadingListWithoutPhotos: StoryObj<typeof BlogCardsNumberedReadingList> = {
  name: "Numbered Reading List: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsNumberedReadingList, blogCardsNumberedReadingListCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsNumberedReadingList locale={localeOf(context)} {...args} />,
}

export const NumberedReadingListEmpty: StoryObj<typeof BlogCardsNumberedReadingList> = {
  name: "Numbered Reading List: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsNumberedReadingList, blogCardsNumberedReadingListCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsNumberedReadingList locale={localeOf(context)} {...emptyPropsOf(blogCardsNumberedReadingListCopy)} {...args} />,
}

export const LatestPopularSplit: StoryObj<typeof BlogCardsLatestPopularSplit> = {
  name: "Latest / Popular Split",
  argTypes: blogCardsArgTypes(BlogCardsLatestPopularSplit, blogCardsLatestPopularSplitCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLatestPopularSplit locale={localeOf(context)} {...photoPropsOf("latest-popular-split", context, blogCardsLatestPopularSplitCopy)} {...args} />,
}

export const LatestPopularSplitWithoutPhotos: StoryObj<typeof BlogCardsLatestPopularSplit> = {
  name: "Latest / Popular Split: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLatestPopularSplit, blogCardsLatestPopularSplitCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLatestPopularSplit locale={localeOf(context)} {...args} />,
}

export const LatestPopularSplitEmpty: StoryObj<typeof BlogCardsLatestPopularSplit> = {
  name: "Latest / Popular Split: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLatestPopularSplit, blogCardsLatestPopularSplitCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsLatestPopularSplit locale={localeOf(context)} {...emptyPropsOf(blogCardsLatestPopularSplitCopy)} {...args} />,
}

export const JournalBento: StoryObj<typeof BlogCardsJournalBento> = {
  name: "Journal Bento",
  argTypes: blogCardsArgTypes(BlogCardsJournalBento, blogCardsJournalBentoCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsJournalBento locale={localeOf(context)} {...photoPropsOf("journal-bento", context, blogCardsJournalBentoCopy)} {...args} />,
}

export const JournalBentoWithoutPhotos: StoryObj<typeof BlogCardsJournalBento> = {
  name: "Journal Bento: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsJournalBento, blogCardsJournalBentoCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsJournalBento locale={localeOf(context)} {...args} />,
}

export const JournalBentoEmpty: StoryObj<typeof BlogCardsJournalBento> = {
  name: "Journal Bento: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsJournalBento, blogCardsJournalBentoCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsJournalBento locale={localeOf(context)} {...emptyPropsOf(blogCardsJournalBentoCopy)} {...args} />,
}

export const SplitFeature: StoryObj<typeof BlogCardsSplitFeature> = {
  name: "Split Feature",
  argTypes: blogCardsArgTypes(BlogCardsSplitFeature, blogCardsSplitFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsSplitFeature locale={localeOf(context)} {...photoPropsOf("split-feature", context, blogCardsSplitFeatureCopy)} {...args} />,
}

export const SplitFeatureWithoutPhotos: StoryObj<typeof BlogCardsSplitFeature> = {
  name: "Split Feature: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsSplitFeature, blogCardsSplitFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsSplitFeature locale={localeOf(context)} {...args} />,
}

export const SplitFeatureEmpty: StoryObj<typeof BlogCardsSplitFeature> = {
  name: "Split Feature: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsSplitFeature, blogCardsSplitFeatureCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsSplitFeature locale={localeOf(context)} {...emptyPropsOf(blogCardsSplitFeatureCopy)} post={null} {...args} />,
}

export const LeadRankedPicks: StoryObj<typeof BlogCardsLeadRankedPicks> = {
  name: "Lead + Ranked Picks",
  argTypes: blogCardsArgTypes(BlogCardsLeadRankedPicks, blogCardsLeadRankedPicksCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeadRankedPicks locale={localeOf(context)} {...photoPropsOf("lead-ranked-picks", context, blogCardsLeadRankedPicksCopy)} {...args} />,
}

export const LeadRankedPicksWithoutPhotos: StoryObj<typeof BlogCardsLeadRankedPicks> = {
  name: "Lead + Ranked Picks: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLeadRankedPicks, blogCardsLeadRankedPicksCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeadRankedPicks locale={localeOf(context)} {...args} />,
}

export const LeadRankedPicksEmpty: StoryObj<typeof BlogCardsLeadRankedPicks> = {
  name: "Lead + Ranked Picks: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsLeadRankedPicks, blogCardsLeadRankedPicksCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsLeadRankedPicks locale={localeOf(context)} {...emptyPropsOf(blogCardsLeadRankedPicksCopy)} lead={null} {...args} />,
}

export const DarkEditorialFeature: StoryObj<typeof BlogCardsDarkEditorialFeature> = {
  name: "Dark Editorial Feature",
  argTypes: blogCardsArgTypes(BlogCardsDarkEditorialFeature, blogCardsDarkEditorialFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsDarkEditorialFeature locale={localeOf(context)} {...photoPropsOf("dark-editorial-feature", context, blogCardsDarkEditorialFeatureCopy)} {...args} />,
}

export const DarkEditorialFeatureWithoutPhotos: StoryObj<typeof BlogCardsDarkEditorialFeature> = {
  name: "Dark Editorial Feature: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsDarkEditorialFeature, blogCardsDarkEditorialFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsDarkEditorialFeature locale={localeOf(context)} {...args} />,
}

export const DarkEditorialFeatureEmpty: StoryObj<typeof BlogCardsDarkEditorialFeature> = {
  name: "Dark Editorial Feature: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsDarkEditorialFeature, blogCardsDarkEditorialFeatureCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsDarkEditorialFeature locale={localeOf(context)} {...emptyPropsOf(blogCardsDarkEditorialFeatureCopy)} post={null} {...args} />,
}

export const MagazineCoverStory: StoryObj<typeof BlogCardsMagazineCoverStory> = {
  name: "Magazine Cover Story",
  argTypes: blogCardsArgTypes(BlogCardsMagazineCoverStory, blogCardsMagazineCoverStoryCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsMagazineCoverStory locale={localeOf(context)} {...photoPropsOf("magazine-cover-story", context, blogCardsMagazineCoverStoryCopy)} {...args} />,
}

export const MagazineCoverStoryWithoutPhotos: StoryObj<typeof BlogCardsMagazineCoverStory> = {
  name: "Magazine Cover Story: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsMagazineCoverStory, blogCardsMagazineCoverStoryCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsMagazineCoverStory locale={localeOf(context)} {...args} />,
}

export const MagazineCoverStoryEmpty: StoryObj<typeof BlogCardsMagazineCoverStory> = {
  name: "Magazine Cover Story: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsMagazineCoverStory, blogCardsMagazineCoverStoryCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsMagazineCoverStory locale={localeOf(context)} {...emptyPropsOf(blogCardsMagazineCoverStoryCopy)} story={null} masthead={null} {...args} />,
}

export const PullQuoteFeature: StoryObj<typeof BlogCardsPullQuoteFeature> = {
  name: "Pull-Quote Feature",
  argTypes: blogCardsArgTypes(BlogCardsPullQuoteFeature, blogCardsPullQuoteFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsPullQuoteFeature locale={localeOf(context)} {...photoPropsOf("pull-quote-feature", context, blogCardsPullQuoteFeatureCopy)} {...args} />,
}

export const PullQuoteFeatureWithoutPhotos: StoryObj<typeof BlogCardsPullQuoteFeature> = {
  name: "Pull-Quote Feature: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsPullQuoteFeature, blogCardsPullQuoteFeatureCopy, ["emptyLabel"]),
  render: (args, context) => <BlogCardsPullQuoteFeature locale={localeOf(context)} {...args} />,
}

export const PullQuoteFeatureEmpty: StoryObj<typeof BlogCardsPullQuoteFeature> = {
  name: "Pull-Quote Feature: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: blogCardsArgTypes(BlogCardsPullQuoteFeature, blogCardsPullQuoteFeatureCopy, [], ["emptyLabel"]),
  render: (args, context) => <BlogCardsPullQuoteFeature locale={localeOf(context)} {...emptyPropsOf(blogCardsPullQuoteFeatureCopy)} panel={null} {...args} />,
}
