/**
 * Names that belong to Fasla Pro, not to this open-source package: the block
 * families, the six blocks this package used to ship, and the templates. `add` checks a
 * name here only when the registry it reads does not have it, so a registry
 * that does serve one of these names still installs it.
 */

export const PRICING_URL = "https://fasla.smicolon.com/en/#pricing"

/** Every Type of these families is named `<family>-<type>`. */
const PRO_FAMILIES = [
  "about",
  "auth",
  "blog-cards",
  "careers",
  "contact-us",
  "error-state",
  "faq",
  "features",
  "footer",
  "gallery",
  "hero",
  "how-it-works",
  "logo-cloud",
  "navbar",
  "pricing",
  "social-proof",
  "team",
  "video-call",
] as const

/** Names that are Pro on their own. */
const PRO_NAMES = new Set<string>([
  ...PRO_FAMILIES,
  "app-shell",
  "data-table",
  "empty-state",
  "form-section",
  "page-header",
  "stats-card",
  "mahaam",
])

export function isProName(name: string): boolean {
  return PRO_NAMES.has(name) || PRO_FAMILIES.some((family) => name.startsWith(`${family}-`))
}

/** What `add` prints for names that are part of Fasla Pro. */
export function proNotice(names: string[]): string {
  const list = names.join(", ")
  const subject = names.length === 1 ? `${list} is` : `${list} are`
  return [
    `${subject} part of Fasla Pro, coming soon. This package has the free UI primitives and effects.`,
    `Pricing: ${PRICING_URL}`,
  ].join("\n")
}
