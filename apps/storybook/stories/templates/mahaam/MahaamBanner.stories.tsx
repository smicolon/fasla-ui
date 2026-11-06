import type { Meta, StoryObj } from "@storybook/react"
import { MahaamBanner } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-banner"
import { label, localeOf, mahaamViewports, motionOf, variant } from "./mahaam-story-kit"
import { MOTION_PROPS, sectionDocs } from "./mahaam-docs"

/**
 * Banner: A bordered panel with a call to action and outline rings that pulse out from the waveform icon.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamBanner> = {
  title: "Templates/Mahaam/Banner",
  component: MahaamBanner,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["heading", "body", "primary", "secondary"] },
    docs: {
      page: sectionDocs({
        what: "A bordered panel with a call to action and outline rings that pulse out from the waveform icon.",
        item: "mahaam-banner",
        props: [
        ["heading / body", "string", "The copy."],
        ["primary / secondary", "string", "The two buttons."],
        ["primaryHref / secondaryHref", "string", "Where they go."],
        ["progress", "number", "Where in the 5-second ring loop it starts, 0 to 1."],
        ...MOTION_PROPS,
        ],
      }),
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamBanner locale={localeOf(context)} {...motionOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamBanner>

/* Playground: the section as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

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

