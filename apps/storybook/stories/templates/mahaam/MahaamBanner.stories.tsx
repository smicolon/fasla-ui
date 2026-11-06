import type { Meta, StoryObj } from "@storybook/react"
import { MahaamBanner } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-banner"
import { label, localeOf, mahaamViewports, motionOf, variant } from "./mahaam-story-kit"

/**
 * The per-state stories of the Mahaam banner: Final, Playing, Paused and Reduced motion, per breakpoint
 * and direction. They are tagged `!dev` and `!autodocs`, so the sidebar and the Docs page do not list
 * them, but they stay under the same ids for the pixel-diff scripts and old links. The story people
 * read is `Banner` in Mahaam.stories.tsx.
 */
const meta: Meta<typeof MahaamBanner> = {
  // The id keeps the story ids stable; the title keeps these out of the visible Templates / Mahaam page.
  id: "templates-mahaam-banner",
  title: "Templates/Mahaam States/Banner",
  component: MahaamBanner,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  render: (args, context) => <MahaamBanner locale={localeOf(context)} {...motionOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamBanner>

/* Final: The finished frame, as Figma draws it, held with `still`. */
export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true } }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true } }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true } }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true } }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true } }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true } }

/* Playing: The section on its own, looping. It plays only while on screen, and waits under the pointer. */
export const PlayingDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Paused: Frozen mid-run, as `paused` leaves it. */
export const PausedDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { defaultPaused: true, progress: 0.5 } }

/* Reduced motion: What a visitor who asks for reduced motion sees: the finished frame, no animation. */
export const ReducedMotionDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

