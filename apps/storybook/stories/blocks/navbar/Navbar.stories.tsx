import type { Meta, StoryObj } from "@storybook/react"
import { NavbarDefault, navbarDefaultCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-default/NavbarDefault"
import { NavbarWithDropdown, navbarWithDropdownCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-dropdown/NavbarWithDropdown"
import { NavbarWithIconIndicatorAvatar, navbarWithIconIndicatorAvatarCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-icon-indicator-avatar/NavbarWithIconIndicatorAvatar"
import { NavbarWithCenteredLogo, navbarWithCenteredLogoCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-centered-logo/NavbarWithCenteredLogo"
import { NavbarWithCtaButton, navbarWithCtaButtonCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-cta-button/NavbarWithCtaButton"
import { NavbarWithSubmenu, navbarWithSubmenuCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-submenu/NavbarWithSubmenu"
import { NavbarRounded, navbarRoundedCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-rounded/NavbarRounded"
import { NavbarWithSearchInput, navbarWithSearchInputCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-with-search-input/NavbarWithSearchInput"
import { NavbarMultipleIcon, navbarMultipleIconCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-multiple-icon/NavbarMultipleIcon"
import { NavbarMultipleAction, navbarMultipleActionCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-multiple-action/NavbarMultipleAction"
import { NavbarExtendedAtTop, navbarExtendedAtTopCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-extended-at-top/NavbarExtendedAtTop"
import { NavbarSmall, navbarSmallCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-small/NavbarSmall"
import { NavbarRoundedSmall, navbarRoundedSmallCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-rounded-small/NavbarRoundedSmall"
import { NavbarCenteredFloating, navbarCenteredFloatingCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-centered-floating/NavbarCenteredFloating"
import { NavbarActiveActionWithBorder, navbarActiveActionWithBorderCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-active-action-with-border/NavbarActiveActionWithBorder"
import { NavbarActiveActionWithRound, navbarActiveActionWithRoundCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-active-action-with-round/NavbarActiveActionWithRound"
import { NavbarECommerce, navbarECommerceCopy } from "../../../../../packages/fasla-ui/registry/blocks/navbar-e-commerce/NavbarECommerce"
import { NavbarStage, navbarExample } from "../../../../docs/components/blocks/navbar-examples"
import { localeOf, navbarArgTypes, navbarViewports } from "./navbar-story-kit"

/**
 * Navbar: the 17 Types of the Figma set, one block each. Seven are a site's
 * full-width bar, four float as a pill or a panel, and six are built around an
 * app or a shop. Each sits on a strip of `muted` page, so the floating ones
 * read as pills. Viewport, direction and theme come from the toolbar: at the
 * Mobile viewport the links move into the Sheet behind the menu button.
 */

/*
 * The sidebar and the Docs page list the 17 Figma Types only. The open-menu
 * state is tagged `!dev` and `!autodocs`: hidden from both, but still built,
 * so tests and visual checks reach it by id. The tags are written out on the
 * story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Navbar",
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: navbarViewports },
    // The examples pass a logo element; the source panel shows the story's code instead of a serialised tree.
    docs: { source: { type: "code" } },
  },
  tags: ["autodocs"],
}

export default meta

type StoryContext = { globals: { direction?: string } }

/** The language from the toolbar, plus the example's logo and photo (shared with the docs site). */
const example = (slug: string, context: StoryContext) => ({ locale: localeOf(context), ...navbarExample(slug) })

export const Default: StoryObj<typeof NavbarDefault> = {
  name: "Default",
  argTypes: navbarArgTypes(NavbarDefault, navbarDefaultCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-default" short>
      <NavbarDefault {...example("navbar-default", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithDropdown: StoryObj<typeof NavbarWithDropdown> = {
  name: "With Dropdown",
  argTypes: navbarArgTypes(NavbarWithDropdown, navbarWithDropdownCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-dropdown" short>
      <NavbarWithDropdown {...example("navbar-with-dropdown", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithIconIndicatorAvatar: StoryObj<typeof NavbarWithIconIndicatorAvatar> = {
  name: "With Icon Indicator & Avatar",
  argTypes: navbarArgTypes(NavbarWithIconIndicatorAvatar, navbarWithIconIndicatorAvatarCopy, ["accountName"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-icon-indicator-avatar" short>
      <NavbarWithIconIndicatorAvatar {...example("navbar-with-icon-indicator-avatar", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithCenteredLogo: StoryObj<typeof NavbarWithCenteredLogo> = {
  name: "With Centered Logo",
  argTypes: navbarArgTypes(NavbarWithCenteredLogo, navbarWithCenteredLogoCopy, ["accountName"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-centered-logo" short>
      <NavbarWithCenteredLogo {...example("navbar-with-centered-logo", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithCtaButton: StoryObj<typeof NavbarWithCtaButton> = {
  name: "With CTA Button",
  argTypes: navbarArgTypes(NavbarWithCtaButton, navbarWithCtaButtonCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-cta-button" short>
      <NavbarWithCtaButton {...example("navbar-with-cta-button", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithSubmenu: StoryObj<typeof NavbarWithSubmenu> = {
  name: "With Submenu",
  argTypes: navbarArgTypes(NavbarWithSubmenu, navbarWithSubmenuCopy, ["accountName"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-submenu" short>
      <NavbarWithSubmenu {...example("navbar-with-submenu", context)} {...args} />
    </NavbarStage>
  ),
}

export const Rounded: StoryObj<typeof NavbarRounded> = {
  name: "Rounded",
  argTypes: navbarArgTypes(NavbarRounded, navbarRoundedCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-rounded" short>
      <NavbarRounded {...example("navbar-rounded", context)} {...args} />
    </NavbarStage>
  ),
}

export const WithSearchInput: StoryObj<typeof NavbarWithSearchInput> = {
  name: "With Search Input",
  argTypes: navbarArgTypes(NavbarWithSearchInput, navbarWithSearchInputCopy, ["accountName"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-with-search-input" short>
      <NavbarWithSearchInput {...example("navbar-with-search-input", context)} {...args} />
    </NavbarStage>
  ),
}

export const MultipleIcon: StoryObj<typeof NavbarMultipleIcon> = {
  name: "Multiple Icon",
  argTypes: navbarArgTypes(NavbarMultipleIcon, navbarMultipleIconCopy, ["messagesLabel"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-multiple-icon" short>
      <NavbarMultipleIcon {...example("navbar-multiple-icon", context)} {...args} />
    </NavbarStage>
  ),
}

export const MultipleAction: StoryObj<typeof NavbarMultipleAction> = {
  name: "Multiple Action",
  argTypes: navbarArgTypes(NavbarMultipleAction, navbarMultipleActionCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-multiple-action" short>
      <NavbarMultipleAction {...example("navbar-multiple-action", context)} {...args} />
    </NavbarStage>
  ),
}

export const ExtendedAtTop: StoryObj<typeof NavbarExtendedAtTop> = {
  name: "Extended at Top",
  argTypes: navbarArgTypes(NavbarExtendedAtTop, navbarExtendedAtTopCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-extended-at-top" short>
      <NavbarExtendedAtTop {...example("navbar-extended-at-top", context)} {...args} />
    </NavbarStage>
  ),
}

export const Small: StoryObj<typeof NavbarSmall> = {
  name: "Small",
  argTypes: navbarArgTypes(NavbarSmall, navbarSmallCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-small" short>
      <NavbarSmall {...example("navbar-small", context)} {...args} />
    </NavbarStage>
  ),
}

export const RoundedSmall: StoryObj<typeof NavbarRoundedSmall> = {
  name: "Rounded Small",
  argTypes: navbarArgTypes(NavbarRoundedSmall, navbarRoundedSmallCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-rounded-small" short>
      <NavbarRoundedSmall {...example("navbar-rounded-small", context)} {...args} />
    </NavbarStage>
  ),
}

export const CenteredFloating: StoryObj<typeof NavbarCenteredFloating> = {
  name: "Centered Floating",
  argTypes: navbarArgTypes(NavbarCenteredFloating, navbarCenteredFloatingCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-centered-floating" short>
      <NavbarCenteredFloating {...example("navbar-centered-floating", context)} {...args} />
    </NavbarStage>
  ),
}

export const ActiveActionWithBorder: StoryObj<typeof NavbarActiveActionWithBorder> = {
  name: "Active Action with Border",
  argTypes: navbarArgTypes(NavbarActiveActionWithBorder, navbarActiveActionWithBorderCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-active-action-with-border" short>
      <NavbarActiveActionWithBorder {...example("navbar-active-action-with-border", context)} {...args} />
    </NavbarStage>
  ),
}

export const ActiveActionWithRound: StoryObj<typeof NavbarActiveActionWithRound> = {
  name: "Active Action with Round",
  argTypes: navbarArgTypes(NavbarActiveActionWithRound, navbarActiveActionWithRoundCopy),
  render: (args, context) => (
    <NavbarStage slug="navbar-active-action-with-round" short>
      <NavbarActiveActionWithRound {...example("navbar-active-action-with-round", context)} {...args} />
    </NavbarStage>
  ),
}

export const ECommerce: StoryObj<typeof NavbarECommerce> = {
  name: "E-commerce",
  argTypes: navbarArgTypes(NavbarECommerce, navbarECommerceCopy, ["accountName", "homeLabel", "wishlistLabel", "cartLabel"]),
  render: (args, context) => (
    <NavbarStage slug="navbar-e-commerce" short>
      <NavbarECommerce {...example("navbar-e-commerce", context)} {...args} />
    </NavbarStage>
  ),
}

/** Default with its Sheet open: what the menu button shows at the Mobile viewport. */
export const DefaultMenuOpen: StoryObj<typeof NavbarDefault> = {
  name: "Default: menu open",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <NavbarStage slug="navbar-default" short>
      <NavbarDefault {...example("navbar-default", context)} menuOpen {...args} />
    </NavbarStage>
  ),
}
