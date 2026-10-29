"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { authExample } from "@/components/blocks/authentications-examples"
import { aboutPhotoProps } from "@/components/blocks/about-photos"
import { careersPhotoProps } from "@/components/blocks/careers-photos"
import { teamPhotoProps } from "@/components/blocks/team-photos"
import { blogCardsPhotoProps } from "@/components/blocks/blog-cards-photos"
import { galleryPhotoProps } from "@/components/blocks/gallery-photos"
import { NavbarStage, navbarExample } from "@/components/blocks/navbar-examples"
import { heroPhotoProps } from "@/components/blocks/hero-photos"
import { socialProofPhotos } from "@/components/blocks/social-proof-photos"

/**
 * Every FAQ, Error State, Logo Cloud, Authentications, Gallery, Navbar,
 * Pricing, Hero, About, Careers, Social Proof and Blog Cards Type by registry name, each loaded on its
 * own so a preview frame downloads only the block it shows.
 */
/** Each block has its own props; a frame passes only the locale and demo props. */
type AnyBlock = React.ComponentType<any>
type Locale = "en" | "ar"

/** The Error State photos no block ships with: Figma's, in public/blocks/error-state/. */
const POPULAR_PAGE_ALTS: Record<Locale, string[]> = {
  en: ["Bare trees in thick fog", "A sand dune at sunrise", "Stone steps into a green forest"],
  ar: ["أشجار عارية في ضباب كثيف", "كثيب رملي عند شروق الشمس", "درجات حجرية تصعد إلى غابة خضراء"],
}

