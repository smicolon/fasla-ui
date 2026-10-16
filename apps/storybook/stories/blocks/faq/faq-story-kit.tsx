import * as React from "react"
import type { ArgTypes, Decorator } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"

/**
 * For FAQ.stories.tsx, beside it. The blocks bring their own English
 * and Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const faqViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

/**
 * The FAQ meta sets `parameters: { layout: "fullscreen", viewport: {
 * viewports: faqViewports } }`: full-bleed, as a block sits on a page, with
 * Figma's breakpoints in the viewport toolbar. Written out in the meta, not
 * shared as a variable: Storybook's docs plugin replaces a meta's
 * `parameters` that isn't an object literal, and the stories fall back to the
 * preview's centred layout.
 */

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that change
 * nothing on screen beyond the shared rules (names only assistive tech reads,
 * copy the story leaves off screen); `show` keeps a message row for a story
 * that opens on that state.
 */
export const faqArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })

/**
 * A theme with none of Fasla's inverse tokens, as in a project on another
 * library's theme: `initial` unsets each one, so the mapping's fallback, the
 * page colours swapped, is what paints the panel. The page colours are set
 * too, to a colour scheme Fasla doesn't use, so the fallback is visibly
 * reading them.
 */
export const withForeignTheme: Decorator = (Story) => (
  <div
    style={
      {
        "--background-inverse": "initial",
        "--foreground-inverse": "initial",
        "--muted-foreground-inverse": "initial",
        "--background": "#fdf6ec",
        "--foreground": "#2b1d0e",
      } as React.CSSProperties
    }
  >
    <Story />
  </div>
)
