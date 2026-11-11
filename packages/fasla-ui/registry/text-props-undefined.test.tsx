import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Breadcrumb } from "./ui/breadcrumb"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"

/**
 * Every optional text prop added for translation falls back to its English
 * default when a caller passes it explicitly as undefined, as a translation
 * lookup that misses a key does.
 */
describe("text props passed as undefined keep their English default", () => {
  it("Breadcrumb", () => {
    render(<Breadcrumb aria-label={undefined} />)
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy()
  })

  it("Button", () => {
    render(<Button loading loadingLabel={undefined}>Save</Button>)
    expect(screen.getByText("Loading")).toBeTruthy()
  })

  it("Combobox", () => {
    render(
      <Combobox
        options={[]}
        loading
        loadingText={undefined}
        openLabel={undefined}
        closeLabel={undefined}
        removeLabel={undefined}
      />
    )
    expect(screen.getByRole("button", { name: "Open" })).toBeTruthy()
  })
})
