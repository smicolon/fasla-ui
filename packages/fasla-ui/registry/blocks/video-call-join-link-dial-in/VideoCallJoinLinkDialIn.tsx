"use client"

import * as React from "react"
import { Bell, CalendarDays, Check, Copy, Globe, Link as LinkIcon, Lock, Mail, Phone, QrCode, Share2, ShieldCheck, UserPlus, Video } from "lucide-react"
import { Button } from "../../ui/button/button"
import { cn } from "../../../src/lib/utils"
import {
  FAST_MS,
  Figures,
  Latin,
  STANDARD,
  VIDEO_CALL_CARD,
  VideoCallSection,
  VideoCallSeparator,
  containerTier,
  passedCopy,
  prefersReducedMotion,
  restOf,
  type VideoCallLocale,
} from "../video-call/video-call"

/*
 * Figma: `Video Call` (42869:1033), Type=Join Link & Dial-in.
 *
 * Two cards. The room card has the room's name and a line on it, the link in a
 * field with Copy link, four ways to share it (Email invite, Add to calendar,
 * Invite by name, More ways), a hairline, and the dial-in numbers with their
 * PIN. The access card has the QR code, who can join and how it is guarded,
 * and Manage room settings.
 *
 * Desktop sets the room card at the start and the 400px access card at the
 * end; Tablet stacks them, the share row and the numbers two across; a phone
 * stacks everything, with Copy link under the link at full width and the QR
 * folded behind a Show QR button.
 *
 * Copy link becomes Copied with a check, holds for 1.6s and goes back; the
 * button's width animates over the swap so the row never jumps (a full-width
 * button on a phone has no width to animate). A new `qrKey` cross-fades the QR
 * over 240ms with a 4px blur on the outgoing image. The dial-in cards rise in
 * 40ms apart the first time they scroll into view; Show QR opens the QR by
 * growing its height over 200ms. Reduced motion makes each of these a plain
 * fade. The link and the numbers stay left-to-right in Arabic, as technical
 * strings do; the country name leads on the start side.
 *
 * Stills only: the QR is a glyph. Every real action (copy, the four shares,
 * manage settings) is a callback; Copied and whether the QR is open are state
 * the block keeps itself. With no `onCopy`, Copy link writes the link to the
 * clipboard where the browser allows it.
 *
 * Content limits: the room's name up to 40 characters, a country up to 28. The
 * other limits are in the block's documentation page, which the default copy
 * stays inside.
 */

export interface VideoCallDialNumber {
  id: string
  /** The country, on the start side. */
  country: string
  /** The number, always left to right. */
  number: string
}

export interface VideoCallAccessSetting {
  id: string
  label: string
  /** The value at the end: `On`, `Always`. */
  value: string
  /** `success` draws the value in green, as Figma does for On. */
  tone?: "success" | "muted"
  icon: "globe" | "lock" | "shield" | "bell"
}

export interface VideoCallJoinLinkDialInCopy {
  /** The room's name, an `h2`, and the line under it. */
  title: string
  subtitle: string
  /** The link, shown as given. */
  link: string
  copy: string
  copied: string
  /** The four share buttons, in order: email, calendar, name, more. */
  shares: [string, string, string, string]
  dialIn: string
  pin: string
  numbers: VideoCallDialNumber[]
  /** The access card. */
  qrCaption: string
  qrLabel: string
  showQr: string
  hideQr: string
  whoCanJoin: string
  settings: VideoCallAccessSetting[]
  manage: string
}

