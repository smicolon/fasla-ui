import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pagination } from "./DataTable"

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
