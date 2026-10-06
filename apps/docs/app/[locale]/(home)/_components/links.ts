/**
 * Every destination the landing page links to, in one place.
 *
 * `components`, `pro` and `team` are stand-ins until Mohamed decides where they
 * go: there is no components index yet, and no checkout. Change them here and
 * every link on the page follows.
 */
export const landingLinks = {
  docs: (locale: string) => `/${locale}/docs/`,
  components: (locale: string) => `/${locale}/docs/components/button/`,
  pro: (locale: string) => `/${locale}/docs/`,
  team: (locale: string) => `/${locale}/docs/`,
  storybook: "https://ui.smicolon.com/components/",
  github: "https://github.com/smicolon/fasla-ui",
  discussions: "https://github.com/smicolon/fasla-ui/discussions",
} as const

export const installCommand = "npx @smicolon/cli init"
