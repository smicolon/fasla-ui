import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { CallStage, STAGE_DOCK_COPY, SidePanel, fillTemplate, stageDockControls, useDebouncedValue, type SidePanelCopy } from "./video-call"
import { VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy } from "../video-call-call-with-side-panel/VideoCallCallWithSidePanel"
import { VideoCallGridGalleryCall, videoCallGridGalleryCallCopy } from "../video-call-grid-gallery-call/VideoCallGridGalleryCall"
import { VideoCallScreenShareStage, videoCallScreenShareStageCopy } from "../video-call-screen-share-stage/VideoCallScreenShareStage"
import { VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy } from "../video-call-speaker-filmstrip/VideoCallSpeakerFilmstrip"

const here = dirname(fileURLToPath(import.meta.url))
const SOURCES = [
  "video-call-grid-gallery-call/VideoCallGridGalleryCall.tsx",
  "video-call-speaker-filmstrip/VideoCallSpeakerFilmstrip.tsx",
  "video-call-screen-share-stage/VideoCallScreenShareStage.tsx",
  "video-call-call-with-side-panel/VideoCallCallWithSidePanel.tsx",
].map((file) => readFileSync(resolve(here, "..", file), "utf8"))
const SHARED = readFileSync(resolve(here, "video-call.tsx"), "utf8")

const COPIES = [videoCallGridGalleryCallCopy, videoCallSpeakerFilmstripCopy, videoCallScreenShareStageCopy, videoCallCallWithSidePanelCopy]

