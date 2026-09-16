import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarLink,
  NavbarMenu,
  NavbarToggle,
} from "../../../../packages/fasla-ui/registry/blocks/navbar"

const meta: Meta<typeof Navbar> = {
  title: "Blocks/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <span className="text-xl font-bold">Logo</span>
      </NavbarBrand>
      <NavbarContent align="center">
        <NavbarMenu>
          <NavbarLink href="#" active>Home</NavbarLink>
          <NavbarLink href="#">Features</NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">About</NavbarLink>
        </NavbarMenu>
      </NavbarContent>
      <NavbarContent align="end">
        <NavbarItem>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Sign In
          </button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  ),
}

export const WithMobileMenu: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <Navbar>
          <NavbarBrand>
            <span className="text-xl font-bold">Logo</span>
          </NavbarBrand>
          <NavbarContent align="center">
            <NavbarMenu mobileMenu>
              <NavbarLink href="#" active>Home</NavbarLink>
              <NavbarLink href="#">Features</NavbarLink>
              <NavbarLink href="#">Pricing</NavbarLink>
            </NavbarMenu>
          </NavbarContent>
          <NavbarContent align="end">
            <NavbarToggle open={open} onClick={() => setOpen(!open)} />
          </NavbarContent>
        </Navbar>
        {open && (
          <div className="border-b bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <a href="#" className="py-2 font-medium">Home</a>
              <a href="#" className="py-2 text-muted-foreground">Features</a>
              <a href="#" className="py-2 text-muted-foreground">Pricing</a>
            </nav>
          </div>
        )}
      </div>
    )
  },
}

export const NoBorder: Story = {
  render: () => (
    <Navbar bordered={false}>
      <NavbarBrand>
        <span className="text-xl font-bold">Logo</span>
      </NavbarBrand>
      <NavbarContent align="end">
        <NavbarLink href="#">Login</NavbarLink>
      </NavbarContent>
    </Navbar>
  ),
}
