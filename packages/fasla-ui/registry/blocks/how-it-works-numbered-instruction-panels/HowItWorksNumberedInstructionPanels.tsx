"use client"

import * as React from "react"
import { ArrowRight, FolderOpen, Gift, Hand, Heart, Image as ImageIcon, MapPin, MousePointer2, Sparkles } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { HOW_IT_WORKS_ICON, enter, HowItWorksSection, POP, prefersReducedMotion, revealTargets, useRevealOnEnter, type HowItWorksLocale } from "../how-it-works/how-it-works"

/*
 * Figma: `How it Works` (42334:294272), Type=Numbered Instruction Panels.
 *
 * A centred header (a soft badge, the heading, a line), then three numbered
 * panels: a 32px circle with its number, a 200px picture, and a caption under
 * it. The pictures are drawn here and hidden from screen readers; each caption
 * says what happens: a file picked from an album, dragged into a shared
 * folder, and found in a list.
 *
 * Desktop sets the panels three across, 32px apart. Tablet and Mobile stack
 * them in one column, each number above its picture. The page's `dir` mirrors
 * the order, and the drag runs the other way: toward the folder on the left.
 *
 * Motion plays once, when the block comes into view, the three steps one after
 * another, 900ms each: the cursor lands on the file and two rings expand from
 * it; the dragged icon slides in along the arrow, two ghosts fading behind it,
 * and the folder's dashed border flashes solid on arrival; the selected row
 * highlights and the Shared chip pops. Each number pulses once as its step
 * starts. Hovering a panel plays its step again. Under reduced motion the
 * block is its finished state.
 *
 * Content limits: the heading up to 50 characters, a caption up to 60, a
 * picture's labels up to 12.
 */

export interface HowItWorksNumberedInstructionPanelsCopy {
  /** The soft badge above the heading. */
  badge: React.ReactNode
  /** The heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  intro: React.ReactNode
  /** The three captions, one under each picture. */
  steps: [React.ReactNode, React.ReactNode, React.ReactNode]
  /** The words inside the pictures. */
  scene: {
    albums: React.ReactNode
    file: React.ReactNode
    shared: React.ReactNode
    /** The four rows of the list, such as "Birthday". The third is the selected one. */
    rows: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
    /** The chip under the list. */
    chip: React.ReactNode
  }
}

/** Figma's copy, English and Arabic. */
const COPY: Record<HowItWorksLocale, HowItWorksNumberedInstructionPanelsCopy> = {
  en: {
    badge: "Share photos",
    heading: "Your album is ready. Three steps to share it.",
    intro: "Invite people with a link, or add them one by one whenever you like.",
    steps: ["Pick the photos you want to share from your album.", "Drag them into the shared folder on the right.", "Open the shared folder to see everyone's additions."],
    scene: { albums: "Albums", file: "Holiday", shared: "Shared", rows: ["Birthday", "Garden", "Holiday", "Pets"], chip: "Shared" },
  },
  ar: {
    badge: "مشاركة الصور",
    heading: "ألبومك جاهز. ثلاث خطوات لمشاركته.",
    intro: "ادعُ الآخرين برابط، أو أضفهم واحدًا واحدًا في أي وقت.",
    steps: ["اختر الصور التي تريد مشاركتها من ألبومك.", "اسحبها إلى المجلد المشترك على اليسار.", "افتح المجلد المشترك لترى إضافات الجميع."],
    scene: { albums: "الألبومات", file: "العطلة", shared: "المشتركة", rows: ["عيد الميلاد", "الحديقة", "العطلة", "الحيوانات الأليفة"], chip: "تمت المشاركة" },
  },
}

const ROW_ICONS = [Gift, Sparkles, MapPin, Heart]

/** The picture's frame: 200px tall, its 300 × 170 scene centred, scaled down to fit a phone. */
function Visual({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className={cn("flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[14px] p-4", tone)}>
      <div className="relative h-[170px] w-[300px] shrink-0 scale-[0.85] [@container(min-width:40rem)]:scale-100">{children}</div>
    </div>
  )
}

