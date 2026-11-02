import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { footerPhotoProps } from "../../../../docs/components/blocks/footer-photos"

/**
 * For Footer.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction. The
 * photos are the docs site's: the Unsplash photos Figma's Footer set shows,
 * with alt text in the same language.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const footerViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

type Copy = { en: object; ar: object }

/** The props that give a Type its demo photos, described in the toolbar's language. Types without photos get none. */
export const photoPropsOf = (type: string, context: StoryContext, copy: Copy) => footerPhotoProps(type, localeOf(context), copy)

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules; `show` keeps a message
 * row for a story that opens on that state.
 */
export const footerArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
