import type { Meta, StoryObj } from "@storybook/react"
import { MahaamTestimonials } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-testimonials"
import { mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, motionOf, variant } from "./mahaam-story-kit"
import { sectionDocs } from "./mahaam-docs"

/**
 * Testimonials: Three tinted cards stacked like a hand of cards, with arrows and dots. It does not autoplay: the stack changes only on a click.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamTestimonials> = {
  title: "Templates/Mahaam/Testimonials",
  component: MahaamTestimonials,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["heading", "index"] },
    docs: {
      page: sectionDocs({
        what: "Three tinted cards stacked like a hand of cards. No autoplay: it changes only on the arrows and the dots, and the two back cards show only their colour.",
        item: "mahaam-testimonials",
        props: [
        ["heading", "string", "The heading."],
        ["items", "[Testimonial x 3]", "The three quotes."],
        ["labels", "object", "The arrows, dots and region names."],
        ["portraits", "object", "The three portraits. None ship."],
        ["index", "number", "Which card is in front, 0 to 2."],
        ["reducedMotion", "boolean", "Changes the stack with no move."],
        ],
      }),
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamTestimonials locale={localeOf(context)} reducedMotion={motionOf(context).reducedMotion} {...mahaamPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamTestimonials>

/* Playground: the section as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

/* Final: The finished frame, as Figma draws it, held with `still`. */
export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Second card: The stack after one step, with the second card in front. */
export const SecondCardDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { index: 1 } }
export const SecondCardDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { index: 1 } }
export const SecondCardTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { index: 1 } }
export const SecondCardTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { index: 1 } }
export const SecondCardMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { index: 1 } }
export const SecondCardMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "SecondCard · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { index: 1 } }

/* Reduced motion: The same stack; a click changes it with no move between the cards. */
export const ReducedMotionDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

