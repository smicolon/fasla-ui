import type { Meta, StoryObj } from "@storybook/react"
import { MahaamNavbar } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-navbar"
import { localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * The per-state stories of the Mahaam navbar: Final, Playing, Paused and Reduced motion, per breakpoint
 * and direction. They are tagged `!dev` and `!autodocs`, so the sidebar and the Docs page do not list
 * them, but they stay under the same ids for the pixel-diff scripts and old links. The story people
 * read is `Navbar` in Mahaam.stories.tsx.
 */
const meta: Meta<typeof MahaamNavbar> = {
  // The id keeps the story ids stable; the title keeps these out of the visible Templates / Mahaam page.
  id: "templates-mahaam-navbar",
  title: "Templates/Mahaam States/Navbar",
  component: MahaamNavbar,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  render: (args, context) => <MahaamNavbar locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamNavbar>

export const DesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Desktop · LTR", ...variant("desktop", "ltr") }
export const TabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Tablet · LTR", ...variant("tablet", "ltr") }
export const MobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Mobile · LTR", ...variant("mobile", "ltr") }
export const DesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Desktop · RTL", ...variant("desktop", "rtl") }
export const TabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Tablet · RTL", ...variant("tablet", "rtl") }
export const MobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Mobile · RTL", ...variant("mobile", "rtl") }

/** The Mobile menu open: the links and Sign in, in the Sheet. */
export const MobileMenuOpen: Story = {
  tags: ["!dev", "!autodocs"],
  name: "Mobile · LTR · Menu open",
  ...variant("mobile", "ltr"),
  args: { menuOpen: true },
}
