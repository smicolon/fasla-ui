"use client"

import * as React from "react"
import { BLOCK_COMPONENTS, blockDemoProps } from "@/components/blocks/block-components"

/** The message a preview frame sends its page with the block's height. */
export const PREVIEW_HEIGHT_MESSAGE = "fasla-block-preview-height"

/**
 * The block, full width, and nothing else. In a frame it reports its height to
 * the page, which sizes the frame to fit; the block's own box is measured, not
 * the document, which is at least as tall as the frame and would never shrink.
 */
export function BlockPreview({ slug, locale }: { slug: string; locale: "en" | "ar" }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const Block = BLOCK_COMPONENTS[slug]

  React.useEffect(() => {
    const node = ref.current
    if (!node || window.parent === window) return
    const report = () =>
      window.parent.postMessage({ type: PREVIEW_HEIGHT_MESSAGE, slug, height: node.offsetHeight }, window.location.origin)
    report()
    const observer = new ResizeObserver(report)
    observer.observe(node)
    return () => observer.disconnect()
  }, [slug])

  return (
    <main ref={ref} className="w-full">
      {Block ? <Block locale={locale} {...blockDemoProps(slug, locale)} /> : null}
    </main>
  )
}
