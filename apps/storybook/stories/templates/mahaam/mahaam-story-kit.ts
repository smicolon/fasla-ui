/**
 * For the Mahaam template's stories, beside them. The sections bring their own
 * English and Arabic copy; a story picks the language from its Direction, as
 * the Figma set pairs LTR with English and RTL with Arabic.
 */

/**
 * The Motion toolbar item (drawn by .storybook/manager.tsx): Playing leaves the
 * section alone, Paused freezes it where it stands (the `paused` prop, as a
 * site's `MahaamMotionToggle` would), Final frame holds Figma's still frame
 * (`still`) and Reduced motion is what a visitor who asks for it sees. A story's
 * own args win over it.
 */
export type MahaamMotion = { paused?: boolean; still?: boolean; reducedMotion?: boolean }
export const motionOf = (context: { globals: { motion?: string } }): MahaamMotion => {
  switch (context.globals.motion) {
    case "paused":
      return { paused: true }
    case "final":
      return { still: true }
    case "reduced":
      return { reducedMotion: true }
    default:
      return {}
  }
}

/** Figma's three breakpoints, as the viewport toolbar's choices. */
export const mahaamViewports = {
  desktop: { name: "Desktop (1440)", styles: { width: "1440px", height: "900px" }, type: "desktop" },
  tablet: { name: "Tablet (768)", styles: { width: "768px", height: "1024px" }, type: "tablet" },
  mobile: { name: "Mobile (360)", styles: { width: "360px", height: "780px" }, type: "mobile" },
} as const

export type Breakpoint = keyof typeof mahaamViewports
export type Direction = "ltr" | "rtl"

/** The language the Direction toolbar picks. */
export const localeOf = (context: { globals: { direction?: string } }): "en" | "ar" =>
  context.globals.direction === "rtl" ? "ar" : "en"

/**
 * One Figma variant is a breakpoint and a direction. A story spreads this to
 * open on that variant: the direction as a global, the breakpoint as the
 * viewport the toolbar starts on. The toolbars can still change either.
 */
export const variant = (breakpoint: Breakpoint, direction: Direction) => ({
  globals: { direction },
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: breakpoint } },
})

export const BREAKPOINTS: Breakpoint[] = ["desktop", "tablet", "mobile"]
export const DIRECTIONS: Direction[] = ["ltr", "rtl"]
export const label = (breakpoint: Breakpoint, direction: Direction) =>
  `${breakpoint[0].toUpperCase()}${breakpoint.slice(1)} · ${direction.toUpperCase()}`
