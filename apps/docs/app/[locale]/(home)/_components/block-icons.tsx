import { cn } from "@/lib/utils"

/**
 * The block previews' icon set (24 grid, 2px stroke), drawn for the
 * reference's blocks. Decorative: every preview is a picture.
 */
const PATHS = {
  area: <><path d="M4 4h6M4 4v6M20 20h-6M20 20v-6M4 4l16 16" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  bag: <><path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2" /></>,
  bath: <><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" /></>,
  bed: <><path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.6" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></>,
  cal: <><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19" /></>,
  check: <><path d="M5 12l5 5 9-10" /></>,
  chevL: <><path d="M15 6l-6 6 6 6" /></>,
  chevR: <><path d="M9 6l6 6-6 6" /></>,
  cup: <><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3M12 2.5v3" /></>,
  desk: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  dots: <><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></>,
  down: <><path d="M12 5v14M6 13l6 6 6-6" /></>,
  grid: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  heart: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></>,
  home: <><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h10" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  minus: <><path d="M5 12h14" /></>,
  mob: <><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 18h2" /></>,
  phone: <><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M11 18h2" /></>,
  pin: <><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  play: <><path d="M7 4v16l13-8z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  send: <><path d="M4 12 20 4l-6 16-3-7z" /></>,
  shield: <><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  spark: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></>,
  swap: <><path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4" /></>,
  tab: <><rect x="5" y="3" width="14" height="18" rx="2.5" /><path d="M11 18h2" /></>,
  tag: <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
  up: <><path d="M12 19V5M6 11l6-6 6 6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
} as const

export type BlockIconName = keyof typeof PATHS

/** `flip` mirrors an icon that points along the reading direction, in RTL only. */
export function BI({ n, className, flip = false }: { n: BlockIconName; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-[18px] shrink-0", flip && "rtl:-scale-x-100", className)}
    >
      {PATHS[n]}
    </svg>
  )
}
