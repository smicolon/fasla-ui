import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ContactUsFormWithFaq, contactUsFormWithFaqCopy, matchContactUsFaqs } from "./contact-us-form-with-faq"

// jsdom has no layout: Figma's sizes and the container-query layouts were
// measured in a browser. These assert the contract around them.

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []
const submit = (container: HTMLElement) => fireEvent.submit(container.querySelector("form")!)
const rowButtons = () => screen.getAllByRole("button", { expanded: false }).filter((b) => b.closest("h3"))

describe("Form with FAQ", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 and a form, in %s", (locale) => {
    const { container } = render(<ContactUsFormWithFaq locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent).toBe(contactUsFormWithFaqCopy[locale].heading)
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("has Arabic copy for every English key, five questions each with an answer and keywords", () => {
    const { en, ar } = contactUsFormWithFaqCopy
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort())
    for (const copy of [en, ar]) {
      expect(copy.faqs).toHaveLength(5)
      for (const faq of copy.faqs) {
        expect(faq.answer.length).toBeGreaterThan(20)
        expect(faq.keywords.length).toBeGreaterThan(0)
      }
    }
    expect(ar.topics.map((t) => t.value)).toEqual(en.topics.map((t) => t.value))
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsFormWithFaqCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s)–|–(?!\s\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("asks only for the email, and sends nothing while it is empty", () => {
    const onSubmit = vi.fn()
    const { container } = render(<ContactUsFormWithFaq onSubmit={onSubmit} />)
    submit(container)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(container.querySelectorAll("[data-contact-field][data-invalid]")).toHaveLength(1)
    expect(screen.getByPlaceholderText("sara@company.com").getAttribute("aria-invalid")).toBe("true")
    for (const optional of ["Sara Al Mansouri", "What can we help with?"]) expect(screen.getByPlaceholderText(optional).getAttribute("aria-required")).toBeNull()
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows the word %s once, in the atom's Top Right label slot, and no asterisk", (locale, word) => {
    const { container } = render(<ContactUsFormWithFaq locale={locale} />)
    const words = screen.getAllByText(word)
    expect(words).toHaveLength(1)
    expect(words[0]!.getAttribute("data-slot")).toMatch(/label-end$/)
    expect(container.textContent).not.toContain("*")
  })

  it("holds the message group to 88px", () => {
    render(<ContactUsFormWithFaq />)
    expect(screen.getByPlaceholderText("What can we help with?").closest("[data-slot=textarea-field]")?.className).toContain("min-h-[88px]")
  })

  it("sends every field by name, then thanks the reader", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsFormWithFaq onSubmit={onSubmit} />)
    fireEvent.change(screen.getByPlaceholderText("Sara Al Mansouri"), { target: { value: "Sara" } })
    fireEvent.change(screen.getByPlaceholderText("sara@company.com"), { target: { value: "sara@company.com" } })
    fireEvent.change(screen.getByPlaceholderText("What can we help with?"), { target: { value: "  Hello  " } })
    fireEvent.click(screen.getByLabelText("Send me a copy of this message."))
    submit(container)
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    expect(onSubmit.mock.calls[0]![0]).toEqual({ name: "Sara", email: "sara@company.com", topic: "", message: "Hello", copy: true })
  })

  it("shows the send error in Arabic too, when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("no"))
    const { container } = render(<ContactUsFormWithFaq locale="ar" onSubmit={onSubmit} />)
    fireEvent.change(screen.getByPlaceholderText("sara@company.com"), { target: { value: "sara@company.com" } })
    submit(container)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(contactUsFormWithFaqCopy.ar.error))
  })

  it("makes each FAQ row a disclosure: a button with aria-expanded that opens its answer region", async () => {
    const user = userEvent.setup()
    render(<ContactUsFormWithFaq />)
    expect(rowButtons()).toHaveLength(5)
    const first = screen.getByRole("button", { name: /How long does a reply take/ })
    expect(first.getAttribute("aria-expanded")).toBe("false")
    const panel = document.getElementById(first.getAttribute("aria-controls")!)!
    expect(panel.getAttribute("role")).toBe("region")
    expect(panel.getAttribute("aria-labelledby")).toBe(first.id)
    expect(panel.className).toContain("grid-rows-[0fr]")
    expect(panel.className).toContain("duration-[260ms]")
    await user.click(first)
    expect(first.getAttribute("aria-expanded")).toBe("true")
    expect(panel.className).toContain("grid-rows-[1fr]")
    expect(first.querySelector("svg")!.getAttribute("class")).toContain("rotate-180")
    await user.click(first)
    expect(first.getAttribute("aria-expanded")).toBe("false")
  })

  it("is sticky with CSS only on Desktop, in one FAQ element placed by grid order", () => {
    const { container } = render(<ContactUsFormWithFaq />)
    const aside = container.querySelector("aside")!
    expect(container.querySelectorAll("aside")).toHaveLength(1)
    expect(aside.className).toContain("[@container(min-width:64rem)]:sticky")
    expect(aside.className).toContain("[@container(min-width:64rem)]:top-24")
    // Mobile: above the send button (order 3 before 4). Tablet: below the form (order 5).
    expect(aside.className).toContain("order-3")
    expect(aside.className).toContain("[@container(min-width:40rem)]:order-5")
    expect(container.querySelector("form")!.className).toContain("contents")
    expect(container.querySelector("button[type=submit]")!.closest(".order-4")).toBeTruthy()
  })

  it("points the help link where helpHref says", () => {
    render(<ContactUsFormWithFaq helpHref="/support" />)
    expect(screen.getByRole("link", { name: /Still stuck/ }).getAttribute("href")).toBe("/support")
  })

  it("nudges the rows the message matches, with a chip, and never blocks sending", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsFormWithFaq onSubmit={onSubmit} />)
    expect(screen.queryByText("Might this help?")).toBeNull()
    fireEvent.change(screen.getByPlaceholderText("What can we help with?"), { target: { value: "I need an invoice for last month" } })
    const chips = screen.getAllByText("Might this help?")
    expect(chips).toHaveLength(1)
    const row = chips[0]!.closest("button")!
    expect(row.textContent).toContain("invoice in AED")
    expect(row.className).toContain("bg-muted")
    expect(row.className).toContain("duration-[260ms]")
    fireEvent.change(screen.getByPlaceholderText("What can we help with?"), { target: { value: "" } })
    expect(screen.queryByText("Might this help?")).toBeNull()
    // Sending still works while a row is nudged.
    fireEvent.change(screen.getByPlaceholderText("What can we help with?"), { target: { value: "invoice" } })
    fireEvent.change(screen.getByPlaceholderText("sara@company.com"), { target: { value: "sara@company.com" } })
    submit(container)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })

  it("nudges from the topic too, and in Arabic from Arabic words", async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ContactUsFormWithFaq />)
    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "Report a bug" }))
    expect(within(screen.getAllByText("Might this help?")[0]!.closest("button")!).getByText(/report a bug/i)).toBeTruthy()
    unmount()
    render(<ContactUsFormWithFaq locale="ar" />)
    fireEvent.change(screen.getByPlaceholderText("بماذا يمكننا مساعدتك؟"), { target: { value: "أريد فاتورة" } })
    expect(screen.getAllByText("هل يفيدك هذا؟")).toHaveLength(1)
  })

  it("matches keywords case-insensitively and ignores very short input", () => {
    const { faqs } = contactUsFormWithFaqCopy.en
    expect([...matchContactUsFaqs(faqs, "BUG")]).toEqual([3])
    expect(matchContactUsFaqs(faqs, "a").size).toBe(0)
    expect(matchContactUsFaqs(faqs, "hello there").size).toBe(0)
  })
})
