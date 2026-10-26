import { logoCloudLogoMetricTilesCopy } from "../../../../packages/fasla-ui/registry/blocks/logo-cloud-logo-metric-tiles/LogoCloudLogoMetricTiles"
import { logoCloudLogoQuoteCardsCopy } from "../../../../packages/fasla-ui/registry/blocks/logo-cloud-logo-quote-cards/LogoCloudLogoQuoteCards"
import { logoCloudNamedIntegrationCardsCopy } from "../../../../packages/fasla-ui/registry/blocks/logo-cloud-named-integration-cards/LogoCloudNamedIntegrationCards"
import { brandLogo, brandLogos, type Brand } from "./brand-logos"

/*
 * What the Logo Cloud previews and stories pass each Type: the logos no block
 * ships, and the copy items they pair with. The marks are the ones Figma
 * shows for that Type, in its LTR order, and the same order serves Arabic:
 * the page's direction does the mirroring.
 *
 * Every example is built once, when the module loads, never inside a render:
 * an element made during a render keeps a link to the rendering fiber, and
 * Storybook's source snippet walks that whole tree until the stack overflows.
 *
 * Imported by relative path: Storybook resolves no `@fasla-ui/*` alias.
 */

type Locale = "en" | "ar"

/** The twelve marks Figma's light grids show. */
const TWELVE: Brand[] = ["google", "amazon", "hubspot", "walmart", "microsoft", "fedex", "airbnb", "adobe", "shopify", "paypal", "huawei", "netflix"]

/** Figma's mixed set of nine, used by the split and bento layouts. */
const NINE: Brand[] = ["google", "hubspot", "fedex", "shopify", "huawei", "uber", "ibm", "nvidia", "siemens"]

/** Logo Metric Tiles: the mark over each of the block's figures, in Figma's order. */
const METRIC_TILE_BRANDS: Brand[] = ["google", "hubspot", "fedex", "shopify", "huawei", "uber"]

/** Logo Quote Cards: Figma's mark for each quote, in the copy's order. */
const QUOTE_CARD_BRANDS: Brand[] = ["google", "hubspot", "microsoft", "adobe", "paypal", "slack"]

/** Named Integration Cards: the mark and name on each of the block's cards, in Figma's order. */
const INTEGRATION_BRANDS: Brand[] = ["google", "hubspot", "fedex", "adobe", "paypal", "netflix", "uber", "stripe"]

/**
 * Tabbed Industry Filter's one list, each mark tagged with the tabs it shows
 * under. Finance is Figma's panel, in Figma's order; Figma draws no other
 * panel, so the other three are this example's picks from the Brand Logos set.
 */
const INDUSTRY_LOGOS: [Brand, string[]][] = [
  ["google", ["finance", "technology"]],
  ["amazon", ["finance", "retail"]],
  ["hubspot", ["finance"]],
  ["walmart", ["finance", "retail"]],
  ["paypal", ["finance", "retail"]],
  ["huawei", ["finance"]],
  ["uber", ["finance"]],
  ["ibm", ["finance", "health"]],
  ["siemens", ["health"]],
  ["oracle", ["health", "technology"]],
  ["salesforce", ["health"]],
  ["microsoft", ["health", "technology"]],
  ["zoom", ["health"]],
  ["samsung", ["health", "technology"]],
  ["intel", ["health", "technology"]],
  ["shopify", ["retail"]],
  ["airbnb", ["retail"]],
  ["adobe", ["retail"]],
  ["fedex", ["retail"]],
  ["stripe", ["retail"]],
  ["nvidia", ["technology"]],
  ["sony", ["technology"]],
  ["github", ["technology"]],
]

const example = (locale: Locale) => ({
  "logo-cloud-centered-caption-row": { logos: brandLogos(TWELVE.slice(0, 6)) },
  "logo-cloud-heading-grid": { logos: brandLogos(TWELVE.slice(0, 8)) },
  "logo-cloud-bordered-cell-grid": { logos: brandLogos(TWELVE.slice(0, 10)) },
  "logo-cloud-enterprise-wall": {
    logos: brandLogos([
      ...TWELVE,
      "slack", "uber", "salesforce", "stripe", "ibm", "oracle",
      "samsung", "nvidia", "visa", "mastercard", "siemens", "intel",
    ]),
  },
  "logo-cloud-contained-card": { logos: brandLogos(TWELVE) },
  // The inverse blocks take Monochrome marks, which they colour `foreground-inverse`, as Figma does.
  "logo-cloud-dark-logo-wall": { logos: brandLogos(TWELVE, "monochrome") },
  "logo-cloud-side-label-rail": { logos: brandLogos(TWELVE.slice(0, 10)) },
  "logo-cloud-heading-left-grid-right": { logos: brandLogos(TWELVE.slice(0, 9)) },
  "logo-cloud-editorial-eyebrow-split": { logos: brandLogos(NINE.slice(0, 6)) },
  "logo-cloud-flanked-heading": { logos: brandLogos(TWELVE.slice(0, 8)) },
  "logo-cloud-quote-panel-grid": { logos: brandLogos([...TWELVE, "slack", "uber", "salesforce", "stripe"]) },
  "logo-cloud-stat-rail-above-grid": { logos: brandLogos(TWELVE.slice(0, 8)) },
  "logo-cloud-logo-metric-tiles": {
    tiles: logoCloudLogoMetricTilesCopy[locale].tiles.map((tile, index) => ({ ...tile, logo: brandLogo(METRIC_TILE_BRANDS[index]!) })),
  },
  "logo-cloud-logo-quote-cards": {
    quotes: logoCloudLogoQuoteCardsCopy[locale].quotes.map((item, index) => ({ ...item, logo: brandLogo(QUOTE_CARD_BRANDS[index]!, "monochrome") })),
  },
  "logo-cloud-named-integration-cards": {
    integrations: logoCloudNamedIntegrationCardsCopy[locale].integrations.map((integration, index) => ({
      ...integration,
      logo: brandLogo(INTEGRATION_BRANDS[index]!),
    })),
  },
  "logo-cloud-logo-testimonial-strip": { logos: brandLogos(NINE) },
  "logo-cloud-scatter-field": { logos: brandLogos(TWELVE) },
  "logo-cloud-bento-logo-wall": { logos: brandLogos(NINE) },
  "logo-cloud-divider-rule-row": { logos: brandLogos(["google", "hubspot", "fedex", "paypal", "uber"], "monochrome") },
  "logo-cloud-pyramid-row-stack": { logos: brandLogos([...TWELVE, "slack", "uber", "salesforce", "stripe", "ibm"]) },
  "logo-cloud-tabbed-industry-filter": { logos: INDUSTRY_LOGOS.map(([brand, industries]) => ({ ...brandLogo(brand), industries })) },
  "logo-cloud-grid-closing-cta": { logos: brandLogos(TWELVE) },
})

/** Each Type's example props, by registry name and then locale. */
export const LOGO_CLOUD_EXAMPLES = { en: example("en"), ar: example("ar") }
