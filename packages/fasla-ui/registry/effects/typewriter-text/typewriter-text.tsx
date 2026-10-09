"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Whether the user asks for reduced motion. False on the server and while
 * hydrating, so both renders agree, then the setting as it is and as it
 * changes. Read through useSyncExternalStore, not set from an effect: an
 * effect's setState renders everything twice, and React's lint rejects it.
 */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

/** The value, or the fallback when it is missing or blank (a cleared control, say). */
const filled = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback

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
  cursorChar: cursorCharProp,
  loop = false,
  loopDelay = 2000,
  onComplete,
  className,
  ...props
}: TypewriterTextProps) {
  const cursorChar = filled(cursorCharProp, "|")
  const prefersReducedMotion = usePrefersReducedMotion()
  const showCursor = cursor && !prefersReducedMotion

  // How far the current run has typed. A new text, speed or timing starts a
  // new run, and progress left by an older one reads as nothing typed yet, so
  // the run never has to clear state as it starts.
  const run = JSON.stringify([text, speed, delay, loop, loopDelay])
  const [progress, setProgress] = React.useState({ run: "", typed: 0, typing: false })
  const current = progress.run === run
  // Reduced motion: the whole text, at once.
  const displayText = prefersReducedMotion ? text : current ? text.slice(0, progress.typed) : ""
  const isTyping = current ? progress.typing : true

  // Held in a ref: an inline callback is a new function every render, and as
  // an effect dependency it restarted the typing each time the parent rendered.
  // Updated after each render, never during one.
  const onCompleteRef = React.useRef(onComplete)
  React.useEffect(() => {
    onCompleteRef.current = onComplete
  })

  React.useEffect(() => {
    if (prefersReducedMotion) {
      onCompleteRef.current?.()
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>

    const startTyping = () => {
      let charIndex = 0
      const typeChar = () => {
        if (charIndex < text.length) {
          charIndex++
          setProgress({ run, typed: charIndex, typing: true })
          timeoutId = setTimeout(typeChar, speed)
        } else {
          setProgress({ run, typed: charIndex, typing: false })
          onCompleteRef.current?.()
          if (loop) timeoutId = setTimeout(startTyping, loopDelay)
        }
      }

      setProgress({ run, typed: 0, typing: true })
      typeChar()
    }

    timeoutId = setTimeout(startTyping, delay)

    return () => clearTimeout(timeoutId)
  }, [run, text, speed, delay, loop, loopDelay, prefersReducedMotion])

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
  const [typedText, setTypedText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  const prefersReducedMotion = usePrefersReducedMotion()
  // Reduced motion: the first word, still.
  const displayText = prefersReducedMotion ? (words[0] ?? "") : typedText

  React.useEffect(() => {
    if (prefersReducedMotion) return

    const currentWord = words[wordIndex] ?? ""
    let timeoutId: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      // Typing
      if (typedText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length + 1))
        }, speed)
      } else {
        // Word complete, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true)
        }, deleteDelay)
      }
    } else {
      // Deleting
      if (typedText.length > 0) {
        timeoutId = setTimeout(() => {
          setTypedText(typedText.slice(0, -1))
        }, speed / 2)
      } else {
        // Deletion complete: after a pause, type the next word.
        timeoutId = setTimeout(() => {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }, wordDelay)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [typedText, isDeleting, wordIndex, words, speed, deleteDelay, wordDelay, prefersReducedMotion])

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
