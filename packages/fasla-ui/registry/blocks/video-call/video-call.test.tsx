import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { Mic, MicOff, Video, VideoOff, Ellipsis, Hand } from "lucide-react"
import {
  ControlsDock,
  Figures,
  Latin,
  ParticipantTile,
  StageBar,
  StarRow,
  VideoCallHeading,
  VideoCallSection,
  VideoCallSeparator,
  VideoCallToast,
  isLatin,
  playEntrance,
  prefersReducedMotion,
  useVideoCallToast,
  type DockControl,
} from "./video-call"
import { VideoCallCallControlsDock, videoCallCallControlsDockCopy } from "../video-call-call-controls-dock/VideoCallCallControlsDock"
import { VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy } from "../video-call-captions-reactions/VideoCallCaptionsReactions"

const here = dirname(fileURLToPath(import.meta.url))
const SOURCES = ["video-call/video-call.tsx", "video-call-call-controls-dock/VideoCallCallControlsDock.tsx", "video-call-captions-reactions/VideoCallCaptionsReactions.tsx"].map((file) =>
  readFileSync(resolve(here, "..", file), "utf8")
)

/** A fake `Element.animate` that records its calls, as jsdom has none. */
function stubAnimate() {
  const calls: { keyframes: unknown; options: KeyframeAnimationOptions }[] = []
  const original = Element.prototype.animate
  Element.prototype.animate = vi.fn(function (this: Element, keyframes: unknown, options: KeyframeAnimationOptions) {
    calls.push({ keyframes, options })
    return { cancel: vi.fn(), onfinish: null } as unknown as Animation
  }) as unknown as typeof Element.prototype.animate
  return { calls, restore: () => (Element.prototype.animate = original) }
}

