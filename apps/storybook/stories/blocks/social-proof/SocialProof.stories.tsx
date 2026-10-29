import type { Meta, StoryObj } from "@storybook/react"
import { SocialProofClassicTrioGrid, socialProofClassicTrioGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-classic-trio-grid/SocialProofClassicTrioGrid"
import { SocialProofStaggeredColumns, socialProofStaggeredColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-staggered-columns/SocialProofStaggeredColumns"
import { SocialProofBenefitTitleCards, socialProofBenefitTitleCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-benefit-title-cards/SocialProofBenefitTitleCards"
import { SocialProofGiantQuoteDuo, socialProofGiantQuoteDuoCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-giant-quote-duo/SocialProofGiantQuoteDuo"
import { SocialProofVerticalColumnWall, socialProofVerticalColumnWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-vertical-column-wall/SocialProofVerticalColumnWall"
import { SocialProofTweetWall, socialProofTweetWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-tweet-wall/SocialProofTweetWall"
import { SocialProofAppReviewRow, socialProofAppReviewRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-app-review-row/SocialProofAppReviewRow"
import { SocialProofCenteredLogoSpotlight, socialProofCenteredLogoSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-centered-logo-spotlight/SocialProofCenteredLogoSpotlight"
import { SocialProofDarkEditorialSplit, socialProofDarkEditorialSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-dark-editorial-split/SocialProofDarkEditorialSplit"
import { SocialProofBracketFramedQuote, socialProofBracketFramedQuoteCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-bracket-framed-quote/SocialProofBracketFramedQuote"
import { SocialProofHighlightedPhraseSpotlight, socialProofHighlightedPhraseSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-highlighted-phrase-spotlight/SocialProofHighlightedPhraseSpotlight"
import { SocialProofTintedPanelPortrait, socialProofTintedPanelPortraitCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-tinted-panel-portrait/SocialProofTintedPanelPortrait"
import { SocialProofOverlayPhotoQuote, socialProofOverlayPhotoQuoteCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-overlay-photo-quote/SocialProofOverlayPhotoQuote"
import { SocialProofArchPortraitQuote, socialProofArchPortraitQuoteCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-arch-portrait-quote/SocialProofArchPortraitQuote"
import { SocialProofSpotlightCarousel, socialProofSpotlightCarouselCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-spotlight-carousel/SocialProofSpotlightCarousel"
import { SocialProofAvatarSelectorRow, socialProofAvatarSelectorRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-avatar-selector-row/SocialProofAvatarSelectorRow"
import { SocialProofProgressCarousel, socialProofProgressCarouselCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-progress-carousel/SocialProofProgressCarousel"
import { SocialProofPersonaPillars, socialProofPersonaPillarsCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-persona-pillars/SocialProofPersonaPillars"
import { SocialProofWorkplacePortraitStories, socialProofWorkplacePortraitStoriesCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-workplace-portrait-stories/SocialProofWorkplacePortraitStories"
import { SocialProofStatStoryCards, socialProofStatStoryCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-stat-story-cards/SocialProofStatStoryCards"
import { SocialProofVideoStoryCards, socialProofVideoStoryCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-video-story-cards/SocialProofVideoStoryCards"
import { SocialProofCaseStudyRow, socialProofCaseStudyRowCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-case-study-row/SocialProofCaseStudyRow"
import { SocialProofProofBento, socialProofProofBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/social-proof-proof-bento/SocialProofProofBento"
import { localeOf, photos, socialProofArgTypes, socialProofViewports } from "./social-proof-story-kit"

/**
 * Social Proof: the Types of the Figma set, one block each, in four groups.
 * Grids & walls show many voices at once: three cards, staggered columns,
 * benefit cards, a giant quote pair, a cropped wall, posts from X and app
 * store reviews. Staggered Columns and Vertical Column Wall
 * drift on their own while they are in view, at a reading speed of about 40px
 * per second, pausing on hover and focus and standing still with reduced
 * motion. Spotlights give one quote the stage: under a wordmark, on
 * the inverse band, in corner brackets, with highlighted phrases, beside a
 * tinted portrait, over a photograph, and beside an arch. Carousels and
 * selectors let the reader step through quotes and stories or pick a person,
 * a part of the team or an audience; they move only when the reader acts. Stories
 * back a quote with a figure or a film: stat cards paged by dots, two video
 * cards, a case-study pair and a bento; a film plays only when its button is
 * pressed. Viewport, direction and theme come from the toolbar.
 */
const meta: Meta = {
  title: "Blocks/Social Proof",
  parameters: { layout: "fullscreen", viewport: { viewports: socialProofViewports } },
  tags: ["autodocs"],
}

export default meta

export const ClassicTrioGrid: StoryObj<typeof SocialProofClassicTrioGrid> = {
  name: "Classic Trio Grid",
  argTypes: socialProofArgTypes(SocialProofClassicTrioGrid, socialProofClassicTrioGridCopy),
  render: (args, context) => <SocialProofClassicTrioGrid locale={localeOf(context)} photos={photos} {...args} />,
}

export const StaggeredColumns: StoryObj<typeof SocialProofStaggeredColumns> = {
  name: "Staggered Columns",
  argTypes: socialProofArgTypes(SocialProofStaggeredColumns, socialProofStaggeredColumnsCopy),
  render: (args, context) => <SocialProofStaggeredColumns locale={localeOf(context)} photos={photos} {...args} />,
}

export const BenefitTitleCards: StoryObj<typeof SocialProofBenefitTitleCards> = {
  name: "Benefit-Title Cards",
  argTypes: socialProofArgTypes(SocialProofBenefitTitleCards, socialProofBenefitTitleCardsCopy),
  render: (args, context) => <SocialProofBenefitTitleCards locale={localeOf(context)} photos={photos} {...args} />,
}

export const GiantQuoteDuo: StoryObj<typeof SocialProofGiantQuoteDuo> = {
  name: "Giant Quote Duo",
  argTypes: socialProofArgTypes(SocialProofGiantQuoteDuo, socialProofGiantQuoteDuoCopy),
  render: (args, context) => <SocialProofGiantQuoteDuo locale={localeOf(context)} photos={photos} {...args} />,
}

export const VerticalColumnWall: StoryObj<typeof SocialProofVerticalColumnWall> = {
  name: "Vertical Column Wall",
  argTypes: socialProofArgTypes(SocialProofVerticalColumnWall, socialProofVerticalColumnWallCopy),
  render: (args, context) => <SocialProofVerticalColumnWall locale={localeOf(context)} photos={photos} {...args} />,
}

export const TweetWall: StoryObj<typeof SocialProofTweetWall> = {
  name: "Tweet Wall",
  argTypes: socialProofArgTypes(SocialProofTweetWall, socialProofTweetWallCopy),
  render: (args, context) => <SocialProofTweetWall locale={localeOf(context)} photos={photos} {...args} />,
}

export const AppReviewRow: StoryObj<typeof SocialProofAppReviewRow> = {
  name: "App Review Row",
  argTypes: socialProofArgTypes(SocialProofAppReviewRow, socialProofAppReviewRowCopy),
  render: (args, context) => <SocialProofAppReviewRow locale={localeOf(context)} {...args} />,
}

export const CenteredLogoSpotlight: StoryObj<typeof SocialProofCenteredLogoSpotlight> = {
  name: "Centered Logo Spotlight",
  argTypes: socialProofArgTypes(SocialProofCenteredLogoSpotlight, socialProofCenteredLogoSpotlightCopy),
  render: (args, context) => <SocialProofCenteredLogoSpotlight locale={localeOf(context)} photos={photos} {...args} />,
}

export const DarkEditorialSplit: StoryObj<typeof SocialProofDarkEditorialSplit> = {
  name: "Dark Editorial Split",
  argTypes: socialProofArgTypes(SocialProofDarkEditorialSplit, socialProofDarkEditorialSplitCopy),
  render: (args, context) => <SocialProofDarkEditorialSplit locale={localeOf(context)} photos={photos} {...args} />,
}

export const BracketFramedQuote: StoryObj<typeof SocialProofBracketFramedQuote> = {
  name: "Bracket-Framed Quote",
  argTypes: socialProofArgTypes(SocialProofBracketFramedQuote, socialProofBracketFramedQuoteCopy),
  render: (args, context) => <SocialProofBracketFramedQuote locale={localeOf(context)} {...args} />,
}

export const HighlightedPhraseSpotlight: StoryObj<typeof SocialProofHighlightedPhraseSpotlight> = {
  name: "Highlighted-Phrase Spotlight",
  argTypes: socialProofArgTypes(SocialProofHighlightedPhraseSpotlight, socialProofHighlightedPhraseSpotlightCopy),
  render: (args, context) => <SocialProofHighlightedPhraseSpotlight locale={localeOf(context)} photos={photos} {...args} />,
}

export const TintedPanelPortrait: StoryObj<typeof SocialProofTintedPanelPortrait> = {
  name: "Tinted-Panel Portrait",
  argTypes: socialProofArgTypes(SocialProofTintedPanelPortrait, socialProofTintedPanelPortraitCopy),
  render: (args, context) => <SocialProofTintedPanelPortrait locale={localeOf(context)} photos={photos} {...args} />,
}

export const OverlayPhotoQuote: StoryObj<typeof SocialProofOverlayPhotoQuote> = {
  name: "Overlay Photo Quote",
  argTypes: socialProofArgTypes(SocialProofOverlayPhotoQuote, socialProofOverlayPhotoQuoteCopy),
  render: (args, context) => <SocialProofOverlayPhotoQuote locale={localeOf(context)} photos={photos} {...args} />,
}

export const ArchPortraitQuote: StoryObj<typeof SocialProofArchPortraitQuote> = {
  name: "Arch Portrait Quote",
  argTypes: socialProofArgTypes(SocialProofArchPortraitQuote, socialProofArchPortraitQuoteCopy),
  render: (args, context) => <SocialProofArchPortraitQuote locale={localeOf(context)} photos={photos} {...args} />,
}

export const SpotlightCarousel: StoryObj<typeof SocialProofSpotlightCarousel> = {
  name: "Spotlight Carousel",
  argTypes: socialProofArgTypes(SocialProofSpotlightCarousel, socialProofSpotlightCarouselCopy),
  render: (args, context) => <SocialProofSpotlightCarousel locale={localeOf(context)} photos={photos} {...args} />,
}

export const AvatarSelectorRow: StoryObj<typeof SocialProofAvatarSelectorRow> = {
  name: "Avatar-Selector Row",
  argTypes: socialProofArgTypes(SocialProofAvatarSelectorRow, socialProofAvatarSelectorRowCopy),
  render: (args, context) => <SocialProofAvatarSelectorRow locale={localeOf(context)} photos={photos} {...args} />,
}

export const ProgressCarousel: StoryObj<typeof SocialProofProgressCarousel> = {
  name: "Progress Carousel",
  argTypes: socialProofArgTypes(SocialProofProgressCarousel, socialProofProgressCarouselCopy),
  render: (args, context) => <SocialProofProgressCarousel locale={localeOf(context)} photos={photos} {...args} />,
}

export const PersonaPillars: StoryObj<typeof SocialProofPersonaPillars> = {
  name: "Persona Pillars",
  argTypes: socialProofArgTypes(SocialProofPersonaPillars, socialProofPersonaPillarsCopy),
  render: (args, context) => <SocialProofPersonaPillars locale={localeOf(context)} photos={photos} {...args} />,
}

export const WorkplacePortraitStories: StoryObj<typeof SocialProofWorkplacePortraitStories> = {
  name: "Workplace Portrait Stories",
  argTypes: socialProofArgTypes(SocialProofWorkplacePortraitStories, socialProofWorkplacePortraitStoriesCopy),
  render: (args, context) => <SocialProofWorkplacePortraitStories locale={localeOf(context)} photos={photos} {...args} />,
}

/** The demo film every video story plays when its button is pressed: Hero's. */
const film = { videoSrc: "/images/hero/office-film.mp4", videoType: "video/mp4" }

export const StatStoryCards: StoryObj<typeof SocialProofStatStoryCards> = {
  name: "Stat-Story Cards",
  argTypes: socialProofArgTypes(SocialProofStatStoryCards, socialProofStatStoryCardsCopy),
  render: (args, context) => <SocialProofStatStoryCards locale={localeOf(context)} photos={photos} {...args} />,
}

export const VideoStoryCards: StoryObj<typeof SocialProofVideoStoryCards> = {
  name: "Video Story Cards",
  argTypes: socialProofArgTypes(SocialProofVideoStoryCards, socialProofVideoStoryCardsCopy),
  render: (args, context) => (
    <SocialProofVideoStoryCards
      locale={localeOf(context)}
      photos={photos}
      items={socialProofVideoStoryCardsCopy[localeOf(context)].items.map((item) => ({ ...item, ...film }))}
      {...args}
    />
  ),
}

export const CaseStudyRow: StoryObj<typeof SocialProofCaseStudyRow> = {
  name: "Case-Study Row",
  argTypes: socialProofArgTypes(SocialProofCaseStudyRow, socialProofCaseStudyRowCopy),
  render: (args, context) => <SocialProofCaseStudyRow locale={localeOf(context)} photos={photos} {...args} />,
}

export const ProofBento: StoryObj<typeof SocialProofProofBento> = {
  name: "Proof Bento",
  argTypes: socialProofArgTypes(SocialProofProofBento, socialProofProofBentoCopy),
  render: (args, context) => <SocialProofProofBento locale={localeOf(context)} photos={photos} {...film} {...args} />,
}
