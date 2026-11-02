import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ContactUsClassicCentered, contactUsClassicCenteredCopy } from "./contact-us-classic-centered"
import { ContactUsDarkStatement, contactUsDarkStatementCopy } from "./contact-us-dark-statement"
import { ContactUsOversizedWordmark, contactUsOversizedWordmarkCopy } from "./contact-us-oversized-wordmark"
import { ContactUsEditorialStatement, contactUsEditorialStatementCopy } from "./contact-us-editorial-statement"
import { ContactUsRuledSplitForm, contactUsRuledSplitFormCopy } from "./contact-us-ruled-split-form"
import { ContactUsGrandHeadlineForm, contactUsGrandHeadlineFormCopy } from "./contact-us-grand-headline-form"
import { ContactUsPitchAndInquiry, contactUsPitchAndInquiryCopy } from "./contact-us-pitch-and-inquiry"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes and the container-query layouts were measured in a browser. These
// assert the contract around them: the copy in both languages, the checks a
// form makes, what it sends, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar"; onSubmit?: (values: Record<string, unknown>) => void | Promise<void> } & Record<string, unknown>>

interface Case {
  name: string
  Block: Block
  copy: { en: object; ar: object }
  /** The labels (or accessible names) of the required fields, as English writes them. */
  required: string[]
  /** What to type: label -> value. */
  typed: Record<string, string>
  /** Checkboxes to tick, by label. */
  ticked: string[]
  /** What `onSubmit` is called with, besides the defaults every field gets. */
  sent: Record<string, unknown>
  /** Every key `onSubmit` receives. */
  keys: string[]
  /** True when no field has a label row, so the word "Required" shows nowhere. */
  labelless?: boolean
}

const CASES: Case[] = [
  {
    name: "Classic Centered",
    Block: ContactUsClassicCentered as Block,
    copy: contactUsClassicCenteredCopy,
    required: ["Work email", "Message"],
    typed: { "Work email": "sara@company.com", "Message": "  A new site  " },
    ticked: ["I agree to the Fasla privacy policy."],
    sent: { email: "sara@company.com", message: "A new site", consent: true },
    keys: ["firstName", "lastName", "email", "topic", "message", "consent"],
  },
  {
    name: "Dark Statement",
    Block: ContactUsDarkStatement as Block,
    copy: contactUsDarkStatementCopy,
    required: ["Email", "Tell us about the project"],
    typed: { "Email": "sara@company.com", "Tell us about the project": "A product" },
    ticked: ["I have read the privacy statement."],
    sent: { email: "sara@company.com", project: "A product", consent: true },
    keys: ["firstName", "lastName", "email", "company", "project", "consent"],
  },
  {
    name: "Oversized Wordmark",
    Block: ContactUsOversizedWordmark as Block,
    copy: contactUsOversizedWordmarkCopy,
    required: ["Name", "E-mail", "Company", "Message"],
    typed: { "Name": "Sara", "E-mail": "sara@company.com", "Company": "Northwind", "Message": "Hello" },
    ticked: ["I accept the Fasla terms."],
    sent: { name: "Sara", email: "sara@company.com", company: "Northwind", message: "Hello", terms: true, source: "A search" },
    keys: ["name", "email", "phone", "company", "interest", "source", "message", "terms"],
  },
  {
    name: "Editorial Statement",
    Block: ContactUsEditorialStatement as Block,
    copy: contactUsEditorialStatementCopy,
    required: ["Email address", "Your message"],
    typed: { "Email address": "sara@company.com", "Your message": "Hello" },
    ticked: [],
    labelless: true,
    sent: { email: "sara@company.com", message: "Hello" },
    keys: ["firstName", "lastName", "email", "identity", "message"],
  },
  {
    name: "Ruled Split Form",
    Block: ContactUsRuledSplitForm as Block,
    copy: contactUsRuledSplitFormCopy,
    required: ["Name", "Email", "Message"],
    typed: { "Name": "Sara", "Email": "sara@company.com", "Message": "Hello" },
    ticked: [],
    sent: { name: "Sara", subject: "General", email: "sara@company.com", message: "Hello" },
    keys: ["name", "subject", "email", "message"],
  },
  {
    name: "Grand Headline Form",
    Block: ContactUsGrandHeadlineForm as Block,
    copy: contactUsGrandHeadlineFormCopy,
    required: ["First name", "Email"],
    typed: { "First name": "Sara", "Email": "sara@company.com" },
    ticked: [],
    sent: { firstName: "Sara", email: "sara@company.com", phone: "", updates: false },
    keys: ["firstName", "email", "phone", "updates"],
  },
  {
    name: "Pitch & Inquiry",
    Block: ContactUsPitchAndInquiry as Block,
    copy: contactUsPitchAndInquiryCopy,
    required: ["Full name", "Email", "Project details"],
    typed: { "Full name": "Sara", "Email": "sara@company.com", "Project details": "A design system" },
    ticked: [],
    sent: { name: "Sara", email: "sara@company.com", details: "A design system", service: "", budget: "" },
    keys: ["service", "budget", "name", "email", "details"],
  },
]

