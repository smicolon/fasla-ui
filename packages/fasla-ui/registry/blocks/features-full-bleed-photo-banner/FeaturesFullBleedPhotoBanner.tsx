"use client"

import * as React from "react"
import { Bell, Clock, Eye } from "lucide-react"
import { FeaturesHeader, FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Full-Bleed Photo Banner.
 *
 * A photo that runs the full width of the section, 460px tall on Desktop, then
 * a body under it: a centred header (an eyebrow, the heading and a line
 * under it, 760px wide) over three features. A feature is a 22px Lucide
 * mark, a 16px title and a 14px line.
 *
 * Desktop sets the three features across. Tablet sets them two across, the
 * photo 320px tall. Mobile stacks them, the photo 240px tall. Without a
 * photo the banner stays as a `muted` placeholder.
 *
 * Content limits: a feature's title up to 36 characters and its line up to
 * 70. The other limits are in the block's documentation page.
 */

export interface FeaturesFullBleedFeature {
  /** Keys the feature. */
  id: string
  /** The feature's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark above it. */
  icon?: React.ElementType
}

export interface FeaturesFullBleedPhotoBannerCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The features, in order. */
  features: FeaturesFullBleedFeature[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesFullBleedPhotoBannerCopy> = {
  en: {
    eyebrow: "DESIGNED FOR FOCUS",
    heading: "A workspace that stays calm, however much arrives",
    description: "We turned down the visual noise — colour, motion, density — so what's left is what deserves your attention.",
    features: [
      { id: "numbers", icon: Eye, title: "No red numbers chasing you", description: "Nothing demands a reply on a schedule you didn't choose." },
      { id: "summary", icon: Bell, title: "A daily summary, not a constant ping", description: "Find out what happened once, instead of forty times." },
      { id: "mute", icon: Clock, title: "Mute what doesn't concern you yet", description: "Silence an entire project until the review it's for." },
    ],
  },
  ar: {
    eyebrow: "مصمَّم للتركيز",
    heading: "مساحة تعمل بهدوء، مهما زاد العمل",
    description: "قلّلنا الضجيج البصري، ألوانًا وحركةً وازدحامًا، ليبقى أمامك ما يستحق انتباهك.",
    features: [
      { id: "numbers", icon: Eye, title: "لا أرقام حمراء تلاحقك", description: "لن يطالبك شيء بالرد في وقت لم تختره." },
      { id: "summary", icon: Bell, title: "ملخّص يومي بدل التنبيه المستمر", description: "تعرف ما حدث دفعة واحدة، لا على أربعين مرة." },
      { id: "mute", icon: Clock, title: "اكتم ما لا يعنيك الآن", description: "أوقف إشعارات مشروع كامل حتى موعد المراجعة." },
    ],
  },
}

export interface FeaturesFullBleedPhotoBannerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesFullBleedPhotoBannerCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The banner photo. A `muted` placeholder shows without it. */
  photo?: FeaturesPhoto
}

export function FeaturesFullBleedPhotoBanner({ locale = "en", eyebrow, heading, description, features, photo, className, ...props }: FeaturesFullBleedPhotoBannerProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = features ?? copy.features

  return (
    <FeaturesSection labelledBy={headingId} flush contentClassName="max-w-none gap-0" className={className} {...props}>
      <FeaturesPhotoSlot photo={photo} className="h-60 w-full [@container(min-width:48rem)]:h-80 [@container(min-width:72rem)]:h-[460px]" />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-8 pb-8 pt-6 [@container(min-width:48rem)]:px-16 [@container(min-width:48rem)]:pb-16 [@container(min-width:48rem)]:pt-10 [@container(min-width:72rem)]:px-24 [@container(min-width:72rem)]:pb-24 [@container(min-width:72rem)]:pt-16">
        <FeaturesHeader
          headingId={headingId}
          eyebrow={eyebrow ?? copy.eyebrow}
          heading={heading ?? copy.heading}
          description={description ?? copy.description}
          maxWidth={760}
          className="mx-auto items-center text-center"
        />
        {list.length > 0 ? (
          <ul role="list" className="mx-auto grid w-full max-w-[1248px] grid-cols-1 gap-12 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-3">
            {list.map((feature) => {
              const Icon = feature.icon
              return (
                <li key={feature.id} className="flex min-w-0 flex-col items-start gap-2">
                  {Icon ? <Icon size={22} strokeWidth={1.5} absoluteStrokeWidth aria-hidden className="text-foreground" /> : null}
                  <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresFullBleedPhotoBannerCopy = COPY
