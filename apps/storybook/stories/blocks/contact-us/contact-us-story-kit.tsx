import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { CONTACT_US_NOW, CONTACT_US_TABLE_NOW, contactUsPhotoProps } from "../../../../docs/components/blocks/contact-us-photos"

/** The frozen moments of the live blocks, as the docs previews freeze them. */
export { CONTACT_US_NOW, CONTACT_US_TABLE_NOW }

/**
 * For ContactUs.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const contactUsViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/** The props that give a Type its demo photo, described in the toolbar's language. */
export const photoPropsOf = (type: string, context: StoryContext) => contactUsPhotoProps(type, localeOf(context))

/** A send that takes a moment, so the button's pending state and the thank-you panel show. */
export const settle = (ms = 1200) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** A send that fails after a moment, so the error shows. */
export const fail = async (ms = 800) => {
  await settle(ms)
  throw new Error("The message could not be sent.")
}

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules; `show` keeps a message
 * row for a story that opens on that state.
 */
export const contactUsArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
