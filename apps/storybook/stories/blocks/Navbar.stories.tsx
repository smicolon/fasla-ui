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
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof Navbar> = {
  title: "Blocks/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Navbar>

/**
 * Sample copy, per script: the same store as the docs page. Only the rendered
 * text changes; the Arabic follows design/content/. The toggle's accessible
 * name follows the page's language through its aria-label.
 */
const COPY = {
  ltr: {
    brand: "My store",
    links: ["Home", "Products", "Offers", "About us"],
    signIn: "Sign in",
    login: "Log in",
    open: "Open menu",
    close: "Close menu",
  },
  rtl: {
    brand: "متجري",
    links: ["الرئيسية", "المنتجات", "العروض", "من نحن"],
    signIn: "تسجيل الدخول",
    login: "الدخول",
    open: "فتح القائمة",
    close: "إغلاق القائمة",
  },
}

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Navbar>
        <NavbarBrand>
          <span className="text-xl font-bold">{c.brand}</span>
        </NavbarBrand>
        <NavbarContent align="center">
          <NavbarMenu>
            {c.links.map((link, i) => (
              <NavbarLink key={link} href="#" active={i === 0}>
                {link}
              </NavbarLink>
            ))}
          </NavbarMenu>
        </NavbarContent>
        <NavbarContent align="end">
          <NavbarItem>
            <Button>{c.signIn}</Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    )
  },
}

export const WithMobileMenu: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [open, setOpen] = useState(false)
    const links = c.links.slice(0, 3)
    return (
      <div>
        <Navbar>
          <NavbarBrand>
            <span className="text-xl font-bold">{c.brand}</span>
          </NavbarBrand>
          <NavbarContent align="center">
            <NavbarMenu mobileMenu>
              {links.map((link, i) => (
                <NavbarLink key={link} href="#" active={i === 0}>
                  {link}
                </NavbarLink>
              ))}
            </NavbarMenu>
          </NavbarContent>
          <NavbarContent align="end">
            <NavbarToggle
              open={open}
              onClick={() => setOpen(!open)}
              aria-label={open ? c.close : c.open}
              aria-controls="navbar-story-menu"
            />
          </NavbarContent>
        </Navbar>
        {open && (
          <div id="navbar-story-menu" className="border-b bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {links.map((link, i) => (
                <a key={link} href="#" className={i === 0 ? "py-2 font-medium" : "py-2 text-muted-foreground"}>
                  {link}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    )
  },
}

export const NoBorder: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <Navbar bordered={false}>
        <NavbarBrand>
          <span className="text-xl font-bold">{c.brand}</span>
        </NavbarBrand>
        <NavbarContent align="end">
          <NavbarLink href="#">{c.login}</NavbarLink>
        </NavbarContent>
      </Navbar>
    )
  },
}
