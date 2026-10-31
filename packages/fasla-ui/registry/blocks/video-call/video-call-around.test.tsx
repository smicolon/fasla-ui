import * as React from "react"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy } from "../video-call-ai-meeting-recap/VideoCallAiMeetingRecap"
import { VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy } from "../video-call-call-ended-summary/VideoCallCallEndedSummary"
import { VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy } from "../video-call-upcoming-meetings/VideoCallUpcomingMeetings"

const here = dirname(fileURLToPath(import.meta.url))
const SOURCES = [
  "video-call-call-ended-summary/VideoCallCallEndedSummary.tsx",
  "video-call-upcoming-meetings/VideoCallUpcomingMeetings.tsx",
  "video-call-ai-meeting-recap/VideoCallAiMeetingRecap.tsx",
].map((file) => readFileSync(resolve(here, "..", file), "utf8"))

const COPIES = [videoCallCallEndedSummaryCopy, videoCallUpcomingMeetingsCopy, videoCallAiMeetingRecapCopy]

/** Every string a copy object holds as a value, without its ids and its holes. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" || key === "time" || key === "duration" ? [] : [value.replace(/\{\w+\}/g, "")]
  if (Array.isArray(value)) return value.flatMap((item) => strings(item))
  if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k))
  return []
}

const originalMatchMedia = window.matchMedia
const originalAnimate = (Element.prototype as unknown as { animate?: unknown }).animate

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

/** A fake `Element.animate` that records its calls, as jsdom has none. */
function stubAnimate() {
  const calls: { target: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions }[] = []
  ;(Element.prototype as unknown as { animate: unknown }).animate = function (this: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) {
    calls.push({ target: this, keyframes, options })
    return { cancel: vi.fn(), finish: vi.fn(), onfinish: null }
  }
  return calls
}

