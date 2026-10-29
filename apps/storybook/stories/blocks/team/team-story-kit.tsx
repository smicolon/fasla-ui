import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { teamPhotoProps } from "../../../../docs/components/blocks/team-photos"

/**
 * For Team.stories.tsx and TeamOverview.stories.tsx, beside it. The blocks
 * bring their own English and Arabic copy; the stories only pick the language
 * from the Direction toolbar, so a story shows the copy Figma has for that
 * direction. The photos are the docs site's, in public/blocks/team/ (credits
 * in its CREDITS.md), with alt text in the same language; the two cut-out
 * Types take transparent ones.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const teamViewports = {
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
 * language: the block's own copy lists with a photo on each person.
 */
export const photoPropsOf = (type: string, context: StoryContext, copy: Copy) => teamPhotoProps(type, localeOf(context), copy)

/**
 * The empty state: every list of people the block's copy holds, set to none,
 * so the block renders no cards rather than a broken frame.
 */
export const emptyPropsOf = (copy: Copy) =>
  Object.fromEntries(
    Object.entries(copy.en)
      .filter(([, value]) => Array.isArray(value) && value.some((item) => typeof item === "object" && item !== null && !("$$typeof" in item)))
      .map(([key]) => [key, []])
  )

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that
 * change nothing on screen beyond the shared rules (names only screen
 * readers hear); `show` keeps a message row for a story that opens on that
 * state.
 */
export const teamArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = [], show: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide, show })
