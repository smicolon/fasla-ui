import { describe, expect, test } from "bun:test"
import { tocLabel } from "../components/docs-toc"

describe("On this page labels", () => {
  // The heading keeps its term's English in parentheses; the menu shows Arabic only.
  test("drops a Latin parenthetical from an Arabic heading", () => {
    expect(tocLabel("الأنماط (variant)")).toBe("الأنماط")
    expect(tocLabel("إتاحة الوصول (accessibility)")).toBe("إتاحة الوصول")
    expect(tocLabel("الخصائص (props)")).toBe("الخصائص")
  })

  test("leaves Arabic-only and English headings as they are", () => {
    expect(tocLabel("الأحجام")).toBe("الأحجام")
    expect(tocLabel("Accessibility (keyboard)")).toBe("Accessibility (keyboard)")
  })
})