/** Figma's copy, English and Arabic. */
const COPY: Record<VideoCallLocale, VideoCallJoinLinkDialInCopy> = {
  en: {
    title: "Your personal room is always on",
    subtitle: "Share one link. Nobody installs anything.",
    link: "fasla.to/yasmin-haddad",
    copy: "Copy link",
    copied: "Copied",
    shares: ["Email invite", "Add to calendar", "Invite by name", "More ways"],
    dialIn: "Dial in by phone",
    pin: "PIN 884 210",
    numbers: [
      { id: "ae", country: "United Arab Emirates", number: "+971 4 555 0198" },
      { id: "sa", country: "Saudi Arabia", number: "+966 11 250 4471" },
      { id: "uk", country: "United Kingdom", number: "+44 20 7946 0212" },
    ],
    qrCaption: "Scan to join from a phone",
    qrLabel: "QR code for the room link",
    showQr: "Show QR",
    hideQr: "Hide QR",
    whoCanJoin: "Who can join",
    settings: [
      { id: "link", label: "Anyone with the link", value: "On", tone: "success", icon: "globe" },
      { id: "waiting", label: "Waiting room for externals", value: "On", tone: "success", icon: "lock" },
      { id: "e2e", label: "End-to-end encryption", value: "Always", tone: "muted", icon: "shield" },
      { id: "notify", label: "Notify me when someone waits", value: "On", tone: "success", icon: "bell" },
    ],
    manage: "Manage room settings",
  },
  ar: {
    title: "غرفتك الشخصية مفتوحة دائمًا",
    subtitle: "شارك رابطًا واحدًا. لا حاجة لتثبيت أي شيء.",
    link: "fasla.to/yasmin-haddad",
    copy: "نسخ الرابط",
    copied: "تم النسخ",
    shares: ["دعوة بالبريد", "إضافة إلى التقويم", "دعوة بالاسم", "طرق أخرى"],
    dialIn: "الاتصال عبر الهاتف",
    pin: "الرقم السري 884 210",
    numbers: [
      { id: "ae", country: "الإمارات العربية المتحدة", number: "+971 4 555 0198" },
      { id: "sa", country: "السعودية", number: "+966 11 250 4471" },
      { id: "uk", country: "المملكة المتحدة", number: "+44 20 7946 0212" },
    ],
    qrCaption: "امسح الرمز للانضمام من الهاتف",
    qrLabel: "رمز QR لرابط الغرفة",
    showQr: "إظهار رمز QR",
    hideQr: "إخفاء رمز QR",
    whoCanJoin: "من يمكنه الانضمام",
    settings: [
      { id: "link", label: "أي شخص لديه الرابط", value: "مفعّل", tone: "success", icon: "globe" },
      { id: "waiting", label: "غرفة الانتظار للخارجيين", value: "مفعّل", tone: "success", icon: "lock" },
      { id: "e2e", label: "تشفير من الطرف إلى الطرف", value: "دائمًا", tone: "muted", icon: "shield" },
      { id: "notify", label: "أبلغني عند انتظار أحد", value: "مفعّل", tone: "success", icon: "bell" },
    ],
    manage: "إدارة إعدادات الغرفة",
  },
}

const COPY_KEYS = Object.keys(COPY.en)

const SETTING_ICONS = { globe: Globe, lock: Lock, shield: ShieldCheck, bell: Bell } as const
const SHARES = [
  { id: "email", Icon: Mail },
  { id: "calendar", Icon: CalendarDays },
  { id: "name", Icon: UserPlus },
  { id: "more", Icon: Share2 },
] as const

export type VideoCallShareId = (typeof SHARES)[number]["id"]

export interface VideoCallJoinLinkDialInProps extends Omit<React.HTMLAttributes<HTMLElement>, "onCopy">, Partial<VideoCallJoinLinkDialInCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: VideoCallLocale
  /** Whether the QR starts open on a phone. Tablet and Desktop always show it. */
  defaultQrOpen?: boolean
  /** Changes when the link is regenerated: the QR cross-fades to the new one. */
  qrKey?: string
  /** Starts the copy confirmation, as if Copy link had just been pressed. */
  defaultCopied?: boolean
  /** Called with the link when Copy link is pressed. Without it the block writes the link to the clipboard. */
  onCopy?: (link: string) => void
  /** Called with `email`, `calendar`, `name` or `more` when a share button is pressed. */
  onShare?: (id: VideoCallShareId) => void
  /** Called when Manage room settings is pressed. */
  onManage?: () => void
  /** Called with whether the QR is now open. */
  onQrOpenChange?: (open: boolean) => void
}