afterEach(() => {
  cleanup()
  window.matchMedia = originalMatchMedia
  if (originalAnimate === undefined) delete (Element.prototype as unknown as { animate?: unknown }).animate
  else (Element.prototype as unknown as { animate: unknown }).animate = originalAnimate
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("the around-the-call source", () => {
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

  it("keeps the Arabic pluralisation right for the counts it writes", () => {
    expect(videoCallCallEndedSummaryCopy.ar.stats[1]!.value).toBe("انضم 6 مشاركين")
    expect(videoCallUpcomingMeetingsCopy.ar.summary).toContain("4 اجتماعات")
  })
})

describe("Call Ended Summary", () => {
  it("names the call, shows the four stats and the recording row, and the feedback card", () => {
    render(<VideoCallCallEndedSummary />)
    expect(screen.getByRole("heading", { level: 2, name: "Call ended" })).toBeInTheDocument()
    for (const label of ["Duration", "Participants", "Recording", "Transcript"]) expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.getByText("Recording is ready to watch")).toBeInTheDocument()
    expect(screen.getByText("How was the call quality?")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Send feedback" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Rejoin the room" })).toBeInTheDocument()
  })

  it("shows the final numbers at once under reduced motion, and draws nothing", () => {
    reduceMotion(true)
    const calls = stubAnimate()
    render(<VideoCallCallEndedSummary />)
    expect(screen.getByText("47")).toBeInTheDocument()
    expect(screen.getByText("4,182")).toBeInTheDocument()
    expect(screen.getByText("1.2")).toBeInTheDocument()
    expect(calls.some((call) => JSON.stringify(call.keyframes).includes("strokeDashoffset"))).toBe(false)
    for (const call of calls) expect(JSON.stringify(call.keyframes)).not.toContain("translate")
  })

  it("draws the check over 400ms and rises the four tiles 60ms apart", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const { container } = render(<VideoCallCallEndedSummary />)
    const draw = calls.find((call) => JSON.stringify(call.keyframes).includes("strokeDashoffset"))
    expect(draw?.options.duration).toBe(400)
    const tiles = calls.filter((call) => (call.target as HTMLElement).hasAttribute("data-stat"))
    expect(tiles).toHaveLength(4)
    expect(tiles.map((call) => call.options.delay)).toEqual([400, 460, 520, 580])
    expect(container.querySelectorAll("[data-stat]")).toHaveLength(4)
  })

  it("counts the first figure up, keeps the words around it, and ends on the final value", () => {
    reduceMotion(false)
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame", "performance", "Date"] })
    render(<VideoCallCallEndedSummary />)
    const duration = screen.getByText("Duration").parentElement!
    expect(duration.textContent).toContain("47")
    act(() => {
      vi.advanceTimersByTime(400)
    })
    act(() => {
      vi.advanceTimersByTime(900)
    })
    expect(duration.textContent).toContain("47 min")
    expect(screen.getByText("4,182").closest("span")?.textContent).toBe("4,182 words")
  })

  it("rates with the stars, marks issues, and sends both", () => {
    const onSend = vi.fn()
    const onRatingChange = vi.fn()
    render(<VideoCallCallEndedSummary onSendFeedback={onSend} onRatingChange={onRatingChange} />)
    expect(screen.getByRole("radio", { name: "Rate 4 of 5" })).toHaveAttribute("aria-checked", "true")
    fireEvent.click(screen.getByRole("radio", { name: "Rate 2 of 5" }))
    expect(onRatingChange).toHaveBeenCalledWith(2)
    const chip = screen.getByRole("button", { name: "Echo" })
    expect(chip).toHaveAttribute("aria-pressed", "false")
    fireEvent.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Send feedback" }))
    expect(onSend).toHaveBeenCalledWith({ rating: 2, issues: ["echo"] })
    fireEvent.click(chip)
    expect(chip).toHaveAttribute("aria-pressed", "false")
  })

  it("calls back for Watch (the button and the play button), Share and Rejoin", () => {
    const onWatch = vi.fn()
    const onShare = vi.fn()
    const onRejoin = vi.fn()
    render(<VideoCallCallEndedSummary onWatch={onWatch} onShare={onShare} onRejoin={onRejoin} />)
    fireEvent.click(screen.getByRole("button", { name: "Watch" }))
    fireEvent.click(screen.getByRole("button", { name: "Watch the recording" }))
    fireEvent.click(screen.getByRole("button", { name: "Share" }))
    fireEvent.click(screen.getByRole("button", { name: "Rejoin the room" }))
    expect(onWatch).toHaveBeenCalledTimes(2)
    expect(onShare).toHaveBeenCalledTimes(1)
    expect(onRejoin).toHaveBeenCalledTimes(1)
  })

  it("shows the still and the people's photos only when given them, with initials otherwise", () => {
    const { rerender } = render(<VideoCallCallEndedSummary />)
    expect(screen.queryByAltText("A hall")).toBeNull()
    rerender(<VideoCallCallEndedSummary photo={{ src: "/hall.webp", alt: "A hall" }} photos={{ mona: { src: "/m.webp", alt: "Mona" } }} />)
    expect(screen.getByAltText("A hall")).toHaveAttribute("src", "/hall.webp")
  })

  it("writes the Arabic participants stat as one phrase with the figure kept left to right", () => {
    reduceMotion(true)
    const { container } = render(
      <div dir="rtl">
        <VideoCallCallEndedSummary locale="ar" />
      </div>
    )
    expect(screen.getByRole("heading", { level: 2, name: "انتهت المكالمة" })).toBeInTheDocument()
    expect(container.textContent).toContain("انضم 6 مشاركين")
    expect(container.querySelector("bdi[dir='ltr']")).not.toBeNull()
  })

  it("passes a changed string through and keeps the rest", () => {
    render(<VideoCallCallEndedSummary title="Meeting over" />)
    expect(screen.getByRole("heading", { level: 2, name: "Meeting over" })).toBeInTheDocument()
    expect(screen.getByText("Duration")).toBeInTheDocument()
  })
})

describe("Upcoming Meetings", () => {
  it("lists the day and the four meetings, the live one marked", () => {
    const { container } = render(<VideoCallUpcomingMeetings />)
    expect(screen.getByRole("heading", { level: 2, name: "Today · Thursday 12 March" })).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(4)
    expect(container.querySelectorAll("[data-live]")).toHaveLength(1)
    expect(screen.getByText("Happening now")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Join now" })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: "Join" })).toHaveLength(3)
  })

  it("pulses the live row's ring on a 2s loop and its dot on 1.6s, and holds them under reduced motion", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const { unmount } = render(<VideoCallUpcomingMeetings />)
    const ring = calls.find((call) => (call.target as HTMLElement).hasAttribute("data-ring"))
    const dot = calls.find((call) => (call.target as HTMLElement).hasAttribute("data-dot"))
    expect(ring?.options.duration).toBe(2000)
    expect(ring?.options.iterations).toBe(Infinity)
    expect(dot?.options.duration).toBe(1600)
    unmount()
    reduceMotion(true)
    const still = stubAnimate()
    render(<VideoCallUpcomingMeetings />)
    expect(still.some((call) => call.options.iterations === Infinity)).toBe(false)
  })

  it("hands the row's bounds to onJoin, and collapses the row over 200ms", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const onJoin = vi.fn()
    render(<VideoCallUpcomingMeetings onJoin={onJoin} />)
    fireEvent.click(screen.getByRole("button", { name: "Join now" }))
    expect(onJoin).toHaveBeenCalledWith("design-sync", expect.anything())
    const collapse = calls.find((call) => JSON.stringify(call.keyframes).includes("marginBottom"))
    expect(collapse?.options.duration).toBe(200)
    expect(screen.getAllByRole("listitem")[0]).toHaveAttribute("aria-busy", "true")
  })

  it("starts with a row already collapsing when joiningId is given", () => {
    render(<VideoCallUpcomingMeetings joiningId="client-review" />)
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-busy", "true")
  })

  it("names each row's More button after its meeting and calls back", () => {
    const onMore = vi.fn()
    render(<VideoCallUpcomingMeetings onMore={onMore} />)
    fireEvent.click(screen.getByRole("button", { name: "More options for 1:1 with Mona" }))
    expect(onMore).toHaveBeenCalledWith("one-to-one")
  })

  it("calls back for New meeting and Open calendar", () => {
    const onNewMeeting = vi.fn()
    const onOpenCalendar = vi.fn()
    render(<VideoCallUpcomingMeetings onNewMeeting={onNewMeeting} onOpenCalendar={onOpenCalendar} />)
    fireEvent.click(screen.getByRole("button", { name: "New meeting" }))
    fireEvent.click(screen.getByRole("button", { name: "Open calendar" }))
    expect(onNewMeeting).toHaveBeenCalledTimes(1)
    expect(onOpenCalendar).toHaveBeenCalledTimes(1)
  })

  it("keeps clock times left to right in Arabic and shows an avatar for every person on a meeting", () => {
    const { container } = render(
      <div dir="rtl">
        <VideoCallUpcomingMeetings locale="ar" photos={{ mona: { src: "/m.webp", alt: "Mona" } }} />
      </div>
    )
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain("12 مارس")
    const times = Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((node) => node.textContent)
    expect(times).toContain("10:00")
    expect(container.querySelectorAll("[data-slot='avatar']")).toHaveLength(10)
  })

  it("shows nothing live when no meeting is", () => {
    const meetings = videoCallUpcomingMeetingsCopy.en.meetings.map((meeting) => ({ ...meeting, live: false }))
    const { container } = render(<VideoCallUpcomingMeetings meetings={meetings} />)
    expect(container.querySelectorAll("[data-live]")).toHaveLength(0)
    expect(screen.queryByText("Happening now")).toBeNull()
  })
})

describe("AI Meeting Recap", () => {
  it("shows the badge, the title, the overview, the action items and the key moments", () => {
    render(<VideoCallAiMeetingRecap />)
    expect(screen.getByRole("heading", { level: 2, name: "Design sync — weekly" })).toBeInTheDocument()
    expect(screen.getByText("Generated 2 minutes after the call")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "Overview" })).toBeInTheDocument()
    expect(screen.getAllByRole("checkbox")).toHaveLength(4)
    expect(screen.getAllByRole("button", { pressed: false })).toBeTruthy()
    expect(screen.getByText("Decision — lobby ships first")).toBeInTheDocument()
  })

  it("starts with the first action done, and checks and unchecks the rest with a callback", () => {
    const onActionChange = vi.fn()
    render(<VideoCallAiMeetingRecap onActionChange={onActionChange} />)
    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[]
    expect(boxes.map((box) => box.checked)).toEqual([true, false, false, false])
    fireEvent.click(boxes[1]!)
    expect(onActionChange).toHaveBeenLastCalledWith("sdk", true)
    expect((screen.getAllByRole("checkbox")[1] as HTMLInputElement).checked).toBe(true)
    fireEvent.click(boxes[0]!)
    expect(onActionChange).toHaveBeenLastCalledWith("states", false)
  })

  it("draws the strikethrough over 240ms when an item is checked, and only then", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    render(<VideoCallAiMeetingRecap />)
    const before = calls.filter((call) => JSON.stringify(call.keyframes).includes("backgroundSize")).length
    expect(before).toBe(0)
    fireEvent.click(screen.getAllByRole("checkbox")[2]!)
    const draw = calls.filter((call) => JSON.stringify(call.keyframes).includes("backgroundSize"))
    expect(draw).toHaveLength(1)
    expect(draw[0]!.options.duration).toBe(240)
  })

  it("renders the overview whole by default, and word by word on reveal, 35ms apart", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const { container, unmount } = render(<VideoCallAiMeetingRecap />)
    expect(container.querySelectorAll("[data-word]")).toHaveLength(0)
    unmount()
    render(<VideoCallAiMeetingRecap reveal />)
    const words = calls.filter((call) => (call.target as HTMLElement).hasAttribute("data-word"))
    expect(words.length).toBeGreaterThan(30)
    expect(words[1]!.options.delay! - words[0]!.options.delay!).toBe(35)
  })

  it("skips the reveal under reduced motion and on data saver", () => {
    reduceMotion(true)
    const calls = stubAnimate()
    render(<VideoCallAiMeetingRecap reveal />)
    expect(calls.some((call) => (call.target as HTMLElement).hasAttribute("data-word"))).toBe(false)
    cleanup()
    reduceMotion(false)
    Object.defineProperty(navigator, "connection", { value: { saveData: true }, configurable: true })
    const saved = stubAnimate()
    render(<VideoCallAiMeetingRecap reveal />)
    expect(saved.some((call) => (call.target as HTMLElement).hasAttribute("data-word"))).toBe(false)
    Object.defineProperty(navigator, "connection", { value: undefined, configurable: true })
  })

  it("seeks to a moment: calls back, shows its time on the still, and flashes its chip once", () => {
    reduceMotion(false)
    const calls = stubAnimate()
    const onSeek = vi.fn()
    render(<VideoCallAiMeetingRecap onSeek={onSeek} />)
    expect(screen.getByText("47:12")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Risk — permission prompts on Safari/ }))
    expect(onSeek).toHaveBeenCalledWith("risk", "11:38")
    expect(screen.getAllByText("11:38")).toHaveLength(2)
    expect(screen.getByRole("button", { name: /Risk/ })).toHaveAttribute("aria-pressed", "true")
    expect(calls.filter((call) => JSON.stringify(call.keyframes).includes("0.3"))).toHaveLength(1)
  })

  it("starts on a chosen moment when asked", () => {
    render(<VideoCallAiMeetingRecap defaultMomentId="demo" />)
    expect(screen.getAllByText("22:05")).toHaveLength(2)
  })

  it("confirms sharing with a toast that goes away after 1.6s", () => {
    vi.useFakeTimers()
    const onShare = vi.fn()
    render(<VideoCallAiMeetingRecap onShare={onShare} />)
    expect(screen.queryByText("Recap shared")).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Share recap" }))
    expect(onShare).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Recap shared")).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1700)
    })
    expect(screen.queryByText("Recap shared")).toBeNull()
  })

  it("calls back for the transcript, the play button, download and the recording's share", () => {
    const onOpenTranscript = vi.fn()
    const onPlay = vi.fn()
    const onDownload = vi.fn()
    const onShareRecording = vi.fn()
    render(<VideoCallAiMeetingRecap onOpenTranscript={onOpenTranscript} onPlay={onPlay} onDownload={onDownload} onShareRecording={onShareRecording} />)
    fireEvent.click(screen.getByRole("button", { name: "Open transcript" }))
    fireEvent.click(screen.getByRole("button", { name: "Play the recording" }))
    fireEvent.click(screen.getByRole("button", { name: "Download the recording" }))
    fireEvent.click(screen.getByRole("button", { name: "Share the recording" }))
    for (const fn of [onOpenTranscript, onPlay, onDownload, onShareRecording]) expect(fn).toHaveBeenCalledTimes(1)
  })

  it("writes Arabic with a comma between an owner and the due date, the still in Arabic and timestamps left to right", () => {
    const { container } = render(
      <div dir="rtl">
        <VideoCallAiMeetingRecap locale="ar" photo={{ src: "/r.webp", alt: "تسجيل" }} />
      </div>
    )
    expect(screen.getByRole("heading", { level: 2, name: "مزامنة التصميم الأسبوعية" })).toBeInTheDocument()
    expect(container.textContent).toContain("منى درويش")
    expect(container.textContent).not.toContain("·")
    expect(Array.from(container.querySelectorAll("bdi[dir='ltr']")).map((node) => node.textContent)).toContain("04:12")
    expect(screen.getByAltText("تسجيل")).toHaveAttribute("src", "/r.webp")
  })

  it("names every action's checkbox after its task", () => {
    render(<VideoCallAiMeetingRecap />)
    expect(screen.getByRole("checkbox", { name: "Confirm the dial-in numbers for KSA" })).toBeInTheDocument()
    const card = screen.getByRole("heading", { level: 3, name: "Action items" }).closest("div")!.parentElement!
    expect(within(card).getAllByRole("checkbox")).toHaveLength(4)
  })
})
