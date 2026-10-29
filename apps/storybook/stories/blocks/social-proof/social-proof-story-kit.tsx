import type { ArgTypes } from "@storybook/react"
import { blockArgTypes, type BlockCopy } from "../block-arg-types"
import { socialProofPhotos } from "../../../../docs/components/blocks/social-proof-photos"

/**
 * For SocialProof.stories.tsx, beside it. The blocks bring their own English
 * and Arabic copy; the stories only pick the language from the Direction
 * toolbar, so a story shows the copy Figma has for that direction. The photos
 * are the docs site's, one for every person and photo slot.
 */

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const socialProofViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

type StoryContext = { globals: { direction?: string } }

/** The block's copy language, from the Direction toolbar. */
export const localeOf = (context: StoryContext): "en" | "ar" => (context.globals.direction === "rtl" ? "ar" : "en")

/** The demo photos every story passes. */
export const photos = socialProofPhotos

/**
 * Props every Social Proof block may take that a Controls row can't show:
 * the set or item shown, which is state the visitor sets by pressing the
 * block, and the names only assistive tech reads. The docs site documents
 * them.
 */
const ALWAYS_HIDDEN = ["set", "index", "label", "networkLabel"]

/**
 * Controls for one block's story: the shared rules in `../block-arg-types`,
 * the same for every block family. `hide` lists this story's props that change
 * nothing on screen beyond the shared rules.
 */
export const socialProofArgTypes = (component: unknown, copy?: BlockCopy, hide: string[] = []): ArgTypes =>
  blockArgTypes(component, copy, { hide: [...ALWAYS_HIDDEN, ...hide] })
