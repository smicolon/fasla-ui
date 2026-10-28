"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs/tabs"
import { Reveal, TeamHeader, TeamPortrait, TeamSection, type TeamPerson } from "../team/team"

// useLayoutEffect warns during server rendering in React 18.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface UseFlipOptions {
  /** Milliseconds for the move and the fades. Default 220. */
  duration?: number
  /** CSS easing. Default `cubic-bezier(0.22, 1, 0.36, 1)`. */
  easing?: string
}

/**
 * A small FLIP for a grid whose items come and go: First, Last, Invert, Play,
 * with the Web Animations API and no dependency.
 *
 * Every direct child of `containerRef` carrying `data-flip-id` is an item;
 * one that is not shown has the `hidden` attribute. After every layout where
 * `key` changed, the hook compares each item's box with where it was, in the
 * container's own coordinates so scrolling does not matter:
 *  - an item that stays moves from its old place to the new one;
 *  - an item that appears fades in;
 *  - an item that goes is held at its old place (absolutely positioned) while it
 *    fades out, then is hidden again.
 *
 * With reduced motion, or when the grid is a single column, nothing moves:
 * items only cross-fade. Where the Web Animations API is missing (tests) it
 * does nothing. The container needs `position: relative`.
 */
export function useFlip(
  containerRef: React.RefObject<HTMLElement | null>,
  key: string,
  { duration = 220, easing = "cubic-bezier(0.22, 1, 0.36, 1)" }: UseFlipOptions = {}
) {
  const boxes = React.useRef<Map<string, Box>>(new Map())

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return
    const items = Array.from(container.querySelectorAll<HTMLElement>(":scope > [data-flip-id]"))

    const settle = (item: HTMLElement) => {
      if (item.dataset.flipLeaving) {
        delete item.dataset.flipLeaving
        item.style.cssText = ""
        item.removeAttribute("aria-hidden")
      }
    }

    // Stop what a fast second click interrupts, then measure the true layout.
    for (const item of items) {
      item.getAnimations?.().forEach((animation) => animation.cancel())
      settle(item)
    }

    const measure = () => {
      const base = container.getBoundingClientRect()
      const next = new Map<string, Box>()
      for (const item of items) {
        if (item.hidden) continue
        const rect = item.getBoundingClientRect()
        next.set(item.dataset.flipId!, { x: rect.left - base.left, y: rect.top - base.top, w: rect.width, h: rect.height })
      }
      return next
    }

    const before = boxes.current
    const after = measure()
    boxes.current = after
    if (before.size === 0 || typeof container.animate !== "function") return

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    const columns = getComputedStyle(container).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length
    const move = !reduced && columns > 1

    for (const item of items) {
      const id = item.dataset.flipId!
      const was = before.get(id)
      const now = after.get(id)
      if (was && now) {
        const dx = was.x - now.x
        const dy = was.y - now.y
        if (move && (dx || dy)) {
          item.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration, easing })
        }
      } else if (now) {
        item.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing, delay: move ? duration / 4 : 0, fill: "backwards" })
      } else if (was) {
        item.dataset.flipLeaving = "true"
        item.setAttribute("aria-hidden", "true")
        Object.assign(item.style, {
          display: "block",
          position: "absolute",
          left: `${was.x}px`,
          top: `${was.y}px`,
          width: `${was.w}px`,
          height: `${was.h}px`,
          pointerEvents: "none",
        })
        const fade = item.animate([{ opacity: 1 }, { opacity: 0 }], { duration: duration * 0.7, easing, fill: "forwards" })
        fade.onfinish = () => settle(item)
      }
    }
  }, [containerRef, key, duration, easing])

  // A resize re-flows the grid on its own; keep the remembered boxes true to it.
  React.useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => {
      const base = container.getBoundingClientRect()
      const next = new Map<string, Box>()
      container.querySelectorAll<HTMLElement>(":scope > [data-flip-id]").forEach((item) => {
        if (item.hidden || item.dataset.flipLeaving) return
        const rect = item.getBoundingClientRect()
        next.set(item.dataset.flipId!, { x: rect.left - base.left, y: rect.top - base.top, w: rect.width, h: rect.height })
      })
      boxes.current = next
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef])
}

