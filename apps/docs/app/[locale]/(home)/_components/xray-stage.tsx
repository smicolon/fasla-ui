"use client"

import { useEffect, useRef, useState } from "react"
import { Switch } from "@fasla-ui/ui/switch/switch"
import { cn } from "@/lib/utils"

/**
 * The hero's product window with its "Show components" switch. Turned on, every
 * part marked `data-c` gets a dashed red outline and a tag naming the Fasla
 * component it is (landing.css draws both).
 *
 * The window is a picture of a product, so it is inert: its buttons and links
 * are real components, but they are neither focusable nor announced. The frame
 * names the picture instead.
 */
export function XrayStage({
  label,
  windowLabel,
  children,
}: {
  label: string
  windowLabel: string
  children: React.ReactNode
}) {
  const [on, setOn] = useState(false)
  const picture = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (picture.current) picture.current.inert = true
  }, [])

  return (
    <div className={cn("l-stage l-wrap relative mt-[clamp(36px,4vw,48px)] pb-[var(--l-section)]", on && "is-xray")}>
      <div className="mb-4 flex justify-center">
        {/* The ground behind the label breaks the hero's centre seam around it. */}
        <span className="relative z-10 bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
          <Switch label={label} checked={on} onChange={(event) => setOn(event.target.checked)} />
        </span>
      </div>
      <div role="img" aria-label={windowLabel}>
        <div ref={picture} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
