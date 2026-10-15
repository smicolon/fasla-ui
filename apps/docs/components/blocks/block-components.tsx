"use client"

import * as React from "react"
import dynamic from "next/dynamic"

/**
 * Every FAQ Type by registry name, each loaded on its own so a preview frame
 * downloads only the block it shows.
 */
/** Each block has its own props; a frame passes only the locale and demo props. */
type AnyBlock = React.ComponentType<any>

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
}

/** Settles after a moment, so a form shows its pending state before its result. */
const settleSoon = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

/**
 * What a preview passes beyond the locale: the photos, which no block ships
 * with (Figma's, in public/blocks/faq/), and stand-ins for the callbacks that
 * would reach an app's server, so the forms show every state.
 */
export function blockDemoProps(slug: string, locale: "en" | "ar"): Record<string, unknown> {
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
    default:
      return {}
  }
}
