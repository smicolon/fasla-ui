"use client"

import * as React from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { cn } from "../../../src/lib/utils"

export interface TextRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text to reveal */
  text: string
  /** Delay between each character in seconds */
  delay?: number
  /** Duration of each character animation */
  duration?: number
  /** Whether to trigger on view */
  triggerOnView?: boolean
}

/**
 * Scripts whose letters join to their neighbours: Arabic (with its supplements
 * and presentation forms), Syriac, N'Ko and Mandaic. A span per letter would
 * break the joins, so these reveal by word instead. The range also takes in
 * Thaana, which does not join; revealing it by word is harmless.
 */
const JOINED_SCRIPT = /[\u0600-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

/** The slice of Intl.Segmenter used here, typed locally: older TypeScript libs lack it. */
type GraphemeSegmenter = new (
  locale: undefined,
  options: { granularity: "grapheme" }
) => { segment(text: string): Iterable<{ segment: string }> }

/** Splits into user-perceived characters, so a mark stays with its letter. */
function splitGraphemes(text: string): string[] {
  const Segmenter = (Intl as unknown as { Segmenter?: GraphemeSegmenter }).Segmenter
  if (Segmenter) {
    const segmenter = new Segmenter(undefined, { granularity: "grapheme" })
    return Array.from(segmenter.segment(text), (part) => part.segment)
  }
  return Array.from(text)
}

/**
 * Splits the text into the pieces TextReveal animates: characters, or words
 * with their spaces for a joined script such as Arabic.
 */
export function revealUnits(text: string): string[] {
  return JOINED_SCRIPT.test(text) ? text.split(/(\s+)/).filter(Boolean) : splitGraphemes(text)
}

/**
 * Text reveal animation that reveals text character by character. Arabic and
 * other joined scripts reveal word by word, so their letters stay connected.
 * Respects prefers-reduced-motion by showing text immediately.
 */
export function TextReveal({
  text,
  delay = 0.03,
  duration = 0.3,
  triggerOnView = true,
  className,
  ...props
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const shouldAnimate = triggerOnView ? isInView : true
  const units = revealUnits(text)

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {text}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      {...props}
    >
      {/* Read once, whole; the animated pieces are hidden from assistive tech */}
      <span className="sr-only">{text}</span>
      {units.map((unit, i) => (
        <motion.span
          aria-hidden="true"
          key={`${unit}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={
            shouldAnimate
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{
            duration,
            delay: i * delay,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {/^\s+$/.test(unit) ? "\u00A0" : unit}
        </motion.span>
      ))}
    </div>
  )
}

export interface WordRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text to reveal */
  text: string
  /** Delay between each word in seconds */
  delay?: number
  /** Duration of each word animation */
  duration?: number
  /** Whether to trigger on view */
  triggerOnView?: boolean
}

/**
 * Word-by-word reveal animation.
 */
export function WordReveal({
  text,
  delay = 0.1,
  duration = 0.4,
  triggerOnView = true,
  className,
  ...props
}: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const shouldAnimate = triggerOnView ? isInView : true
  const words = text.split(" ")

  if (prefersReducedMotion) {
    return (
      <div className={className} {...props}>
        {text}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <motion.span
          aria-hidden="true"
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={
            shouldAnimate
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(10px)" }
          }
          transition={{
            duration,
            delay: i * delay,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  )
}
