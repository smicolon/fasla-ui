"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"
import { StatusIndicator, type StatusIndicatorProps } from "../status-indicator/status-indicator"

/**
 * Built against the Figma `Avatar` set (323:321): Direction × Radius × Style ×
 * Border × Size, 72 variants, plus the `Status Indicator` boolean. Every colour
 * and radius below is the token the set binds.
 *
 * `variant` is Figma's Style. `image`, the default, shows the photo when `src`
 * loads, and while it loads or if it fails falls back to initials from `name`,
 * then to the user icon when there is no name either — so the avatar is never
 * empty. `initials` and `icon` show that content whatever else is passed.
 *
 * Direction is not a prop either. The dot sits on the logical end corner, so
 * `dir="rtl"` moves it to the bottom-left with no RTL-specific class, and the
 * type ramp re-leads the initials to Cairo's line on its own.
 */
const avatarVariants = cva(
  "relative flex size-full items-center justify-center overflow-hidden text-foreground",
  {
    variants: {
      size: {
        // Figma's initials: Base 16px at 32, XS 12px at 24, XXS 10px at 12.
        "32": "text-base",
        "24": "text-xs",
        "12": "text-xxs",
      },
      radius: {
        standard: "",
        rounded: "rounded-full",
      },
      // Figma's stroke is `ring`, INSIDE the edge, and draws over the photo.
      // An inset box-shadow on the frame itself would paint under the <img>,
      // so the ring lives on a pseudo-element laid on top.
      border: {
        true: "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-inset after:ring-ring after:content-['']",
        false: "",
      },
    },
    compoundVariants: [
      // Figma `border radius/md` at 32 and 24, `border radius/xs` at 12. No
      // Tailwind class is either value in both apps.
      { radius: "standard", size: "32", class: "rounded-[var(--radius-md)]" },
      { radius: "standard", size: "24", class: "rounded-[var(--radius-md)]" },
      { radius: "standard", size: "12", class: "rounded-[var(--radius-xs)]" },
      { border: true, size: "32", class: "after:ring-2" },
      { border: true, size: "24", class: "after:ring-1" },
      { border: true, size: "12", class: "after:ring-1" },
    ],
    defaultVariants: {
      size: "32",
      radius: "standard",
      border: false,
    },
  }
)

const ROOT_SIZE = { "32": "size-8", "24": "size-6", "12": "size-3" } as const

/**
 * The dot, 8px at 32 and 24 and 4px at 12. On Standard 32 and 24 it hangs 2px
 * past the end and bottom edges; on Rounded, and at 12, it sits flush in the
 * corner of the bounding box.
 */
function dotPosition(size: Size, radius: Radius) {
  return radius === "standard" && size !== "12" ? "-bottom-0.5 -end-0.5" : "bottom-0 end-0"
}

/** Lucide `user-round` at Figma's 1.5 stroke, 75% of the avatar. */
function UserRoundIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3/4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  )
}

const ARABIC = /[؀-ۿ]/
/** U+200C keeps two Arabic initials in their separate forms rather than joined. */
const ZWNJ = "‌"

/**
 * Up to two initials — the first letters of the first and last words — or one
 * at size 12, as Figma shows. Latin is upper-cased; Arabic has no case.
 */
function initialsFrom(name: string, count: 1 | 2) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ""
  const first = Array.from(words[0]!)[0]!
  const last = words.length > 1 ? Array.from(words[words.length - 1]!)[0]! : ""
  const letters = count === 1 || !last ? [first] : [first, last]
  const joined = letters.join(letters.some((l) => ARABIC.test(l)) ? ZWNJ : "")
  return joined.toLocaleUpperCase()
}

type Size = "32" | "24" | "12"
type Radius = "standard" | "rounded"
type Status = NonNullable<StatusIndicatorProps["status"]>
type Variant = "image" | "initials" | "icon"
type ImgAttributes = React.ImgHTMLAttributes<HTMLImageElement>

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /**
   * Figma `Style` — named `variant`, as Badge names Figma's Type, so React's
   * inline `style` stays available. `image` shows the photo, falling back to
   * initials, then the icon. `initials` always shows the initials (the icon if
   * there is no name); `icon` always shows the icon.
   */
  variant?: Variant
  /** Figma `Size`, in px. */
  size?: Size
  /** Figma `Radius`: `standard` is `border radius/md` (`xs` at 12), `rounded` a circle. */
  radius?: Radius
  /** Figma `Border`: a `ring` stroke inside the edge. */
  border?: boolean
  /** The photo, for `variant="image"`. While it loads, or if it fails, the avatar shows its fallback. */
  src?: string
  /** Passed to the `<img>`: responsive sources for sharper photos on dense screens. */
  srcSet?: ImgAttributes["srcSet"]
  /** Passed to the `<img>`, alongside `srcSet`. */
  sizes?: ImgAttributes["sizes"]
  /** Passed to the `<img>`. `"lazy"` defers photos below the fold, as in a long list. */
  loading?: ImgAttributes["loading"]
  /** Passed to the `<img>`. */
  decoding?: ImgAttributes["decoding"]
  /** Passed to the `<img>`, for photos served from another origin. */
  crossOrigin?: ImgAttributes["crossOrigin"]
  /** Passed to the `<img>`. */
  referrerPolicy?: ImgAttributes["referrerPolicy"]
  /**
   * The person's name. It is the photo's `alt`, the source of the initials —
   * the first letters of the first and last words, one letter at size 12 — and
   * the accessible name of every variant. Pass `""` when a label beside the
   * avatar already names the person.
   */
  name?: string
  /**
   * Shows the status dot. Off unless set: a dot on every avatar would claim
   * presence nobody measured. Its name — "Online" / "متصل" and so on — follows
   * the page language.
   */
  status?: Status
  /** Overrides the dot's accessible name. Pass `""` to silence it, as `name=""` silences the avatar. */
  statusLabel?: string
}

