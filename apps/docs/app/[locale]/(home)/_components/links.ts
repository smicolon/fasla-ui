/** The Coming soon page, for what is announced but not out yet. */
const comingSoon = (locale: string) => `/${locale}/coming-soon/`

/**
 * Every destination the landing page links to, in one place.
 *
 * `blocks`, `templates`, `pro` and `team` go to the Coming soon page: the
 * blocks and templates are part of Fasla Pro, and there is no checkout yet.
 * `components` points at the first component page: there is no components
 * index yet.
 * Change them here and every link on the page follows.
 */
export const landingLinks = {
  docs: (locale: string) => `/${locale}/docs/`,
  components: (locale: string) => `/${locale}/docs/components/button/`,
  comingSoon,
  blocks: comingSoon,
  templates: comingSoon,
  pro: comingSoon,
  team: comingSoon,
  // Relative, so it opens the Storybook built and deployed with this site
  // (build:pages serves it at /components/), on whichever host serves the page.
  storybook: "/components/?path=/docs/ui-button--docs",
  github: "https://github.com/smicolon/fasla-ui",
} as const

export const installCommand = "npx @smicolon/fasla-ui@latest init"

/** Smicolon's support address, written here and nowhere else in the site. */
export const supportEmail = "support@smicolon.com"

/**
 * A new email to support asking to hear when Fasla Pro opens, with the subject
 * in the page's language. The subject is percent-encoded (spaces as %20, Arabic
 * as UTF-8), as mailto URLs require. No form and no tracking: the reader's own
 * email program sends it.
 */
export const notifyProMailto = (subject: string) => `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`
