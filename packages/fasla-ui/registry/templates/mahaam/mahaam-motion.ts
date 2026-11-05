"use client"

import * as React from "react"

/*
 * The Mahaam template's motion helper.
 *
 * MOTION EXCEPTION. Fasla's motion rules say everything animates from the
 * presets in `src/motion/presets.ts`, and that nothing plays or loops on its
 * own. This template is the one documented exception: its sections tell the
 * product's story by playing it (a voice note typing itself into a planner,
 * cards scrolling, answers being written), as the designer decided. Autoplay
 * and loops are allowed here, on these conditions:
 *
 *  - Under `prefers-reduced-motion: reduce` nothing moves. Each section shows
 *    its finished state, and the template shows no pause control, as there is
 *    nothing to pause.
 *  - A loop runs only while its section is on screen and the page is visible,
 *    so it costs nothing out of sight. Marquees and the stacked testimonial
 *    cards also stop under the pointer.
 *  - A loop can be stopped (WCAG 2.2.2): every section takes a `paused` prop,
 *    which freezes it where it stands.
 *
 * The motion is the Web Animations API and a small timer, client only, so the
 * template needs no keyframes in your Tailwind config. The server renders the
 * finished state.
 */

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/**
 * Whether the visitor asks for reduced motion. False on the server and while
 * hydrating, so both renders agree, then the setting as it is and as it
 * changes. `override` replaces the setting, for stories and tests.
 */
export function usePrefersReducedMotion(override?: boolean) {
  const system = React.useSyncExternalStore(
    subscribeToReducedMotion,
    () => typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
  return override ?? system
}

/** Whether the element is on screen. True where there is no IntersectionObserver, and on the server. */
export function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = React.useState(true)
  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver !== "function") return
    const observer = new IntersectionObserver((entries) => setInView(entries.some((entry) => entry.isIntersecting)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange)
  return () => document.removeEventListener("visibilitychange", onChange)
}

/** Whether the page is the one the visitor is looking at. */
export function usePageVisible() {
  return React.useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState !== "hidden",
    () => true
  )
}

/**
 * A frame counter that loops: 0, 1, ... `length - 1`, then 0 again, one step
 * every `intervalMs`. It holds still while `active` is false, and starts from
 * `from` the first time it runs.
 */
export function useLoopClock({ length, intervalMs, active, from = 0 }: { length: number; intervalMs: number; active: boolean; from?: number }) {
  const [frame, setFrame] = React.useState(from)
  React.useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setFrame((current) => (current + 1 >= length ? 0 : current + 1)), intervalMs)
    return () => window.clearInterval(timer)
  }, [active, length, intervalMs])
  return frame
}

/**
 * One looping Web Animations API animation on an element. It exists while
 * `enabled`, and plays while `active`: pausing freezes it where it stands.
 */
export function useLoopAnimation(
  ref: React.RefObject<HTMLElement | null>,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  { enabled, active, at }: { enabled: boolean; active: boolean; at?: number }
) {
  const animationRef = React.useRef<Animation | null>(null)
  const activeRef = React.useRef(active)
  activeRef.current = active

  React.useEffect(() => {
    const element = ref.current
    if (!element || !enabled || typeof element.animate !== "function") return
    const animation = element.animate(keyframes, options)
    if (at !== undefined) animation.currentTime = at
    if (!activeRef.current) animation.pause()
    animationRef.current = animation
    return () => {
      animation.cancel()
      animationRef.current = null
    }
    // The keyframes and options are constants of the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled])

  React.useEffect(() => {
    const animation = animationRef.current
    if (!animation) return
    if (active) animation.play()
    else animation.pause()
  }, [active])
}

/** The ring that pulses out of a dot: `rec` in the spec, in the `foreground` colour Figma draws the dots in. */
export const PULSE_KEYFRAMES: Keyframe[] = [
  { boxShadow: "0 0 0 0 color-mix(in srgb, var(--foreground) 50%, transparent)", offset: 0 },
  { boxShadow: "0 0 0 7px color-mix(in srgb, var(--foreground) 0%, transparent)", offset: 0.6 },
  { boxShadow: "0 0 0 0 color-mix(in srgb, var(--foreground) 0%, transparent)", offset: 1 },
]

/** Slides an element in from below as the page loads, `in` in the spec. */
export function useEntrance(ref: React.RefObject<HTMLElement | null>, delayMs: number, enabled: boolean) {
  React.useLayoutEffect(() => {
    const element = ref.current
    if (!element || !enabled || typeof element.animate !== "function") return
    const animation = element.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 1000, delay: delayMs, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" }
    )
    return () => animation.cancel()
  }, [ref, delayMs, enabled])
}