const COLLAGE_ALTS: Record<Locale, string[]> = {
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

/**
 * Popular Pages Grid and Access Denied 403 take each photo inside a copy
 * object (a page, the account), so their photos are added to the block's own
 * copy once the block has loaded, keeping the frame's download to one block.
 */
type PageCopy = Record<Locale, { pages: object[] }>
const withPopularPagesPhotos = (Block: AnyBlock, copy: PageCopy) =>
  function PopularPagesPreview(props: { locale: Locale }) {
    const pages = copy[props.locale].pages.map((page, index) => ({
      ...page,
      image: { src: `/blocks/error-state/popular-pages-${index + 1}.webp`, alt: POPULAR_PAGE_ALTS[props.locale][index] },
    }))
    return <Block pages={pages} {...props} />
  }

type AccountCopy = Record<Locale, { account: object }>
const withAccountPhoto = (Block: AnyBlock, copy: AccountCopy) =>
  function AccessDeniedPreview(props: { locale: Locale }) {
    return <Block account={{ ...copy[props.locale].account, avatar: "/blocks/error-state/avatar.webp" }} {...props} />
  }

/**
 * Logo Cloud ships no logos: each Type's preview passes Figma's Brand Logos
 * from the example data, loaded with the block so only Logo Cloud frames
 * download the marks.
 */
const withLogoCloudExample = (slug: string, block: Promise<AnyBlock>) =>
  Promise.all([block, import("./logo-cloud-examples")]).then(([Block, { LOGO_CLOUD_EXAMPLES }]) =>
    function LogoCloudPreview(props: { locale: Locale }) {
      const example = (LOGO_CLOUD_EXAMPLES[props.locale] as Record<string, object>)[slug]
      return <Block {...example} {...props} />
    }
  )

/**
 * An Authentications block with its example: the Fasla Logo, and the photos
 * and avatars from public/blocks/authentications/, added to the block's own
 * copy once the block has loaded.
 */
const withAuthExample = (Block: AnyBlock, slug: string, copy: object) =>
  function AuthenticationsPreview(props: { locale: Locale }) {
    return <Block {...authExample(slug, props.locale, copy as Parameters<typeof authExample>[2])} {...props} />
  }

/**
 * A Gallery Type with its demo photos, from public/images/gallery/: as a
 * `photos` list, or added to each item of the block's own copy.
 */
type GalleryCopy = Record<Locale, object>
const withGalleryPhotos = (Block: AnyBlock, type: string, copy: GalleryCopy) =>
  function GalleryPreview(props: { locale: Locale }) {
    return <Block {...galleryPhotoProps(type, props.locale, copy)} {...props} />
  }

/**
 * A Navbar block with its example (the Fasla Logo, the account photo), with
 * the room its menus and Sheet need to open inside the frame.
 */
const withNavbarExample = (Block: AnyBlock, slug: string) =>
  function NavbarPreview(props: { locale: Locale }) {
    return (
      <NavbarStage slug={slug}>
        <Block {...navbarExample(slug)} {...props} />
      </NavbarStage>
    )
  }

/** A Hero Type with its demo photos and faces, from public/images/hero/. */
const withHeroPhotos = (Block: AnyBlock, type: string) =>
  function HeroPreview(props: { locale: Locale }) {
    return <Block {...heroPhotoProps(type, props.locale)} {...props} />
  }

/**
 * An About Type with its demo photos, from public/images/gallery/ and
 * public/images/about/: as a `photos` list, or added to each item of the
 * block's own copy. Types without photos render as they are.
 */
type AboutCopy = Record<Locale, object>
const withAboutPhotos = (Block: AnyBlock, type: string, copy: AboutCopy) =>
  function AboutPreview(props: { locale: Locale }) {
    return <Block {...aboutPhotoProps(type, props.locale, copy)} {...props} />
  }

/**
 * A Careers Type with its demo photo, from public/images/careers/ or the Hero
 * photos. Types without a photo render as they are.
 */
const withCareersPhotos = (Block: AnyBlock, type: string) =>
  function CareersPreview(props: { locale: Locale }) {
    return <Block {...careersPhotoProps(type, props.locale)} {...props} />
  }

/**
 * A Team Type with its demo photos, from public/blocks/team/: each person in
 * the block's own copy gets one, by their `id`. The two cut-out Types take the
 * transparent files.
 */
type TeamCopy = Record<Locale, object>
const withTeamPhotos = (Block: AnyBlock, type: string, copy: TeamCopy) =>
  function TeamPreview(props: { locale: Locale }) {
    return <Block {...teamPhotoProps(type, props.locale, copy)} {...props} />
  }

/**
 * A Social Proof Type with its demo photos, from social-proof-photos.ts:
 * every person and photo slot has one, so no preview shows initials.
 */
const withSocialProofPhotos = (Block: AnyBlock) =>
  function SocialProofPreview(props: { locale: Locale }) {
    return <Block photos={socialProofPhotos} {...props} />
  }

/** Social Proof's video Types play Hero's demo film when the reader presses play. */
const SOCIAL_PROOF_FILM = { videoSrc: "/images/hero/office-film.mp4", videoType: "video/mp4" }
const withSocialProofVideo = (Block: AnyBlock, items?: (copy: any) => object) =>
  function SocialProofVideoPreview(props: { locale: Locale }) {
    const extra = items ? items(props.locale) : SOCIAL_PROOF_FILM
    return <Block photos={socialProofPhotos} {...extra} {...props} />
  }

/**
 * A Blog Cards Type with its demo photos, from public/images/blog-cards/:
 * added to each item of the block's own copy list. Types without photos
 * render as they are.
 */
type BlogCardsCopy = Record<Locale, object>
const withBlogCardsPhotos = (Block: AnyBlock, type: string, copy: BlogCardsCopy) =>
  function BlogCardsPreview(props: { locale: Locale }) {
    return <Block {...blogCardsPhotoProps(type, props.locale, copy)} {...props} />
  }

export const BLOCK_COMPONENTS: Record<string, AnyBlock> = {
  "faq-classic-centered": dynamic(() => import("@fasla-ui/blocks/faq-classic-centered/FaqClassicCentered").then((m) => m.FaqClassicCentered)),
  "faq-split-sticky": dynamic(() => import("@fasla-ui/blocks/faq-split-sticky/FaqSplitSticky").then((m) => m.FaqSplitSticky)),
  "faq-accent-active-card": dynamic(() => import("@fasla-ui/blocks/faq-accent-active-card/FaqAccentActiveCard").then((m) => m.FaqAccentActiveCard)),
  "faq-soft-filled-rows": dynamic(() => import("@fasla-ui/blocks/faq-soft-filled-rows/FaqSoftFilledRows").then((m) => m.FaqSoftFilledRows)),
  "faq-numbered-editorial": dynamic(() => import("@fasla-ui/blocks/faq-numbered-editorial/FaqNumberedEditorial").then((m) => m.FaqNumberedEditorial)),
  "faq-dark-panel": dynamic(() => import("@fasla-ui/blocks/faq-dark-panel/FaqDarkPanel").then((m) => m.FaqDarkPanel)),
  "faq-mono-index": dynamic(() => import("@fasla-ui/blocks/faq-mono-index/FaqMonoIndex").then((m) => m.FaqMonoIndex)),
  "faq-uppercase-dense": dynamic(() => import("@fasla-ui/blocks/faq-uppercase-dense/FaqUppercaseDense").then((m) => m.FaqUppercaseDense)),
  "faq-featured-question": dynamic(() => import("@fasla-ui/blocks/faq-featured-question/FaqFeaturedQuestion").then((m) => m.FaqFeaturedQuestion)),
  "faq-two-column-grid": dynamic(() => import("@fasla-ui/blocks/faq-two-column-grid/FaqTwoColumnGrid").then((m) => m.FaqTwoColumnGrid)),
  "faq-masonry-cards": dynamic(() => import("@fasla-ui/blocks/faq-masonry-cards/FaqMasonryCards").then((m) => m.FaqMasonryCards)),
  "faq-category-columns": dynamic(() => import("@fasla-ui/blocks/faq-category-columns/FaqCategoryColumns").then((m) => m.FaqCategoryColumns)),
  "faq-grouped-sections": dynamic(() => import("@fasla-ui/blocks/faq-grouped-sections/FaqGroupedSections").then((m) => m.FaqGroupedSections)),
  "faq-table-compact": dynamic(() => import("@fasla-ui/blocks/faq-table-compact/FaqTableCompact").then((m) => m.FaqTableCompact)),
  "faq-search-categories": dynamic(() => import("@fasla-ui/blocks/faq-search-categories/FaqSearchCategories").then((m) => m.FaqSearchCategories)),
  "faq-tabs-by-topic": dynamic(() => import("@fasla-ui/blocks/faq-tabs-by-topic/FaqTabsByTopic").then((m) => m.FaqTabsByTopic)),
  "faq-sidebar-nav": dynamic(() => import("@fasla-ui/blocks/faq-sidebar-nav/FaqSidebarNav").then((m) => m.FaqSidebarNav)),
  "faq-category-chip-grid": dynamic(() => import("@fasla-ui/blocks/faq-category-chip-grid/FaqCategoryChipGrid").then((m) => m.FaqCategoryChipGrid)),
  "faq-topic-tiles": dynamic(() => import("@fasla-ui/blocks/faq-topic-tiles/FaqTopicTiles").then((m) => m.FaqTopicTiles)),
  "faq-help-hero-popular": dynamic(() => import("@fasla-ui/blocks/faq-help-hero-popular/FaqHelpHeroPopular").then((m) => m.FaqHelpHeroPopular)),
  "faq-contact-cta-card": dynamic(() => import("@fasla-ui/blocks/faq-contact-cta-card/FaqContactCtaCard").then((m) => m.FaqContactCtaCard)),
  "faq-support-channels": dynamic(() => import("@fasla-ui/blocks/faq-support-channels/FaqSupportChannels").then((m) => m.FaqSupportChannels)),
  "faq-newsletter-close": dynamic(() => import("@fasla-ui/blocks/faq-newsletter-close/FaqNewsletterClose").then((m) => m.FaqNewsletterClose)),
  "faq-support-stats": dynamic(() => import("@fasla-ui/blocks/faq-support-stats/FaqSupportStats").then((m) => m.FaqSupportStats)),
  "faq-media-split": dynamic(() => import("@fasla-ui/blocks/faq-media-split/FaqMediaSplit").then((m) => m.FaqMediaSplit)),
  "faq-chat-thread": dynamic(() => import("@fasla-ui/blocks/faq-chat-thread/FaqChatThread").then((m) => m.FaqChatThread)),
  "error-state-centered-minimal": dynamic(() => import("@fasla-ui/blocks/error-state-centered-minimal/ErrorStateCenteredMinimal").then((m) => m.ErrorStateCenteredMinimal)),
  "error-state-search-recovery": dynamic(() => import("@fasla-ui/blocks/error-state-search-recovery/ErrorStateSearchRecovery").then((m) => m.ErrorStateSearchRecovery)),
  "error-state-display-numeral-split": dynamic(() => import("@fasla-ui/blocks/error-state-display-numeral-split/ErrorStateDisplayNumeralSplit").then((m) => m.ErrorStateDisplayNumeralSplit)),
  "error-state-editorial-photo-split": dynamic(() => import("@fasla-ui/blocks/error-state-editorial-photo-split/ErrorStateEditorialPhotoSplit").then((m) => m.ErrorStateEditorialPhotoSplit)),
  "error-state-full-bleed-photo": dynamic(() => import("@fasla-ui/blocks/error-state-full-bleed-photo/ErrorStateFullBleedPhoto").then((m) => m.ErrorStateFullBleedPhoto)),
  "error-state-colour-field-scatter": dynamic(() => import("@fasla-ui/blocks/error-state-colour-field-scatter/ErrorStateColourFieldScatter").then((m) => m.ErrorStateColourFieldScatter)),
  "error-state-dark-spotlight": dynamic(() => import("@fasla-ui/blocks/error-state-dark-spotlight/ErrorStateDarkSpotlight").then((m) => m.ErrorStateDarkSpotlight)),
  "error-state-ghost-watermark": dynamic(() => import("@fasla-ui/blocks/error-state-ghost-watermark/ErrorStateGhostWatermark").then((m) => m.ErrorStateGhostWatermark)),
  "error-state-helpful-links-list": dynamic(() => import("@fasla-ui/blocks/error-state-helpful-links-list/ErrorStateHelpfulLinksList").then((m) => m.ErrorStateHelpfulLinksList)),
  "error-state-popular-pages-grid": dynamic(() =>
    import("@fasla-ui/blocks/error-state-popular-pages-grid/ErrorStatePopularPagesGrid").then((m) => withPopularPagesPhotos(m.ErrorStatePopularPagesGrid, m.errorStatePopularPagesGridCopy))
  ),
  "error-state-error-card-panel": dynamic(() => import("@fasla-ui/blocks/error-state-error-card-panel/ErrorStateErrorCardPanel").then((m) => m.ErrorStateErrorCardPanel)),
  "error-state-illustrated-empty-state": dynamic(() => import("@fasla-ui/blocks/error-state-illustrated-empty-state/ErrorStateIllustratedEmptyState").then((m) => m.ErrorStateIllustratedEmptyState)),
  "error-state-light-editorial": dynamic(() => import("@fasla-ui/blocks/error-state-light-editorial/ErrorStateLightEditorial").then((m) => m.ErrorStateLightEditorial)),
  "error-state-layered-badge-centered": dynamic(() => import("@fasla-ui/blocks/error-state-layered-badge-centered/ErrorStateLayeredBadgeCentered").then((m) => m.ErrorStateLayeredBadgeCentered)),
  "error-state-server-error-500": dynamic(() => import("@fasla-ui/blocks/error-state-server-error-500/ErrorStateServerError500").then((m) => m.ErrorStateServerError500)),
  "error-state-access-denied-403": dynamic(() =>
    import("@fasla-ui/blocks/error-state-access-denied-403/ErrorStateAccessDenied403").then((m) => withAccountPhoto(m.ErrorStateAccessDenied403, m.errorStateAccessDenied403Copy))
  ),
  "error-state-offline-state": dynamic(() => import("@fasla-ui/blocks/error-state-offline-state/ErrorStateOfflineState").then((m) => m.ErrorStateOfflineState)),
  "error-state-maintenance-mode": dynamic(() => import("@fasla-ui/blocks/error-state-maintenance-mode/ErrorStateMaintenanceMode").then((m) => m.ErrorStateMaintenanceMode)),
  "error-state-empty-search-results": dynamic(() => import("@fasla-ui/blocks/error-state-empty-search-results/ErrorStateEmptySearchResults").then((m) => m.ErrorStateEmptySearchResults)),
  "error-state-recovery-bento": dynamic(() => import("@fasla-ui/blocks/error-state-recovery-bento/ErrorStateRecoveryBento").then((m) => m.ErrorStateRecoveryBento)),
  "error-state-sitemap-columns": dynamic(() => import("@fasla-ui/blocks/error-state-sitemap-columns/ErrorStateSitemapColumns").then((m) => m.ErrorStateSitemapColumns)),
  "error-state-terminal-console": dynamic(() => import("@fasla-ui/blocks/error-state-terminal-console/ErrorStateTerminalConsole").then((m) => m.ErrorStateTerminalConsole)),
  "error-state-photo-collage-scatter": dynamic(() => import("@fasla-ui/blocks/error-state-photo-collage-scatter/ErrorStatePhotoCollageScatter").then((m) => m.ErrorStatePhotoCollageScatter)),
  "error-state-support-escalation-band": dynamic(() => import("@fasla-ui/blocks/error-state-support-escalation-band/ErrorStateSupportEscalationBand").then((m) => m.ErrorStateSupportEscalationBand)),
  "error-state-split-colour-panel": dynamic(() => import("@fasla-ui/blocks/error-state-split-colour-panel/ErrorStateSplitColourPanel").then((m) => m.ErrorStateSplitColourPanel)),
  "error-state-marquee-404-band": dynamic(() => import("@fasla-ui/blocks/error-state-marquee-404-band/ErrorStateMarquee404Band").then((m) => m.ErrorStateMarquee404Band)),
  "error-state-broken-trail-breadcrumb": dynamic(() => import("@fasla-ui/blocks/error-state-broken-trail-breadcrumb/ErrorStateBrokenTrailBreadcrumb").then((m) => m.ErrorStateBrokenTrailBreadcrumb)),
  "error-state-countdown-redirect": dynamic(() => import("@fasla-ui/blocks/error-state-countdown-redirect/ErrorStateCountdownRedirect").then((m) => m.ErrorStateCountdownRedirect)),
  "logo-cloud-centered-caption-row": dynamic(() =>
    withLogoCloudExample("logo-cloud-centered-caption-row", import("@fasla-ui/blocks/logo-cloud-centered-caption-row/LogoCloudCenteredCaptionRow").then((m) => m.LogoCloudCenteredCaptionRow))
  ),
  "logo-cloud-heading-grid": dynamic(() =>
    withLogoCloudExample("logo-cloud-heading-grid", import("@fasla-ui/blocks/logo-cloud-heading-grid/LogoCloudHeadingGrid").then((m) => m.LogoCloudHeadingGrid))
  ),
  "logo-cloud-bordered-cell-grid": dynamic(() =>
    withLogoCloudExample("logo-cloud-bordered-cell-grid", import("@fasla-ui/blocks/logo-cloud-bordered-cell-grid/LogoCloudBorderedCellGrid").then((m) => m.LogoCloudBorderedCellGrid))
  ),
  "logo-cloud-enterprise-wall": dynamic(() =>
    withLogoCloudExample("logo-cloud-enterprise-wall", import("@fasla-ui/blocks/logo-cloud-enterprise-wall/LogoCloudEnterpriseWall").then((m) => m.LogoCloudEnterpriseWall))
  ),
  "logo-cloud-contained-card": dynamic(() =>
    withLogoCloudExample("logo-cloud-contained-card", import("@fasla-ui/blocks/logo-cloud-contained-card/LogoCloudContainedCard").then((m) => m.LogoCloudContainedCard))
  ),
  "logo-cloud-dark-logo-wall": dynamic(() =>
    withLogoCloudExample("logo-cloud-dark-logo-wall", import("@fasla-ui/blocks/logo-cloud-dark-logo-wall/LogoCloudDarkLogoWall").then((m) => m.LogoCloudDarkLogoWall))
  ),
  "logo-cloud-side-label-rail": dynamic(() =>
    withLogoCloudExample("logo-cloud-side-label-rail", import("@fasla-ui/blocks/logo-cloud-side-label-rail/LogoCloudSideLabelRail").then((m) => m.LogoCloudSideLabelRail))
  ),
  "logo-cloud-heading-left-grid-right": dynamic(() =>
    withLogoCloudExample("logo-cloud-heading-left-grid-right", import("@fasla-ui/blocks/logo-cloud-heading-left-grid-right/LogoCloudHeadingLeftGridRight").then((m) => m.LogoCloudHeadingLeftGridRight))
  ),
  "logo-cloud-editorial-eyebrow-split": dynamic(() =>
    withLogoCloudExample("logo-cloud-editorial-eyebrow-split", import("@fasla-ui/blocks/logo-cloud-editorial-eyebrow-split/LogoCloudEditorialEyebrowSplit").then((m) => m.LogoCloudEditorialEyebrowSplit))
  ),
  "logo-cloud-flanked-heading": dynamic(() =>
    withLogoCloudExample("logo-cloud-flanked-heading", import("@fasla-ui/blocks/logo-cloud-flanked-heading/LogoCloudFlankedHeading").then((m) => m.LogoCloudFlankedHeading))
  ),
  "logo-cloud-quote-panel-grid": dynamic(() =>
    withLogoCloudExample("logo-cloud-quote-panel-grid", import("@fasla-ui/blocks/logo-cloud-quote-panel-grid/LogoCloudQuotePanelGrid").then((m) => m.LogoCloudQuotePanelGrid))
  ),
  "logo-cloud-stat-rail-above-grid": dynamic(() =>
    withLogoCloudExample("logo-cloud-stat-rail-above-grid", import("@fasla-ui/blocks/logo-cloud-stat-rail-above-grid/LogoCloudStatRailAboveGrid").then((m) => m.LogoCloudStatRailAboveGrid))
  ),
  "logo-cloud-logo-metric-tiles": dynamic(() =>
    withLogoCloudExample("logo-cloud-logo-metric-tiles", import("@fasla-ui/blocks/logo-cloud-logo-metric-tiles/LogoCloudLogoMetricTiles").then((m) => m.LogoCloudLogoMetricTiles))
  ),
  "logo-cloud-logo-quote-cards": dynamic(() =>
    withLogoCloudExample("logo-cloud-logo-quote-cards", import("@fasla-ui/blocks/logo-cloud-logo-quote-cards/LogoCloudLogoQuoteCards").then((m) => m.LogoCloudLogoQuoteCards))
  ),
  "logo-cloud-named-integration-cards": dynamic(() =>
    withLogoCloudExample("logo-cloud-named-integration-cards", import("@fasla-ui/blocks/logo-cloud-named-integration-cards/LogoCloudNamedIntegrationCards").then((m) => m.LogoCloudNamedIntegrationCards))
  ),
  "logo-cloud-logo-testimonial-strip": dynamic(() =>
    withLogoCloudExample("logo-cloud-logo-testimonial-strip", import("@fasla-ui/blocks/logo-cloud-logo-testimonial-strip/LogoCloudLogoTestimonialStrip").then((m) => m.LogoCloudLogoTestimonialStrip))
  ),
  "logo-cloud-scatter-field": dynamic(() =>
    withLogoCloudExample("logo-cloud-scatter-field", import("@fasla-ui/blocks/logo-cloud-scatter-field/LogoCloudScatterField").then((m) => m.LogoCloudScatterField))
  ),
  "logo-cloud-bento-logo-wall": dynamic(() =>
    withLogoCloudExample("logo-cloud-bento-logo-wall", import("@fasla-ui/blocks/logo-cloud-bento-logo-wall/LogoCloudBentoLogoWall").then((m) => m.LogoCloudBentoLogoWall))
  ),
  "logo-cloud-divider-rule-row": dynamic(() =>
    withLogoCloudExample("logo-cloud-divider-rule-row", import("@fasla-ui/blocks/logo-cloud-divider-rule-row/LogoCloudDividerRuleRow").then((m) => m.LogoCloudDividerRuleRow))
  ),
  "logo-cloud-pyramid-row-stack": dynamic(() =>
    withLogoCloudExample("logo-cloud-pyramid-row-stack", import("@fasla-ui/blocks/logo-cloud-pyramid-row-stack/LogoCloudPyramidRowStack").then((m) => m.LogoCloudPyramidRowStack))
  ),
  "logo-cloud-tabbed-industry-filter": dynamic(() =>
    withLogoCloudExample("logo-cloud-tabbed-industry-filter", import("@fasla-ui/blocks/logo-cloud-tabbed-industry-filter/LogoCloudTabbedIndustryFilter").then((m) => m.LogoCloudTabbedIndustryFilter))
  ),
  "logo-cloud-grid-closing-cta": dynamic(() =>
    withLogoCloudExample("logo-cloud-grid-closing-cta", import("@fasla-ui/blocks/logo-cloud-grid-closing-cta/LogoCloudGridClosingCta").then((m) => m.LogoCloudGridClosingCta))
  ),
  "auth-centered-card-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-centered-card-sign-in/AuthCenteredCardSignIn").then((m) => withAuthExample(m.AuthCenteredCardSignIn, "auth-centered-card-sign-in", m.authCenteredCardSignInCopy))
  ),
  "auth-social-first-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-social-first-sign-in/AuthSocialFirstSignIn").then((m) => withAuthExample(m.AuthSocialFirstSignIn, "auth-social-first-sign-in", m.authSocialFirstSignInCopy))
  ),
  "auth-split-photo-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-split-photo-sign-in/AuthSplitPhotoSignIn").then((m) => withAuthExample(m.AuthSplitPhotoSignIn, "auth-split-photo-sign-in", m.authSplitPhotoSignInCopy))
  ),
  "auth-split-testimonial-sign-up": dynamic(() =>
    import("@fasla-ui/blocks/auth-split-testimonial-sign-up/AuthSplitTestimonialSignUp").then((m) => withAuthExample(m.AuthSplitTestimonialSignUp, "auth-split-testimonial-sign-up", m.authSplitTestimonialSignUpCopy))
  ),
  "auth-minimal-centered-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-minimal-centered-sign-in/AuthMinimalCenteredSignIn").then((m) => withAuthExample(m.AuthMinimalCenteredSignIn, "auth-minimal-centered-sign-in", m.authMinimalCenteredSignInCopy))
  ),
  "auth-sign-up-password-strength": dynamic(() =>
    import("@fasla-ui/blocks/auth-sign-up-password-strength/AuthSignUpPasswordStrength").then((m) => withAuthExample(m.AuthSignUpPasswordStrength, "auth-sign-up-password-strength", m.authSignUpPasswordStrengthCopy))
  ),
  "auth-sign-up-benefits-column": dynamic(() =>
    import("@fasla-ui/blocks/auth-sign-up-benefits-column/AuthSignUpBenefitsColumn").then((m) => withAuthExample(m.AuthSignUpBenefitsColumn, "auth-sign-up-benefits-column", m.authSignUpBenefitsColumnCopy))
  ),
  "auth-tabbed-sign-in-sign-up": dynamic(() =>
    import("@fasla-ui/blocks/auth-tabbed-sign-in-sign-up/AuthTabbedSignInSignUp").then((m) => withAuthExample(m.AuthTabbedSignInSignUp, "auth-tabbed-sign-in-sign-up", m.authTabbedSignInSignUpCopy))
  ),
  "auth-magic-link-request": dynamic(() =>
    import("@fasla-ui/blocks/auth-magic-link-request/AuthMagicLinkRequest").then((m) => withAuthExample(m.AuthMagicLinkRequest, "auth-magic-link-request", m.authMagicLinkRequestCopy))
  ),
  "auth-check-your-email": dynamic(() =>
    import("@fasla-ui/blocks/auth-check-your-email/AuthCheckYourEmail").then((m) => withAuthExample(m.AuthCheckYourEmail, "auth-check-your-email", m.authCheckYourEmailCopy))
  ),
  "auth-otp-verification": dynamic(() =>
    import("@fasla-ui/blocks/auth-otp-verification/AuthOtpVerification").then((m) => withAuthExample(m.AuthOtpVerification, "auth-otp-verification", m.authOtpVerificationCopy))
  ),
  "auth-two-factor-authenticator": dynamic(() =>
    import("@fasla-ui/blocks/auth-two-factor-authenticator/AuthTwoFactorAuthenticator").then((m) => withAuthExample(m.AuthTwoFactorAuthenticator, "auth-two-factor-authenticator", m.authTwoFactorAuthenticatorCopy))
  ),
  "auth-two-factor-method-chooser": dynamic(() =>
    import("@fasla-ui/blocks/auth-two-factor-method-chooser/AuthTwoFactorMethodChooser").then((m) => withAuthExample(m.AuthTwoFactorMethodChooser, "auth-two-factor-method-chooser", m.authTwoFactorMethodChooserCopy))
  ),
  "auth-forgot-password": dynamic(() =>
    import("@fasla-ui/blocks/auth-forgot-password/AuthForgotPassword").then((m) => withAuthExample(m.AuthForgotPassword, "auth-forgot-password", m.authForgotPasswordCopy))
  ),
  "auth-reset-password": dynamic(() =>
    import("@fasla-ui/blocks/auth-reset-password/AuthResetPassword").then((m) => withAuthExample(m.AuthResetPassword, "auth-reset-password", m.authResetPasswordCopy))
  ),
  "auth-password-changed": dynamic(() =>
    import("@fasla-ui/blocks/auth-password-changed/AuthPasswordChanged").then((m) => withAuthExample(m.AuthPasswordChanged, "auth-password-changed", m.authPasswordChangedCopy))
  ),
  "auth-team-invite-accept": dynamic(() =>
    import("@fasla-ui/blocks/auth-team-invite-accept/AuthTeamInviteAccept").then((m) => withAuthExample(m.AuthTeamInviteAccept, "auth-team-invite-accept", m.authTeamInviteAcceptCopy))
  ),
  "auth-profile-setup-onboarding": dynamic(() =>
    import("@fasla-ui/blocks/auth-profile-setup-onboarding/AuthProfileSetupOnboarding").then((m) => withAuthExample(m.AuthProfileSetupOnboarding, "auth-profile-setup-onboarding", m.authProfileSetupOnboardingCopy))
  ),
  "auth-photo-background-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-photo-background-sign-in/AuthPhotoBackgroundSignIn").then((m) => withAuthExample(m.AuthPhotoBackgroundSignIn, "auth-photo-background-sign-in", m.authPhotoBackgroundSignInCopy))
  ),
  "auth-phone-number-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-phone-number-sign-in/AuthPhoneNumberSignIn").then((m) => withAuthExample(m.AuthPhoneNumberSignIn, "auth-phone-number-sign-in", m.authPhoneNumberSignInCopy))
  ),
  "auth-qr-device-login": dynamic(() =>
    import("@fasla-ui/blocks/auth-qr-device-login/AuthQrDeviceLogin").then((m) => withAuthExample(m.AuthQrDeviceLogin, "auth-qr-device-login", m.authQrDeviceLoginCopy))
  ),
  "auth-passkey-sign-in": dynamic(() =>
    import("@fasla-ui/blocks/auth-passkey-sign-in/AuthPasskeySignIn").then((m) => withAuthExample(m.AuthPasskeySignIn, "auth-passkey-sign-in", m.authPasskeySignInCopy))
  ),
  "auth-locked-session-re-authenticate": dynamic(() =>
    import("@fasla-ui/blocks/auth-locked-session-re-authenticate/AuthLockedSessionReAuthenticate").then((m) => withAuthExample(m.AuthLockedSessionReAuthenticate, "auth-locked-session-re-authenticate", m.authLockedSessionReAuthenticateCopy))
  ),
  "auth-multi-step-sign-up-wizard": dynamic(() =>
    import("@fasla-ui/blocks/auth-multi-step-sign-up-wizard/AuthMultiStepSignUpWizard").then((m) => withAuthExample(m.AuthMultiStepSignUpWizard, "auth-multi-step-sign-up-wizard", m.authMultiStepSignUpWizardCopy))
  ),
  "auth-sign-in-error-state": dynamic(() =>
    import("@fasla-ui/blocks/auth-sign-in-error-state/AuthSignInErrorState").then((m) => withAuthExample(m.AuthSignInErrorState, "auth-sign-in-error-state", m.authSignInErrorStateCopy))
  ),
  "auth-waitlist-early-access": dynamic(() =>
    import("@fasla-ui/blocks/auth-waitlist-early-access/AuthWaitlistEarlyAccess").then((m) => withAuthExample(m.AuthWaitlistEarlyAccess, "auth-waitlist-early-access", m.authWaitlistEarlyAccessCopy))
  ),
  "gallery-culture-photo-grid": dynamic(() =>
    import("@fasla-ui/blocks/gallery-culture-photo-grid/GalleryCulturePhotoGrid").then((m) => withGalleryPhotos(m.GalleryCulturePhotoGrid, "culture-photo-grid", m.galleryCulturePhotoGridCopy))
  ),
  "gallery-masonry-gallery": dynamic(() =>
    import("@fasla-ui/blocks/gallery-masonry-gallery/GalleryMasonryGallery").then((m) => withGalleryPhotos(m.GalleryMasonryGallery, "masonry-gallery", m.galleryMasonryGalleryCopy))
  ),
  "gallery-photo-bento": dynamic(() =>
    import("@fasla-ui/blocks/gallery-photo-bento/GalleryPhotoBento").then((m) => withGalleryPhotos(m.GalleryPhotoBento, "photo-bento", m.galleryPhotoBentoCopy))
  ),
  "gallery-filmstrip-carousel": dynamic(() =>
    import("@fasla-ui/blocks/gallery-filmstrip-carousel/GalleryFilmstripCarousel").then((m) => withGalleryPhotos(m.GalleryFilmstripCarousel, "filmstrip-carousel", m.galleryFilmstripCarouselCopy))
  ),
  "gallery-full-bleed-slider": dynamic(() =>
    import("@fasla-ui/blocks/gallery-full-bleed-slider/GalleryFullBleedSlider").then((m) => withGalleryPhotos(m.GalleryFullBleedSlider, "full-bleed-slider", m.galleryFullBleedSliderCopy))
  ),
  "gallery-filter-tabs-grid": dynamic(() =>
    import("@fasla-ui/blocks/gallery-filter-tabs-grid/GalleryFilterTabsGrid").then((m) => withGalleryPhotos(m.GalleryFilterTabsGrid, "filter-tabs-grid", m.galleryFilterTabsGridCopy))
  ),
  "gallery-hover-caption-cards": dynamic(() =>
    import("@fasla-ui/blocks/gallery-hover-caption-cards/GalleryHoverCaptionCards").then((m) => withGalleryPhotos(m.GalleryHoverCaptionCards, "hover-caption-cards", m.galleryHoverCaptionCardsCopy))
  ),
  "gallery-lightbox-viewer": dynamic(() =>
    import("@fasla-ui/blocks/gallery-lightbox-viewer/GalleryLightboxViewer").then((m) => withGalleryPhotos(m.GalleryLightboxViewer, "lightbox-viewer", m.galleryLightboxViewerCopy))
  ),
  "gallery-horizontal-scroll-rail": dynamic(() =>
    import("@fasla-ui/blocks/gallery-horizontal-scroll-rail/GalleryHorizontalScrollRail").then((m) => withGalleryPhotos(m.GalleryHorizontalScrollRail, "horizontal-scroll-rail", m.galleryHorizontalScrollRailCopy))
  ),
  "gallery-editorial-split": dynamic(() =>
    import("@fasla-ui/blocks/gallery-editorial-split/GalleryEditorialSplit").then((m) => withGalleryPhotos(m.GalleryEditorialSplit, "editorial-split", m.galleryEditorialSplitCopy))
  ),
  "gallery-scattered-collage": dynamic(() =>
    import("@fasla-ui/blocks/gallery-scattered-collage/GalleryScatteredCollage").then((m) => withGalleryPhotos(m.GalleryScatteredCollage, "scattered-collage", m.galleryScatteredCollageCopy))
  ),
  "gallery-social-feed-strip": dynamic(() =>
    import("@fasla-ui/blocks/gallery-social-feed-strip/GallerySocialFeedStrip").then((m) => withGalleryPhotos(m.GallerySocialFeedStrip, "social-feed-strip", m.gallerySocialFeedStripCopy))
  ),
  "gallery-video-gallery": dynamic(() =>
    import("@fasla-ui/blocks/gallery-video-gallery/GalleryVideoGallery").then((m) => withGalleryPhotos(m.GalleryVideoGallery, "video-gallery", m.galleryVideoGalleryCopy))
  ),
  "gallery-before-after-compare": dynamic(() =>
    import("@fasla-ui/blocks/gallery-before-after-compare/GalleryBeforeAfterCompare").then((m) => withGalleryPhotos(m.GalleryBeforeAfterCompare, "before-after-compare", m.galleryBeforeAfterCompareCopy))
  ),
  "gallery-dark-cinema-wall": dynamic(() =>
    import("@fasla-ui/blocks/gallery-dark-cinema-wall/GalleryDarkCinemaWall").then((m) => withGalleryPhotos(m.GalleryDarkCinemaWall, "dark-cinema-wall", m.galleryDarkCinemaWallCopy))
  ),
  "gallery-hover-index-list": dynamic(() =>
    import("@fasla-ui/blocks/gallery-hover-index-list/GalleryHoverIndexList").then((m) => withGalleryPhotos(m.GalleryHoverIndexList, "hover-index-list", m.galleryHoverIndexListCopy))
  ),
  "gallery-mosaic-statement-tile": dynamic(() =>
    import("@fasla-ui/blocks/gallery-mosaic-statement-tile/GalleryMosaicStatementTile").then((m) => withGalleryPhotos(m.GalleryMosaicStatementTile, "mosaic-statement-tile", m.galleryMosaicStatementTileCopy))
  ),
  "gallery-contact-sheet-wall": dynamic(() =>
    import("@fasla-ui/blocks/gallery-contact-sheet-wall/GalleryContactSheetWall").then((m) => withGalleryPhotos(m.GalleryContactSheetWall, "contact-sheet-wall", m.galleryContactSheetWallCopy))
  ),
  "gallery-featured-thumb-rail": dynamic(() =>
    import("@fasla-ui/blocks/gallery-featured-thumb-rail/GalleryFeaturedThumbRail").then((m) => withGalleryPhotos(m.GalleryFeaturedThumbRail, "featured-thumb-rail", m.galleryFeaturedThumbRailCopy))
  ),
  "gallery-album-cards": dynamic(() =>
    import("@fasla-ui/blocks/gallery-album-cards/GalleryAlbumCards").then((m) => withGalleryPhotos(m.GalleryAlbumCards, "album-cards", m.galleryAlbumCardsCopy))
  ),
  "gallery-timeline-gallery": dynamic(() =>
    import("@fasla-ui/blocks/gallery-timeline-gallery/GalleryTimelineGallery").then((m) => withGalleryPhotos(m.GalleryTimelineGallery, "timeline-gallery", m.galleryTimelineGalleryCopy))
  ),
  "gallery-photo-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/gallery-photo-spotlight/GalleryPhotoSpotlight").then((m) => withGalleryPhotos(m.GalleryPhotoSpotlight, "photo-spotlight", m.galleryPhotoSpotlightCopy))
  ),
  "navbar-default": dynamic(() =>
    import("@fasla-ui/blocks/navbar-default/NavbarDefault").then((m) => withNavbarExample(m.NavbarDefault, "navbar-default"))
  ),
  "navbar-with-dropdown": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-dropdown/NavbarWithDropdown").then((m) => withNavbarExample(m.NavbarWithDropdown, "navbar-with-dropdown"))
  ),
  "navbar-with-icon-indicator-avatar": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-icon-indicator-avatar/NavbarWithIconIndicatorAvatar").then((m) => withNavbarExample(m.NavbarWithIconIndicatorAvatar, "navbar-with-icon-indicator-avatar"))
  ),
  "navbar-with-centered-logo": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-centered-logo/NavbarWithCenteredLogo").then((m) => withNavbarExample(m.NavbarWithCenteredLogo, "navbar-with-centered-logo"))
  ),
  "navbar-with-cta-button": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-cta-button/NavbarWithCtaButton").then((m) => withNavbarExample(m.NavbarWithCtaButton, "navbar-with-cta-button"))
  ),
  "navbar-with-submenu": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-submenu/NavbarWithSubmenu").then((m) => withNavbarExample(m.NavbarWithSubmenu, "navbar-with-submenu"))
  ),
  "navbar-rounded": dynamic(() =>
    import("@fasla-ui/blocks/navbar-rounded/NavbarRounded").then((m) => withNavbarExample(m.NavbarRounded, "navbar-rounded"))
  ),
  "navbar-with-search-input": dynamic(() =>
    import("@fasla-ui/blocks/navbar-with-search-input/NavbarWithSearchInput").then((m) => withNavbarExample(m.NavbarWithSearchInput, "navbar-with-search-input"))
  ),
  "navbar-multiple-icon": dynamic(() =>
    import("@fasla-ui/blocks/navbar-multiple-icon/NavbarMultipleIcon").then((m) => withNavbarExample(m.NavbarMultipleIcon, "navbar-multiple-icon"))
  ),
  "navbar-multiple-action": dynamic(() =>
    import("@fasla-ui/blocks/navbar-multiple-action/NavbarMultipleAction").then((m) => withNavbarExample(m.NavbarMultipleAction, "navbar-multiple-action"))
  ),
  "navbar-extended-at-top": dynamic(() =>
    import("@fasla-ui/blocks/navbar-extended-at-top/NavbarExtendedAtTop").then((m) => withNavbarExample(m.NavbarExtendedAtTop, "navbar-extended-at-top"))
  ),
  "navbar-small": dynamic(() =>
    import("@fasla-ui/blocks/navbar-small/NavbarSmall").then((m) => withNavbarExample(m.NavbarSmall, "navbar-small"))
  ),
  "navbar-rounded-small": dynamic(() =>
    import("@fasla-ui/blocks/navbar-rounded-small/NavbarRoundedSmall").then((m) => withNavbarExample(m.NavbarRoundedSmall, "navbar-rounded-small"))
  ),
  "navbar-centered-floating": dynamic(() =>
    import("@fasla-ui/blocks/navbar-centered-floating/NavbarCenteredFloating").then((m) => withNavbarExample(m.NavbarCenteredFloating, "navbar-centered-floating"))
  ),
  "navbar-active-action-with-border": dynamic(() =>
    import("@fasla-ui/blocks/navbar-active-action-with-border/NavbarActiveActionWithBorder").then((m) => withNavbarExample(m.NavbarActiveActionWithBorder, "navbar-active-action-with-border"))
  ),
  "navbar-active-action-with-round": dynamic(() =>
    import("@fasla-ui/blocks/navbar-active-action-with-round/NavbarActiveActionWithRound").then((m) => withNavbarExample(m.NavbarActiveActionWithRound, "navbar-active-action-with-round"))
  ),
  "navbar-e-commerce": dynamic(() =>
    import("@fasla-ui/blocks/navbar-e-commerce/NavbarECommerce").then((m) => withNavbarExample(m.NavbarECommerce, "navbar-e-commerce"))
  ),
  "pricing-tiers": dynamic(() => import("@fasla-ui/blocks/pricing-tiers/PricingTiers").then((m) => m.PricingTiers)),
  "pricing-two-plan-compare": dynamic(() =>
    import("@fasla-ui/blocks/pricing-two-plan-compare/PricingTwoPlanCompare").then((m) => m.PricingTwoPlanCompare)
  ),
  "pricing-plan-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/pricing-plan-spotlight/PricingPlanSpotlight").then((m) => m.PricingPlanSpotlight)
  ),
  "pricing-comparison-matrix": dynamic(() =>
    import("@fasla-ui/blocks/pricing-comparison-matrix/PricingComparisonMatrix").then((m) => m.PricingComparisonMatrix)
  ),
  "pricing-plan-picker-summary": dynamic(() =>
    import("@fasla-ui/blocks/pricing-plan-picker-summary/PricingPlanPickerSummary").then((m) => m.PricingPlanPickerSummary)
  ),
  "hero-editorial-arch": dynamic(() =>
    import("@fasla-ui/blocks/hero-editorial-arch/HeroEditorialArch").then((m) => withHeroPhotos(m.HeroEditorialArch, "editorial-arch"))
  ),
  "hero-photo-constellation": dynamic(() =>
    import("@fasla-ui/blocks/hero-photo-constellation/HeroPhotoConstellation").then((m) => withHeroPhotos(m.HeroPhotoConstellation, "photo-constellation"))
  ),
  "hero-arc-gallery": dynamic(() =>
    import("@fasla-ui/blocks/hero-arc-gallery/HeroArcGallery").then((m) => withHeroPhotos(m.HeroArcGallery, "arc-gallery"))
  ),
  "hero-inline-image-headline": dynamic(() =>
    import("@fasla-ui/blocks/hero-inline-image-headline/HeroInlineImageHeadline").then((m) => withHeroPhotos(m.HeroInlineImageHeadline, "inline-image-headline"))
  ),
  "hero-bento-split": dynamic(() =>
    import("@fasla-ui/blocks/hero-bento-split/HeroBentoSplit").then((m) => withHeroPhotos(m.HeroBentoSplit, "bento-split"))
  ),
  "hero-framed-full-bleed": dynamic(() =>
    import("@fasla-ui/blocks/hero-framed-full-bleed/HeroFramedFullBleed").then((m) => withHeroPhotos(m.HeroFramedFullBleed, "framed-full-bleed"))
  ),
  "hero-annotated-object": dynamic(() =>
    import("@fasla-ui/blocks/hero-annotated-object/HeroAnnotatedObject").then((m) => withHeroPhotos(m.HeroAnnotatedObject, "annotated-object"))
  ),
  "hero-editorial-triptych": dynamic(() =>
    import("@fasla-ui/blocks/hero-editorial-triptych/HeroEditorialTriptych").then((m) => withHeroPhotos(m.HeroEditorialTriptych, "editorial-triptych"))
  ),
  "hero-colour-stage": dynamic(() =>
    import("@fasla-ui/blocks/hero-colour-stage/HeroColourStage").then((m) => withHeroPhotos(m.HeroColourStage, "colour-stage"))
  ),
  "hero-twin-panels": dynamic(() =>
    import("@fasla-ui/blocks/hero-twin-panels/HeroTwinPanels").then((m) => withHeroPhotos(m.HeroTwinPanels, "twin-panels"))
  ),
  "hero-split-band-headline": dynamic(() =>
    import("@fasla-ui/blocks/hero-split-band-headline/HeroSplitBandHeadline").then((m) => withHeroPhotos(m.HeroSplitBandHeadline, "split-band-headline"))
  ),
  "hero-textured-dark": dynamic(() =>
    import("@fasla-ui/blocks/hero-textured-dark/HeroTexturedDark").then((m) => withHeroPhotos(m.HeroTexturedDark, "textured-dark"))
  ),
  "hero-component-pattern": dynamic(() =>
    import("@fasla-ui/blocks/hero-component-pattern/HeroComponentPattern").then((m) => withHeroPhotos(m.HeroComponentPattern, "component-pattern"))
  ),
  "hero-curved-media-rail": dynamic(() =>
    import("@fasla-ui/blocks/hero-curved-media-rail/HeroCurvedMediaRail").then((m) => withHeroPhotos(m.HeroCurvedMediaRail, "curved-media-rail"))
  ),
  "hero-framed-studio-card": dynamic(() =>
    import("@fasla-ui/blocks/hero-framed-studio-card/HeroFramedStudioCard").then((m) => withHeroPhotos(m.HeroFramedStudioCard, "framed-studio-card"))
  ),
  "hero-orbit-track": dynamic(() =>
    import("@fasla-ui/blocks/hero-orbit-track/HeroOrbitTrack").then((m) => withHeroPhotos(m.HeroOrbitTrack, "orbit-track"))
  ),
  "hero-floating-integrations": dynamic(() =>
    import("@fasla-ui/blocks/hero-floating-integrations/HeroFloatingIntegrations").then((m) => withHeroPhotos(m.HeroFloatingIntegrations, "floating-integrations"))
  ),
  "hero-shape-grid": dynamic(() =>
    import("@fasla-ui/blocks/hero-shape-grid/HeroShapeGrid").then((m) => withHeroPhotos(m.HeroShapeGrid, "shape-grid"))
  ),
  "hero-wave-band": dynamic(() =>
    import("@fasla-ui/blocks/hero-wave-band/HeroWaveBand").then((m) => withHeroPhotos(m.HeroWaveBand, "wave-band"))
  ),
  "hero-studio-mosaic": dynamic(() =>
    import("@fasla-ui/blocks/hero-studio-mosaic/HeroStudioMosaic").then((m) => withHeroPhotos(m.HeroStudioMosaic, "studio-mosaic"))
  ),
  "hero-illustration-split": dynamic(() =>
    import("@fasla-ui/blocks/hero-illustration-split/HeroIllustrationSplit").then((m) => withHeroPhotos(m.HeroIllustrationSplit, "illustration-split"))
  ),
  "hero-masked-type-reveal": dynamic(() =>
    import("@fasla-ui/blocks/hero-masked-type-reveal/HeroMaskedTypeReveal").then((m) => withHeroPhotos(m.HeroMaskedTypeReveal, "masked-type-reveal"))
  ),
  "hero-velocity-marquee": dynamic(() =>
    import("@fasla-ui/blocks/hero-velocity-marquee/HeroVelocityMarquee").then((m) => withHeroPhotos(m.HeroVelocityMarquee, "velocity-marquee"))
  ),
  "hero-duo-card": dynamic(() =>
    import("@fasla-ui/blocks/hero-duo-card/HeroDuoCard").then((m) => withHeroPhotos(m.HeroDuoCard, "duo-card"))
  ),
  "hero-video-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/hero-video-spotlight/HeroVideoSpotlight").then((m) => withHeroPhotos(m.HeroVideoSpotlight, "video-spotlight"))
  ),
  "hero-brand-color-block": dynamic(() =>
    import("@fasla-ui/blocks/hero-brand-color-block/HeroBrandColorBlock").then((m) => withHeroPhotos(m.HeroBrandColorBlock, "brand-color-block"))
  ),
  "hero-scramble-decode": dynamic(() =>
    import("@fasla-ui/blocks/hero-scramble-decode/HeroScrambleDecode").then((m) => withHeroPhotos(m.HeroScrambleDecode, "scramble-decode"))
  ),
  "hero-split-flap-counters": dynamic(() =>
    import("@fasla-ui/blocks/hero-split-flap-counters/HeroSplitFlapCounters").then((m) => withHeroPhotos(m.HeroSplitFlapCounters, "split-flap-counters"))
  ),
  "hero-video-in-type": dynamic(() =>
    import("@fasla-ui/blocks/hero-video-in-type/HeroVideoInType").then((m) => withHeroPhotos(m.HeroVideoInType, "video-in-type"))
  ),
  "about-mission-statement-hero": dynamic(() =>
    import("@fasla-ui/blocks/about-mission-statement-hero/AboutMissionStatementHero").then((m) => withAboutPhotos(m.AboutMissionStatementHero, "mission-statement-hero", m.aboutMissionStatementHeroCopy))
  ),
  "about-collage-hero": dynamic(() =>
    import("@fasla-ui/blocks/about-collage-hero/AboutCollageHero").then((m) => withAboutPhotos(m.AboutCollageHero, "collage-hero", m.aboutCollageHeroCopy))
  ),
  "about-statement-band": dynamic(() =>
    import("@fasla-ui/blocks/about-statement-band/AboutStatementBand").then((m) => withAboutPhotos(m.AboutStatementBand, "statement-band", m.aboutStatementBandCopy))
  ),
  "about-values-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/about-values-spotlight/AboutValuesSpotlight").then((m) => withAboutPhotos(m.AboutValuesSpotlight, "values-spotlight", m.aboutValuesSpotlightCopy))
  ),
  "about-values-connector-list": dynamic(() =>
    import("@fasla-ui/blocks/about-values-connector-list/AboutValuesConnectorList").then((m) => withAboutPhotos(m.AboutValuesConnectorList, "values-connector-list", m.aboutValuesConnectorListCopy))
  ),
  "about-approach-stack-cards": dynamic(() =>
    import("@fasla-ui/blocks/about-approach-stack-cards/AboutApproachStackCards").then((m) => withAboutPhotos(m.AboutApproachStackCards, "approach-stack-cards", m.aboutApproachStackCardsCopy))
  ),
  "about-story-snapshots": dynamic(() =>
    import("@fasla-ui/blocks/about-story-snapshots/AboutStorySnapshots").then((m) => withAboutPhotos(m.AboutStorySnapshots, "story-snapshots", m.aboutStorySnapshotsCopy))
  ),
  "about-bento": dynamic(() =>
    import("@fasla-ui/blocks/about-bento/AboutBento").then((m) => withAboutPhotos(m.AboutBento, "bento", m.aboutBentoCopy))
  ),
  "about-culture-masonry": dynamic(() =>
    import("@fasla-ui/blocks/about-culture-masonry/AboutCultureMasonry").then((m) => withAboutPhotos(m.AboutCultureMasonry, "culture-masonry", m.aboutCultureMasonryCopy))
  ),
  "about-impact-stats-band": dynamic(() =>
    import("@fasla-ui/blocks/about-impact-stats-band/AboutImpactStatsBand").then((m) => withAboutPhotos(m.AboutImpactStatsBand, "impact-stats-band", m.aboutImpactStatsBandCopy))
  ),
  "about-story-photos": dynamic(() =>
    import("@fasla-ui/blocks/about-story-photos/AboutStoryPhotos").then((m) => withAboutPhotos(m.AboutStoryPhotos, "story-photos", m.aboutStoryPhotosCopy))
  ),
  "about-split-panel": dynamic(() =>
    import("@fasla-ui/blocks/about-split-panel/AboutSplitPanel").then((m) => withAboutPhotos(m.AboutSplitPanel, "split-panel", m.aboutSplitPanelCopy))
  ),
  "about-letter-card": dynamic(() =>
    import("@fasla-ui/blocks/about-letter-card/AboutLetterCard").then((m) => withAboutPhotos(m.AboutLetterCard, "letter-card", m.aboutLetterCardCopy))
  ),
  "about-values-focus": dynamic(() =>
    import("@fasla-ui/blocks/about-values-focus/AboutValuesFocus").then((m) => withAboutPhotos(m.AboutValuesFocus, "values-focus", m.aboutValuesFocusCopy))
  ),
  "about-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/about-spotlight/AboutSpotlight").then((m) => withAboutPhotos(m.AboutSpotlight, "spotlight", m.aboutSpotlightCopy))
  ),
  "about-headline-photos": dynamic(() =>
    import("@fasla-ui/blocks/about-headline-photos/AboutHeadlinePhotos").then((m) => withAboutPhotos(m.AboutHeadlinePhotos, "headline-photos", m.aboutHeadlinePhotosCopy))
  ),
  "about-type-stack": dynamic(() =>
    import("@fasla-ui/blocks/about-type-stack/AboutTypeStack").then((m) => withAboutPhotos(m.AboutTypeStack, "type-stack", m.aboutTypeStackCopy))
  ),
  "about-color-bento": dynamic(() =>
    import("@fasla-ui/blocks/about-color-bento/AboutColorBento").then((m) => withAboutPhotos(m.AboutColorBento, "color-bento", m.aboutColorBentoCopy))
  ),
  "about-numbered-rows": dynamic(() =>
    import("@fasla-ui/blocks/about-numbered-rows/AboutNumberedRows").then((m) => withAboutPhotos(m.AboutNumberedRows, "numbered-rows", m.aboutNumberedRowsCopy))
  ),
  "careers-open-roles-hairline-list": dynamic(() =>
    import("@fasla-ui/blocks/careers-open-roles-hairline-list/CareersOpenRolesHairlineList").then((m) => withCareersPhotos(m.CareersOpenRolesHairlineList, "open-roles-hairline-list"))
  ),
  "careers-role-cards-grid": dynamic(() =>
    import("@fasla-ui/blocks/careers-role-cards-grid/CareersRoleCardsGrid").then((m) => withCareersPhotos(m.CareersRoleCardsGrid, "role-cards-grid"))
  ),
  "careers-roles-by-department": dynamic(() =>
    import("@fasla-ui/blocks/careers-roles-by-department/CareersRolesByDepartment").then((m) => withCareersPhotos(m.CareersRolesByDepartment, "roles-by-department"))
  ),
  "careers-open-vacancies-table": dynamic(() =>
    import("@fasla-ui/blocks/careers-open-vacancies-table/CareersOpenVacanciesTable").then((m) => withCareersPhotos(m.CareersOpenVacanciesTable, "open-vacancies-table"))
  ),
  "careers-roles-list-accordion-expanded": dynamic(() =>
    import("@fasla-ui/blocks/careers-roles-list-accordion-expanded/CareersRolesListAccordionExpanded").then((m) => withCareersPhotos(m.CareersRolesListAccordionExpanded, "roles-list-accordion-expanded"))
  ),
  "careers-about-card-role-list": dynamic(() =>
    import("@fasla-ui/blocks/careers-about-card-role-list/CareersAboutCardRoleList").then((m) => withCareersPhotos(m.CareersAboutCardRoleList, "about-card-role-list"))
  ),
  "careers-featured-role-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/careers-featured-role-spotlight/CareersFeaturedRoleSpotlight").then((m) => withCareersPhotos(m.CareersFeaturedRoleSpotlight, "featured-role-spotlight"))
  ),
  "careers-perks-benefits": dynamic(() =>
    import("@fasla-ui/blocks/careers-perks-benefits/CareersPerksBenefits").then((m) => withCareersPhotos(m.CareersPerksBenefits, "perks-benefits"))
  ),
  "careers-no-open-roles-empty-state": dynamic(() =>
    import("@fasla-ui/blocks/careers-no-open-roles-empty-state/CareersNoOpenRolesEmptyState").then((m) => withCareersPhotos(m.CareersNoOpenRolesEmptyState, "no-open-roles-empty-state"))
  ),
  "careers-role-detail-panel": dynamic(() =>
    import("@fasla-ui/blocks/careers-role-detail-panel/CareersRoleDetailPanel").then((m) => withCareersPhotos(m.CareersRoleDetailPanel, "role-detail-panel"))
  ),
  "careers-role-detail-page": dynamic(() =>
    import("@fasla-ui/blocks/careers-role-detail-page/CareersRoleDetailPage").then((m) => withCareersPhotos(m.CareersRoleDetailPage, "role-detail-page"))
  ),
  "team-leadership-grid": dynamic(() =>
    import("@fasla-ui/blocks/team-leadership-grid/TeamLeadershipGrid").then((m) => withTeamPhotos(m.TeamLeadershipGrid, "leadership-grid", m.teamLeadershipGridCopy))
  ),
  "team-portrait-wall": dynamic(() =>
    import("@fasla-ui/blocks/team-portrait-wall/TeamPortraitWall").then((m) => withTeamPhotos(m.TeamPortraitWall, "portrait-wall", m.teamPortraitWallCopy))
  ),
  "team-compact-directory-rows": dynamic(() =>
    import("@fasla-ui/blocks/team-compact-directory-rows/TeamCompactDirectoryRows").then((m) => withTeamPhotos(m.TeamCompactDirectoryRows, "compact-directory-rows", m.teamCompactDirectoryRowsCopy))
  ),
  "team-split-intro-member-rail": dynamic(() =>
    import("@fasla-ui/blocks/team-split-intro-member-rail/TeamSplitIntroMemberRail").then((m) => withTeamPhotos(m.TeamSplitIntroMemberRail, "split-intro-member-rail", m.teamSplitIntroMemberRailCopy))
  ),
  "team-founder-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/team-founder-spotlight/TeamFounderSpotlight").then((m) => withTeamPhotos(m.TeamFounderSpotlight, "founder-spotlight", m.teamFounderSpotlightCopy))
  ),
  "team-member-carousel": dynamic(() =>
    import("@fasla-ui/blocks/team-member-carousel/TeamMemberCarousel").then((m) => withTeamPhotos(m.TeamMemberCarousel, "member-carousel", m.teamMemberCarouselCopy))
  ),
  "team-department-tabs-directory": dynamic(() =>
    import("@fasla-ui/blocks/team-department-tabs-directory/TeamDepartmentTabsDirectory").then((m) => withTeamPhotos(m.TeamDepartmentTabsDirectory, "department-tabs-directory", m.teamDepartmentTabsDirectoryCopy))
  ),
  "team-member-table": dynamic(() =>
    import("@fasla-ui/blocks/team-member-table/TeamMemberTable").then((m) => withTeamPhotos(m.TeamMemberTable, "member-table", m.teamMemberTableCopy))
  ),
  "team-meta-profile-cards": dynamic(() =>
    import("@fasla-ui/blocks/team-meta-profile-cards/TeamMetaProfileCards").then((m) => withTeamPhotos(m.TeamMetaProfileCards, "meta-profile-cards", m.teamMetaProfileCardsCopy))
  ),
  "team-we-re-hiring-cta": dynamic(() =>
    import("@fasla-ui/blocks/team-we-re-hiring-cta/TeamWeReHiringCta").then((m) => withTeamPhotos(m.TeamWeReHiringCta, "we-re-hiring-cta", m.teamWeReHiringCtaCopy))
  ),
  "team-hairline-grid": dynamic(() =>
    import("@fasla-ui/blocks/team-hairline-grid/TeamHairlineGrid").then((m) => withTeamPhotos(m.TeamHairlineGrid, "hairline-grid", m.teamHairlineGridCopy))
  ),
  "team-overlay-portrait-cards": dynamic(() =>
    import("@fasla-ui/blocks/team-overlay-portrait-cards/TeamOverlayPortraitCards").then((m) => withTeamPhotos(m.TeamOverlayPortraitCards, "overlay-portrait-cards", m.teamOverlayPortraitCardsCopy))
  ),
  "team-annotated-portrait-lineup": dynamic(() =>
    import("@fasla-ui/blocks/team-annotated-portrait-lineup/TeamAnnotatedPortraitLineup").then((m) => withTeamPhotos(m.TeamAnnotatedPortraitLineup, "annotated-portrait-lineup", m.teamAnnotatedPortraitLineupCopy))
  ),
  "team-grid-backdrop-roster": dynamic(() =>
    import("@fasla-ui/blocks/team-grid-backdrop-roster/TeamGridBackdropRoster").then((m) => withTeamPhotos(m.TeamGridBackdropRoster, "grid-backdrop-roster", m.teamGridBackdropRosterCopy))
  ),
  "social-proof-classic-trio-grid": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-classic-trio-grid/SocialProofClassicTrioGrid").then((m) => withSocialProofPhotos(m.SocialProofClassicTrioGrid))
  ),
  "social-proof-staggered-columns": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-staggered-columns/SocialProofStaggeredColumns").then((m) => withSocialProofPhotos(m.SocialProofStaggeredColumns))
  ),
  "social-proof-benefit-title-cards": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-benefit-title-cards/SocialProofBenefitTitleCards").then((m) => withSocialProofPhotos(m.SocialProofBenefitTitleCards))
  ),
  "social-proof-giant-quote-duo": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-giant-quote-duo/SocialProofGiantQuoteDuo").then((m) => withSocialProofPhotos(m.SocialProofGiantQuoteDuo))
  ),
  "social-proof-vertical-column-wall": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-vertical-column-wall/SocialProofVerticalColumnWall").then((m) => withSocialProofPhotos(m.SocialProofVerticalColumnWall))
  ),
  "social-proof-tweet-wall": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-tweet-wall/SocialProofTweetWall").then((m) => withSocialProofPhotos(m.SocialProofTweetWall))
  ),
  "social-proof-app-review-row": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-app-review-row/SocialProofAppReviewRow").then((m) => withSocialProofPhotos(m.SocialProofAppReviewRow))
  ),
  "social-proof-centered-logo-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-centered-logo-spotlight/SocialProofCenteredLogoSpotlight").then((m) => withSocialProofPhotos(m.SocialProofCenteredLogoSpotlight))
  ),
  "social-proof-dark-editorial-split": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-dark-editorial-split/SocialProofDarkEditorialSplit").then((m) => withSocialProofPhotos(m.SocialProofDarkEditorialSplit))
  ),
  "social-proof-bracket-framed-quote": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-bracket-framed-quote/SocialProofBracketFramedQuote").then((m) => withSocialProofPhotos(m.SocialProofBracketFramedQuote))
  ),
  "social-proof-highlighted-phrase-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-highlighted-phrase-spotlight/SocialProofHighlightedPhraseSpotlight").then((m) => withSocialProofPhotos(m.SocialProofHighlightedPhraseSpotlight))
  ),
  "social-proof-tinted-panel-portrait": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-tinted-panel-portrait/SocialProofTintedPanelPortrait").then((m) => withSocialProofPhotos(m.SocialProofTintedPanelPortrait))
  ),
  "social-proof-overlay-photo-quote": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-overlay-photo-quote/SocialProofOverlayPhotoQuote").then((m) => withSocialProofPhotos(m.SocialProofOverlayPhotoQuote))
  ),
  "social-proof-arch-portrait-quote": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-arch-portrait-quote/SocialProofArchPortraitQuote").then((m) => withSocialProofPhotos(m.SocialProofArchPortraitQuote))
  ),
  "social-proof-spotlight-carousel": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-spotlight-carousel/SocialProofSpotlightCarousel").then((m) => withSocialProofPhotos(m.SocialProofSpotlightCarousel))
  ),
  "social-proof-avatar-selector-row": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-avatar-selector-row/SocialProofAvatarSelectorRow").then((m) => withSocialProofPhotos(m.SocialProofAvatarSelectorRow))
  ),
  "social-proof-progress-carousel": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-progress-carousel/SocialProofProgressCarousel").then((m) => withSocialProofPhotos(m.SocialProofProgressCarousel))
  ),
  "social-proof-persona-pillars": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-persona-pillars/SocialProofPersonaPillars").then((m) => withSocialProofPhotos(m.SocialProofPersonaPillars))
  ),
  "social-proof-workplace-portrait-stories": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-workplace-portrait-stories/SocialProofWorkplacePortraitStories").then((m) => withSocialProofPhotos(m.SocialProofWorkplacePortraitStories))
  ),
  "social-proof-stat-story-cards": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-stat-story-cards/SocialProofStatStoryCards").then((m) => withSocialProofPhotos(m.SocialProofStatStoryCards))
  ),
  "social-proof-video-story-cards": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-video-story-cards/SocialProofVideoStoryCards").then((m) =>
      withSocialProofVideo(m.SocialProofVideoStoryCards, (locale: Locale) => ({
        items: m.socialProofVideoStoryCardsCopy[locale].items.map((item) => ({ ...item, ...SOCIAL_PROOF_FILM })),
      }))
    )
  ),
  "social-proof-case-study-row": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-case-study-row/SocialProofCaseStudyRow").then((m) => withSocialProofPhotos(m.SocialProofCaseStudyRow))
  ),
  "social-proof-proof-bento": dynamic(() =>
    import("@fasla-ui/blocks/social-proof-proof-bento/SocialProofProofBento").then((m) => withSocialProofVideo(m.SocialProofProofBento))
  ),
  "blog-cards-split-feature": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-split-feature/BlogCardsSplitFeature").then((m) => withBlogCardsPhotos(m.BlogCardsSplitFeature, "split-feature", m.blogCardsSplitFeatureCopy))
  ),
  "blog-cards-lead-ranked-picks": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-lead-ranked-picks/BlogCardsLeadRankedPicks").then((m) => withBlogCardsPhotos(m.BlogCardsLeadRankedPicks, "lead-ranked-picks", m.blogCardsLeadRankedPicksCopy))
  ),
  "blog-cards-dark-editorial-feature": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-dark-editorial-feature/BlogCardsDarkEditorialFeature").then((m) => withBlogCardsPhotos(m.BlogCardsDarkEditorialFeature, "dark-editorial-feature", m.blogCardsDarkEditorialFeatureCopy))
  ),
  "blog-cards-magazine-cover-story": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-magazine-cover-story/BlogCardsMagazineCoverStory").then((m) => withBlogCardsPhotos(m.BlogCardsMagazineCoverStory, "magazine-cover-story", m.blogCardsMagazineCoverStoryCopy))
  ),
  "blog-cards-pull-quote-feature": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-pull-quote-feature/BlogCardsPullQuoteFeature").then((m) => withBlogCardsPhotos(m.BlogCardsPullQuoteFeature, "pull-quote-feature", m.blogCardsPullQuoteFeatureCopy))
  ),
  "blog-cards-newsletter-latest": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-newsletter-latest/BlogCardsNewsletterLatest").then((m) => withBlogCardsPhotos(m.BlogCardsNewsletterLatest, "newsletter-latest", m.blogCardsNewsletterLatestCopy))
  ),
  "blog-cards-author-spotlight": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-author-spotlight/BlogCardsAuthorSpotlight").then((m) => withBlogCardsPhotos(m.BlogCardsAuthorSpotlight, "author-spotlight", m.blogCardsAuthorSpotlightCopy))
  ),
  "blog-cards-related-posts-strip": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-related-posts-strip/BlogCardsRelatedPostsStrip").then((m) => withBlogCardsPhotos(m.BlogCardsRelatedPostsStrip, "related-posts-strip", m.blogCardsRelatedPostsStripCopy))
  ),
  "blog-cards-filter-sidebar-results": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-filter-sidebar-results/BlogCardsFilterSidebarResults").then((m) => withBlogCardsPhotos(m.BlogCardsFilterSidebarResults, "filter-sidebar-results", m.blogCardsFilterSidebarResultsCopy))
  ),
  "blog-cards-search-chips-results": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-search-chips-results/BlogCardsSearchChipsResults").then((m) => withBlogCardsPhotos(m.BlogCardsSearchChipsResults, "search-chips-results", m.blogCardsSearchChipsResultsCopy))
  ),
  "blog-cards-post-carousel-with-controls": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-post-carousel-with-controls/BlogCardsPostCarouselWithControls").then((m) => withBlogCardsPhotos(m.BlogCardsPostCarouselWithControls, "post-carousel-with-controls", m.blogCardsPostCarouselWithControlsCopy))
  ),
  "blog-cards-left-thumb-row-cards": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-left-thumb-row-cards/BlogCardsLeftThumbRowCards").then((m) => withBlogCardsPhotos(m.BlogCardsLeftThumbRowCards, "left-thumb-row-cards", m.blogCardsLeftThumbRowCardsCopy))
  ),
  "blog-cards-hairline-text-index": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-hairline-text-index/BlogCardsHairlineTextIndex").then((m) => withBlogCardsPhotos(m.BlogCardsHairlineTextIndex, "hairline-text-index", m.blogCardsHairlineTextIndexCopy))
  ),
  "blog-cards-numbered-reading-list": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-numbered-reading-list/BlogCardsNumberedReadingList").then((m) => withBlogCardsPhotos(m.BlogCardsNumberedReadingList, "numbered-reading-list", m.blogCardsNumberedReadingListCopy))
  ),
  "blog-cards-latest-popular-split": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-latest-popular-split/BlogCardsLatestPopularSplit").then((m) => withBlogCardsPhotos(m.BlogCardsLatestPopularSplit, "latest-popular-split", m.blogCardsLatestPopularSplitCopy))
  ),
  "blog-cards-classic-3-up-grid": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-classic-3-up-grid/BlogCardsClassic3UpGrid").then((m) => withBlogCardsPhotos(m.BlogCardsClassic3UpGrid, "classic-3-up-grid", m.blogCardsClassic3UpGridCopy))
  ),
  "blog-cards-featured-two-up": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-featured-two-up/BlogCardsFeaturedTwoUp").then((m) => withBlogCardsPhotos(m.BlogCardsFeaturedTwoUp, "featured-two-up", m.blogCardsFeaturedTwoUpCopy))
  ),
  "blog-cards-compact-4-up-thumb-grid": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-compact-4-up-thumb-grid/BlogCardsCompact4UpThumbGrid").then((m) => withBlogCardsPhotos(m.BlogCardsCompact4UpThumbGrid, "compact-4-up-thumb-grid", m.blogCardsCompact4UpThumbGridCopy))
  ),
  "blog-cards-bento-editorial-grid": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-bento-editorial-grid/BlogCardsBentoEditorialGrid").then((m) => withBlogCardsPhotos(m.BlogCardsBentoEditorialGrid, "bento-editorial-grid", m.blogCardsBentoEditorialGridCopy))
  ),
  "blog-cards-overlay-photo-trio": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-overlay-photo-trio/BlogCardsOverlayPhotoTrio").then((m) => withBlogCardsPhotos(m.BlogCardsOverlayPhotoTrio, "overlay-photo-trio", m.blogCardsOverlayPhotoTrioCopy))
  ),
  "blog-cards-journal-bento": dynamic(() =>
    import("@fasla-ui/blocks/blog-cards-journal-bento/BlogCardsJournalBento").then((m) => withBlogCardsPhotos(m.BlogCardsJournalBento, "journal-bento", m.blogCardsJournalBentoCopy))
  ),
}