/** A scene's item placed by its start edge and top, from Figma's x and y in a 300 × 170 box. */
const at = (x: number, y: number): React.CSSProperties => ({ insetInlineStart: x, top: y })

/** Plays one step: its number, then what its picture shows. */
function playStep(step: HTMLElement, delay: number): Animation[] {
  const animations: Animation[] = []
  const inner = (name: string) => Array.from(step.querySelectorAll<HTMLElement>(`[data-reveal="${name}"]`))
  const dir = getComputedStyle(step).direction === "rtl" ? -1 : 1
  inner("number").forEach((el) => animations.push(el.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 300, delay, easing: "ease-out" })))
  inner("cursor").forEach((el) => animations.push(enter(el, [{ opacity: 0, transform: `translate(${-dir * 24}px, -24px)` }, { opacity: 1, transform: "none" }], { duration: 500, delay: delay + 100 })))
  inner("ripple").forEach((el, i) => animations.push(el.animate([{ transform: "scale(0.6)", opacity: 0.6 }, { transform: "scale(1.2)", opacity: 0 }], { duration: 600, delay: delay + 400 + i * 150, easing: "ease-out" })))
  inner("drag").forEach((el) => animations.push(enter(el, [{ opacity: 0, transform: `translateX(${-dir * 56}px)` }, { opacity: 1, transform: "none" }], { duration: 700, delay: delay + 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" })))
  inner("ghost").forEach((el, i) =>
    animations.push(enter(el, [{ opacity: 0 }, { opacity: getComputedStyle(el).opacity }], { duration: 300, delay: delay + 300 + i * 150 }))
  )
  inner("arrival").forEach((el) => animations.push(el.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 500, delay: delay + 700 })))
  inner("row").forEach((el) => animations.push(enter(el, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: delay + 300 })))
  inner("chip").forEach((el) => animations.push(enter(el, POP, { duration: 220, delay: delay + 600 })))
  return animations
}

export interface HowItWorksNumberedInstructionPanelsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<HowItWorksNumberedInstructionPanelsCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: HowItWorksLocale
}

