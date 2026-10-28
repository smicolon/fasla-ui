import type { Meta, StoryObj } from "@storybook/react"
import { AboutMissionStatementHero, aboutMissionStatementHeroCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-mission-statement-hero/AboutMissionStatementHero"
import { AboutCollageHero, aboutCollageHeroCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-collage-hero/AboutCollageHero"
import { AboutStatementBand, aboutStatementBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-statement-band/AboutStatementBand"
import { AboutValuesSpotlight, aboutValuesSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-values-spotlight/AboutValuesSpotlight"
import { AboutValuesConnectorList, aboutValuesConnectorListCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-values-connector-list/AboutValuesConnectorList"
import { AboutApproachStackCards, aboutApproachStackCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-approach-stack-cards/AboutApproachStackCards"
import { AboutStorySnapshots, aboutStorySnapshotsCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-story-snapshots/AboutStorySnapshots"
import { AboutBento, aboutBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-bento/AboutBento"
import { AboutCultureMasonry, aboutCultureMasonryCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-culture-masonry/AboutCultureMasonry"
import { AboutImpactStatsBand, aboutImpactStatsBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-impact-stats-band/AboutImpactStatsBand"
import { AboutStoryPhotos, aboutStoryPhotosCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-story-photos/AboutStoryPhotos"
import { AboutSplitPanel, aboutSplitPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-split-panel/AboutSplitPanel"
import { AboutLetterCard, aboutLetterCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-letter-card/AboutLetterCard"
import { AboutValuesFocus, aboutValuesFocusCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-values-focus/AboutValuesFocus"
import { AboutSpotlight, aboutSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-spotlight/AboutSpotlight"
import { AboutHeadlinePhotos, aboutHeadlinePhotosCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-headline-photos/AboutHeadlinePhotos"
import { AboutTypeStack, aboutTypeStackCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-type-stack/AboutTypeStack"
import { AboutColorBento, aboutColorBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-color-bento/AboutColorBento"
import { AboutNumberedRows, aboutNumberedRowsCopy } from "../../../../../packages/fasla-ui/registry/blocks/about-numbered-rows/AboutNumberedRows"
import { aboutArgTypes, aboutViewports, emptyPropsOf, localeOf, photoPropsOf } from "./about-story-kit"

/**
 * About: the 19 Types of the Figma set, one block each, from statement heroes
 * and photo collages to values, letters, culture walls and figures. The
 * photos are the docs site's demo set, described in the toolbar's language.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states, without photos (the `muted` placeholders) and empty (the block's
 * "No … yet." line), are tagged `!dev` and `!autodocs`: hidden from both,
 * but still built, so tests and visual checks reach them by id. The tags are
 * written out on each story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/About",
  parameters: { layout: "fullscreen", viewport: { viewports: aboutViewports } },
  tags: ["autodocs"],
}

export default meta

export const MissionStatementHero: StoryObj<typeof AboutMissionStatementHero> = {
  name: "Mission Statement Hero",
  argTypes: aboutArgTypes(AboutMissionStatementHero, aboutMissionStatementHeroCopy, ["expandLabel"]),
  render: (args, context) => <AboutMissionStatementHero locale={localeOf(context)} {...photoPropsOf("mission-statement-hero", context, aboutMissionStatementHeroCopy)} {...args} />,
}

export const MissionStatementHeroWithoutPhotos: StoryObj<typeof AboutMissionStatementHero> = {
  name: "Mission Statement Hero: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutMissionStatementHero, aboutMissionStatementHeroCopy, ["expandLabel"]),
  render: (args, context) => <AboutMissionStatementHero locale={localeOf(context)} {...args} />,
}

export const MissionStatementHeroEmpty: StoryObj<typeof AboutMissionStatementHero> = {
  name: "Mission Statement Hero: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutMissionStatementHero, aboutMissionStatementHeroCopy, ["expandLabel"]),
  render: (args, context) => <AboutMissionStatementHero locale={localeOf(context)} {...emptyPropsOf(aboutMissionStatementHeroCopy)} {...args} />,
}

export const CollageHero: StoryObj<typeof AboutCollageHero> = {
  name: "Collage Hero",
  argTypes: aboutArgTypes(AboutCollageHero, aboutCollageHeroCopy),
  render: (args, context) => <AboutCollageHero locale={localeOf(context)} {...photoPropsOf("collage-hero", context, aboutCollageHeroCopy)} {...args} />,
}

export const CollageHeroWithoutPhotos: StoryObj<typeof AboutCollageHero> = {
  name: "Collage Hero: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutCollageHero, aboutCollageHeroCopy),
  render: (args, context) => <AboutCollageHero locale={localeOf(context)} {...args} />,
}

export const CollageHeroEmpty: StoryObj<typeof AboutCollageHero> = {
  name: "Collage Hero: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutCollageHero, aboutCollageHeroCopy),
  render: (args, context) => <AboutCollageHero locale={localeOf(context)} {...emptyPropsOf(aboutCollageHeroCopy)} {...args} />,
}

export const StatementBand: StoryObj<typeof AboutStatementBand> = {
  name: "Statement Band",
  argTypes: aboutArgTypes(AboutStatementBand, aboutStatementBandCopy),
  render: (args, context) => <AboutStatementBand locale={localeOf(context)} {...photoPropsOf("statement-band", context, aboutStatementBandCopy)} {...args} />,
}

export const StatementBandWithoutPhotos: StoryObj<typeof AboutStatementBand> = {
  name: "Statement Band: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStatementBand, aboutStatementBandCopy),
  render: (args, context) => <AboutStatementBand locale={localeOf(context)} {...args} />,
}

export const StatementBandEmpty: StoryObj<typeof AboutStatementBand> = {
  name: "Statement Band: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStatementBand, aboutStatementBandCopy),
  render: (args, context) => <AboutStatementBand locale={localeOf(context)} {...emptyPropsOf(aboutStatementBandCopy)} {...args} />,
}

export const ValuesSpotlight: StoryObj<typeof AboutValuesSpotlight> = {
  name: "Values Spotlight",
  argTypes: aboutArgTypes(AboutValuesSpotlight, aboutValuesSpotlightCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesSpotlight locale={localeOf(context)} {...photoPropsOf("values-spotlight", context, aboutValuesSpotlightCopy)} {...args} />,
}

export const ValuesSpotlightWithoutPhotos: StoryObj<typeof AboutValuesSpotlight> = {
  name: "Values Spotlight: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutValuesSpotlight, aboutValuesSpotlightCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesSpotlight locale={localeOf(context)} {...args} />,
}

export const ValuesSpotlightEmpty: StoryObj<typeof AboutValuesSpotlight> = {
  name: "Values Spotlight: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutValuesSpotlight, aboutValuesSpotlightCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesSpotlight locale={localeOf(context)} {...emptyPropsOf(aboutValuesSpotlightCopy)} {...args} />,
}

export const ValuesConnectorList: StoryObj<typeof AboutValuesConnectorList> = {
  name: "Values Connector List",
  argTypes: aboutArgTypes(AboutValuesConnectorList, aboutValuesConnectorListCopy),
  render: (args, context) => <AboutValuesConnectorList locale={localeOf(context)} {...args} />,
}

export const ValuesConnectorListEmpty: StoryObj<typeof AboutValuesConnectorList> = {
  name: "Values Connector List: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutValuesConnectorList, aboutValuesConnectorListCopy),
  render: (args, context) => <AboutValuesConnectorList locale={localeOf(context)} {...emptyPropsOf(aboutValuesConnectorListCopy)} {...args} />,
}

export const ApproachStackCards: StoryObj<typeof AboutApproachStackCards> = {
  name: "Approach Stack Cards",
  argTypes: aboutArgTypes(AboutApproachStackCards, aboutApproachStackCardsCopy, ["heading", "socialsLabel"]),
  render: (args, context) => <AboutApproachStackCards locale={localeOf(context)} {...photoPropsOf("approach-stack-cards", context, aboutApproachStackCardsCopy)} {...args} />,
}

export const ApproachStackCardsWithoutPhotos: StoryObj<typeof AboutApproachStackCards> = {
  name: "Approach Stack Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutApproachStackCards, aboutApproachStackCardsCopy, ["heading", "socialsLabel"]),
  render: (args, context) => <AboutApproachStackCards locale={localeOf(context)} {...args} />,
}

export const ApproachStackCardsEmpty: StoryObj<typeof AboutApproachStackCards> = {
  name: "Approach Stack Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutApproachStackCards, aboutApproachStackCardsCopy, ["heading", "socialsLabel"]),
  render: (args, context) => <AboutApproachStackCards locale={localeOf(context)} {...emptyPropsOf(aboutApproachStackCardsCopy)} {...args} />,
}

export const StorySnapshots: StoryObj<typeof AboutStorySnapshots> = {
  name: "Story & Snapshots",
  argTypes: aboutArgTypes(AboutStorySnapshots, aboutStorySnapshotsCopy),
  render: (args, context) => <AboutStorySnapshots locale={localeOf(context)} {...photoPropsOf("story-snapshots", context, aboutStorySnapshotsCopy)} {...args} />,
}

export const StorySnapshotsWithoutPhotos: StoryObj<typeof AboutStorySnapshots> = {
  name: "Story & Snapshots: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStorySnapshots, aboutStorySnapshotsCopy),
  render: (args, context) => <AboutStorySnapshots locale={localeOf(context)} {...args} />,
}

export const StorySnapshotsEmpty: StoryObj<typeof AboutStorySnapshots> = {
  name: "Story & Snapshots: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStorySnapshots, aboutStorySnapshotsCopy),
  render: (args, context) => <AboutStorySnapshots locale={localeOf(context)} {...emptyPropsOf(aboutStorySnapshotsCopy)} {...args} />,
}

export const Bento: StoryObj<typeof AboutBento> = {
  name: "Bento",
  argTypes: aboutArgTypes(AboutBento, aboutBentoCopy),
  render: (args, context) => <AboutBento locale={localeOf(context)} {...photoPropsOf("bento", context, aboutBentoCopy)} {...args} />,
}

export const BentoWithoutPhotos: StoryObj<typeof AboutBento> = {
  name: "Bento: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutBento, aboutBentoCopy),
  render: (args, context) => <AboutBento locale={localeOf(context)} {...args} />,
}

export const BentoEmpty: StoryObj<typeof AboutBento> = {
  name: "Bento: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutBento, aboutBentoCopy),
  // The tags are text, which emptyPropsOf leaves alone, so the tile's empty line is asked for here.
  render: (args, context) => <AboutBento locale={localeOf(context)} {...emptyPropsOf(aboutBentoCopy)} capabilities={[]} {...args} />,
}

export const CultureMasonry: StoryObj<typeof AboutCultureMasonry> = {
  name: "Culture Masonry",
  argTypes: aboutArgTypes(AboutCultureMasonry, aboutCultureMasonryCopy),
  render: (args, context) => <AboutCultureMasonry locale={localeOf(context)} {...photoPropsOf("culture-masonry", context, aboutCultureMasonryCopy)} {...args} />,
}

export const CultureMasonryWithoutPhotos: StoryObj<typeof AboutCultureMasonry> = {
  name: "Culture Masonry: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutCultureMasonry, aboutCultureMasonryCopy),
  render: (args, context) => <AboutCultureMasonry locale={localeOf(context)} {...args} />,
}

export const CultureMasonryEmpty: StoryObj<typeof AboutCultureMasonry> = {
  name: "Culture Masonry: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutCultureMasonry, aboutCultureMasonryCopy),
  render: (args, context) => <AboutCultureMasonry locale={localeOf(context)} {...emptyPropsOf(aboutCultureMasonryCopy)} {...args} />,
}

export const ImpactStatsBand: StoryObj<typeof AboutImpactStatsBand> = {
  name: "Impact Stats Band",
  argTypes: aboutArgTypes(AboutImpactStatsBand, aboutImpactStatsBandCopy, ["videoLabel"]),
  render: (args, context) => <AboutImpactStatsBand locale={localeOf(context)} {...photoPropsOf("impact-stats-band", context, aboutImpactStatsBandCopy)} {...args} />,
}

export const ImpactStatsBandWithoutPhotos: StoryObj<typeof AboutImpactStatsBand> = {
  name: "Impact Stats Band: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutImpactStatsBand, aboutImpactStatsBandCopy, ["videoLabel"]),
  render: (args, context) => <AboutImpactStatsBand locale={localeOf(context)} {...args} />,
}

export const ImpactStatsBandEmpty: StoryObj<typeof AboutImpactStatsBand> = {
  name: "Impact Stats Band: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutImpactStatsBand, aboutImpactStatsBandCopy, ["videoLabel"]),
  render: (args, context) => <AboutImpactStatsBand locale={localeOf(context)} {...emptyPropsOf(aboutImpactStatsBandCopy)} {...args} />,
}

export const StoryPhotos: StoryObj<typeof AboutStoryPhotos> = {
  name: "Story Photos",
  argTypes: aboutArgTypes(AboutStoryPhotos, aboutStoryPhotosCopy),
  render: (args, context) => <AboutStoryPhotos locale={localeOf(context)} {...photoPropsOf("story-photos", context, aboutStoryPhotosCopy)} {...args} />,
}

export const StoryPhotosWithoutPhotos: StoryObj<typeof AboutStoryPhotos> = {
  name: "Story Photos: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStoryPhotos, aboutStoryPhotosCopy),
  render: (args, context) => <AboutStoryPhotos locale={localeOf(context)} {...args} />,
}

export const StoryPhotosEmpty: StoryObj<typeof AboutStoryPhotos> = {
  name: "Story Photos: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutStoryPhotos, aboutStoryPhotosCopy),
  render: (args, context) => <AboutStoryPhotos locale={localeOf(context)} {...emptyPropsOf(aboutStoryPhotosCopy)} {...args} />,
}

export const SplitPanel: StoryObj<typeof AboutSplitPanel> = {
  name: "Split Panel",
  argTypes: aboutArgTypes(AboutSplitPanel, aboutSplitPanelCopy),
  render: (args, context) => <AboutSplitPanel locale={localeOf(context)} {...photoPropsOf("split-panel", context, aboutSplitPanelCopy)} {...args} />,
}

export const SplitPanelWithoutPhotos: StoryObj<typeof AboutSplitPanel> = {
  name: "Split Panel: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutSplitPanel, aboutSplitPanelCopy),
  render: (args, context) => <AboutSplitPanel locale={localeOf(context)} {...args} />,
}

export const SplitPanelEmpty: StoryObj<typeof AboutSplitPanel> = {
  name: "Split Panel: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutSplitPanel, aboutSplitPanelCopy),
  render: (args, context) => <AboutSplitPanel locale={localeOf(context)} {...emptyPropsOf(aboutSplitPanelCopy)} {...args} />,
}

export const LetterCard: StoryObj<typeof AboutLetterCard> = {
  name: "Letter Card",
  argTypes: aboutArgTypes(AboutLetterCard, aboutLetterCardCopy),
  render: (args, context) => <AboutLetterCard locale={localeOf(context)} {...photoPropsOf("letter-card", context, aboutLetterCardCopy)} {...args} />,
}

export const LetterCardWithoutPhotos: StoryObj<typeof AboutLetterCard> = {
  name: "Letter Card: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutLetterCard, aboutLetterCardCopy),
  render: (args, context) => <AboutLetterCard locale={localeOf(context)} {...args} />,
}

export const LetterCardEmpty: StoryObj<typeof AboutLetterCard> = {
  name: "Letter Card: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutLetterCard, aboutLetterCardCopy),
  render: (args, context) => <AboutLetterCard locale={localeOf(context)} {...emptyPropsOf(aboutLetterCardCopy)} {...args} />,
}

export const ValuesFocus: StoryObj<typeof AboutValuesFocus> = {
  name: "Values Focus",
  argTypes: aboutArgTypes(AboutValuesFocus, aboutValuesFocusCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesFocus locale={localeOf(context)} {...photoPropsOf("values-focus", context, aboutValuesFocusCopy)} {...args} />,
}

export const ValuesFocusWithoutPhotos: StoryObj<typeof AboutValuesFocus> = {
  name: "Values Focus: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutValuesFocus, aboutValuesFocusCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesFocus locale={localeOf(context)} {...args} />,
}

export const ValuesFocusEmpty: StoryObj<typeof AboutValuesFocus> = {
  name: "Values Focus: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutValuesFocus, aboutValuesFocusCopy, ["emptyPhoto"]),
  render: (args, context) => <AboutValuesFocus locale={localeOf(context)} {...emptyPropsOf(aboutValuesFocusCopy)} {...args} />,
}

export const Spotlight: StoryObj<typeof AboutSpotlight> = {
  name: "Spotlight",
  argTypes: aboutArgTypes(AboutSpotlight, aboutSpotlightCopy, ["linksLabel"]),
  render: (args, context) => <AboutSpotlight locale={localeOf(context)} {...args} />,
}

export const HeadlinePhotos: StoryObj<typeof AboutHeadlinePhotos> = {
  name: "Headline Photos",
  argTypes: aboutArgTypes(AboutHeadlinePhotos, aboutHeadlinePhotosCopy),
  render: (args, context) => <AboutHeadlinePhotos locale={localeOf(context)} {...photoPropsOf("headline-photos", context, aboutHeadlinePhotosCopy)} {...args} />,
}

export const HeadlinePhotosWithoutPhotos: StoryObj<typeof AboutHeadlinePhotos> = {
  name: "Headline Photos: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutHeadlinePhotos, aboutHeadlinePhotosCopy),
  render: (args, context) => <AboutHeadlinePhotos locale={localeOf(context)} {...args} />,
}

export const HeadlinePhotosEmpty: StoryObj<typeof AboutHeadlinePhotos> = {
  name: "Headline Photos: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutHeadlinePhotos, aboutHeadlinePhotosCopy),
  render: (args, context) => <AboutHeadlinePhotos locale={localeOf(context)} {...emptyPropsOf(aboutHeadlinePhotosCopy)} {...args} />,
}

export const TypeStack: StoryObj<typeof AboutTypeStack> = {
  name: "Type Stack",
  argTypes: aboutArgTypes(AboutTypeStack, aboutTypeStackCopy),
  render: (args, context) => <AboutTypeStack locale={localeOf(context)} {...args} />,
}

export const ColorBento: StoryObj<typeof AboutColorBento> = {
  name: "Color Bento",
  argTypes: aboutArgTypes(AboutColorBento, aboutColorBentoCopy, ["heading"]),
  render: (args, context) => <AboutColorBento locale={localeOf(context)} {...args} />,
}

export const NumberedRows: StoryObj<typeof AboutNumberedRows> = {
  name: "Numbered Rows",
  argTypes: aboutArgTypes(AboutNumberedRows, aboutNumberedRowsCopy, ["heading"]),
  render: (args, context) => <AboutNumberedRows locale={localeOf(context)} {...args} />,
}

export const NumberedRowsEmpty: StoryObj<typeof AboutNumberedRows> = {
  name: "Numbered Rows: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: aboutArgTypes(AboutNumberedRows, aboutNumberedRowsCopy, ["heading"]),
  render: (args, context) => <AboutNumberedRows locale={localeOf(context)} {...emptyPropsOf(aboutNumberedRowsCopy)} {...args} />,
}
