"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface TypewriterTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text to type out */
  text: string
  /** Typing speed in milliseconds per character */
  speed?: number
  /** Delay before starting */
  delay?: number
  /** Whether to show cursor */
  cursor?: boolean
  /** Cursor character */
  cursorChar?: string
  /** Whether to loop the animation */
  loop?: boolean
  /** Delay before restarting when looping */
  loopDelay?: number
  /** Called when typing is complete */
  onComplete?: () => void
}

export function TypewriterText({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = "|",
  loop = false,
  loopDelay = 2000,
  onComplete,
  className,
  ...props
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [showCursor, setShowCursor] = React.useState(cursor)

  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  React.useEffect(() => {
    // If user prefers reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayText(text)
      setShowCursor(false)
      onComplete?.()
      return
    }

    let timeoutId: NodeJS.Timeout
    let charIndex = 0
    setIsTyping(true)

    const startTyping = () => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1))
          charIndex++
          timeoutId = setTimeout(typeChar, speed)
        } else {
          setIsTyping(false)
          onComplete?.()

          if (loop) {
            timeoutId = setTimeout(() => {
              charIndex = 0
              setDisplayText("")
              setIsTyping(true)
              startTyping()
            }, loopDelay)
          }
        }
      }

      typeChar()
    }

    timeoutId = setTimeout(startTyping, delay)

    return () => clearTimeout(timeoutId)
  }, [text, speed, delay, loop, loopDelay, onComplete, prefersReducedMotion])

  // Cursor blink effect
  const [cursorVisible, setCursorVisible] = React.useState(true)

  React.useEffect(() => {
    if (!showCursor || prefersReducedMotion) return

    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(blinkInterval)
  }, [showCursor, prefersReducedMotion])

  return (
    <span className={cn("inline", className)} {...props}>
      {displayText}
      {showCursor && (
        <span
          className={cn(
            "ml-0.5 inline-block",
            cursorVisible ? "opacity-100" : "opacity-0",
            isTyping ? "" : "animate-pulse"
          )}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}

export interface TypewriterWordsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Array of words to cycle through */
  words: string[]
  /** Typing speed */
  speed?: number
  /** Delay before deleting */
  deleteDelay?: number
  /** Delay between words */
  wordDelay?: number
  /** Whether to show cursor */
  cursor?: boolean
}

export function TypewriterWords({
  words,
  speed = 80,
  deleteDelay = 1500,
  wordDelay = 500,
  cursor = true,
  className,
  ...props
}: TypewriterWordsProps) {
  const [wordIndex, setWordIndex] = React.useState(0)
  const [displayText, setDisplayText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(words[0] ?? "")
      return
    }

    const currentWord = words[wordIndex] ?? ""
    let timeoutId: NodeJS.Timeout

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, speed)
      } else {
        // Word complete, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true)
        }, deleteDelay)
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, speed / 2)
      } else {
        // Deletion complete, move to next word
        setIsDeleting(false)
        timeoutId = setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % words.length)
        }, wordDelay)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [displayText, isDeleting, wordIndex, words, speed, deleteDelay, wordDelay, prefersReducedMotion])

  // Cursor blink
  const [cursorVisible, setCursorVisible] = React.useState(true)

  React.useEffect(() => {
    if (!cursor || prefersReducedMotion) return

    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(blinkInterval)
  }, [cursor, prefersReducedMotion])

  return (
    <span className={cn("inline", className)} {...props}>
      {displayText}
      {cursor && (
        <span
          className={cn(
            "ml-0.5 inline-block",
            cursorVisible ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        >
          |
        </span>
      )}
    </span>
  )
}
