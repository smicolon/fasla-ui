"use client"

import * as React from "react"
import { ExternalLink } from "lucide-react"
import { buttonVariants } from "../../ui/button/button"
import {
  ContactUsHeader,
  ContactUsSection,
  formatClock,
  openState,
  prefersReducedMotion,
  splitCopy,
  useLiveNow,
  useReveal,
  type ContactUsLocale,
  type ContactUsWeek,
} from "../contact-us/contact-us"

/*
 * Figma: `Contact Us` (42334:293941), Type=Global Offices Table.
 *
 * A header (the eyebrow, the heading, a line, and an Outline Secondary
 * "Download press kit" button at its end), then one bordered, 14px-cornered
 * table of the five offices: Office, Region, Phone, Local time, Hours. Rows
 * are 52px, the header row sits on `muted`, a hairline runs under every row,
 * and the cells are 14px: `foreground` in the header, `muted-foreground`
 * below.
 *
 * Desktop (1248px column): all five columns, equal. Tablet: the Region
 * column is dropped, and the rest share the width. Mobile: the table becomes a
 * stack of cards: the name, with the open dot, on top, then Phone, Local time
 * and Hours as label and value. It stays one real `<table>` throughout (the
 * `thead`, `th scope="col"`, `th scope="row"` for the name), and the header
 * row, stays in the reading order for assistive technology while it is hidden
 * (Region is not drawn, nor read, below Desktop). The section pads 96px on Desktop, 64 x 24
 * on Tablet and 32 x 16 on Mobile.
 *
 * STAND-IN. Figma's Table Cell (39961:4559) has no code atom: each cell is a
 * plain `th` or `td` styled like it (16px inline padding, a bottom hairline
 * in `border`, the Header label on `muted`), here, in one place.
 *
 * Real: the Local time cells are live. Each is the time at the office's own
 * `timeZone` ("14:20 GST"), 24-hour, in Western digits in any language,
 * ticking on the minute and paused while the tab is hidden. Give `now` and it
 * is frozen there. Before the first tick the cells read "--:--". An office
 * that is open at that moment (its own `week` and `timeZone`) carries a small
 * success dot beside its name. Static: the offices, the phone numbers, the
 * press kit link (`pressKitHref`).
 *
 * Motion: once, in view, the header rises and the table fades in. Rows wash
 * to `muted` on hover over 120ms. When a minute turns, the local times
 * crossfade over 150ms and the open dots fade between states over 260ms. The
 * motion card's "Copy address" affordance is not built (decided). Reduced
 * motion: the entrance only fades, the digits and dots swap with no fade, and
 * hover changes only the background.
 *
 * Content limits: the heading up to 40 characters, the line up to 90, an
 * office name up to 24, a region up to 22.
 */

/** One office: its row, and the hours that say whether it is open. */
export interface ContactUsOffice {
  /** The office, as the first column says it. */
  name: string
  /** The region, the second column. */
  region: string
  /** The phone number, in the form it is dialled. */
  phone: string
  /** The IANA time zone its Local time and its hours are in. */
  timeZone: string
  /** The short zone label after the time: GST, AST, BST. */
  zoneLabel: string
  /** The zone's full name, shown on hover. */
  zoneName?: string
  /** Its opening hours, Sunday first. The Hours column shows the first open day's. */
  week: ContactUsWeek
}

export interface ContactUsGlobalOfficesTableCopy {
  /** The small line above the heading. */
  eyebrow: string
  /** The heading, an `h2`. */
  heading: string
  /** The line under the heading. */
  description: React.ReactNode
  /** The press kit button's label. */
  pressKit: string
  /** The four table headers. */
  officeHeader: string
  regionHeader: string
  phoneHeader: string
  timeHeader: string
  hoursHeader: string
  /** Names the table for assistive technology. */
  tableLabel: string
  /** Read after the name of an office that is open. */
  openNow: string
  /** The offices, one row each. */
  offices: ContactUsOffice[]
}

