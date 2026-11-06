import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFeatures } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-features"
import { mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, pausedOf, variant } from "./mahaam-story-kit"

/**
 * Features: A heading over three cards whose windows play on their own: ten languages stacking, a hand-off to Khalid, and a recap that writes itself.
 *
 * States. Final: Figma's still frames. Playing: the three loops. Paused: frozen. Reduced motion: the still frames.
 *
 * Props. The controls change the copy and the language. The rest are in the docs page's Props table.
 *
 * Stories. One per state, breakpoint and direction, so each has its own link; the viewport and direction toolbars still change any of them.
 *
 * The motion is a documented exception to the repo's motion rules (see `mahaam-motion.ts`). The Motion toolbar item pauses the section, in place of a visible pause button.
 */
const meta: Meta<typeof MahaamFeatures> = {
  title: "Templates/Mahaam/Features",
  component: MahaamFeatures,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["heading", "subheading", "locale", "className"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamFeatures locale={localeOf(context)} paused={pausedOf(context)} {...mahaamPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFeatures>

/* Final: The finished frame, as Figma draws it, held with `still`. */
export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true } }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true } }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true } }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true } }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true } }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true } }

/* Playing: The section on its own, looping. It plays only while on screen, and waits under the pointer. */
export const PlayingDesktopLtr: Story = { name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Paused: Frozen mid-run, as `paused` leaves it. */
export const PausedDesktopLtr: Story = { name: "Paused · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedDesktopRtl: Story = { name: "Paused · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedTabletLtr: Story = { name: "Paused · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedTabletRtl: Story = { name: "Paused · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedMobileLtr: Story = { name: "Paused · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { defaultPaused: true, progress: 0.5 } }
export const PausedMobileRtl: Story = { name: "Paused · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { defaultPaused: true, progress: 0.5 } }

/* Reduced motion: What a visitor who asks for reduced motion sees: the finished frame, no animation. */
export const ReducedMotionDesktopLtr: Story = { name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

