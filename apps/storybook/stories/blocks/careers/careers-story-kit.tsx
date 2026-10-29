import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { careersPhotoProps } from "../../../../docs/components/blocks/careers-photos"

/**
 * For Careers.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction. The photos
 * are the docs site's, with alt text in the same language.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const careersViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/** The props that give a Type its demo photo, described in the toolbar's language. */
export const photoPropsOf = (type: string, context: StoryContext) => careersPhotoProps(type, localeOf(context))

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules, or that Controls can't
 * edit (a tuple of labels); `show` keeps a message row for a story that opens
 * on that state.
 */
export const careersArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