/*
 * Figma: Team (46368:243916), Type=Department Tabs Directory (Desktop LTR 41435:1086).
 *
 * A header (eyebrow, heading, intro), a row of tabs built with the Tabs atom in
 * its Bordered style, and a grid of eight member cards: a portrait, the name and
 * role, and a Solid Secondary badge naming the discipline. Four columns on
 * Desktop (two rows of four), two on Tablet, one on Mobile. Choosing a tab
 * filters the cards; All shows every one.
 *
 * Motion (the approved card): the active underline slides between the labels
 * in 220ms, and the grid cross-fades and re-flows with a FLIP (`useFlip`), so
 * cards that stay move instead of popping. On Mobile (one column) and with
 * reduced motion it is a plain cross-fade and the underline jumps. The atom
 * draws its own underline under the active tab; here that one is held at the
 * border colour and a single sliding bar in `primary` takes its place.
 *
 * Mobile first, by the block's own width: base = Figma Mobile (360),
 * `[@container(min-width:40rem)]:` = Tablet, `[@container(min-width:64rem)]:` = Desktop.
 */

export interface TeamDepartmentMember extends TeamPerson {
  /** Which tab shows this person: the `id` of one of the tabs. */
  department: string
  /** The words in the badge. Often the department's own label, but not always. */
  discipline: React.ReactNode
}

export interface TeamDepartmentTab {
  /** The tab's value, also what `department` on a member refers to. "all" is the tab that shows everyone. */
  id: string
  label: React.ReactNode
}

export interface TeamDepartmentTabsDirectoryCopy {
  /** The small label above the heading. Hidden when empty. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. Hidden when empty. */
  description: React.ReactNode
  /** The tabs, in order. The one with the id `all` shows everyone. */
  tabs: TeamDepartmentTab[]
  /** The cards, in reading order. Figma shows eight. */
  members: TeamDepartmentMember[]
  /** The accessible name of the group of tabs. */
  tabsLabel: string
}

/** Figma's copy. Nadia Rahman and Amira Sultan have no shippable photo, so Hana Kobayashi and Marcus Boateng stand in. */
const COPY: Record<"en" | "ar", TeamDepartmentTabsDirectoryCopy> = {
  en: {
    eyebrow: "BY DISCIPLINE",
    heading: "Find the person you need",
    description: "Filter the team by the discipline that owns the problem you are solving.",
    tabsLabel: "Disciplines",
    tabs: [
      { id: "all", label: "All" },
      { id: "design", label: "Design" },
      { id: "engineering", label: "Engineering" },
      { id: "product", label: "Product" },
      { id: "people", label: "People" },
    ],
    members: [
      { name: "Hana Kobayashi", role: "Motion Designer", department: "design", discipline: "Design" },
      { name: "Lukas Berg", role: "Design Systems Lead", department: "design", discipline: "Design" },
      { name: "Tomas Vidal", role: "VP of Engineering", department: "engineering", discipline: "Engineering" },
      { name: "Grace Okafor", role: "Principal Engineer", department: "engineering", discipline: "Engineering" },
      { name: "Omar Nasser", role: "Head of Product", department: "product", discipline: "Product" },
      { name: "Yara Khalil", role: "Product Manager", department: "product", discipline: "Product" },
      { name: "Marcus Boateng", role: "Head of Marketing", department: "people", discipline: "People" },
      { name: "Mei Tanaka", role: "Customer Success Lead", department: "people", discipline: "Success" },
    ],
  },
  ar: {
    eyebrow: "حسب التخصص",
    heading: "اعرف الشخص المناسب",
    description: "صفِّ الفريق حسب التخصص المسؤول عن المشكلة التي تعمل عليها.",
    tabsLabel: "التخصصات",
    tabs: [
      { id: "all", label: "الكل" },
      { id: "design", label: "التصميم" },
      { id: "engineering", label: "الهندسة" },
      { id: "product", label: "المنتج" },
      { id: "people", label: "الموارد البشرية" },
    ],
    members: [
      { name: "هانا كوباياشي", role: "مصمِّمة حركة", department: "design", discipline: "التصميم" },
      { name: "لوكاس بيرغ", role: "قائد أنظمة التصميم", department: "design", discipline: "التصميم" },
      { name: "توماس فيدال", role: "نائب رئيس الهندسة", department: "engineering", discipline: "الهندسة" },
      { name: "غرايس أوكافور", role: "مهندسة رئيسية", department: "engineering", discipline: "الهندسة" },
      { name: "عمر ناصر", role: "رئيس المنتج", department: "product", discipline: "المنتج" },
      { name: "يارا خليل", role: "مديرة المنتج", department: "product", discipline: "المنتج" },
      { name: "ماركوس بواتينغ", role: "رئيس التسويق", department: "people", discipline: "الموارد البشرية" },
      { name: "ماي تاناكا", role: "قائدة نجاح العملاء", department: "people", discipline: "نجاح العملاء" },
    ],
  },
}

export interface TeamDepartmentTabsDirectoryProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "defaultValue">,
    Partial<TeamDepartmentTabsDirectoryCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /** The tab shown, to control the filter. */
  value?: string
  /**
   * The tab shown first.
   * @default "all"
   */
  defaultValue?: string
  /** Called with the tab's id when the filter changes. */
  onValueChange?: (value: string) => void
}