const field = (label: string) => screen.getByLabelText(label)
const submit = (container: HTMLElement) => fireEvent.submit(container.querySelector("form")!)
const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []

/** Presses a Select option, as a mouse does. */
async function choose(trigger: HTMLElement, option: string) {
  await act(async () => {
    fireEvent.click(trigger)
  })
  const item = await screen.findByRole("option", { name: option })
  await act(async () => {
    fireEvent.pointerDown(item, { pointerType: "mouse" })
    fireEvent.mouseDown(item)
    fireEvent.pointerUp(item, { pointerType: "mouse" })
    fireEvent.mouseUp(item)
    fireEvent.click(item)
  })
}

describe.each(CASES)("$name", ({ Block, copy, required, typed, ticked, sent, keys, name, labelless }) => {
  it.each(["en", "ar"] as const)("is a labelled section holding a form, in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const section = container.querySelector("section")!
    // Its heading, an h2, or (Editorial Statement has none) its first small label.
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.textContent?.trim()).toBeTruthy()
    expect(container.querySelector("form")).toBeTruthy()
  })

  it("names each required field that is empty, and sends nothing", () => {
    const onSubmit = vi.fn()
    const { container } = render(<Block onSubmit={onSubmit} />)
    submit(container)
    expect(container.querySelectorAll("[data-invalid]").length).toBeGreaterThanOrEqual(required.length)
    expect(onSubmit).not.toHaveBeenCalled()
    for (const label of required) expect(field(label).getAttribute("aria-invalid")).toBe("true")
  })

  it("sends every field by name once the required ones are filled, then thanks the reader", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<Block onSubmit={onSubmit} />)
    for (const [label, value] of Object.entries(typed)) fireEvent.change(field(label), { target: { value } })
    for (const label of ticked) fireEvent.click(field(label))
    if (name === "Oversized Wordmark") await choose(screen.getByRole("combobox", { name: "How did you find out about us?" }), "A search")
    submit(container)
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    const values = onSubmit.mock.calls[0]![0] as Record<string, unknown>
    expect(Object.keys(values).sort()).toEqual([...keys].sort())
    expect(values).toEqual(expect.objectContaining(sent))
  })

  it("shows the send error in Arabic too, when onSubmit rejects", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("no"))
    const { container } = render(<Block locale="ar" onSubmit={onSubmit} />)
    const arabic = copy.ar as Record<string, unknown>
    const labels = Object.values(typed)
    expect(labels.length).toBeGreaterThan(0)
    // Fill by position: the Arabic labels are the copy's own strings.
    const inputs = [...container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=checkbox]):not([type=hidden]), textarea")]
    const email = inputs.find((input) => input.getAttribute("type") === "email")!
    fireEvent.change(email, { target: { value: "sara@company.com" } })
    for (const input of inputs.filter((item) => item.getAttribute("aria-required") === "true" && item !== email && item.tagName !== "SELECT")) fireEvent.change(input, { target: { value: "x" } })
    container.querySelectorAll<HTMLInputElement>("input[type=checkbox][aria-required=true]").forEach((box) => fireEvent.click(box))
    if (name === "Oversized Wordmark") await choose(container.querySelectorAll<HTMLElement>("[role=combobox]")[1]!, (arabic.sources as string[])[0]!)
    submit(container)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(arabic.error))
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows the word %s on each required field that has a label row, and no asterisk anywhere", (locale, word) => {
    const { container } = render(<Block locale={locale} />)
    const words = screen.queryAllByText(word)
    if (labelless) {
      // No label row, so no word; the fields are still required in behaviour.
      expect(words).toHaveLength(0)
      expect(container.querySelectorAll("[aria-required=true]").length).toBeGreaterThanOrEqual(required.length)
    } else {
      expect(words.length).toBeGreaterThanOrEqual(required.filter((label) => !ticked.includes(label)).length)
      expect(words.length).toBeGreaterThan(0)
    }
    // Each one sits in the atom's own Top Right label slot, never in a custom element.
    for (const node of words) expect(node.getAttribute("data-slot")).toMatch(/label-end$/)
    expect(container.textContent).not.toContain("*")
    expect([...container.querySelectorAll("input,textarea")].some((node) => (node.getAttribute("placeholder") ?? "").includes("*"))).toBe(false)
  })

  it("writes Arabic without a middle dot, a dash, an Arabic-Indic digit or a percent sign", () => {
    const arabic = strings(copy.ar).join("\n")
    expect(arabic).not.toMatch(/[·—]|(?<!\d)–|–(?!\d)/)
    expect(arabic).not.toMatch(/[٠-٩%٪]/)
  })

  it("has Arabic copy for every English string", () => {
    expect(Object.keys(copy.ar).sort()).toEqual(Object.keys(copy.en).sort())
  })
})

