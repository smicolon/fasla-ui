import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFaq } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-faq"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * FAQ of the Mahaam template. One story per breakpoint and direction, so
 * each has its own link; the viewport and direction toolbars still change any
 * of them. Nothing here loops, so there is no motion state.
 */
const meta: Meta<typeof MahaamFaq> = {
  title: "Templates/Mahaam/FAQ",
  component: MahaamFaq,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { exclude: ["ctaHref", "defaultValue", "eyebrow", "heading", "description", "cta", "items", "empty"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamFaq locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFaq>

export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }
