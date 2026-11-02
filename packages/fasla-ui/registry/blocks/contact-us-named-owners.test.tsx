import { describe, expect, it, vi } from "vitest"
import userEvent from "@testing-library/user-event"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { ContactUsNamedOwners, contactUsNamedOwnersCopy } from "./contact-us-named-owners"

// jsdom has no layout: the Figma sizes and the container-query layouts were
// measured in a browser. These assert the contract around them.

const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []
const submit = (container: HTMLElement) => fireEvent.submit(container.querySelector("form")!)
const byPlaceholder = (text: string) => screen.getByPlaceholderText(text)

describe("Named Owners", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2 and a form, in %s", (locale) => {
    const { container } = render(<ContactUsNamedOwners locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent?.trim()).toBe(contactUsNamedOwnersCopy[locale].heading)
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("has Arabic copy for every English key, and the owners match one for one", () => {
    expect(Object.keys(contactUsNamedOwnersCopy.ar).sort()).toEqual(Object.keys(contactUsNamedOwnersCopy.en).sort())
    expect(contactUsNamedOwnersCopy.ar.owners.map((o) => o.id)).toEqual(contactUsNamedOwnersCopy.en.owners.map((o) => o.id))
    expect(contactUsNamedOwnersCopy.ar.enquiryOptions.map((o) => o.value)).toEqual(contactUsNamedOwnersCopy.en.enquiryOptions.map((o) => o.value))
  })

  it("writes Arabic without a middle dot, a dash outside digits, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(contactUsNamedOwnersCopy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d\s)–|–(?!\s\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
    // Figma's Arabic owner names, not the English ones.
    expect(contactUsNamedOwnersCopy.ar.owners.map((o) => o.name)).toEqual(["منى", "بسّام", "لمى", "هناء"])
  })

  it("makes each owner block a mailto link carrying the role, the name and the address", () => {
    render(<ContactUsNamedOwners />)
    const link = screen.getByRole("link", { name: /Ben/ })
    expect(link.getAttribute("href")).toBe("mailto:ben@fasla.com")
    expect(within(link).getByText("New business")).toBeTruthy()
    expect(within(link).getByText("ben@fasla.com")).toBeTruthy()
    expect(screen.getAllByRole("link")).toHaveLength(4)
    // The hover moves are motion-safe only.
    expect(link.className).toContain("hover:motion-safe:-translate-y-0.5")
  })

  it("takes its own owners", () => {
    render(<ContactUsNamedOwners owners={[{ id: "a", roleLabel: "Sales", name: "Sam", email: "sam@x.com" }]} />)
    expect(screen.getAllByRole("link")).toHaveLength(1)
    expect(screen.getByRole("link", { name: /Sam/ }).getAttribute("href")).toBe("mailto:sam@x.com")
  })

  it("sets the card on the page's opposite theme", () => {
    const { container } = render(<ContactUsNamedOwners />)
    expect(container.querySelector("form")!.closest(".dark, .light")).toBeTruthy()
  })

  it("asks only for the email and the privacy box, and sends nothing while they are empty", () => {
    const onSubmit = vi.fn()
    const { container } = render(<ContactUsNamedOwners onSubmit={onSubmit} />)
    submit(container)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(container.querySelectorAll("[data-contact-field][data-invalid]")).toHaveLength(2)
    expect(byPlaceholder("Email").getAttribute("aria-invalid")).toBe("true")
    expect(screen.getByLabelText("I have read and agree to the privacy policy.").getAttribute("aria-invalid")).toBe("true")
    for (const optional of ["Full name", "Company name", "Message (optional)"]) expect(byPlaceholder(optional).getAttribute("aria-required")).toBeNull()
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows no word %s on the label-less email, no asterisk, and the email is still required", (locale, word) => {
    const { container } = render(<ContactUsNamedOwners locale={locale} />)
    expect(screen.queryAllByText(word)).toHaveLength(0)
    expect(container.textContent).not.toContain("*")
    expect(container.querySelector("input[name=email]")?.getAttribute("aria-required")).toBe("true")
  })

  it("sends every field by name, then names the owner most likely to reply", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsNamedOwners onSubmit={onSubmit} />)
    fireEvent.change(byPlaceholder("Full name"), { target: { value: "Sara" } })
    fireEvent.change(byPlaceholder("Email"), { target: { value: "sara@company.com" } })
    fireEvent.change(byPlaceholder("Company name"), { target: { value: "Northwind" } })
    fireEvent.change(byPlaceholder("Message (optional)"), { target: { value: "  Hello  " } })
    fireEvent.click(screen.getByLabelText("I have read and agree to the privacy policy."))
    submit(container)
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    expect(onSubmit.mock.calls[0]![0]).toEqual({ fullName: "Sara", email: "sara@company.com", company: "Northwind", enquiry: "", message: "Hello", privacy: true })
    // No type chosen: nobody is named.
    expect(screen.getByRole("status").textContent).toContain(contactUsNamedOwnersCopy.en.replyFallback)
  })

  it("names the owner the chosen enquiry type maps to, in Arabic with the Arabic name", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsNamedOwners locale="ar" onSubmit={onSubmit} enquiryOwners={{ business: "general" }} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole("combobox"))
    await user.click(await screen.findByRole("option", { name: "أعمال جديدة" }))
    fireEvent.change(byPlaceholder("البريد الإلكتروني"), { target: { value: "sara@company.com" } })
    fireEvent.click(screen.getByLabelText(contactUsNamedOwnersCopy.ar.privacy))
    submit(container)
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    expect(onSubmit.mock.calls[0]![0].enquiry).toBe("business")
    // business -> general -> منى, not بسّام.
    expect(screen.getByRole("status").textContent).toContain("سيرد عليك منى.")
  })

  it("shows the send error, in Arabic too, when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("no"))
    const { container } = render(<ContactUsNamedOwners locale="ar" onSubmit={onSubmit} />)
    fireEvent.change(byPlaceholder("البريد الإلكتروني"), { target: { value: "sara@company.com" } })
    fireEvent.click(screen.getByLabelText(contactUsNamedOwnersCopy.ar.privacy))
    submit(container)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(contactUsNamedOwnersCopy.ar.error))
  })
})
