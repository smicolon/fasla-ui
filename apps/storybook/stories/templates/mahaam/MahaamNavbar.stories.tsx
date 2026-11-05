import type { Meta, StoryObj } from "@storybook/react"
import { MahaamNavbar } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-navbar"
import { localeOf, mahaamViewports, variant } from "./mahaam-story-kit"

/**
 * The Navbar of the Mahaam template. One story per Figma variant of the set
 * (Breakpoint × Direction), so each has its own link; the viewport and
 * direction toolbars still change any of them.
 */
const meta: Meta<typeof MahaamNavbar> = {
  title: "Templates/Mahaam/Navbar",
  component: MahaamNavbar,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  tags: ["autodocs"],
  render: (args, context) => <MahaamNavbar locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamNavbar>

export const DesktopLtr: Story = { name: "Desktop · LTR", ...variant("desktop", "ltr") }
export const TabletLtr: Story = { name: "Tablet · LTR", ...variant("tablet", "ltr") }
export const MobileLtr: Story = { name: "Mobile · LTR", ...variant("mobile", "ltr") }
export const DesktopRtl: Story = { name: "Desktop · RTL", ...variant("desktop", "rtl") }
export const TabletRtl: Story = { name: "Tablet · RTL", ...variant("tablet", "rtl") }
export const MobileRtl: Story = { name: "Mobile · RTL", ...variant("mobile", "rtl") }

/** The Mobile menu open: the links and Sign in, in the Sheet. */
export const MobileMenuOpen: Story = {
  name: "Mobile · LTR · Menu open",
  ...variant("mobile", "ltr"),
  args: { menuOpen: true },
}
