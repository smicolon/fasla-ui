import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ContactUsSupportChannels, contactUsSupportChannelsCopy } from "./contact-us-support-channels"

const strings = (value: unknown): string[] => (typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(strings) : [])

describe("Support Channels", () => {
  it.each(["en", "ar"] as const)("is a labelled section with an h2, in %s", (locale) => {
    const { container } = render(<ContactUsSupportChannels locale={locale} />)
    const section = container.querySelector("section")!
    const label = document.getElementById(section.getAttribute("aria-labelledby")!)
    expect(label?.tagName).toBe("H2")
    expect(label?.textContent).toBe(contactUsSupportChannelsCopy[locale].heading)
  })

  it("has the same copy keys in English and Arabic", () => {
    expect(Object.keys(contactUsSupportChannelsCopy.ar).sort()).toEqual(Object.keys(contactUsSupportChannelsCopy.en).sort())
  })

  it("keeps the Arabic copy to the rules", () => {
    for (const text of strings(contactUsSupportChannelsCopy.ar)) {
      expect(text).not.toMatch(/·|•/)
      expect(text).not.toMatch(/[—–]/)
      expect(text).not.toMatch(/[٠-٩۰-۹]/)
      expect(text).not.toMatch(/[%٪]/)
    }
  })

  it("has no form, no required field and no asterisk", () => {
    const { container } = render(<ContactUsSupportChannels />)
    expect(container.querySelector("form")).toBeNull()
    expect(container.querySelector("[aria-required]")).toBeNull()
    expect(container.textContent).not.toContain("*")
  })

  it("shows three cards: chat, email and voicemail, with the badge on the chat card", () => {
    render(<ContactUsSupportChannels />)
    expect(screen.getByText("FASTEST RESPONSE TIME").closest("div")?.textContent).toContain("Chat with us")
    expect(screen.getByRole("heading", { name: "Send an email" })).toBeTruthy()
    expect(screen.getByRole("heading", { name: "Leave a voicemail" })).toBeTruthy()
  })

  it("makes the buttons links by default, and the email and phone links", () => {
    render(<ContactUsSupportChannels customerSupportHref="/help" chatHref="/chat" email="a@b.co" phone="+971 4 000 0000" />)
    expect(screen.getByRole("link", { name: "Get customer support" }).getAttribute("href")).toBe("/help")
    expect(screen.getByRole("link", { name: "Start live chat" }).getAttribute("href")).toBe("/chat")
    expect(screen.getByRole("link", { name: "a@b.co" }).getAttribute("href")).toBe("mailto:a@b.co")
    const tel = screen.getByRole("link", { name: "+971 4 000 0000" })
    expect(tel.getAttribute("href")).toBe("tel:+97140000000")
    expect(tel.querySelector("bdi")?.getAttribute("dir")).toBe("ltr")
  })

  it("turns live chat into a button for onStartChat", () => {
    const onStartChat = vi.fn()
    render(<ContactUsSupportChannels onStartChat={onStartChat} />)
    fireEvent.click(screen.getByRole("button", { name: "Start live chat" }))
    expect(onStartChat).toHaveBeenCalledTimes(1)
  })

  it("uses the Button and Badge atoms with no colour class of ours", () => {
    const { container } = render(<ContactUsSupportChannels />)
    const buttons = [...container.querySelectorAll("a")].filter((a) => /customer support|live chat/.test(a.textContent ?? ""))
    expect(buttons).toHaveLength(2)
    for (const node of buttons) expect(node.className).not.toMatch(/chart-1/)
    expect(screen.getByText("FASTEST RESPONSE TIME").closest("span[class*=bg-primary]")!.className).not.toMatch(/chart-1/)
  })

  it("rises the three cards 80ms apart, and leaves them unclickable as a whole", () => {
    const { container } = render(<ContactUsSupportChannels />)
    const cards = [...container.querySelectorAll("[data-reveal=rise]")]
    expect(cards.map((node) => node.getAttribute("data-reveal-delay"))).toEqual(["0", "80", "160"])
    for (const card of cards) expect(card.closest("a")).toBeNull()
  })

  it("keeps the existing-customer option first in the markup, so Arabic leads with it at the start side", () => {
    render(<ContactUsSupportChannels locale="ar" />)
    const first = screen.getByText("هل أنت عميل بالفعل؟")
    const second = screen.getByText("لست عميلًا بعد؟")
    expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
