import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { LogoCloudCenteredCaptionRow, logoCloudCenteredCaptionRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-centered-caption-row/LogoCloudCenteredCaptionRow"
import { LogoCloudHeadingGrid, logoCloudHeadingGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-heading-grid/LogoCloudHeadingGrid"
import { LogoCloudBorderedCellGrid, logoCloudBorderedCellGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-bordered-cell-grid/LogoCloudBorderedCellGrid"
import { LogoCloudEnterpriseWall, logoCloudEnterpriseWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-enterprise-wall/LogoCloudEnterpriseWall"
import { LogoCloudContainedCard, logoCloudContainedCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-contained-card/LogoCloudContainedCard"
import { LogoCloudDarkLogoWall, logoCloudDarkLogoWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-dark-logo-wall/LogoCloudDarkLogoWall"
import { LogoCloudSideLabelRail, logoCloudSideLabelRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-side-label-rail/LogoCloudSideLabelRail"
import { LogoCloudHeadingLeftGridRight, logoCloudHeadingLeftGridRightCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-heading-left-grid-right/LogoCloudHeadingLeftGridRight"
import { LogoCloudEditorialEyebrowSplit, logoCloudEditorialEyebrowSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-editorial-eyebrow-split/LogoCloudEditorialEyebrowSplit"
import { LogoCloudFlankedHeading, logoCloudFlankedHeadingCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-flanked-heading/LogoCloudFlankedHeading"
import { LogoCloudQuotePanelGrid, logoCloudQuotePanelGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-quote-panel-grid/LogoCloudQuotePanelGrid"
import { LogoCloudStatRailAboveGrid, logoCloudStatRailAboveGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-stat-rail-above-grid/LogoCloudStatRailAboveGrid"
import { LogoCloudLogoMetricTiles, logoCloudLogoMetricTilesCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-logo-metric-tiles/LogoCloudLogoMetricTiles"
import { LogoCloudLogoQuoteCards, logoCloudLogoQuoteCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-logo-quote-cards/LogoCloudLogoQuoteCards"
import { LogoCloudNamedIntegrationCards, logoCloudNamedIntegrationCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-named-integration-cards/LogoCloudNamedIntegrationCards"
import { LogoCloudLogoTestimonialStrip, logoCloudLogoTestimonialStripCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-logo-testimonial-strip/LogoCloudLogoTestimonialStrip"
import { LogoCloudScatterField, logoCloudScatterFieldCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-scatter-field/LogoCloudScatterField"
import { LogoCloudBentoLogoWall, logoCloudBentoLogoWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-bento-logo-wall/LogoCloudBentoLogoWall"
import { LogoCloudDividerRuleRow, logoCloudDividerRuleRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-divider-rule-row/LogoCloudDividerRuleRow"
import { LogoCloudPyramidRowStack, logoCloudPyramidRowStackCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-pyramid-row-stack/LogoCloudPyramidRowStack"
import { LogoCloudTabbedIndustryFilter, logoCloudTabbedIndustryFilterCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-tabbed-industry-filter/LogoCloudTabbedIndustryFilter"
import { LogoCloudGridClosingCta, logoCloudGridClosingCtaCopy } from "../../../../../packages/fasla-ui/registry/blocks/logo-cloud-grid-closing-cta/LogoCloudGridClosingCta"
import { LOGO_CLOUD_EXAMPLES } from "../../../../docs/components/blocks/logo-cloud-examples"
import { localeOf, logoCloudArgTypes, logoCloudViewports } from "./logo-cloud-story-kit"

/**
 * Logo Cloud: the 22 Types of the Figma set, one block each. Sixteen pair the
 * marks with a heading or a caption; six add proof beside them: a
 * testimonial, figures, or a sector filter. No block ships a brand: every
 * story passes Figma's Brand Logos from the docs site's example data.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the 22 Figma Types only. The extra
 * states (no logos, an empty list) are tagged `!dev` and `!autodocs`: hidden
 * from both, but still built, so tests and visual checks reach them by id.
 * The tags are written out on each story, as the indexer reads them
 * statically.
 *
 * The Docs page shows each story's own code: the logos are React elements in
 * a prop, and Storybook's generated JSX snippet recurses through them until
 * the stack overflows.
 */
const meta: Meta = {
  title: "Blocks/Logo Cloud",
  parameters: { layout: "fullscreen", viewport: { viewports: logoCloudViewports }, docs: { source: { type: "code" } } },
  tags: ["autodocs"],
}

export default meta

export const CenteredCaptionRow: StoryObj<typeof LogoCloudCenteredCaptionRow> = {
  name: "Centered Caption Row",
  argTypes: logoCloudArgTypes(LogoCloudCenteredCaptionRow, logoCloudCenteredCaptionRowCopy),
  render: (args, context) => (
    <LogoCloudCenteredCaptionRow locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-centered-caption-row"]} {...args} />
  ),
}

export const CenteredCaptionRowNoLogos: StoryObj<typeof LogoCloudCenteredCaptionRow> = {
  tags: ["!dev", "!autodocs"],
  name: "Centered Caption Row: No logos",
  argTypes: logoCloudArgTypes(LogoCloudCenteredCaptionRow, logoCloudCenteredCaptionRowCopy),
  render: (args, context) => <LogoCloudCenteredCaptionRow locale={localeOf(context)} {...args} />,
}

export const HeadingGrid: StoryObj<typeof LogoCloudHeadingGrid> = {
  name: "Heading Grid",
  argTypes: logoCloudArgTypes(LogoCloudHeadingGrid, logoCloudHeadingGridCopy),
  render: (args, context) => <LogoCloudHeadingGrid locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-heading-grid"]} {...args} />,
}

export const HeadingGridNoLogos: StoryObj<typeof LogoCloudHeadingGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Heading Grid: No logos",
  argTypes: logoCloudArgTypes(LogoCloudHeadingGrid, logoCloudHeadingGridCopy),
  render: (args, context) => <LogoCloudHeadingGrid locale={localeOf(context)} {...args} />,
}

export const BorderedCellGrid: StoryObj<typeof LogoCloudBorderedCellGrid> = {
  name: "Bordered Cell Grid",
  argTypes: logoCloudArgTypes(LogoCloudBorderedCellGrid, logoCloudBorderedCellGridCopy),
  render: (args, context) => (
    <LogoCloudBorderedCellGrid locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-bordered-cell-grid"]} {...args} />
  ),
}

export const BorderedCellGridNoLogos: StoryObj<typeof LogoCloudBorderedCellGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Bordered Cell Grid: No logos",
  argTypes: logoCloudArgTypes(LogoCloudBorderedCellGrid, logoCloudBorderedCellGridCopy),
  render: (args, context) => <LogoCloudBorderedCellGrid locale={localeOf(context)} {...args} />,
}

export const EnterpriseWall: StoryObj<typeof LogoCloudEnterpriseWall> = {
  name: "Enterprise Wall",
  argTypes: logoCloudArgTypes(LogoCloudEnterpriseWall, logoCloudEnterpriseWallCopy),
  render: (args, context) => (
    <LogoCloudEnterpriseWall locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-enterprise-wall"]} {...args} />
  ),
}

export const EnterpriseWallNoLogos: StoryObj<typeof LogoCloudEnterpriseWall> = {
  tags: ["!dev", "!autodocs"],
  name: "Enterprise Wall: No logos",
  argTypes: logoCloudArgTypes(LogoCloudEnterpriseWall, logoCloudEnterpriseWallCopy),
  render: (args, context) => <LogoCloudEnterpriseWall locale={localeOf(context)} {...args} />,
}

export const ContainedCard: StoryObj<typeof LogoCloudContainedCard> = {
  name: "Contained Card",
  argTypes: logoCloudArgTypes(LogoCloudContainedCard, logoCloudContainedCardCopy),
  render: (args, context) => (
    <LogoCloudContainedCard locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-contained-card"]} {...args} />
  ),
}

export const ContainedCardNoLogos: StoryObj<typeof LogoCloudContainedCard> = {
  tags: ["!dev", "!autodocs"],
  name: "Contained Card: No logos",
  argTypes: logoCloudArgTypes(LogoCloudContainedCard, logoCloudContainedCardCopy),
  render: (args, context) => <LogoCloudContainedCard locale={localeOf(context)} {...args} />,
}

export const DarkLogoWall: StoryObj<typeof LogoCloudDarkLogoWall> = {
  name: "Dark Logo Wall",
  argTypes: logoCloudArgTypes(LogoCloudDarkLogoWall, logoCloudDarkLogoWallCopy),
  render: (args, context) => (
    <LogoCloudDarkLogoWall locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-dark-logo-wall"]} {...args} />
  ),
}

export const DarkLogoWallNoLogos: StoryObj<typeof LogoCloudDarkLogoWall> = {
  tags: ["!dev", "!autodocs"],
  name: "Dark Logo Wall: No logos",
  argTypes: logoCloudArgTypes(LogoCloudDarkLogoWall, logoCloudDarkLogoWallCopy),
  render: (args, context) => <LogoCloudDarkLogoWall locale={localeOf(context)} {...args} />,
}

export const SideLabelRail: StoryObj<typeof LogoCloudSideLabelRail> = {
  name: "Side Label Rail",
  argTypes: logoCloudArgTypes(LogoCloudSideLabelRail, logoCloudSideLabelRailCopy),
  render: (args, context) => (
    <LogoCloudSideLabelRail locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-side-label-rail"]} {...args} />
  ),
}

export const SideLabelRailNoLogos: StoryObj<typeof LogoCloudSideLabelRail> = {
  tags: ["!dev", "!autodocs"],
  name: "Side Label Rail: No logos",
  argTypes: logoCloudArgTypes(LogoCloudSideLabelRail, logoCloudSideLabelRailCopy),
  render: (args, context) => <LogoCloudSideLabelRail locale={localeOf(context)} {...args} />,
}

export const HeadingLeftGridRight: StoryObj<typeof LogoCloudHeadingLeftGridRight> = {
  name: "Heading Left Grid Right",
  argTypes: logoCloudArgTypes(LogoCloudHeadingLeftGridRight, logoCloudHeadingLeftGridRightCopy),
  render: (args, context) => (
    <LogoCloudHeadingLeftGridRight locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-heading-left-grid-right"]} {...args} />
  ),
}

export const HeadingLeftGridRightNoLogos: StoryObj<typeof LogoCloudHeadingLeftGridRight> = {
  tags: ["!dev", "!autodocs"],
  name: "Heading Left Grid Right: No logos",
  argTypes: logoCloudArgTypes(LogoCloudHeadingLeftGridRight, logoCloudHeadingLeftGridRightCopy),
  render: (args, context) => <LogoCloudHeadingLeftGridRight locale={localeOf(context)} {...args} />,
}

export const EditorialEyebrowSplit: StoryObj<typeof LogoCloudEditorialEyebrowSplit> = {
  name: "Editorial Eyebrow Split",
  argTypes: logoCloudArgTypes(LogoCloudEditorialEyebrowSplit, logoCloudEditorialEyebrowSplitCopy),
  render: (args, context) => (
    <LogoCloudEditorialEyebrowSplit locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-editorial-eyebrow-split"]} {...args} />
  ),
}

export const EditorialEyebrowSplitNoLogos: StoryObj<typeof LogoCloudEditorialEyebrowSplit> = {
  tags: ["!dev", "!autodocs"],
  name: "Editorial Eyebrow Split: No logos",
  argTypes: logoCloudArgTypes(LogoCloudEditorialEyebrowSplit, logoCloudEditorialEyebrowSplitCopy),
  render: (args, context) => <LogoCloudEditorialEyebrowSplit locale={localeOf(context)} {...args} />,
}

export const FlankedHeading: StoryObj<typeof LogoCloudFlankedHeading> = {
  name: "Flanked Heading",
  argTypes: logoCloudArgTypes(LogoCloudFlankedHeading, logoCloudFlankedHeadingCopy),
  render: (args, context) => (
    <LogoCloudFlankedHeading locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-flanked-heading"]} {...args} />
  ),
}

export const FlankedHeadingNoLogos: StoryObj<typeof LogoCloudFlankedHeading> = {
  tags: ["!dev", "!autodocs"],
  name: "Flanked Heading: No logos",
  argTypes: logoCloudArgTypes(LogoCloudFlankedHeading, logoCloudFlankedHeadingCopy),
  render: (args, context) => <LogoCloudFlankedHeading locale={localeOf(context)} {...args} />,
}

export const QuotePanelGrid: StoryObj<typeof LogoCloudQuotePanelGrid> = {
  name: "Quote Panel Grid",
  argTypes: logoCloudArgTypes(LogoCloudQuotePanelGrid, logoCloudQuotePanelGridCopy),
  render: (args, context) => (
    <LogoCloudQuotePanelGrid locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-quote-panel-grid"]} {...args} />
  ),
}

export const QuotePanelGridNoLogos: StoryObj<typeof LogoCloudQuotePanelGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Quote Panel Grid: No logos",
  argTypes: logoCloudArgTypes(LogoCloudQuotePanelGrid, logoCloudQuotePanelGridCopy),
  render: (args, context) => <LogoCloudQuotePanelGrid locale={localeOf(context)} {...args} />,
}

export const StatRailAboveGrid: StoryObj<typeof LogoCloudStatRailAboveGrid> = {
  name: "Stat Rail Above Grid",
  argTypes: logoCloudArgTypes(LogoCloudStatRailAboveGrid, logoCloudStatRailAboveGridCopy),
  render: (args, context) => (
    <LogoCloudStatRailAboveGrid
      locale={localeOf(context)}
      {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-stat-rail-above-grid"]}
      {...args}
    />
  ),
}

export const StatRailAboveGridNoLogos: StoryObj<typeof LogoCloudStatRailAboveGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Stat Rail Above Grid: No logos",
  argTypes: logoCloudArgTypes(LogoCloudStatRailAboveGrid, logoCloudStatRailAboveGridCopy),
  render: (args, context) => <LogoCloudStatRailAboveGrid locale={localeOf(context)} {...args} />,
}

export const LogoMetricTiles: StoryObj<typeof LogoCloudLogoMetricTiles> = {
  name: "Logo Metric Tiles",
  argTypes: logoCloudArgTypes(LogoCloudLogoMetricTiles, logoCloudLogoMetricTilesCopy),
  render: (args, context) => (
    <LogoCloudLogoMetricTiles locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-logo-metric-tiles"]} {...args} />
  ),
}

export const LogoMetricTilesNoLogos: StoryObj<typeof LogoCloudLogoMetricTiles> = {
  tags: ["!dev", "!autodocs"],
  name: "Logo Metric Tiles: No logos",
  argTypes: logoCloudArgTypes(LogoCloudLogoMetricTiles, logoCloudLogoMetricTilesCopy),
  render: (args, context) => <LogoCloudLogoMetricTiles locale={localeOf(context)} {...args} />,
}

export const LogoQuoteCards: StoryObj<typeof LogoCloudLogoQuoteCards> = {
  name: "Logo Quote Cards",
  argTypes: logoCloudArgTypes(LogoCloudLogoQuoteCards, logoCloudLogoQuoteCardsCopy),
  render: (args, context) => (
    <LogoCloudLogoQuoteCards locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-logo-quote-cards"]} {...args} />
  ),
}

export const LogoQuoteCardsEmpty: StoryObj<typeof LogoCloudLogoQuoteCards> = {
  tags: ["!dev", "!autodocs"],
  name: "Logo Quote Cards: Empty",
  argTypes: logoCloudArgTypes(LogoCloudLogoQuoteCards, logoCloudLogoQuoteCardsCopy, [], ["empty"]),
  render: (args, context) => <LogoCloudLogoQuoteCards locale={localeOf(context)} {...args} quotes={[]} />,
}

export const LogoQuoteCardsNoLogos: StoryObj<typeof LogoCloudLogoQuoteCards> = {
  tags: ["!dev", "!autodocs"],
  name: "Logo Quote Cards: No logos",
  argTypes: logoCloudArgTypes(LogoCloudLogoQuoteCards, logoCloudLogoQuoteCardsCopy),
  render: (args, context) => <LogoCloudLogoQuoteCards locale={localeOf(context)} {...args} />,
}

export const NamedIntegrationCards: StoryObj<typeof LogoCloudNamedIntegrationCards> = {
  name: "Named Integration Cards",
  argTypes: logoCloudArgTypes(LogoCloudNamedIntegrationCards, logoCloudNamedIntegrationCardsCopy),
  render: (args, context) => (
    <LogoCloudNamedIntegrationCards
      locale={localeOf(context)}
      {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-named-integration-cards"]}
      {...args}
    />
  ),
}

export const NamedIntegrationCardsNoLogos: StoryObj<typeof LogoCloudNamedIntegrationCards> = {
  tags: ["!dev", "!autodocs"],
  name: "Named Integration Cards: No logos",
  argTypes: logoCloudArgTypes(LogoCloudNamedIntegrationCards, logoCloudNamedIntegrationCardsCopy),
  render: (args, context) => <LogoCloudNamedIntegrationCards locale={localeOf(context)} {...args} />,
}

export const LogoTestimonialStrip: StoryObj<typeof LogoCloudLogoTestimonialStrip> = {
  name: "Logo Testimonial Strip",
  argTypes: logoCloudArgTypes(LogoCloudLogoTestimonialStrip, logoCloudLogoTestimonialStripCopy),
  render: (args, context) => (
    <LogoCloudLogoTestimonialStrip locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-logo-testimonial-strip"]} {...args} />
  ),
}

export const LogoTestimonialStripNoLogos: StoryObj<typeof LogoCloudLogoTestimonialStrip> = {
  tags: ["!dev", "!autodocs"],
  name: "Logo Testimonial Strip: No logos",
  argTypes: logoCloudArgTypes(LogoCloudLogoTestimonialStrip, logoCloudLogoTestimonialStripCopy),
  render: (args, context) => <LogoCloudLogoTestimonialStrip locale={localeOf(context)} {...args} />,
}

export const ScatterField: StoryObj<typeof LogoCloudScatterField> = {
  name: "Scatter Field",
  argTypes: logoCloudArgTypes(LogoCloudScatterField, logoCloudScatterFieldCopy),
  render: (args, context) => (
    <LogoCloudScatterField locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-scatter-field"]} {...args} />
  ),
}

export const ScatterFieldNoLogos: StoryObj<typeof LogoCloudScatterField> = {
  tags: ["!dev", "!autodocs"],
  name: "Scatter Field: No logos",
  argTypes: logoCloudArgTypes(LogoCloudScatterField, logoCloudScatterFieldCopy),
  render: (args, context) => <LogoCloudScatterField locale={localeOf(context)} {...args} />,
}

export const BentoLogoWall: StoryObj<typeof LogoCloudBentoLogoWall> = {
  name: "Bento Logo Wall",
  argTypes: logoCloudArgTypes(LogoCloudBentoLogoWall, logoCloudBentoLogoWallCopy),
  render: (args, context) => (
    <LogoCloudBentoLogoWall locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-bento-logo-wall"]} {...args} />
  ),
}

export const BentoLogoWallNoLogos: StoryObj<typeof LogoCloudBentoLogoWall> = {
  tags: ["!dev", "!autodocs"],
  name: "Bento Logo Wall: No logos",
  argTypes: logoCloudArgTypes(LogoCloudBentoLogoWall, logoCloudBentoLogoWallCopy),
  render: (args, context) => <LogoCloudBentoLogoWall locale={localeOf(context)} {...args} />,
}

export const DividerRuleRow: StoryObj<typeof LogoCloudDividerRuleRow> = {
  name: "Divider Rule Row",
  argTypes: logoCloudArgTypes(LogoCloudDividerRuleRow, logoCloudDividerRuleRowCopy),
  render: (args, context) => (
    <LogoCloudDividerRuleRow locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-divider-rule-row"]} {...args} />
  ),
}

export const DividerRuleRowNoLogos: StoryObj<typeof LogoCloudDividerRuleRow> = {
  tags: ["!dev", "!autodocs"],
  name: "Divider Rule Row: No logos",
  argTypes: logoCloudArgTypes(LogoCloudDividerRuleRow, logoCloudDividerRuleRowCopy),
  render: (args, context) => <LogoCloudDividerRuleRow locale={localeOf(context)} {...args} />,
}

export const PyramidRowStack: StoryObj<typeof LogoCloudPyramidRowStack> = {
  name: "Pyramid Row Stack",
  argTypes: logoCloudArgTypes(LogoCloudPyramidRowStack, logoCloudPyramidRowStackCopy),
  render: (args, context) => (
    <LogoCloudPyramidRowStack locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-pyramid-row-stack"]} {...args} />
  ),
}

export const PyramidRowStackNoLogos: StoryObj<typeof LogoCloudPyramidRowStack> = {
  tags: ["!dev", "!autodocs"],
  name: "Pyramid Row Stack: No logos",
  argTypes: logoCloudArgTypes(LogoCloudPyramidRowStack, logoCloudPyramidRowStackCopy),
  render: (args, context) => <LogoCloudPyramidRowStack locale={localeOf(context)} {...args} />,
}

export const TabbedIndustryFilter: StoryObj<typeof LogoCloudTabbedIndustryFilter> = {
  name: "Tabbed Industry Filter",
  argTypes: logoCloudArgTypes(LogoCloudTabbedIndustryFilter, logoCloudTabbedIndustryFilterCopy, ["filterLabel"]),
  args: { onIndustryChange: fn() },
  render: (args, context) => (
    <LogoCloudTabbedIndustryFilter locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-tabbed-industry-filter"]} {...args} />
  ),
}

export const TabbedIndustryFilterEmpty: StoryObj<typeof LogoCloudTabbedIndustryFilter> = {
  tags: ["!dev", "!autodocs"],
  name: "Tabbed Industry Filter: Empty industry",
  argTypes: logoCloudArgTypes(LogoCloudTabbedIndustryFilter, logoCloudTabbedIndustryFilterCopy, ["filterLabel"], ["empty"]),
  render: (args, context) => (
    <LogoCloudTabbedIndustryFilter
      locale={localeOf(context)}
      logos={LOGO_CLOUD_EXAMPLES.en["logo-cloud-tabbed-industry-filter"].logos.filter((item) => !item.industries.includes("health"))}
      defaultIndustry="health"
      {...args}
    />
  ),
}

export const TabbedIndustryFilterNoLogos: StoryObj<typeof LogoCloudTabbedIndustryFilter> = {
  tags: ["!dev", "!autodocs"],
  name: "Tabbed Industry Filter: No logos",
  argTypes: logoCloudArgTypes(LogoCloudTabbedIndustryFilter, logoCloudTabbedIndustryFilterCopy, ["filterLabel"]),
  render: (args, context) => <LogoCloudTabbedIndustryFilter locale={localeOf(context)} {...args} />,
}

export const GridClosingCta: StoryObj<typeof LogoCloudGridClosingCta> = {
  name: "Grid Closing CTA",
  argTypes: logoCloudArgTypes(LogoCloudGridClosingCta, logoCloudGridClosingCtaCopy),
  render: (args, context) => (
    <LogoCloudGridClosingCta locale={localeOf(context)} {...LOGO_CLOUD_EXAMPLES[localeOf(context)]["logo-cloud-grid-closing-cta"]} {...args} />
  ),
}

export const GridClosingCtaNoLogos: StoryObj<typeof LogoCloudGridClosingCta> = {
  tags: ["!dev", "!autodocs"],
  name: "Grid Closing CTA: No logos",
  argTypes: logoCloudArgTypes(LogoCloudGridClosingCta, logoCloudGridClosingCtaCopy),
  render: (args, context) => <LogoCloudGridClosingCta locale={localeOf(context)} {...args} />,
}
