"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useNearView } from "./use-near-view"

/**
 * Shows a block drawn at its design width, scaled to its box.
 *
 * - `fill`: the block spans the box's width and is cropped to its height,
 *   for full-bleed blocks (heroes, galleries).
 * - `fit`: the block keeps its natural height and floats, centred and framed,
 *   at up to 86% of the box's width and 80% of its height, for compact blocks
 *   (a form, a list) that would look lost at full width.
 *
 * The scale is measured, so the block stays hidden until the first
 * measurement rather than flashing at full size. The block itself mounts
 * only when the preview nears the viewport (useNearView).
 */
export function ScaledPreview({
  width,
  height,
  mode,
  dark = false,
  className,
  children,
}: {
  /** The design width, in px. */
  width: number
  /** The natural height for `fit`, in px. */
  height?: number
  mode: "fill" | "fit"
  /** Draw the block in Dark whatever the page theme. */
  dark?: boolean
  className?: string
  children: React.ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState<{ z: number; x: number; y: number; h: number } | null>(null)
  const near = useNearView(box)

  // A picture, not a form: its buttons and fields are never focusable.
  useEffect(() => {
    if (box.current) box.current.inert = true
  }, [])

  useEffect(() => {
    const el = box.current
    if (!el) return
    /** Fits the block to the box: full width for `fill`, centred within 86% by 80% for `fit`. */
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w) return
      if (mode === "fit" && height) {
        const z = Math.min((w * 0.86) / width, (h * 0.8) / height)
        setFrame({ z, x: (w - width * z) / 2, y: (h - height * z) / 2, h: height })
      } else {
        const z = w / width
        setFrame({ z, x: 0, y: 0, h: h / z })
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [mode, width, height])

  return (
    <div ref={box} aria-hidden="true" className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute left-0 top-0 origin-top-left",
          dark && "dark",
          mode === "fit" && "overflow-hidden rounded-[30px] shadow-2xl ring-[3px] ring-foreground/10",
          !frame && "invisible"
        )}
        style={{
          width,
          height: frame?.h ?? height ?? 0,
          transform: frame ? `translate(${frame.x}px, ${frame.y}px) scale(${frame.z})` : undefined,
        }}
      >
        {near && children}
      </div>
    </div>
  )
}
