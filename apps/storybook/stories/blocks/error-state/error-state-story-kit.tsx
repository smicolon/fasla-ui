import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"

/**
 * For ErrorState.stories.tsx, beside it. The blocks bring their own English
 * and Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const errorStateViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `screenReaderOnly` lists the block's props
 * that only name something for assistive tech or are read out while an action
 * runs; they get no row, as they change nothing on screen.
 */
export const errorStateArgTypes = (component: unknown, copy?: BlockCopy, screenReaderOnly: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { screenReaderOnly })
