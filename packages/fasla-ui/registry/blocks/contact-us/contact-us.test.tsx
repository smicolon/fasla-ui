import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import {
  ContactUsChoiceGroup,
  ContactUsField,
  ContactUsForm,
  ContactUsSubmit,
  ContactUsWords,
  contactUsFormMessages,
  formatClock,
  openState,
  playReveal,
  splitMinutes,
  zoneParts,
  splitCopy,
  useContactUsForm,
  type ContactUsFieldDef,
  type ContactUsValues,
} from "./contact-us"

const FIELDS: ContactUsFieldDef[] = [
  { name: "email", kind: "email", label: "Email *", required: true },
  { name: "message", kind: "textarea", label: "Message *", required: true, maxLength: 10 },
  { name: "consent", kind: "checkbox", label: "I agree", required: true },
  { name: "note", kind: "text", label: "Note" },
]

function Harness({ onSubmit, disabled, defaultValues, extra }: { onSubmit?: (values: ContactUsValues) => void | Promise<void>; disabled?: boolean; defaultValues?: ContactUsValues; extra?: React.ReactNode }) {
  const form = useContactUsForm({ fields: [...FIELDS, { name: "service", kind: "select", label: "Service" }], messages: contactUsFormMessages.en, onSubmit, disabled, defaultValues })
  return (
    <ContactUsForm form={form}>
      {FIELDS.map((field) => (
        <ContactUsField key={field.name} field={field} />
      ))}
      <ContactUsChoiceGroup name="service" label="Service" options={[{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }]} />
      {extra}
      <ContactUsSubmit>Send</ContactUsSubmit>
    </ContactUsForm>
  )
}

const type = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })
const send = () => fireEvent.click(screen.getByRole("button", { name: "Send" }))
const fillValid = () => {
  type("Email *", "sara@company.com")
  type("Message *", "  Hello  ")
  fireEvent.click(screen.getByLabelText("I agree"))
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("splitCopy", () => {
  it("keeps the default for a copy prop left out, takes the one passed, and hands back everything else", () => {
    const { copy, rest } = splitCopy({ heading: "A", note: "B" }, { heading: "Z", note: undefined, className: "x", onSubmit: () => {} })
    expect(copy).toEqual({ heading: "Z", note: "B" })
    expect(Object.keys(rest).sort()).toEqual(["className", "onSubmit"])
  })
})

describe("useContactUsForm", () => {
  it("names every required field that is empty, sends nothing and focuses the first", async () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} />)
    send()
    expect(screen.getAllByText("This field is required.")).toHaveLength(2)
    expect(screen.getByText("Accept this to continue.")).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Email *")))
    expect(screen.getByLabelText("Email *").getAttribute("aria-invalid")).toBe("true")
  })

  it("checks that an email is one, and clears a field's message when it is edited", () => {
    render(<Harness />)
    type("Email *", "not-an-email")
    send()
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy()
    type("Email *", "sara@company.com")
    expect(screen.queryByText("Enter a valid email address.")).toBeNull()
  })

  it("sends every field by name, trimmed, then shows the thank-you panel and brings the form back on request", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<Harness onSubmit={onSubmit} />)
    fillValid()
    send()
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Thank you."))
    expect(onSubmit).toHaveBeenCalledWith({ email: "sara@company.com", message: "Hello", consent: true, note: "", service: "" })
    fireEvent.click(screen.getByRole("button", { name: "Send another message" }))
    expect((screen.getByLabelText("Email *") as HTMLInputElement).value).toBe("")
  })

  it("shows the button's pending label while sending, and locks the form", async () => {
    let resolve = () => {}
    const onSubmit = vi.fn(() => new Promise<void>((done) => (resolve = done)))
    const { container } = render(<Harness onSubmit={onSubmit} />)
    fillValid()
    send()
    await waitFor(() => expect(container.querySelector("form")?.getAttribute("aria-busy")).toBe("true"))
    expect(screen.getByText("Sending")).toBeTruthy()
    expect((screen.getByLabelText("Email *") as HTMLInputElement).disabled).toBe(true)
    await act(async () => resolve())
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
  })

  it("says the send failed when onSubmit rejects, keeps what was typed and lets the reader try again", async () => {
    const onSubmit = vi.fn().mockRejectedValueOnce(new Error("no")).mockResolvedValueOnce(undefined)
    render(<Harness onSubmit={onSubmit} />)
    fillValid()
    send()
    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("We could not send that. Please try again."))
    expect((screen.getByLabelText("Email *") as HTMLInputElement).value).toBe("sara@company.com")
    send()
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy())
    expect(onSubmit).toHaveBeenCalledTimes(2)
  })

  it("turns every field off when disabled, and sends nothing", () => {
    const onSubmit = vi.fn()
    render(<Harness onSubmit={onSubmit} disabled />)
    expect((screen.getByLabelText("Email *") as HTMLInputElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Send" }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form")!)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("starts from defaultValues", () => {
    render(<Harness defaultValues={{ note: "Hi" }} />)
    expect((screen.getByLabelText("Note") as HTMLInputElement).value).toBe("Hi")
  })

  it("shows a message counter from 80% of the limit, warning from 90% and destructive at the limit", () => {
    render(<Harness />)
    type("Message *", "1234567")
    expect(screen.queryByText("7/10")).toBeNull()
    type("Message *", "12345678")
    expect(screen.getByText("8/10").className).toBe("")
    type("Message *", "123456789")
    expect(screen.getByText("9/10").className).toContain("text-warning")
    type("Message *", "1234567890")
    expect(screen.getByText("10/10").className).toContain("text-destructive")
  })
})

