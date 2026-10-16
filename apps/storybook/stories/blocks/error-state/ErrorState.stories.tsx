import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { ErrorStateCenteredMinimal, errorStateCenteredMinimalCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-centered-minimal/ErrorStateCenteredMinimal"
import { ErrorStateSearchRecovery, errorStateSearchRecoveryCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-search-recovery/ErrorStateSearchRecovery"
import { ErrorStateDisplayNumeralSplit, errorStateDisplayNumeralSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-display-numeral-split/ErrorStateDisplayNumeralSplit"
import { ErrorStateEditorialPhotoSplit, errorStateEditorialPhotoSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-editorial-photo-split/ErrorStateEditorialPhotoSplit"
import { ErrorStateFullBleedPhoto, errorStateFullBleedPhotoCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-full-bleed-photo/ErrorStateFullBleedPhoto"
import { ErrorStateColourFieldScatter, errorStateColourFieldScatterCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-colour-field-scatter/ErrorStateColourFieldScatter"
import { ErrorStateDarkSpotlight, errorStateDarkSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-dark-spotlight/ErrorStateDarkSpotlight"
import { ErrorStateGhostWatermark, errorStateGhostWatermarkCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-ghost-watermark/ErrorStateGhostWatermark"
import { ErrorStateHelpfulLinksList, errorStateHelpfulLinksListCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-helpful-links-list/ErrorStateHelpfulLinksList"
import { ErrorStatePopularPagesGrid, errorStatePopularPagesGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-popular-pages-grid/ErrorStatePopularPagesGrid"
import { ErrorStateErrorCardPanel, errorStateErrorCardPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-error-card-panel/ErrorStateErrorCardPanel"
import { ErrorStateIllustratedEmptyState, errorStateIllustratedEmptyStateCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-illustrated-empty-state/ErrorStateIllustratedEmptyState"
import { ErrorStateLightEditorial, errorStateLightEditorialCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-light-editorial/ErrorStateLightEditorial"
import { ErrorStateLayeredBadgeCentered, errorStateLayeredBadgeCenteredCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-layered-badge-centered/ErrorStateLayeredBadgeCentered"
import { ErrorStateRecoveryBento, errorStateRecoveryBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-recovery-bento/ErrorStateRecoveryBento"
import { ErrorStateSitemapColumns, errorStateSitemapColumnsCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-sitemap-columns/ErrorStateSitemapColumns"
import { ErrorStateTerminalConsole, errorStateTerminalConsoleCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-terminal-console/ErrorStateTerminalConsole"
import { ErrorStatePhotoCollageScatter, errorStatePhotoCollageScatterCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-photo-collage-scatter/ErrorStatePhotoCollageScatter"
import { ErrorStateSupportEscalationBand, errorStateSupportEscalationBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-support-escalation-band/ErrorStateSupportEscalationBand"
import { ErrorStateSplitColourPanel, errorStateSplitColourPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-split-colour-panel/ErrorStateSplitColourPanel"
import { ErrorStateMarquee404Band, errorStateMarquee404BandCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-marquee-404-band/ErrorStateMarquee404Band"
import { ErrorStateBrokenTrailBreadcrumb, errorStateBrokenTrailBreadcrumbCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-broken-trail-breadcrumb/ErrorStateBrokenTrailBreadcrumb"
import { ErrorStateServerError500, errorStateServerError500Copy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-server-error-500/ErrorStateServerError500"
import { ErrorStateAccessDenied403, errorStateAccessDenied403Copy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-access-denied-403/ErrorStateAccessDenied403"
import { ErrorStateOfflineState, errorStateOfflineStateCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-offline-state/ErrorStateOfflineState"
import { ErrorStateMaintenanceMode, errorStateMaintenanceModeCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-maintenance-mode/ErrorStateMaintenanceMode"
import { ErrorStateEmptySearchResults, errorStateEmptySearchResultsCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-empty-search-results/ErrorStateEmptySearchResults"
import { ErrorStateCountdownRedirect, errorStateCountdownRedirectCopy } from "../../../../../packages/fasla-ui/registry/blocks/error-state-countdown-redirect/ErrorStateCountdownRedirect"
import { errorStateViewports, errorStateArgTypes, localeOf } from "./error-state-story-kit"

/**
 * Error State: the 28 Types of the Figma set, one block each. Twenty-two are
 * 404 pages; the other six cover the states next to them: a server error,
 * no access, offline, maintenance, an empty search and a timed redirect.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the 28 Figma Types only. The extra
 * states (no photo, empty lists, pending, failure, disabled, keyboard focus)
 * are tagged `!dev` and `!autodocs`: hidden from both, but still built, so
 * tests and visual checks reach them by id. The tags are written out on each
 * story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Error State",
  parameters: { layout: "fullscreen", viewport: { viewports: errorStateViewports } },
  tags: ["autodocs"],
}

export default meta

// The photos no block ships with: Figma's, in apps/docs/public/blocks/error-state/.

const editorialPhoto = (locale: "en" | "ar") => ({
  src: "/blocks/error-state/editorial-photo-split.webp",
  alt: locale === "ar" ? "باب مفتوح في غرفة دافئة خالية" : "An open door in a warm, empty room",
})

const fullBleedPhoto = (locale: "en" | "ar") => ({
  src: "/blocks/error-state/full-bleed-photo.webp",
  alt: locale === "ar" ? "ممر بين أشجار الصنوبر في غابة يلفّها الضباب" : "A path through a misty pine forest",
})

const POPULAR_ALTS = {
  en: ["Bare trees in thick fog", "A sand dune at sunrise", "Stone steps into a green forest"],
  ar: ["أشجار عارية في ضباب كثيف", "كثيب رملي عند شروق الشمس", "درجات حجرية تصعد إلى غابة خضراء"],
}

const popularPages = (locale: "en" | "ar") =>
  errorStatePopularPagesGridCopy[locale].pages.map((page, index) => ({
    ...page,
    image: { src: `/blocks/error-state/popular-pages-${index + 1}.webp`, alt: POPULAR_ALTS[locale][index] },
  }))

const COLLAGE_ALTS = {
  en: [
    "Street lamps along a dark road at night",
    "A forest in fog",
    "A door ajar with red light behind it",
    "A road disappearing into fog",
    "Sand dunes under a pale sky",
  ],
  ar: [
    "أعمدة إنارة على طريق مظلم ليلًا",
    "غابة في الضباب",
    "باب موارب يتسلل منه ضوء أحمر",
    "طريق يختفي في الضباب",
    "كثبان رملية تحت سماء شاحبة",
  ],
}

const collagePhotos = (locale: "en" | "ar") =>
  COLLAGE_ALTS[locale].map((alt, index) => ({ src: `/blocks/error-state/photo-collage-${index + 1}.webp`, alt }))

// Stand-ins for the callbacks that would reach an app's server, so each
// action shows its pending state and its result.

/** Settles after a moment, so a button shows its pending state before its result. */
const settleSoon = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

/** Rejects after a moment: the error state. */
const failSoon = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error("offline")), 1200))

/** Never settles: holds the pending state. */
const never = () => new Promise<void>(() => {})

// 404 pages

export const CenteredMinimal: StoryObj<typeof ErrorStateCenteredMinimal> = {
  name: "Centered Minimal",
  argTypes: errorStateArgTypes(ErrorStateCenteredMinimal, errorStateCenteredMinimalCopy),
  render: (args, context) => <ErrorStateCenteredMinimal locale={localeOf(context)} {...args} />,
}

/** Type in the field and press Enter: the query goes to `onSearch`. */
export const SearchRecovery: StoryObj<typeof ErrorStateSearchRecovery> = {
  name: "Search Recovery",
  argTypes: errorStateArgTypes(ErrorStateSearchRecovery, errorStateSearchRecoveryCopy, ["searchLabel"]),
  args: { onSearch: fn() },
  render: (args, context) => <ErrorStateSearchRecovery locale={localeOf(context)} {...args} />,
}

export const DisplayNumeralSplit: StoryObj<typeof ErrorStateDisplayNumeralSplit> = {
  name: "Display Numeral Split",
  argTypes: errorStateArgTypes(ErrorStateDisplayNumeralSplit, errorStateDisplayNumeralSplitCopy),
  args: { onBack: fn() },
  render: (args, context) => <ErrorStateDisplayNumeralSplit locale={localeOf(context)} {...args} />,
}

export const EditorialPhotoSplit: StoryObj<typeof ErrorStateEditorialPhotoSplit> = {
  name: "Editorial Photo Split",
  argTypes: errorStateArgTypes(ErrorStateEditorialPhotoSplit, errorStateEditorialPhotoSplitCopy),
  render: (args, context) => (
    <ErrorStateEditorialPhotoSplit locale={localeOf(context)} image={editorialPhoto(localeOf(context))} {...args} />
  ),
}

/** Without `image`, the frame is a token-coloured placeholder of the same size. */
export const EditorialPhotoSplitNoImage: StoryObj<typeof ErrorStateEditorialPhotoSplit> = {
  tags: ["!dev", "!autodocs"],
  name: "Editorial Photo Split: No image",
  argTypes: errorStateArgTypes(ErrorStateEditorialPhotoSplit, errorStateEditorialPhotoSplitCopy),
  render: (args, context) => <ErrorStateEditorialPhotoSplit locale={localeOf(context)} {...args} />,
}

export const FullBleedPhoto: StoryObj<typeof ErrorStateFullBleedPhoto> = {
  name: "Full-Bleed Photo",
  argTypes: errorStateArgTypes(ErrorStateFullBleedPhoto, errorStateFullBleedPhotoCopy),
  render: (args, context) => (
    <ErrorStateFullBleedPhoto locale={localeOf(context)} image={fullBleedPhoto(localeOf(context))} {...args} />
  ),
}

/** Without `image`, the stage is a token-coloured placeholder under the same scrim. */
export const FullBleedPhotoNoImage: StoryObj<typeof ErrorStateFullBleedPhoto> = {
  tags: ["!dev", "!autodocs"],
  name: "Full-Bleed Photo: No image",
  argTypes: errorStateArgTypes(ErrorStateFullBleedPhoto, errorStateFullBleedPhotoCopy),
  render: (args, context) => <ErrorStateFullBleedPhoto locale={localeOf(context)} {...args} />,
}

export const ColourFieldScatter: StoryObj<typeof ErrorStateColourFieldScatter> = {
  name: "Colour Field Scatter",
  argTypes: errorStateArgTypes(ErrorStateColourFieldScatter, errorStateColourFieldScatterCopy),
  render: (args, context) => <ErrorStateColourFieldScatter locale={localeOf(context)} {...args} />,
}

export const DarkSpotlight: StoryObj<typeof ErrorStateDarkSpotlight> = {
  name: "Dark Spotlight",
  argTypes: errorStateArgTypes(ErrorStateDarkSpotlight, errorStateDarkSpotlightCopy),
  render: (args, context) => <ErrorStateDarkSpotlight locale={localeOf(context)} {...args} />,
}

/** Keyboard focus on the inverted surface: the rings are drawn in the inverse foreground. */
export const DarkSpotlightFocus: StoryObj<typeof ErrorStateDarkSpotlight> = {
  tags: ["!dev", "!autodocs"],
  ...DarkSpotlight,
  name: "Dark Spotlight: Keyboard focus",
  parameters: { pseudo: { focusVisible: ["a"] } },
}

export const GhostWatermark: StoryObj<typeof ErrorStateGhostWatermark> = {
  name: "Ghost Watermark",
  argTypes: errorStateArgTypes(ErrorStateGhostWatermark, errorStateGhostWatermarkCopy),
  render: (args, context) => <ErrorStateGhostWatermark locale={localeOf(context)} {...args} />,
}

export const HelpfulLinksList: StoryObj<typeof ErrorStateHelpfulLinksList> = {
  name: "Helpful Links List",
  argTypes: errorStateArgTypes(ErrorStateHelpfulLinksList, errorStateHelpfulLinksListCopy),
  render: (args, context) => <ErrorStateHelpfulLinksList locale={localeOf(context)} {...args} />,
}

/** Without destinations, the card is left out and the message sits over the buttons. */
export const HelpfulLinksListEmpty: StoryObj<typeof ErrorStateHelpfulLinksList> = {
  tags: ["!dev", "!autodocs"],
  name: "Helpful Links List: No destinations",
  argTypes: errorStateArgTypes(ErrorStateHelpfulLinksList, errorStateHelpfulLinksListCopy),
  args: { destinations: [] },
  render: (args, context) => <ErrorStateHelpfulLinksList locale={localeOf(context)} {...args} />,
}

export const PopularPagesGrid: StoryObj<typeof ErrorStatePopularPagesGrid> = {
  name: "Popular Pages Grid",
  argTypes: errorStateArgTypes(ErrorStatePopularPagesGrid, errorStatePopularPagesGridCopy),
  render: (args, context) => (
    <ErrorStatePopularPagesGrid locale={localeOf(context)} pages={popularPages(localeOf(context))} {...args} />
  ),
}

/** Without images, each card's frame is a token-coloured placeholder of the same size. */
export const PopularPagesGridNoImages: StoryObj<typeof ErrorStatePopularPagesGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Popular Pages Grid: No images",
  argTypes: errorStateArgTypes(ErrorStatePopularPagesGrid, errorStatePopularPagesGridCopy),
  render: (args, context) => <ErrorStatePopularPagesGrid locale={localeOf(context)} {...args} />,
}

/** With no pages, the grid is left out and the header stands alone. */
export const PopularPagesGridEmpty: StoryObj<typeof ErrorStatePopularPagesGrid> = {
  tags: ["!dev", "!autodocs"],
  name: "Popular Pages Grid: No pages",
  argTypes: errorStateArgTypes(ErrorStatePopularPagesGrid, errorStatePopularPagesGridCopy),
  args: { pages: [] },
  render: (args, context) => <ErrorStatePopularPagesGrid locale={localeOf(context)} {...args} />,
}

/** Press the copy glyph: it turns to a check and "Copied" shows for a moment. */
export const ErrorCardPanel: StoryObj<typeof ErrorStateErrorCardPanel> = {
  name: "Error Card Panel",
  argTypes: errorStateArgTypes(ErrorStateErrorCardPanel, errorStateErrorCardPanelCopy, ["copyLabel"]),
  render: (args, context) => <ErrorStateErrorCardPanel locale={localeOf(context)} {...args} />,
}

/** Retrying: the outline button is busy while `onRetry`'s promise is pending. */
export const ErrorCardPanelRetrying: StoryObj<typeof ErrorStateErrorCardPanel> = {
  tags: ["!dev", "!autodocs"],
  name: "Error Card Panel: Retrying",
  argTypes: errorStateArgTypes(ErrorStateErrorCardPanel, errorStateErrorCardPanelCopy, ["copyLabel"]),
  args: { onRetry: () => new Promise<void>(() => {}) },
  render: (args, context) => <ErrorStateErrorCardPanel locale={localeOf(context)} {...args} />,
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>("[data-variant=outline]")?.click()
  },
}

export const IllustratedEmptyState: StoryObj<typeof ErrorStateIllustratedEmptyState> = {
  name: "Illustrated Empty State",
  argTypes: errorStateArgTypes(ErrorStateIllustratedEmptyState, errorStateIllustratedEmptyStateCopy),
  render: (args, context) => <ErrorStateIllustratedEmptyState locale={localeOf(context)} {...args} />,
}

export const LightEditorial: StoryObj<typeof ErrorStateLightEditorial> = {
  name: "Light Editorial",
  argTypes: errorStateArgTypes(ErrorStateLightEditorial, errorStateLightEditorialCopy),
  render: (args, context) => <ErrorStateLightEditorial locale={localeOf(context)} {...args} />,
}

/** Try again calls `onRetry`; without it, the button reloads the page. */
export const LayeredBadgeCentered: StoryObj<typeof ErrorStateLayeredBadgeCentered> = {
  name: "Layered Badge Centered",
  argTypes: errorStateArgTypes(ErrorStateLayeredBadgeCentered, errorStateLayeredBadgeCenteredCopy),
  args: { onRetry: fn() },
  render: (args, context) => <ErrorStateLayeredBadgeCentered locale={localeOf(context)} {...args} />,
}

/** Type in the search tile and press Enter: the query goes to `onSearch`. */
export const RecoveryBento: StoryObj<typeof ErrorStateRecoveryBento> = {
  name: "Recovery Bento",
  argTypes: errorStateArgTypes(ErrorStateRecoveryBento, errorStateRecoveryBentoCopy),
  args: { onSearch: fn() },
  render: (args, context) => <ErrorStateRecoveryBento locale={localeOf(context)} {...args} />,
}

/** Without the second row's tiles, the bento ends with the search and the homepage. */
export const RecoveryBentoEmpty: StoryObj<typeof ErrorStateRecoveryBento> = {
  tags: ["!dev", "!autodocs"],
  name: "Recovery Bento: No tiles",
  argTypes: errorStateArgTypes(ErrorStateRecoveryBento, errorStateRecoveryBentoCopy),
  args: { onSearch: fn(), tiles: [] },
  render: (args, context) => <ErrorStateRecoveryBento locale={localeOf(context)} {...args} />,
}

export const SitemapColumns: StoryObj<typeof ErrorStateSitemapColumns> = {
  name: "Sitemap Columns",
  argTypes: errorStateArgTypes(ErrorStateSitemapColumns, errorStateSitemapColumnsCopy, ["sitemapLabel"]),
  render: (args, context) => <ErrorStateSitemapColumns locale={localeOf(context)} {...args} />,
}

/** Without columns, the hairline goes too and only the header is left. */
export const SitemapColumnsEmpty: StoryObj<typeof ErrorStateSitemapColumns> = {
  tags: ["!dev", "!autodocs"],
  name: "Sitemap Columns: No columns",
  argTypes: errorStateArgTypes(ErrorStateSitemapColumns, errorStateSitemapColumnsCopy, ["sitemapLabel"]),
  args: { columns: [] },
  render: (args, context) => <ErrorStateSitemapColumns locale={localeOf(context)} {...args} />,
}

/** The window stays English and left to right in both directions; press Copy request ID to see Copied. */
export const TerminalConsole: StoryObj<typeof ErrorStateTerminalConsole> = {
  name: "Terminal Console",
  argTypes: errorStateArgTypes(ErrorStateTerminalConsole, errorStateTerminalConsoleCopy),
  render: (args, context) => <ErrorStateTerminalConsole locale={localeOf(context)} {...args} />,
}

export const PhotoCollageScatter: StoryObj<typeof ErrorStatePhotoCollageScatter> = {
  name: "Photo Collage Scatter",
  argTypes: errorStateArgTypes(ErrorStatePhotoCollageScatter, errorStatePhotoCollageScatterCopy),
  render: (args, context) => (
    <ErrorStatePhotoCollageScatter locale={localeOf(context)} photos={collagePhotos(localeOf(context))} {...args} />
  ),
}

/** Without `photos`, each print shows a token-coloured placeholder of the same size. */
export const PhotoCollageScatterNoImages: StoryObj<typeof ErrorStatePhotoCollageScatter> = {
  tags: ["!dev", "!autodocs"],
  name: "Photo Collage Scatter: No images",
  argTypes: errorStateArgTypes(ErrorStatePhotoCollageScatter, errorStatePhotoCollageScatterCopy),
  render: (args, context) => <ErrorStatePhotoCollageScatter locale={localeOf(context)} {...args} />,
}

export const SupportEscalationBand: StoryObj<typeof ErrorStateSupportEscalationBand> = {
  name: "Support Escalation Band",
  argTypes: errorStateArgTypes(ErrorStateSupportEscalationBand, errorStateSupportEscalationBandCopy),
  render: (args, context) => (
    <ErrorStateSupportEscalationBand
      locale={localeOf(context)}
      people={[
        { name: "Hana Malik", src: "/blocks/error-state/avatar.webp" },
        { name: "Sami Rahman", src: "/blocks/error-state/avatar.webp" },
        { name: "Vera Bauer" },
      ]}
      {...args}
    />
  ),
}

/** Without photos, every avatar shows its initials. */
export const SupportEscalationBandNoPhotos: StoryObj<typeof ErrorStateSupportEscalationBand> = {
  tags: ["!dev", "!autodocs"],
  name: "Support Escalation Band: No photos",
  argTypes: errorStateArgTypes(ErrorStateSupportEscalationBand, errorStateSupportEscalationBandCopy),
  render: (args, context) => <ErrorStateSupportEscalationBand locale={localeOf(context)} {...args} />,
}

export const SplitColourPanel: StoryObj<typeof ErrorStateSplitColourPanel> = {
  name: "Split Colour Panel",
  argTypes: errorStateArgTypes(ErrorStateSplitColourPanel, errorStateSplitColourPanelCopy),
  render: (args, context) => <ErrorStateSplitColourPanel locale={localeOf(context)} {...args} />,
}

/** Two tickers scroll in opposite directions; hover one to ease it to a stop, or press the pause button to stop both. */
export const Marquee404Band: StoryObj<typeof ErrorStateMarquee404Band> = {
  name: "Marquee 404 Band",
  argTypes: errorStateArgTypes(ErrorStateMarquee404Band, errorStateMarquee404BandCopy, ["pauseLabel", "playLabel"]),
  render: (args, context) => <ErrorStateMarquee404Band locale={localeOf(context)} {...args} />,
}

/** The trail that led here, with the steps between hidden on a phone. */
export const BrokenTrailBreadcrumb: StoryObj<typeof ErrorStateBrokenTrailBreadcrumb> = {
  name: "Broken Trail Breadcrumb",
  argTypes: errorStateArgTypes(ErrorStateBrokenTrailBreadcrumb, errorStateBrokenTrailBreadcrumbCopy, ["trailLabel"]),
  render: (args, context) => <ErrorStateBrokenTrailBreadcrumb locale={localeOf(context)} {...args} />,
}

// Other states

/** Press Retry now: the button shows its spinner while the retry runs. */
export const ServerError500: StoryObj<typeof ErrorStateServerError500> = {
  name: "Server Error 500",
  argTypes: errorStateArgTypes(ErrorStateServerError500, errorStateServerError500Copy, ["retryingLabel"]),
  render: (args, context) => <ErrorStateServerError500 locale={localeOf(context)} {...args} onRetry={settleSoon} />,
}

/** The retry failed: a line under the actions says so. */
export const ServerError500RetryFails: StoryObj<typeof ErrorStateServerError500> = {
  tags: ["!dev", "!autodocs"],
  name: "Server Error 500: Retry fails",
  argTypes: errorStateArgTypes(ErrorStateServerError500, errorStateServerError500Copy, ["retryingLabel"]),
  render: (args, context) => <ErrorStateServerError500 locale={localeOf(context)} {...args} onRetry={failSoon} />,
}

/** Press Request access: the row shows a spinner, then confirms. */
export const AccessDenied403: StoryObj<typeof ErrorStateAccessDenied403> = {
  name: "Access Denied 403",
  argTypes: errorStateArgTypes(ErrorStateAccessDenied403, errorStateAccessDenied403Copy),
  render: (args, context) => (
    <ErrorStateAccessDenied403
      locale={localeOf(context)}
      account={{
        ...errorStateAccessDenied403Copy[localeOf(context)].account,
        avatar: "/blocks/error-state/avatar.webp",
      }}
      {...args}
      onRequestAccess={settleSoon}
    />
  ),
}

/** Without a photo, the avatar shows the person's initials. */
export const AccessDenied403NoPhoto: StoryObj<typeof ErrorStateAccessDenied403> = {
  tags: ["!dev", "!autodocs"],
  name: "Access Denied 403: No photo",
  argTypes: errorStateArgTypes(ErrorStateAccessDenied403, errorStateAccessDenied403Copy),
  render: (args, context) => <ErrorStateAccessDenied403 locale={localeOf(context)} {...args} onRequestAccess={settleSoon} />,
}

/** The request failed: the row says so and can be pressed again. */
export const AccessDenied403RequestFails: StoryObj<typeof ErrorStateAccessDenied403> = {
  tags: ["!dev", "!autodocs"],
  name: "Access Denied 403: Request fails",
  argTypes: errorStateArgTypes(ErrorStateAccessDenied403, errorStateAccessDenied403Copy),
  render: (args, context) => <ErrorStateAccessDenied403 locale={localeOf(context)} {...args} onRequestAccess={failSoon} />,
}

/** Press Try again: the button shows its spinner while it reconnects. */
export const OfflineState: StoryObj<typeof ErrorStateOfflineState> = {
  name: "Offline State",
  argTypes: errorStateArgTypes(ErrorStateOfflineState, errorStateOfflineStateCopy, ["retryingLabel"]),
  render: (args, context) => <ErrorStateOfflineState locale={localeOf(context)} {...args} onRetry={settleSoon} />,
}

/** Still offline after Try again: a line under the actions says so. */
export const OfflineStateRetryFails: StoryObj<typeof ErrorStateOfflineState> = {
  tags: ["!dev", "!autodocs"],
  name: "Offline State: Retry fails",
  argTypes: errorStateArgTypes(ErrorStateOfflineState, errorStateOfflineStateCopy, ["retryingLabel"]),
  render: (args, context) => <ErrorStateOfflineState locale={localeOf(context)} {...args} onRetry={failSoon} />,
}

/** Enter an address and press Notify me: pending, then the confirmation. */
export const MaintenanceMode: StoryObj<typeof ErrorStateMaintenanceMode> = {
  name: "Maintenance Mode",
  argTypes: errorStateArgTypes(ErrorStateMaintenanceMode, errorStateMaintenanceModeCopy, ["pendingLabel"]),
  render: (args, context) => <ErrorStateMaintenanceMode locale={localeOf(context)} {...args} onSubscribe={settleSoon} />,
}

/** The sign-up is held mid-send. */
export const MaintenanceModePending: StoryObj<typeof ErrorStateMaintenanceMode> = {
  tags: ["!dev", "!autodocs"],
  name: "Maintenance Mode: Pending",
  argTypes: errorStateArgTypes(ErrorStateMaintenanceMode, errorStateMaintenanceModeCopy, ["pendingLabel"]),
  render: (args, context) => <ErrorStateMaintenanceMode locale={localeOf(context)} {...args} onSubscribe={never} />,
}

/** The sign-up failed: the form stays as it was, with a line under it. */
export const MaintenanceModeFails: StoryObj<typeof ErrorStateMaintenanceMode> = {
  tags: ["!dev", "!autodocs"],
  name: "Maintenance Mode: Sign-up fails",
  argTypes: errorStateArgTypes(ErrorStateMaintenanceMode, errorStateMaintenanceModeCopy, ["pendingLabel"]),
  render: (args, context) => <ErrorStateMaintenanceMode locale={localeOf(context)} {...args} onSubscribe={failSoon} />,
}

/** The sign-up turned off. */
export const MaintenanceModeDisabled: StoryObj<typeof ErrorStateMaintenanceMode> = {
  tags: ["!dev", "!autodocs"],
  name: "Maintenance Mode: Disabled",
  argTypes: errorStateArgTypes(ErrorStateMaintenanceMode, errorStateMaintenanceModeCopy, ["pendingLabel"]),
  args: { disabled: true },
  render: (args, context) => <ErrorStateMaintenanceMode locale={localeOf(context)} {...args} />,
}

/** Search again from the field or a suggestion: the heading names each query. */
export const EmptySearchResults: StoryObj<typeof ErrorStateEmptySearchResults> = {
  name: "Empty Search Results",
  argTypes: errorStateArgTypes(ErrorStateEmptySearchResults, errorStateEmptySearchResultsCopy, ["suggestionsLabel"]),
  render: (args, context) => <ErrorStateEmptySearchResults locale={localeOf(context)} {...args} onSearch={settleSoon} />,
}

/** The field, the button and the suggestions turned off. */
export const EmptySearchResultsDisabled: StoryObj<typeof ErrorStateEmptySearchResults> = {
  tags: ["!dev", "!autodocs"],
  ...EmptySearchResults,
  name: "Empty Search Results: Disabled",
  args: { disabled: true },
}

/**
 * The bar fills over ten seconds while the line counts down; Cancel stops it.
 * At zero the story restarts nothing and stays here: it passes `onRedirect`.
 */
export const CountdownRedirect: StoryObj<typeof ErrorStateCountdownRedirect> = {
  name: "Countdown Redirect",
  argTypes: errorStateArgTypes(ErrorStateCountdownRedirect, errorStateCountdownRedirectCopy),
  render: (args, context) => <ErrorStateCountdownRedirect locale={localeOf(context)} {...args} onRedirect={() => {}} />,
}
