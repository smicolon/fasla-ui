import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { aboutPhotoProps } from "../../../../docs/components/blocks/about-photos"

/**
 * For About.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction. The
 * photos are the docs site's (Gallery's, and the few About keeps from
 * Figma), with alt text in the same language.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const aboutViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

type Copy = { en: object; ar: object }

/**
 * The props that give a Type its demo photos, described in the toolbar's
 * language: a `photos` list, or the block's own copy list with a photo on
 * each item.
 */
export const photoPropsOf = (type: string, context: StoryContext, copy: Copy) => aboutPhotoProps(type, localeOf(context), copy)

/**
 * The empty state: every list the block's copy holds, and its photos, set
 * to none, so the block shows its "No … yet." line whichever list it reads.
 */
export const emptyPropsOf = (copy: Copy) => ({
  photos: [],
  ...Object.fromEntries(
    Object.entries(copy.en)
      .filter(([, value]) => Array.isArray(value) && value.some((item) => typeof item === "object" && item !== null && !("$$typeof" in item)))
      .map(([key]) => [key, []])
  ),
})

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules (names only screen
 * readers hear, the empty-photo line); `show` keeps a message row for a
 * story that opens on that state.
 */
export const aboutArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
