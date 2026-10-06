"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * The landing page's section heading: an h2, an optional lede, and an optional
 * eyebrow and action. As in the reference, a hand-drawn red stroke sits under
 * the heading's last word and is drawn in from the inline start when the
 * heading scrolls into view (instantly with reduced motion).
 */
export function SectionHead({
  id,
  title,
  lede,
  eyebrow,
  action,
  center = false,
  className,
}: {
  id: string
  title: React.ReactNode
  lede?: React.ReactNode
  eyebrow?: React.ReactNode
  action?: React.ReactNode
  center?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-6",
        center && "justify-center text-center",
        className
      )}
    >
      <div className={cn("max-w-[720px]", center && "flex max-w-[820px] flex-col items-center")}>
        {eyebrow}
        <h2 id={id} className="l-h2">
          {title}
        </h2>
        {lede && <p className={cn("l-lede", center && "mx-auto")}>{lede}</p>}
      </div>
      {action}
    </div>
  )
}

/** The trailing punctuation the stroke leaves out, in either script. */
const TAIL = /^([\s\S]*?)(\S+?)([.,،:!?؟]*)(\s*)$/

/**
 * A heading's text with its last word underlined by the red stroke. A heading
 * with markup of its own (the Wall of Love's red "Love") uses StrokedWord.
 */
export function Stroked({ text }: { text: string }) {
  const match = TAIL.exec(text)
  if (!match) return <>{text}</>
  const [, lead, word, punct, space] = match
  return (
    <>
      {lead}
      <StrokedWord>{word}</StrokedWord>
      {punct + space}
    </>
  )
}

/** One word with the red stroke under it, drawn in when it scrolls into view. */
export function StrokedWord({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setDrawn(true)
        observer.disconnect()
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      {children}
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -inset-x-[2%] -bottom-[0.12em] h-[0.2em] w-[104%] overflow-visible fill-fasla-red transition-[clip-path] duration-1000 ease-[cubic-bezier(.65,0,.35,1)] [transition-delay:150ms] motion-reduce:transition-none rtl:-bottom-[0.16em] rtl:-scale-x-100",
          drawn ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)] motion-reduce:[clip-path:none]"
        )}
      >
        <path d="M0.5 7.6 C 20 3.4, 55 2.4, 99.5 4.6 L 99.5 6.4 C 56 4.8, 22 5.8, 0.5 9.6 Z" />
      </svg>
    </span>
  )
}
