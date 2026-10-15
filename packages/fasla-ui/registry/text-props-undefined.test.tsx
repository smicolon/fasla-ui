import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { EmptySearchResults, EmptyData } from "./blocks/empty-state"
import { PageHeader } from "./blocks/page-header/PageHeader"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"

/**
 * Every optional text prop added for translation falls back to its English
 * default when a caller passes it explicitly as undefined, as a translation
 * lookup that misses a key does.
 */
describe("text props passed as undefined keep their English default", () => {
  it("EmptySearchResults", () => {
    render(<EmptySearchResults query="linen" title={undefined} description={undefined} />)
    expect(screen.getByText("No results found")).toBeTruthy()
    expect(screen.getByText('No results for "linen". Try a different search term.')).toBeTruthy()
  })

  it("EmptyData", () => {
    render(<EmptyData resourceName="orders" title={undefined} description={undefined} />)
    expect(screen.getByText("No orders yet")).toBeTruthy()
    expect(screen.getByText("Get started by creating your first order.")).toBeTruthy()
  })

  it("PageHeader", () => {
    render(<PageHeader title="Orders" breadcrumb={<a href="/">Home</a>} breadcrumbLabel={undefined} />)
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
