"use client"

import * as React from "react"
import { DownloadIcon, ExpandIcon, EyeIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button, buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Gallery` (42478:479), Type=Photo Spotlight.
 *
 * One photo given the stage: a large 4:3 print with a full-size button in
 * its top end corner, and beside it a panel with an eyebrow, the photo's
 * title and a short story, a table of its details between hairlines
 * (location, date, camera, exposure, series), and two actions: open the
 * series and download the photo. From Tablet down the panel moves under the
 * photo, and on a phone the two actions stack at full width.
 *
 * On Desktop the photo and the panel share the width in a fluid grid: the
 * panel takes 20 to 24rem (Figma's 384px at 1440) and the photo the rest,
 * always 4:3, so it never widens over the text. The panel's three parts
 * spread over the photo's height, the actions at its foot. Below Desktop
 * width, where both no longer fit side by side, the panel stacks under the
 * photo.
 *
 * No photo comes with the block: pass `photo`, and until then the print is a
 * `muted` box with the `empty` line in its centre, and the full-size and
 * download controls are hidden, as there is nothing to open. The full-size
 * button links to the photo itself; give `onExpand` to open your own
 * viewer instead. Download links to `downloadAction.href`, or to the photo.
 *
 * In Arabic the photo moves to the left and the panel to the right, and each
 * detail row mirrors, its label on the right and the value on the left.
 * Numbers and Latin runs (B, 35, 1/250 s, ISO 200) sit in `<bdi>`, and a
 * value made of parts (exposure, series) is separate parts with the middle
 * dot between them, so they read from the right in Arabic. The photograph is
 * never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GalleryPhotoSpotlightPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GalleryPhotoSpotlightDetail {
  /** The row's label, at the start ("Location"). */
  label: React.ReactNode
  /** The row's value, at the end. An array is shown as parts joined by middle dots. */
  value: React.ReactNode | React.ReactNode[]
}

export interface GalleryPhotoSpotlightAction {
  label: React.ReactNode
  href: string
}

export interface GalleryPhotoSpotlightCopy {
  /** The short label above the heading. */
  eyebrow: React.ReactNode
  /** The photo's title, the section's `h2`. */
  heading: React.ReactNode
  /** The short story under the heading. */
  description: React.ReactNode
  /** The details table, in order. Each row has a `label` and a `value`. */
  details: GalleryPhotoSpotlightDetail[]
  /** The solid button: open the series the photo belongs to. */
  primaryAction: GalleryPhotoSpotlightAction
  /**
   * The outline download button. Without an `href` it downloads the photo
   * itself. Hidden when null, or when there is nothing to download.
   */
  downloadAction: { label: React.ReactNode; href?: string } | null
  /** The full-size button's accessible name. */
  expandLabel: string
  /** Shown in the photo's place while there is no photo. */
  empty: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", GalleryPhotoSpotlightCopy> = {
  en: {
    eyebrow: "PHOTO OF THE MONTH",
    heading: "Riverside offices, first light",
    description:
      "Taken the morning after the move, before a single desk had been claimed. The glass, the concrete and one very long table.",
    details: [
      { label: "Location", value: "Riverside, Building B" },
      { label: "Date", value: "12 July 2026" },
      { label: "Camera", value: "Full-frame, 35 mm" },
      { label: "Exposure", value: ["1/250 s", "f/4", "ISO 200"] },
      { label: "Series", value: ["New offices", "64 photos"] },
    ],
    primaryAction: { label: "Open series", href: "#series" },
    downloadAction: { label: "Download" },
    expandLabel: "View full size",
    empty: "No photo yet.",
  },
  ar: {
    eyebrow: "صورة الشهر",
    heading: "مكاتب ريفرسايد، أول الضوء",
    description: "صُوّرت صباح اليوم التالي للانتقال، قبل أن يُحجز أي مكتب. الزجاج والخرسانة وطاولة واحدة طويلة.",
    details: [
      {
        label: "الموقع",
        value: (
          <>
            ريفرسايد، مبنى <bdi dir="ltr">B</bdi>
          </>
        ),
      },
      {
        label: "التاريخ",
        value: (
          <>
            <bdi dir="ltr">12</bdi> يوليو <bdi dir="ltr">2026</bdi>
          </>
        ),
      },
      {
        label: "الكاميرا",
        value: (
          <>
            إطار كامل، <bdi dir="ltr">35</bdi> مم
          </>
        ),
      },
      {
        label: "التعريض",
        value: [
          <bdi key="shutter" dir="ltr">1/250 s</bdi>,
          <bdi key="aperture" dir="ltr">f/4</bdi>,
          <bdi key="iso" dir="ltr">ISO 200</bdi>,
        ],
      },
      {
        label: "السلسلة",
        value: [
          "المكاتب الجديدة",
          <React.Fragment key="count">
            <bdi dir="ltr">64</bdi> صورة
          </React.Fragment>,
        ],
      },
    ],
    primaryAction: { label: "افتح السلسلة", href: "#series" },
    downloadAction: { label: "تنزيل" },
    expandLabel: "عرض بالحجم الكامل",
    empty: "لا توجد صورة بعد.",
  },
}

const ICON = { size: 16, strokeWidth: 1.5, absoluteStrokeWidth: true, "aria-hidden": true } as const

export interface GalleryPhotoSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GalleryPhotoSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The spotlit photo, the block's one slot. None by default: a `muted` box
   * with the `empty` line.
   * @default none: `muted` placeholder
   */
  photo?: GalleryPhotoSpotlightPhoto
  /**
   * Called by the full-size button, which is then a button rather than a
   * link to the photo. Use it to open your own viewer.
   */
  onExpand?: () => void
}

export function GalleryPhotoSpotlight({
  locale = "en",
  eyebrow,
  heading,
  description,
  details,
  primaryAction,
  downloadAction,
  expandLabel,
  empty,
  photo,
  onExpand,
  className,
  ...props
}: GalleryPhotoSpotlightProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const rows = details ?? copy.details
  const primary = primaryAction ?? copy.primaryAction
  const download = downloadAction === undefined ? copy.downloadAction : downloadAction
  const downloadHref = download ? (download.href ?? photo?.src) : undefined
  const expand = expandLabel ?? copy.expandLabel
  // Figma's Icon Button: Solid, Secondary, sm, Rounded, 16px in from the corner.
  const expandClass = "absolute end-4 top-4"

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto grid w-full max-w-[1248px] gap-6 [@container(min-width:40rem)]:gap-8 [@container(min-width:64rem)]:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] [@container(min-width:64rem)]:gap-12">
        <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-lg bg-muted [@container(min-width:40rem)]:h-[420px] [@container(min-width:64rem)]:aspect-[4/3] [@container(min-width:64rem)]:h-auto [@container(min-width:64rem)]:self-start">
          {photo ? (
            <>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              {onExpand ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  radius="rounded"
                  aria-label={expand}
                  onClick={onExpand}
                  className={expandClass}
                >
                  <ExpandIcon {...ICON} />
                </Button>
              ) : (
                <a
                  href={photo.src}
                  aria-label={expand}
                  className={buttonVariants({ variant: "secondary", size: "icon-sm", radius: "rounded", className: expandClass })}
                >
                  <ExpandIcon {...ICON} />
                </a>
              )}
            </>
          ) : (
            <p className="px-4 text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
          )}
        </div>

        <div className="flex flex-col gap-6 [@container(min-width:64rem)]:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-primary">{eyebrow ?? copy.eyebrow}</p>
            <h2 id={headingId} className="text-2xl font-semibold text-foreground [@container(min-width:40rem)]:text-3xl">
              {heading ?? copy.heading}
            </h2>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>

          {rows.length > 0 ? (
            <dl className="border-t border-border">
              {rows.map((row, index) => (
                <div key={index} className="flex items-baseline gap-4 border-b border-border py-3 text-sm">
                  <dt className="w-24 shrink-0 text-muted-foreground [@container(min-width:40rem)]:w-[120px]">{row.label}</dt>
                  <dd className="min-w-0 flex-1 text-end font-medium text-foreground">
                    {Array.isArray(row.value)
                      ? row.value.map((part, i) => (
                          <React.Fragment key={i}>
                            {i > 0 ? (
                              <span aria-hidden="true" className="mx-1">
                                ·
                              </span>
                            ) : null}
                            <span className="whitespace-nowrap">{part}</span>
                          </React.Fragment>
                        ))
                      : row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="flex flex-col gap-3 [@container(min-width:40rem)]:flex-row">
            <a href={primary.href} className={buttonVariants({ className: "w-full [@container(min-width:40rem)]:w-auto" })}>
              <EyeIcon {...ICON} />
              {primary.label}
            </a>
            {download && downloadHref ? (
              <a
                href={downloadHref}
                download
                className={buttonVariants({ variant: "outline", className: "w-full [@container(min-width:40rem)]:w-auto" })}
              >
                <DownloadIcon {...ICON} />
                {download.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const galleryPhotoSpotlightCopy = COPY
