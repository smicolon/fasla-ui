"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { mahaamPhotoProps } from "@/components/blocks/mahaam-photos"
import { PREVIEW_HEIGHT_MESSAGE } from "@/components/blocks/block-preview"

const MahaamTemplate = dynamic(() => import("@fasla-ui/templates/mahaam/mahaam-template").then((m) => m.MahaamTemplate))
const MahaamMotionToggle = dynamic(() => import("@fasla-ui/templates/mahaam/mahaam-motion-toggle").then((m) => m.MahaamMotionToggle))

/**
 * The whole Mahaam template, full width, and nothing else, for the docs page's
 * frames and for the full-page link. The page's `dir` and the locale come from
 * the route; the viewport is the frame's.
 *
 * The template draws no pause button. A site that ships it places a
 * `MahaamMotionToggle` (WCAG 2.2.2); here it is page chrome, fixed in the
 * corner outside the template, so a reviewer can pause while looking.
 */
export function MahaamTemplatePreview({ locale }: { locale: "en" | "ar" }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [paused, setPaused] = React.useState(false)
  // In a docs frame, tell the page the template's height so the frame fits it.
  React.useEffect(() => {
    const node = ref.current
    if (!node || window.parent === window) return
    const report = () =>
      window.parent.postMessage({ type: PREVIEW_HEIGHT_MESSAGE, slug: "template-mahaam", height: node.offsetHeight }, window.location.origin)
    report()
    const observer = new ResizeObserver(report)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="w-full">
      {/* First in the page order, so a keyboard user reaches it before the template's links; fixed to the corner on screen. The template brings its own <main>. */}
      <div className="fixed bottom-4 end-4 z-50 rounded-full shadow-md">
        <MahaamMotionToggle paused={paused} onPausedChange={setPaused} locale={locale} />
      </div>
      <MahaamTemplate locale={locale} paused={paused} photos={mahaamPhotoProps} />
    </div>
  )
}