const SUN_THU = [{ open: "09:00", close: "18:00" }, { open: "09:00", close: "18:00" }, { open: "09:00", close: "18:00" }, { open: "09:00", close: "18:00" }, { open: "09:00", close: "18:00" }, null, null] as const
const SUN_THU_17 = [{ open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, null, null] as const
const MON_FRI_17 = [null, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, { open: "09:00", close: "17:00" }, null] as const

const week = (days: readonly (null | { open: string; close: string })[]) => days as unknown as ContactUsWeek

const COPY: Record<ContactUsLocale, ContactUsGlobalOfficesTableCopy> = {
  en: {
    eyebrow: "WHERE WE ARE",
    heading: "Five offices, one shared inbox",
    description: (
      <>
        Write to the nearest team, or to <bdi dir="ltr">hello@fasla.com</bdi> and we will route it for you.
      </>
    ),
    pressKit: "Download press kit",
    officeHeader: "Office",
    regionHeader: "Region",
    phoneHeader: "Phone",
    timeHeader: "Local time",
    hoursHeader: "Hours",
    tableLabel: "Fasla offices",
    openNow: "Open now",
    offices: [
      { name: "Dubai — HQ", region: "Middle East", phone: "+971 4 512 8800", timeZone: "Asia/Dubai", zoneLabel: "GST", zoneName: "Gulf Standard Time", week: week(SUN_THU) },
      { name: "Riyadh", region: "Middle East", phone: "+966 11 288 4100", timeZone: "Asia/Riyadh", zoneLabel: "AST", zoneName: "Arabia Standard Time", week: week(SUN_THU_17) },
      { name: "Amman", region: "Levant", phone: "+962 6 592 7700", timeZone: "Asia/Amman", zoneLabel: "EEST", zoneName: "Eastern European Summer Time", week: week(SUN_THU) },
      { name: "London", region: "Europe", phone: "+44 20 7946 0210", timeZone: "Europe/London", zoneLabel: "BST", zoneName: "British Summer Time", week: week(MON_FRI_17) },
      { name: "Singapore", region: "APAC", phone: "+65 6812 4400", timeZone: "Asia/Singapore", zoneLabel: "SGT", zoneName: "Singapore Standard Time", week: week(MON_FRI_17) },
    ],
  },
  ar: {
    eyebrow: "أين نحن",
    heading: "خمسة مكاتب، وبريد واحد مشترك",
    description: (
      <>
        راسل أقرب فريق، أو <bdi dir="ltr">hello@fasla.com</bdi> وسنوجّه رسالتك.
      </>
    ),
    pressKit: "نزّل الحزمة الصحفية",
    officeHeader: "المكتب",
    regionHeader: "المنطقة",
    phoneHeader: "الهاتف",
    timeHeader: "التوقيت المحلي",
    hoursHeader: "ساعات العمل",
    tableLabel: "مكاتب فاصلة",
    openNow: "مفتوح الآن",
    offices: [
      { name: "دبي، المقر الرئيسي", region: "الشرق الأوسط", phone: "+971 4 512 8800", timeZone: "Asia/Dubai", zoneLabel: "GST", zoneName: "توقيت الخليج", week: week(SUN_THU) },
      { name: "الرياض", region: "الشرق الأوسط", phone: "+966 11 288 4100", timeZone: "Asia/Riyadh", zoneLabel: "AST", zoneName: "توقيت السعودية", week: week(SUN_THU_17) },
      { name: "عمّان", region: "بلاد الشام", phone: "+962 6 592 7700", timeZone: "Asia/Amman", zoneLabel: "EEST", zoneName: "توقيت عمّان", week: week(SUN_THU) },
      { name: "لندن", region: "أوروبا", phone: "+44 20 7946 0210", timeZone: "Europe/London", zoneLabel: "BST", zoneName: "توقيت لندن", week: week(MON_FRI_17) },
      { name: "سنغافورة", region: "آسيا والمحيط الهادئ", phone: "+65 6812 4400", timeZone: "Asia/Singapore", zoneLabel: "SGT", zoneName: "توقيت سنغافورة", week: week(MON_FRI_17) },
    ],
  },
}

export interface ContactUsGlobalOfficesTableProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<ContactUsGlobalOfficesTableCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: ContactUsLocale
  /** Freezes the Local time cells at this moment. Without it they show the real time. */
  now?: Date | number | string
  /** Where the press kit button goes. */
  pressKitHref?: string
}

