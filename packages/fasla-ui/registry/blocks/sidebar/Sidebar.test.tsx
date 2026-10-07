import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Sidebar, SidebarCollapseButton } from "./Sidebar"

describe("Sidebar onCollapsedChange", () => {
  it("is called when the collapse button inside it is pressed", () => {
    const onSidebarChange = vi.fn()
    const onButtonChange = vi.fn()
    render(
      <Sidebar onCollapsedChange={onSidebarChange}>
        <SidebarCollapseButton collapsed={false} onCollapsedChange={onButtonChange} />
      </Sidebar>
    )
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }))
    expect(onButtonChange).toHaveBeenCalledWith(true)
    expect(onSidebarChange).toHaveBeenCalledWith(true)
  })

  it("calls a handler given to both the sidebar and the button once", () => {
    const onChange = vi.fn()
    render(
      <Sidebar collapsed onCollapsedChange={onChange}>
        <SidebarCollapseButton collapsed onCollapsedChange={onChange} />
      </Sidebar>
    )
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it("is not passed to the aside", () => {
    const { container } = render(
      <Sidebar onCollapsedChange={() => {}}>
        <span />
      </Sidebar>
    )
    expect(container.querySelector("aside")?.getAttributeNames()).toEqual(["class"])
  })
})
