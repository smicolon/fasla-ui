import type { Meta, StoryObj } from "@storybook/react"
import { MahaamPlans } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-plans"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * Plans of the Mahaam template. One story per breakpoint and direction, so
 * each has its own link; the viewport and direction toolbars still change any
 * of them. Nothing here loops, so there is no motion state.
 */
const meta: Meta<typeof MahaamPlans> = {
  title: "Templates/Mahaam/Plans",
  component: MahaamPlans,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { exclude: ["billing", "defaultBilling", "onBillingChange", "heading", "monthly", "yearly", "popular", "free", "pro", "team", "footnote", "switchLabel"] },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamPlans locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamPlans>

export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }

/** Yearly chosen: the Pro price is $10 and Team $16, billed yearly. */
export const YearlyDesktopLtr: Story = { name: "Yearly · Desktop · LTR", ...variant("desktop", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyTabletLtr: Story = { name: "Yearly · Tablet · LTR", ...variant("tablet", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyMobileLtr: Story = { name: "Yearly · Mobile · LTR", ...variant("mobile", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyDesktopRtl: Story = { name: "Yearly · Desktop · RTL", ...variant("desktop", "rtl"), args: { defaultBilling: "yearly" } }
export const YearlyTabletRtl: Story = { name: "Yearly · Tablet · RTL", ...variant("tablet", "rtl"), args: { defaultBilling: "yearly" } }
export const YearlyMobileRtl: Story = { name: "Yearly · Mobile · RTL", ...variant("mobile", "rtl"), args: { defaultBilling: "yearly" } }
