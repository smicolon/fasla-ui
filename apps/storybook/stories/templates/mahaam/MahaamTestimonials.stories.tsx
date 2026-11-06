import type { Meta, StoryObj } from "@storybook/react"
import { MahaamTestimonials } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-testimonials"
import { mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * Testimonials: Three tinted cards stacked like a hand of cards, with arrows and dots. It does not autoplay: the stack changes only on a click.
 *
 * States. Final: the first card in front. Second card: the second in front. Reduced motion: a click changes the stack with no move.
 *
 * Props. The controls change the copy and the language. The rest are in the docs page's Props table.
 *
 * Stories. One per state, breakpoint and direction, so each has its own link; the viewport and direction toolbars still change any of them.
 *
 */
const meta: Meta<typeof MahaamTestimonials> = {
  title: "Templates/Mahaam/Testimonials",
  component: MahaamTestimonials,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["heading", "index", "locale", "className"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamTestimonials locale={localeOf(context)} {...mahaamPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamTestimonials>

/* Final: The finished frame, as Figma draws it, held with `still`. */
export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Second card: The stack after one step, with the second card in front. */
export const SecondCardDesktopLtr: Story = { name: "SecondCard · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { index: 1 } }
export const SecondCardDesktopRtl: Story = { name: "SecondCard · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { index: 1 } }
export const SecondCardTabletLtr: Story = { name: "SecondCard · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { index: 1 } }
export const SecondCardTabletRtl: Story = { name: "SecondCard · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { index: 1 } }
export const SecondCardMobileLtr: Story = { name: "SecondCard · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { index: 1 } }
export const SecondCardMobileRtl: Story = { name: "SecondCard · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { index: 1 } }

/* Reduced motion: The same stack; a click changes it with no move between the cards. */
export const ReducedMotionDesktopLtr: Story = { name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

