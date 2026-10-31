import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { VideoCallCallWithSidePanel, videoCallCallWithSidePanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-with-side-panel/VideoCallCallWithSidePanel"
import { VideoCallGridGalleryCall, videoCallGridGalleryCallCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-grid-gallery-call/VideoCallGridGalleryCall"
import { VideoCallScreenShareStage, videoCallScreenShareStageCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-screen-share-stage/VideoCallScreenShareStage"
import { VideoCallSpeakerFilmstrip, videoCallSpeakerFilmstripCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-speaker-filmstrip/VideoCallSpeakerFilmstrip"
import { VideoCallCallControlsDock, videoCallCallControlsDockCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-controls-dock/VideoCallCallControlsDock"
import { VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-captions-reactions/VideoCallCaptionsReactions"
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
 * reactions. Mic, camera, hand and
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
