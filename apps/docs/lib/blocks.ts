/**
 * The block families the Blocks section documents, and each family's Types in
 * Figma's order. Names and family labels are in the message catalogues
 * (docs.faqBlocks, docs.errorStateBlocks, docs.logoCloudBlocks); the slug is the registry item's name.
 */

export type FaqFamily = "lists" | "layouts" | "navigation" | "support"

export const FAQ_FAMILIES: FaqFamily[] = ["lists", "layouts", "navigation", "support"]

/**
 * Error State's two groups, as its Figma documentation splits the 28 Types:
 * the 404 pages, and the six states next to them (500, 403, offline,
 * maintenance, empty search and a timed redirect).
 */
export type ErrorStateFamily = "not-found" | "other-states"

export const ERROR_STATE_FAMILIES: ErrorStateFamily[] = ["not-found", "other-states"]

/**
 * Logo Cloud's two groups, as its Figma documentation splits the 22 Types:
 * the marks with a heading or caption, and the six that add proof beside
 * them (a testimonial, figures, or a sector filter).
 */
export type LogoCloudFamily = "walls" | "proof"

export const LOGO_CLOUD_FAMILIES: LogoCloudFamily[] = ["walls", "proof"]

export type BlockType<Family extends string = FaqFamily | ErrorStateFamily | LogoCloudFamily> = {
  /** The registry item, and the file it installs to. */
  slug: string
  family: Family
  /** Painted with the inverse tokens, so it needs their mapping. */
  inverse?: boolean
}

export const FAQ_TYPES: BlockType<FaqFamily>[] = [
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

export const ERROR_STATE_TYPES: BlockType<ErrorStateFamily>[] = [
  { slug: "error-state-centered-minimal", family: "not-found" },
  { slug: "error-state-search-recovery", family: "not-found" },
  { slug: "error-state-display-numeral-split", family: "not-found" },
  { slug: "error-state-editorial-photo-split", family: "not-found" },
  { slug: "error-state-full-bleed-photo", family: "not-found", inverse: true },
  { slug: "error-state-colour-field-scatter", family: "not-found" },
  { slug: "error-state-dark-spotlight", family: "not-found", inverse: true },
  { slug: "error-state-ghost-watermark", family: "not-found" },
  { slug: "error-state-helpful-links-list", family: "not-found" },
  { slug: "error-state-popular-pages-grid", family: "not-found" },
  { slug: "error-state-error-card-panel", family: "not-found" },
  { slug: "error-state-illustrated-empty-state", family: "not-found" },
  { slug: "error-state-light-editorial", family: "not-found" },
  { slug: "error-state-layered-badge-centered", family: "not-found" },
  { slug: "error-state-server-error-500", family: "other-states" },
  { slug: "error-state-access-denied-403", family: "other-states" },
  { slug: "error-state-offline-state", family: "other-states" },
  { slug: "error-state-maintenance-mode", family: "other-states" },
  { slug: "error-state-empty-search-results", family: "other-states", inverse: true },
  { slug: "error-state-recovery-bento", family: "not-found" },
  { slug: "error-state-sitemap-columns", family: "not-found" },
  { slug: "error-state-terminal-console", family: "not-found", inverse: true },
  { slug: "error-state-photo-collage-scatter", family: "not-found" },
  { slug: "error-state-support-escalation-band", family: "not-found" },
  { slug: "error-state-split-colour-panel", family: "not-found", inverse: true },
  { slug: "error-state-marquee-404-band", family: "not-found", inverse: true },
  { slug: "error-state-broken-trail-breadcrumb", family: "not-found" },
  { slug: "error-state-countdown-redirect", family: "other-states" },
]

export const LOGO_CLOUD_TYPES: BlockType<LogoCloudFamily>[] = [
  { slug: "logo-cloud-centered-caption-row", family: "walls" },
  { slug: "logo-cloud-heading-grid", family: "walls" },
  { slug: "logo-cloud-bordered-cell-grid", family: "walls" },
  { slug: "logo-cloud-enterprise-wall", family: "walls" },
  { slug: "logo-cloud-contained-card", family: "walls" },
  { slug: "logo-cloud-dark-logo-wall", family: "walls", inverse: true },
  { slug: "logo-cloud-side-label-rail", family: "walls" },
  { slug: "logo-cloud-heading-left-grid-right", family: "walls" },
  { slug: "logo-cloud-editorial-eyebrow-split", family: "walls" },
  { slug: "logo-cloud-flanked-heading", family: "walls" },
  { slug: "logo-cloud-quote-panel-grid", family: "proof", inverse: true },
  { slug: "logo-cloud-stat-rail-above-grid", family: "proof" },
  { slug: "logo-cloud-logo-metric-tiles", family: "proof" },
  { slug: "logo-cloud-logo-quote-cards", family: "proof", inverse: true },
  { slug: "logo-cloud-named-integration-cards", family: "walls" },
  { slug: "logo-cloud-logo-testimonial-strip", family: "proof" },
  { slug: "logo-cloud-scatter-field", family: "walls" },
  { slug: "logo-cloud-bento-logo-wall", family: "walls" },
  { slug: "logo-cloud-divider-rule-row", family: "walls", inverse: true },
  { slug: "logo-cloud-pyramid-row-stack", family: "walls" },
  { slug: "logo-cloud-tabbed-industry-filter", family: "proof" },
  { slug: "logo-cloud-grid-closing-cta", family: "walls" },
]

/** Every block a preview page renders, across the families. */
export const ALL_BLOCK_TYPES: BlockType[] = [...FAQ_TYPES, ...ERROR_STATE_TYPES, ...LOGO_CLOUD_TYPES]

/** Figma's three breakpoints, the widths a preview frame renders at. */
export const BREAKPOINTS = { desktop: 1440, tablet: 768, mobile: 360 } as const
export type Breakpoint = keyof typeof BREAKPOINTS

/** Where a block renders alone, for the preview frames. Never in the sitemap. */
export const previewPath = (locale: string, slug: string) => `/${locale}/blocks-preview/${slug}/`

type RegistryEntry = { name: string; dependencies?: string[]; registryDependencies?: string[] }

/**
 * What a block needs installed before its source is copied in by hand: the
 * Fasla components it imports, and the npm packages it imports itself.
 * theme-inverse is CSS, not a component; the Manual tab shows its lines.
 */
export function blockRequirements(slug: string, items: RegistryEntry[]) {
  const item = items.find((candidate) => candidate.name === slug)
  return {
    components: (item?.registryDependencies ?? []).filter((dep) => dep !== "theme-inverse"),
    packages: item?.dependencies ?? [],
  }
}

/**
 * The command that adds those components, or null when there are none: a bare
 * `add` installs nothing and stops to ask which components to add.
 */
export function addCommand(components: string[]): string | null {
  return components.length > 0 ? `npx @smicolon/fasla-ui@latest add ${components.join(" ")}` : null
}
