/**
 * The block families the Blocks section documents, and each family's Types in
 * Figma's order. Names and family labels are in the message catalogues
 * (docs.faqBlocks); the slug is the registry item's name.
 */

export type FaqFamily = "lists" | "layouts" | "navigation" | "support"

export const FAQ_FAMILIES: FaqFamily[] = ["lists", "layouts", "navigation", "support"]

export type BlockType = {
  /** The registry item, and the file it installs to. */
  slug: string
  family: FaqFamily
  /** Painted with the inverse tokens, so it needs their mapping. */
  inverse?: boolean
}

export const FAQ_TYPES: BlockType[] = [
  { slug: "faq-classic-centered", family: "lists" },
  { slug: "faq-split-sticky", family: "layouts" },
  { slug: "faq-accent-active-card", family: "lists" },
  { slug: "faq-soft-filled-rows", family: "lists" },
  { slug: "faq-numbered-editorial", family: "lists" },
  { slug: "faq-dark-panel", family: "lists", inverse: true },
  { slug: "faq-mono-index", family: "lists", inverse: true },
  { slug: "faq-uppercase-dense", family: "lists" },
  { slug: "faq-featured-question", family: "lists" },
  { slug: "faq-two-column-grid", family: "layouts" },
  { slug: "faq-masonry-cards", family: "layouts" },
  { slug: "faq-category-columns", family: "layouts" },
  { slug: "faq-grouped-sections", family: "layouts" },
  { slug: "faq-table-compact", family: "lists" },
  { slug: "faq-search-categories", family: "navigation" },
  { slug: "faq-tabs-by-topic", family: "navigation" },
  { slug: "faq-sidebar-nav", family: "navigation" },
  { slug: "faq-category-chip-grid", family: "navigation" },
  { slug: "faq-topic-tiles", family: "navigation" },
  { slug: "faq-help-hero-popular", family: "navigation" },
  { slug: "faq-contact-cta-card", family: "support" },
  { slug: "faq-support-channels", family: "support" },
  { slug: "faq-newsletter-close", family: "support" },
  { slug: "faq-support-stats", family: "support" },
  { slug: "faq-media-split", family: "layouts" },
  { slug: "faq-chat-thread", family: "support" },
]

/** Figma's three breakpoints, the widths a preview frame renders at. */
export const BREAKPOINTS = { desktop: 1440, tablet: 768, mobile: 360 } as const
export type Breakpoint = keyof typeof BREAKPOINTS

/** Where a block renders alone, for the preview frames. Never in the sitemap. */
export const previewPath = (locale: string, slug: string) => `/${locale}/blocks-preview/${slug}/`
