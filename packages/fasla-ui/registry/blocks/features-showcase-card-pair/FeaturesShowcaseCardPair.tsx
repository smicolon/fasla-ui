"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Button } from "../../ui/button/button"
import { FeaturesPhotoSlot, FeaturesSection, type FeaturesLocale, type FeaturesPhoto } from "../features/features"

/*
 * Figma: `Features` (42367:57765), Type=Showcase Card Pair.
 *
 * A centred header (a 14px eyebrow and a 48px heading) over two showcases,
 * each a 460px `muted` stage (16px radius) with a caption under it: a 16px
 * title and a 14px line. The first stage holds a landscape photo (420 × 280)
 * with a prompt bar over its bottom edge: a `background-inverse` bar (14px
 * radius) with the prompt and a round Solid Secondary Button (sm) carrying an
 * up arrow. The second holds a portrait photo (264 × 330) with a selection
 * box drawn over part of it.
 *
 * The arrow fires `onApply`. Pass `editedImage` and pressing it crossfades the
 * first photo to the edited one in 300ms (at once under reduced motion);
 * Figma draws no edited photo, so without one the press only reports. The
 * selection box is always drawn, as in Figma.
 *
 * Desktop sets the two showcases side by side; Tablet and Mobile stack them,
 * the stage 300px tall (330px for the portrait) on Mobile.
 *
 * Content limits: the heading up to 40 characters, a title up to 24 and a
 * line up to 150. The other limits are in the block's documentation page.
 */

export interface FeaturesShowcaseCaption {
  /** The caption's title. */
  title: React.ReactNode
  /** The line under it. */
  description: React.ReactNode
}

export interface FeaturesShowcaseCardPairCopy {
  /** The 14px line above the heading. */
  eyebrow: React.ReactNode
  /** The section's heading, an `h2`. */
  heading: React.ReactNode
  /** The prompt in the first stage's bar. */
  prompt: string
  /** Names the prompt's arrow button. */
  applyLabel: string
  /** The first showcase's caption. */
  first: FeaturesShowcaseCaption
  /** The second showcase's caption. */
  second: FeaturesShowcaseCaption
}

/** Figma's copy, English and Arabic. */
const COPY: Record<FeaturesLocale, FeaturesShowcaseCardPairCopy> = {
  en: {
    eyebrow: "FEATURES",
    heading: "Craft that goes beyond the first draft.",
    prompt: "Remove the lamp from the scene",
    applyLabel: "Apply the edit",
    first: { title: "Point and edit", description: "Change one detail without touching the rest. Your approved work stays exactly as it was, so every edit is precise and intentional." },
    second: { title: "Select and refine", description: "Select any part of the frame and adjust it on its own. The rest of the scene stays put, and your style carries across every version." },
  },
  ar: {
    eyebrow: "المزايا",
    heading: "حِرفة تتجاوز المسوّدة الأولى.",
    prompt: "أزل المصباح من المشهد",
    applyLabel: "طبّق التعديل",
    first: { title: "أشِر وعدّل", description: "غيّر تفصيلًا واحدًا دون المساس بالباقي. يبقى عملك المعتمد كما هو، فكل تعديل دقيق ومقصود." },
    second: { title: "حدّد وحسّن", description: "حدّد أي جزء من الإطار وعدّله منفردًا. يبقى بقية المشهد ثابتًا، ويمتد أسلوبك عبر كل نسخة." },
  },
}

export interface FeaturesShowcaseCardPairProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<FeaturesShowcaseCardPairCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: FeaturesLocale
  /** The two photos: the landscape one first, then the portrait one. A `muted` placeholder shows for any left out. */
  photos?: FeaturesPhoto[]
  /** The first photo after the edit. Pressing the arrow crossfades to it. */
  editedImage?: FeaturesPhoto
  /** Called when the prompt's arrow is pressed. */
  onApply?: () => void
}

export function FeaturesShowcaseCardPair({ locale = "en", eyebrow, heading, prompt, applyLabel, first, second, photos, editedImage, onApply, className, ...props }: FeaturesShowcaseCardPairProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const [applied, setApplied] = React.useState(false)
  const one = first ?? copy.first
  const two = second ?? copy.second

  return (
    <FeaturesSection labelledBy={headingId} gap="md" className={className} {...props}>
      <header className="flex flex-col items-center gap-3 text-center">
        {(eyebrow ?? copy.eyebrow) ? <p className="text-sm text-muted-foreground">{eyebrow ?? copy.eyebrow}</p> : null}
        <h2 id={headingId} className="text-3xl font-medium text-foreground [@container(min-width:48rem)]:text-4xl [@container(min-width:72rem)]:text-5xl">
          {heading ?? copy.heading}
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-6 [@container(min-width:72rem)]:grid-cols-2">
        <figure className="flex min-w-0 flex-col gap-5">
          <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-muted [@container(min-width:48rem)]:h-[460px]">
            <div className="relative w-[78%] max-w-[420px]">
              <FeaturesPhotoSlot photo={photos?.[0]} className="aspect-[3/2] w-full rounded-lg shadow-md" />
              {editedImage ? (
                <img
                  src={editedImage.src}
                  alt={editedImage.alt}
                  className={cn("absolute inset-0 size-full rounded-lg object-cover shadow-md motion-safe:transition-opacity motion-safe:duration-300", applied ? "opacity-100" : "opacity-0")}
                />
              ) : null}
              <div className="absolute inset-x-[6%] -bottom-4 flex items-center gap-3 rounded-[14px] bg-background-inverse p-3 ps-4 text-sm text-foreground-inverse shadow-lg">
                <span className="min-w-0 flex-1">{prompt ?? copy.prompt}</span>
                <Button
                  type="button"
                  variant="default"
                  tone="secondary"
                  size="icon-sm"
                  radius="rounded"
                  aria-label={applyLabel ?? copy.applyLabel}
                  onClick={() => {
                    if (editedImage) setApplied(true)
                    onApply?.()
                  }}
                >
                  <ArrowUp aria-hidden />
                </Button>
              </div>
            </div>
          </div>
          <figcaption className="flex flex-col gap-2 px-2">
            <h3 className="text-base font-medium text-foreground">{one.title}</h3>
            <p className="text-sm text-muted-foreground">{one.description}</p>
          </figcaption>
        </figure>
        <figure className="flex min-w-0 flex-col gap-5">
          <div className="flex h-[330px] items-center justify-center overflow-hidden rounded-2xl bg-muted [@container(min-width:48rem)]:h-[460px]">
            <div className="relative aspect-[264/330] h-[78%]">
              <FeaturesPhotoSlot photo={photos?.[1]} className="size-full rounded-md shadow-md" />
              <div aria-hidden="true" className="absolute start-[22%] top-[34%] h-[38%] w-[56%] border border-foreground-inverse">
                {["-start-1 -top-1", "-end-1 -top-1", "-start-1 -bottom-1", "-end-1 -bottom-1"].map((corner) => (
                  <span key={corner} className={cn("absolute size-2 bg-foreground-inverse", corner)} />
                ))}
              </div>
            </div>
          </div>
          <figcaption className="flex flex-col gap-2 px-2">
            <h3 className="text-base font-medium text-foreground">{two.title}</h3>
            <p className="text-sm text-muted-foreground">{two.description}</p>
          </figcaption>
        </figure>
      </div>
    </FeaturesSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const featuresShowcaseCardPairCopy = COPY