/** The first open day's hours, as the Hours column says them: "09:00 – 18:00". */
function hoursOf(office: ContactUsOffice) {
  const first = office.week.find((day) => day !== null)
  return first ? `${first.open} – ${first.close}` : "--"
}

/** A value that crossfades over 150ms when it changes, and swaps with no motion when the reader asks for less. */
function Crossfade({ children }: { children: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const previous = React.useRef(children)
  React.useEffect(() => {
    if (previous.current === children) return
    previous.current = children
    const node = ref.current
    if (!node || typeof node.animate !== "function" || prefersReducedMotion()) return
    node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "cubic-bezier(0.2, 0, 0, 1)" })
  }, [children])
  return <span ref={ref}>{children}</span>
}

// The Table Cell stand-in, as literal class strings (Tailwind reads them as written).
// Header cell: 52px, 16px inline padding, `muted`, 14px medium `foreground`.
const TH =
  "h-[52px] border-b border-border bg-muted px-4 py-0 text-start align-middle text-sm font-medium leading-5 text-foreground rtl:leading-6"
// Data cell: a label and value row inside a card below Tablet, a table cell from Tablet.
const TD =
  "flex h-auto items-center justify-between p-0 text-sm font-normal leading-5 text-muted-foreground before:content-[attr(data-label)] rtl:leading-6 [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:h-[52px] [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:text-start [@container(min-width:40rem)]:align-middle [@container(min-width:40rem)]:before:content-none"
const VALUE = "text-foreground [@container(min-width:40rem)]:text-muted-foreground"