export function TeamDepartmentTabsDirectory({
  locale = "en",
  eyebrow,
  heading,
  description,
  tabs,
  members,
  tabsLabel,
  value: valueProp,
  defaultValue = "all",
  onValueChange,
  className,
  ...props
}: TeamDepartmentTabsDirectoryProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const baseId = React.useId()
  const tabList = tabs ?? copy.tabs
  const people = members ?? copy.members
  const [state, setState] = React.useState(defaultValue)
  const value = valueProp ?? state
  const gridRef = React.useRef<HTMLUListElement>(null)

  const shown = people.map((person) => value === "all" || person.department === value)
  useFlip(gridRef, shown.map((on) => (on ? 1 : 0)).join(""))

  const change = (next: unknown) => {
    if (typeof next !== "string") return
    setState(next)
    onValueChange?.(next)
  }
  const tabId = (id: string) => `${baseId}-tab-${id}`

  return (
    <TeamSection labelledBy={headingId} className={className} {...props}>
      <TeamHeader
        headingId={headingId}
        eyebrow={eyebrow === undefined ? copy.eyebrow : eyebrow}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
      />

      <Reveal index={3} className="w-full shadow-[inset_0_-1px_0_0_var(--border)]">
        <Tabs value={value} onValueChange={change} className="w-auto">
          <SlidingTabList label={tabsLabel ?? copy.tabsLabel} value={value} idFor={tabId}>
            {tabList.map((tab) => (
              <TabsTrigger
                key={tab.id}
                id={tabId(tab.id)}
                value={tab.id}
                // The atom underlines its active tab itself; hold that line at the border colour so the sliding bar is the only one.
                className="data-[active]:!shadow-[inset_0_-2px_0_0_var(--border)]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </SlidingTabList>
        </Tabs>
      </Reveal>

      {people.length > 0 ? (
        <div role="tabpanel" aria-labelledby={tabId(value)} className="w-full">
          <ul
            ref={gridRef}
            className="relative m-0 grid w-full list-none grid-cols-1 gap-6 p-0 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-4"
          >
            {people.map((person, index) => (
              <li key={index} data-flip-id={index} hidden={!shown[index]}>
                <Reveal
                  index={4 + index}
                  className="flex h-full flex-col gap-3 rounded-lg bg-muted p-4"
                >
                  <TeamPortrait person={person} className="h-[13.75rem] w-full rounded-md" />
                  <div className="flex flex-col">
                    <p className="text-base font-medium text-foreground">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.role}</p>
                  </div>
                  <div className="flex">
                    <Badge variant="solid" tone="secondary" size="sm" radius="rounded">
                      <span>{person.discipline}</span>
                    </Badge>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </TeamSection>
  )
}

/**
 * The atom's tab list with one `primary` bar under the active tab. The bar is
 * 1px wide and moved and stretched with a transform to the tab's measured
 * offset and width, so it slides between labels in 220ms. Offsets are physical
 * (`offsetLeft`), which is what a transform needs, so it runs right-to-left
 * in an RTL page by itself. Reduced motion jumps it.
 */
function SlidingTabList({
  label,
  value,
  idFor,
  children,
}: {
  label: string
  value: string
  idFor: (id: string) => string
  children: React.ReactNode
}) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const [bar, setBar] = React.useState<{ x: number; w: number } | null>(null)
  const [ready, setReady] = React.useState(false)

  const measure = React.useCallback(() => {
    const tab = listRef.current?.querySelector<HTMLElement>(`[id="${idFor(value)}"]`)
    if (tab) setBar({ x: tab.offsetLeft, w: tab.offsetWidth })
  }, [idFor, value])

  React.useLayoutEffect(measure, [measure])
  React.useEffect(() => {
    // The first placement is not animated: the bar starts under the first tab.
    setReady(true)
  }, [])
  React.useEffect(() => {
    const list = listRef.current
    if (!list || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure])

  return (
    <TabsList ref={listRef} variant="bordered" size="sm" aria-label={label}>
      {children}
      <span
        aria-hidden
        data-slot="tab-underline"
        style={{ left: 0, transform: bar ? `translateX(${bar.x}px) scaleX(${bar.w})` : undefined }}
        className={cn(
          "pointer-events-none absolute bottom-0 h-0.5 w-px origin-left bg-primary",
          bar ? "opacity-100" : "opacity-0",
          ready && "motion-safe:transition-transform motion-safe:duration-[220ms] motion-safe:ease-out"
        )}
      />
    </TabsList>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const teamDepartmentTabsDirectoryCopy = COPY
