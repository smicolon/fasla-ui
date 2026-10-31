import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-with-side-panel/VideoCallCallWithSidePanel"
import { VideoCallGridGalleryCall, videoCallGridGalleryCallCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-grid-gallery-call/VideoCallGridGalleryCall"
import { VideoCallScreenShareStage, videoCallScreenShareStageCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-screen-share-stage/VideoCallScreenShareStage"
import { VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-speaker-filmstrip/VideoCallSpeakerFilmstrip"
import { VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-ai-meeting-recap/VideoCallAiMeetingRecap"
import { VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-ended-summary/VideoCallCallEndedSummary"
import { VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-upcoming-meetings/VideoCallUpcomingMeetings"
import { VideoCallCallControlsDock, videoCallCallControlsDockCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-controls-dock/VideoCallCallControlsDock"
import { VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-captions-reactions/VideoCallCaptionsReactions"
import { VideoCallHeroCallMockup, videoCallHeroCallMockupCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-hero-call-mockup/VideoCallHeroCallMockup"
import { VideoCallIncomingCall, videoCallIncomingCallCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-incoming-call/VideoCallIncomingCall"
import { VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-join-link-dial-in/VideoCallJoinLinkDialIn"
import { VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-pre-join-lobby/VideoCallPreJoinLobby"
import { VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-waiting-room-knock/VideoCallWaitingRoomKnock"
import { LONG, localeOf, photoPropsOf, videoCallArgTypes, videoCallViewports } from "./video-call-story-kit"

/**
 * Video Call: the Types of the Figma set, one block each. The call stages come
 * first: a grid of tiles (people join and leave, the ring follows the speaker,
 * a pin holds a tile), a speaker with a strip (a thumbnail makes its person the
 * speaker, a pin holds them), a shared screen (Stop presenting wipes it out and
 * Share again wipes it back) and a stage with a side panel (the Chat control
 * opens and closes it, the search filters, the tabs switch, and on a phone the
 * handle steps the sheet to 92%). Then the layers on a call: the controls dock
 * at three densities, and the stage with live captions, a raise-hand chip and
 * reactions. Before a call: the lobby (the pill toggles the mic and camera, the
 * pickers choose a device, Join waits for the camera), the waiting room (Admit
 * and Deny collapse a row, Admit everyone clears the list), an incoming call
 * (Join, Decline, Cancel and the voice note's play button) and the join link
 * (Copy link confirms in place, the QR folds away on a phone). Around the call:
 * the summary after it ends (the stars rate it, the chips mark what stood out,
 * the numbers count up), the meetings coming up (the live row pulses, Join
 * collapses a row) and the AI recap (the overview can reveal word by word, the
 * action items check off, a key moment scrubs the player). Last, the marketing
 * hero: copy that rises in turn, then a still mockup of a call that lands and
 * settles. Mic, camera, hand and
 * captions toggle, the More menu opens, a reaction floats up when picked, and
 * Leave has to be held for 400ms (from the keyboard, pressed twice). Viewport,
 * direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states (a long line, a pinned tile, a stopped share, an unread mark) are tagged `!dev` and `!autodocs`:
 * hidden from both, but still built, so tests and visual checks reach them by
 * id. The tags are written out on each story, as the indexer reads them
 * statically.
 */
const meta: Meta = {
  title: "Blocks/Video Call",
  parameters: { layout: "fullscreen", viewport: { viewports: videoCallViewports } },
  tags: ["autodocs"],
}

export default meta

/** Grid: a button that adds and removes a person, to show the tiles slide. */
function GridJoinsAndLeaves({ locale, ...rest }: { locale: "en" | "ar" } & Record<string, unknown>) {
  const everyone = videoCallGridGalleryCallCopy[locale].participants
  const [count, setCount] = React.useState(everyone.length)
  return (
    <>
      <div className="flex justify-center gap-2 p-4">
        <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => setCount((n) => Math.max(1, n - 1))}>
          {locale === "ar" ? "مغادرة" : "Someone leaves"}
        </button>
        <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => setCount((n) => Math.min(everyone.length, n + 1))}>
          {locale === "ar" ? "انضمام" : "Someone joins"}
        </button>
      </div>
      <VideoCallGridGalleryCall locale={locale} participants={everyone.slice(0, count)} {...rest} />
    </>
  )
}

export const GridGalleryCall: StoryObj<typeof VideoCallGridGalleryCall> = {
  name: "Grid Gallery Call",
  argTypes: videoCallArgTypes(VideoCallGridGalleryCall, videoCallGridGalleryCallCopy, ["photos"]),
  render: (args, context) => <VideoCallGridGalleryCall locale={localeOf(context)} {...photoPropsOf("grid-gallery-call", context)} {...args} />,
}

export const GridGalleryCallJoinsAndLeaves: StoryObj<typeof VideoCallGridGalleryCall> = {
  name: "Grid Gallery Call: Joins and leaves",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallGridGalleryCall, videoCallGridGalleryCallCopy, ["photos"]),
  render: (args, context) => <GridJoinsAndLeaves locale={localeOf(context)} {...photoPropsOf("grid-gallery-call", context)} {...args} />,
}

export const GridGalleryCallLongText: StoryObj<typeof VideoCallGridGalleryCall> = {
  name: "Grid Gallery Call: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallGridGalleryCall, videoCallGridGalleryCallCopy, ["photos"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallGridGalleryCallCopy[locale].participants
    return (
      <VideoCallGridGalleryCall
        locale={locale}
        {...photoPropsOf("grid-gallery-call", context)}
        title={LONG[locale].meeting}
        participants={base.map((person) => (person.id === "yasmin" ? { ...person, name: LONG[locale].person } : person))}
        {...args}
      />
    )
  },
}

export const SpeakerFilmstrip: StoryObj<typeof VideoCallSpeakerFilmstrip> = {
  name: "Speaker & Filmstrip",
  argTypes: videoCallArgTypes(VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy, ["photos"]),
  render: (args, context) => <VideoCallSpeakerFilmstrip locale={localeOf(context)} {...photoPropsOf("speaker-filmstrip", context)} {...args} />,
}

export const SpeakerFilmstripPinned: StoryObj<typeof VideoCallSpeakerFilmstrip> = {
  name: "Speaker & Filmstrip: Pinned",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy, ["photos"]),
  render: (args, context) => <VideoCallSpeakerFilmstrip locale={localeOf(context)} {...photoPropsOf("speaker-filmstrip", context)} defaultPinnedId="adam" {...args} />,
}

export const SpeakerFilmstripLongText: StoryObj<typeof VideoCallSpeakerFilmstrip> = {
  name: "Speaker & Filmstrip: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy, ["photos"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallSpeakerFilmstripCopy[locale].participants
    return (
      <VideoCallSpeakerFilmstrip
        locale={locale}
        {...photoPropsOf("speaker-filmstrip", context)}
        title={LONG[locale].meeting}
        participants={base.map((person) => (person.id === "yasmin" ? { ...person, name: LONG[locale].person } : person))}
        {...args}
      />
    )
  },
}

export const ScreenShareStage: StoryObj<typeof VideoCallScreenShareStage> = {
  name: "Screen Share Stage",
  argTypes: videoCallArgTypes(VideoCallScreenShareStage, videoCallScreenShareStageCopy, ["photos"]),
  render: (args, context) => <VideoCallScreenShareStage locale={localeOf(context)} {...photoPropsOf("screen-share-stage", context)} {...args} />,
}

export const ScreenShareStageStopped: StoryObj<typeof VideoCallScreenShareStage> = {
  name: "Screen Share Stage: Stopped",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallScreenShareStage, videoCallScreenShareStageCopy, ["photos"]),
  render: (args, context) => <VideoCallScreenShareStage locale={localeOf(context)} {...photoPropsOf("screen-share-stage", context)} sharing={false} {...args} />,
}

export const ScreenShareStageLongText: StoryObj<typeof VideoCallScreenShareStage> = {
  name: "Screen Share Stage: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallScreenShareStage, videoCallScreenShareStageCopy, ["photos"]),
  render: (args, context) => {
    const locale = localeOf(context)
    return <VideoCallScreenShareStage locale={locale} {...photoPropsOf("screen-share-stage", context)} slideTitle={LONG[locale].slide} {...args} />
  },
}

export const CallWithSidePanel: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel",
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => <VideoCallCallWithSidePanel locale={localeOf(context)} {...photoPropsOf("call-with-side-panel", context)} {...args} />,
}

export const CallWithSidePanelUnread: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel: Unread mark",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => <VideoCallCallWithSidePanel locale={localeOf(context)} {...photoPropsOf("call-with-side-panel", context)} unread {...args} />,
}

export const CallWithSidePanelTall: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel: Sheet at 92%",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => <VideoCallCallWithSidePanel locale={localeOf(context)} {...photoPropsOf("call-with-side-panel", context)} defaultSnap="92" {...args} />,
}

export const CallWithSidePanelChat: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel: Chat tab",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => <VideoCallCallWithSidePanel locale={localeOf(context)} {...photoPropsOf("call-with-side-panel", context)} defaultTab="chat" {...args} />,
}

export const CallWithSidePanelClosed: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel: Panel closed",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => <VideoCallCallWithSidePanel locale={localeOf(context)} {...photoPropsOf("call-with-side-panel", context)} open={false} {...args} />,
}

export const CallWithSidePanelLongText: StoryObj<typeof VideoCallCallWithSidePanel> = {
  name: "Call With Side Panel: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy, ["photos"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallCallWithSidePanelCopy[locale]
    return (
      <VideoCallCallWithSidePanel
        locale={locale}
        {...photoPropsOf("call-with-side-panel", context)}
        title={LONG[locale].meeting}
        people={base.people.map((person) => (person.id === "yasmin" ? { ...person, name: LONG[locale].person, role: LONG[locale].role } : person))}
        panel={{ ...base.panel, title: LONG[locale].panelTitle }}
        {...args}
      />
    )
  },
}