export function HowItWorksNumberedInstructionPanels({ locale = "en", badge, heading, intro, steps, scene, className, ...props }: HowItWorksNumberedInstructionPanelsProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rootRef = React.useRef<HTMLElement>(null)
  const captions = steps ?? copy.steps
  const words = scene ?? copy.scene

  useRevealOnEnter(rootRef, (node) => revealTargets(node, "step").flatMap((step, index) => playStep(step, index * 900)))
  const replay = (event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion() || typeof event.currentTarget.animate !== "function") return
    playStep(event.currentTarget, 0)
  }

  return (
    <HowItWorksSection ref={rootRef} labelledBy={headingId} className={className} {...props}>
      <header className="flex w-full flex-col items-center gap-4 text-center">
        <Badge variant="soft" tone="success" size="md" radius="rounded">
          {badge ?? copy.badge}
        </Badge>
        <h2 id={headingId} className="text-2xl font-medium text-foreground [@container(min-width:40rem)]:text-3xl">
          {heading ?? copy.heading}
        </h2>
        <p className="max-w-[520px] text-sm text-muted-foreground">{intro ?? copy.intro}</p>
      </header>

      <ol className="grid grid-cols-1 gap-8 [@container(min-width:64rem)]:grid-cols-3 [@container(min-width:64rem)]:px-16 [@container(min-width:64rem)]:pt-8">
        <li data-reveal="step" onMouseEnter={replay} className="flex min-w-0 flex-col items-center gap-6">
          <span data-reveal="number" className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            1
          </span>
          <Visual tone="bg-accent">
            <span className="absolute flex h-7 items-center gap-1.5 rounded-md bg-card px-3 text-sm text-foreground" style={at(86, 0)}>
              <FolderOpen size={16} {...HOW_IT_WORKS_ICON} />
              {words.albums}
            </span>
            {[28, 208].map((x) => (
              <span key={x} className="absolute flex h-20 w-16 items-center justify-center rounded-[10px] border border-border bg-card opacity-50" style={at(x, 60)}>
                <ImageIcon size={24} {...HOW_IT_WORKS_ICON} className="text-muted-foreground" />
              </span>
            ))}
            <span data-reveal="ripple" className="absolute size-[110px] rounded-full border border-primary opacity-25" style={at(95, 57)} />
            <span data-reveal="ripple" className="absolute size-[84px] rounded-full border border-primary opacity-45" style={at(108, 70)} />
            <span className="absolute flex h-[100px] w-[84px] flex-col items-center justify-center gap-2 rounded-[10px] border border-primary bg-card" style={at(108, 56)}>
              <ImageIcon size={32} {...HOW_IT_WORKS_ICON} className="text-foreground" />
              <span className="text-xs text-foreground">{words.file}</span>
            </span>
            <MousePointer2 data-reveal="cursor" size={28} {...HOW_IT_WORKS_ICON} className="absolute fill-background text-foreground" style={at(168, 120)} />
          </Visual>
          <p className="max-w-[288px] text-center text-sm text-muted-foreground">{captions[0]}</p>
        </li>

        <li data-reveal="step" onMouseEnter={replay} className="flex min-w-0 flex-col items-center gap-6">
          <span data-reveal="number" className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            2
          </span>
          <Visual tone="bg-muted">
            {(
              [
                { x: 40, opacity: 0.15 },
                { x: 26, opacity: 0.4 },
              ] as const
            ).map(({ x, opacity }) => (
              <span key={x} data-reveal="ghost" className="absolute flex size-16 items-center justify-center rounded-xl border border-border bg-card" style={{ ...at(x, 40), opacity }}>
                <ImageIcon size={28} {...HOW_IT_WORKS_ICON} className="text-foreground" />
              </span>
            ))}
            <span data-reveal="drag" className="absolute flex size-16 items-center justify-center rounded-xl border border-primary bg-card" style={at(60, 40)}>
              <ImageIcon size={28} {...HOW_IT_WORKS_ICON} className="text-foreground" />
            </span>
            <ArrowRight size={24} {...HOW_IT_WORKS_ICON} className="absolute text-foreground [&:dir(rtl)]:-scale-x-100" style={at(138, 60)} />
            <span className="absolute flex h-24 w-[116px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-primary" style={at(176, 24)}>
              <span data-reveal="arrival" className="absolute inset-0 rounded-xl border border-primary opacity-0" />
              <FolderOpen size={32} {...HOW_IT_WORKS_ICON} className="text-foreground" />
              <span className="text-xs text-foreground">{words.shared}</span>
            </span>
            <Hand size={24} {...HOW_IT_WORKS_ICON} className="absolute fill-background text-foreground" style={at(96, 84)} />
          </Visual>
          <p className="max-w-[288px] text-center text-sm text-muted-foreground">{captions[1]}</p>
        </li>

        <li data-reveal="step" onMouseEnter={replay} className="flex min-w-0 flex-col items-center gap-6">
          <span data-reveal="number" className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            3
          </span>
          <Visual tone="border border-border bg-card">
            <ul className="absolute flex h-32 w-[260px] flex-col overflow-hidden rounded-md bg-card" style={at(20, 0)}>
              {words.rows.map((row, index) => {
                const Icon = ROW_ICONS[index]
                if (!Icon) return null
                return (
                  <li key={index} className="relative flex h-8 items-center gap-2 px-3 text-sm text-foreground">
                    {index === 2 ? <span data-reveal="row" className="absolute inset-0 bg-accent" /> : null}
                    <Icon size={16} {...HOW_IT_WORKS_ICON} className="relative shrink-0" />
                    <span className="relative min-w-0 truncate">{row}</span>
                  </li>
                )
              })}
            </ul>
            <span data-reveal="chip" className="absolute" style={at(20, 152)}>
              <Badge variant="soft" tone="success" size="md" radius="rounded">
                {words.chip}
              </Badge>
            </span>
            <MousePointer2 data-reveal="cursor" size={28} {...HOW_IT_WORKS_ICON} className="absolute fill-background text-foreground" style={at(200, 74)} />
          </Visual>
          <p className="max-w-[288px] text-center text-sm text-muted-foreground">{captions[2]}</p>
        </li>
      </ol>
    </HowItWorksSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const howItWorksNumberedInstructionPanelsCopy = COPY
