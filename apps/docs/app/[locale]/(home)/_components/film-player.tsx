"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons"
import { prefersReducedMotion } from "./locale-flip"

/** Chapter start times in seconds, from the film's edit, and its length. */
const CHAPTERS = [0, 12.1, 18.5, 22.9, 30.0, 37.1]
const END = 50.63
const KEYS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const

/**
 * Where the film was when the page flipped language. The other locale's page
 * mounts a new player with the other film; it resumes from here, as the
 * reference does. Module state survives that client-side navigation.
 */
let resume: { time: number; playing: boolean; muted: boolean } | null = null

const ctrl =
  "absolute bottom-3.5 z-10 grid size-10 place-items-center rounded-full bg-fasla-ink/70 text-fasla-white backdrop-blur-md transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-fasla-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground max-[760px]:bottom-2.5 max-[760px]:size-8 [&_svg]:size-[15px] max-[760px]:[&_svg]:size-[13px]"

/**
 * The approved v5 film, in the page's language. It plays muted while at least
 * a third of it is on screen and pauses when it leaves; the chapter bar under
 * it follows playback and seeks on click. With reduced motion it waits for
 * the play button.
 */
export function FilmPlayer() {
  const locale = useLocale() === "ar" ? "ar" : "en"
  const t = useTranslations("landing.film")
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [revealed, setRevealed] = useState(false)

  // Resume where the other language's film was.
  useEffect(() => {
    const v = video.current
    if (!v || !resume) return
    const { time: at, playing: was, muted: quiet } = resume
    resume = null
    v.muted = quiet
    setMuted(quiet)
    const seek = () => {
      v.currentTime = at
      if (was) v.play().catch(() => {})
    }
    if (v.readyState >= 1) seek()
    else v.addEventListener("loadedmetadata", seek, { once: true })
  }, [])

  // Remember the position for the flip, which unmounts this player.
  useEffect(() => {
    const v = video.current
    return () => {
      if (v) resume = { time: v.currentTime, playing: !v.paused, muted: v.muted }
    }
  }, [])

  // Play while on screen, unless someone paused it or prefers no motion.
  useEffect(() => {
    const el = box.current
    const v = video.current
    if (!el || !v) return
    if (prefersReducedMotion()) userPaused.current = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (!userPaused.current) v.play().catch(() => {})
        } else if (!v.paused) {
          v.pause()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Follow playback every frame while playing, for smooth chapter bars.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const tick = () => {
      setTime(video.current?.currentTime ?? 0)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing])

  function togglePlay() {
    const v = video.current
    if (!v) return
    if (v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    } else {
      userPaused.current = true
      v.pause()
    }
  }

  function toggleSound() {
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted && v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    }
  }

  function seek(i: number) {
    const v = video.current
    if (!v) return
    v.currentTime = CHAPTERS[i] + 0.05
    setTime(v.currentTime)
    if (!prefersReducedMotion() || !v.paused) {
      userPaused.current = false
      v.play().catch(() => {})
    }
  }

  return (
    <div
      ref={box}
      className="relative rounded-3xl border bg-muted/50 p-[clamp(14px,2.4vw,32px)]"
    >
      <div className="[perspective:2400px]">
        <div
          className={cn(
            "relative aspect-video origin-bottom overflow-hidden rounded-2xl bg-muted shadow-2xl ring-1 ring-foreground/5 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none",
            !revealed && "[transform:rotateX(10deg)_scale(.96)]"
          )}
        >
          <video
            ref={video}
            key={locale}
            muted
            loop
            playsInline
            preload="metadata"
            poster={`/landing/media/fasla-film-v5-${locale}.jpg`}
            aria-describedby="film-desc"
            onPlay={() => setPlaying(true)}
            onPause={() => {
              setPlaying(false)
              setTime(video.current?.currentTime ?? 0)
            }}
            className="absolute inset-0 size-full object-cover"
          >
            <source src={`/landing/media/fasla-film-v5-${locale}.mp4`} type="video/mp4" />
          </video>
          <p id="film-desc" className="sr-only">
            {t("desc")}
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={t(muted ? "unmute" : "mute")}
            className={cn(ctrl, "end-[62px] max-[760px]:end-12")}
          >
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={t(playing ? "pause" : "play")}
            className={cn(ctrl, "end-3.5 max-[760px]:end-2.5")}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      <div role="group" aria-label={t("chapters")} className="mt-[clamp(14px,2vw,22px)] grid grid-cols-6 gap-[clamp(8px,1.4vw,18px)]">
        {KEYS.map((key, i) => {
          const start = CHAPTERS[i]
          const end = CHAPTERS[i + 1] ?? END
          const progress = Math.max(0, Math.min(1, (time - start) / (end - start)))
          const on = time >= start && time < end
          return (
            <button
              key={key}
              type="button"
              onClick={() => seek(i)}
              aria-current={on ? "step" : undefined}
              aria-label={t(key)}
              className="group flex min-w-0 flex-col gap-2.5 rounded-md py-1 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              {/* 12px above and 8px below the bar, as the reference spaces it. */}
              <span className="mb-2 mt-3 h-[3px] overflow-hidden rounded-full bg-border">
                <i className="block h-full rounded-full bg-foreground" style={{ width: `${progress * 100}%` }} />
              </span>
              <span
                className={cn(
                  "flex min-w-0 items-baseline gap-2 text-[13.5px] transition-colors duration-300 group-hover:text-foreground",
                  on ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <b className="font-mono text-[11px] font-medium">0{i + 1}</b>
                <span className="truncate max-[760px]:hidden">{t(key)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
