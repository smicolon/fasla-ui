import type { Meta, StoryObj } from "@storybook/react"
import { MahaamHero } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-hero"
import { mahaamHeroPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, motionOf, variant } from "./mahaam-story-kit"

/**
 * The per-state stories of the Mahaam hero: Final, Playing, Paused and Reduced motion, per breakpoint
 * and direction. They are tagged `!dev` and `!autodocs`, so the sidebar and the Docs page do not list
 * them, but they stay under the same ids for the pixel-diff scripts and old links. The story people
 * read is `Hero` in Mahaam.stories.tsx.
 */
const meta: Meta<typeof MahaamHero> = {
  // The id keeps the story ids stable; the title keeps these out of the visible Templates / Mahaam page.
  id: "templates-mahaam-hero",
  title: "Templates/Mahaam States/Hero",
  component: MahaamHero,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  render: (args, context) => <MahaamHero locale={localeOf(context)} {...motionOf(context)} {...mahaamHeroPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamHero>

/* Final: The finished frame, as Figma draws it: the voice note typed, the three blocks in their slots, the first sub-task ticked, nothing moving. The animation is held on this frame with `still`, as Figma draws it. */
export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true, frame: 170 } }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true, frame: 170 } }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true, frame: 170 } }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true, frame: 170 } }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true, frame: 170 } }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true, frame: 170 } }

/* Playing: The loop on its own: 200 frames of 60ms, then it starts again. It plays only while the section is on screen. */
export const PlayingDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Paused: Frozen mid-run, at frame 80: the voice note is typed and two blocks have landed, the third is on its way. The state `paused` leaves the section in. */
export const PausedDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { defaultPaused: true, frame: 80 } }
export const PausedTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { defaultPaused: true, frame: 80 } }
export const PausedMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { defaultPaused: true, frame: 80 } }
export const PausedMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Paused · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { defaultPaused: true, frame: 80 } }

/* Reduced motion: What a visitor who asks for reduced motion sees: the finished frame, no animation. */
export const ReducedMotionDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