export function VideoCallJoinLinkDialIn({
  locale = "en",
  defaultQrOpen = false,
  qrKey = "a",
  defaultCopied = false,
  onCopy,
  onShare,
  onManage,
  onQrOpenChange,
  className,
  ...props
}: VideoCallJoinLinkDialInProps) {
  const copy = { ...COPY[locale], ...passedCopy(COPY_KEYS, props) } as VideoCallJoinLinkDialInCopy
  const rest = restOf(COPY_KEYS, props) as React.HTMLAttributes<HTMLElement>
  const headingId = React.useId()
  const qrId = React.useId()
  const [copied, setCopied] = React.useState(defaultCopied)
  const [qrOpen, setQrOpen] = React.useState(defaultQrOpen)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const button = React.useRef<HTMLButtonElement>(null)
  const widthBefore = React.useRef<number | null>(null)
  const qrBox = React.useRef<HTMLDivElement>(null)
  const dial = React.useRef<HTMLDivElement>(null)
  const firstQr = React.useRef(true)

  React.useEffect(() => () => clearTimeout(timer.current), [])
  React.useEffect(() => {
    if (defaultCopied) timer.current = setTimeout(() => setCopied(false), 1600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The button's width animates between its two labels, except where it is full width.
  React.useLayoutEffect(() => {
    const node = button.current
    const before = widthBefore.current
    widthBefore.current = null
    if (!node || before === null || typeof node.animate !== "function" || containerTier(node) === "mobile") return
    const after = node.offsetWidth
    if (Math.abs(after - before) < 1) return
    node.animate([{ width: `${before}px` }, { width: `${after}px` }], { duration: prefersReducedMotion() ? 0 : 180, easing: STANDARD })
  }, [copied])

  const press = () => {
    widthBefore.current = button.current?.offsetWidth ?? null
    if (onCopy) onCopy(copy.link)
    else if (typeof navigator !== "undefined") navigator.clipboard?.writeText(copy.link).catch(() => undefined)
    clearTimeout(timer.current)
    setCopied(true)
    timer.current = setTimeout(() => {
      widthBefore.current = button.current?.offsetWidth ?? null
      setCopied(false)
    }, 1600)
  }

  // Show QR opens the QR by growing its height over 200ms.
  React.useEffect(() => {
    if (firstQr.current) {
      firstQr.current = false
      return
    }
    const node = qrBox.current
    if (!node || !qrOpen || typeof node.animate !== "function" || containerTier(node) !== "mobile") return
    node.animate(prefersReducedMotion() ? [{ opacity: 0 }, { opacity: 1 }] : [{ height: "0px", opacity: 0 }, { height: `${node.offsetHeight}px`, opacity: 1 }], { duration: prefersReducedMotion() ? FAST_MS : 200, easing: STANDARD })
  }, [qrOpen])

  // The dial-in cards rise in 40ms apart the first time they scroll into view.
  React.useEffect(() => {
    const node = dial.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const cards = Array.from(node.querySelectorAll<HTMLElement>("[data-dial]"))
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const reduced = prefersReducedMotion()
        cards.forEach((card, index) => {
          if (typeof card.animate !== "function") return
          card.animate(reduced ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: reduced ? FAST_MS : 180, delay: reduced ? 0 : index * 40, easing: STANDARD, fill: "backwards" })
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const toggleQr = () => {
    setQrOpen(!qrOpen)
    onQrOpenChange?.(!qrOpen)
  }

  return (
    <VideoCallSection labelledBy={headingId} className={className} {...rest}>
      <div className="flex flex-col gap-5 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-6">
        {/* The room card */}
        <div className={cn(VIDEO_CALL_CARD, "flex min-w-0 flex-1 flex-col gap-6 p-6 [@container(min-width:40rem)]:p-10")}>
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Video aria-hidden className="size-6" />
            </span>
            <div className="min-w-0">
              <h2 id={headingId} className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl">
                {copy.title}
              </h2>
              <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-lg bg-muted p-3 ps-5 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <LinkIcon aria-hidden className="size-[18px] shrink-0 text-muted-foreground" />
              <Latin className="truncate text-base text-foreground">{copy.link}</Latin>
            </div>
            <Button ref={button} type="button" size="lg" onClick={press} className="w-full [@container(min-width:40rem)]:w-auto [@container(min-width:40rem)]:shrink-0">
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              <span role="status" aria-live="polite">
                {copied ? copy.copied : copy.copy}
              </span>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:40rem)]:gap-3 [@container(min-width:64rem)]:grid-cols-4">
            {copy.shares.map((label, index) => {
              const share = SHARES[index]
              if (!share) return null
              return (
                <Button key={share.id} type="button" variant="outline" tone="secondary" size="lg" className="w-full" onClick={() => onShare?.(share.id)}>
                  <share.Icon aria-hidden />
                  {label}
                </Button>
              )
            })}
          </div>
          <VideoCallSeparator />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone aria-hidden className="size-4 shrink-0 text-foreground" />
              <span className="font-medium text-foreground">{copy.dialIn}</span>
              <span className="ms-auto text-xs text-muted-foreground">
                <Figures>{copy.pin}</Figures>
              </span>
            </div>
            <div ref={dial} className="grid grid-cols-1 gap-3 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
              {copy.numbers.map((entry) => (
                <div key={entry.id} data-dial="" className="flex flex-col gap-1 rounded-md bg-muted px-4 py-3">
                  <span className="text-xs text-muted-foreground">{entry.country}</span>
                  <Latin className="text-base font-semibold text-foreground">{entry.number}</Latin>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The access card */}
        <div className={cn(VIDEO_CALL_CARD, "flex shrink-0 flex-col gap-5 p-8 [@container(min-width:64rem)]:w-[400px] [@container(min-width:64rem)]:self-stretch")}>
          <Button type="button" variant="outline" tone="secondary" aria-expanded={qrOpen} aria-controls={qrId} onClick={toggleQr} className="w-full [@container(min-width:40rem)]:hidden">
            <Figures>{qrOpen ? copy.hideQr : copy.showQr}</Figures>
          </Button>
          <div ref={qrBox} id={qrId} className={cn("flex-col items-center gap-3 overflow-hidden rounded-lg bg-muted p-5", qrOpen ? "flex" : "hidden [@container(min-width:40rem)]:flex")}>
            <QrImage qrKey={qrKey} label={copy.qrLabel} />
            <p className="text-xs text-muted-foreground">{copy.qrCaption}</p>
          </div>
          <p className="text-sm font-medium text-foreground">{copy.whoCanJoin}</p>
          <ul className="flex flex-col gap-3">
            {copy.settings.map((setting) => {
              const Icon = SETTING_ICONS[setting.icon]
              return (
                <li key={setting.id} className="flex items-center gap-3 text-sm">
                  <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 text-foreground">{setting.label}</span>
                  <span className={cn("text-xs", setting.tone === "success" ? "text-success" : "text-muted-foreground")}>{setting.value}</span>
                </li>
              )
            })}
          </ul>
          <Button type="button" variant="outline" tone="secondary" className="w-full" onClick={onManage}>
            {copy.manage}
          </Button>
        </div>
      </div>
    </VideoCallSection>
  )
}

/** The QR glyph. A new `qrKey` cross-fades it over 240ms, the outgoing one blurring 4px as it goes. */
function QrImage({ qrKey, label }: { qrKey: string; label: string }) {
  const [shown, setShown] = React.useState(qrKey)
  const [outgoing, setOutgoing] = React.useState<string | null>(null)
  const current = React.useRef<HTMLSpanElement>(null)
  const old = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (qrKey === shown) return
    setOutgoing(shown)
    setShown(qrKey)
  }, [qrKey, shown])

  React.useLayoutEffect(() => {
    if (outgoing === null) return
    const reduced = prefersReducedMotion()
    const next = current.current
    const prev = old.current
    next?.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? FAST_MS : 240, easing: STANDARD })
    const animation = prev?.animate?.(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, filter: "blur(0px)" }, { opacity: 0, filter: "blur(4px)" }], { duration: reduced ? FAST_MS : 240, easing: STANDARD, fill: "forwards" })
    if (animation) animation.onfinish = () => setOutgoing(null)
    else setOutgoing(null)
  }, [outgoing])

  return (
    <div role="img" aria-label={label} className="relative size-28">
      {outgoing !== null ? (
        <span ref={old} aria-hidden className="absolute inset-0 flex items-center justify-center">
          <QrCode className="size-28 text-foreground" strokeWidth={1.25} />
        </span>
      ) : null}
      <span ref={current} aria-hidden data-qr={shown} className="absolute inset-0 flex items-center justify-center">
        <QrCode className="size-28 text-foreground" strokeWidth={1.25} />
      </span>
    </div>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const videoCallJoinLinkDialInCopy = COPY