function stubReducedMotion(reduced: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({ matches: reduced && query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as typeof window.matchMedia
  return () => (window.matchMedia = original)
}

/** Every string a copy object holds as a value, without its ids (`settings`, `c1`) and its Latin shortcut. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" ? [] : [value.replace(/⌘ D/g, "").replace(/\{\w+\}/g, "")]
  if (Array.isArray(value)) return value.flatMap((item) => strings(item))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("the source", () => {
  it("uses logical properties only: no left, right, margin or padding on a physical side", () => {
    for (const source of SOURCES) {
      expect(source).not.toMatch(/\b(?:ml|mr|pl|pr)-(?:\d|\[|px|auto)/)
      expect(source).not.toMatch(/(?:^|[\s"'`:])(?:left|right)-(?:\d|\[|px|auto|full)/)
      expect(source).not.toMatch(/text-(?:left|right)\b/)
      expect(source).not.toMatch(/\b(?:rounded|border)-(?:l|r)(?:-|\b)/)
    }
  })

  it("never imports the motion library or the package's motion presets, which do not resolve after an install", () => {
    for (const source of SOURCES) {
      expect(source).not.toMatch(/from ["'](?:framer-motion|motion\/react)["']/)
      expect(source).not.toMatch(/from ["'][^"']*src\/motion/)
    }
  })

  it("asks for no camera, microphone or video element: stills only", () => {
    for (const source of SOURCES) {
      expect(source).not.toMatch(/getUserMedia|<video\b|mediaDevices/)
    }
  })
})

describe("isLatin, Latin and Figures", () => {
  it("tells a string without Arabic letters from one with them", () => {
    expect(isLatin("Mute")).toBe(true)
    expect(isLatin("كتم")).toBe(false)
    expect(isLatin(3 as unknown as React.ReactNode)).toBe(false)
  })

  it("keeps a Latin run whole and left to right in its own isolate", () => {
    const { container } = render(<Latin>fasla.to/room</Latin>)
    const bdi = container.querySelector("bdi")!
    expect(bdi).toHaveAttribute("dir", "ltr")
    expect(bdi).toHaveClass("whitespace-nowrap")
  })

  it("isolates each Latin run and figure inside an Arabic sentence, and leaves English alone", () => {
    const arabic = render(<Figures>{"اضغط ⌘ D للتحدث مع Fasla في 3 دقائق"}</Figures>)
    expect([...arabic.container.querySelectorAll("bdi")].map((bdi) => bdi.textContent)).toEqual(["⌘ D", "Fasla", "3"])
    const english = render(<Figures>{"Press ⌘ D to talk"}</Figures>)
    expect(english.container.querySelector("bdi")).toBeNull()
    expect(english.container).toHaveTextContent("Press ⌘ D to talk")
  })

  it("passes anything that is not a string through", () => {
    const { container } = render(<Figures>{<b>x</b>}</Figures>)
    expect(container.querySelector("b")).toBeInTheDocument()
  })
})

describe("motion helpers", () => {
  it("reads the reduced-motion setting, and is false where there is no matchMedia", () => {
    expect(prefersReducedMotion()).toBe(false)
    const restore = stubReducedMotion(true)
    expect(prefersReducedMotion()).toBe(true)
    restore()
  })

  it("rises and fades nodes in over 180ms, 60ms apart, on the standard ease", () => {
    const { calls, restore } = stubAnimate()
    const nodes = [document.createElement("div"), document.createElement("div")]
    playEntrance(nodes)
    expect(calls).toHaveLength(2)
    expect(calls[0]!.options).toMatchObject({ duration: 180, delay: 0, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "backwards" })
    expect(calls[1]!.options.delay).toBe(60)
    expect(JSON.stringify(calls[0]!.keyframes)).toContain("translateY(8px)")
    restore()
  })

  it("only fades, in 120ms with no stagger, under reduced motion", () => {
    const restoreMotion = stubReducedMotion(true)
    const { calls, restore } = stubAnimate()
    playEntrance([document.createElement("div"), document.createElement("div")])
    expect(calls.map((call) => call.options.duration)).toEqual([120, 120])
    expect(calls.map((call) => call.options.delay)).toEqual([0, 0])
    expect(JSON.stringify(calls[0]!.keyframes)).not.toContain("translate")
    restore()
    restoreMotion()
  })
})

describe("the section, the heading and the rule", () => {
  it("is a query container with Figma's padding and a 1248px column", () => {
    render(
      <VideoCallSection labelledBy="h" data-testid="section">
        <p>in</p>
      </VideoCallSection>
    )
    const section = screen.getByTestId("section")
    expect(section).toHaveClass("[container-type:inline-size]", "bg-background", "p-8", "md:p-16", "lg:p-24")
    expect(section.firstElementChild).toHaveClass("max-w-[1248px]", "gap-12")
  })

  it("sets an eyebrow, an h2 and a line, start aligned", () => {
    render(<VideoCallHeading headingId="h" eyebrow="EYEBROW" heading="Heading" description="Line" />)
    expect(screen.getByRole("heading", { level: 2, name: "Heading" })).toHaveAttribute("id", "h")
    expect(screen.getByText("EYEBROW")).toHaveClass("text-primary")
    expect(screen.getByText("Line")).toHaveClass("text-muted-foreground")
  })

  it("draws a 1px separator in `border`", () => {
    render(<VideoCallSeparator />)
    expect(screen.getByRole("separator")).toHaveClass("h-px", "bg-border")
  })
})

describe("the toast", () => {
  function Toaster() {
    const toast = useVideoCallToast(1600)
    return (
      <>
        <button onClick={() => toast.show("Copied")}>show</button>
        <VideoCallToast message={toast.message} />
      </>
    )
  }

  it("announces a message politely and clears it after 1.6s", () => {
    vi.useFakeTimers()
    render(<Toaster />)
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
    fireEvent.click(screen.getByText("show"))
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
    act(() => void vi.advanceTimersByTime(1599))
    expect(screen.getByRole("status")).toHaveTextContent("Copied")
    act(() => void vi.advanceTimersByTime(2))
    expect(screen.getByRole("status")).toBeEmptyDOMElement()
  })
})

describe("StarRow", () => {
  it("fills every star up to the one hovered, then keeps the one chosen and reports it", () => {
    const onValueChange = vi.fn()
    render(<StarRow label="Rate the call" onValueChange={onValueChange} starLabel={(n, count) => `${n} of ${count}`} />)
    const stars = screen.getAllByRole("radio")
    expect(stars).toHaveLength(5)
    expect(stars.filter((star) => star.hasAttribute("data-filled"))).toHaveLength(0)
    fireEvent.pointerEnter(stars[2]!)
    expect(stars.filter((star) => star.hasAttribute("data-filled"))).toHaveLength(3)
    fireEvent.click(stars[3]!)
    expect(onValueChange).toHaveBeenCalledWith(4)
    fireEvent.pointerLeave(screen.getByRole("radiogroup"))
    expect(stars.filter((star) => star.hasAttribute("data-filled"))).toHaveLength(4)
    expect(stars[3]).toHaveAttribute("aria-checked", "true")
    expect(screen.getByRole("radiogroup")).toHaveAccessibleName("Rate the call")
  })

  it("moves with the arrow keys, following the reading direction", () => {
    const onValueChange = vi.fn()
    render(<StarRow label="Rate" defaultValue={2} onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getAllByRole("radio")[1]!, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(3)
    fireEvent.keyDown(screen.getAllByRole("radio")[1]!, { key: "ArrowLeft" })
    expect(onValueChange).toHaveBeenLastCalledWith(2)
  })
})

describe("StageBar and ParticipantTile", () => {
  it("sets the name and time at the start and the actions at the end", () => {
    render(<StageBar title="Design sync" time="24:18" state={<span>REC</span>} actions={<button>Grid</button>} data-testid="bar" />)
    expect(screen.getByText("Design sync")).toBeInTheDocument()
    expect(screen.getByText("24:18")).toHaveClass("tabular-nums")
    expect(screen.getByTestId("bar")).toHaveClass("justify-between")
  })

  it("names a tile on its chip, shows the mic-off mark when muted, and draws the speaking ring", () => {
    const { rerender } = render(<ParticipantTile name="Mona Darwish" photo={{ src: "/m.webp", alt: "Mona" }} speaking data-testid="tile" />)
    expect(screen.getByAltText("Mona")).toHaveAttribute("src", "/m.webp")
    expect(screen.getByText("Mona Darwish")).toBeInTheDocument()
    expect(screen.getByTestId("tile")).toHaveAttribute("data-speaking")
    expect(screen.getByTestId("tile").className).toContain("ring-border")
    rerender(<ParticipantTile name="Mona Darwish" initials="MD" muted data-testid="tile" />)
    expect(screen.getByText("MD")).toBeInTheDocument()
    expect(screen.getByTestId("tile")).not.toHaveAttribute("data-speaking")
  })

  it("puts the name chip on the start or the end, or leaves it out", () => {
    const { rerender } = render(<ParticipantTile name="A" chip="end" />)
    expect(screen.getByText("A").closest("[class*=absolute]")?.className).toContain("end-3")
    rerender(<ParticipantTile name="A" chip="none" />)
    expect(screen.queryByText("A")).not.toBeInTheDocument()
  })

  it("has a pin only when asked, and reports it", () => {
    const onPinnedChange = vi.fn()
    const { rerender } = render(<ParticipantTile name="Adam" />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    rerender(<ParticipantTile name="Adam" onPinnedChange={onPinnedChange} pinLabel="Pin Adam" />)
    const pin = screen.getByRole("button", { name: "Pin Adam" })
    expect(pin).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(pin)
    expect(onPinnedChange).toHaveBeenCalledWith(true)
  })
})

const CONTROLS: DockControl[] = [
  { id: "mic", icon: Mic, pressedIcon: MicOff, label: "Mute", pressedLabel: "Unmute", toggle: true },
  { id: "video", icon: Video, pressedIcon: VideoOff, label: "Stop video", pressedLabel: "Start video", toggle: true },
  { id: "hand", icon: Hand, label: "Raise hand", pressedLabel: "Lower hand", kind: "on", toggle: true, hideOnPhone: true },
  { id: "more", icon: Ellipsis, label: "More", menu: [{ id: "settings", label: "Settings" }] },
]

function dock(props: Partial<React.ComponentProps<typeof ControlsDock>> = {}) {
  return render(<ControlsDock label="Call controls" controls={CONTROLS} leaveLabel="Leave" leaveConfirmLabel="Press again to leave" leaveHint="Hold to leave" {...props} />)
}

describe("ControlsDock", () => {
  it("is a labelled group of Icon Buttons with Leave last, so Leave is the end in either direction", () => {
    dock()
    const toolbar = screen.getByRole("group", { name: "Call controls" })
    const buttons = within(toolbar).getAllByRole("button")
    expect(buttons.map((b) => b.getAttribute("data-control"))).toEqual(["mic", "video", "hand", "more", "leave"])
    expect(buttons[0]).toHaveClass("bg-primary", "rounded-full", "size-11")
    expect(buttons[4]).toHaveClass("bg-destructive")
  })

  it("makes Leave an icon-only 44px button on phones and a labelled 40px one from Tablet", () => {
    dock()
    const leave = document.querySelector("[data-control=leave]")!
    expect(leave).toHaveClass("size-11", "[@container(min-width:40rem)]:h-10", "[@container(min-width:40rem)]:w-auto")
    expect(leave).toHaveAccessibleName("Leave")
    expect(leave.querySelector("span.hidden")).toHaveTextContent("Leave")
  })

  it("trims the controls marked hideOnPhone from the phone layout only", () => {
    dock()
    expect(document.querySelector("[data-control=hand]")!.parentElement).toHaveClass("hidden", "[@container(min-width:40rem)]:block")
    expect(document.querySelector("[data-control=hand]")!.parentElement).not.toHaveClass("flex")
    expect(document.querySelector("[data-control=mic]")!.parentElement).not.toHaveClass("hidden")
  })

  it("keeps a trimmed control's caption under it from Tablet, in the labelled dock", () => {
    dock({ density: "labelled" })
    expect(document.querySelector("[data-control=hand]")!.parentElement).toHaveClass("hidden", "[@container(min-width:40rem)]:flex", "flex-col")
  })

  it("toggles mic and camera: pressed state, new name, destructive tone, and the callback", () => {
    const onControl = vi.fn()
    dock({ onControl })
    const mic = screen.getByRole("button", { name: "Mute" })
    expect(mic).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(mic)
    const unmute = screen.getByRole("button", { name: "Unmute" })
    expect(unmute).toHaveAttribute("aria-pressed", "true")
    expect(unmute).toHaveClass("bg-destructive")
    expect(onControl).toHaveBeenLastCalledWith("mic", true)
    fireEvent.click(unmute)
    expect(screen.getByRole("button", { name: "Mute" })).toHaveClass("bg-primary")
    expect(onControl).toHaveBeenLastCalledWith("mic", false)
  })

  it("turns an `on` control secondary rather than destructive when it is pressed", () => {
    dock()
    fireEvent.click(screen.getByRole("button", { name: "Raise hand" }))
    const lowered = screen.getByRole("button", { name: "Lower hand" })
    expect(lowered).toHaveClass("bg-secondary")
    expect(lowered).not.toHaveClass("bg-destructive")
  })

  it("starts a control pressed when asked", () => {
    dock({ controls: [{ ...CONTROLS[0]!, defaultPressed: true }] })
    expect(screen.getByRole("button", { name: "Unmute" })).toHaveAttribute("aria-pressed", "true")
  })

  it("cross-fades the glyph in 100ms and settles under reduced motion", () => {
    dock()
    const mic = screen.getByRole("button", { name: "Mute" })
    const glyphs = mic.querySelectorAll("svg")
    expect(glyphs).toHaveLength(2)
    for (const glyph of glyphs) expect(glyph.getAttribute("class")).toContain("duration-100")
    expect(mic.className).toContain("motion-reduce:transition-none")
    expect(mic.className).toContain("hover:motion-safe:scale-[1.06]")
    expect(mic.className).toContain("active:motion-safe:scale-[0.96]")
  })

  it("labels each control in the labelled density, and the label follows the pressed state", () => {
    dock({ density: "labelled", controls: [{ ...CONTROLS[0]!, caption: "Mute", pressedCaption: "Unmute" }] })
    expect(screen.getByText("Mute", { selector: "span" })).toHaveClass("text-muted-foreground")
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(screen.getByText("Unmute", { selector: "span" })).toBeInTheDocument()
  })

  it("opens the More menu and reports the chosen item", async () => {
    const onMenuAction = vi.fn()
    dock({ onMenuAction })
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "More" }))
    })
    const item = await screen.findByRole("menuitem", { name: "Settings" })
    await act(async () => {
      fireEvent.pointerDown(item, { pointerType: "mouse" })
      fireEvent.mouseDown(item)
      fireEvent.pointerUp(item, { pointerType: "mouse" })
      fireEvent.mouseUp(item)
      fireEvent.click(item)
    })
    expect(onMenuAction).toHaveBeenCalledWith("settings")
  })

  describe("Leave", () => {
    it("leaves only once it has been held for 400ms", () => {
      vi.useFakeTimers()
      const onLeave = vi.fn()
      dock({ onLeave })
      const leave = screen.getByRole("button", { name: "Leave" })
      fireEvent.pointerDown(leave, { pointerType: "mouse", button: 0 })
      act(() => void vi.advanceTimersByTime(399))
      expect(onLeave).not.toHaveBeenCalled()
      act(() => void vi.advanceTimersByTime(2))
      expect(onLeave).toHaveBeenCalledTimes(1)
    })

    it("does not leave when the press ends early, and shows the hint instead", () => {
      vi.useFakeTimers()
      const onLeave = vi.fn()
      dock({ onLeave })
      const leave = screen.getByRole("button", { name: "Leave" })
      fireEvent.pointerDown(leave, { pointerType: "mouse", button: 0 })
      act(() => void vi.advanceTimersByTime(150))
      fireEvent.pointerUp(leave, { pointerType: "mouse" })
      fireEvent.click(leave, { detail: 1 })
      act(() => void vi.advanceTimersByTime(1000))
      expect(onLeave).not.toHaveBeenCalled()
      expect(screen.getByRole("status")).toHaveTextContent("Hold to leave")
    })

    it("holds with the pointer by growing a fill over the hold time, unless motion is reduced", () => {
      const { calls, restore } = stubAnimate()
      dock({ holdMs: 400 })
      fireEvent.pointerDown(screen.getByRole("button", { name: "Leave" }), { pointerType: "mouse", button: 0 })
      expect(calls.some((call) => call.options.duration === 400 && JSON.stringify(call.keyframes).includes("100%"))).toBe(true)
      restore()
      const restoreMotion = stubReducedMotion(true)
      const second = stubAnimate()
      cleanup()
      dock()
      fireEvent.pointerDown(screen.getByRole("button", { name: "Leave" }), { pointerType: "mouse", button: 0 })
      expect(second.calls.some((call) => call.options.duration === 400)).toBe(false)
      second.restore()
      restoreMotion()
    })

    it("keeps Leave's label on phones in the labelled dock, and drops it in the compact one", () => {
    const { rerender } = dock()
    expect(document.querySelector("[data-control=leave] span.hidden")).not.toBeNull()
    rerender(<ControlsDock label="c" controls={CONTROLS} leaveLabel="Leave" leaveConfirmLabel="again" leaveHint="Hold" leaveLabelled />)
    const leave = document.querySelector("[data-control=leave]")!
    expect(leave).toHaveClass("h-10", "px-6")
    expect(leave).not.toHaveClass("size-11")
    expect(leave.querySelector("span.hidden")).toBeNull()
  })

  it("takes a second press from the keyboard, within three seconds, to leave", () => {
      vi.useFakeTimers()
      const onLeave = vi.fn()
      dock({ onLeave })
      const leave = screen.getByRole("button", { name: "Leave" })
      fireEvent.click(leave, { detail: 0 })
      expect(onLeave).not.toHaveBeenCalled()
      expect(leave).toHaveAttribute("data-armed")
      expect(leave).toHaveAccessibleName("Press again to leave")
      fireEvent.click(leave, { detail: 0 })
      expect(onLeave).toHaveBeenCalledTimes(1)
      expect(leave).not.toHaveAttribute("data-armed")
    })

    it("disarms by itself after three seconds", () => {
      vi.useFakeTimers()
      const onLeave = vi.fn()
      dock({ onLeave })
      const leave = screen.getByRole("button", { name: "Leave" })
      fireEvent.click(leave, { detail: 0 })
      act(() => void vi.advanceTimersByTime(3001))
      expect(leave).not.toHaveAttribute("data-armed")
      fireEvent.click(leave, { detail: 0 })
      expect(onLeave).not.toHaveBeenCalled()
    })

    it("can be left out of a row of controls", () => {
      dock({ hideLeave: true })
      expect(document.querySelector("[data-control=leave]")).toBeNull()
    })
  })
})

describe("Call Controls Dock", () => {
  it("shows the three densities in one card, in English", () => {
    render(<VideoCallCallControlsDock />)
    expect(screen.getByRole("heading", { level: 2, name: "Everything within thumb reach" })).toBeInTheDocument()
    expect(screen.getByText("IN-CALL CONTROLS")).toBeInTheDocument()
    expect(screen.getAllByRole("group").map((t) => t.getAttribute("aria-label"))).toEqual(["Compact dock", "Labelled dock", "Dock with mic and camera off"])
    expect(screen.getAllByRole("separator")).toHaveLength(2)
    expect(screen.getByRole("tooltip")).toHaveTextContent("You're muted. Press ⌘ D to talk")
  })

  it("shows the states row with the mic and camera already off", () => {
    render(<VideoCallCallControlsDock />)
    const states = screen.getByRole("group", { name: "Dock with mic and camera off" })
    expect(within(states).getByRole("button", { name: "Unmute" })).toHaveAttribute("aria-pressed", "true")
    expect(within(states).getByRole("button", { name: "Start video" })).toHaveAttribute("aria-pressed", "true")
  })

  it("has the compact row's eight controls and the labelled row's seven, plus Leave", () => {
    render(<VideoCallCallControlsDock />)
    const [compact, labelled] = screen.getAllByRole("group")
    expect(within(compact!).getAllByRole("button")).toHaveLength(9)
    expect(within(labelled!).getAllByRole("button")).toHaveLength(8)
    expect(within(labelled!).getByText("Record")).toBeInTheDocument()
  })

  it("speaks Arabic with the shortcut isolated, no dashes or middle dots in the prose", () => {
    render(<div dir="rtl"><VideoCallCallControlsDock locale="ar" /></div>)
    expect(screen.getByRole("heading", { level: 2, name: "كل شيء في متناول إبهامك" })).toBeInTheDocument()
    const tip = screen.getByRole("tooltip")
    expect(tip.querySelector("bdi")).toHaveTextContent("⌘ D")
    expect(tip.querySelector("bdi")).toHaveAttribute("dir", "ltr")
    const arabic = strings(videoCallCallControlsDockCopy.ar).join(" ")
    expect(arabic).not.toMatch(/—|·|\(/)
    expect(arabic).not.toMatch(/[٠-٩]/)
  })

  it("reports a control and a Leave held to the end", () => {
    vi.useFakeTimers()
    const onControl = vi.fn()
    const onLeave = vi.fn()
    render(<VideoCallCallControlsDock onControl={onControl} onLeave={onLeave} />)
    const [compact] = screen.getAllByRole("group")
    fireEvent.click(within(compact!).getByRole("button", { name: "Mute" }))
    expect(onControl).toHaveBeenCalledWith("mic", true)
    fireEvent.pointerDown(within(compact!).getByRole("button", { name: "Leave" }), { pointerType: "mouse", button: 0 })
    act(() => void vi.advanceTimersByTime(401))
    expect(onLeave).toHaveBeenCalledTimes(1)
  })

  it("takes its copy from props over the locale's", () => {
    render(<VideoCallCallControlsDock heading="Custom" leave="Hang up" />)
    expect(screen.getByRole("heading", { level: 2, name: "Custom" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Hang up" }).length).toBe(3)
  })
})

describe("Captions & Reactions", () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it("shows the speaker, the raise-hand chip, the two caption lines and the picker, in English", () => {
    render(<VideoCallCaptionsReactions photo={{ src: "/k.webp", alt: "Adam" }} />)
    expect(screen.getByAltText("Adam")).toHaveAttribute("src", "/k.webp")
    expect(screen.getAllByText("Nour Khalil raised a hand · 2 in queue")).toHaveLength(1)
    expect(screen.getByText("Live captions · English")).toBeInTheDocument()
    expect(screen.getByText("Agreed. I'll take the lobby states.")).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Send a reaction" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: /Thumbs up|Heart|Celebrate|Smile|Raised hand/ })).toHaveLength(5)
  })

  it("paints the caption bar with the inverse tokens and sizes it by the block's width", () => {
    render(<VideoCallCaptionsReactions />)
    const bar = screen.getByText("Live captions · English").closest("[role=group]")!
    expect(bar).toHaveClass("bg-background-inverse", "text-foreground-inverse", "w-full", "[@container(min-width:40rem)]:w-[74%]", "[@container(min-width:64rem)]:w-[62%]")
    expect(screen.getByText("Live captions · English").closest("p")).toHaveClass("text-muted-foreground-inverse")
  })

  it("keeps only the last two lines in the window and rises a new one in", () => {
    const { calls, restore } = stubAnimate()
    const captions = [
      { id: "a", speaker: "A", text: "first" },
      { id: "b", speaker: "B", text: "second" },
    ]
    const { rerender } = render(<VideoCallCaptionsReactions captions={captions} handQueue={null} />)
    calls.length = 0
    rerender(<VideoCallCaptionsReactions captions={[...captions, { id: "c", speaker: "C", text: "third" }]} handQueue={null} />)
    expect(screen.queryByText("first")).not.toBeInTheDocument()
    expect(screen.getByText("second")).toBeInTheDocument()
    expect(screen.getByText("third")).toBeInTheDocument()
    const rise = calls.find((call) => JSON.stringify(call.keyframes).includes("translateY(100%)"))
    expect(rise?.options.duration).toBe(180)
    restore()
  })

  it("fades a caption in 120ms instead of rising it under reduced motion", () => {
    const restoreMotion = stubReducedMotion(true)
    const { calls, restore } = stubAnimate()
    const captions = [{ id: "a", speaker: "A", text: "first" }]
    const { rerender } = render(<VideoCallCaptionsReactions captions={captions} handQueue={null} />)
    calls.length = 0
    rerender(<VideoCallCaptionsReactions captions={[...captions, { id: "b", speaker: "B", text: "second" }]} handQueue={null} />)
    expect(calls.some((call) => call.options.duration === 120 && !JSON.stringify(call.keyframes).includes("translate"))).toBe(true)
    restore()
    restoreMotion()
  })

  it("slides the raise-hand chip down once and clears it on request", () => {
    const { calls, restore } = stubAnimate()
    const onHandClear = vi.fn()
    render(<VideoCallCaptionsReactions onHandClear={onHandClear} />)
    expect(calls.some((call) => JSON.stringify(call.keyframes).includes("translateY(-12px)"))).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Clear raised hand" }))
    expect(onHandClear).toHaveBeenCalledTimes(1)
    restore()
  })

  it("has no close button on the chip without onHandClear, and no chip when nobody has a hand up", () => {
    const { rerender } = render(<VideoCallCaptionsReactions />)
    expect(screen.queryByRole("button", { name: "Clear raised hand" })).not.toBeInTheDocument()
    rerender(<VideoCallCaptionsReactions handQueue={null} />)
    expect(screen.queryByText(/raised a hand/)).not.toBeInTheDocument()
  })

  it("gives the phone a short chip and leaves the speaker chip to Tablet and up", () => {
    render(<VideoCallCaptionsReactions />)
    expect(screen.getByText("Nour K. · 2 in queue")).toHaveClass("[@container(min-width:40rem)]:hidden")
    const chip = document.querySelector("[class*='bottom-5'][class*='absolute']")!
    expect(chip).toHaveTextContent("Adam Farouk")
    expect(chip).toHaveClass("hidden", "[@container(min-width:40rem)]:inline-flex")
  })

  it("reports a reaction and floats it up; eight run at once and the rest wait", () => {
    const { restore } = stubAnimate()
    const onReact = vi.fn()
    render(<VideoCallCaptionsReactions onReact={onReact} />)
    const heart = screen.getByRole("group", { name: "Send a reaction" }).querySelector("[data-reaction=heart]")!
    for (let i = 0; i < 10; i++) fireEvent.click(heart)
    expect(onReact).toHaveBeenCalledTimes(10)
    expect(document.querySelectorAll("[data-reaction-drift]")).toHaveLength(8)
    restore()
  })

  it("drifts a reaction 120 to 180px on a wave over 2.4s, and only fades it under reduced motion", () => {
    const { calls, restore } = stubAnimate()
    render(<VideoCallCaptionsReactions />)
    fireEvent.click(screen.getByRole("group", { name: "Send a reaction" }).querySelector("[data-reaction=smile]")!)
    const drift = calls.find((call) => call.options.duration === 2400)!
    expect(JSON.stringify(drift.keyframes)).toMatch(/translate\(0, -1[2-8]\dpx\)/)
    restore()
    const restoreMotion = stubReducedMotion(true)
    const second = stubAnimate()
    cleanup()
    render(<VideoCallCaptionsReactions />)
    fireEvent.click(screen.getByRole("group", { name: "Send a reaction" }).querySelector("[data-reaction=smile]")!)
    expect(second.calls.some((call) => call.options.duration === 2400)).toBe(false)
    expect(second.calls.some((call) => call.options.duration === 1200 && !JSON.stringify(call.keyframes).includes("translate"))).toBe(true)
    second.restore()
    restoreMotion()
  })

  it("toggles the picker from the dock's reactions control", () => {
    render(<VideoCallCaptionsReactions />)
    expect(screen.getByRole("group", { name: "Send a reaction" })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Reactions" }))
    expect(screen.queryByRole("group", { name: "Send a reaction" })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Reactions" }))
    expect(screen.getByRole("group", { name: "Send a reaction" })).toBeInTheDocument()
  })

  it("reports dock controls and a held Leave", () => {
    vi.useFakeTimers()
    const onControl = vi.fn()
    const onLeave = vi.fn()
    render(<VideoCallCaptionsReactions onControl={onControl} onLeave={onLeave} />)
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(onControl).toHaveBeenCalledWith("mic", true)
    fireEvent.pointerDown(screen.getByRole("button", { name: "Leave" }), { pointerType: "mouse", button: 0 })
    act(() => void vi.advanceTimersByTime(401))
    expect(onLeave).toHaveBeenCalled()
  })

  it("speaks Arabic with the names in Arabic, no dashes or middle dots in the prose and Western digits", () => {
    render(<div dir="rtl"><VideoCallCaptionsReactions locale="ar" /></div>)
    expect(screen.getByText("التسميات المباشرة بالإنجليزية")).toBeInTheDocument()
    expect(screen.getByText("منى درويش")).toBeInTheDocument()
    const arabic = strings(videoCallCaptionsReactionsCopy.ar).join(" ")
    expect(arabic).not.toMatch(/—|·|\(|[A-Za-z]{3,}/)
    expect(arabic).not.toMatch(/[٠-٩]/)
    const figures = [...document.querySelectorAll("bdi")].filter((bdi) => bdi.textContent === "2")
    expect(figures.length).toBeGreaterThan(0)
    for (const figure of figures) expect(figure).toHaveAttribute("dir", "ltr")
    expect(figures.map((figure) => figure.parentElement?.textContent)).toContain("نور خليل رفعت يدها، 2 في الانتظار")
  })

  it("does not ask for a camera or draw a video element", () => {
    const { container } = render(<VideoCallCaptionsReactions photo={{ src: "/k.webp", alt: "" }} />)
    expect(container.querySelector("video")).toBeNull()
    expect(container.querySelector("img")).toBeInTheDocument()
  })
})
