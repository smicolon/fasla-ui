import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"

/**
 * For Pricing.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction toolbar,
 * so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const pricingViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/**
 * Props every Pricing block may take that a Controls row can't show: the
 * chosen billing cycle, option or plan, which is state the visitor sets by
 * pressing the block; the docs site documents them.
 */
const ALWAYS_HIDDEN = ["billing", "value"]

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that change
 * nothing on screen beyond the shared rules: names only assistive tech reads.
 */
export const pricingArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide: [...ALWAYS_HIDDEN, ...hide] })