export const CallControlsDock: StoryObj<typeof VideoCallCallControlsDock> = {
  name: "Call Controls Dock",
  argTypes: videoCallArgTypes(VideoCallCallControlsDock, videoCallCallControlsDockCopy),
  render: (args, context) => <VideoCallCallControlsDock locale={localeOf(context)} {...args} />,
}

export const CallControlsDockLongText: StoryObj<typeof VideoCallCallControlsDock> = {
  name: "Call Controls Dock: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallControlsDock, videoCallCallControlsDockCopy),
  render: (args, context) => {
    const locale = localeOf(context)
    return <VideoCallCallControlsDock locale={locale} heading={LONG[locale].heading} description={LONG[locale].description} {...args} />
  },
}

export const CaptionsReactions: StoryObj<typeof VideoCallCaptionsReactions> = {
  name: "Captions & Reactions",
  argTypes: videoCallArgTypes(VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy),
  render: (args, context) => <VideoCallCaptionsReactions locale={localeOf(context)} {...photoPropsOf("captions-reactions", context)} {...args} />,
}

export const CaptionsReactionsLongText: StoryObj<typeof VideoCallCaptionsReactions> = {
  name: "Captions & Reactions: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy),
  render: (args, context) => {
    const locale = localeOf(context)
    return (
      <VideoCallCaptionsReactions
        locale={locale}
        {...photoPropsOf("captions-reactions", context)}
        speaker={LONG[locale].speaker}
        captions={[
          { id: "l1", speaker: LONG[locale].speaker, text: LONG[locale].caption },
          { id: "l2", speaker: videoCallCaptionsReactionsCopy[locale].captions[1]!.speaker, text: LONG[locale].reply },
        ]}
        {...args}
      />
    )
  },
}