type ImageState = "loading" | "loaded" | "error"
type Photo = { src: string; srcSet?: string }
/** Identifies a photo by its sources; "" when there is none. */
const photoKey = (photo?: Photo | null) => (photo ? `${photo.src}\n${photo.srcSet ?? ""}` : "")

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      className,
      variant = "image",
      size = "32",
      radius = "standard",
      border = false,
      src,
      srcSet,
      sizes,
      loading,
      decoding,
      crossOrigin,
      referrerPolicy,
      name,
      status,
      statusLabel,
      ...props
    },
    ref
  ) => {
    const requested = variant === "image" && src ? { src, srcSet } : undefined
    const requestedKey = photoKey(requested)
    // The loading state belongs to one source. Any change of `src` or `srcSet`
    // starts again from "loading" in the same render — the fallback shows until
    // the new photo loads, and a source that failed before is tried afresh.
    // shadcn's and Radix's Avatar behave the same way.
    const [state, setState] = React.useState<{ key: string; image: ImageState }>({
      key: requestedKey,
      image: "loading",
    })
    const image = state.key === requestedKey ? state.image : "loading"
    const imgRef = React.useRef<HTMLImageElement>(null)

    React.useEffect(() => {
      // On mount and on every source change, read the <img> itself. A photo
      // served from cache can finish before hydration attaches `onLoad` and
      // `onError`, so its events never reach us: complete with a real size is
      // loaded, complete but empty is a failure. Otherwise this source starts
      // from "loading", so no earlier result — above all an earlier failure of
      // the same source — carries over; if its own event already landed, keep it.
      const img = imgRef.current
      if (img?.complete) {
        setState({ key: requestedKey, image: img.naturalWidth > 0 ? "loaded" : "error" })
        return
      }
      setState((prev) => (prev.key === requestedKey ? prev : { key: requestedKey, image: "loading" }))
    }, [requestedKey])

    const showImage = requested !== undefined && image !== "error"
    const loaded = showImage && image === "loaded"

    const letters = variant !== "icon" && name ? initialsFrom(name, size === "12" ? 1 : 2) : ""

    return (
      <span
        ref={ref}
        className={cn("relative inline-flex shrink-0 align-middle", ROOT_SIZE[size], className)}
        {...props}
      >
        <span
          className={cn(
            avatarVariants({ size, radius, border }),
            // Figma's Image variants have no fill; the fallback sits on `muted`.
            !loaded && "bg-muted"
          )}
        >
          {!loaded &&
            (letters ? (
              <span aria-hidden="true" className="select-none">
                {letters}
              </span>
            ) : (
              <UserRoundIcon />
            ))}
          {/* The fallback's name, when there is no photo to carry it. */}
          {!loaded && name && <span className="sr-only">{name}</span>}
          {showImage && requested && (
            <img
              // A new element per source: a fresh request, never the last photo.
              key={requestedKey}
              ref={imgRef}
              src={requested.src}
              srcSet={requested.srcSet}
              sizes={sizes}
              loading={loading}
              decoding={decoding}
              crossOrigin={crossOrigin}
              referrerPolicy={referrerPolicy}
              // Named only once it shows; while it loads, the fallback carries the name.
              alt={loaded ? (name ?? "") : ""}
              aria-hidden={loaded ? undefined : true}
              onLoad={() => setState({ key: requestedKey, image: "loaded" })}
              onError={() => setState({ key: requestedKey, image: "error" })}
              className={cn("absolute inset-0 size-full object-cover", !loaded && "opacity-0")}
            />
          )}
        </span>
        {status && (
          <StatusIndicator
            status={status}
            size={size === "12" ? "4" : "8"}
            label={statusLabel}
            className={cn("absolute", dotPosition(size, radius))}
          />
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
