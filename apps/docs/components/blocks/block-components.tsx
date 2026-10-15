"use client"

import * as React from "react"
import dynamic from "next/dynamic"

/**
 * Every FAQ and Error State Type by registry name, each loaded on its own so a
 * preview frame downloads only the block it shows.
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
}

/** Settles after a moment, so a form shows its pending state before its result. */
const settleSoon = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

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
      return {}
  }
}
