import { describe, it, expect, beforeAll } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Combobox } from "./combobox"

const options = [
  { value: "riyadh", label: "Riyadh" },
  { value: "jeddah", label: "Jeddah" },
]

describe("Combobox text", () => {
  it("keeps its English defaults when no text props are passed", () => {
    render(<Combobox options={options} value={["riyadh"]} multiple loading />)

    expect(screen.getByRole("button", { name: "Open" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Remove Riyadh" })).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Open" }))
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy()
    expect(screen.getByText("Loading...")).toBeTruthy()
  })

  it("uses the loading, toggle and remove text it is given", () => {
    render(
      <Combobox
        options={options}
        value={["riyadh"]}
        multiple
        loading
        loadingText="جارٍ التحميل"
        openLabel="فتح القائمة"
        closeLabel="إغلاق القائمة"
        removeLabel={(label) => `إزالة ${label}`}
      />
    )

    expect(screen.getByRole("button", { name: "فتح القائمة" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "إزالة Riyadh" })).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "فتح القائمة" }))
    expect(screen.getByRole("button", { name: "إغلاق القائمة" })).toBeTruthy()
    expect(screen.getByText("جارٍ التحميل")).toBeTruthy()
  })
})

describe("Combobox highlight", () => {
  // The highlighted option is scrolled into view, which jsdom does not implement
  beforeAll(() => {
    Element.prototype.scrollIntoView ??= () => {}
  })

  it("moves back to the first option when the search changes", () => {
    const cities = [...options, { value: "dammam", label: "Dammam" }]
    render(<Combobox options={cities} />)
    const input = screen.getByRole("combobox")

    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(screen.getByRole("option", { name: "Dammam" })).toHaveAttribute("data-highlighted", "true")

    fireEvent.change(input, { target: { value: "a" } })
    expect(screen.getByRole("option", { name: "Riyadh" })).toHaveAttribute("data-highlighted", "true")
    expect(screen.getByRole("option", { name: "Dammam" })).toHaveAttribute("data-highlighted", "false")
  })

  it("quotes the search in the create option", () => {
    render(<Combobox options={options} creatable onCreate={() => {}} />)
    const input = screen.getByRole("combobox")
    fireEvent.change(input, { target: { value: "Mecca" } })
    expect(screen.getByRole("option").textContent).toBe('Create "Mecca"')
  })
})

describe("Combobox ARIA", () => {
  const cities = [
    { value: "riyadh", label: "Riyadh" },
    { value: "jeddah", label: "Jeddah" },
  ]

  it("points the open input at its listbox with aria-controls, and drops it when closed", () => {
    render(<Combobox options={cities} />)
    const input = screen.getByRole("combobox")
    expect(input).not.toHaveAttribute("aria-controls")
    fireEvent.focus(input)
    const id = input.getAttribute("aria-controls")
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).toHaveAttribute("role", "listbox")
  })

  it("marks every option's selection, the create option included", () => {
    render(<Combobox options={cities} creatable onCreate={() => {}} />)
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Mecca" } })
    for (const option of screen.getAllByRole("option")) expect(option).toHaveAttribute("aria-selected")
    expect(screen.getByRole("option", { name: 'Create "Mecca"' })).toHaveAttribute("aria-selected", "false")
  })
})
