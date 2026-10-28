import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { AboutStoryPhotos, aboutStoryPhotosCopy } from "./AboutStoryPhotos"

describe("AboutStoryPhotos", () => {
  it("shows three cards at most, as Figma draws the row", () => {
    const [first] = aboutStoryPhotosCopy.en.items
    const items = Array.from({ length: 5 }, (_, index) => ({ ...first!, caption: `Card ${index + 1}` }))
    const { container } = render(<AboutStoryPhotos items={items} />)
    expect([...container.querySelectorAll("figcaption")].map((caption) => caption.textContent)).toEqual(["Card 1", "Card 2", "Card 3"])
  })
})
