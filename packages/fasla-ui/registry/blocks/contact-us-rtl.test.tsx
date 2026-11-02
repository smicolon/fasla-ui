import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ContactUsFormContactMethods } from "./contact-us-form-contact-methods"
import { ContactUsGrandHeadlineForm } from "./contact-us-grand-headline-form"
import { ContactUsOversizedWordmark } from "./contact-us-oversized-wordmark"
import { ContactUsPhotoAndDarkPanel } from "./contact-us-photo-and-dark-panel"

// What these tests can and cannot prove: jsdom has no user-agent stylesheet, so it
// cannot show that a browser gives `type=tel` a left-to-right direction. They assert the
// fix instead: the phone field's group carries the rule that right-aligns its value and
// placeholder on an Arabic page, and nothing forces a direction on the input itself, so
// the digits keep their own left-to-right order. The alignment was measured in a browser.

const PHONE_BLOCKS = [
  ["Oversized Wordmark", ContactUsOversizedWordmark],
  ["Grand Headline Form", ContactUsGrandHeadlineForm],
  ["Form + Contact Methods", ContactUsFormContactMethods],
  ["Photo & Dark Panel", ContactUsPhotoAndDarkPanel],
] as const

describe.each(PHONE_BLOCKS)("%s phone field", (_name, Block) => {
  it.each(["en", "ar"] as const)("aligns to the start of the field in an RTL page and keeps its digits left to right, in %s", (locale) => {
    const { container } = render(
      <div dir={locale === "ar" ? "rtl" : "ltr"}>
        <Block locale={locale} />
      </div>
    )
    const phone = container.querySelector<HTMLInputElement>("input[type=tel]")!
    expect(phone).toBeTruthy()
    // Right-aligned in RTL only; in LTR the atom's own start alignment stays.
    expect(phone.closest("[data-slot=input-field]")?.className).toContain("rtl:[&_[data-slot=input]]:text-right")
    // No direction is forced on the input, so a number is never reversed by the page's direction.
    expect(phone.getAttribute("dir")).toBeNull()
    expect(phone.closest("[data-contact-field]")?.getAttribute("dir")).toBeNull()
  })

  it("leaves the email and text fields to the atom", () => {
    const { container } = render(<Block />)
    const email = container.querySelector("input[type=email]")
    if (email) expect(email.closest("[data-slot=input-field]")?.className).not.toContain("text-right")
  })
})

describe("Form + Contact Methods preferred date", () => {
  const trigger = () => document.querySelector<HTMLButtonElement>("[data-slot=date-picker-trigger]")!
  const calendar = () => document.querySelector("[data-slot=date-picker-content]")

  it("is the Date Picker atom, with the field's own placeholder", () => {
    render(<ContactUsFormContactMethods />)
    expect(trigger().getAttribute("data-slot")).toBe("date-picker-trigger")
    expect(trigger().textContent).toContain("dd/mm/yyyy")
    expect(document.querySelector("[data-slot=date-picker-icon]")).toBeTruthy()
  })

  it("opens on a click or tap of the field", async () => {
    render(<ContactUsFormContactMethods />)
    expect(calendar()).toBeNull()
    await act(async () => {
      fireEvent.click(trigger())
    })
    expect(calendar()).toBeTruthy()
  })

  it("opens with Enter or Space and closes with Escape", async () => {
    const user = userEvent.setup()
    render(<ContactUsFormContactMethods />)
    trigger().focus()
    await user.keyboard("{Enter}")
    await waitFor(() => expect(calendar()).toBeTruthy())
    await user.keyboard("{Escape}")
    await waitFor(() => expect(calendar()).toBeNull())
    trigger().focus()
    await user.keyboard(" ")
    await waitFor(() => expect(calendar()).toBeTruthy())
  })

  it.each(["en", "ar"] as const)("shows the chosen day in the page language and sends it as yyyy-mm-dd, in %s", async (locale) => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(
      <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        <ContactUsFormContactMethods locale={locale} onSubmit={onSubmit} />
      </div>
    )
    await act(async () => {
      fireEvent.click(trigger())
    })
    const cell = document.querySelector<HTMLElement>("td[data-day]:not([data-outside])")!
    const iso = cell.getAttribute("data-day")!
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    await act(async () => {
      fireEvent.click(cell.querySelector("[data-slot=calendar-day]")!)
    })
    const shown = trigger().textContent ?? ""
    expect(shown).not.toContain("dd/mm/yyyy")
    expect(shown).not.toContain("يوم/شهر/سنة")
    expect(shown).toContain(String(Number(iso.slice(8))))
    if (locale === "ar") expect(shown).toMatch(/[؀-ۿ]/)
    else expect(shown).toMatch(/[A-Za-z]/)
    expect(shown).not.toMatch(/[٠-٩]/)
    fireEvent.change(container.querySelector("input[type=email]")!, { target: { value: "sara@company.com" } })
    fireEvent.submit(container.querySelector("form")!)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ date: iso })))
  })
})
