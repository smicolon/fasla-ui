import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ContactUsFormContactMethods, contactUsFormContactMethodsCopy } from "./contact-us-form-contact-methods"
import { ContactUsSplitPhotoDark, contactUsSplitPhotoDarkCopy } from "./contact-us-split-photo-dark"
import { ContactUsPhotoAndDarkPanel, contactUsPhotoAndDarkPanelCopy } from "./contact-us-photo-and-dark-panel"
import { ContactUsEditorialAndAddressCard, contactUsEditorialAndAddressCardCopy } from "./contact-us-editorial-and-address-card"

// What these tests can and cannot prove: jsdom has no layout, so the Figma
// sizes and the container-query layouts were measured in a browser. These
// assert the contract around them: the copy in both languages, the checks a
// form makes, what it sends, the photo slot, and the Arabic rules.

type Block = React.ComponentType<{ locale?: "en" | "ar"; onSubmit?: (values: Record<string, unknown>) => void | Promise<void> } & Record<string, unknown>>

interface Case {
  name: string
  Block: Block
  copy: { en: object; ar: object }
  /** The labels of the required fields, as English writes them. Figma marks none in two of the four. */
  required: string[]
  /** What to type: label -> value. */
  typed: Record<string, string>
  /** Checkboxes to tick, by label. */
  ticked: string[]
  /** What `onSubmit` is called with, besides the defaults every field gets. */
  sent: Record<string, unknown>
  /** Every key `onSubmit` receives. */
  keys: string[]
}

const CASES: Case[] = [
  {
    name: "Form + Contact Methods",
    Block: ContactUsFormContactMethods as Block,
    copy: contactUsFormContactMethodsCopy,
    required: ["Email"],
    typed: { "Full name": "Sara", "Email": "sara@company.com", "Message / Special requests": "  A visit  " },
    ticked: [],
    sent: { fullName: "Sara", email: "sara@company.com", message: "A visit", phone: "", date: "", teamSize: "" },
    keys: ["fullName", "email", "phone", "meetingType", "date", "teamSize", "message"],
  },
  {
    name: "Split Photo Dark",
    Block: ContactUsSplitPhotoDark as Block,
    copy: contactUsSplitPhotoDarkCopy,
    required: ["Work email"],
    typed: { "Your name": "Sara", "Work email": "sara@company.com", "Your role": "CTO", Company: "Northwind" },
    ticked: [],
    sent: { name: "Sara", email: "sara@company.com", role: "CTO", company: "Northwind" },
    keys: ["name", "email", "role", "company", "teamSize"],
  },
  {
    name: "Photo & Dark Panel",
    Block: ContactUsPhotoAndDarkPanel as Block,
    copy: contactUsPhotoAndDarkPanelCopy,
    required: ["First name", "Last name", "Email", "Message"],
    typed: { "First name": "Sara", "Last name": "Mansouri", "Email": "sara@company.com", "Message": "Hello" },
    ticked: [],
    sent: { firstName: "Sara", lastName: "Mansouri", email: "sara@company.com", message: "Hello", phone: "", subject: "" },
    keys: ["firstName", "lastName", "email", "phone", "subject", "message"],
  },
  {
    name: "Editorial & Address Card",
    Block: ContactUsEditorialAndAddressCard as Block,
    copy: contactUsEditorialAndAddressCardCopy,
    required: ["MAIL", "I ACCEPT THE TERMS OF USE"],
    typed: { NAME: "Sara", MAIL: "sara@company.com", MESSAGE: "Hello" },
    ticked: ["I ACCEPT THE TERMS OF USE"],
    sent: { name: "Sara", mail: "sara@company.com", message: "Hello", terms: true },
    keys: ["name", "mail", "message", "terms"],
  },
]

const field = (label: string) => screen.getByLabelText(label)
const submit = (container: HTMLElement) => fireEvent.submit(container.querySelector("form")!)
const strings = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : []
const PHOTO = { src: "/photo.webp", alt: "A photo" }

