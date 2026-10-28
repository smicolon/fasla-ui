import type { Meta, StoryObj } from "@storybook/react"
import { BlogCardsClassic3UpGrid, blogCardsClassic3UpGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-classic-3-up-grid/BlogCardsClassic3UpGrid"
import { BlogCardsFeaturedTwoUp, blogCardsFeaturedTwoUpCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-featured-two-up/BlogCardsFeaturedTwoUp"
import { BlogCardsCompact4UpThumbGrid, blogCardsCompact4UpThumbGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-compact-4-up-thumb-grid/BlogCardsCompact4UpThumbGrid"
import { BlogCardsBentoEditorialGrid, blogCardsBentoEditorialGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-bento-editorial-grid/BlogCardsBentoEditorialGrid"
import { BlogCardsOverlayPhotoTrio, blogCardsOverlayPhotoTrioCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-overlay-photo-trio/BlogCardsOverlayPhotoTrio"
import { BlogCardsJournalBento, blogCardsJournalBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/blog-cards-journal-bento/BlogCardsJournalBento"
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
