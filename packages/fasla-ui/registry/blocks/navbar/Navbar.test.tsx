import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { NavbarToggle } from "./Navbar"

describe("NavbarToggle", () => {
  it("tells assistive tech whether the menu is showing", () => {
    const { rerender } = render(<NavbarToggle />)
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false")
    rerender(<NavbarToggle open />)
    expect(screen.getByRole("button", { name: "Close menu" }).getAttribute("aria-expanded")).toBe("true")
  })
})
