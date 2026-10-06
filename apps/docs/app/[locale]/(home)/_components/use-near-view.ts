"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * True once the element comes within `margin` of the viewport, and from then
 * on. The block previews mount only then: there are about fifty of them, all
 * far below the fold, and rendering them up front made the page's language
 * flip miss its half-second budget.
 */
export function useNearView(ref: RefObject<Element>, margin = "800px") {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || near) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, margin, near])

  return near
}
