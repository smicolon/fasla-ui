"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { Badge } from "../../ui/badge/badge"
import { buttonVariants } from "../../ui/button/button"

/*
 * Figma: `Error State` (42556:548), Type=Full-Bleed Photo.
 *
 * A photograph across the whole block under a scrim, with a centred message
 * on top. The scrim is `background-inverse` at 62%, as in Figma, so the
 * message is painted with the inverse tokens: dark scrim and light text in
 * light mode, the other way round in dark mode. No photo comes with the
 * block: pass `image`, and until then the stage is a `muted` placeholder
 * under the same scrim.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). The message is centred, so only the
 * text direction changes in Arabic; the photo is never mirrored.
 */

export interface ErrorStateFullBleedPhotoAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateFullBleedPhotoImage {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface ErrorStateFullBleedPhotoCopy {
  /** The status badge above the heading. Hidden when empty. */
  badge: React.ReactNode
  /** The page's heading, an `h1`. Name what happened. */
  heading: React.ReactNode
  /** The text under the heading: what to do next. */
  description: React.ReactNode
  /** The button: the way out, usually home. Hidden when null. */
  action: ErrorStateFullBleedPhotoAction | null
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateFullBleedPhotoCopy> = {
  en: {
    badge: "404 — PAGE NOT FOUND",
    heading: "You have wandered off the path",
    description: "The page you asked for is not here. Head back to solid ground, or search for what you needed.",
    action: { label: "Back to home", href: "/" },
  },
  ar: {
    badge: (
      <>
        خطأ <bdi dir="ltr">404</bdi>: الصفحة غير موجودة
      </>
    ),
    heading: "لقد ابتعدت عن المسار",
    description: "الصفحة التي طلبتها ليست هنا. عد إلى أرض صلبة، أو ابحث عمّا تحتاجه.",
    action: { label: "العودة إلى الرئيسية", href: "/" },
  },
}

export interface ErrorStateFullBleedPhotoProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateFullBleedPhotoCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photo behind the message. None by default: the stage shows a `muted`
   * placeholder.
   * @default none: a `muted` placeholder
   */
  image?: ErrorStateFullBleedPhotoImage
}

export function ErrorStateFullBleedPhoto({
  locale = "en",
  badge,
  heading,
  description,
  action,
  image,
  className,
  ...props
}: ErrorStateFullBleedPhotoProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const status = badge ?? copy.badge
  const cta = action === undefined ? copy.action : action

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative isolate flex min-h-[440px] overflow-hidden bg-muted md:min-h-[520px] lg:min-h-[640px]", className)}
      {...props}
    >
      {image ? (
        <img src={image.src} alt={image.alt} decoding="async" className="absolute inset-0 -z-10 size-full object-cover" />
      ) : null}
      <div className="flex w-full flex-col items-center justify-center bg-background-inverse/[0.62] p-6 md:p-16 lg:p-24">
        <div className="flex w-full max-w-[784px] flex-col items-center gap-4 text-center">
          {status ? (
            <Badge variant="solid" tone="destructive" size="sm" radius="standard">
              {status}
            </Badge>
          ) : null}
          <h1 id={headingId} className="text-3xl font-semibold text-foreground-inverse lg:text-5xl">
            {heading ?? copy.heading}
          </h1>
          <p className="text-base text-muted-foreground-inverse">{description ?? copy.description}</p>
          {cta ? (
            <div className="flex w-full flex-col md:w-auto md:flex-row">
              <a href={cta.href} className={buttonVariants({ variant: "secondary" })}>
                {cta.label}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateFullBleedPhotoCopy = COPY
