/**
 * The block families the Blocks section documents, and each family's Types in
 * Figma's order. Names and family labels are in the message catalogues
 * (docs.faqBlocks, docs.errorStateBlocks, docs.logoCloudBlocks,
 * docs.authenticationsBlocks, docs.galleryBlocks, docs.navbarBlocks,
 * docs.pricingBlocks, docs.heroBlocks, docs.aboutBlocks, docs.teamBlocks,
 * docs.careersBlocks, docs.socialProofBlocks); the slug is the registry item's name.
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

/**
 * Authentications' two groups, as its Figma documentation splits the 26
 * Types: fourteen ways in (sign-in and sign-up screens), and twelve steps that
 * follow them (codes, two-factor, recovery, invitation, onboarding, errors).
 */
export type AuthenticationsFamily = "ways-in" | "next-steps"

export const AUTHENTICATIONS_FAMILIES: AuthenticationsFamily[] = ["ways-in", "next-steps"]

/**
 * Gallery's three groups, from its Figma documentation, which sets seven
 * layouts apart as carrying their own controls rather than a caption grid:
 * the grids and walls, the four that scroll, and those seven viewers.
 */
export type GalleryFamily = "grids" | "carousels" | "viewers"

export const GALLERY_FAMILIES: GalleryFamily[] = ["grids", "carousels", "viewers"]

/**
 * Navbar's three groups: the full-width bars of a marketing site, the four
 * that float as a pill or a panel, and the six built around an app or a shop
 * (search, notifications, the account, a cart).
 */
export type NavbarFamily = "site" | "floating" | "app"

export const NAVBAR_FAMILIES: NavbarFamily[] = ["site", "floating", "app"]

/**
 * Pricing's two groups: the three that lay plans side by side to compare
 * (tier cards, two plans, a full matrix), and the two built around a choice
 * (one plan's billing options, and a plan list beside an order summary).
 */
export type PricingFamily = "compare" | "choose"

export const PRICING_FAMILIES: PricingFamily[] = ["compare", "choose"]

/**
 * Hero's groups: the split layouts, whose copy shares the block with a
 * portrait, a column of cards or a set of photos; the photo-led ones, where
 * photos frame or fill the whole block; the card and pattern layouts, built
 * from tiles, cards or a wall of components; the type-led ones, where the
 * headline itself is the picture.
 */
export type HeroFamily = "split" | "photo-led" | "cards" | "type-led"

export const HERO_FAMILIES: HeroFamily[] = ["split", "photo-led", "cards", "type-led"]

/**
 * About's three groups: the statements and heroes that open the page, the
 * story and values told in rows, cards and letters, and the culture and
 * numbers in bentos, masonry and figures.
 */
export type AboutFamily = "statements" | "story" | "culture"

export const ABOUT_FAMILIES: AboutFamily[] = ["statements", "story", "culture"]

/**
 * Careers' groups: the lists a reader browses roles in, the highlights and
 * states around them, and the role itself. A group appears here once a Type of
 * it is built.
 */
export type CareersFamily = "lists" | "highlights" | "details"

export const CAREERS_FAMILIES: CareersFamily[] = ["lists", "highlights", "details"]

/**
 * Team's three groups, from its Figma documentation: the grids and walls that
 * set people side by side, the directories that list them (rows, a rail, tabs, a
 * table), and the spotlights that put a founder, a carousel or an open role up
 * front.
 */
export type TeamFamily = "grids-and-walls" | "directories" | "spotlights"

export const TEAM_FAMILIES: TeamFamily[] = ["grids-and-walls", "directories", "spotlights"]

/**
 * Social Proof's four groups: grids and walls that show many voices at once,
 * spotlights that give one quote the stage, carousels and selectors the reader
 * steps through or picks from, and stories that pair a quote with a figure or
 * a video.
 */
export type SocialProofFamily = "grids" | "spotlights" | "carousels" | "stories"

export const SOCIAL_PROOF_FAMILIES: SocialProofFamily[] = ["grids", "spotlights", "carousels", "stories"]

