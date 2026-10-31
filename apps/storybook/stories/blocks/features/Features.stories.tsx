import type { Meta, StoryObj } from "@storybook/react"
import { FeaturesIconCardGrid, featuresIconCardGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-icon-card-grid/FeaturesIconCardGrid"
import { FeaturesCompactIconIndex, featuresCompactIconIndexCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-compact-icon-index/FeaturesCompactIconIndex"
import { FeaturesNumberedFeatureRows, featuresNumberedFeatureRowsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-numbered-feature-rows/FeaturesNumberedFeatureRows"
import { FeaturesFeatureChecklistColumns, featuresFeatureChecklistColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-feature-checklist-columns/FeaturesFeatureChecklistColumns"
import { FeaturesColourBlockCards, featuresColourBlockCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-colour-block-cards/FeaturesColourBlockCards"
import { FeaturesStatFeatureBand, featuresStatFeatureBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-stat-feature-band/FeaturesStatFeatureBand"
import { featuresArgTypes, featuresViewports, localeOf } from "./features-story-kit"

/**
 * Features: the Types of the Figma set, one block each, in the order of its
 * documentation. Viewport, direction and theme come from the toolbar; each
 * story shows the copy Figma has for that direction. A Type's extra state (no
 * cards, or no photos) is tagged `!dev` and `!autodocs`: hidden from the sidebar
 * and the Docs page, still built, so tests and visual checks reach it by id.
 */

const meta: Meta = {
  title: "Blocks/Features",
  parameters: { layout: "fullscreen", viewport: { viewports: featuresViewports } },
  tags: ["autodocs"],
}

export default meta

export const IconCardGrid: StoryObj<typeof FeaturesIconCardGrid> = {
  name: "Icon Card Grid",
  argTypes: featuresArgTypes(FeaturesIconCardGrid, featuresIconCardGridCopy, []),
  render: (args, context) => <FeaturesIconCardGrid locale={localeOf(context)} {...args} />,
}

export const IconCardGridEmpty: StoryObj<typeof FeaturesIconCardGrid> = {
  name: "Icon Card Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesIconCardGrid, featuresIconCardGridCopy, []),
  render: (args, context) => <FeaturesIconCardGrid locale={localeOf(context)} cards={[]} {...args} />,
}

export const CompactIconIndex: StoryObj<typeof FeaturesCompactIconIndex> = {
  name: "Compact Icon Index",
  argTypes: featuresArgTypes(FeaturesCompactIconIndex, featuresCompactIconIndexCopy, []),
  render: (args, context) => <FeaturesCompactIconIndex locale={localeOf(context)} {...args} />,
}

export const CompactIconIndexEmpty: StoryObj<typeof FeaturesCompactIconIndex> = {
  name: "Compact Icon Index: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesCompactIconIndex, featuresCompactIconIndexCopy, []),
  render: (args, context) => <FeaturesCompactIconIndex locale={localeOf(context)} items={[]} {...args} />,
}

export const NumberedFeatureRows: StoryObj<typeof FeaturesNumberedFeatureRows> = {
  name: "Numbered Feature Rows",
  argTypes: featuresArgTypes(FeaturesNumberedFeatureRows, featuresNumberedFeatureRowsCopy, []),
  render: (args, context) => <FeaturesNumberedFeatureRows locale={localeOf(context)} {...args} />,
}

export const NumberedFeatureRowsEmpty: StoryObj<typeof FeaturesNumberedFeatureRows> = {
  name: "Numbered Feature Rows: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesNumberedFeatureRows, featuresNumberedFeatureRowsCopy, []),
  render: (args, context) => <FeaturesNumberedFeatureRows locale={localeOf(context)} features={[]} {...args} />,
}

export const FeatureChecklistColumns: StoryObj<typeof FeaturesFeatureChecklistColumns> = {
  name: "Feature Checklist Columns",
  argTypes: featuresArgTypes(FeaturesFeatureChecklistColumns, featuresFeatureChecklistColumnsCopy, []),
  render: (args, context) => <FeaturesFeatureChecklistColumns locale={localeOf(context)} {...args} />,
}

export const FeatureChecklistColumnsEmpty: StoryObj<typeof FeaturesFeatureChecklistColumns> = {
  name: "Feature Checklist Columns: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesFeatureChecklistColumns, featuresFeatureChecklistColumnsCopy, []),
  render: (args, context) => <FeaturesFeatureChecklistColumns locale={localeOf(context)} columns={[]} {...args} />,
}

export const ColourBlockCards: StoryObj<typeof FeaturesColourBlockCards> = {
  name: "Colour Block Cards",
  argTypes: featuresArgTypes(FeaturesColourBlockCards, featuresColourBlockCardsCopy, []),
  render: (args, context) => <FeaturesColourBlockCards locale={localeOf(context)} {...args} />,
}

export const ColourBlockCardsEmpty: StoryObj<typeof FeaturesColourBlockCards> = {
  name: "Colour Block Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesColourBlockCards, featuresColourBlockCardsCopy, []),
  render: (args, context) => <FeaturesColourBlockCards locale={localeOf(context)} cards={[]} {...args} />,
}

export const StatFeatureBand: StoryObj<typeof FeaturesStatFeatureBand> = {
  name: "Stat Feature Band",
  argTypes: featuresArgTypes(FeaturesStatFeatureBand, featuresStatFeatureBandCopy, []),
  render: (args, context) => <FeaturesStatFeatureBand locale={localeOf(context)} {...args} />,
}

export const StatFeatureBandEmpty: StoryObj<typeof FeaturesStatFeatureBand> = {
  name: "Stat Feature Band: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesStatFeatureBand, featuresStatFeatureBandCopy, []),
  render: (args, context) => <FeaturesStatFeatureBand locale={localeOf(context)} stats={[]} {...args} />,
}
