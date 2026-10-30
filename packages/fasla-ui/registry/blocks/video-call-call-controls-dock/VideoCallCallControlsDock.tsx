"use client"

import * as React from "react"
import { Captions, CircleDot, Ellipsis, Hand, MessageSquare, Mic, MicOff, ScreenShare, Smile, Users, Video, VideoOff } from "lucide-react"
import { tooltipVariants } from "../../ui/tooltip/tooltip"
import {
  ControlsDock,
  Figures,
  VideoCallHeading,
  VideoCallSection,
  VideoCallSeparator,
  type DockControl,
  type VideoCallLocale,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Call Controls Dock.
 *
 * A heading (an eyebrow, the heading and a line under it) over one card that
 * shows the dock at its three densities: the compact row of round buttons, the
 * labelled row with a short caption under each, and the states row, a tooltip
 * above a dock whose mic and camera are off. Each ends in Leave, the one
 * destructive button.
 *
 * Desktop and Tablet set 48px controls and a labelled Leave. Mobile trims the
 * compact and states rows to five controls with an icon-only 44px Leave and
 * the labelled row to three controls plus a labelled Leave; the trim is by the
 * block's own width, so a docs preview narrower than the window trims too. In
 * Arabic the whole dock mirrors, so Leave stays on the side the eye leaves from.
 *
 * Every control works. Mic, camera, hand and captions toggle (mic and camera
 * turn destructive and cross-fade to their crossed-out glyph), hover lifts a
 * button, pressing settles it, a tooltip opens after 400ms, and More opens a
 * menu. Leave has to be held for 400ms; from the keyboard it takes a second
 * press. Nothing real happens on its own: `onControl`, `onMenuAction` and
 * `onLeave` say what was done.
 *
 * Content limits: the heading up to 36 characters, its line up to 140, a
 * control's caption up to 12. The other limits are in the block's
 * documentation page, which the default copy stays inside.
 */

export interface VideoCallCallControlsDockCopy {
  /** The small line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** Names for the three rows, for assistive technology. */
  rowLabels: { compact: string; labelled: string; states: string }
  /** The tooltip shown above the states row. */
  mutedTip: string
  /** Leave's text, its second-press text and its first-click hint. */
  leave: string
  leaveConfirm: string
  leaveHint: string
  /** The controls' names, and the captions under them. */
  controls: {
    mic: { label: string; pressedLabel: string; tip: string }
    video: { label: string; pressedLabel: string; caption: string; pressedCaption: string }
    share: { label: string; caption: string }
    chat: { label: string; caption: string }
    reactions: { label: string }
    hand: { label: string; pressedLabel: string }
    captions: { label: string; pressedLabel: string }
    people: { label: string; caption: string }
    record: { label: string; caption: string }
    more: { label: string; caption: string }
  }
  /** What the More menu holds. */
  menu: { id: string; label: string }[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallCallControlsDockCopy> = {
  en: {
    eyebrow: "IN-CALL CONTROLS",
    heading: "Everything within thumb reach",
    description: "One dock, three densities. Destructive actions stay isolated at the end so nobody leaves a call by accident.",
    rowLabels: { compact: "Compact dock", labelled: "Labelled dock", states: "Dock with mic and camera off" },
    mutedTip: "You're muted. Press ⌘ D to talk",
    leave: "Leave",
    leaveConfirm: "Press again to leave",
    leaveHint: "Hold to leave",
    controls: {
      mic: { label: "Mute", pressedLabel: "Unmute", tip: "You're muted. Press ⌘ D to talk" },
      video: { label: "Stop video", pressedLabel: "Start video", caption: "Stop video", pressedCaption: "Start video" },
      share: { label: "Share", caption: "Share" },
      chat: { label: "Chat", caption: "Chat" },
      reactions: { label: "Reactions" },
      hand: { label: "Raise hand", pressedLabel: "Lower hand" },
      captions: { label: "Turn on captions", pressedLabel: "Turn off captions" },
      people: { label: "People", caption: "People" },
      record: { label: "Record", caption: "Record" },
      more: { label: "More", caption: "More" },
    },
    menu: [
      { id: "settings", label: "Settings" },
      { id: "report", label: "Report a problem" },
    ],
  },
  ar: {
    eyebrow: "عناصر التحكم في المكالمة",
    heading: "كل شيء في متناول إبهامك",
    description: "شريط واحد بثلاث كثافات. تبقى الإجراءات الحرجة معزولة في الطرف حتى لا يخرج أحد من المكالمة بالخطأ.",
    rowLabels: { compact: "الشريط المضغوط", labelled: "الشريط بالتسميات", states: "الشريط والميكروفون والكاميرا مغلقان" },
    mutedTip: "الميكروفون مكتوم. اضغط ⌘ D للتحدث",
    leave: "خروج",
    leaveConfirm: "اضغط مرة أخرى للخروج",
    leaveHint: "اضغط مطولًا للخروج",
    controls: {
      mic: { label: "كتم", pressedLabel: "إلغاء الكتم", tip: "الميكروفون مكتوم. اضغط ⌘ D للتحدث" },
      video: { label: "إيقاف الفيديو", pressedLabel: "تشغيل الفيديو", caption: "إيقاف الفيديو", pressedCaption: "تشغيل الفيديو" },
      share: { label: "مشاركة", caption: "مشاركة" },
      chat: { label: "الدردشة", caption: "الدردشة" },
      reactions: { label: "التفاعلات" },
      hand: { label: "رفع اليد", pressedLabel: "خفض اليد" },
      captions: { label: "تشغيل التسميات", pressedLabel: "إيقاف التسميات" },
      people: { label: "الأشخاص", caption: "الأشخاص" },
      record: { label: "تسجيل", caption: "تسجيل" },
      more: { label: "المزيد", caption: "المزيد" },
    },
    menu: [
      { id: "settings", label: "الإعدادات" },
      { id: "report", label: "الإبلاغ عن مشكلة" },
    ],
  },
}

export interface VideoCallCallControlsDockProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<VideoCallCallControlsDockCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** Called when a control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

export function VideoCallCallControlsDock({
  locale = "en",
  eyebrow,
  heading,
  description,
  rowLabels,
  mutedTip,
  leave,
  leaveConfirm,
  leaveHint,
  controls: controlCopy,
  menu,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallCallControlsDockProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const c = controlCopy ?? copy.controls
  const labels = rowLabels ?? copy.rowLabels
  const moreMenu = menu ?? copy.menu
  const mic: DockControl = { id: "mic", icon: Mic, pressedIcon: MicOff, label: c.mic.label, pressedLabel: c.mic.pressedLabel, pressedTip: c.mic.tip, caption: c.mic.label, pressedCaption: c.mic.pressedLabel, toggle: true }
  const video: DockControl = { id: "video", icon: Video, pressedIcon: VideoOff, label: c.video.label, pressedLabel: c.video.pressedLabel, caption: c.video.caption, pressedCaption: c.video.pressedCaption, toggle: true }
  const share: DockControl = { id: "screen-share", icon: ScreenShare, label: c.share.label, caption: c.share.caption, hideOnPhone: true }
  const chat: DockControl = { id: "chat", icon: MessageSquare, label: c.chat.label, caption: c.chat.caption, hideOnPhone: true }
  const chatCompact: DockControl = { ...chat, hideOnPhone: false }
  const reactions: DockControl = { id: "reactions", icon: Smile, label: c.reactions.label, hideOnPhone: true }
  const hand: DockControl = { id: "hand", icon: Hand, label: c.hand.label, pressedLabel: c.hand.pressedLabel, kind: "on", toggle: true, hideOnPhone: true }
  const captions: DockControl = { id: "captions", icon: Captions, label: c.captions.label, pressedLabel: c.captions.pressedLabel, kind: "on", toggle: true, hideOnPhone: true }
  const people: DockControl = { id: "people", icon: Users, label: c.people.label, caption: c.people.caption, hideOnPhone: true }
  const record: DockControl = { id: "record", icon: CircleDot, label: c.record.label, caption: c.record.caption, hideOnPhone: true }
  const more: DockControl = { id: "more", icon: Ellipsis, label: c.more.label, caption: c.more.caption, menu: moreMenu }

  const leaveProps = { leaveLabel: leave ?? copy.leave, leaveConfirmLabel: leaveConfirm ?? copy.leaveConfirm, leaveHint: leaveHint ?? copy.leaveHint, onControl, onMenuAction, onLeave }

  return (
    <VideoCallSection labelledBy={headingId} className={className} {...props}>
      <VideoCallHeading headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} />

      <div className="flex flex-col items-center gap-8 rounded-2xl border border-border bg-card p-4 [@container(min-width:40rem)]:p-10">
        <ControlsDock label={labels.compact} size="xl" density="compact" controls={[mic, video, share, chatCompact, reactions, hand, captions, more]} {...leaveProps} />
        <VideoCallSeparator />
        <ControlsDock label={labels.labelled} size="xl" density="labelled" leaveRadius="standard" leaveLabelled controls={[mic, video, share, chat, people, record, more]} {...leaveProps} />
        <VideoCallSeparator />
        <div className="flex flex-col items-center gap-4">
          <div role="tooltip" className={tooltipVariants({ variant: "primary", radius: "standard" })}>
            <Figures>{mutedTip ?? copy.mutedTip}</Figures>
          </div>
          <ControlsDock
            label={labels.states}
            size="xl"
            density="compact"
            controls={[{ ...mic, defaultPressed: true }, { ...video, defaultPressed: true }, share, hand, captions, more]}
            {...leaveProps}
          />
        </div>
      </div>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallCallControlsDockCopy = COPY
