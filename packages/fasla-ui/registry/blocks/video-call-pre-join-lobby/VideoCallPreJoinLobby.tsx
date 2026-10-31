"use client"

import * as React from "react"
import { CalendarDays, Mic, MicOff, Settings, ShieldCheck, Users, Video, VideoOff } from "lucide-react"
import { Badge } from "../../ui/badge/badge"
import { Button } from "../../ui/button/button"
import { Select } from "../../ui/select/select"
import { cn } from "../../../src/lib/utils"
import {
  Figures,
  FAST_MS,
  ParticipantTile,
  STANDARD,
  passedCopy,
  restOf,
  VideoCallSection,
  prefersReducedMotion,
  useRevealOnce,
  type VideoCallLocale,
  type VideoCallPhoto,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Pre-Join Lobby.
 *
 * The lobby before a call: your camera still with your name on it and a small
 * pill of device controls, and beside it (above it on Tablet and a phone) an
 * eyebrow, the meeting's name, a line of help, a meta row, three device
 * pickers, Join now and Test speakers, and the recording notice.
 *
 * Desktop sets the 680 × 440 preview at the start and the copy at the end;
 * Tablet puts a 16:9 preview over the copy, the three pickers still in one
 * row; a phone has the preview at the top with the name label moved to its top
 * start corner, so it clears the pill, the pickers stacked, and both buttons
 * full width.
 *
 * On first show the preview fades up over 240ms and the copy follows, each
 * line 60ms after the last. Join stays disabled, with a spinner, until the
 * camera has sent its first frame (`cameraReady`), then switches on. Toggling
 * the mic or the camera cross-fades its glyph in 100ms and tweens the pill's
 * colour over 160ms. The pill keeps its physical order, mic, camera, settings,
 * in both directions: they are device controls, not words.
 *
 * Stills only: the preview is a photo, never a video element, and the block
 * never asks for the camera. Every real action (join, test speakers, a device
 * chosen, the settings button) is a callback; what the pickers and the pill
 * show is state the block keeps itself.
 *
 * Content limits: the meeting's name up to 42 characters, a device's name up
 * to 28. The other limits are in the block's documentation page, which the
 * default copy stays inside.
 */

export interface VideoCallDevice {
  /** Keys the device in a callback. */
  value: string
  /** Its name. */
  label: string
}

export interface VideoCallPreJoinLobbyCopy {
  /** The small line above the meeting's name. */
  eyebrow: string
  /** The meeting's name, an `h2`. */
  title: string
  /** The line under it. */
  description: string
  /** The meta row: when, how many are invited, how it is protected. */
  when: string
  invited: string
  encrypted: string
  /** The three pickers' labels. */
  cameraLabel: string
  microphoneLabel: string
  speakerLabel: string
  /** The devices on offer, per picker. */
  cameras: VideoCallDevice[]
  microphones: VideoCallDevice[]
  speakers: VideoCallDevice[]
  /** The buttons. */
  join: string
  joining: string
  testSpeakers: string
  /** The notice under the buttons. */
  notice: string
  /** The name on your own preview. */
  self: string
  /** Names the pill, and each of its controls. */
  pillLabel: string
  mic: { label: string; offLabel: string }
  camera: { label: string; offLabel: string }
  settings: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallPreJoinLobbyCopy> = {
  en: {
    eyebrow: "Ready to join",
    title: "Design sync — weekly",
    description: "Check your camera and mic before you walk in. Fasla remembers these settings for next time.",
    when: "Today · 10:00 – 10:45",
    invited: "6 invited",
    encrypted: "Encrypted",
    cameraLabel: "Camera",
    microphoneLabel: "Microphone",
    speakerLabel: "Speaker",
    cameras: [
      { value: "facetime", label: "FaceTime HD" },
      { value: "external", label: "External webcam" },
    ],
    microphones: [
      { value: "macbook", label: "MacBook Pro Mic" },
      { value: "headset", label: "Headset mic" },
    ],
    speakers: [
      { value: "airpods", label: "AirPods Pro" },
      { value: "macbook", label: "MacBook speakers" },
    ],
    join: "Join now",
    joining: "Waiting for your camera",
    testSpeakers: "Test speakers",
    notice: "By joining you agree to Fasla's meeting recording notice.",
    self: "Omar Yousef (you)",
    pillLabel: "Device controls",
    mic: { label: "Mute microphone", offLabel: "Unmute microphone" },
    camera: { label: "Turn camera off", offLabel: "Turn camera on" },
    settings: "Device settings",
  },
  ar: {
    eyebrow: "جاهز للانضمام",
    title: "مزامنة التصميم الأسبوعية",
    description: "تحقّق من الكاميرا والميكروفون قبل الدخول. تحفظ فاصلة هذه الإعدادات للمرة القادمة.",
    when: "اليوم، 10:00 – 10:45",
    invited: "6 مدعوّين",
    encrypted: "مشفّر",
    cameraLabel: "الكاميرا",
    microphoneLabel: "الميكروفون",
    speakerLabel: "مكبّر الصوت",
    cameras: [
      { value: "facetime", label: "FaceTime HD" },
      { value: "external", label: "كاميرا خارجية" },
    ],
    microphones: [
      { value: "macbook", label: "MacBook Pro Mic" },
      { value: "headset", label: "ميكروفون سماعة الرأس" },
    ],
    speakers: [
      { value: "airpods", label: "AirPods Pro" },
      { value: "macbook", label: "مكبّرات MacBook" },
    ],
    join: "انضم الآن",
    joining: "بانتظار الكاميرا",
    testSpeakers: "اختبار الصوت",
    notice: "بالانضمام أنت توافق على إشعار تسجيل الاجتماعات في فاصلة.",
    self: "عمر يوسف (أنت)",
    pillLabel: "عناصر التحكم بالأجهزة",
    mic: { label: "كتم الميكروفون", offLabel: "إلغاء كتم الميكروفون" },
    camera: { label: "إيقاف الكاميرا", offLabel: "تشغيل الكاميرا" },
    settings: "إعدادات الأجهزة",
  },
}

export interface VideoCallPreJoinLobbyProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<VideoCallPreJoinLobbyCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** Your camera still. Without one the preview shows a plain `muted` ground. */
  photo?: VideoCallPhoto
  /** False until the camera has sent its first frame: Join is disabled and shows a spinner. */
  cameraReady?: boolean
  /** Whether the mic starts on. */
  defaultMicOn?: boolean
  /** Whether the camera starts on. */
  defaultCameraOn?: boolean
  /** Called when Join now is pressed. */
  onJoin?: () => void
  /** Called when Test speakers is pressed. */
  onTestSpeakers?: () => void
  /** Called with `mic` or `camera` and whether it is now on, and with `settings`. */
  onControl?: (id: "mic" | "camera" | "settings", on: boolean) => void
  /** Called with the picker (`camera`, `microphone` or `speaker`) and the device chosen. */
  onDeviceChange?: (kind: "camera" | "microphone" | "speaker", value: string) => void
}

export function VideoCallPreJoinLobby({
  locale = "en",
  photo,
  cameraReady = true,
  defaultMicOn = true,
  defaultCameraOn = true,
  onJoin,
  onTestSpeakers,
  onControl,
  onDeviceChange,
  className,
  ...props
}: VideoCallPreJoinLobbyProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallPreJoinLobbyCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const [micOn, setMicOn] = React.useState(defaultMicOn)
  const [cameraOn, setCameraOn] = React.useState(defaultCameraOn)
  const reveal = useRevealOnce<HTMLDivElement>()
  const preview = React.useRef<HTMLDivElement>(null)

  // The preview fades up over 240ms; the copy's own entrance (60ms apart) follows.
  React.useEffect(() => {
    const node = preview.current
    if (!node || typeof node.animate !== "function") return
    const animation = node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: prefersReducedMotion() ? FAST_MS : 240, easing: STANDARD })
    return () => animation.cancel()
  }, [])

  const toggle = (id: "mic" | "camera") => {
    const next = id === "mic" ? !micOn : !cameraOn
    if (id === "mic") setMicOn(next)
    else setCameraOn(next)
    onControl?.(id, next)
  }

  const pillButton = (id: "mic" | "camera", on: boolean, label: string, onIcon: React.ReactNode, offIcon: React.ReactNode) => (
    <Button
      type="button"
      variant={on ? "ghost" : "default"}
      tone={on ? "secondary" : "destructive"}
      size="icon-lg"
      radius="rounded"
      aria-label={label}
      aria-pressed={!on}
      onClick={() => toggle(id)}
      className="transition-[background-color,color] duration-[160ms] motion-reduce:transition-none"
    >
      <span key={on ? "on" : "off"} className="flex animate-in fade-in duration-100 motion-reduce:animate-none">
        {on ? onIcon : offIcon}
      </span>
    </Button>
  )

  return (
    <VideoCallSection labelledBy={headingId} className={className} {...rest}>
      <div ref={reveal} className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-12">
        <div ref={preview} className="relative shrink-0">
          <ParticipantTile
            name={copy.self}
            photo={photo}
            chip="none"
            className="aspect-video w-full rounded-xl [@container(min-width:64rem)]:h-[440px] [@container(min-width:64rem)]:w-[680px]"
          >
            {/* The name label: bottom start on Desktop and Tablet, top start on a phone so it clears the pill. */}
            <span className="absolute start-3 top-3 [@container(min-width:40rem)]:top-auto [@container(min-width:40rem)]:bottom-3">
              <PreviewName name={copy.self} muted={!micOn} />
            </span>
            <div
              role="group"
              aria-label={copy.pillLabel}
              dir="ltr"
              className="absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-card p-2 [@container(min-width:40rem)]:bottom-6"
            >
              {pillButton("mic", micOn, micOn ? copy.mic.label : copy.mic.offLabel, <Mic aria-hidden />, <MicOff aria-hidden />)}
              {pillButton("camera", cameraOn, cameraOn ? copy.camera.label : copy.camera.offLabel, <Video aria-hidden />, <VideoOff aria-hidden />)}
              <Button type="button" variant="ghost" tone="secondary" size="icon-lg" radius="rounded" aria-label={copy.settings} onClick={() => onControl?.("settings", true)}>
                <Settings aria-hidden />
              </Button>
            </div>
          </ParticipantTile>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <p data-reveal="" className={cn("text-xs font-medium text-foreground", locale === "en" && "uppercase tracking-wider")}>
            {copy.eyebrow}
          </p>
          <h2 data-reveal="" id={headingId} className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
            <Figures>{copy.title}</Figures>
          </h2>
          <p data-reveal="" className="text-base text-muted-foreground">
            {copy.description}
          </p>
          <ul data-reveal="" className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <MetaItem icon={<CalendarDays aria-hidden />}>
              <Figures>{copy.when}</Figures>
            </MetaItem>
            <MetaItem icon={<Users aria-hidden />}>
              <Figures>{copy.invited}</Figures>
            </MetaItem>
            <MetaItem icon={<ShieldCheck aria-hidden />}>{copy.encrypted}</MetaItem>
          </ul>
          <div data-reveal="" className="grid grid-cols-1 gap-3 [@container(min-width:40rem)]:grid-cols-3">
            <DevicePicker label={copy.cameraLabel} items={copy.cameras} onChange={(value) => onDeviceChange?.("camera", value)} />
            <DevicePicker label={copy.microphoneLabel} items={copy.microphones} onChange={(value) => onDeviceChange?.("microphone", value)} />
            <DevicePicker label={copy.speakerLabel} items={copy.speakers} onChange={(value) => onDeviceChange?.("speaker", value)} />
          </div>
          <div data-reveal="" className="flex flex-col gap-2 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:gap-3">
            <Button type="button" size="lg" loading={!cameraReady} loadingLabel={copy.joining} onClick={onJoin} className="w-full [@container(min-width:40rem)]:w-auto">
              {copy.join}
            </Button>
            <Button type="button" variant="outline" tone="secondary" size="lg" onClick={onTestSpeakers} className="w-full [@container(min-width:40rem)]:w-auto">
              {copy.testSpeakers}
            </Button>
          </div>
          <p data-reveal="" className="text-xs text-muted-foreground">
            {copy.notice}
          </p>
        </div>
      </div>
    </VideoCallSection>
  )
}

function PreviewName({ name, muted }: { name: string; muted: boolean }) {
  return (
    <Badge variant="solid" tone="primary" size="lg" radius="standard" icon={muted ? <MicOff /> : <Mic />}>
      <Figures>{name}</Figures>
    </Badge>
  )
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0">
      {icon}
      <span>{children}</span>
    </li>
  )
}

function DevicePicker({ label, items, onChange }: { label: string; items: VideoCallDevice[]; onChange: (value: string) => void }) {
  return (
    <Select
      size="lg"
      label={label}
      items={items}
      defaultValue={items[0]?.value}
      onValueChange={(value) => {
        if (value) onChange(value)
      }}
    />
  )
}

const COPY_KEYS = Object.keys(COPY.en)

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallPreJoinLobbyCopy = COPY
