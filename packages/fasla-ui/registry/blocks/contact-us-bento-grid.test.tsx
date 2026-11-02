import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ContactUsBentoGrid, contactUsBentoGridCopy } from "./contact-us-bento-grid"

// jsdom has no layout, so Figma's sizes were measured in a browser. These
// assert the contract around them: the copy, the form, the links, the Arabic rules.

const field = (label: string) => screen.getByLabelText(label)
const submit = (container: HTMLElement) => fireEvent.submit(container.querySelector("form")!)
const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])

describe("Bento Grid", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 and a form, in %s", (locale) => {
    const { container } = render(<ContactUsBentoGrid locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent?.trim()).toBeTruthy()
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("has the same copy keys in English and Arabic", () => {
    expect(Object.keys(contactUsBentoGridCopy.ar).sort()).toEqual(Object.keys(contactUsBentoGridCopy.en).sort())
  })

  it("keeps the Arabic copy to the rules: no middle dot, no dash outside digits, Western digits, no percent sign", () => {
    for (const text of strings(contactUsBentoGridCopy.ar)) {
      expect(text).not.toMatch(/·|•/)
      expect(text).not.toMatch(/[—–]/)
      expect(text).not.toMatch(/[٠-٩۰-۹]/)
      expect(text).not.toMatch(/[%٪]/)
      expect(text).not.toMatch(/\([A-Za-z]/)
    }
    expect(contactUsBentoGridCopy.ar.replyDetail).toContain("90")
  })

  it("refuses an empty send, naming the email, and sends nothing", () => {
    const onSubmit = vi.fn()
    const { container } = render(<ContactUsBentoGrid onSubmit={onSubmit} />)
    submit(container)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(field("Email").getAttribute("aria-invalid")).toBe("true")
    expect(container.querySelectorAll("[data-contact-field][data-invalid]").length).toBe(1)
  })

  it("sends name, email and message by name, then thanks the reader", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsBentoGrid onSubmit={onSubmit} />)
    fireEvent.change(field("Name"), { target: { value: "Sara" } })
    fireEvent.change(field("Email"), { target: { value: "sara@company.com" } })
    fireEvent.change(field("Message"), { target: { value: "  Hello  " } })
    submit(container)
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    expect(onSubmit).toHaveBeenCalledWith({ name: "Sara", email: "sara@company.com", message: "Hello" })
  })

  it("shows the send error in Arabic when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("no"))
    const { container } = render(<ContactUsBentoGrid locale="ar" onSubmit={onSubmit} />)
    fireEvent.change(field("البريد الإلكتروني"), { target: { value: "sara@company.com" } })
    submit(container)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(contactUsBentoGridCopy.ar.error))
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows the word %s on the email field only, and no asterisk anywhere", (locale, word) => {
    const { container } = render(<ContactUsBentoGrid locale={locale} />)
    expect(screen.getAllByText(word)).toHaveLength(1)
    expect(container.textContent).not.toContain("*")
    expect(container.querySelectorAll("[aria-required=true]")).toHaveLength(1)
  })

  it("counts the minutes from the reply figure, with Western digits, and names the final figure for assistive technology", () => {
    const { container, rerender } = render(<ContactUsBentoGrid replyMinutes={2} />)
    expect(container.textContent).toContain("2 m")
    rerender(<ContactUsBentoGrid locale="ar" replyMinutes={2} />)
    expect(container.textContent).toContain("2 د")
    expect(container.querySelector(".sr-only")?.textContent).toBe("2 د")
  })

  it("links the four marks and the roles button, and names each mark", () => {
    render(<ContactUsBentoGrid rolesHref="/careers" socialLinks={{ instagram: "https://instagram.com/fasla", x: "https://x.com/fasla" }} />)
    expect(screen.getByRole("link", { name: "Instagram" }).getAttribute("href")).toBe("https://instagram.com/fasla")
    expect(screen.getByRole("link", { name: "X" }).getAttribute("href")).toBe("https://x.com/fasla")
    expect(screen.getByRole("link", { name: "LinkedIn" }).getAttribute("href")).toBe("#")
    expect(screen.getByRole("link", { name: "Dribbble" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "See roles" }).getAttribute("href")).toBe("/careers")
  })

  it("rises the five tiles 80ms apart, and pulses the dot twice and no more", () => {
    const { container } = render(<ContactUsBentoGrid />)
    const delays = [...container.querySelectorAll("[data-reveal=rise]")].map((node) => node.getAttribute("data-reveal-delay"))
    expect(delays).toEqual(["0", "80", "160", "240", "320"])
    const pulse = container.querySelector("[class*=animate-]")!
    expect(pulse.className).toMatch(/animate-\[ping_[^\]]*_2_both\]/)
    expect(pulse.className).toContain("motion-safe:")
  })

  it("puts the response tile on the opposite theme", () => {
    const { container } = render(<ContactUsBentoGrid />)
    expect(container.querySelector(".dark")?.textContent).toContain("MEDIAN FIRST REPLY")
  })
})
