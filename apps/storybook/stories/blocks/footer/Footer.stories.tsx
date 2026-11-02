import type { Meta, StoryObj } from "@storybook/react"
import { FooterFourColumnDirectory, footerFourColumnDirectoryCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-four-column-directory/FooterFourColumnDirectory"
import { FooterWideSitemapMega, footerWideSitemapMegaCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-wide-sitemap-mega/FooterWideSitemapMega"
import { FooterAccordionSitemap, footerAccordionSitemapCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-accordion-sitemap/FooterAccordionSitemap"
import { FooterTwoTierDoormat, footerTwoTierDoormatCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-two-tier-doormat/FooterTwoTierDoormat"
import { FooterIndexNumberedColumns, footerIndexNumberedColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/footer-index-numbered-columns/FooterIndexNumberedColumns"
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