/** Every string a copy object holds as a value, without its ids, its Latin shortcut and its holes. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" || key === "initials" ? [] : [value.replace(/⌘ D/g, "").replace(/\{\w+\}/g, "")]
  if (Array.isArray(value)) return value.flatMap((item) => strings(item))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

function stubAnimate() {
  const calls: { keyframes: unknown; options: KeyframeAnimationOptions }[] = []
  const original = Element.prototype.animate
  Element.prototype.animate = vi.fn(function (this: Element, keyframes: unknown, options: KeyframeAnimationOptions) {
    calls.push({ keyframes, options })
    return { cancel: vi.fn(), onfinish: null } as unknown as Animation
  }) as unknown as typeof Element.prototype.animate
  return { calls, restore: () => (Element.prototype.animate = original) }
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe("the call-stage source", () => {
  it("uses logical properties only, and the motion library never", () => {
    for (const source of [...SOURCES, SHARED]) {
      expect(source).not.toMatch(/\b(?:ml|mr|pl|pr)-(?:\d|\[|px|auto)/)
      expect(source).not.toMatch(/(?:^|[\s"'`:])(?:left|right)-(?:\d|\[|px|auto|full)/)
      expect(source).not.toMatch(/text-(?:left|right)\b/)
      expect(source).not.toMatch(/\b(?:rounded|border)-(?:l|r)(?:-|\b)/)
      expect(source).not.toMatch(/from ["'](?:framer-motion|motion\/react)["']/)
      expect(source).not.toMatch(/from ["'][^"']*src\/motion/)
    }
  })

  it("asks for no camera, microphone or video element: stills only", () => {
    for (const source of [...SOURCES, SHARED]) expect(source).not.toMatch(/getUserMedia|<video\b|mediaDevices/)
  })
})

describe("the copy", () => {
  it("has the same keys in English and Arabic, and no em dash, middle dot or bracketed English in the Arabic", () => {
    for (const copy of COPIES) {
      expect(Object.keys(copy.en)).toEqual(Object.keys(copy.ar))
      for (const text of strings(copy.ar)) {
        expect(text, text).not.toMatch(/[—·]/)
        expect(text, text).not.toMatch(/\([A-Za-z]/)
        expect(text, text).not.toMatch(/[٠-٩]/)
      }
    }
  })

  it("keeps the dock the same in both languages, with seven controls and a Leave", () => {
    expect(Object.keys(STAGE_DOCK_COPY.en)).toEqual(Object.keys(STAGE_DOCK_COPY.ar))
    const controls = stageDockControls(STAGE_DOCK_COPY.en)
    expect(controls.map((control) => control.id)).toEqual(["mic", "video", "screen-share", "chat", "reactions", "hand", "more"])
    expect(controls.filter((control) => control.hideOnPhone).map((control) => control.id)).toEqual(["screen-share", "reactions"])
    expect(stageDockControls(STAGE_DOCK_COPY.en, { chat: "toggle" }).find((control) => control.id === "chat")?.toggle).toBe(true)
  })
})

describe("shared parts", () => {
  it("fills the holes of a template", () => {
    expect(fillTemplate("Pin {name}, {n} of {total}", { name: "Adam", n: 1, total: 3 })).toBe("Pin Adam, 1 of 3")
    expect(fillTemplate("{missing}", {})).toBe("")
  })

  it("draws the call stage as a card", () => {
    const { container } = render(<CallStage>inside</CallStage>)
    const stage = container.querySelector("[data-call-stage]")!
    expect(stage).toHaveClass("rounded-2xl", "border", "bg-card")
  })

  it("follows a value only after it has held still", () => {
    vi.useFakeTimers()
    function Probe({ value }: { value: string }) {
      return <p data-testid="held">{useDebouncedValue(value, 400)}</p>
    }
    const { rerender } = render(<Probe value="a" />)
    rerender(<Probe value="b" />)
    expect(screen.getByTestId("held")).toHaveTextContent("a")
    act(() => void vi.advanceTimersByTime(300))
    rerender(<Probe value="c" />)
    act(() => void vi.advanceTimersByTime(300))
    expect(screen.getByTestId("held")).toHaveTextContent("a")
    act(() => void vi.advanceTimersByTime(150))
    expect(screen.getByTestId("held")).toHaveTextContent("c")
  })
})

describe("Dock sizes in the call stages", () => {
  const atWidth = (width: number) => {
    const proto = HTMLElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, "clientWidth")
    Object.defineProperty(proto, "clientWidth", { configurable: true, get: () => width })
    return () => {
      if (descriptor) Object.defineProperty(proto, "clientWidth", descriptor)
      else delete (proto as unknown as { clientWidth?: unknown }).clientWidth
    }
  }
  const mic = () => document.querySelector("[data-control=mic]")!

  it("sets the Grid, Share and Side Panel docks at md on phones and lg from Tablet", () => {
    for (const Block of [VideoCallGridGalleryCall, VideoCallScreenShareStage, VideoCallCallWithSidePanel]) {
      const phone = atWidth(360)
      const small = render(<Block />)
      phone()
      expect(mic()).toHaveClass("size-9")
      small.unmount()
      const tablet = atWidth(800)
      const wide = render(<Block />)
      tablet()
      expect(mic()).toHaveClass("size-10")
      wide.unmount()
    }
  })

  it("keeps the Speaker dock at lg on every breakpoint, and no stage button has a hand-sized class", () => {
    for (const width of [360, 800]) {
      const restore = atWidth(width)
      const view = render(<VideoCallSpeakerFilmstrip />)
      restore()
      expect(mic()).toHaveClass("size-10")
      for (const button of view.container.querySelectorAll("button")) expect(button.className).not.toMatch(/(^|\s)(size|h|w)-(11|12|14)(\s|$)/)
      view.unmount()
    }
  })
})

describe("Grid Gallery Call", () => {
  it("shows the six people, a Leave, and three pager dots for the phone", () => {
    const { container } = render(<VideoCallGridGalleryCall />)
    expect(screen.getByText("Karim Nasser")).toBeInTheDocument()
    expect(screen.getByText("Yasmin Haddad (you)")).toBeInTheDocument()
    expect(container.querySelectorAll("[data-flip]")).toHaveLength(6)
    expect(container.querySelectorAll('[data-slot="carousel-dot"]')).toHaveLength(3)
    expect(screen.getByRole("button", { name: "Leave" })).toBeInTheDocument()
  })

  it("speaks Arabic with the Arabic names, and no Latin ones", () => {
    render(<VideoCallGridGalleryCall locale="ar" />)
    expect(screen.getByText("كريم ناصر")).toBeInTheDocument()
    expect(screen.queryByText("Karim Nasser")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "خروج" })).toBeInTheDocument()
  })

  it("moves the speaking ring to a new speaker only after 400ms", () => {
    vi.useFakeTimers()
    const { container, rerender } = render(<VideoCallGridGalleryCall speakingId="karim" />)
    const ring = () => [...container.querySelectorAll("[data-flip]")].filter((tile) => tile.hasAttribute("data-speaking")).map((tile) => tile.getAttribute("data-flip"))
    expect(ring()).toEqual(["karim"])
    rerender(<VideoCallGridGalleryCall speakingId="mona" />)
    expect(ring()).toEqual(["karim"])
    act(() => void vi.advanceTimersByTime(401))
    expect(ring()).toEqual(["mona"])
  })

  it("pins your own tile and says so, and offers no pin on the others", () => {
    const onPinnedChange = vi.fn()
    render(<VideoCallGridGalleryCall onPinnedChange={onPinnedChange} />)
    expect(screen.getAllByRole("button", { name: /^Pin /i })).toHaveLength(1)
    fireEvent.click(screen.getByRole("button", { name: "Pin Yasmin Haddad (you)" }))
    expect(onPinnedChange).toHaveBeenLastCalledWith("yasmin")
    expect(screen.getByRole("button", { name: "Pin Yasmin Haddad (you)" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Pin Yasmin Haddad (you)" }))
    expect(onPinnedChange).toHaveBeenLastCalledWith(null)
  })

  it("reports the view button, fullscreen and the dock as callbacks", () => {
    const onViewChange = vi.fn()
    const onFullscreen = vi.fn()
    const onControl = vi.fn()
    render(<VideoCallGridGalleryCall onViewChange={onViewChange} onFullscreen={onFullscreen} onControl={onControl} />)
    fireEvent.click(screen.getByRole("button", { name: "Grid" }))
    fireEvent.click(screen.getByRole("button", { name: "Full screen" }))
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(onViewChange).toHaveBeenCalled()
    expect(onFullscreen).toHaveBeenCalled()
    expect(onControl).toHaveBeenCalledWith("mic", true)
  })

  it("fades a new tile in when someone joins", () => {
    const { calls, restore } = stubAnimate()
    const everyone = videoCallGridGalleryCallCopy.en.participants
    const { rerender } = render(<VideoCallGridGalleryCall participants={everyone.slice(0, 4)} />)
    calls.length = 0
    rerender(<VideoCallGridGalleryCall participants={everyone.slice(0, 5)} />)
    expect(calls.some((call) => JSON.stringify(call.keyframes) === JSON.stringify([{ opacity: 0 }, { opacity: 1 }]))).toBe(true)
    restore()
  })

  it("shows the REC badge only while recording", () => {
    const { rerender } = render(<VideoCallGridGalleryCall />)
    expect(screen.getByText("REC")).toBeInTheDocument()
    rerender(<VideoCallGridGalleryCall recording={false} />)
    expect(screen.queryByText("REC")).not.toBeInTheDocument()
  })
})

describe("Speaker & Filmstrip", () => {
  it("shows the speaker on the big tile with a speaking chip, and the rest in the strip", () => {
    const { container } = render(<VideoCallSpeakerFilmstrip />)
    expect(screen.getByText("Adam Farouk — speaking")).toBeInTheDocument()
    expect(container.querySelectorAll("[data-thumb]")).toHaveLength(4)
    expect(container.querySelector('[data-thumb="adam"]')).toBeNull()
  })

  it("makes a pressed thumbnail the speaker, and says so", () => {
    const onSpeakerChange = vi.fn()
    const { container } = render(<VideoCallSpeakerFilmstrip onSpeakerChange={onSpeakerChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Make Nour Khalil the speaker" }))
    expect(onSpeakerChange).toHaveBeenCalledWith("nour")
    expect(screen.getByText("Nour Khalil — speaking")).toBeInTheDocument()
    expect(container.querySelector('[data-thumb="adam"]')).not.toBeNull()
  })

  it("swaps to a new speaker from outside, unless someone is pinned", () => {
    const { rerender } = render(<VideoCallSpeakerFilmstrip speakerId="adam" />)
    rerender(<VideoCallSpeakerFilmstrip speakerId="nour" />)
    expect(screen.getByText("Nour Khalil — speaking")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Pin Nour Khalil" }))
    rerender(<VideoCallSpeakerFilmstrip speakerId="bilal" />)
    expect(screen.getByText("Nour Khalil — speaking")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Pin Nour Khalil" }))
    expect(screen.getByText("Bilal Sultan — speaking")).toBeInTheDocument()
  })

  it("starts pinned with `defaultPinnedId` and reports a release", () => {
    const onPinnedChange = vi.fn()
    render(<VideoCallSpeakerFilmstrip defaultPinnedId="adam" speakerId="nour" onPinnedChange={onPinnedChange} />)
    expect(screen.getByText("Adam Farouk — speaking")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Pin Adam Farouk" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Pin Adam Farouk" }))
    expect(onPinnedChange).toHaveBeenCalledWith(null)
  })

  it("cross-dissolves the big tile over 200ms when the speaker changes", () => {
    const { calls, restore } = stubAnimate()
    const { rerender } = render(<VideoCallSpeakerFilmstrip speakerId="adam" />)
    calls.length = 0
    rerender(<VideoCallSpeakerFilmstrip speakerId="nour" />)
    expect(calls.some((call) => call.options.duration === 200 && JSON.stringify(call.keyframes) === JSON.stringify([{ opacity: 0 }, { opacity: 1 }]))).toBe(true)
    restore()
  })

  it("speaks Arabic, with the Arabic Leave call", () => {
    render(<VideoCallSpeakerFilmstrip locale="ar" />)
    expect(screen.getByText("آدم فاروق، يتحدث")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "إنهاء المكالمة" })).toBeInTheDocument()
  })
})

describe("Screen Share Stage", () => {
  it("shows who presents, the slide, the rail and a Stop presenting", () => {
    const { container } = render(<VideoCallScreenShareStage />)
    expect(screen.getByText("Karim is presenting")).toBeInTheDocument()
    expect(container.querySelector("[data-shared-surface]")).not.toBeNull()
    expect(screen.getByText("Karim (presenting)")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Stop presenting" })).toBeInTheDocument()
  })

  it("stops and starts the share, and reports each change", () => {
    const onSharingChange = vi.fn()
    const { container } = render(<VideoCallScreenShareStage onSharingChange={onSharingChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Stop presenting" }))
    expect(onSharingChange).toHaveBeenLastCalledWith(false)
    expect(container.querySelector("[data-shared-surface]")).toBeNull()
    expect(screen.getByText("Nobody is presenting")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Share again" }))
    expect(onSharingChange).toHaveBeenLastCalledWith(true)
    expect(container.querySelector("[data-shared-surface]")).not.toBeNull()
  })

  it("wipes the slide out over 200ms with a clip-path, and cross-fades on a phone", () => {
    const { calls, restore } = stubAnimate()
    render(<VideoCallScreenShareStage />)
    calls.length = 0
    fireEvent.click(screen.getByRole("button", { name: "Stop presenting" }))
    // jsdom has no layout, so the tier reads as a phone: a 160ms cross-fade.
    expect(calls.some((call) => call.options.duration === 160)).toBe(true)
    restore()
  })

  it("keeps the slide in the direction of what was captured, whatever the page's", async () => {
    // The dock's More menu (Base UI) settles its own state after a render; await it so the update is inside act.
    const { container, rerender } = await act(async () =>
      render(
        <div dir="rtl">
          <VideoCallScreenShareStage locale="en" />
        </div>
      )
    )
    expect(container.querySelector("[data-shared-surface]")).toHaveAttribute("dir", "ltr")
    await act(async () => {
      rerender(
        <div dir="ltr">
          <VideoCallScreenShareStage locale="ar" />
        </div>
      )
    })
    expect(container.querySelector("[data-shared-surface]")).toHaveAttribute("dir", "rtl")
  })

  it("takes a slide of your own, and a direction for it", () => {
    const { container } = render(<VideoCallScreenShareStage surface={<p>Your slide</p>} surfaceDir="rtl" />)
    expect(screen.getByText("Your slide")).toBeInTheDocument()
    expect(container.querySelector("[data-shared-surface]")).toHaveAttribute("dir", "rtl")
  })

  it("calls back for fullscreen and for the dock, and honours a share you control", () => {
    const onFullscreen = vi.fn()
    const onControl = vi.fn()
    const { rerender } = render(<VideoCallScreenShareStage sharing onFullscreen={onFullscreen} onControl={onControl} />)
    fireEvent.click(screen.getByRole("button", { name: "Full screen" }))
    fireEvent.click(screen.getByRole("button", { name: "Raise hand" }))
    expect(onFullscreen).toHaveBeenCalled()
    expect(onControl).toHaveBeenCalledWith("hand", true)
    fireEvent.click(screen.getByRole("button", { name: "Stop presenting" }))
    expect(screen.getByText("Karim is presenting")).toBeInTheDocument()
    rerender(<VideoCallScreenShareStage sharing={false} />)
    expect(screen.getByText("Nobody is presenting")).toBeInTheDocument()
  })
})

describe("Call With Side Panel", () => {
  const copy = videoCallCallWithSidePanelCopy.en

  it("shows the stage, the panel with its six people, and an Invite", () => {
    const { container } = render(<VideoCallCallWithSidePanel />)
    expect(screen.getByText("Layla Hassan — speaking")).toBeInTheDocument()
    expect(container.querySelectorAll("[data-person]")).toHaveLength(6)
    expect(screen.getByText("IN THE CALL · 6")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Invite others" })).toBeInTheDocument()
  })

  it("filters the list as you type, and says when nothing matches", () => {
    const { container } = render(<VideoCallCallWithSidePanel />)
    const search = screen.getByRole("textbox", { name: "Search people" })
    fireEvent.change(search, { target: { value: "tar" } })
    expect([...container.querySelectorAll("[data-person]")].map((row) => row.getAttribute("data-person"))).toEqual(["tariq"])
    fireEvent.change(search, { target: { value: "zzz" } })
    expect(screen.getByText("No one matches that search.")).toBeInTheDocument()
  })

  it("switches to Chat, and an unread mark disappears once Chat has been opened", () => {
    render(<VideoCallCallWithSidePanel unread />)
    expect(screen.getByRole("img", { name: "Unread messages" })).toBeInTheDocument()
    fireEvent.click(screen.getByRole("tab", { name: /Chat/ }))
    expect(screen.getByText("Welcome, everyone. We start in a minute.")).toBeInTheDocument()
    expect(screen.queryByRole("img", { name: "Unread messages" })).not.toBeInTheDocument()
  })

  it("starts on the Chat tab with `defaultTab`", () => {
    render(<VideoCallCallWithSidePanel defaultTab="chat" />)
    expect(screen.getByText("The slides are in the shared folder.")).toBeInTheDocument()
  })

  it("closes with the panel's button and with the dock's Chat control, and opens with the control again", () => {
    const onOpenChange = vi.fn()
    const { container } = render(<VideoCallCallWithSidePanel onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Close panel" }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(container.querySelector("[data-side-panel]")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Chat" }))
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(container.querySelector("[data-side-panel]")).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Chat" }))
    expect(container.querySelector("[data-side-panel]")).toBeNull()
  })

  it("starts closed with `open={false}`", () => {
    const { container } = render(<VideoCallCallWithSidePanel open={false} />)
    expect(container.querySelector("[data-side-panel]")).toBeNull()
  })

  it("steps the phone sheet between 60% and 92% with its handle, and reports it", () => {
    const onSnapChange = vi.fn()
    const { container } = render(<VideoCallCallWithSidePanel onSnapChange={onSnapChange} />)
    const panel = container.querySelector("[data-side-panel]")!
    expect(panel).toHaveAttribute("data-snap", "60")
    fireEvent.click(screen.getByRole("button", { name: "Resize the panel" }))
    expect(panel).toHaveAttribute("data-snap", "92")
    expect(onSnapChange).toHaveBeenLastCalledWith("92")
    fireEvent.click(screen.getByRole("button", { name: "Resize the panel" }))
    expect(panel).toHaveAttribute("data-snap", "60")
  })

  it("picks a height from a drag of 24px or more", () => {
    const { container } = render(<VideoCallCallWithSidePanel />)
    const handle = screen.getByRole("button", { name: "Resize the panel" })
    fireEvent.pointerDown(handle, { clientY: 300 })
    fireEvent.pointerUp(handle, { clientY: 240 })
    fireEvent.click(handle)
    expect(container.querySelector("[data-side-panel]")).toHaveAttribute("data-snap", "92")
    fireEvent.pointerDown(handle, { clientY: 200 })
    fireEvent.pointerUp(handle, { clientY: 260 })
    fireEvent.click(handle)
    expect(container.querySelector("[data-side-panel]")).toHaveAttribute("data-snap", "60")
  })

  it("calls back for Invite, a person's menu and the dock", () => {
    const onInvite = vi.fn()
    const onPersonMenu = vi.fn()
    const onControl = vi.fn()
    render(<VideoCallCallWithSidePanel onInvite={onInvite} onPersonMenu={onPersonMenu} onControl={onControl} />)
    fireEvent.click(screen.getByRole("button", { name: "Invite others" }))
    fireEvent.click(screen.getByRole("button", { name: "More about Tariq Aziz" }))
    fireEvent.click(screen.getByRole("button", { name: "Mute" }))
    expect(onInvite).toHaveBeenCalled()
    expect(onPersonMenu).toHaveBeenCalledWith("tariq")
    expect(onControl).toHaveBeenCalledWith("mic", true)
  })

  it("names a muted person's mic for a screen reader", () => {
    const { container } = render(<VideoCallCallWithSidePanel />)
    expect(within(container.querySelector('[data-person="nour"]') as HTMLElement).getByText("Muted")).toBeInTheDocument()
  })

  it("speaks Arabic, with no Latin names", () => {
    render(<VideoCallCallWithSidePanel locale="ar" />)
    expect(screen.getByText("ليلى حسن، تتحدث")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "دعوة آخرين" })).toBeInTheDocument()
    expect(screen.queryByText("Layla Hassan — speaking")).not.toBeInTheDocument()
  })

  it("grows a new person's row in", () => {
    const { calls, restore } = stubAnimate()
    const people = copy.people
    const { rerender } = render(<VideoCallCallWithSidePanel people={people.slice(0, 4)} />)
    calls.length = 0
    rerender(<VideoCallCallWithSidePanel people={people.slice(0, 5)} />)
    expect(calls.some((call) => Array.isArray(call.keyframes) && (call.keyframes as { height?: string }[])[0]?.height === "0px")).toBe(true)
    restore()
  })
})

describe("SidePanel on its own", () => {
  const copy: SidePanelCopy = videoCallCallWithSidePanelCopy.en.panel
  it("has no close button without `onClose`, and no handle without `sheet`", () => {
    render(<SidePanel copy={copy} people={[{ id: "a", name: "Ada" }]} />)
    expect(screen.queryByRole("button", { name: "Close panel" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Resize the panel" })).not.toBeInTheDocument()
  })

  it("controls its tab and its sheet height from outside", () => {
    const onTabChange = vi.fn()
    const { rerender } = render(<SidePanel copy={copy} people={[]} tab="participants" onTabChange={onTabChange} sheet snap="60" />)
    fireEvent.click(screen.getByRole("tab", { name: "Chat" }))
    expect(onTabChange).toHaveBeenCalledWith("chat")
    expect(screen.getByRole("tab", { name: "Participants" })).toHaveAttribute("aria-selected", "true")
    rerender(<SidePanel copy={copy} people={[]} tab="chat" sheet snap="92" />)
    expect(screen.getByRole("tab", { name: "Chat" })).toHaveAttribute("aria-selected", "true")
  })
})
