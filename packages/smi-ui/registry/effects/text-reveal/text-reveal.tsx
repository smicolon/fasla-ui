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
 * Text reveal animation that reveals text character by character.
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
  const characters = text.split("")

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
      {characters.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
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
          {char === " " ? "\u00A0" : char}
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
      {words.map((word, i) => (
        <motion.span
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