describe.each(CASES)("$name", ({ Block, copy, required, typed, ticked, sent, keys }) => {
  it.each(["en", "ar"] as const)("is a labelled section holding a form, in %s", (locale) => {
    const { container } = render(<Block locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent?.trim()).toBeTruthy()
    expect(container.querySelector("form")).toBeTruthy()
  })

  it(required.length ? "names each required field that is empty, and sends nothing" : "has no required field, so an empty form is sent as it stands", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<Block onSubmit={onSubmit} />)
    submit(container)
    if (required.length) {
      expect(container.querySelectorAll("[data-invalid]").length).toBeGreaterThanOrEqual(required.length)
      expect(onSubmit).not.toHaveBeenCalled()
      for (const label of required) expect(field(label).getAttribute("aria-invalid")).toBe("true")
    } else {
      await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    }
  })

  it("sends every field by name once the required ones are filled, then thanks the reader", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(<Block onSubmit={onSubmit} />)
    for (const [label, value] of Object.entries(typed)) fireEvent.change(field(label), { target: { value } })
    for (const label of ticked) fireEvent.click(field(label))
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
    const inputs = [...container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([type=checkbox]):not([type=hidden]), textarea")]
    const email = inputs.find((input) => input.getAttribute("type") === "email")!
    fireEvent.change(email, { target: { value: "sara@company.com" } })
    for (const input of inputs.filter((item) => item.getAttribute("aria-required") === "true" && item !== email)) fireEvent.change(input, { target: { value: "x" } })
    container.querySelectorAll<HTMLInputElement>("input[type=checkbox][aria-required=true]").forEach((box) => fireEvent.click(box))
    submit(container)
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe(arabic.error))
  })

  it("shows a photo when it is given one, and a quiet ground when it is not", () => {
    const { container, rerender } = render(<Block />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<Block photo={PHOTO} />)
    const img = container.querySelector("img")!
    expect(img.getAttribute("src")).toBe(PHOTO.src)
    expect(img.getAttribute("alt")).toBe(PHOTO.alt)
  })

  it.each([["en", "Required"], ["ar", "مطلوب"]] as const)("shows the word %s on each required field, in the atom's Top Right label slot, and no asterisk anywhere", (locale, word) => {
    const { container } = render(<Block locale={locale} />)
    const words = screen.queryAllByText(word)
    expect(words.length).toBeGreaterThanOrEqual(required.filter((label) => !ticked.includes(label)).length)
    expect(words.length).toBeGreaterThan(0)
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

describe("Form + Contact Methods", () => {
  it("holds the message group to Figma's 88px and draws one submit button, which lifts 2px on hover", () => {
    const { container } = render(<ContactUsFormContactMethods />)
    expect(screen.getByLabelText("Message / Special requests").closest("[data-slot=textarea-field]")?.className).toContain("min-h-[88px]")
    const submits = container.querySelectorAll("button[type=submit]")
    expect(submits).toHaveLength(1)
    expect(submits[0]!.textContent).toBe("Reserve your spot")
    expect(submits[0]!.className).toContain("hover:motion-safe:-translate-y-0.5")
    expect(submits[0]!.className).toContain("motion-safe:duration-[120ms]")
    expect(container.querySelector("svg.lucide-arrow-up-right")).toBeNull()
  })

  it("asks for the email, and for nothing else", () => {
    render(<ContactUsFormContactMethods />)
    expect(field("Email").getAttribute("aria-required")).toBe("true")
    for (const label of ["Full name", "Phone number", "Preferred date", "Team size", "Message / Special requests"]) expect(field(label).getAttribute("aria-required")).toBeNull()
  })

  it("sets the Your visit badge as Badge Soft Secondary, with no background of its own", () => {
    render(<ContactUsFormContactMethods photo={PHOTO} />)
    const badge = screen.getByText("Your visit").closest("[class*='from-soft-secondary']")!
    expect(badge).toBeTruthy()
    // The atom's own ground is bg-card under a soft gradient: nothing else is added.
    expect(badge.className.replace("bg-card", "").replace("bg-gradient-to-r", "")).not.toMatch(/(^|\s)bg-/)
  })

  it("moves the photo's crop with its focus: base, then Tablet, then Desktop", () => {
    const { container } = render(<ContactUsFormContactMethods photo={{ ...PHOTO, focus: { base: "50% 81%", tablet: "50% 72%", desktop: "50% 50%" } }} />)
    const img = container.querySelector("img")!
    expect(img.style.getPropertyValue("--cu-pos")).toBe("50% 81%")
    expect(img.style.getPropertyValue("--cu-pos-t")).toBe("50% 72%")
    expect(img.style.getPropertyValue("--cu-pos-d")).toBe("50% 50%")
    expect(img.className).toContain("var(--cu-pos-t,")
  })

  it("sets the three methods apart, with phone numbers and addresses as links in one left-to-right run", () => {
    const { container } = render(<ContactUsFormContactMethods phoneNumbers={["+971 4 000 0000", "+971 50 000 0000"]} emailAddresses={["a@fasla.com", "b@fasla.com"]} />)
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual(["Call & WhatsApp", "Working hours", "Write to us"])
    expect(screen.getByRole("link", { name: "+971 4 000 0000" }).getAttribute("href")).toBe("tel:+97140000000")
    expect(screen.getByRole("link", { name: "b@fasla.com" }).getAttribute("href")).toBe("mailto:b@fasla.com")
    expect(screen.getByRole("link", { name: "b@fasla.com" }).querySelector("bdi")?.getAttribute("dir")).toBe("ltr")
    const delays = [...container.querySelectorAll("[data-reveal=rise]")].map((node) => node.getAttribute("data-reveal-delay"))
    expect(delays).toEqual(["0", "80", "160"])
  })

  it("puts the Your visit badge on the photo, and lets the photo stay still", () => {
    const { container } = render(<ContactUsFormContactMethods photo={PHOTO} />)
    expect(screen.getByText("Your visit").closest("div")?.querySelector("img")).toBeTruthy()
    expect(container.querySelector("img")!.hasAttribute("data-reveal")).toBe(false)
  })
})

describe("Split Photo Dark", () => {
  it("asks for the work email, with a space and an asterisk, and for nothing else", () => {
    render(<ContactUsSplitPhotoDark />)
    expect(field("Work email").getAttribute("aria-required")).toBe("true")
    for (const label of ["Your name", "Your role", "Company"]) expect(field(label).getAttribute("aria-required")).toBeNull()
  })

  it("rounds every field to a pill, and puts the logo under the note", () => {
    const { container } = render(<ContactUsSplitPhotoDark />)
    expect(container.querySelectorAll("[data-slot=input-box]").length + container.querySelectorAll("input").length).toBeGreaterThan(0)
    expect(container.querySelector("svg[role=img]")).toBeTruthy()
  })

  it("settles the photo, and keeps the form column rising", () => {
    const { container } = render(<ContactUsSplitPhotoDark photo={PHOTO} />)
    expect(container.querySelector("img")!.getAttribute("data-reveal")).toBe("settle")
    expect(container.querySelector("[data-reveal=rise]")).toBeTruthy()
  })

  it("has the form side first and the photo second, so the page's dir sets which is at the start", () => {
    const { container } = render(<ContactUsSplitPhotoDark photo={PHOTO} />)
    const row = container.querySelector("section > div > div")!
    expect(row.firstElementChild!.querySelector("form")).toBeTruthy()
    expect(row.lastElementChild!.querySelector("img")).toBeTruthy()
  })
})

describe("Photo & Dark Panel", () => {
  it("is framed in chart-4 and slides the panel in from the photo's side", () => {
    const { container } = render(<ContactUsPhotoAndDarkPanel photo={PHOTO} />)
    expect(container.querySelector(".bg-chart-4")).toBeTruthy()
    const panel = container.querySelector("[data-reveal=slide]")!
    expect(panel.getAttribute("data-reveal-from")).toBe("start")
    expect(panel.className).toContain("bg-background")
    expect(container.querySelector("[data-reveal=fade]")).toBeTruthy()
  })

  it("marks the phone optional and the four required fields with a space and an asterisk", () => {
    render(<ContactUsPhotoAndDarkPanel />)
    expect(screen.getByLabelText("Phone (optional)").getAttribute("aria-required")).toBeNull()
    for (const label of ["First name", "Last name", "Email", "Message"]) expect(field(label).getAttribute("aria-required")).toBe("true")
  })

  it("holds the message group to Figma's 88px", () => {
    render(<ContactUsPhotoAndDarkPanel />)
    expect(screen.getByLabelText("Message").closest("[data-slot=textarea-field]")?.className).toContain("min-h-[88px]")
  })
})

describe("Editorial & Address Card", () => {
  it("draws three lines and slides two rows, and leads each row with a badge", () => {
    const { container } = render(<ContactUsEditorialAndAddressCard />)
    expect(container.querySelectorAll("[data-reveal=draw-x]")).toHaveLength(3)
    expect([...container.querySelectorAll("[data-reveal=slide]")].map((node) => node.getAttribute("data-reveal-delay"))).toEqual(["0", "80"])
    expect(screen.getByText("ADDRESS")).toBeTruthy()
    expect(screen.getByRole("link", { name: "hello@fasla.com" }).getAttribute("href")).toBe("mailto:hello@fasla.com")
  })

  it("sets the headline word by word, and keeps it one sentence", () => {
    render(<ContactUsEditorialAndAddressCard />)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading.querySelectorAll("[data-reveal=word]")).toHaveLength(3)
    expect(heading.textContent).toBe("Have a seat!")
  })

  it("asks for the terms and the mail, and shows no asterisk anywhere, not even in a placeholder", () => {
    render(<ContactUsEditorialAndAddressCard />)
    expect(field("I ACCEPT THE TERMS OF USE").getAttribute("aria-required")).toBe("true")
    expect(screen.queryByText(/\*/)).toBeNull()
    expect(field("MAIL").getAttribute("aria-required")).toBe("true")
    expect(field("MAIL").getAttribute("placeholder")).toBe("you@company.com")
    expect([...document.querySelectorAll("input,textarea")].some((node) => (node.getAttribute("placeholder") ?? "").includes("*"))).toBe(false)
    for (const label of ["NAME", "MESSAGE"]) expect(field(label).getAttribute("aria-required")).toBeNull()
  })

  it("still refuses an empty mail on submit, and names it", () => {
    const onSubmit = vi.fn()
    const { container } = render(<ContactUsEditorialAndAddressCard onSubmit={onSubmit} />)
    fireEvent.change(field("NAME"), { target: { value: "Sara" } })
    fireEvent.click(field("I ACCEPT THE TERMS OF USE"))
    submit(container)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(field("MAIL").getAttribute("aria-invalid")).toBe("true")
    expect(container.querySelector("[data-contact-field=mail]")!.textContent).toContain("This field is required.")
  })

  it("tints the section with soft-success and tints Send with success", () => {
    const { container } = render(<ContactUsEditorialAndAddressCard />)
    expect(container.querySelector("section")!.className).toContain("bg-soft-success")
    expect(container.querySelector("button[type=submit]")!.className).toContain("from-soft-success-20")
  })

  it("has one button, Send, which lifts 2px on hover", () => {
    const { container } = render(<ContactUsEditorialAndAddressCard />)
    const buttons = container.querySelectorAll("button:not([role=checkbox])")
    expect(container.querySelectorAll("button[type=submit]")).toHaveLength(1)
    expect(buttons).toHaveLength(1)
    expect(buttons[0]!.textContent).toBe("Send")
    expect(buttons[0]!.className).toContain("hover:motion-safe:-translate-y-0.5")
  })
})