/** Settles after a moment, so a form shows its pending state before its result. */
const settleSoon = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

/**
 * Each Authentications block's callbacks that stand for a round trip to a
 * server. In a preview they settle after a moment.
 */
const AUTH_ACTIONS: Record<string, string[]> = {
  "auth-centered-card-sign-in": ["onProviderSelect", "onSubmit"],
  "auth-social-first-sign-in": ["onProviderSelect", "onSubmit"],
  "auth-split-photo-sign-in": ["onProviderSelect", "onSubmit"],
  "auth-split-testimonial-sign-up": ["onProviderSelect", "onSubmit"],
  "auth-minimal-centered-sign-in": ["onSubmit"],
  "auth-sign-up-password-strength": ["onSubmit"],
  "auth-sign-up-benefits-column": ["onProviderSelect", "onSubmit"],
  "auth-tabbed-sign-in-sign-up": ["onProviderSelect", "onSignIn", "onSignUp"],
  "auth-magic-link-request": ["onProviderSelect", "onSubmit"],
  "auth-check-your-email": ["onResend"],
  "auth-otp-verification": ["onResend", "onSubmit"],
  "auth-two-factor-authenticator": ["onAlternativeSelect", "onSubmit"],
  "auth-two-factor-method-chooser": ["onSubmit"],
  "auth-forgot-password": ["onSubmit"],
  "auth-reset-password": ["onSubmit"],
  "auth-team-invite-accept": ["onAccept", "onDecline"],
  "auth-profile-setup-onboarding": ["onSubmit"],
  "auth-photo-background-sign-in": ["onProviderSelect", "onSubmit"],
  "auth-phone-number-sign-in": ["onAlternativeSelect", "onSubmit"],
  "auth-qr-device-login": ["onRefresh"],
  "auth-passkey-sign-in": ["onPasskey"],
  "auth-locked-session-re-authenticate": ["onSubmit"],
  "auth-multi-step-sign-up-wizard": ["onSubmit"],
  "auth-sign-in-error-state": ["onProviderSelect", "onSubmit"],
  "auth-waitlist-early-access": ["onSubmit"],
}

/**
 * What a preview passes beyond the locale: the photos, which no block ships
 * with (Figma's, in public/blocks/faq/ and public/blocks/error-state/), and
 * stand-ins for the callbacks that would reach an app's server, so the forms
 * and actions show every state.
 */
export function blockDemoProps(slug: string, locale: Locale): Record<string, unknown> {
  const ar = locale === "ar"
  switch (slug) {
    case "faq-media-split":
      return {
        image: {
          src: "/blocks/faq/media-split.jpg",
          alt: ar ? "شخصان من فريق الدعم يعملان على حاسوبيهما" : "Two support specialists working at their laptops",
        },
      }
    case "faq-contact-cta-card":
      return {
        people: (ar ? ["ليلى حداد", "عمر خليل", "سارة منصور"] : ["Layla Haddad", "Omar Khalil", "Sara Mansour"]).map(
          (name, index) => ({ name, src: `/blocks/faq/avatar-${index + 1}.jpg` })
        ),
      }
    case "faq-chat-thread":
      return { supportAvatar: "/blocks/faq/avatar-support.png", onSend: settleSoon }
    case "faq-newsletter-close":
      return { onSubmit: settleSoon }
    case "error-state-editorial-photo-split":
      return {
        image: {
          src: "/blocks/error-state/editorial-photo-split.webp",
          alt: ar ? "باب مفتوح في غرفة دافئة خالية" : "An open door in a warm, empty room",
        },
      }
    case "error-state-full-bleed-photo":
      return {
        image: {
          src: "/blocks/error-state/full-bleed-photo.webp",
          alt: ar ? "ممر بين أشجار الصنوبر في غابة يلفّها الضباب" : "A path through a misty pine forest",
        },
      }
    case "error-state-photo-collage-scatter":
      return {
        photos: COLLAGE_ALTS[locale].map((alt, index) => ({ src: `/blocks/error-state/photo-collage-${index + 1}.webp`, alt })),
      }
    case "error-state-support-escalation-band":
      return {
        people: [
          { name: "Hana Malik", src: "/blocks/error-state/avatar.webp" },
          { name: "Sami Rahman", src: "/blocks/error-state/avatar.webp" },
          { name: "Vera Bauer" },
        ],
      }
    case "error-state-server-error-500":
    case "error-state-offline-state":
      return { onRetry: settleSoon }
    case "error-state-access-denied-403":
      return { onRequestAccess: settleSoon }
    case "error-state-maintenance-mode":
      return { onSubscribe: settleSoon }
    case "error-state-empty-search-results":
      return { onSearch: settleSoon }
    // The frame stays on the preview at zero instead of leaving for the homepage.
    case "error-state-countdown-redirect":
      return { onRedirect: () => {} }
    default:
      // Authentications: every action that would reach a server settles after a
      // moment, so the buttons show their pending state and what follows.
      return Object.fromEntries((AUTH_ACTIONS[slug] ?? []).map((name) => [name, settleSoon]))
  }
}
