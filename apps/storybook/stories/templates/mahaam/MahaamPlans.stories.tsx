import type { Meta, StoryObj } from "@storybook/react"
import { MahaamPlans } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-plans"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * The per-state stories of the Mahaam plans: Final, Playing, Paused and Reduced motion, per breakpoint
 * and direction. They are tagged `!dev` and `!autodocs`, so the sidebar and the Docs page do not list
 * them, but they stay under the same ids for the pixel-diff scripts and old links. The story people
 * read is `Plans` in Mahaam.stories.tsx.
 */
const meta: Meta<typeof MahaamPlans> = {
  // The id keeps the story ids stable; the title keeps these out of the visible Templates / Mahaam page.
  id: "templates-mahaam-plans",
  title: "Templates/Mahaam States/Plans",
  component: MahaamPlans,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  render: (args, context) => <MahaamPlans locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamPlans>

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
