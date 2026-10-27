import { describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { NavbarLinks, NavbarMenu, NavbarNotifications } from "./navbar"
import { SocialIcon } from "../../ui/social-icons/social-icons"

const LINKS = [
  { label: "Home", href: "#home", current: true },
  { label: "Services", href: "#services" },
]

describe("Navbar parts", () => {
  it("marks the current link for assistive tech", () => {
    render(<NavbarLinks links={LINKS} indicator="dot" />)
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("link", { name: "Services" }).hasAttribute("aria-current")).toBe(false)
  })

  it("names the bell and its dot together", () => {
    const { rerender } = render(<NavbarNotifications label="Notifications" unreadLabel="New notifications" />)
    expect(screen.getByRole("button").textContent).toBe("NotificationsNew notifications")
    rerender(<NavbarNotifications label="Notifications" unreadLabel="New notifications" unread={false} />)
    expect(screen.getByRole("button").textContent).toBe("Notifications")
  })

  it("opens the Sheet with the links from the menu button, and a link closes it", () => {
    render(<NavbarMenu links={LINKS} label="Open menu" title="Menu" />)
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }))
    const sheet = screen.getByRole("dialog")
    expect(sheet.textContent).toContain("Services")
    fireEvent.click(screen.getByRole("link", { name: "Services" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})

describe("SocialIcon color=\"current\"", () => {
  it("draws Negative's shapes in the text colour", () => {
    const { container } = render(<SocialIcon platform="github" color="current" />)
    const shapes = container.querySelectorAll("svg *[class]")
    expect(shapes.length).toBeGreaterThan(0)
    for (const shape of shapes) expect(shape.getAttribute("class")).toBe("fill-current")
  })
})
