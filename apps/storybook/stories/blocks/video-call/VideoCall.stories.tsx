import type { Meta, StoryObj } from "@storybook/react"
import { VideoCallCallControlsDock, videoCallCallControlsDockCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-call-controls-dock/VideoCallCallControlsDock"
import { VideoCallCaptionsReactions, videoCallCaptionsReactionsCopy } from "../../../../../packages/fasla-ui/registry/blocks/video-call-captions-reactions/VideoCallCaptionsReactions"
import { LONG, localeOf, photoPropsOf, videoCallArgTypes, videoCallViewports } from "./video-call-story-kit"

/**
 * Video Call: the Types of the Figma set, one block each. This first family is
 * the layers on a call: the controls dock at three densities, and the stage
 * with live captions, a raise-hand chip and reactions. Mic, camera, hand and
 * captions toggle, the More menu opens, a reaction floats up when picked, and
 * Leave has to be held for 400ms (from the keyboard, pressed twice). Viewport,
 * direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states (a long line, no raised hand) are tagged `!dev` and `!autodocs`:
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
