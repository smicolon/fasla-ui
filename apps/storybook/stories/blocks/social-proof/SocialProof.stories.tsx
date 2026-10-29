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
import { atLength, localeOf, photos, socialProofArgTypes, socialProofViewports } from "./social-proof-story-kit"

/**
 * Social Proof: the Types of the Figma set, one block each, in four groups.
 * Grids & walls show many voices at once: three cards, staggered columns,
 * benefit cards, a giant quote pair, a cropped wall, posts from X and app
 * store reviews. Spotlights give one quote the stage: under a wordmark, on
 * the inverse band, in corner brackets, with highlighted phrases, beside a
 * tinted portrait, over a photograph, and beside an arch. Carousels and
 * selectors let the reader step through quotes and stories or pick a person,
 * a part of the team or an audience; nothing moves on its own. Stories
 * back a quote with a figure or a film: stat cards paged by dots, two video
 * cards, a case-study pair and a bento; a film plays only when its button is
 * pressed. Viewport,
 * direction and theme come from the toolbar.
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

/** Sample text to cut to length, one per language. */
const SAMPLE = {
  en: "Every screen we shipped this quarter came straight from the system, and nobody had to ask which version was current",
  ar: "خرجت كل شاشة أطلقناها هذا الربع من النظام مباشرة، ولم يحتج أحد إلى السؤال عن النسخة المعتمدة",
}

/**
 * The longest copy each slot is documented for, from the English and Arabic
 * docs' Content limits: heading, description, quote, name and role, benefit
 * title, wall quote, post, spotlight and story quotes, eyebrow and figure.
 */
const LIMITS = {
  en: { heading: 46, description: 128, quote: 154, name: 19, role: 48, title: 30, wall: 63, post: 122, spotlight: 164, story: 290, eyebrow: 41, stat: 5, statLabel: 60 },
  ar: { heading: 40, description: 125, quote: 136, name: 19, role: 50, title: 25, wall: 68, post: 129, spotlight: 133, story: 284, eyebrow: 31, stat: 9, statLabel: 56 },
}

const filled = (locale: "en" | "ar", factor = 1) => {
  const at = (key: keyof (typeof LIMITS)["en"]) => atLength(SAMPLE[locale], Math.round(LIMITS[locale][key] * factor))
  const person = (id: string) => ({ id, name: atLength(SAMPLE[locale], LIMITS[locale].name), role: at("role") })
  return { at, person }
}

/**
 * The grids with every slot filled to its documented limit. Cards grow with
 * their copy; the wall's stage keeps its fixed height and crops more cards.
 */
