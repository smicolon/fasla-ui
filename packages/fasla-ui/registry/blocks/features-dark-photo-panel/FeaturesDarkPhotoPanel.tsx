"use client"

import * as React from "react"
import { Globe, Key, ShieldCheck } from "lucide-react"
import { FeaturesHeader, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Dark Photo Panel.
 *
 * A rounded panel (14px) with a photo behind it, dimmed by a 72%
 * `background-inverse` scrim, so everything on it is painted with the inverse
 * tokens: the header (an eyebrow, the heading and a line under it, 640px
 * wide) over three features. A feature is a 40px `foreground-inverse` chip
 * holding an 18px Lucide mark, a 16px title and a 14px line.
 *
 * The panel pads 80px on Desktop, 48px on Tablet and 24px on Mobile. The
 * features sit three across on Desktop, two across on Tablet and stacked on
 * Mobile. Without a photo the panel is plain `background-inverse`.
 *
 * Content limits: a feature's title up to 28 characters and its line up to
 * 90. The other limits are in the block's documentation page.
 */

export interface FeaturesDarkPhotoPanelFeature {
  /** Keys the feature. */
  id: string
  /** The feature's title. */
  title: React.ReactNode
  /** One line on it. */
  description: React.ReactNode
  /** The Lucide mark in the chip. */
  icon?: React.ElementType
}

export interface FeaturesDarkPhotoPanelCopy {
  /** The 12px line above the heading. */
  eyebrow: React.ReactNode
  /** The panel's heading, an `h2`. */
  heading: React.ReactNode
  /** The line under the heading. */
  description: React.ReactNode
  /** The features, in order. */
  features: FeaturesDarkPhotoPanelFeature[]
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesDarkPhotoPanelCopy> = {
  en: {
    eyebrow: "ENTERPRISE READY",
    heading: "Scale without handing over control",
    description: "Residency, retention and access policy you configure once and enforce across every workspace in the organisation.",
    features: [
      { id: "audited", icon: ShieldCheck, title: "Audited, not asserted", description: "An independent firm checks our controls every year." },
      { id: "regional", icon: Globe, title: "Regional hosting", description: "Pin data to the EU, US or APAC and keep it there for the life of the contract." },
      { id: "keys", icon: Key, title: "Bring your own keys", description: "Rotate and revoke encryption keys from your own KMS at any time." },
    ],
  },
  ar: {
    eyebrow: "جاهز للمؤسسات",
    heading: "توسّع دون التنازل عن السيطرة",
    description: "سياسات الإقامة والاحتفاظ والوصول تضبطها مرة واحدة وتفرضها على كل مساحات العمل في المؤسسة.",
    features: [
      { id: "audited", icon: ShieldCheck, title: "تدقيق فعلي، لا مجرد ادّعاء", description: "جهة مستقلة تفحص ضوابطنا كل عام." },
      { id: "regional", icon: Globe, title: "استضافة إقليمية", description: "ثبّت بياناتك في الاتحاد الأوروبي أو الولايات المتحدة أو آسيا والمحيط الهادئ، وأبقِها هناك طوال مدة العقد." },
      { id: "keys", icon: Key, title: "استخدم مفاتيحك الخاصة", description: "دوّر مفاتيح التشفير وألغِها من نظام KMS الخاص بك في أي وقت." },
    ],
  },
}

export interface FeaturesDarkPhotoPanelProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesDarkPhotoPanelCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The photo behind the panel. The panel is plain `background-inverse` without it. */
  photo?: FeaturesPhoto
}

export function FeaturesDarkPhotoPanel({ locale = "en", eyebrow, heading, description, features, photo, className, ...props }: FeaturesDarkPhotoPanelProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = features ?? copy.features

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <div className="relative isolate flex flex-col gap-12 overflow-hidden rounded-2xl bg-background-inverse p-6 text-foreground-inverse [@container(min-width:48rem)]:p-12 [@container(min-width:72rem)]:p-20">
        {photo ? <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-20 size-full object-cover" /> : null}
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background-inverse/[0.72]" />
        <FeaturesHeader headingId={headingId} eyebrow={eyebrow ?? copy.eyebrow} heading={heading ?? copy.heading} description={description ?? copy.description} inverse maxWidth={640} />
        {list.length > 0 ? (
          <ul role="list" className="grid grid-cols-1 gap-10 [@container(min-width:48rem)]:grid-cols-2 [@container(min-width:72rem)]:grid-cols-3">
            {list.map((feature) => {
              const Icon = feature.icon
              return (
                <li key={feature.id} className="flex min-w-0 flex-col items-start gap-3">
                  {Icon ? (
                    <span className="flex size-10 items-center justify-center rounded-md bg-foreground-inverse text-background-inverse">
                      <Icon size={18} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />
                    </span>
                  ) : null}
                  <h3 className="text-base font-semibold text-foreground-inverse">{feature.title}</h3>
                  <p className="-mt-1 text-sm text-muted-foreground-inverse">{feature.description}</p>
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
export const featuresDarkPhotoPanelCopy = COPY