describe("Classic Centered", () => {
  it("offers the address underneath as a mail link, in one left-to-right run", () => {
    render(<ContactUsClassicCentered emailAddress="team@fasla.com" />)
    const link = screen.getByRole("link", { name: "team@fasla.com" })
    expect(link.getAttribute("href")).toBe("mailto:team@fasla.com")
    expect(link.querySelector("bdi")?.getAttribute("dir")).toBe("ltr")
  })
})

describe("Dark Statement", () => {
  it("names its three marks for assistive technology and links the direct address", () => {
    render(<ContactUsDarkStatement />)
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("aria-label") ?? link.textContent)).toEqual(["hello@fasla.com", "LinkedIn", "X", "Dribbble"])
  })

  it("takes its facts as data", () => {
    render(<ContactUsDarkStatement facts={[{ label: "Studio", value: "Muscat" }]} />)
    expect(screen.getByText("Muscat")).toBeTruthy()
    expect(screen.queryByText("Hours")).toBeNull()
  })
})

describe("Oversized Wordmark", () => {
  it("sets the wordmark as its heading and links the phone number", () => {
    render(<ContactUsOversizedWordmark phoneNumber="+971 4 000 0000" />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("CONTACT")
    expect(screen.getByRole("link", { name: "+971 4 000 0000" }).getAttribute("href")).toBe("tel:+97140000000")
  })
})

describe("Editorial Statement", () => {
  it("names its unlabelled fields by their placeholder, and keeps the statement one sentence", () => {
    const { container } = render(<ContactUsEditorialStatement />)
    expect(screen.getByRole("textbox", { name: "First name" })).toBeTruthy()
    expect(screen.getByRole("textbox", { name: "Your message" })).toBeTruthy()
    expect(container.querySelector("label")).toBeNull()
    const statement = [...container.querySelectorAll("p")].find((p) => p.querySelector("[data-reveal=word]"))!
    expect(statement.textContent).toBe(contactUsEditorialStatementCopy.en.statement)
  })

  it("is labelled by its first small label, as it has no heading", () => {
    const { container } = render(<ContactUsEditorialStatement />)
    const section = container.querySelector("section")!
    expect(document.getElementById(section.getAttribute("aria-labelledby")!)?.textContent).toBe("CONTACT")
  })
})

describe("Ruled Split Form", () => {
  it("starts on its first subject, and holds the message group to Figma's 104px", () => {
    render(<ContactUsRuledSplitForm />)
    expect(screen.getByRole("combobox").textContent).toContain("General")
    expect(screen.getByLabelText("Message").closest("[data-slot=textarea-field]")?.className).toContain("min-h-[104px]")
  })

  it("limits the message to 500 characters and shows the counter from 400", () => {
    render(<ContactUsRuledSplitForm />)
    expect(screen.getByLabelText("Message").getAttribute("maxlength")).toBe("500")
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "a".repeat(400) } })
    expect(screen.getByText("400/500")).toBeTruthy()
  })

  it("draws a vertical rule from Tablet up and a horizontal one on phones", () => {
    const { container } = render(<ContactUsRuledSplitForm />)
    expect(container.querySelector("[data-reveal=draw-y]")).toBeTruthy()
    expect(container.querySelector("[data-reveal=draw-x]")).toBeTruthy()
  })
})