export function ContactUsGlobalOfficesTable({ locale = "en", now, pressKitHref = "#", ...given }: ContactUsGlobalOfficesTableProps) {
  const { copy, rest } = splitCopy(COPY[locale], given)
  const { className, ...html } = rest
  const headingId = React.useId()
  const reveal = useReveal<HTMLDivElement>()
  const live = useLiveNow(now)

  return (
    <ContactUsSection labelledBy={headingId} gap="none" className={className} {...html}>
      <div ref={reveal} className="flex flex-col gap-12">
        <div className="flex flex-col gap-8 [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-end [@container(min-width:40rem)]:justify-between">
          <ContactUsHeader
            headingId={headingId}
            eyebrow={copy.eyebrow}
            heading={copy.heading}
            description={copy.description}
            reveal
            className="min-w-0 flex-1"
            eyebrowClassName="leading-5 rtl:leading-6"
            headingClassName="text-2xl leading-8 rtl:leading-10 [@container(min-width:40rem)]:text-3xl [@container(min-width:40rem)]:leading-[2.75rem] [@container(min-width:40rem)]:rtl:leading-[3.75rem] [@container(min-width:64rem)]:text-4xl"
            descriptionClassName="leading-6 rtl:leading-7"
          />
          <a href={pressKitHref} data-reveal="fade" className={buttonVariants({ variant: "outline", tone: "secondary", size: "md", className: "w-full shrink-0 [@container(min-width:40rem)]:w-auto" })}>
            {copy.pressKit}
            <ExternalLink aria-hidden strokeWidth={1.5} />
          </a>
        </div>

        <div data-reveal="fade" className="min-w-0 [@container(min-width:40rem)]:overflow-hidden [@container(min-width:40rem)]:rounded-[14px] [@container(min-width:40rem)]:border [@container(min-width:40rem)]:border-border">
          <table aria-label={copy.tableLabel} className="block w-full border-collapse [@container(min-width:40rem)]:table [@container(min-width:40rem)]:table-fixed">
            <thead className="sr-only [@container(min-width:40rem)]:not-sr-only [@container(min-width:40rem)]:table-header-group">
              <tr>
                <th scope="col" className={TH}>
                  {copy.officeHeader}
                </th>
                <th scope="col" className={`${TH} hidden [@container(min-width:64rem)]:table-cell`}>
                  {copy.regionHeader}
                </th>
                <th scope="col" className={TH}>
                  {copy.phoneHeader}
                </th>
                <th scope="col" className={TH}>
                  {copy.timeHeader}
                </th>
                <th scope="col" className={TH}>
                  {copy.hoursHeader}
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col gap-3 [@container(min-width:40rem)]:table-row-group [@container(min-width:40rem)]:[&>tr:last-child>*]:border-b-0">
              {copy.offices.map((office) => {
                const open = live ? openState(office.week, office.timeZone, live).open : false
                const time = live ? `${formatClock(live, office.timeZone)} ${office.zoneLabel}` : "--:--"
                return (
                  <tr
                    key={office.name}
                    className="relative flex flex-col gap-3 rounded-[10px] border border-border bg-card p-4 motion-safe:transition-colors motion-safe:duration-[120ms] hover:bg-muted [@container(min-width:40rem)]:table-row [@container(min-width:40rem)]:rounded-none [@container(min-width:40rem)]:border-0 [@container(min-width:40rem)]:bg-transparent [@container(min-width:40rem)]:p-0 hover:[@container(min-width:40rem)]:bg-muted"
                  >
                    <th
                      scope="row"
                      className="p-0 text-start text-sm font-medium leading-5 text-foreground rtl:leading-6 [@container(min-width:40rem)]:h-[52px] [@container(min-width:40rem)]:border-b [@container(min-width:40rem)]:border-border [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:align-middle [@container(min-width:40rem)]:font-normal [@container(min-width:40rem)]:text-muted-foreground"
                    >
                      <span className="inline-flex items-center gap-2 align-middle">
                        {office.name}
                        <span
                          aria-hidden
                          className={`size-2 shrink-0 rounded-full bg-success motion-safe:transition-opacity motion-safe:duration-[260ms] ${open ? "opacity-100" : "opacity-0"}`}
                        />
                        {open ? <span className="sr-only">{copy.openNow}</span> : null}
                      </span>
                    </th>
                    <td className="hidden [@container(min-width:64rem)]:table-cell [@container(min-width:64rem)]:h-[52px] [@container(min-width:64rem)]:border-b [@container(min-width:64rem)]:border-border [@container(min-width:64rem)]:px-4 [@container(min-width:64rem)]:text-start [@container(min-width:64rem)]:align-middle [@container(min-width:64rem)]:text-sm [@container(min-width:64rem)]:leading-5 [@container(min-width:64rem)]:text-muted-foreground [@container(min-width:64rem)]:rtl:leading-6">
                      {office.region}
                    </td>
                    <td data-label={copy.phoneHeader} className={TD}>
                      <bdi dir="ltr" className={VALUE}>
                        {office.phone}
                      </bdi>
                    </td>
                    <td data-label={copy.timeHeader} className={TD}>
                      <bdi dir="ltr" title={office.zoneName} className={VALUE}>
                        <Crossfade>{time}</Crossfade>
                      </bdi>
                    </td>
                    <td data-label={copy.hoursHeader} className={TD}>
                      <bdi dir="ltr" className={VALUE}>
                        {hoursOf(office)}
                      </bdi>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ContactUsSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const contactUsGlobalOfficesTableCopy = COPY