export const CaptionsReactionsNoRaisedHand: StoryObj<typeof VideoCallCaptionsReactions> = {
  name: "Captions & Reactions: No raised hand",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy),
  render: (args, context) => <VideoCallCaptionsReactions locale={localeOf(context)} {...photoPropsOf("captions-reactions", context)} handQueue={null} {...args} />,
}

export const CaptionsReactionsNoPhoto: StoryObj<typeof VideoCallCaptionsReactions> = {
  name: "Captions & Reactions: Camera off",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy),
  render: (args, context) => <VideoCallCaptionsReactions locale={localeOf(context)} {...args} />,
}


/* ─────────────────────────── Before the call ─────────────────────────── */

/** Strings as long as the Family 3 content limits allow, per language. */
const LONG_BEFORE = {
  en: {
    title: "Design sync — weekly planning, launch review and retros",
    device: "Logitech BRIO 4K Pro external webcam",
    guest: "Mohammed Al-Rashid Al-Hamdan",
    detail: "mohammed.alrashid@northwind-partners.co · external",
    caller: "Abdulrahman Al-Mutairi-Haddad",
    line: "Fasla video call · Design sync weekly planning",
    room: "Your personal room is always on and always ready",
    country: "United Arab Emirates and Gulf region",
  },
  ar: {
    title: "مزامنة التصميم الأسبوعية ومراجعة الإطلاق والاستعراض",
    device: "كاميرا ويب خارجية عالية الدقة من لوجيتك",
    guest: "محمد عبد الرحمن الراشد الحمدان",
    detail: "mohammed.alrashid@northwind-partners.co، خارجي",
    caller: "عبد الرحمن المطيري الحداد",
    line: "مكالمة فيديو فاصلة، مزامنة التصميم الأسبوعية",
    room: "غرفتك الشخصية مفتوحة دائمًا وجاهزة دائمًا",
    country: "الإمارات العربية المتحدة ودول الخليج",
  },
} as const

export const PreJoinLobby: StoryObj<typeof VideoCallPreJoinLobby> = {
  name: "Pre-Join Lobby",
  argTypes: videoCallArgTypes(VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy, ["photo", "cameras", "microphones", "speakers"]),
  render: (args, context) => <VideoCallPreJoinLobby locale={localeOf(context)} {...photoPropsOf("pre-join-lobby", context)} {...args} />,
}

export const PreJoinLobbyCameraPending: StoryObj<typeof VideoCallPreJoinLobby> = {
  name: "Pre-Join Lobby: Camera pending",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy, ["photo", "cameras", "microphones", "speakers"], ["cameraReady"]),
  render: (args, context) => <VideoCallPreJoinLobby locale={localeOf(context)} {...photoPropsOf("pre-join-lobby", context)} cameraReady={false} {...args} />,
}

export const PreJoinLobbyDevicesOff: StoryObj<typeof VideoCallPreJoinLobby> = {
  name: "Pre-Join Lobby: Mic and camera off",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy, ["photo", "cameras", "microphones", "speakers"], ["defaultMicOn", "defaultCameraOn"]),
  render: (args, context) => <VideoCallPreJoinLobby locale={localeOf(context)} {...photoPropsOf("pre-join-lobby", context)} defaultMicOn={false} defaultCameraOn={false} {...args} />,
}

export const PreJoinLobbyLongText: StoryObj<typeof VideoCallPreJoinLobby> = {
  name: "Pre-Join Lobby: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallPreJoinLobby, videoCallPreJoinLobbyCopy, ["photo", "cameras", "microphones", "speakers"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallPreJoinLobbyCopy[locale]
    return (
      <VideoCallPreJoinLobby
        locale={locale}
        {...photoPropsOf("pre-join-lobby", context)}
        title={LONG_BEFORE[locale].title}
        cameras={[{ value: "long", label: LONG_BEFORE[locale].device }, ...base.cameras]}
        {...args}
      />
    )
  },
}

export const WaitingRoomKnock: StoryObj<typeof VideoCallWaitingRoomKnock> = {
  name: "Waiting Room & Knock",
  argTypes: videoCallArgTypes(VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy, ["photos", "knocks", "waiting"]),
  render: (args, context) => <VideoCallWaitingRoomKnock locale={localeOf(context)} {...photoPropsOf("waiting-room-knock", context)} {...args} />,
}

export const WaitingRoomKnockEmpty: StoryObj<typeof VideoCallWaitingRoomKnock> = {
  name: "Waiting Room & Knock: Empty list",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy, ["photos", "knocks", "waiting"], ["empty"]),
  render: (args, context) => <VideoCallWaitingRoomKnock locale={localeOf(context)} {...photoPropsOf("waiting-room-knock", context)} knocks={[]} {...args} />,
}

/** Waiting Room: a button that adds a knock at the top, to show a row growing in. */
function WaitingRoomNewKnock({ locale, ...rest }: { locale: "en" | "ar" } & Record<string, unknown>) {
  const base = videoCallWaitingRoomKnockCopy[locale].knocks
  const [rows, setRows] = React.useState(base.slice(1))
  return (
    <>
      <div className="flex justify-center p-4">
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setRows((current) => (current.some((row) => row.id === base[0]!.id) ? current : [base[0]!, ...current]))}
        >
          {locale === "ar" ? "طرق جديد" : "Someone knocks"}
        </button>
      </div>
      <VideoCallWaitingRoomKnock locale={locale} knocks={rows} {...rest} />
    </>
  )
}

export const WaitingRoomKnockNewKnock: StoryObj<typeof VideoCallWaitingRoomKnock> = {
  name: "Waiting Room & Knock: New knock",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy, ["photos", "knocks", "waiting"]),
  render: (args, context) => <WaitingRoomNewKnock locale={localeOf(context)} {...photoPropsOf("waiting-room-knock", context)} {...args} />,
}

export const WaitingRoomKnockLongText: StoryObj<typeof VideoCallWaitingRoomKnock> = {
  name: "Waiting Room & Knock: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallWaitingRoomKnock, videoCallWaitingRoomKnockCopy, ["photos", "knocks", "waiting"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallWaitingRoomKnockCopy[locale].knocks
    return (
      <VideoCallWaitingRoomKnock
        locale={locale}
        {...photoPropsOf("waiting-room-knock", context)}
        meeting={LONG_BEFORE[locale].title}
        knocks={[{ ...base[0]!, name: LONG_BEFORE[locale].guest, detail: LONG_BEFORE[locale].detail }, ...base.slice(1)]}
        {...args}
      />
    )
  },
}

export const IncomingCall: StoryObj<typeof VideoCallIncomingCall> = {
  name: "Incoming Call",
  argTypes: videoCallArgTypes(VideoCallIncomingCall, videoCallIncomingCallCopy, ["photos", "show", "incoming", "calling", "missed"]),
  render: (args, context) => <VideoCallIncomingCall locale={localeOf(context)} {...photoPropsOf("incoming-call", context)} {...args} />,
}

export const IncomingCallIncoming: StoryObj<typeof VideoCallIncomingCall> = {
  name: "Incoming Call: Incoming only",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallIncomingCall, videoCallIncomingCallCopy, ["photos", "show", "incoming", "calling", "missed"]),
  render: (args, context) => <VideoCallIncomingCall locale={localeOf(context)} {...photoPropsOf("incoming-call", context)} show={["incoming"]} {...args} />,
}

export const IncomingCallCalling: StoryObj<typeof VideoCallIncomingCall> = {
  name: "Incoming Call: Calling only",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallIncomingCall, videoCallIncomingCallCopy, ["photos", "show", "incoming", "calling", "missed"]),
  render: (args, context) => <VideoCallIncomingCall locale={localeOf(context)} {...photoPropsOf("incoming-call", context)} show={["calling"]} {...args} />,
}

export const IncomingCallMissed: StoryObj<typeof VideoCallIncomingCall> = {
  name: "Incoming Call: Missed only",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallIncomingCall, videoCallIncomingCallCopy, ["photos", "show", "incoming", "calling", "missed"]),
  render: (args, context) => <VideoCallIncomingCall locale={localeOf(context)} {...photoPropsOf("incoming-call", context)} show={["missed"]} {...args} />,
}

export const IncomingCallLongText: StoryObj<typeof VideoCallIncomingCall> = {
  name: "Incoming Call: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallIncomingCall, videoCallIncomingCallCopy, ["photos", "show", "incoming", "calling", "missed"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallIncomingCallCopy[locale]
    return (
      <VideoCallIncomingCall
        locale={locale}
        {...photoPropsOf("incoming-call", context)}
        incoming={{ ...base.incoming, name: LONG_BEFORE[locale].caller, detail: LONG_BEFORE[locale].line }}
        {...args}
      />
    )
  },
}

export const JoinLinkDialIn: StoryObj<typeof VideoCallJoinLinkDialIn> = {
  name: "Join Link & Dial-in",
  argTypes: videoCallArgTypes(VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy, ["shares", "numbers", "settings", "qrKey"]),
  render: (args, context) => <VideoCallJoinLinkDialIn locale={localeOf(context)} {...args} />,
}

export const JoinLinkDialInCopied: StoryObj<typeof VideoCallJoinLinkDialIn> = {
  name: "Join Link & Dial-in: Copied",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy, ["shares", "numbers", "settings", "qrKey"], ["defaultCopied"]),
  render: (args, context) => <VideoCallJoinLinkDialIn locale={localeOf(context)} defaultCopied {...args} />,
}

export const JoinLinkDialInQrOpen: StoryObj<typeof VideoCallJoinLinkDialIn> = {
  name: "Join Link & Dial-in: QR open on a phone",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy, ["shares", "numbers", "settings", "qrKey"], ["defaultQrOpen"]),
  render: (args, context) => <VideoCallJoinLinkDialIn locale={localeOf(context)} defaultQrOpen {...args} />,
}

/** Join Link: a button that regenerates the link, to show the QR cross-fade. */
function JoinLinkRegenerate({ locale, ...rest }: { locale: "en" | "ar" } & Record<string, unknown>) {
  const [version, setVersion] = React.useState(0)
  return (
    <>
      <div className="flex justify-center p-4">
        <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => setVersion((n) => n + 1)}>
          {locale === "ar" ? "إعادة إنشاء الرابط" : "Regenerate link"}
        </button>
      </div>
      <VideoCallJoinLinkDialIn locale={locale} qrKey={`v${version}`} {...rest} />
    </>
  )
}

export const JoinLinkDialInRegenerated: StoryObj<typeof VideoCallJoinLinkDialIn> = {
  name: "Join Link & Dial-in: Regenerated QR",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy, ["shares", "numbers", "settings", "qrKey"]),
  render: (args, context) => <JoinLinkRegenerate locale={localeOf(context)} {...args} />,
}

export const JoinLinkDialInLongText: StoryObj<typeof VideoCallJoinLinkDialIn> = {
  name: "Join Link & Dial-in: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallJoinLinkDialIn, videoCallJoinLinkDialInCopy, ["shares", "numbers", "settings", "qrKey"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallJoinLinkDialInCopy[locale]
    return (
      <VideoCallJoinLinkDialIn
        locale={locale}
        title={LONG_BEFORE[locale].room}
        numbers={[{ ...base.numbers[0]!, country: LONG_BEFORE[locale].country }, ...base.numbers.slice(1)]}
        {...args}
      />
    )
  },
}

/** The longest lines the around-the-call Types' content limits allow, in each language, for the Long text stories. */
const LONG_AROUND = {
  en: {
    subtitle: "Design sync — weekly planning and launch review · Today, 10:00 – 10:47",
    stat: "1.2 GB · ready to watch now",
    chip: "Dropped out twice",
    title: "Client review — Q3 launch and the pricing change",
    meta: "External guests · Waiting room on · Recording on",
    task: "Handle the camera-blocked edge case in the browser SDK and Safari",
    moment: "Question — do we need dial-in for KSA and the UAE?",
  },
  ar: {
    subtitle: "مزامنة التصميم الأسبوعية ومراجعة الإطلاق، اليوم من 10:00 إلى 10:47",
    stat: "1.2 غيغابايت، جاهز للمشاهدة الآن",
    chip: "انقطع مرتين",
    title: "مراجعة العميل لإطلاق الربع الثالث وتغيير الأسعار",
    meta: "ضيوف خارجيون، غرفة الانتظار مفعّلة، التسجيل مفعّل",
    task: "معالجة حالة حجب الكاميرا في SDK المتصفح وفي Safari",
    moment: "سؤال: هل نحتاج اتصالًا هاتفيًا للسعودية والإمارات؟",
  },
} as const

export const CallEndedSummary: StoryObj<typeof VideoCallCallEndedSummary> = {
  name: "Call Ended Summary",
  argTypes: videoCallArgTypes(VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy, ["photo", "photos", "stats", "chips", "people", "countUp"]),
  render: (args, context) => <VideoCallCallEndedSummary locale={localeOf(context)} {...photoPropsOf("call-ended-summary", context)} {...args} />,
}

export const CallEndedSummaryRated: StoryObj<typeof VideoCallCallEndedSummary> = {
  name: "Call Ended Summary: Rated",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy, ["photo", "photos", "stats", "chips", "people", "countUp"], ["defaultRating", "defaultIssues"]),
  render: (args, context) => <VideoCallCallEndedSummary locale={localeOf(context)} {...photoPropsOf("call-ended-summary", context)} defaultRating={5} defaultIssues={["audio", "video"]} {...args} />,
}

export const CallEndedSummaryStatic: StoryObj<typeof VideoCallCallEndedSummary> = {
  name: "Call Ended Summary: Without first-paint motion",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy, ["photo", "photos", "stats", "chips", "people"], ["countUp"]),
  render: (args, context) => <VideoCallCallEndedSummary locale={localeOf(context)} {...photoPropsOf("call-ended-summary", context)} countUp={false} {...args} />,
}

export const CallEndedSummaryLongText: StoryObj<typeof VideoCallCallEndedSummary> = {
  name: "Call Ended Summary: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallCallEndedSummary, videoCallCallEndedSummaryCopy, ["photo", "photos", "stats", "chips", "people", "countUp"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallCallEndedSummaryCopy[locale]
    return (
      <VideoCallCallEndedSummary
        locale={locale}
        {...photoPropsOf("call-ended-summary", context)}
        subtitle={LONG_AROUND[locale].subtitle}
        stats={base.stats.map((stat) => (stat.id === "recording" ? { ...stat, value: LONG_AROUND[locale].stat } : stat))}
        chips={[...base.chips.slice(0, 4), { id: "lag", label: LONG_AROUND[locale].chip }]}
        {...args}
      />
    )
  },
}

export const UpcomingMeetings: StoryObj<typeof VideoCallUpcomingMeetings> = {
  name: "Upcoming Meetings",
  argTypes: videoCallArgTypes(VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy, ["photo", "photos", "meetings", "joiningId"]),
  render: (args, context) => <VideoCallUpcomingMeetings locale={localeOf(context)} {...photoPropsOf("upcoming-meetings", context)} {...args} />,
}

export const UpcomingMeetingsJoining: StoryObj<typeof VideoCallUpcomingMeetings> = {
  name: "Upcoming Meetings: Joining",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy, ["photo", "photos", "meetings"], ["joiningId"]),
  render: (args, context) => <VideoCallUpcomingMeetings locale={localeOf(context)} {...photoPropsOf("upcoming-meetings", context)} joiningId="client-review" {...args} />,
}

export const UpcomingMeetingsNothingLive: StoryObj<typeof VideoCallUpcomingMeetings> = {
  name: "Upcoming Meetings: Nothing live",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy, ["photo", "photos", "meetings", "joiningId"]),
  render: (args, context) => {
    const locale = localeOf(context)
    return (
      <VideoCallUpcomingMeetings
        locale={locale}
        {...photoPropsOf("upcoming-meetings", context)}
        meetings={videoCallUpcomingMeetingsCopy[locale].meetings.map((meeting) => ({ ...meeting, live: false }))}
        {...args}
      />
    )
  },
}

export const UpcomingMeetingsLongText: StoryObj<typeof VideoCallUpcomingMeetings> = {
  name: "Upcoming Meetings: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallUpcomingMeetings, videoCallUpcomingMeetingsCopy, ["photo", "photos", "meetings", "joiningId"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallUpcomingMeetingsCopy[locale]
    return (
      <VideoCallUpcomingMeetings
        locale={locale}
        {...photoPropsOf("upcoming-meetings", context)}
        meetings={base.meetings.map((meeting, index) => (index === 1 ? { ...meeting, title: LONG_AROUND[locale].title, meta: LONG_AROUND[locale].meta } : meeting))}
        {...args}
      />
    )
  },
}

export const AiMeetingRecap: StoryObj<typeof VideoCallAiMeetingRecap> = {
  name: "AI Meeting Recap",
  argTypes: videoCallArgTypes(VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy, ["photo", "photos", "actions", "moments", "defaultMomentId", "reveal"]),
  render: (args, context) => <VideoCallAiMeetingRecap locale={localeOf(context)} {...photoPropsOf("ai-meeting-recap", context)} {...args} />,
}

export const AiMeetingRecapFirstGenerate: StoryObj<typeof VideoCallAiMeetingRecap> = {
  name: "AI Meeting Recap: First generate",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy, ["photo", "photos", "actions", "moments", "defaultMomentId"], ["reveal"]),
  render: (args, context) => <VideoCallAiMeetingRecap locale={localeOf(context)} {...photoPropsOf("ai-meeting-recap", context)} reveal {...args} />,
}

