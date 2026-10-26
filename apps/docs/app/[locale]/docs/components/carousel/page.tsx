"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@fasla-ui/ui/carousel"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const ITEM_COUNTS = [2, 3, 4] as const

export default function CarouselPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.carousel")
  const [photo, setPhoto] = React.useState(0)

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code }

  const slides = [s("examples.slide1"), s("examples.slide2"), s("examples.slide3")]

  const slide = (caption: string) => (
    <div className="flex h-44 items-end rounded-lg bg-muted p-4">
      <span className="text-sm font-medium text-foreground">{caption}</span>
    </div>
  )

  const gallery = (
    captions: string[],
    props: Partial<React.ComponentProps<typeof Carousel>> = {}
  ) => (
    <Carousel aria-label={s("examples.gallery")} className="w-80 space-y-4" {...props}>
      <CarouselContent>
        {captions.map((caption) => (
          <CarouselItem key={caption}>{slide(caption)}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )

  // One table: the root's state trio first, then the parts, then styling.
  const props: PropRow[] = [
    { prop: "activeIndex", type: "number", fallback: "", description: s.rich("props.activeIndex", rich) },
    { prop: "defaultActiveIndex", type: "number", fallback: "0", description: s.rich("props.defaultActiveIndex", rich) },
    { prop: "onActiveIndexChange", type: "(index) => void", fallback: "", description: s.rich("props.onActiveIndexChange", rich) },
    { prop: "CarouselContent", type: "{ className }", fallback: "", description: s.rich("props.content", rich) },
    { prop: "CarouselItem", type: "{ className }", fallback: "", description: s.rich("props.item", rich) },
    { prop: "CarouselDots", type: "{ count, activeIndex, onActiveIndexChange, label, className }", fallback: "", description: s.rich("props.dots", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/carousel/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="carousel" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <p className="text-muted-foreground">{s.rich("previewBody", rich)}</p>
        <ComponentPreview>{gallery(slides)}</ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-8">
            {ITEM_COUNTS.map((count) => (
              <div key={count} className="flex flex-col items-center gap-3">
                <code className="w-fit text-sm text-muted-foreground">{count}</code>
                {gallery(
                  Array.from({ length: count }, (_, i) => `${s("examples.slide")} ${i + 1}`),
                  { className: "w-64 space-y-3" }
                )}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{s.rich("statesBody", rich)}</p>
        <ComponentPreview>
          {gallery(slides, { defaultActiveIndex: 2 })}
        </ComponentPreview>
      </section>

      {/* Dots on their own */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("standalone.title")}</h2>
        <p className="text-muted-foreground">{s.rich("standalone.body", rich)}</p>
        <ComponentPreview>
          <div className="flex w-80 flex-col gap-4">
            {slide(slides[photo]!)}
            <CarouselDots
              count={slides.length}
              activeIndex={photo}
              onActiveIndexChange={setPhoto}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.region", rich)}</li>
          <li>{s.rich("a11y.slides", rich)}</li>
          <li>{s.rich("a11y.dots", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.motion", rich)}</li>
          <li>{s.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CityGuide() {
  return (
    <Carousel aria-label="${s("examples.gallery")}" className="space-y-4">
      <CarouselContent>
        <CarouselItem>${s("examples.slide1")}</CarouselItem>
        <CarouselItem>${s("examples.slide2")}</CarouselItem>
        <CarouselItem>${s("examples.slide3")}</CarouselItem>
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.startingSlide")}>{`import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CityGuide() {
  return (
    <Carousel aria-label="${s("examples.gallery")}" defaultActiveIndex={2} className="space-y-4">
      <CarouselContent>
        <CarouselItem>${s("examples.slide1")}</CarouselItem>
        <CarouselItem>${s("examples.slide2")}</CarouselItem>
        <CarouselItem>${s("examples.slide3")}</CarouselItem>
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.standalone")}>{`"use client"

import * as React from "react"
import { CarouselDots } from "@/components/ui/carousel"

const PHOTOS = ["${s("examples.slide1")}", "${s("examples.slide2")}", "${s("examples.slide3")}"]

export function PhotoStepper() {
  const [index, setIndex] = React.useState(0)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium">{PHOTOS[index]}</p>
      <CarouselDots count={PHOTOS.length} activeIndex={index} onActiveIndexChange={setIndex} />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel"

export function CityGuide() {
  const [index, setIndex] = React.useState(0)
  return (
    <Carousel
      aria-label="${s("examples.gallery")}"
      activeIndex={index}
      onActiveIndexChange={setIndex}
      className="space-y-4"
    >
      <CarouselContent>
        <CarouselItem>${s("examples.slide1")}</CarouselItem>
        <CarouselItem>${s("examples.slide2")}</CarouselItem>
        <CarouselItem>${s("examples.slide3")}</CarouselItem>
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
