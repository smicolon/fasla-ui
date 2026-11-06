import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFooter } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-footer"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * Footer: The brand with store buttons, three link columns, and the credits line.
 *
 * States. Final: Figma's footer. Nothing loops.
 *
 * Props. The controls change the copy and the language. The rest are in the docs page's Props table.
 *
 * Stories. One per state, breakpoint and direction, so each has its own link; the viewport and direction toolbars still change any of them.
 */
const meta: Meta<typeof MahaamFooter> = {
  title: "Templates/Mahaam/Footer",
  component: MahaamFooter,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["brand", "tagline", "note", "locale", "className"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamFooter locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFooter>

export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }
