import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { DataTable, Pagination } from "./DataTable"

describe("Pagination text", () => {
  it("keeps its English defaults", () => {
    render(<Pagination page={2} totalPages={5} onPageChange={() => {}} />)
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeTruthy()
    expect(screen.getByText("Page 2 of 5")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeTruthy()
    expect(screen.getByRole("button", { name: "Go to page 3" })).toBeTruthy()
  })

  it("uses the text it is given", () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        onPageChange={() => {}}
        labels={{
          pagination: "التنقّل بين الصفحات",
          status: (page, total) => `الصفحة ${page} من ${total}`,
          previous: "السابق",
          next: "التالي",
          goToPrevious: "الانتقال إلى الصفحة السابقة",
          goToNext: "الانتقال إلى الصفحة التالية",
          goToPage: (page) => `الانتقال إلى الصفحة ${page}`,
        }}
      />
    )
    expect(screen.getByRole("navigation", { name: "التنقّل بين الصفحات" })).toBeTruthy()
    expect(screen.getByText("الصفحة 2 من 5")).toBeTruthy()
    expect(screen.getByRole("button", { name: "الانتقال إلى الصفحة السابقة" }).textContent).toBe("السابق")
    expect(screen.getByRole("button", { name: "الانتقال إلى الصفحة 3" })).toBeTruthy()
  })
})

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
