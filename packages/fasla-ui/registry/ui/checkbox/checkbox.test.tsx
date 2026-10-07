import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Checkbox } from "./checkbox"

describe("Checkbox id", () => {
  it("uses the id it is given", () => {
    render(<Checkbox id="terms" label="Accept the terms" />)
    expect(screen.getByLabelText("Accept the terms").id).toBe("terms")
  })

  it("generates an id that ties the label to the input", () => {
    render(<Checkbox label="Accept the terms" />)
    expect(screen.getByLabelText("Accept the terms").id).not.toBe("")
  })

  it("keeps working when the id is added and removed between renders", () => {
    const { rerender } = render(<Checkbox label="Accept the terms" />)
    rerender(<Checkbox id="terms" label="Accept the terms" />)
    expect(screen.getByLabelText("Accept the terms").id).toBe("terms")
    rerender(<Checkbox label="Accept the terms" />)
    expect(screen.getByLabelText("Accept the terms").id).not.toBe("terms")
  })
})
