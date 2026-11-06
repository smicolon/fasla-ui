import type { Meta, StoryObj } from "@storybook/react"
import { MahaamNavbar } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-navbar"
import { localeOf, mahaamViewports, variant } from "./mahaam-story-kit"
import { sectionDocs } from "./mahaam-docs"

/**
 * Navbar: The brand, four links and two buttons. On Mobile the links move into a side menu.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamNavbar> = {
  title: "Templates/Mahaam/Navbar",
  component: MahaamNavbar,
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports }, controls: { include: ["brand", "signIn", "cta"] },
    docs: {
      page: sectionDocs({
        what: "The brand, four links and two buttons; on Mobile the links move into a side menu.",
        item: "mahaam-navbar",
        props: [
        ["brand", "string", "The wordmark."],
        ["links", "MahaamNavbarLink[]", "The four links."],
        ["signIn", "string", "The text button."],
        ["cta", "string", "The solid button."],
        ["labels", "object", "The menu button and sheet names."],
        ["homeHref / signInHref / ctaHref", "string", "Where the logo and the two buttons go."],
        ["menuOpen", "boolean", "Opens the Mobile menu. With `onMenuOpenChange`."],
        ],
      }),
    }, },
  tags: ["autodocs"],
  render: (args, context) => <MahaamNavbar locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamNavbar>

/* Playground: the section as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

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