export const AtContentLimits: StoryObj = {
  name: "At content limits",
  render: (_, context) => {
    const locale = localeOf(context)
    const { at, person } = filled(locale)
    const ids = ["sami-naji", "khalid-saad", "rashed-al-amri", "bader-al-ghamdi", "ziad-karam", "hani-jaber"]
    const benefit = socialProofBenefitTitleCardsCopy[locale].items
    const tweets = socialProofTweetWallCopy[locale].items
    return (
      <>
        <SocialProofClassicTrioGrid locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={ids.slice(0, 3).map((id) => ({ quote: at("quote"), author: person(id) }))} />
        <SocialProofStaggeredColumns locale={locale} photos={photos} heading={at("heading")} items={ids.map((id) => ({ quote: at("quote"), author: person(id) }))} />
        <SocialProofBenefitTitleCards locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={benefit.map((item) => ({ ...item, title: at("title"), quote: at("quote"), author: person(item.author.id) }))} />
        <SocialProofVerticalColumnWall locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={Array.from({ length: 12 }, (_, i) => ({ quote: at("wall"), author: person(ids[i % ids.length]) }))} />
        <SocialProofTweetWall locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={tweets.map((item) => ({ ...item, post: at("post") }))} />
        <SocialProofAppReviewRow locale={locale} heading={at("heading")} items={socialProofAppReviewRowCopy[locale].items.map((item) => ({ ...item, quote: at("quote") }))} />
        <SocialProofCenteredLogoSpotlight locale={locale} photos={photos} quote={at("spotlight")} author={person("tariq-zaki")} />
        <SocialProofDarkEditorialSplit locale={locale} photos={photos} quote={at("spotlight")} author={person("yousef-amin")} />
        <SocialProofBracketFramedQuote locale={locale} eyebrow={at("eyebrow")} quote={at("story")} author={at("role")} stat={at("stat")} statLabel={at("statLabel")} />
        <SocialProofHighlightedPhraseSpotlight locale={locale} photos={photos} quote={[at("spotlight")]} author={person("sami-naji")} />
        <SocialProofTintedPanelPortrait locale={locale} photos={photos} quote={at("story")} author={person("adel-qasim")} />
        <SocialProofOverlayPhotoQuote locale={locale} photos={photos} quote={at("spotlight")} author={at("role")} />
        <SocialProofArchPortraitQuote locale={locale} photos={photos} eyebrow={at("eyebrow")} quote={at("spotlight")} author={person("fahad-salem")} />
        <SocialProofStatStoryCards locale={locale} photos={photos} heading={at("heading")} description={at("description")} pages={socialProofStatStoryCardsCopy[locale].pages.map((page) => page.map((story) => ({ ...story, quote: at("quote"), statLabel: at("statLabel"), author: person(story.author.id) })))} />
        <SocialProofVideoStoryCards locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={socialProofVideoStoryCardsCopy[locale].items.map((item) => ({ ...item, quote: atLength(SAMPLE[locale], locale === "ar" ? 90 : 110) }))} />
        <SocialProofCaseStudyRow locale={locale} photos={photos} heading={at("heading")} items={socialProofCaseStudyRowCopy[locale].items.map((item) => ({ ...item, quote: at("quote"), name: at("name"), role: at("role") }))} />
        <SocialProofProofBento locale={locale} photos={photos} {...film} heading={at("heading")} videoLabel={atLength(SAMPLE[locale], locale === "ar" ? 24 : 30)} featured={{ quote: at("story"), author: person("fahad-salem") }} quote={{ quote: at("quote"), author: person("khalid-saad") }} />
        <SocialProofSpotlightCarousel locale={locale} photos={photos} items={ids.slice(0, 4).map((id) => ({ quote: at("spotlight"), author: person(id) }))} />
        <SocialProofProgressCarousel locale={locale} photos={photos} heading={at("heading")} items={socialProofProgressCarouselCopy[locale].items.map((item) => ({ ...item, quote: at("story"), attribution: at("role") }))} />
        <SocialProofPersonaPillars locale={locale} photos={photos} heading={at("heading")} items={socialProofPersonaPillarsCopy[locale].items.map((item) => ({ ...item, quote: at("story"), author: person(item.author.id) }))} />
        <SocialProofWorkplacePortraitStories locale={locale} photos={photos} heading={at("heading")} description={at("description")} items={socialProofWorkplacePortraitStoriesCopy[locale].items.map((item) => ({ ...item, quote: at("story"), author: person(item.author.id) }))} />
      </>
    )
  },
}

/**
 * Copy twice as long as the limits allow, to show what happens: cards grow
 * and their rows stop lining up, headings wrap, and the wall crops the cards
 * it can no longer show.
 */
export const LongText: StoryObj = {
  name: "Long text",
  render: (_, context) => {
    const locale = localeOf(context)
    const { at, person } = filled(locale, 2)
    const ids = ["sami-naji", "khalid-saad", "rashed-al-amri"]
    return (
      <>
        <SocialProofClassicTrioGrid
          locale={locale}
          photos={photos}
          heading={at("heading")}
          description={at("description")}
          items={ids.map((id, i) => ({ quote: i === 1 ? at("quote") : socialProofClassicTrioGridCopy[locale].items[i].quote, author: person(id) }))}
        />
        <SocialProofGiantQuoteDuo locale={locale} photos={photos} items={[{ quote: at("quote"), author: person("hani-jaber") }, { quote: at("quote"), author: person("khalid-saad") }]} />
        <SocialProofVerticalColumnWall locale={locale} photos={photos} items={Array.from({ length: 12 }, (_, i) => ({ quote: at("wall"), author: person(ids[i % ids.length]) }))} />
        <SocialProofDarkEditorialSplit locale={locale} photos={photos} quote={at("spotlight")} />
        <SocialProofOverlayPhotoQuote locale={locale} photos={photos} quote={at("spotlight")} />
        <SocialProofStatStoryCards locale={locale} photos={photos} pages={socialProofStatStoryCardsCopy[locale].pages.map((page) => page.map((story) => ({ ...story, quote: at("quote"), statLabel: at("statLabel") })))} />
        <SocialProofVideoStoryCards locale={locale} photos={photos} items={socialProofVideoStoryCardsCopy[locale].items.map((item) => ({ ...item, quote: atLength(SAMPLE[locale], locale === "ar" ? 180 : 220) }))} />
        <SocialProofCaseStudyRow locale={locale} photos={photos} items={socialProofCaseStudyRowCopy[locale].items.map((item) => ({ ...item, quote: at("quote") }))} />
        <SocialProofProofBento locale={locale} photos={photos} videoLabel={atLength(SAMPLE[locale], locale === "ar" ? 48 : 60)} featured={{ quote: at("story"), author: person("fahad-salem") }} />
      </>
    )
  },
}
