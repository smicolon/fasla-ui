import type { Meta, StoryObj } from "@storybook/react"
import { FeaturesIconCardGrid, featuresIconCardGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-icon-card-grid/FeaturesIconCardGrid"
import { FeaturesCompactIconIndex, featuresCompactIconIndexCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-compact-icon-index/FeaturesCompactIconIndex"
import { FeaturesNumberedFeatureRows, featuresNumberedFeatureRowsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-numbered-feature-rows/FeaturesNumberedFeatureRows"
import { FeaturesFeatureChecklistColumns, featuresFeatureChecklistColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-feature-checklist-columns/FeaturesFeatureChecklistColumns"
import { FeaturesColourBlockCards, featuresColourBlockCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-colour-block-cards/FeaturesColourBlockCards"
import { FeaturesStatFeatureBand, featuresStatFeatureBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-stat-feature-band/FeaturesStatFeatureBand"
import { FeaturesSplitPhotoIconList, featuresSplitPhotoIconListCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-split-photo-icon-list/FeaturesSplitPhotoIconList"
import { FeaturesPhotoBento, featuresPhotoBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-photo-bento/FeaturesPhotoBento"
import { FeaturesDarkPhotoPanel, featuresDarkPhotoPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-dark-photo-panel/FeaturesDarkPhotoPanel"
import { FeaturesOverlayCaptionCards, featuresOverlayCaptionCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-overlay-caption-cards/FeaturesOverlayCaptionCards"
import { FeaturesFeatureListThumbnails, featuresFeatureListThumbnailsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-feature-list-thumbnails/FeaturesFeatureListThumbnails"
import { FeaturesPhotoFeatureChips, featuresPhotoFeatureChipsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-photo-feature-chips/FeaturesPhotoFeatureChips"
import { FeaturesMediaRail, featuresMediaRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-media-rail/FeaturesMediaRail"
import { FeaturesFullBleedPhotoBanner, featuresFullBleedPhotoBannerCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-full-bleed-photo-banner/FeaturesFullBleedPhotoBanner"
import { FeaturesEditorialPhotoSplit, featuresEditorialPhotoSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-editorial-photo-split/FeaturesEditorialPhotoSplit"
import { FeaturesPhotoCollage, featuresPhotoCollageCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-photo-collage/FeaturesPhotoCollage"
import { FeaturesNotchedPhotoColumns, featuresNotchedPhotoColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-notched-photo-columns/FeaturesNotchedPhotoColumns"
import { FeaturesPerforatedPhotoStrip, featuresPerforatedPhotoStripCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-perforated-photo-strip/FeaturesPerforatedPhotoStrip"
import { FeaturesPortraitPhotoCardsLinkRow, featuresPortraitPhotoCardsLinkRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-portrait-photo-cards-link-row/FeaturesPortraitPhotoCardsLinkRow"
import { FeaturesPhotoCarousel, featuresPhotoCarouselCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-photo-carousel/FeaturesPhotoCarousel"
import { FeaturesPhotoTabsPanel, featuresPhotoTabsPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-photo-tabs-panel/FeaturesPhotoTabsPanel"
import { FeaturesAccordionPhoto, featuresAccordionPhotoCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-accordion-photo/FeaturesAccordionPhoto"
import { FeaturesExpandingStepCards, featuresExpandingStepCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-expanding-step-cards/FeaturesExpandingStepCards"
import { FeaturesComparePanelsChatAnswer, featuresComparePanelsChatAnswerCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-compare-panels-chat-answer/FeaturesComparePanelsChatAnswer"
import { FeaturesNumberedStepsFloatingCards, featuresNumberedStepsFloatingCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-numbered-steps-floating-cards/FeaturesNumberedStepsFloatingCards"
import { FeaturesSolidColourCards, featuresSolidColourCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-solid-colour-cards/FeaturesSolidColourCards"
import { FeaturesIconTitledPreviewRail, featuresIconTitledPreviewRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-icon-titled-preview-rail/FeaturesIconTitledPreviewRail"
import { FeaturesTintedProductBento, featuresTintedProductBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-tinted-product-bento/FeaturesTintedProductBento"
import { FeaturesShowcaseCardPair, featuresShowcaseCardPairCopy } from "../../../../../packages/fasla-ui/registry/blocks/features-showcase-card-pair/FeaturesShowcaseCardPair"
import { featuresArgTypes, featuresViewports, localeOf, photoPropsOf } from "./features-story-kit"

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

export const SplitPhotoIconList: StoryObj<typeof FeaturesSplitPhotoIconList> = {
  name: "Split Photo + Icon List",
  argTypes: featuresArgTypes(FeaturesSplitPhotoIconList, featuresSplitPhotoIconListCopy, []),
  render: (args, context) => <FeaturesSplitPhotoIconList locale={localeOf(context)} {...photoPropsOf("split-photo-icon-list", context, featuresSplitPhotoIconListCopy)} {...args} />,
}

export const SplitPhotoIconListEmpty: StoryObj<typeof FeaturesSplitPhotoIconList> = {
  name: "Split Photo + Icon List: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesSplitPhotoIconList, featuresSplitPhotoIconListCopy, []),
  render: (args, context) => <FeaturesSplitPhotoIconList locale={localeOf(context)}  {...args} />,
}

export const PhotoBento: StoryObj<typeof FeaturesPhotoBento> = {
  name: "Photo Bento",
  argTypes: featuresArgTypes(FeaturesPhotoBento, featuresPhotoBentoCopy, []),
  render: (args, context) => <FeaturesPhotoBento locale={localeOf(context)} {...photoPropsOf("photo-bento", context, featuresPhotoBentoCopy)} {...args} />,
}

export const PhotoBentoEmpty: StoryObj<typeof FeaturesPhotoBento> = {
  name: "Photo Bento: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPhotoBento, featuresPhotoBentoCopy, []),
  render: (args, context) => <FeaturesPhotoBento locale={localeOf(context)}  {...args} />,
}

export const DarkPhotoPanel: StoryObj<typeof FeaturesDarkPhotoPanel> = {
  name: "Dark Photo Panel",
  argTypes: featuresArgTypes(FeaturesDarkPhotoPanel, featuresDarkPhotoPanelCopy, []),
  render: (args, context) => <FeaturesDarkPhotoPanel locale={localeOf(context)} {...photoPropsOf("dark-photo-panel", context, featuresDarkPhotoPanelCopy)} {...args} />,
}

export const DarkPhotoPanelEmpty: StoryObj<typeof FeaturesDarkPhotoPanel> = {
  name: "Dark Photo Panel: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesDarkPhotoPanel, featuresDarkPhotoPanelCopy, []),
  render: (args, context) => <FeaturesDarkPhotoPanel locale={localeOf(context)}  {...args} />,
}

export const OverlayCaptionCards: StoryObj<typeof FeaturesOverlayCaptionCards> = {
  name: "Overlay Caption Cards",
  argTypes: featuresArgTypes(FeaturesOverlayCaptionCards, featuresOverlayCaptionCardsCopy, []),
  render: (args, context) => <FeaturesOverlayCaptionCards locale={localeOf(context)} {...photoPropsOf("overlay-caption-cards", context, featuresOverlayCaptionCardsCopy)} {...args} />,
}

export const OverlayCaptionCardsEmpty: StoryObj<typeof FeaturesOverlayCaptionCards> = {
  name: "Overlay Caption Cards: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesOverlayCaptionCards, featuresOverlayCaptionCardsCopy, []),
  render: (args, context) => <FeaturesOverlayCaptionCards locale={localeOf(context)}  {...args} />,
}

export const FeatureListThumbnails: StoryObj<typeof FeaturesFeatureListThumbnails> = {
  name: "Feature List + Thumbnails",
  argTypes: featuresArgTypes(FeaturesFeatureListThumbnails, featuresFeatureListThumbnailsCopy, []),
  render: (args, context) => <FeaturesFeatureListThumbnails locale={localeOf(context)} {...photoPropsOf("feature-list-thumbnails", context, featuresFeatureListThumbnailsCopy)} {...args} />,
}

export const FeatureListThumbnailsEmpty: StoryObj<typeof FeaturesFeatureListThumbnails> = {
  name: "Feature List + Thumbnails: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesFeatureListThumbnails, featuresFeatureListThumbnailsCopy, []),
  render: (args, context) => <FeaturesFeatureListThumbnails locale={localeOf(context)}  {...args} />,
}

export const PhotoFeatureChips: StoryObj<typeof FeaturesPhotoFeatureChips> = {
  name: "Photo + Feature Chips",
  argTypes: featuresArgTypes(FeaturesPhotoFeatureChips, featuresPhotoFeatureChipsCopy, []),
  render: (args, context) => <FeaturesPhotoFeatureChips locale={localeOf(context)} {...photoPropsOf("photo-feature-chips", context, featuresPhotoFeatureChipsCopy)} {...args} />,
}

export const PhotoFeatureChipsEmpty: StoryObj<typeof FeaturesPhotoFeatureChips> = {
  name: "Photo + Feature Chips: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPhotoFeatureChips, featuresPhotoFeatureChipsCopy, []),
  render: (args, context) => <FeaturesPhotoFeatureChips locale={localeOf(context)}  {...args} />,
}

export const MediaRail: StoryObj<typeof FeaturesMediaRail> = {
  name: "Media Rail",
  argTypes: featuresArgTypes(FeaturesMediaRail, featuresMediaRailCopy, []),
  render: (args, context) => <FeaturesMediaRail locale={localeOf(context)} {...photoPropsOf("media-rail", context, featuresMediaRailCopy)} {...args} />,
}

export const MediaRailEmpty: StoryObj<typeof FeaturesMediaRail> = {
  name: "Media Rail: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesMediaRail, featuresMediaRailCopy, []),
  render: (args, context) => <FeaturesMediaRail locale={localeOf(context)}  {...args} />,
}

export const FullBleedPhotoBanner: StoryObj<typeof FeaturesFullBleedPhotoBanner> = {
  name: "Full-Bleed Photo Banner",
  argTypes: featuresArgTypes(FeaturesFullBleedPhotoBanner, featuresFullBleedPhotoBannerCopy, []),
  render: (args, context) => <FeaturesFullBleedPhotoBanner locale={localeOf(context)} {...photoPropsOf("full-bleed-photo-banner", context, featuresFullBleedPhotoBannerCopy)} {...args} />,
}

export const FullBleedPhotoBannerEmpty: StoryObj<typeof FeaturesFullBleedPhotoBanner> = {
  name: "Full-Bleed Photo Banner: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesFullBleedPhotoBanner, featuresFullBleedPhotoBannerCopy, []),
  render: (args, context) => <FeaturesFullBleedPhotoBanner locale={localeOf(context)}  {...args} />,
}

export const EditorialPhotoSplit: StoryObj<typeof FeaturesEditorialPhotoSplit> = {
  name: "Editorial Photo Split",
  argTypes: featuresArgTypes(FeaturesEditorialPhotoSplit, featuresEditorialPhotoSplitCopy, []),
  render: (args, context) => <FeaturesEditorialPhotoSplit locale={localeOf(context)} {...photoPropsOf("editorial-photo-split", context, featuresEditorialPhotoSplitCopy)} {...args} />,
}

export const EditorialPhotoSplitEmpty: StoryObj<typeof FeaturesEditorialPhotoSplit> = {
  name: "Editorial Photo Split: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesEditorialPhotoSplit, featuresEditorialPhotoSplitCopy, []),
  render: (args, context) => <FeaturesEditorialPhotoSplit locale={localeOf(context)}  {...args} />,
}

export const PhotoCollage: StoryObj<typeof FeaturesPhotoCollage> = {
  name: "Photo Collage",
  argTypes: featuresArgTypes(FeaturesPhotoCollage, featuresPhotoCollageCopy, []),
  render: (args, context) => <FeaturesPhotoCollage locale={localeOf(context)} {...photoPropsOf("photo-collage", context, featuresPhotoCollageCopy)} {...args} />,
}

export const PhotoCollageEmpty: StoryObj<typeof FeaturesPhotoCollage> = {
  name: "Photo Collage: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPhotoCollage, featuresPhotoCollageCopy, []),
  render: (args, context) => <FeaturesPhotoCollage locale={localeOf(context)}  {...args} />,
}

export const NotchedPhotoColumns: StoryObj<typeof FeaturesNotchedPhotoColumns> = {
  name: "Notched Photo Columns",
  argTypes: featuresArgTypes(FeaturesNotchedPhotoColumns, featuresNotchedPhotoColumnsCopy, []),
  render: (args, context) => <FeaturesNotchedPhotoColumns locale={localeOf(context)} {...photoPropsOf("notched-photo-columns", context, featuresNotchedPhotoColumnsCopy)} {...args} />,
}

export const NotchedPhotoColumnsEmpty: StoryObj<typeof FeaturesNotchedPhotoColumns> = {
  name: "Notched Photo Columns: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesNotchedPhotoColumns, featuresNotchedPhotoColumnsCopy, []),
  render: (args, context) => <FeaturesNotchedPhotoColumns locale={localeOf(context)}  {...args} />,
}

export const PerforatedPhotoStrip: StoryObj<typeof FeaturesPerforatedPhotoStrip> = {
  name: "Perforated Photo Strip",
  argTypes: featuresArgTypes(FeaturesPerforatedPhotoStrip, featuresPerforatedPhotoStripCopy, []),
  render: (args, context) => <FeaturesPerforatedPhotoStrip locale={localeOf(context)} {...photoPropsOf("perforated-photo-strip", context, featuresPerforatedPhotoStripCopy)} {...args} />,
}

export const PerforatedPhotoStripEmpty: StoryObj<typeof FeaturesPerforatedPhotoStrip> = {
  name: "Perforated Photo Strip: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPerforatedPhotoStrip, featuresPerforatedPhotoStripCopy, []),
  render: (args, context) => <FeaturesPerforatedPhotoStrip locale={localeOf(context)}  {...args} />,
}

export const PortraitPhotoCardsLinkRow: StoryObj<typeof FeaturesPortraitPhotoCardsLinkRow> = {
  name: "Portrait Photo Cards + Link Row",
  argTypes: featuresArgTypes(FeaturesPortraitPhotoCardsLinkRow, featuresPortraitPhotoCardsLinkRowCopy, []),
  render: (args, context) => <FeaturesPortraitPhotoCardsLinkRow locale={localeOf(context)} {...photoPropsOf("portrait-photo-cards-link-row", context, featuresPortraitPhotoCardsLinkRowCopy)} {...args} />,
}

export const PortraitPhotoCardsLinkRowEmpty: StoryObj<typeof FeaturesPortraitPhotoCardsLinkRow> = {
  name: "Portrait Photo Cards + Link Row: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPortraitPhotoCardsLinkRow, featuresPortraitPhotoCardsLinkRowCopy, []),
  render: (args, context) => <FeaturesPortraitPhotoCardsLinkRow locale={localeOf(context)}  {...args} />,
}

export const PhotoCarousel: StoryObj<typeof FeaturesPhotoCarousel> = {
  name: "Photo Carousel",
  argTypes: featuresArgTypes(FeaturesPhotoCarousel, featuresPhotoCarouselCopy, []),
  render: (args, context) => <FeaturesPhotoCarousel locale={localeOf(context)} {...photoPropsOf("photo-carousel", context, featuresPhotoCarouselCopy)} {...args} />,
}

export const PhotoCarouselEmpty: StoryObj<typeof FeaturesPhotoCarousel> = {
  name: "Photo Carousel: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPhotoCarousel, featuresPhotoCarouselCopy, []),
  render: (args, context) => <FeaturesPhotoCarousel locale={localeOf(context)}  {...args} />,
}

export const PhotoTabsPanel: StoryObj<typeof FeaturesPhotoTabsPanel> = {
  name: "Photo Tabs Panel",
  argTypes: featuresArgTypes(FeaturesPhotoTabsPanel, featuresPhotoTabsPanelCopy, []),
  render: (args, context) => <FeaturesPhotoTabsPanel locale={localeOf(context)} {...photoPropsOf("photo-tabs-panel", context, featuresPhotoTabsPanelCopy)} {...args} />,
}

export const PhotoTabsPanelEmpty: StoryObj<typeof FeaturesPhotoTabsPanel> = {
  name: "Photo Tabs Panel: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesPhotoTabsPanel, featuresPhotoTabsPanelCopy, []),
  render: (args, context) => <FeaturesPhotoTabsPanel locale={localeOf(context)}  {...args} />,
}

export const AccordionPhoto: StoryObj<typeof FeaturesAccordionPhoto> = {
  name: "Accordion + Photo",
  argTypes: featuresArgTypes(FeaturesAccordionPhoto, featuresAccordionPhotoCopy, []),
  render: (args, context) => <FeaturesAccordionPhoto locale={localeOf(context)} {...photoPropsOf("accordion-photo", context, featuresAccordionPhotoCopy)} {...args} />,
}

export const AccordionPhotoEmpty: StoryObj<typeof FeaturesAccordionPhoto> = {
  name: "Accordion + Photo: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesAccordionPhoto, featuresAccordionPhotoCopy, []),
  render: (args, context) => <FeaturesAccordionPhoto locale={localeOf(context)}  {...args} />,
}

export const ExpandingStepCards: StoryObj<typeof FeaturesExpandingStepCards> = {
  name: "Expanding Step Cards",
  argTypes: featuresArgTypes(FeaturesExpandingStepCards, featuresExpandingStepCardsCopy, []),
  render: (args, context) => <FeaturesExpandingStepCards locale={localeOf(context)} {...args} />,
}

export const ComparePanelsChatAnswer: StoryObj<typeof FeaturesComparePanelsChatAnswer> = {
  name: "Compare Panels + Chat Answer",
  argTypes: featuresArgTypes(FeaturesComparePanelsChatAnswer, featuresComparePanelsChatAnswerCopy, []),
  render: (args, context) => <FeaturesComparePanelsChatAnswer locale={localeOf(context)} {...args} />,
}

export const NumberedStepsFloatingCards: StoryObj<typeof FeaturesNumberedStepsFloatingCards> = {
  name: "Numbered Steps + Floating Cards",
  argTypes: featuresArgTypes(FeaturesNumberedStepsFloatingCards, featuresNumberedStepsFloatingCardsCopy, []),
  render: (args, context) => <FeaturesNumberedStepsFloatingCards locale={localeOf(context)} {...photoPropsOf("numbered-steps-floating-cards", context, featuresNumberedStepsFloatingCardsCopy)} {...args} />,
}

export const NumberedStepsFloatingCardsEmpty: StoryObj<typeof FeaturesNumberedStepsFloatingCards> = {
  name: "Numbered Steps + Floating Cards: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesNumberedStepsFloatingCards, featuresNumberedStepsFloatingCardsCopy, []),
  render: (args, context) => <FeaturesNumberedStepsFloatingCards locale={localeOf(context)}  {...args} />,
}

export const SolidColourCards: StoryObj<typeof FeaturesSolidColourCards> = {
  name: "Solid Colour Cards",
  argTypes: featuresArgTypes(FeaturesSolidColourCards, featuresSolidColourCardsCopy, []),
  render: (args, context) => <FeaturesSolidColourCards locale={localeOf(context)} {...args} />,
}

export const IconTitledPreviewRail: StoryObj<typeof FeaturesIconTitledPreviewRail> = {
  name: "Icon-Titled Preview Rail",
  argTypes: featuresArgTypes(FeaturesIconTitledPreviewRail, featuresIconTitledPreviewRailCopy, []),
  render: (args, context) => <FeaturesIconTitledPreviewRail locale={localeOf(context)} {...photoPropsOf("icon-titled-preview-rail", context, featuresIconTitledPreviewRailCopy)} {...args} />,
}

export const IconTitledPreviewRailEmpty: StoryObj<typeof FeaturesIconTitledPreviewRail> = {
  name: "Icon-Titled Preview Rail: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesIconTitledPreviewRail, featuresIconTitledPreviewRailCopy, []),
  render: (args, context) => <FeaturesIconTitledPreviewRail locale={localeOf(context)}  {...args} />,
}

export const TintedProductBento: StoryObj<typeof FeaturesTintedProductBento> = {
  name: "Tinted Product Bento",
  argTypes: featuresArgTypes(FeaturesTintedProductBento, featuresTintedProductBentoCopy, []),
  render: (args, context) => <FeaturesTintedProductBento locale={localeOf(context)} {...args} />,
}

export const ShowcaseCardPair: StoryObj<typeof FeaturesShowcaseCardPair> = {
  name: "Showcase Card Pair",
  argTypes: featuresArgTypes(FeaturesShowcaseCardPair, featuresShowcaseCardPairCopy, []),
  render: (args, context) => <FeaturesShowcaseCardPair locale={localeOf(context)} {...photoPropsOf("showcase-card-pair", context, featuresShowcaseCardPairCopy)} {...args} />,
}

export const ShowcaseCardPairEmpty: StoryObj<typeof FeaturesShowcaseCardPair> = {
  name: "Showcase Card Pair: Without photos",
  tags: ["!dev", "!autodocs"],
  argTypes: featuresArgTypes(FeaturesShowcaseCardPair, featuresShowcaseCardPairCopy, []),
  render: (args, context) => <FeaturesShowcaseCardPair locale={localeOf(context)}  {...args} />,
}
