"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { mahaamPhotoProps } from "@/components/blocks/mahaam-photos"
import { PREVIEW_HEIGHT_MESSAGE } from "@/components/blocks/block-preview"

const MahaamTemplate = dynamic(() => import("@fasla-ui/templates/mahaam/mahaam-template").then((m) => m.MahaamTemplate))

/**
 * The whole Mahaam template, full width, and nothing else, for the docs page's
 * frames and for the full-page link. The page's `dir` and the locale come from
 * the route; the viewport is the frame's.
 */
export function MahaamTemplatePreview({ locale }: { locale: "en" | "ar" }) {
  const ref = React.useRef<HTMLElement>(null)
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
    <main ref={ref} className="w-full">
      <MahaamTemplate locale={locale} photos={mahaamPhotoProps} />
    </main>
  )
}
