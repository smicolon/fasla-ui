import { cn } from "@/lib/utils"

/**
 * The Fasla mark: two brackets and the comma on brand red. Brand artwork is
 * drawn once and never mirrors, in either direction.
 */
export function FaslaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" aria-hidden="true" className={cn("shrink-0", className)}>
      <rect width="88" height="88" className="fill-fasla-red" />
      <g className="fill-fasla-white">
        <path d="M30 23H20V65H30V73H12V15H30V23Z" />
        <path d="M76 73H58V65H68V23H58V15H76V73Z" />
        <path d="M51 58H37V30L51 44V58Z" />
      </g>
    </svg>
  )
}

/** The comma alone, from the mark: the hinge at the top of the hero. */
export function FaslaComma({ className }: { className?: string }) {
  return (
    <svg viewBox="37 30 14 28" aria-hidden="true" className={className}>
      <path d="M51 58H37V30L51 44V58Z" className="fill-fasla-red" />
    </svg>
  )
}
