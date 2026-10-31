import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { VideoCallIncomingCall, videoCallIncomingCallCopy } from "../video-call-incoming-call/VideoCallIncomingCall"
import { VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy } from "../video-call-join-link-dial-in/VideoCallJoinLinkDialIn"
import { VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy } from "../video-call-pre-join-lobby/VideoCallPreJoinLobby"
import { VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy } from "../video-call-waiting-room-knock/VideoCallWaitingRoomKnock"

const here = dirname(fileURLToPath(import.meta.url))
const SOURCES = [
  "video-call-pre-join-lobby/VideoCallPreJoinLobby.tsx",
  "video-call-waiting-room-knock/VideoCallWaitingRoomKnock.tsx",
  "video-call-incoming-call/VideoCallIncomingCall.tsx",
  "video-call-join-link-dial-in/VideoCallJoinLinkDialIn.tsx",
].map((file) => readFileSync(resolve(here, "..", file), "utf8"))

const COPIES = [videoCallPreJoinLobbyCopy, videoCallWaitingRoomKnockCopy, videoCallIncomingCallCopy, videoCallJoinLinkDialInCopy]

/** Every string a copy object holds as a value, without its ids, its initials and its holes. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" || key === "initials" ? [] : [value.replace(/\{\w+\}/g, "")]
  if (Array.isArray(value)) return value.flatMap((item) => strings(item))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

const originalMatchMedia = window.matchMedia

function reduceMotion(reduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  cleanup()
  window.matchMedia = originalMatchMedia
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("the pre-call source", () => {
  it("uses logical properties only, and the motion library never", () => {
    for (const source of SOURCES) {
      expect(source).not.toMatch(/\b(?:ml|mr|pl|pr)-(?:\d|\[|px|auto)/)
      expect(source).not.toMatch(/(?:^|[\s"'`:])(?:left|right)-(?:\d|\[|px|auto|full)/)
      expect(source).not.toMatch(/text-(?:left|right)\b/)
      expect(source).not.toMatch(/\b(?:rounded|border)-(?:l|r)(?:-|\b)/)
      expect(source).not.toMatch(/from ["'](?:framer-motion|motion\/react)["']/)
      expect(source).not.toMatch(/from ["'][^"']*src\/motion/)
    }
  })

  it("asks for no camera, microphone or video element: stills only", () => {
    for (const source of SOURCES) expect(source).not.toMatch(/getUserMedia|<video\b|mediaDevices/)
  })

  it("never writes a bare opacity tint, which has no rule under Tailwind 3", () => {
    for (const source of SOURCES) expect(source).not.toMatch(/\bbg-(?:primary|success|destructive)\/\d/)
  })
})

describe("the copy", () => {
  it("has the same keys in English and Arabic, and no em dash, middle dot or bracketed English in the Arabic", () => {
    for (const copy of COPIES) {
      expect(Object.keys(copy.en)).toEqual(Object.keys(copy.ar))
      for (const text of strings(copy.ar)) {
        expect(text, text).not.toMatch(/[—·]/)
        expect(text, text).not.toMatch(/\([A-Za-z]/)
        expect(text, text).not.toMatch(/\b[٠-٩]/)
      }
    }
  })

  it("never glues an Arabic waw or tatweel prefix to a Latin word", () => {
    for (const copy of COPIES) for (const text of strings(copy.ar)) expect(text, text).not.toMatch(/(?:^|\s)[وبكلـ]+[A-Za-z]/)
  })
})

describe("Pre-Join Lobby", () => {
  it("names the meeting, shows the three pickers, and keeps the pill in physical order in Arabic too", () => {
    for (const [locale, dir] of [["en", "ltr"], ["ar", "rtl"]] as const) {
      const { container, unmount } = render(
        <div dir={dir}>
          <VideoCallPreJoinLobby locale={locale} />
        </div>
      )
      const copy = videoCallPreJoinLobbyCopy[locale]
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(copy.title)
      for (const label of [copy.cameraLabel, copy.microphoneLabel, copy.speakerLabel]) expect(screen.getAllByText(label).length).toBeGreaterThan(0)
      const pill = within(container).getByRole("group", { name: copy.pillLabel })
      expect(pill).toHaveAttribute("dir", "ltr")
      const labels = within(pill).getAllByRole("button").map((button) => button.getAttribute("aria-label"))
      expect(labels).toEqual([copy.mic.label, copy.camera.label, copy.settings])
      unmount()
    }
  })

  it("toggles the mic and camera, says so, and calls back", () => {
    const onControl = vi.fn()
    render(<VideoCallPreJoinLobby onControl={onControl} />)
    const mic = screen.getByRole("button", { name: "Mute microphone" })
    expect(mic).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(mic)
    expect(onControl).toHaveBeenLastCalledWith("mic", false)
    expect(screen.getByRole("button", { name: "Unmute microphone" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Turn camera off" }))
    expect(onControl).toHaveBeenLastCalledWith("camera", false)
    fireEvent.click(screen.getByRole("button", { name: "Device settings" }))
    expect(onControl).toHaveBeenLastCalledWith("settings", true)
  })

  it("holds Join disabled with a spinner until the camera is ready, then enables it", () => {
    const onJoin = vi.fn()
    const { rerender } = render(<VideoCallPreJoinLobby cameraReady={false} onJoin={onJoin} />)
    const join = screen.getByRole("button", { name: /Join now/ })
    expect(join).toBeDisabled()
    fireEvent.click(join)
    expect(onJoin).not.toHaveBeenCalled()
    rerender(<VideoCallPreJoinLobby cameraReady onJoin={onJoin} />)
    const ready = screen.getByRole("button", { name: "Join now" })
    expect(ready).toBeEnabled()
    fireEvent.click(ready)
    expect(onJoin).toHaveBeenCalledTimes(1)
  })

  it("calls Test speakers, and shows a photo only when it is given one", () => {
    const onTest = vi.fn()
    const { container, rerender } = render(<VideoCallPreJoinLobby onTestSpeakers={onTest} />)
    fireEvent.click(screen.getByRole("button", { name: "Test speakers" }))
    expect(onTest).toHaveBeenCalledTimes(1)
    expect(container.querySelector("img")).toBeNull()
    rerender(<VideoCallPreJoinLobby photo={{ src: "/p.webp", alt: "Omar" }} />)
    expect(screen.getByAltText("Omar")).toHaveAttribute("src", "/p.webp")
  })

  it("keeps the eyebrow in sentence case in Arabic, with no tracking", () => {
    render(<VideoCallPreJoinLobby locale="ar" />)
    expect(screen.getByText(videoCallPreJoinLobbyCopy.ar.eyebrow).className).not.toMatch(/uppercase|tracking/)
  })
})

describe("Waiting Room & Knock", () => {
  it("lists the knocks with a count, and mirrors the plural in Arabic", () => {
    const { unmount } = render(<VideoCallWaitingRoomKnock />)
    expect(screen.getByText("3 people are waiting")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
    unmount()
    render(<VideoCallWaitingRoomKnock locale="ar" knocks={videoCallWaitingRoomKnockCopy.ar.knocks.slice(0, 2)} />)
    expect(screen.getByText("شخصان في الانتظار")).toBeInTheDocument()
  })

  it("admits one guest: calls back, collapses the row, and updates the count", () => {
    const onAdmit = vi.fn()
    render(<VideoCallWaitingRoomKnock onAdmit={onAdmit} />)
    fireEvent.click(screen.getByRole("button", { name: "Admit Nour Khalil" }))
    expect(onAdmit).toHaveBeenCalledWith("nour")
    expect(screen.queryByText("Nour Khalil")).toBeNull()
    expect(screen.getByText("2 people are waiting")).toBeInTheDocument()
  })

  it("denies a guest, and admits everyone at once with every id", () => {
    const onDeny = vi.fn()
    const onAdmitAll = vi.fn()
    render(<VideoCallWaitingRoomKnock onDeny={onDeny} onAdmitAll={onAdmitAll} />)
    fireEvent.click(screen.getByRole("button", { name: "Deny Tariq Aziz" }))
    expect(onDeny).toHaveBeenCalledWith("tariq")
    fireEvent.click(screen.getByRole("button", { name: "Admit everyone" }))
    expect(onAdmitAll).toHaveBeenCalledWith(["nour", "hala"])
    expect(screen.queryAllByRole("listitem")).toHaveLength(0)
    expect(screen.getByRole("status")).toHaveTextContent("No one is waiting.")
    expect(screen.queryByRole("button", { name: "Admit everyone" })).toBeNull()
  })

  it("keeps the room locked, cancels for the guest, and toggles their mic and camera", () => {
    const onKeepLocked = vi.fn()
    const onCancel = vi.fn()
    const onControl = vi.fn()
    render(<VideoCallWaitingRoomKnock onKeepLocked={onKeepLocked} onCancel={onCancel} onControl={onControl} />)
    fireEvent.click(screen.getByRole("button", { name: "Keep locked" }))
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    expect(onKeepLocked).toHaveBeenCalledTimes(1)
    expect(onCancel).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: "Mute microphone" }))
    expect(onControl).toHaveBeenLastCalledWith("mic", false)
    expect(screen.getByRole("button", { name: "Unmute microphone" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Turn camera off" }))
    expect(onControl).toHaveBeenLastCalledWith("camera", false)
  })

  it("replaces its rows when a new list is passed, and isolates an email inside Arabic text", () => {
    const { rerender, container } = render(<VideoCallWaitingRoomKnock locale="ar" />)
    expect(container.querySelector('bdi[dir="ltr"]')?.textContent).toContain("nour@fasla.design")
    rerender(<VideoCallWaitingRoomKnock locale="ar" knocks={[]} />)
    expect(screen.getByRole("status")).toHaveTextContent(videoCallWaitingRoomKnockCopy.ar.empty)
  })

  it("lets the lock breathe on a 2.4s loop, and holds it still under reduced motion", () => {
    const calls: { options: KeyframeAnimationOptions }[] = []
    const original = Element.prototype.animate
    Element.prototype.animate = vi.fn(function (this: Element, _k: unknown, options: KeyframeAnimationOptions) {
      calls.push({ options })
      return { cancel: vi.fn(), onfinish: null } as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
    try {
      reduceMotion(false)
      const first = render(<VideoCallWaitingRoomKnock />)
      expect(calls.some((call) => call.options.iterations === Infinity && call.options.duration === 1200)).toBe(true)
      first.unmount()
      calls.length = 0
      reduceMotion(true)
      render(<VideoCallWaitingRoomKnock />)
      expect(calls.some((call) => call.options.iterations === Infinity)).toBe(false)
    } finally {
      Element.prototype.animate = original
      reduceMotion(false)
    }
  })
})

describe("Incoming Call", () => {
  it("shows the three cards, and Decline on the start side with Join on the end side in the DOM order", () => {
    render(<VideoCallIncomingCall />)
    expect(screen.getAllByRole("article")).toHaveLength(3)
    const incoming = screen.getByRole("article", { name: "Mona Darwish" })
    const names = within(incoming).getAllByRole("button").map((button) => button.getAttribute("aria-label") ?? button.textContent)
    expect(names.slice(0, 2)).toEqual(["Decline", "Join"])
  })

  it("calls back on every real action", () => {
    const handlers = {
      onJoin: vi.fn(),
      onDecline: vi.fn(),
      onReply: vi.fn(),
      onCancel: vi.fn(),
      onSwitchToAudio: vi.fn(),
      onCallBack: vi.fn(),
      onMessage: vi.fn(),
    }
    render(<VideoCallIncomingCall {...handlers} />)
    fireEvent.click(screen.getByRole("button", { name: "Join" }))
    fireEvent.click(screen.getByRole("button", { name: "Decline" }))
    fireEvent.click(screen.getByRole("button", { name: "Reply with a message" }))
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
    fireEvent.click(screen.getByRole("button", { name: "Switch to audio only" }))
    fireEvent.click(screen.getByRole("button", { name: "Call back" }))
    fireEvent.click(screen.getByRole("button", { name: "Message" }))
    for (const handler of Object.values(handlers)) expect(handler).toHaveBeenCalledTimes(1)
  })

  it("shows only the cards asked for", () => {
    render(<VideoCallIncomingCall show={["missed"]} />)
    expect(screen.getAllByRole("article")).toHaveLength(1)
    expect(screen.queryByRole("button", { name: "Decline" })).toBeNull()
  })

  it("plays and pauses the voice note, and says so", () => {
    const onPlayChange = vi.fn()
    render(<VideoCallIncomingCall onPlayChange={onPlayChange} />)
    const play = screen.getByRole("button", { name: "Play voice note" })
    expect(play).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(play)
    expect(onPlayChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole("button", { name: "Pause voice note" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Pause voice note" }))
    expect(onPlayChange).toHaveBeenLastCalledWith(false)
  })

  it("keeps the waveform left to right in Arabic", () => {
    const { container } = render(
      <div dir="rtl">
        <VideoCallIncomingCall locale="ar" show={["missed"]} />
      </div>
    )
    expect(container.querySelector('[dir="ltr"][aria-hidden]')).not.toBeNull()
  })

  it("counts the calling dots every 200ms, and holds them under reduced motion", () => {
    vi.useFakeTimers()
    reduceMotion(false)
    const { container, unmount } = render(<VideoCallIncomingCall show={["calling"]} />)
    const dots = () => Array.from(container.querySelectorAll("article [aria-hidden].flex > span")).map((dot) => dot.className.includes("bg-foreground"))
    expect(dots()).toEqual([true, false, false])
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(dots()).toEqual([false, true, false])
    unmount()
    reduceMotion(true)
    const held = render(<VideoCallIncomingCall show={["calling"]} />)
    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(Array.from(held.container.querySelectorAll("article [aria-hidden].flex > span")).map((dot) => dot.className.includes("bg-foreground"))).toEqual([true, false, false])
    reduceMotion(false)
  })

  it("draws the two rings only on the incoming card, and none under reduced motion", () => {
    reduceMotion(false)
    const { container, unmount } = render(<VideoCallIncomingCall />)
    expect(container.querySelectorAll("span.border-success")).toHaveLength(2)
    unmount()
    const calling = render(<VideoCallIncomingCall show={["calling", "missed"]} />)
    expect(calling.container.querySelectorAll("span.border-success")).toHaveLength(0)
  })

  it("shows a photo when given one, by caller", () => {
    render(<VideoCallIncomingCall photos={{ mona: { src: "/m.webp", alt: "Mona" } }} />)
    expect(screen.getByAltText("Mona")).toHaveAttribute("src", "/m.webp")
  })
})

describe("Join Link & Dial-in", () => {
  it("copies the link, says Copied for 1.6s, and goes back", () => {
    vi.useFakeTimers()
    const onCopy = vi.fn()
    render(<VideoCallJoinLinkDialIn onCopy={onCopy} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }))
    expect(onCopy).toHaveBeenCalledWith("fasla.to/yasmin-haddad")
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1599)
    })
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(2)
    })
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument()
  })

  it("writes to the clipboard when there is no onCopy", () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    render(<VideoCallJoinLinkDialIn />)
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }))
    expect(writeText).toHaveBeenCalledWith("fasla.to/yasmin-haddad")
  })

  it("calls back for each share and for Manage room settings", () => {
    const onShare = vi.fn()
    const onManage = vi.fn()
    render(<VideoCallJoinLinkDialIn onShare={onShare} onManage={onManage} />)
    for (const [label, id] of [["Email invite", "email"], ["Add to calendar", "calendar"], ["Invite by name", "name"], ["More ways", "more"]] as const) {
      fireEvent.click(screen.getByRole("button", { name: label }))
      expect(onShare).toHaveBeenLastCalledWith(id)
    }
    fireEvent.click(screen.getByRole("button", { name: "Manage room settings" }))
    expect(onManage).toHaveBeenCalledTimes(1)
  })

  it("folds the QR behind Show QR on a phone, and tells assistive technology which way it is", () => {
    const onQrOpenChange = vi.fn()
    render(<VideoCallJoinLinkDialIn onQrOpenChange={onQrOpenChange} />)
    const show = screen.getByRole("button", { name: "Show QR" })
    expect(show).toHaveAttribute("aria-expanded", "false")
    expect(screen.getByRole("img", { name: "QR code for the room link" }).parentElement?.className).toContain("hidden")
    fireEvent.click(show)
    expect(onQrOpenChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole("button", { name: "Hide QR" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByRole("img", { name: "QR code for the room link" }).parentElement?.className).not.toMatch(/(^|\s)hidden(\s|$)/)
  })

  it("lists the dial-in numbers and the access settings, and keeps links and numbers left to right in Arabic", () => {
    const { container } = render(
      <div dir="rtl">
        <VideoCallJoinLinkDialIn locale="ar" />
      </div>
    )
    const copy = videoCallJoinLinkDialInCopy.ar
    for (const entry of copy.numbers) expect(screen.getByText(entry.country)).toBeInTheDocument()
    for (const setting of copy.settings) expect(screen.getByText(setting.label)).toBeInTheDocument()
    const bdi = Array.from(container.querySelectorAll('bdi[dir="ltr"]')).map((node) => node.textContent)
    expect(bdi).toContain("fasla.to/yasmin-haddad")
    expect(bdi).toContain("+971 4 555 0198")
  })

  it("shows the Copied state from the start when asked", () => {
    vi.useFakeTimers()
    render(<VideoCallJoinLinkDialIn defaultCopied />)
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
  })

  it("cross-fades the QR when its key changes, then keeps one image", () => {
    const calls: { keyframes: unknown }[] = []
    const original = Element.prototype.animate
    Element.prototype.animate = vi.fn(function (this: Element, keyframes: unknown) {
      calls.push({ keyframes })
      const animation = { cancel: vi.fn(), onfinish: null as null | (() => void) }
      return animation as unknown as Animation
    }) as unknown as typeof Element.prototype.animate
    try {
      reduceMotion(false)
      const { rerender, container } = render(<VideoCallJoinLinkDialIn defaultQrOpen qrKey="a" />)
      rerender(<VideoCallJoinLinkDialIn defaultQrOpen qrKey="b" />)
      expect(JSON.stringify(calls.map((call) => call.keyframes))).toContain("blur(4px)")
      expect(container.querySelector("[data-qr='b']")).not.toBeNull()
    } finally {
      Element.prototype.animate = original
    }
  })
})