export type BlockType<Family extends string = FaqFamily | ErrorStateFamily | LogoCloudFamily | AuthenticationsFamily | GalleryFamily | NavbarFamily | PricingFamily | HeroFamily | AboutFamily | TeamFamily | CareersFamily | SocialProofFamily> = {
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

export const AUTHENTICATIONS_TYPES: BlockType<AuthenticationsFamily>[] = [
  { slug: "auth-centered-card-sign-in", family: "ways-in" },
  { slug: "auth-social-first-sign-in", family: "ways-in" },
  { slug: "auth-split-photo-sign-in", family: "ways-in" },
  { slug: "auth-split-testimonial-sign-up", family: "ways-in", inverse: true },
  { slug: "auth-minimal-centered-sign-in", family: "ways-in" },
  { slug: "auth-sign-up-password-strength", family: "ways-in" },
  { slug: "auth-sign-up-benefits-column", family: "ways-in" },
  { slug: "auth-tabbed-sign-in-sign-up", family: "ways-in" },
  { slug: "auth-magic-link-request", family: "ways-in" },
  { slug: "auth-check-your-email", family: "next-steps" },
  { slug: "auth-otp-verification", family: "next-steps" },
  { slug: "auth-two-factor-authenticator", family: "next-steps" },
  { slug: "auth-two-factor-method-chooser", family: "next-steps" },
  { slug: "auth-forgot-password", family: "next-steps" },
  { slug: "auth-reset-password", family: "next-steps" },
  { slug: "auth-password-changed", family: "next-steps" },
  { slug: "auth-team-invite-accept", family: "next-steps" },
  { slug: "auth-profile-setup-onboarding", family: "next-steps" },
  { slug: "auth-photo-background-sign-in", family: "ways-in" },
  { slug: "auth-phone-number-sign-in", family: "ways-in" },
  { slug: "auth-qr-device-login", family: "ways-in" },
  { slug: "auth-passkey-sign-in", family: "ways-in" },
  { slug: "auth-locked-session-re-authenticate", family: "next-steps" },
  { slug: "auth-multi-step-sign-up-wizard", family: "next-steps" },
  { slug: "auth-sign-in-error-state", family: "next-steps" },
  { slug: "auth-waitlist-early-access", family: "ways-in" },
]

export const GALLERY_TYPES: BlockType<GalleryFamily>[] = [
  { slug: "gallery-culture-photo-grid", family: "grids" },
  { slug: "gallery-masonry-gallery", family: "grids" },
  { slug: "gallery-photo-bento", family: "grids" },
  { slug: "gallery-filmstrip-carousel", family: "carousels" },
  { slug: "gallery-full-bleed-slider", family: "carousels", inverse: true },
  { slug: "gallery-filter-tabs-grid", family: "grids" },
  { slug: "gallery-hover-caption-cards", family: "grids" },
  { slug: "gallery-lightbox-viewer", family: "viewers", inverse: true },
  { slug: "gallery-horizontal-scroll-rail", family: "carousels" },
  { slug: "gallery-editorial-split", family: "grids" },
  { slug: "gallery-scattered-collage", family: "grids" },
  { slug: "gallery-social-feed-strip", family: "viewers", inverse: true },
  { slug: "gallery-video-gallery", family: "viewers", inverse: true },
  { slug: "gallery-before-after-compare", family: "viewers" },
  { slug: "gallery-dark-cinema-wall", family: "viewers", inverse: true },
  { slug: "gallery-hover-index-list", family: "viewers" },
  { slug: "gallery-mosaic-statement-tile", family: "grids" },
  { slug: "gallery-contact-sheet-wall", family: "grids" },
  { slug: "gallery-featured-thumb-rail", family: "carousels", inverse: true },
  { slug: "gallery-album-cards", family: "grids" },
  { slug: "gallery-timeline-gallery", family: "grids" },
  { slug: "gallery-photo-spotlight", family: "viewers" },
]

/** The Hero Types, in Figma's order. */
export const HERO_TYPES: BlockType<HeroFamily>[] = [
  { slug: "hero-editorial-arch", family: "split" },
  { slug: "hero-photo-constellation", family: "photo-led", inverse: true },
  { slug: "hero-arc-gallery", family: "photo-led" },
  { slug: "hero-inline-image-headline", family: "type-led", inverse: true },
  { slug: "hero-bento-split", family: "split", inverse: true },
  { slug: "hero-framed-full-bleed", family: "photo-led", inverse: true },
  { slug: "hero-annotated-object", family: "photo-led" },
  { slug: "hero-editorial-triptych", family: "photo-led" },
  { slug: "hero-colour-stage", family: "type-led", inverse: true },
  { slug: "hero-twin-panels", family: "cards" },
  { slug: "hero-split-band-headline", family: "split", inverse: true },
  { slug: "hero-textured-dark", family: "photo-led", inverse: true },
  { slug: "hero-component-pattern", family: "cards" },
  { slug: "hero-curved-media-rail", family: "photo-led" },
  { slug: "hero-framed-studio-card", family: "split" },
  { slug: "hero-orbit-track", family: "photo-led", inverse: true },
  { slug: "hero-floating-integrations", family: "cards" },
  { slug: "hero-shape-grid", family: "cards" },
  { slug: "hero-wave-band", family: "photo-led" },
  { slug: "hero-studio-mosaic", family: "cards" },
  { slug: "hero-illustration-split", family: "split" },
  { slug: "hero-masked-type-reveal", family: "type-led", inverse: true },
  { slug: "hero-velocity-marquee", family: "type-led", inverse: true },
  { slug: "hero-duo-card", family: "cards" },
  { slug: "hero-video-spotlight", family: "photo-led", inverse: true },
  { slug: "hero-brand-color-block", family: "type-led" },
  { slug: "hero-scramble-decode", family: "type-led" },
  { slug: "hero-split-flap-counters", family: "type-led" },
  { slug: "hero-video-in-type", family: "type-led" },
]

/** Every block a preview page renders, across the families. */
export const NAVBAR_TYPES: BlockType<NavbarFamily>[] = [
  { slug: "navbar-default", family: "site" },
  { slug: "navbar-with-dropdown", family: "site" },
  { slug: "navbar-with-icon-indicator-avatar", family: "app" },
  { slug: "navbar-with-centered-logo", family: "app" },
  { slug: "navbar-with-cta-button", family: "site" },
  { slug: "navbar-with-submenu", family: "app" },
  { slug: "navbar-rounded", family: "floating" },
  { slug: "navbar-with-search-input", family: "app" },
  { slug: "navbar-multiple-icon", family: "app" },
  { slug: "navbar-multiple-action", family: "site" },
  { slug: "navbar-extended-at-top", family: "site" },
  { slug: "navbar-small", family: "floating" },
  { slug: "navbar-rounded-small", family: "floating" },
  { slug: "navbar-centered-floating", family: "floating" },
  { slug: "navbar-active-action-with-border", family: "site" },
  { slug: "navbar-active-action-with-round", family: "site" },
  { slug: "navbar-e-commerce", family: "app" },
]

export const PRICING_TYPES: BlockType<PricingFamily>[] = [
  { slug: "pricing-tiers", family: "compare" },
  { slug: "pricing-two-plan-compare", family: "compare" },
  { slug: "pricing-plan-spotlight", family: "choose" },
  { slug: "pricing-comparison-matrix", family: "compare" },
  { slug: "pricing-plan-picker-summary", family: "choose" },
]

export const ABOUT_TYPES: BlockType<AboutFamily>[] = [
  { slug: "about-mission-statement-hero", family: "statements" },
  { slug: "about-collage-hero", family: "statements" },
  { slug: "about-statement-band", family: "statements" },
  { slug: "about-values-spotlight", family: "story" },
  { slug: "about-values-connector-list", family: "story" },
  { slug: "about-approach-stack-cards", family: "story" },
  { slug: "about-story-snapshots", family: "story" },
  { slug: "about-bento", family: "culture" },
  { slug: "about-culture-masonry", family: "culture" },
  { slug: "about-impact-stats-band", family: "culture" },
  { slug: "about-story-photos", family: "story" },
  { slug: "about-split-panel", family: "statements", inverse: true },
  { slug: "about-letter-card", family: "story" },
  { slug: "about-values-focus", family: "story" },
  { slug: "about-spotlight", family: "statements", inverse: true },
  { slug: "about-headline-photos", family: "statements" },
  { slug: "about-type-stack", family: "statements" },
  { slug: "about-color-bento", family: "culture" },
  { slug: "about-numbered-rows", family: "story", inverse: true },
]

export const CAREERS_TYPES: BlockType<CareersFamily>[] = [
  { slug: "careers-open-roles-hairline-list", family: "lists" },
  { slug: "careers-role-cards-grid", family: "lists" },
  { slug: "careers-roles-by-department", family: "lists" },
  { slug: "careers-open-vacancies-table", family: "lists" },
  { slug: "careers-roles-list-accordion-expanded", family: "lists" },
  { slug: "careers-about-card-role-list", family: "lists" },
  { slug: "careers-featured-role-spotlight", family: "highlights" },
  { slug: "careers-perks-benefits", family: "highlights" },
  { slug: "careers-no-open-roles-empty-state", family: "highlights" },
  { slug: "careers-role-detail-panel", family: "details" },
  { slug: "careers-role-detail-page", family: "details" },
]

/** The 14 Types, in Figma's order. Three drop the block name Figma still carries: Team Carousel, Team Table and Hairline Team Grid. */
export const TEAM_TYPES: BlockType<TeamFamily>[] = [
  { slug: "team-leadership-grid", family: "grids-and-walls" },
  { slug: "team-portrait-wall", family: "grids-and-walls" },
  { slug: "team-compact-directory-rows", family: "directories" },
  { slug: "team-split-intro-member-rail", family: "directories" },
  { slug: "team-founder-spotlight", family: "spotlights" },
  { slug: "team-member-carousel", family: "spotlights" },
  { slug: "team-department-tabs-directory", family: "directories" },
  { slug: "team-member-table", family: "directories" },
  { slug: "team-meta-profile-cards", family: "grids-and-walls" },
  { slug: "team-we-re-hiring-cta", family: "spotlights" },
  { slug: "team-hairline-grid", family: "grids-and-walls", inverse: true },
  { slug: "team-overlay-portrait-cards", family: "grids-and-walls", inverse: true },
  { slug: "team-annotated-portrait-lineup", family: "grids-and-walls" },
  { slug: "team-grid-backdrop-roster", family: "grids-and-walls" },
]

export const SOCIAL_PROOF_TYPES: BlockType<SocialProofFamily>[] = [
  { slug: "social-proof-classic-trio-grid", family: "grids" },
  { slug: "social-proof-staggered-columns", family: "grids" },
  { slug: "social-proof-benefit-title-cards", family: "grids" },
  { slug: "social-proof-giant-quote-duo", family: "grids" },
  { slug: "social-proof-vertical-column-wall", family: "grids" },
  { slug: "social-proof-tweet-wall", family: "grids" },
  { slug: "social-proof-app-review-row", family: "grids" },
  { slug: "social-proof-centered-logo-spotlight", family: "spotlights" },
  { slug: "social-proof-dark-editorial-split", family: "spotlights", inverse: true },
  { slug: "social-proof-bracket-framed-quote", family: "spotlights" },
  { slug: "social-proof-highlighted-phrase-spotlight", family: "spotlights" },
  { slug: "social-proof-tinted-panel-portrait", family: "spotlights" },
  { slug: "social-proof-overlay-photo-quote", family: "spotlights", inverse: true },
  { slug: "social-proof-arch-portrait-quote", family: "spotlights" },
  { slug: "social-proof-spotlight-carousel", family: "carousels" },
  { slug: "social-proof-avatar-selector-row", family: "carousels" },
  { slug: "social-proof-progress-carousel", family: "carousels" },
  { slug: "social-proof-persona-pillars", family: "carousels" },
  { slug: "social-proof-workplace-portrait-stories", family: "carousels" },
  { slug: "social-proof-stat-story-cards", family: "stories" },
  { slug: "social-proof-video-story-cards", family: "stories" },
  { slug: "social-proof-case-study-row", family: "stories" },
  { slug: "social-proof-proof-bento", family: "stories" },
]

export const ALL_BLOCK_TYPES: BlockType[] = [
  ...FAQ_TYPES,
  ...ERROR_STATE_TYPES,
  ...LOGO_CLOUD_TYPES,
  ...AUTHENTICATIONS_TYPES,
  ...GALLERY_TYPES,
  ...NAVBAR_TYPES,
  ...PRICING_TYPES,
  ...HERO_TYPES,
  ...ABOUT_TYPES,
  ...CAREERS_TYPES,
  ...TEAM_TYPES,
  ...SOCIAL_PROOF_TYPES,
]

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
