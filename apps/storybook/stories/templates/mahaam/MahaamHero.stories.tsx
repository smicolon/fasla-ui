import type { Meta, StoryObj } from "@storybook/react"
import { MahaamHero } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-hero"
import { mahaamHeroPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, pausedOf, variant } from "./mahaam-story-kit"

/**
 * Hero: The copy beside a painting with a day planner on it, where a voice note types itself and three task blocks drop into their slots.
 *
 * States. Final: Figma's finished frame, held. Playing: the 200-frame loop. Paused: frozen at frame 80. Reduced motion: the finished frame.
 *
 * Props. The controls change the copy and the language. The rest are in the docs page's Props table.
 *
 * Stories. One per state, breakpoint and direction, so each has its own link; the viewport and direction toolbars still change any of them.
 *
 * The motion is a documented exception to the repo's motion rules (see `mahaam-motion.ts`). The Motion toolbar item pauses the section, in place of a visible pause button.
 */
const meta: Meta<typeof MahaamHero> = {
  title: "Templates/Mahaam/Hero",
  component: MahaamHero,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["eyebrow", "heading", "body", "primaryCta", "locale", "className"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamHero locale={localeOf(context)} paused={pausedOf(context)} {...mahaamHeroPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamHero>

/* Final: The finished frame, as Figma draws it: the voice note typed, the three blocks in their slots, the first sub-task ticked, nothing moving. The animation is held on this frame with `still`, as Figma draws it. */
export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true, frame: 170 } }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true, frame: 170 } }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true, frame: 170 } }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true, frame: 170 } }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true, frame: 170 } }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true, frame: 170 } }

/* Playing: The loop on its own: 200 frames of 60ms, then it starts again. It plays only while the section is on screen. */
export const PlayingDesktopLtr: Story = { name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Paused: Frozen mid-run, at frame 80: the voice note is typed and two blocks have landed, the third is on its way. The state `paused` leaves the section in. */
export const PausedDesktopLtr: Story = { name: "Paused · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedDesktopRtl: Story = { name: "Paused · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { defaultPaused: true, frame: 80 } }
export const PausedTabletLtr: Story = { name: "Paused · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedTabletRtl: Story = { name: "Paused · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { defaultPaused: true, frame: 80 } }
export const PausedMobileLtr: Story = { name: "Paused · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedMobileRtl: Story = { name: "Paused · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { defaultPaused: true, frame: 80 } }

/* Reduced motion: What a visitor who asks for reduced motion sees: the finished frame, no animation. */
export const ReducedMotionDesktopLtr: Story = { name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