describe("Grand Headline Form", () => {
  it("draws the grid in 72px squares behind the section", () => {
    const { container } = render(<ContactUsGrandHeadlineForm />)
    const grid = container.querySelector("section > div[aria-hidden]")!
    expect(grid.className).toContain("[background-size:72px_72px]")
    expect(grid.className).toContain("var(--border)")
  })

  it("leaves the Submit button its own Solid Primary fills, with no colour of its own", () => {
    const { container } = render(<ContactUsGrandHeadlineForm />)
    const className = container.querySelector("button[type=submit]")!.className
    expect(className).toContain("bg-primary")
    expect(className).toContain("text-primary-foreground")
    expect(className).not.toMatch(/chart-1|foreground-inverse/)
  })

  it("does not ask for the optional updates box", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsGrandHeadlineForm onSubmit={onSubmit} />)
    fireEvent.change(field("First name"), { target: { value: "Sara" } })
    fireEvent.change(field("Email"), { target: { value: "sara@company.com" } })
    submit(container)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })
})

describe("Pitch & Inquiry", () => {
  it("holds the details group to Figma's 88px", () => {
    render(<ContactUsPitchAndInquiry />)
    expect(screen.getByLabelText("Project details").closest("[data-slot=textarea-field]")?.className).toContain("min-h-[88px]")
  })

  it("sends the chosen chips", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<ContactUsPitchAndInquiry onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole("button", { name: "Brand identity" }))
    fireEvent.click(screen.getByRole("button", { name: "$10K – $50K" }))
    fireEvent.change(field("Full name"), { target: { value: "Sara" } })
    fireEvent.change(field("Email"), { target: { value: "sara@company.com" } })
    fireEvent.change(field("Project details"), { target: { value: "A brand" } })
    submit(container)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ service: "Brand identity", budget: "$10K – $50K" })))
  })

  it("lists three promises, each after a check", () => {
    const { container } = render(<ContactUsPitchAndInquiry />)
    expect(container.querySelectorAll("li[data-reveal=fade]")).toHaveLength(3)
  })

  it("sends the call button's press to onBookCall, or links it when it has a place to go", () => {
    const onBookCall = vi.fn()
    const { unmount } = render(<ContactUsPitchAndInquiry onBookCall={onBookCall} />)
    fireEvent.click(screen.getByRole("button", { name: "Book a free call" }))
    expect(onBookCall).toHaveBeenCalled()
    unmount()
    render(<ContactUsPitchAndInquiry bookCallHref="/book" />)
    expect(screen.getByRole("link", { name: "Book a free call" }).getAttribute("href")).toBe("/book")
  })
})
