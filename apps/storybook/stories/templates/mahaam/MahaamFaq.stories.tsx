import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFaq } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-faq"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * The per-state stories of the Mahaam faq: Final, Playing, Paused and Reduced motion, per breakpoint
 * and direction. They are tagged `!dev` and `!autodocs`, so the sidebar and the Docs page do not list
 * them, but they stay under the same ids for the pixel-diff scripts and old links. The story people
 * read is `FAQ` in Mahaam.stories.tsx.
 */
const meta: Meta<typeof MahaamFaq> = {
  // The id keeps the story ids stable; the title keeps these out of the visible Templates / Mahaam page.
  id: "templates-mahaam-faq",
  title: "Templates/Mahaam States/FAQ",
  component: MahaamFaq,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  render: (args, context) => <MahaamFaq locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFaq>

export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }
