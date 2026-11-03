import type { Meta, StoryObj } from "@storybook/react"
import { HowItWorksSixCardGrid, howItWorksSixCardGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-six-card-grid/HowItWorksSixCardGrid"
import { HowItWorksColumnPanels, howItWorksColumnPanelsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-column-panels/HowItWorksColumnPanels"
import {
  HowItWorksNumberedInstructionPanels,
  howItWorksNumberedInstructionPanelsCopy,
} from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-numbered-instruction-panels/HowItWorksNumberedInstructionPanels"
import {
  HowItWorksNumberedEditorialRows,
  howItWorksNumberedEditorialRowsCopy,
} from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-numbered-editorial-rows/HowItWorksNumberedEditorialRows"
import { HowItWorksSplitFeatureBand, howItWorksSplitFeatureBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-split-feature-band/HowItWorksSplitFeatureBand"
import {
  HowItWorksRoundedCardsDeviceCrop,
  howItWorksRoundedCardsDeviceCropCopy,
} from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-rounded-cards-device-crop/HowItWorksRoundedCardsDeviceCrop"
import { HowItWorksNumberedPhotoSteps, howItWorksNumberedPhotoStepsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-numbered-photo-steps/HowItWorksNumberedPhotoSteps"
import { HowItWorksSplitPhotoStepList, howItWorksSplitPhotoStepListCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-split-photo-step-list/HowItWorksSplitPhotoStepList"
import { HowItWorksFullBleedStepPanel, howItWorksFullBleedStepPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-full-bleed-step-panel/HowItWorksFullBleedStepPanel"
import { HowItWorksOverlayNumeralCards, howItWorksOverlayNumeralCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-overlay-numeral-cards/HowItWorksOverlayNumeralCards"
import { HowItWorksDiagonalPhotoCollage, howItWorksDiagonalPhotoCollageCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-diagonal-photo-collage/HowItWorksDiagonalPhotoCollage"
import { HowItWorksPhotoBentoSteps, howItWorksPhotoBentoStepsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-photo-bento-steps/HowItWorksPhotoBentoSteps"
import { HowItWorksFannedDissolveCards, howItWorksFannedDissolveCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-fanned-dissolve-cards/HowItWorksFannedDissolveCards"
import { HowItWorksStackedMediaText, howItWorksStackedMediaTextCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-stacked-media-text/HowItWorksStackedMediaText"
import { HowItWorksPhotoRailProgress, howItWorksPhotoRailProgressCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-photo-rail-progress/HowItWorksPhotoRailProgress"
import { HowItWorksTallVisualRail, howItWorksTallVisualRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-tall-visual-rail/HowItWorksTallVisualRail"
import { HowItWorksStepTabsPhotoPanel, howItWorksStepTabsPhotoPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-step-tabs-photo-panel/HowItWorksStepTabsPhotoPanel"
import { HowItWorksAccordionSteps, howItWorksAccordionStepsCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-accordion-steps/HowItWorksAccordionSteps"
import { HowItWorksOrbitalProcess, howItWorksOrbitalProcessCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-orbital-process/HowItWorksOrbitalProcess"
import { HowItWorksCenterSpineTimeline, howItWorksCenterSpineTimelineCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-center-spine-timeline/HowItWorksCenterSpineTimeline"
import { HowItWorksVerticalTimelineCard, howItWorksVerticalTimelineCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-vertical-timeline-card/HowItWorksVerticalTimelineCard"
import { HowItWorksContainedTimeline, howItWorksContainedTimelineCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-contained-timeline/HowItWorksContainedTimeline"
import { HowItWorksPhaseLine, howItWorksPhaseLineCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-phase-line/HowItWorksPhaseLine"
import { HowItWorksPillTimeline, howItWorksPillTimelineCopy } from "../../../../../packages/fasla-ui/registry/blocks/how-it-works-pill-timeline/HowItWorksPillTimeline"
import { howItWorksArgTypes, howItWorksViewports, localeOf, photoPropsOf } from "./how-it-works-story-kit"

/**
 * How it Works: the Types of the Figma set, one block each. The visual steps
 * come first: photo cards, a photo beside a step list, a panel that shows one
 * step at a time, photo cards with a numeral on them, a tilted collage, a bento,
 * cards that fan out and dissolve, and cards stacked on soft glows. Then the
 * grids and panels: six cards with a drawn picture each, three panels
 * divided by hairlines, three numbered steps, a list of numbered rows, two
 * bands beside pictures on soft glows, and three cards with a cropped phone.
 * Each plays its motion once when it comes into view, and shows its finished
 * state under reduced motion. Viewport, direction and theme come from the
 * toolbar.
 */
const meta: Meta = {
  title: "Blocks/How it Works",
  parameters: { layout: "fullscreen", viewport: { viewports: howItWorksViewports } },
  tags: ["autodocs"],
}

export default meta

export const NumberedPhotoSteps: StoryObj<typeof HowItWorksNumberedPhotoSteps> = {
  name: "Numbered Photo Steps",
  argTypes: howItWorksArgTypes(HowItWorksNumberedPhotoSteps, howItWorksNumberedPhotoStepsCopy),
  render: (args, context) => <HowItWorksNumberedPhotoSteps locale={localeOf(context)} {...photoPropsOf("numbered-photo-steps", context)} {...args} />,
}

export const SplitPhotoStepList: StoryObj<typeof HowItWorksSplitPhotoStepList> = {
  name: "Split Photo + Step List",
  argTypes: howItWorksArgTypes(HowItWorksSplitPhotoStepList, howItWorksSplitPhotoStepListCopy),
  render: (args, context) => <HowItWorksSplitPhotoStepList locale={localeOf(context)} {...photoPropsOf("split-photo-step-list", context)} {...args} />,
}

export const FullBleedStepPanel: StoryObj<typeof HowItWorksFullBleedStepPanel> = {
  name: "Full-Bleed Step Panel",
  argTypes: howItWorksArgTypes(HowItWorksFullBleedStepPanel, howItWorksFullBleedStepPanelCopy, ["stepsLabel", "stepLabel"]),
  render: (args, context) => <HowItWorksFullBleedStepPanel locale={localeOf(context)} {...photoPropsOf("full-bleed-step-panel", context)} {...args} />,
}

export const OverlayNumeralCards: StoryObj<typeof HowItWorksOverlayNumeralCards> = {
  name: "Overlay Numeral Cards",
  argTypes: howItWorksArgTypes(HowItWorksOverlayNumeralCards, howItWorksOverlayNumeralCardsCopy),
  render: (args, context) => <HowItWorksOverlayNumeralCards locale={localeOf(context)} {...photoPropsOf("overlay-numeral-cards", context)} {...args} />,
}

export const DiagonalPhotoCollage: StoryObj<typeof HowItWorksDiagonalPhotoCollage> = {
  name: "Diagonal Photo Collage",
  argTypes: howItWorksArgTypes(HowItWorksDiagonalPhotoCollage, howItWorksDiagonalPhotoCollageCopy),
  render: (args, context) => <HowItWorksDiagonalPhotoCollage locale={localeOf(context)} {...photoPropsOf("diagonal-photo-collage", context)} {...args} />,
}

export const PhotoBentoSteps: StoryObj<typeof HowItWorksPhotoBentoSteps> = {
  name: "Photo Bento Steps",
  argTypes: howItWorksArgTypes(HowItWorksPhotoBentoSteps, howItWorksPhotoBentoStepsCopy),
  render: (args, context) => <HowItWorksPhotoBentoSteps locale={localeOf(context)} {...photoPropsOf("photo-bento-steps", context)} {...args} />,
}

export const FannedDissolveCards: StoryObj<typeof HowItWorksFannedDissolveCards> = {
  name: "Fanned Dissolve Cards",
  argTypes: howItWorksArgTypes(HowItWorksFannedDissolveCards, howItWorksFannedDissolveCardsCopy),
  render: (args, context) => <HowItWorksFannedDissolveCards locale={localeOf(context)} {...args} />,
}

export const StackedMediaText: StoryObj<typeof HowItWorksStackedMediaText> = {
  name: "Stacked Media + Text",
  argTypes: howItWorksArgTypes(HowItWorksStackedMediaText, howItWorksStackedMediaTextCopy),
  render: (args, context) => <HowItWorksStackedMediaText locale={localeOf(context)} {...args} />,
}

export const SixCardGrid: StoryObj<typeof HowItWorksSixCardGrid> = {
  name: "Six-Card Grid",
  argTypes: howItWorksArgTypes(HowItWorksSixCardGrid, howItWorksSixCardGridCopy),
  render: (args, context) => <HowItWorksSixCardGrid locale={localeOf(context)} {...args} />,
}

export const ColumnPanels: StoryObj<typeof HowItWorksColumnPanels> = {
  name: "Column Panels",
  argTypes: howItWorksArgTypes(HowItWorksColumnPanels, howItWorksColumnPanelsCopy),
  render: (args, context) => <HowItWorksColumnPanels locale={localeOf(context)} {...args} />,
}

export const NumberedInstructionPanels: StoryObj<typeof HowItWorksNumberedInstructionPanels> = {
  name: "Numbered Instruction Panels",
  argTypes: howItWorksArgTypes(HowItWorksNumberedInstructionPanels, howItWorksNumberedInstructionPanelsCopy),
  render: (args, context) => <HowItWorksNumberedInstructionPanels locale={localeOf(context)} {...args} />,
}

export const NumberedEditorialRows: StoryObj<typeof HowItWorksNumberedEditorialRows> = {
  name: "Numbered Editorial Rows",
  argTypes: howItWorksArgTypes(HowItWorksNumberedEditorialRows, howItWorksNumberedEditorialRowsCopy),
  render: (args, context) => <HowItWorksNumberedEditorialRows locale={localeOf(context)} {...args} />,
}

export const SplitFeatureBand: StoryObj<typeof HowItWorksSplitFeatureBand> = {
  name: "Split Feature Band",
  argTypes: howItWorksArgTypes(HowItWorksSplitFeatureBand, howItWorksSplitFeatureBandCopy),
  render: (args, context) => <HowItWorksSplitFeatureBand locale={localeOf(context)} {...args} />,
}

export const RoundedCardsDeviceCrop: StoryObj<typeof HowItWorksRoundedCardsDeviceCrop> = {
  name: "Rounded Cards + Device Crop",
  argTypes: howItWorksArgTypes(HowItWorksRoundedCardsDeviceCrop, howItWorksRoundedCardsDeviceCropCopy),
  render: (args, context) => <HowItWorksRoundedCardsDeviceCrop locale={localeOf(context)} {...args} />,
}

export const PhotoRailProgress: StoryObj<typeof HowItWorksPhotoRailProgress> = {
  name: "Photo Rail + Progress",
  argTypes: howItWorksArgTypes(HowItWorksPhotoRailProgress, howItWorksPhotoRailProgressCopy),
  render: (args, context) => <HowItWorksPhotoRailProgress locale={localeOf(context)} {...photoPropsOf("photo-rail-progress", context)} {...args} />,
}

export const TallVisualRail: StoryObj<typeof HowItWorksTallVisualRail> = {
  name: "Tall Visual Rail",
  argTypes: howItWorksArgTypes(HowItWorksTallVisualRail, howItWorksTallVisualRailCopy),
  render: (args, context) => <HowItWorksTallVisualRail locale={localeOf(context)} {...args} />,
}

export const StepTabsPhotoPanel: StoryObj<typeof HowItWorksStepTabsPhotoPanel> = {
  name: "Step Tabs + Photo Panel",
  argTypes: howItWorksArgTypes(HowItWorksStepTabsPhotoPanel, howItWorksStepTabsPhotoPanelCopy),
  render: (args, context) => <HowItWorksStepTabsPhotoPanel locale={localeOf(context)} {...photoPropsOf("step-tabs-photo-panel", context)} {...args} />,
}

export const AccordionSteps: StoryObj<typeof HowItWorksAccordionSteps> = {
  name: "Accordion Steps",
  argTypes: howItWorksArgTypes(HowItWorksAccordionSteps, howItWorksAccordionStepsCopy),
  render: (args, context) => <HowItWorksAccordionSteps locale={localeOf(context)} {...photoPropsOf("accordion-steps", context)} {...args} />,
}

export const OrbitalProcess: StoryObj<typeof HowItWorksOrbitalProcess> = {
  name: "Orbital Process",
  argTypes: howItWorksArgTypes(HowItWorksOrbitalProcess, howItWorksOrbitalProcessCopy),
  render: (args, context) => <HowItWorksOrbitalProcess locale={localeOf(context)} {...photoPropsOf("orbital-process", context)} {...args} />,
}

export const CenterSpineTimeline: StoryObj<typeof HowItWorksCenterSpineTimeline> = {
  name: "Center Spine Timeline",
  argTypes: howItWorksArgTypes(HowItWorksCenterSpineTimeline, howItWorksCenterSpineTimelineCopy),
  render: (args, context) => <HowItWorksCenterSpineTimeline locale={localeOf(context)} {...photoPropsOf("center-spine-timeline", context)} {...args} />,
}

export const VerticalTimelineCard: StoryObj<typeof HowItWorksVerticalTimelineCard> = {
  name: "Vertical Timeline Card",
  argTypes: howItWorksArgTypes(HowItWorksVerticalTimelineCard, howItWorksVerticalTimelineCardCopy),
  render: (args, context) => <HowItWorksVerticalTimelineCard locale={localeOf(context)} {...photoPropsOf("vertical-timeline-card", context)} {...args} />,
}

export const ContainedTimeline: StoryObj<typeof HowItWorksContainedTimeline> = {
  name: "Contained Timeline",
  argTypes: howItWorksArgTypes(HowItWorksContainedTimeline, howItWorksContainedTimelineCopy),
  render: (args, context) => <HowItWorksContainedTimeline locale={localeOf(context)} {...args} />,
}

export const PhaseLine: StoryObj<typeof HowItWorksPhaseLine> = {
  name: "Phase Line",
  argTypes: howItWorksArgTypes(HowItWorksPhaseLine, howItWorksPhaseLineCopy),
  render: (args, context) => <HowItWorksPhaseLine locale={localeOf(context)} {...args} />,
}

export const PillTimeline: StoryObj<typeof HowItWorksPillTimeline> = {
  name: "Pill Timeline",
  argTypes: howItWorksArgTypes(HowItWorksPillTimeline, howItWorksPillTimelineCopy),
  render: (args, context) => <HowItWorksPillTimeline locale={localeOf(context)} {...args} />,
}
