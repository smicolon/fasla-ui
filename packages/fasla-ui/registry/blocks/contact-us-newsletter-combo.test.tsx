import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ContactUsNewsletterCombo, contactUsNewsletterComboCopy } from "./contact-us-newsletter-combo"

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []
const submit = (form: HTMLFormElement) => fireEvent.submit(form)
const forms = (container: HTMLElement) => [...container.querySelectorAll("form")] as HTMLFormElement[]

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("Newsletter Combo", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 per panel and two forms, in %s", (locale) => {
    const { container } = render(<ContactUsNewsletterCombo locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent).toBe(contactUsNewsletterComboCopy[locale].subscribeTitle)
    expect(container.querySelectorAll("h2")).toHaveLength(2)
    expect(forms(container)).toHaveLength(2)
  })

  it("has Arabic copy for every English string, written by the Arabic rules", () => {
    expect(Object.keys(contactUsNewsletterComboCopy.ar).sort()).toEqual(Object.keys(contactUsNewsletterComboCopy.en).sort())
    const arabic = strings(contactUsNewsletterComboCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d)–|–(?!\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("sets the newsletter on a dark band, the contact panel on card, and neither field has a visible label", () => {
    const { container } = render(<ContactUsNewsletterCombo />)
    expect(container.querySelector(".dark.bg-background")).toBeTruthy()
    expect(container.querySelector("[class*='bg-card']")).toBeTruthy()
    expect(container.querySelector("label")).toBeNull()
    expect(screen.getByPlaceholderText("you@company.com").getAttribute("aria-label")).toBe("Email for the dispatch")
    expect(screen.getByLabelText("Your name")).toBeTruthy()
    expect(screen.getByLabelText("Write your message").tagName).toBe("TEXTAREA")
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows no word %s on the label-less subscribe or contact emails, no asterisk, and both are still required", (locale, word) => {
    const { container } = render(<ContactUsNewsletterCombo locale={locale} />)
    expect(screen.queryAllByText(word)).toHaveLength(0)
    expect(container.textContent).not.toContain("*")
    expect(screen.getByPlaceholderText("you@company.com").getAttribute("aria-required")).toBe("true")
    expect(container.querySelector("input[name=name]")?.getAttribute("aria-required")).toBeNull()
  })

  it("refuses an invalid or empty address, shakes the field and shows the error line", () => {
    const onSubscribe = vi.fn()
    const animate = vi.fn(() => ({ cancel() {} }))
    HTMLElement.prototype.animate = animate as never
    const { container } = render(<ContactUsNewsletterCombo onSubscribe={onSubscribe} />)
    const form = forms(container)[0]!
    submit(form)
    expect(screen.getAllByRole("alert")[0]!.textContent).toBe("This field is required.")
    fireEvent.change(screen.getByPlaceholderText("you@company.com"), { target: { value: "nope" } })
    submit(form)
    expect(screen.getAllByRole("alert")[0]!.textContent).toBe("Enter a valid email address.")
    expect(onSubscribe).not.toHaveBeenCalled()
    const shake = animate.mock.calls.find((call) => JSON.stringify((call as unknown[])[0]).includes("translateX(-4px)")) as unknown[] | undefined
    expect(shake).toBeTruthy()
    expect((shake![1] as { duration: number }).duration).toBe(120)
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })

  it("does not shake when the reader prefers reduced motion", () => {
    const animate = vi.fn(() => ({ cancel() {} }))
    HTMLElement.prototype.animate = animate as never
    const match = window.matchMedia
    window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} })) as never
    const { container } = render(<ContactUsNewsletterCombo />)
    submit(forms(container)[0]!)
    expect(animate).not.toHaveBeenCalled()
    window.matchMedia = match
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })

  it("subscribes with the email, shows the pill, then settles into a quiet line after 2s", async () => {
    const onSubscribe = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsNewsletterCombo onSubscribe={onSubscribe} />)
    fireEvent.change(screen.getByPlaceholderText("you@company.com"), { target: { value: "  sara@company.com " } })
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    submit(forms(container)[0]!)
    await act(async () => {
      await Promise.resolve()
    })
    expect(onSubscribe).toHaveBeenCalledWith({ email: "sara@company.com" })
    expect(screen.getByText("You are in")).toBeTruthy()
    expect(screen.queryByPlaceholderText("you@company.com")).toBeNull()
    await act(async () => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.queryByText("You are in")).toBeNull()
    expect(screen.getByText("Watch your inbox for the next issue.")).toBeTruthy()
  })

  it("shows the error line, in both languages, when subscribing fails", async () => {
    for (const locale of ["en", "ar"] as const) {
      const { container } = render(<ContactUsNewsletterCombo locale={locale} onSubscribe={vi.fn().mockRejectedValue(new Error("no"))} />)
      fireEvent.change(screen.getByPlaceholderText("you@company.com"), { target: { value: "sara@company.com" } })
      submit(forms(container)[0]!)
      await waitFor(() => expect(screen.getAllByRole("alert")[0]!.textContent).toBe(contactUsNewsletterComboCopy[locale].subscribeError))
      cleanup()
    }
  })

  it("refuses an empty contact form, then sends name, email and message by name, and thanks the reader", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsNewsletterCombo onSubmit={onSubmit} />)
    const form = forms(container)[1]!
    submit(form)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(form.querySelector("[data-invalid]")).toBeTruthy()
    expect(screen.getByLabelText("Email address").getAttribute("aria-invalid")).toBe("true")
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Sara" } })
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "sara@company.com" } })
    fireEvent.change(screen.getByLabelText("Write your message"), { target: { value: "  Hello " } })
    submit(form)
    await waitFor(() => expect(screen.getAllByRole("status").length).toBeGreaterThan(0))
    expect(onSubmit).toHaveBeenCalledWith({ name: "Sara", email: "sara@company.com", message: "Hello" })
  })

  it("shows the send error in Arabic when onSubmit rejects", async () => {
    const { container } = render(<ContactUsNewsletterCombo locale="ar" onSubmit={vi.fn().mockRejectedValue(new Error("no"))} />)
    fireEvent.change(screen.getByLabelText("البريد الإلكتروني", { selector: "input[name=email]" }), { target: { value: "sara@company.com" } })
    submit(forms(container)[1]!)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(contactUsNewsletterComboCopy.ar.error))
  })

  it("sets the buttons as Solid Secondary and Solid Primary, and flips the directional glyphs in RTL", () => {
    const { container } = render(<ContactUsNewsletterCombo />)
    expect(screen.getByRole("button", { name: "Subscribe" }).className).toContain("bg-secondary")
    expect(screen.getByRole("button", { name: "Send message" }).className).toContain("bg-primary")
    expect(container.querySelector("svg.lucide-megaphone")?.getAttribute("class")).toContain("rtl:-scale-x-100")
    expect(container.querySelector("svg.lucide-send")?.getAttribute("class")).toContain("rtl:-scale-x-100")
  })

  it("lays the panels out side by side from Tablet and stacks them on Mobile, newsletter first", () => {
    const { container } = render(<ContactUsNewsletterCombo />)
    const wrap = container.querySelector("section > div > div")!
    expect(wrap.className).toContain("flex-col")
    expect(wrap.className).toContain("[@container(min-width:40rem)]:flex-row")
    expect(wrap.children[0]!.querySelector("h2")?.textContent).toBe("The Fasla dispatch")
  })

  it("raises each panel 4px on hover for a pointer, when motion is welcome", () => {
    const { container } = render(<ContactUsNewsletterCombo />)
    const wrap = container.querySelector("section > div > div")!
    for (const panel of [...wrap.children]) {
      expect(panel.className).toContain("hover:motion-safe:-translate-y-1")
      expect(panel.className).toContain("hover:motion-safe:shadow-md")
    }
  })

  it("shows the proof line with initials from a name, in both languages", () => {
    const { rerender } = render(<ContactUsNewsletterCombo />)
    expect(screen.getByText("Joined by 4,200 designers and engineers")).toBeTruthy()
    expect(document.querySelector("[data-slot=avatar]")?.textContent).toMatch(/^AR/)
    rerender(<ContactUsNewsletterCombo locale="ar" />)
    expect(screen.getByText("انضم إليها 4,200 مصمم ومهندس")).toBeTruthy()
  })
})