describe("ContactUsChoiceGroup", () => {
  it("is a single choice: pressing a chip chooses it, another moves the choice, the same one clears it", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<Harness onSubmit={onSubmit} />)
    const alpha = screen.getByRole("button", { name: "Alpha" })
    const beta = screen.getByRole("button", { name: "Beta" })
    expect(screen.getByRole("group", { name: "Service" })).toBeTruthy()
    fireEvent.click(alpha)
    expect([alpha, beta].map((chip) => chip.getAttribute("aria-pressed"))).toEqual(["true", "false"])
    fireEvent.click(beta)
    expect([alpha, beta].map((chip) => chip.getAttribute("aria-pressed"))).toEqual(["false", "true"])
    fireEvent.click(beta)
    expect(beta.getAttribute("aria-pressed")).toBe("false")
    fireEvent.click(alpha)
    fillValid()
    send()
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ service: "a" })))
  })
})

describe("ContactUsWords", () => {
  it("sets a sentence word by word and still reads as the one sentence", () => {
    const { container } = render(<p><ContactUsWords>Send us a message</ContactUsWords></p>)
    expect(container.querySelectorAll("[data-reveal=word]")).toHaveLength(4)
    expect(container.textContent).toBe("Send us a message")
  })
})

describe("playReveal", () => {
  const stubAnimate = () => {
    const animate = vi.fn(() => ({ cancel() {} }) as unknown as Animation)
    Object.defineProperty(HTMLElement.prototype, "animate", { value: animate, configurable: true })
    return animate
  }
  const node = (kind?: string, delay?: string) => {
    const el = document.createElement("div")
    if (kind) el.dataset.reveal = kind
    if (delay) el.dataset.revealDelay = delay
    return el
  }
  const stubMotion = (reduce: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} }))

  it("rises, draws and wipes with the repo's presets: 180ms, 260ms for a wipe, one stagger step per node", () => {
    stubMotion(false)
    const animate = stubAnimate()
    playReveal([node(), node("draw-x"), node("wipe"), node("fade", "90")])
    const calls = animate.mock.calls as unknown as [Keyframe[], KeyframeAnimationOptions][]
    expect(calls[0]![0]).toEqual([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }])
    expect(calls[1]![0]).toEqual([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }])
    expect(calls.map(([, options]) => options.duration)).toEqual([180, 180, 260, 180])
    expect(calls.map(([, options]) => options.delay)).toEqual([0, 50, 100, 90])
    expect(calls.every(([, options]) => options.easing === "cubic-bezier(0.2, 0, 0, 1)")).toBe(true)
  })

  it("only fades, at once and for 120ms, when the reader asked for less motion", () => {
    stubMotion(true)
    const animate = stubAnimate()
    playReveal([node(), node("draw-y"), node("wipe")])
    const calls = animate.mock.calls as unknown as [Keyframe[], KeyframeAnimationOptions][]
    calls.forEach(([frames, options]) => {
      expect(frames).toEqual([{ opacity: 0 }, { opacity: 1 }])
      expect(options.duration).toBe(120)
      expect(options.delay).toBe(0)
    })
  })
})

describe("live time", () => {
  const SUN_THU = { open: "09:00", close: "18:00" }
  const WEEK = [SUN_THU, SUN_THU, SUN_THU, SUN_THU, { open: "09:00", close: "16:00" }, null, null] as const
  // Tuesday 10 March 2026, 14:20 in Dubai.
  const TUE = new Date("2026-03-10T10:20:00Z")

  it("tells the weekday and the minutes at a place, in its own zone", () => {
    expect(zoneParts(TUE, "Asia/Dubai")).toEqual({ day: 2, minutes: 14 * 60 + 20 })
    expect(zoneParts(TUE, "Asia/Singapore")).toEqual({ day: 2, minutes: 18 * 60 + 20 })
  })

  it("writes the clock 24-hour with Western digits", () => {
    expect(formatClock(TUE, "Asia/Dubai")).toBe("14:20")
    expect(formatClock(new Date("2026-04-07T10:20:00Z"), "Europe/London")).toBe("11:20")
  })

  it("says how long is left while open, and when it opens next while closed", () => {
    expect(openState(WEEK, "Asia/Dubai", TUE)).toEqual({ open: true, day: 2, closesInMinutes: 220 })
    expect(splitMinutes(220)).toEqual({ hours: 3, minutes: 40 })
    // Friday is closed: the next opening is Sunday, two days on.
    expect(openState(WEEK, "Asia/Dubai", new Date("2026-03-13T10:20:00Z"))).toEqual({ open: false, day: 5, next: { daysAhead: 2, day: 0, time: "09:00" } })
    // Before opening on a working day: later today.
    expect(openState(WEEK, "Asia/Dubai", new Date("2026-03-10T03:00:00Z"))).toEqual({ open: false, day: 2, next: { daysAhead: 0, day: 2, time: "09:00" } })
  })
})
