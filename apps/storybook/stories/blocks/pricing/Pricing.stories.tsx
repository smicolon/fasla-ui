import type { Meta, StoryObj } from "@storybook/react"
import { PricingTiers as PricingTiersBlock, pricingTiersCopy } from "../../../../../packages/fasla-ui/registry/blocks/pricing-tiers/PricingTiers"
import { PricingTwoPlanCompare, pricingTwoPlanCompareCopy } from "../../../../../packages/fasla-ui/registry/blocks/pricing-two-plan-compare/PricingTwoPlanCompare"
import { PricingPlanSpotlight, pricingPlanSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/pricing-plan-spotlight/PricingPlanSpotlight"
import { PricingComparisonMatrix, pricingComparisonMatrixCopy } from "../../../../../packages/fasla-ui/registry/blocks/pricing-comparison-matrix/PricingComparisonMatrix"
import { PricingPlanPickerSummary, pricingPlanPickerSummaryCopy } from "../../../../../packages/fasla-ui/registry/blocks/pricing-plan-picker-summary/PricingPlanPickerSummary"
import { localeOf, pricingArgTypes, pricingViewports } from "./pricing-story-kit"

/**
 * Pricing: the 5 Types of the Figma set, one block each. Three compare plans
 * (tier cards, two plans side by side, a full matrix); two are built around a
 * choice (one plan's billing options, and a plan list beside an order
 * summary). Viewport, direction and theme come from the toolbar.
 */
const meta: Meta = {
  title: "Blocks/Pricing",
  parameters: { layout: "fullscreen", viewport: { viewports: pricingViewports } },
  tags: ["autodocs"],
}

export default meta

export const PricingTiers: StoryObj<typeof PricingTiersBlock> = {
  name: "Pricing Tiers",
  argTypes: pricingArgTypes(PricingTiersBlock, pricingTiersCopy),
  render: (args, context) => <PricingTiersBlock locale={localeOf(context)} {...args} />,
}

export const TwoPlanCompare: StoryObj<typeof PricingTwoPlanCompare> = {
  name: "Two-Plan Compare",
  argTypes: pricingArgTypes(PricingTwoPlanCompare, pricingTwoPlanCompareCopy),
  render: (args, context) => <PricingTwoPlanCompare locale={localeOf(context)} {...args} />,
}

export const PlanSpotlight: StoryObj<typeof PricingPlanSpotlight> = {
  name: "Plan Spotlight",
  argTypes: pricingArgTypes(PricingPlanSpotlight, pricingPlanSpotlightCopy),
  render: (args, context) => <PricingPlanSpotlight locale={localeOf(context)} {...args} />,
}

export const ComparisonMatrix: StoryObj<typeof PricingComparisonMatrix> = {
  name: "Comparison Matrix",
  argTypes: pricingArgTypes(PricingComparisonMatrix, pricingComparisonMatrixCopy, ["includedLabel", "notIncludedLabel"]),
  render: (args, context) => <PricingComparisonMatrix locale={localeOf(context)} {...args} />,
}

export const PlanPickerSummary: StoryObj<typeof PricingPlanPickerSummary> = {
  name: "Plan Picker + Summary",
  argTypes: pricingArgTypes(PricingPlanPickerSummary, pricingPlanPickerSummaryCopy),
  render: (args, context) => <PricingPlanPickerSummary locale={localeOf(context)} {...args} />,
}
