"use client"

import { useTranslations } from "next-intl"

import {
  ContentCarousel,
  ContentCarouselItem,
} from "@fasla-ui/ui/content-carousel"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const ITEMS_PER_VIEW = [1, 2, 3] as const

export default function ContentCarouselPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.contentCarousel")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code }

  const quotes = [1, 2, 3, 4].map((n) => ({
    body: s(`examples.quote${n}` as "examples.quote1"),
    name: s(`examples.name${n}` as "examples.name1"),
  }))

  const carousel = (
    count: number,
    props: Partial<React.ComponentProps<typeof ContentCarousel>> = {}
  ) => (
    <ContentCarousel
      aria-label={s("examples.label")}
      previousLabel={s("examples.previous")}
      nextLabel={s("examples.next")}
      className="w-full"
      {...props}
    >
      {quotes.slice(0, count).map((quote) => (
        <ContentCarouselItem key={quote.name}>
          <figure className="flex h-full flex-col justify-between gap-4 p-6">
            <blockquote className="text-sm text-foreground">{quote.body}</blockquote>
            <figcaption className="text-xs font-medium text-foreground">
              {quote.name}
            </figcaption>
          </figure>
        </ContentCarouselItem>
      ))}
    </ContentCarousel>
  )

  // One table: the view, then the state trio, then the arrows, then parts
  // and styling.
  const props: PropRow[] = [
    { prop: "itemsPerView", type: "1 | 2 | 3", fallback: "1", description: s.rich("props.itemsPerView", rich) },
    { prop: "activeIndex", type: "number", fallback: "", description: s.rich("props.activeIndex", rich) },
    { prop: "defaultActiveIndex", type: "number", fallback: "0", description: s.rich("props.defaultActiveIndex", rich) },
    { prop: "onActiveIndexChange", type: "(index) => void", fallback: "", description: s.rich("props.onActiveIndexChange", rich) },
    { prop: "previousLabel", type: "string", fallback: '"Previous"', description: s.rich("props.previousLabel", rich) },
    { prop: "nextLabel", type: "string", fallback: '"Next"', description: s.rich("props.nextLabel", rich) },
    { prop: "ContentCarouselItem", type: "{ className }", fallback: "", description: s.rich("props.item", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/content-carousel/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="content-carousel" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <p className="text-muted-foreground">{s.rich("previewBody", rich)}</p>
        <ComponentPreview>{carousel(4, { itemsPerView: 2 })}</ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{s.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="flex w-full flex-col gap-8">
            {ITEMS_PER_VIEW.map((itemsPerView) => (
              <div key={itemsPerView} className="flex flex-col gap-3">
                <code className="w-fit text-sm text-muted-foreground">
                  itemsPerView={`{${itemsPerView}}`}
                </code>
                {carousel(4, { itemsPerView })}
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
          <div className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="w-fit text-sm text-muted-foreground">{s("states.first")}</span>
              {carousel(3, { itemsPerView: 2 })}
            </div>
            <div className="flex flex-col gap-3">
              <span className="w-fit text-sm text-muted-foreground">{s("states.last")}</span>
              {carousel(3, { itemsPerView: 2, defaultActiveIndex: 1 })}
            </div>
            <div className="flex flex-col gap-3">
              <span className="w-fit text-sm text-muted-foreground">{s("states.all")}</span>
              {carousel(3, { itemsPerView: 3 })}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.region", rich)}</li>
          <li>{s.rich("a11y.arrows", rich)}</li>
          <li>{s.rich("a11y.keyboard", rich)}</li>
          <li>{s.rich("a11y.slides", rich)}</li>
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
  ContentCarousel,
  ContentCarouselItem,
} from "@/components/ui/content-carousel"

export function CustomerStories() {
  return (
    <ContentCarousel
      aria-label="${s("examples.label")}"
      previousLabel="${s("examples.previous")}"
      nextLabel="${s("examples.next")}"
    >
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote1")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote2")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote3")}</blockquote>
      </ContentCarouselItem>
    </ContentCarousel>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.itemsPerView")}>{`import {
  ContentCarousel,
  ContentCarouselItem,
} from "@/components/ui/content-carousel"

export function CustomerStories() {
  return (
    <ContentCarousel
      aria-label="${s("examples.label")}"
      previousLabel="${s("examples.previous")}"
      nextLabel="${s("examples.next")}"
      itemsPerView={3}
    >
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote1")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote2")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote3")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote4")}</blockquote>
      </ContentCarouselItem>
    </ContentCarousel>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.media")}>{`import {
  ContentCarousel,
  ContentCarouselItem,
} from "@/components/ui/content-carousel"

const PHOTOS = [
  { src: "/photos/old-town.jpg", alt: "${s("examples.photo1")}" },
  { src: "/photos/harbour.jpg", alt: "${s("examples.photo2")}" },
  { src: "/photos/corniche.jpg", alt: "${s("examples.photo3")}" },
]

export function PhotoTour() {
  return (
    <ContentCarousel
      aria-label="${s("examples.gallery")}"
      previousLabel="${s("examples.previous")}"
      nextLabel="${s("examples.next")}"
      itemsPerView={2}
    >
      {PHOTOS.map((photo) => (
        <ContentCarouselItem key={photo.src}>
          <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
        </ContentCarouselItem>
      ))}
    </ContentCarousel>
  )
}`}</UsageExample>
        <UsageExample title={s("usage.controlled")}>{`"use client"

import * as React from "react"
import {
  ContentCarousel,
  ContentCarouselItem,
} from "@/components/ui/content-carousel"

export function CustomerStories() {
  const [index, setIndex] = React.useState(0)
  return (
    <ContentCarousel
      aria-label="${s("examples.label")}"
      previousLabel="${s("examples.previous")}"
      nextLabel="${s("examples.next")}"
      itemsPerView={2}
      activeIndex={index}
      onActiveIndexChange={setIndex}
    >
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote1")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote2")}</blockquote>
      </ContentCarouselItem>
      <ContentCarouselItem>
        <blockquote className="p-6 text-sm">${s("examples.quote3")}</blockquote>
      </ContentCarouselItem>
    </ContentCarousel>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
