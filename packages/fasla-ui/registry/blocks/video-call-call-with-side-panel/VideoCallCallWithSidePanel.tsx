"use client"

import * as React from "react"
import { SignalHigh } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { cn } from "../../../src/lib/utils"
import {
  CallStage,
  ControlsDock,
  Figures,
  ParticipantTile,
  STAGE_DOCK_COPY,
  STANDARD,
  SidePanel,
  StageBar,
  VideoCallSection,
  fillTemplate,
  prefersReducedMotion,
  stageDockControls,
  useContainerTier,
  type SidePanelCopy,
  type SidePanelMessage,
  type SidePanelPerson,
  type SidePanelSnap,
  type StageDockCopy,
  type VideoCallLocale,
  type VideoCallParticipant,
  type VideoCallPhotos,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Call With Side Panel.
 *
 * A call stage with a side panel: the stage in a card (the meeting name and
 * time and a connection badge; the speaker's tile; a strip of four more; the
 * controls dock) beside, or below, a panel with a Participants / Chat pair of
 * tabs, a people search and the list, and Invite.
 *
 * Desktop sets the 360px panel beside the stage, at its end (on the left in
 * Arabic); Tablet puts it under the stage at full width; a phone shows it as a
 * bottom sheet, 60% tall with a handle that a press or a drag steps to 92%. A
 * phone's strip has three thumbnails and its dock five controls with an
 * icon-only 44px Leave.
 *
 * The panel pushes the stage rather than covering it: it opens by growing its
 * width over 240ms, so the stage narrows inside the same tween and no video is
 * ever hidden (Tablet and a phone grow its height instead). The Chat control in
 * the dock, and the panel's close button, open and close it. The search
 * filters the list as you type, the tabs cross-fade their content in 120ms,
 * a new person's row grows in with height and opacity together, and an unread
 * mark scales in on the Chat tab until the tab is opened. Reduced motion makes
 * each of these a plain fade.
 *
 * Stills only. Every real action (Invite, a person's menu, the dock) is a
 * callback; what the panel shows (its tab, its search, whether it is open) is
 * state the block keeps itself.
 *
 * Content limits: a person's name up to 28 characters, a chat line up to 120.
 * The other limits are in the block's documentation page, which the default
 * copy stays inside.
 */

export interface VideoCallCallWithSidePanelCopy {
  /** The meeting's name. */
  title: string
  /** The elapsed time. */
  time: string
  /** The connection badge's text. */
  connection: string
  /** The chip on the speaker's tile; `{name}` is filled in. */
  speaking: string
  /** The people on the stage: the speaker first, then the strip (a phone shows three of the four). */
  participants: VideoCallParticipant[]
  /** The people in the panel's list. */
  people: SidePanelPerson[]
  /** The Chat tab's messages. */
  messages: SidePanelMessage[]
  /** The panel's words. */
  panel: SidePanelCopy
  /** The dock's controls, and Leave's three lines. */
  dock: StageDockCopy
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallCallWithSidePanelCopy> = {
  en: {
    title: "Onboarding walkthrough",
    time: "12:44",
    connection: "Good",
    speaking: "{name} — speaking",
    participants: [
      { id: "layla", name: "Layla Hassan" },
      { id: "adam", name: "Adam Farouk", shortName: "Adam F." },
      { id: "nour", name: "Nour Khalil", shortName: "Nour K.", muted: true },
      { id: "hala", name: "Hala Mansour", shortName: "Hala M.", initials: "HM" },
      { id: "yasmin", name: "Yasmin Haddad", shortName: "You" },
    ],
    people: [
      { id: "layla", name: "Layla Hassan", role: "Host" },
      { id: "adam", name: "Adam Farouk", role: "Co-host" },
      { id: "nour", name: "Nour Khalil", role: "Guest", muted: true },
      { id: "hala", name: "Hala Mansour", role: "Guest", muted: true, initials: "HM" },
      { id: "tariq", name: "Tariq Aziz", role: "Guest" },
      { id: "yasmin", name: "Yasmin Haddad", role: "You" },
    ],
    messages: [
      { id: "m1", author: "Layla Hassan", text: "Welcome, everyone. We start in a minute." },
      { id: "m2", author: "Adam Farouk", text: "The slides are in the shared folder." },
    ],
    panel: {
      title: "In this meeting",
      close: "Close panel",
      tabsLabel: "Panel",
      participants: "Participants",
      chat: "Chat",
      search: "Search people",
      inCall: "IN THE CALL · {count}",
      noResults: "No one matches that search.",
      noMessages: "No messages yet.",
      unread: "Unread messages",
      invite: "Invite others",
      more: "More about {name}",
      muted: "Muted",
      handle: "Resize the panel",
    },
    dock: STAGE_DOCK_COPY.en,
  },
  ar: {
    title: "جولة التهيئة",
    time: "12:44",
    connection: "جيد",
    speaking: "{name}، تتحدث",
    participants: [
      { id: "layla", name: "ليلى حسن" },
      { id: "adam", name: "آدم فاروق", shortName: "آدم ف." },
      { id: "nour", name: "نور خليل", shortName: "نور خ.", muted: true },
      { id: "hala", name: "هالة منصور", shortName: "هالة م.", initials: "ه م" },
      { id: "yasmin", name: "ياسمين حداد", shortName: "أنت" },
    ],
    people: [
      { id: "layla", name: "ليلى حسن", role: "المنظّم" },
      { id: "adam", name: "آدم فاروق", role: "منظّم مشارك" },
      { id: "nour", name: "نور خليل", role: "ضيف", muted: true },
      { id: "hala", name: "هالة منصور", role: "ضيف", muted: true, initials: "ه م" },
      { id: "tariq", name: "طارق عزيز", role: "ضيف" },
      { id: "yasmin", name: "ياسمين حداد", role: "أنت" },
    ],
    messages: [
      { id: "m1", author: "ليلى حسن", text: "أهلًا بالجميع. نبدأ بعد دقيقة." },
      { id: "m2", author: "آدم فاروق", text: "العرض التقديمي في المجلد المشترك." },
    ],
    panel: {
      title: "في هذا الاجتماع",
      close: "إغلاق اللوحة",
      tabsLabel: "اللوحة",
      participants: "المشاركون",
      chat: "الدردشة",
      search: "ابحث عن شخص",
      inCall: "في المكالمة: {count}",
      noResults: "لا أحد يطابق هذا البحث.",
      noMessages: "لا رسائل بعد.",
      unread: "رسائل غير مقروءة",
      invite: "دعوة آخرين",
      more: "المزيد عن {name}",
      muted: "مكتوم",
      handle: "تغيير حجم اللوحة",
    },
    dock: STAGE_DOCK_COPY.ar,
  },
}

export interface VideoCallCallWithSidePanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<VideoCallCallWithSidePanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** The people's photos, by `id`. A person without one shows their initials. */
  photos?: VideoCallPhotos
  /** Shows the panel. Without it the block starts open and keeps its own state. */
  open?: boolean
  /** Called with the new state when the Chat control or the close button is pressed. */
  onOpenChange?: (open: boolean) => void
  /** Puts the unread mark on the Chat tab. */
  unread?: boolean
  /** The panel's first tab. */
  defaultTab?: "participants" | "chat"
  /** The phone sheet's first height: 60% or 92%. */
  defaultSnap?: SidePanelSnap
  /** Called when the phone sheet steps between its two heights. */
  onSnapChange?: (snap: SidePanelSnap) => void
  /** Called when Invite is pressed. */
  onInvite?: () => void
  /** Called with a person's id when their menu button is pressed. */
  onPersonMenu?: (id: string) => void
  /** Called when a dock control is pressed. Toggles also say whether they are now pressed. */
  onControl?: (id: string, pressed: boolean) => void
  /** Called with the id of the chosen More-menu item. */
  onMenuAction?: (id: string) => void
  /** Called once Leave is held for 400ms, or confirmed with a second press from the keyboard. */
  onLeave?: () => void
}

export function VideoCallCallWithSidePanel({
  locale = "en",
  title,
  time,
  connection,
  speaking,
  participants,
  people,
  messages,
  panel,
  dock,
  photos,
  open: openProp,
  onOpenChange,
  unread = false,
  defaultTab = "participants",
  defaultSnap = "60",
  onSnapChange,
  onInvite,
  onPersonMenu,
  onControl,
  onMenuAction,
  onLeave,
  className,
  ...props
}: VideoCallCallWithSidePanelProps) {
  const copy = COPY[locale]
  const list = participants ?? copy.participants
  const d = dock ?? copy.dock
  const name = title ?? copy.title
  const [own, setOwn] = React.useState(true)
  const open = openProp ?? own
  const [shown, setShown] = React.useState(open)
  const [root, tier] = useContainerTier<HTMLDivElement>()
  const wrap = React.useRef<HTMLDivElement>(null)
  const first = React.useRef(true)
  const speaker = list[0]
  const strip = list.slice(1)

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOwn(next)
    onOpenChange?.(next)
  }

  // Open: grow the wrapper from nothing, width beside the stage, height below it. Close: shrink it, then unmount.
  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const axis = tier === "desktop" ? "width" : "height"
    const reduced = prefersReducedMotion()
    const run = (reverse: boolean, done?: () => void) => {
      const node = wrap.current
      if (!node || typeof node.animate !== "function") return done?.()
      const size = axis === "width" ? node.offsetWidth : node.offsetHeight
      const full = { [axis]: `${size}px`, opacity: 1 }
      const none = { [axis]: "0px", opacity: 0 }
      const animation = node.animate(reduced ? (reverse ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }]) : reverse ? [full, none] : [none, full], {
        duration: reduced ? 120 : 240,
        easing: STANDARD,
        fill: reverse ? "forwards" : "none",
      })
      if (done) animation.onfinish = done
    }
    if (open) {
      setShown(true)
      requestAnimationFrame(() => run(false))
    } else run(true, () => setShown(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!speaker) return null

  return (
    <VideoCallSection aria-label={name} gap="sm" className={className} {...props}>
      <div ref={root} className="flex flex-col gap-4 [@container(min-width:64rem)]:flex-row">
        <CallStage className="min-w-0 flex-1 self-start">
          <StageBar
            className="px-2 py-1"
            title={<Figures>{name}</Figures>}
            time={time ?? copy.time}
            actions={
              <Badge variant="solid" tone="primary" size="lg" radius="rounded" icon={<SignalHigh />}>
                {connection ?? copy.connection}
              </Badge>
            }
          />
          <ParticipantTile
            name={fillTemplate(speaking ?? copy.speaking, { name: speaker.name })}
            photo={photos?.[speaker.id]}
            initials={photos?.[speaker.id] ? undefined : speaker.initials}
            muted={speaker.muted}
            speaking
            className="aspect-[288/149] w-full rounded-[0.625rem] [@container(min-width:40rem)]:aspect-[608/320] [@container(min-width:64rem)]:aspect-[840/352]"
          />
          <div className="grid grid-cols-3 gap-2 [@container(min-width:40rem)]:grid-cols-4 [@container(min-width:40rem)]:gap-3">
            {strip.map((person, index) => (
              <ParticipantTile
                key={person.id}
                name={person.shortName ?? person.name}
                photo={photos?.[person.id]}
                initials={photos?.[person.id] ? undefined : person.initials}
                muted={person.muted}
                chipClassName="max-w-[calc(100%-1.5rem)] [&>span]:truncate"
                className={cn(
                  "h-[72px] w-full rounded-[0.625rem] [@container(min-width:40rem)]:h-[100px] [@container(min-width:64rem)]:h-[120px]",
                  index >= 3 && "hidden [@container(min-width:40rem)]:block"
                )}
              />
            ))}
          </div>
          <ControlsDock
            className="pt-2 pb-1"
            label={d.label}
            size="stage"
            controls={stageDockControls(d)}
            leaveLabel={d.leave}
            leaveConfirmLabel={d.leaveConfirm}
            leaveHint={d.leaveHint}
            onControl={(id, pressed) => {
              if (id === "chat") setOpen(!open)
              onControl?.(id, pressed)
            }}
            onMenuAction={onMenuAction}
            onLeave={onLeave}
          />
        </CallStage>

        {shown ? (
          <div ref={wrap} data-panel-wrap="" className="shrink-0 overflow-hidden [@container(min-width:64rem)]:w-[360px]">
            <SidePanel
              sheet
              copy={panel ?? copy.panel}
              people={(people ?? copy.people).map((person) => ({ ...person, photo: person.photo ?? photos?.[person.id] }))}
              messages={messages ?? copy.messages}
              unread={unread}
              defaultTab={defaultTab}
              defaultSnap={defaultSnap}
              onSnapChange={onSnapChange}
              onClose={() => setOpen(false)}
              onInvite={onInvite}
              onPersonMenu={onPersonMenu}
              className="[@container(min-width:64rem)]:h-full [@container(min-width:64rem)]:min-h-[588px] [@container(min-width:64rem)]:w-[360px]"
            />
          </div>
        ) : null}
      </div>
    </VideoCallSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallCallWithSidePanelCopy = COPY
