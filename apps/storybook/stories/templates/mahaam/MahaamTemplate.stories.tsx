import type { Meta, StoryObj } from "@storybook/react"
import { MahaamTemplate } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-template"
import { mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, motionOf, variant } from "./mahaam-story-kit"
import { overviewDocs } from "./mahaam-docs"

/**
 * The whole Mahaam template.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion toolbars set
 * it. The Final, Playing and Reduced motion stories, per breakpoint and direction, stay in the code
 * under the same ids, hidden from the sidebar, for the pixel-diff scripts and old links.
 */
const meta: Meta<typeof MahaamTemplate> = {
  // The id keeps the story links stable; the title puts the page first in the Mahaam group.
  id: "templates-mahaam-template",
  title: "Templates/Mahaam/Overview",
  component: MahaamTemplate,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    // Nothing on the template changes the preview but the toolbars, so there is no Controls panel.
    controls: { disable: true },
    docs: { page: overviewDocs() },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamTemplate locale={localeOf(context)} {...motionOf(context)} photos={mahaamPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamTemplate>

/* Playground: the whole template as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

/* Final: Every section held on Figma's still frame. */
export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true } }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true } }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true } }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true } }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true } }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true } }

/* Playing: Every section playing on its own. */
export const PlayingDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Reduced motion: What a visitor who asks for reduced motion sees: every section's finished frame. */
export const ReducedMotionDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

