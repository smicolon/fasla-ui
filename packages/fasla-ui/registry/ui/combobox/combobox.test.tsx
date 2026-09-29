import { describe, it, expect } from "vitest"
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
