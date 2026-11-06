import type { Meta, StoryObj } from "@storybook/react"
import { MahaamPlans } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-plans"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"
import { sectionDocs } from "./mahaam-docs"

/**
 * Plans: A Monthly and Yearly switch over three plans: Free, Pro and Team, in that order on every breakpoint.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamPlans> = {
  title: "Templates/Mahaam/Plans",
  component: MahaamPlans,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["heading", "popular", "footnote"] },
    docs: {
      page: sectionDocs({
        what: "A Monthly and Yearly switch over three plans, Free, Pro and Team, in that order on every breakpoint.",
        item: "mahaam-plans",
        props: [
        ["heading / footnote", "string", "The heading and the line under the plans."],
        ["free / pro / team", "MahaamPlan", "Each plan's copy."],
        ["popular", "string", "The badge on Pro."],
        ["billing / defaultBilling", "\"monthly\" | \"yearly\"", "The switch, controlled or not. With `onBillingChange`."],
        ],
      }),
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamPlans locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamPlans>

/* Playground: the section as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }

/** Yearly chosen: the Pro price is $10 and Team $16, billed yearly. */
export const YearlyDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Desktop · LTR", ...variant("desktop", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Tablet · LTR", ...variant("tablet", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Mobile · LTR", ...variant("mobile", "ltr"), args: { defaultBilling: "yearly" } }
export const YearlyDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Desktop · RTL", ...variant("desktop", "rtl"), args: { defaultBilling: "yearly" } }
export const YearlyTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Tablet · RTL", ...variant("tablet", "rtl"), args: { defaultBilling: "yearly" } }
export const YearlyMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Yearly · Mobile · RTL", ...variant("mobile", "rtl"), args: { defaultBilling: "yearly" } }
