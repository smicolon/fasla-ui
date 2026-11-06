"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"
import { MahaamAsk } from "./mahaam-ask"
import { MahaamBanner } from "./mahaam-banner"
import { MahaamFaq } from "./mahaam-faq"
import { MahaamFeatures } from "./mahaam-features"
import { MahaamFooter } from "./mahaam-footer"
import { MahaamHero } from "./mahaam-hero"
import { MahaamLogoMarquee } from "./mahaam-logo-marquee"
import { MahaamNavbar } from "./mahaam-navbar"
import { MahaamPlans } from "./mahaam-plans"
import { MahaamTestimonials } from "./mahaam-testimonials"

/*
 * Mahaam: a Fasla landing template for a fictional voice-first task assistant.
 *
 * Figma: `Mahaam Template` (47694:6712), six variants: Breakpoint (Desktop 1440,
 * Tablet 768, Mobile 360) × Direction (LTR, RTL). One build covers all six: each
 * section is sized by its own width, the page's `dir` mirrors it, and `locale`
 * picks English or Arabic copy.
 *
 * MOTION EXCEPTION (see `mahaam-motion.ts`): the Hero, the logo strip, the
 * Features cards, the Ask rows, the Banner rings and the Testimonials cards play
 * on their own and loop, which the repo's motion rules otherwise forbid. Each has
 * a pause control; under `prefers-reduced-motion: reduce` they show their
 * finished frame and the controls are not drawn. `reducedMotion` replaces that
 * setting, and `defaultPaused` starts every section on its still frame.
 *
 * The sections take their photographs as props, so the template ships none:
 * pass `photos`.
 */

type Locale = "en" | "ar"

export interface MahaamTemplatePhotos {
  /** The painting behind the Hero's planner. */
  sceneSrc?: string
  /** The three faces. */
  avatars?: { noura?: string; khalid?: string; faisal?: string }
  /** The flags on the Features card, by language key. */
  flags?: React.ComponentProps<typeof MahaamFeatures>["flags"]
  /** The three portraits on the Testimonials cards. */
  portraits?: { noura?: string; khalid?: string; faisal?: string }
}

export interface MahaamTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which language the copy is in. The page's `dir` sets the direction. */
  locale?: Locale
  /** The photographs, since the template ships none. */
  photos?: MahaamTemplatePhotos
  /** Starts every animated section paused, on Figma's still frame. */
  defaultPaused?: boolean
  /** Holds every animated section on Figma's still frame while the pause buttons keep showing Pause. For stills of the finished state. */
  still?: boolean
  /** Replaces the visitor's reduced-motion setting. For stories and tests. */
  reducedMotion?: boolean
}

export function MahaamTemplate({ locale = "en", photos = {}, defaultPaused, still, reducedMotion, className, ...props }: MahaamTemplateProps) {
  const motion = { defaultPaused, still, reducedMotion }
  return (
    <div className={cn("bg-background text-foreground", className)} {...props}>
      <MahaamNavbar locale={locale} />
      <main>
        <div id="top">
          <MahaamHero locale={locale} sceneSrc={photos.sceneSrc} avatars={photos.avatars} {...motion} />
        </div>
        <MahaamLogoMarquee locale={locale} {...motion} />
        <div id="product">
          <MahaamFeatures locale={locale} avatars={photos.avatars} flags={photos.flags} {...motion} />
        </div>
        <MahaamAsk locale={locale} {...motion} />
        <MahaamBanner locale={locale} {...motion} />
        <div id="teams">
          <MahaamTestimonials locale={locale} portraits={photos.portraits} {...motion} />
        </div>
        <div id="pricing">
          <MahaamPlans locale={locale} />
        </div>
        <MahaamFaq locale={locale} />
      </main>
      <div id="changelog">
        <MahaamFooter locale={locale} />
      </div>
    </div>
  )
}
