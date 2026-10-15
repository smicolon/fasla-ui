import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DataTable } from "./DataTable"

describe("DataTable column align", () => {
  const cellClass = (align?: "start" | "center" | "end" | "left" | "right") => {
    const { container, unmount } = render(
      <DataTable data={[{ id: 1 }]} columns={[{ id: "id", header: "ID", cell: (row) => row.id, align }]} getRowKey={(row) => row.id} />
    )
    const className = container.querySelector("td")!.className
    unmount()
    return className
  }

  it("defaults to the start of the reading direction", () => {
    expect(cellClass()).toContain("text-start")
  })

  it("maps start and end to logical sides", () => {
    expect(cellClass("start")).toContain("text-start")
    expect(cellClass("end")).toContain("text-end")
  })

  it("keeps left and right physical", () => {
    expect(cellClass("left")).toContain("text-left")
    expect(cellClass("right")).toContain("text-right")
  })
})
