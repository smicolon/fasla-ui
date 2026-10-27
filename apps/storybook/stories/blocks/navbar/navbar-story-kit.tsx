import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"

/**
 * For Navbar.stories.tsx, beside it. The blocks bring their own English and
 * Arabic copy; the stories only pick the language from the Direction toolbar,
 * so a story shows the copy Figma has for that direction. The logo and the
 * account photo come from the docs site's examples, the same ones its
 * previews show.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const navbarViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/**
 * Props every Navbar block may take that a Controls row can't show: the logo
 * slot (an element), and the open Sheet and the search field's value, which
 * are behaviour; the docs site documents them.
 */
const ALWAYS_HIDDEN = ["logo", "menuOpen", "searchValue"]

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that change
 * nothing on screen beyond the shared rules: names only assistive tech reads.
 */
export const navbarArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide: [...ALWAYS_HIDDEN, ...hide] })
