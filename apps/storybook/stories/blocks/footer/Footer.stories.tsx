import type { Meta, StoryObj } from "@storybook/react"
import { FooterFourColumnDirectory, footerFourColumnDirectoryCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-four-column-directory/FooterFourColumnDirectory"
import { FooterWideSitemapMega, footerWideSitemapMegaCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-wide-sitemap-mega/FooterWideSitemapMega"
import { FooterAccordionSitemap, footerAccordionSitemapCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-accordion-sitemap/FooterAccordionSitemap"
import { FooterTwoTierDoormat, footerTwoTierDoormatCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-two-tier-doormat/FooterTwoTierDoormat"
import { FooterIndexNumberedColumns, footerIndexNumberedColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-index-numbered-columns/FooterIndexNumberedColumns"
import { FooterBrandPanelSplit, footerBrandPanelSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-brand-panel-split/FooterBrandPanelSplit"
import { FooterGiantWordmark, footerGiantWordmarkCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-giant-wordmark/FooterGiantWordmark"
import { FooterImageBackedBrand, footerImageBackedBrandCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-image-backed-brand/FooterImageBackedBrand"
import { FooterCenteredBrandMinimal, footerCenteredBrandMinimalCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-centered-brand-minimal/FooterCenteredBrandMinimal"
import { FooterMarqueeStrip, footerMarqueeStripCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-marquee-strip/FooterMarqueeStrip"
import { FooterBigTypeLinkStack, footerBigTypeLinkStackCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-big-type-link-stack/FooterBigTypeLinkStack"
import { FooterBentoTile, footerBentoTileCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-bento-tile/FooterBentoTile"
import { FooterCtaBandColumns, footerCtaBandColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-cta-band-columns/FooterCtaBandColumns"
import { FooterNewsletterSplit, footerNewsletterSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-newsletter-split/FooterNewsletterSplit"
import { FooterFloatingDemoCard, footerFloatingDemoCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-floating-demo-card/FooterFloatingDemoCard"
import { FooterBigQuestionCta, footerBigQuestionCtaCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-big-question-cta/FooterBigQuestionCta"
import { FooterSingleLineBar, footerSingleLineBarCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-single-line-bar/FooterSingleLineBar"
import { FooterSplitHairlineMicro, footerSplitHairlineMicroCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-split-hairline-micro/FooterSplitHairlineMicro"
import { FooterTwoRowCompact, footerTwoRowCompactCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-two-row-compact/FooterTwoRowCompact"
import { FooterInlinePreferences, footerInlinePreferencesCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-inline-preferences/FooterInlinePreferences"
import { footerArgTypes, footerViewports, localeOf, photoPropsOf } from "./footer-story-kit"

/**
 * Footer: the Types of the Figma set, one block each, from sitemaps and
 * brand-led footers to call-to-action bands, minimal bars, contact layouts and
 * app footers. The photos are the docs site's demo set, described in the
 * toolbar's language. Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states, without photos (the `muted` placeholders) and the sign-up form's
 * loading, sent and error states, are tagged `!dev` and `!autodocs`: hidden
 * from both, but still built, so tests and visual checks reach them by id.
 * The tags are written out on each story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Footer",
  parameters: { layout: "fullscreen", viewport: { viewports: footerViewports } },
  tags: ["autodocs"],
}

export default meta

export const FourColumnDirectory: StoryObj<typeof FooterFourColumnDirectory> = {
  name: "Four-Column Directory",
  argTypes: footerArgTypes(FooterFourColumnDirectory, footerFourColumnDirectoryCopy),
  render: (args, context) => <FooterFourColumnDirectory locale={localeOf(context)} {...photoPropsOf("four-column-directory", context, footerFourColumnDirectoryCopy)} {...args} />,
}

export const WideSitemapMega: StoryObj<typeof FooterWideSitemapMega> = {
  name: "Wide Sitemap Mega",
  argTypes: footerArgTypes(FooterWideSitemapMega, footerWideSitemapMegaCopy),
  render: (args, context) => <FooterWideSitemapMega locale={localeOf(context)} {...photoPropsOf("wide-sitemap-mega", context, footerWideSitemapMegaCopy)} {...args} />,
}

export const AccordionSitemap: StoryObj<typeof FooterAccordionSitemap> = {
  name: "Accordion Sitemap",
  argTypes: footerArgTypes(FooterAccordionSitemap, footerAccordionSitemapCopy),
  render: (args, context) => <FooterAccordionSitemap locale={localeOf(context)} {...photoPropsOf("accordion-sitemap", context, footerAccordionSitemapCopy)} {...args} />,
}

export const TwoTierDoormat: StoryObj<typeof FooterTwoTierDoormat> = {
  name: "Two-Tier Doormat",
  argTypes: footerArgTypes(FooterTwoTierDoormat, footerTwoTierDoormatCopy),
  render: (args, context) => <FooterTwoTierDoormat locale={localeOf(context)} {...photoPropsOf("two-tier-doormat", context, footerTwoTierDoormatCopy)} {...args} />,
}

export const IndexNumberedColumns: StoryObj<typeof FooterIndexNumberedColumns> = {
  name: "Index-Numbered Columns",
  argTypes: footerArgTypes(FooterIndexNumberedColumns, footerIndexNumberedColumnsCopy),
  render: (args, context) => <FooterIndexNumberedColumns locale={localeOf(context)} {...photoPropsOf("index-numbered-columns", context, footerIndexNumberedColumnsCopy)} {...args} />,
}

export const BrandPanelSplit: StoryObj<typeof FooterBrandPanelSplit> = {
  name: "Brand Panel Split",
  argTypes: footerArgTypes(FooterBrandPanelSplit, footerBrandPanelSplitCopy),
  render: (args, context) => <FooterBrandPanelSplit locale={localeOf(context)} {...photoPropsOf("brand-panel-split", context, footerBrandPanelSplitCopy)} {...args} />,
}

export const GiantWordmark: StoryObj<typeof FooterGiantWordmark> = {
  name: "Giant Wordmark",
  argTypes: footerArgTypes(FooterGiantWordmark, footerGiantWordmarkCopy),
  render: (args, context) => <FooterGiantWordmark locale={localeOf(context)} {...photoPropsOf("giant-wordmark", context, footerGiantWordmarkCopy)} {...args} />,
}

export const ImageBackedBrand: StoryObj<typeof FooterImageBackedBrand> = {
  name: "Image-Backed Brand",
  argTypes: footerArgTypes(FooterImageBackedBrand, footerImageBackedBrandCopy),
  render: (args, context) => <FooterImageBackedBrand locale={localeOf(context)} {...photoPropsOf("image-backed-brand", context, footerImageBackedBrandCopy)} {...args} />,
}

export const ImageBackedBrandWithoutPhotos: StoryObj<typeof FooterImageBackedBrand> = {
  name: "Image-Backed Brand: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: footerArgTypes(FooterImageBackedBrand, footerImageBackedBrandCopy),
  render: (args, context) => <FooterImageBackedBrand locale={localeOf(context)} {...args} />,
}

export const CenteredBrandMinimal: StoryObj<typeof FooterCenteredBrandMinimal> = {
  name: "Centered Brand Minimal",
  argTypes: footerArgTypes(FooterCenteredBrandMinimal, footerCenteredBrandMinimalCopy),
  render: (args, context) => <FooterCenteredBrandMinimal locale={localeOf(context)} {...photoPropsOf("centered-brand-minimal", context, footerCenteredBrandMinimalCopy)} {...args} />,
}

export const MarqueeStrip: StoryObj<typeof FooterMarqueeStrip> = {
  name: "Marquee Strip",
  argTypes: footerArgTypes(FooterMarqueeStrip, footerMarqueeStripCopy),
  render: (args, context) => <FooterMarqueeStrip locale={localeOf(context)} {...photoPropsOf("marquee-strip", context, footerMarqueeStripCopy)} {...args} />,
}

export const BigTypeLinkStack: StoryObj<typeof FooterBigTypeLinkStack> = {
  name: "Big-Type Link Stack",
  argTypes: footerArgTypes(FooterBigTypeLinkStack, footerBigTypeLinkStackCopy),
  render: (args, context) => <FooterBigTypeLinkStack locale={localeOf(context)} {...photoPropsOf("big-type-link-stack", context, footerBigTypeLinkStackCopy)} {...args} />,
}

export const BentoTile: StoryObj<typeof FooterBentoTile> = {
  name: "Bento Tile",
  argTypes: footerArgTypes(FooterBentoTile, footerBentoTileCopy),
  render: (args, context) => <FooterBentoTile locale={localeOf(context)} {...photoPropsOf("bento-tile", context, footerBentoTileCopy)} {...args} />,
}

export const CtaBandColumns: StoryObj<typeof FooterCtaBandColumns> = {
  name: "CTA Band + Columns",
  argTypes: footerArgTypes(FooterCtaBandColumns, footerCtaBandColumnsCopy),
  render: (args, context) => <FooterCtaBandColumns locale={localeOf(context)} {...photoPropsOf("cta-band-columns", context, footerCtaBandColumnsCopy)} {...args} />,
}

export const NewsletterSplit: StoryObj<typeof FooterNewsletterSplit> = {
  name: "Newsletter Split",
  argTypes: footerArgTypes(FooterNewsletterSplit, footerNewsletterSplitCopy),
  render: (args, context) => <FooterNewsletterSplit locale={localeOf(context)} {...photoPropsOf("newsletter-split", context, footerNewsletterSplitCopy)} {...args} />,
}

export const NewsletterSplitLoading: StoryObj<typeof FooterNewsletterSplit> = {
  name: "Newsletter Split: Loading",
  tags: ["!dev", "!autodocs"],
  argTypes: footerArgTypes(FooterNewsletterSplit, footerNewsletterSplitCopy),
  render: (args, context) => <FooterNewsletterSplit locale={localeOf(context)} status="loading" {...args} />,
}

export const NewsletterSplitSent: StoryObj<typeof FooterNewsletterSplit> = {
  name: "Newsletter Split: Sent",
  tags: ["!dev", "!autodocs"],
  argTypes: footerArgTypes(FooterNewsletterSplit, footerNewsletterSplitCopy),
  render: (args, context) => <FooterNewsletterSplit locale={localeOf(context)} status="sent" {...args} />,
}

export const NewsletterSplitError: StoryObj<typeof FooterNewsletterSplit> = {
  name: "Newsletter Split: Error",
  tags: ["!dev", "!autodocs"],
  argTypes: footerArgTypes(FooterNewsletterSplit, footerNewsletterSplitCopy),
  render: (args, context) => <FooterNewsletterSplit locale={localeOf(context)} status="error" {...args} />,
}

export const FloatingDemoCard: StoryObj<typeof FooterFloatingDemoCard> = {
  name: "Floating Demo Card",
  argTypes: footerArgTypes(FooterFloatingDemoCard, footerFloatingDemoCardCopy),
  render: (args, context) => <FooterFloatingDemoCard locale={localeOf(context)} {...photoPropsOf("floating-demo-card", context, footerFloatingDemoCardCopy)} {...args} />,
}

export const BigQuestionCta: StoryObj<typeof FooterBigQuestionCta> = {
  name: "Big-Question CTA",
  argTypes: footerArgTypes(FooterBigQuestionCta, footerBigQuestionCtaCopy),
  render: (args, context) => <FooterBigQuestionCta locale={localeOf(context)} {...photoPropsOf("big-question-cta", context, footerBigQuestionCtaCopy)} {...args} />,
}

export const SingleLineBar: StoryObj<typeof FooterSingleLineBar> = {
  name: "Single-Line Bar",
  argTypes: footerArgTypes(FooterSingleLineBar, footerSingleLineBarCopy),
  render: (args, context) => <FooterSingleLineBar locale={localeOf(context)} {...photoPropsOf("single-line-bar", context, footerSingleLineBarCopy)} {...args} />,
}

export const SplitHairlineMicro: StoryObj<typeof FooterSplitHairlineMicro> = {
  name: "Split Hairline Micro",
  argTypes: footerArgTypes(FooterSplitHairlineMicro, footerSplitHairlineMicroCopy),
  render: (args, context) => <FooterSplitHairlineMicro locale={localeOf(context)} {...photoPropsOf("split-hairline-micro", context, footerSplitHairlineMicroCopy)} {...args} />,
}

export const TwoRowCompact: StoryObj<typeof FooterTwoRowCompact> = {
  name: "Two-Row Compact",
  argTypes: footerArgTypes(FooterTwoRowCompact, footerTwoRowCompactCopy),
  render: (args, context) => <FooterTwoRowCompact locale={localeOf(context)} {...photoPropsOf("two-row-compact", context, footerTwoRowCompactCopy)} {...args} />,
}

export const InlinePreferences: StoryObj<typeof FooterInlinePreferences> = {
  name: "Inline + Preferences",
  argTypes: footerArgTypes(FooterInlinePreferences, footerInlinePreferencesCopy),
  render: (args, context) => <FooterInlinePreferences locale={localeOf(context)} {...photoPropsOf("inline-preferences", context, footerInlinePreferencesCopy)} {...args} />,
}
