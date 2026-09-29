"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

/**
 * Whether the user asks for reduced motion. It starts false, so the server and
 * the first client render agree, then follows the setting as it changes.
 */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])
  return reduced
}

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const showCursor = cursor && !prefersReducedMotion

  // Held in a ref: an inline callback is a new function every render, and as
  // an effect dependency it restarted the typing each time the parent rendered.
  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete

  React.useEffect(() => {
    // If user prefers reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayText(text)
      onCompleteRef.current?.()
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>
    let charIndex = 0
    setDisplayText("")
    setIsTyping(true)

    const startTyping = () => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1))
          charIndex++
          timeoutId = setTimeout(typeChar, speed)
        } else {
          setIsTyping(false)
          onCompleteRef.current?.()

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
  }, [text, speed, delay, loop, loopDelay, prefersReducedMotion])

  // Cursor blink effect
  const [cursorVisible, setCursorVisible] = React.useState(true)

  React.useEffect(() => {
    if (!showCursor) return

    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(blinkInterval)
  }, [showCursor])

  return (
    <span className={cn("inline", className)} {...props}>
      {displayText}
      {showCursor && (
        <span
          className={cn(
            "ms-0.5 inline-block",
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

  const prefersReducedMotion = usePrefersReducedMotion()

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(words[0] ?? "")
      return
    }

    const currentWord = words[wordIndex] ?? ""
    let timeoutId: ReturnType<typeof setTimeout>

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
      {cursor && !prefersReducedMotion && (
        <span
          className={cn(
            "ms-0.5 inline-block",
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