export const AiMeetingRecapMomentChosen: StoryObj<typeof VideoCallAiMeetingRecap> = {
  name: "AI Meeting Recap: Moment chosen",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy, ["photo", "photos", "actions", "moments", "reveal"], ["defaultMomentId"]),
  render: (args, context) => <VideoCallAiMeetingRecap locale={localeOf(context)} {...photoPropsOf("ai-meeting-recap", context)} defaultMomentId="risk" {...args} />,
}

export const AiMeetingRecapAllDone: StoryObj<typeof VideoCallAiMeetingRecap> = {
  name: "AI Meeting Recap: Every item done",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy, ["photo", "photos", "actions", "moments", "defaultMomentId", "reveal"]),
  render: (args, context) => {
    const locale = localeOf(context)
    return (
      <VideoCallAiMeetingRecap
        locale={locale}
        {...photoPropsOf("ai-meeting-recap", context)}
        actions={videoCallAiMeetingRecapCopy[locale].actions.map((action) => ({ ...action, done: true }))}
        {...args}
      />
    )
  },
}

export const AiMeetingRecapLongText: StoryObj<typeof VideoCallAiMeetingRecap> = {
  name: "AI Meeting Recap: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallAiMeetingRecap, videoCallAiMeetingRecapCopy, ["photo", "photos", "actions", "moments", "defaultMomentId", "reveal"]),
  render: (args, context) => {
    const locale = localeOf(context)
    const base = videoCallAiMeetingRecapCopy[locale]
    return (
      <VideoCallAiMeetingRecap
        locale={locale}
        {...photoPropsOf("ai-meeting-recap", context)}
        actions={base.actions.map((action, index) => (index === 1 ? { ...action, task: LONG_AROUND[locale].task } : action))}
        moments={base.moments.map((moment, index) => (index === 3 ? { ...moment, text: LONG_AROUND[locale].moment } : moment))}
        {...args}
      />
    )
  },
}

const LONG_HERO = {
  en: {
    heading: "Calls that start right on time",
    description: "Fasla runs in the browser, remembers every device choice, and hands you the recap before anyone has left the room, every time.",
  },
  ar: {
    heading: "اجتماعات تبدأ في وقتها بلا تأخير",
    description: "تعمل فاصلة في المتصفح، وتتذكر كل اختيار للأجهزة، وتمنحك الملخّص قبل أن يخرج أحد من الغرفة، في كل مرة تجتمع فيها.",
  },
} as const

export const HeroCallMockup: StoryObj<typeof VideoCallHeroCallMockup> = {
  name: "Hero — Call Mockup",
  argTypes: videoCallArgTypes(VideoCallHeroCallMockup, videoCallHeroCallMockupCopy, ["photo", "photos", "people", "tiles"]),
  render: (args, context) => <VideoCallHeroCallMockup locale={localeOf(context)} {...photoPropsOf("hero-call-mockup", context)} {...args} />,
}

export const HeroCallMockupLongText: StoryObj<typeof VideoCallHeroCallMockup> = {
  name: "Hero — Call Mockup: Long text",
  tags: ["!dev", "!autodocs"],
  argTypes: videoCallArgTypes(VideoCallHeroCallMockup, videoCallHeroCallMockupCopy, ["photo", "photos", "people", "tiles"]),
  render: (args, context) => {
    const locale = localeOf(context)
    return <VideoCallHeroCallMockup locale={locale} {...photoPropsOf("hero-call-mockup", context)} heading={LONG_HERO[locale].heading} description={LONG_HERO[locale].description} {...args} />
  },
}

export const HeroCallMockupPhone: StoryObj<typeof VideoCallHeroCallMockup> = {
  name: "Hero — Call Mockup: Phone (two tiles, three controls)",
  tags: ["!dev", "!autodocs"],
  parameters: { viewport: { defaultViewport: "mobile" } },
  argTypes: videoCallArgTypes(VideoCallHeroCallMockup, videoCallHeroCallMockupCopy, ["photo", "photos", "people", "tiles"]),
  render: (args, context) => <VideoCallHeroCallMockup locale={localeOf(context)} {...photoPropsOf("hero-call-mockup", context)} {...args} />,
}
