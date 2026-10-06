import { cn } from "@/lib/utils"

/**
 * Lucide-style glyphs drawn inline (24 grid, round caps), the way the rest of
 * the docs site draws its icons. All are decorative: the control that holds one
 * carries the accessible name.
 *
 * `Directional` icons point along the reading direction and mirror in RTL;
 * the rest never mirror.
 */
type IconProps = { className?: string; strokeWidth?: number }

/** The shared 24-grid frame: stroke, round caps, decorative. */
function Icon({
  className,
  strokeWidth = 1.75,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      {children}
    </svg>
  )
}

/** Points right whatever the page direction; for specimens that set their own. */
export const ArrowRightIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)

/** Points right whatever the page direction. */
export const ChevronRightIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
)

/** Points toward the end of the line: right in English, left in Arabic. */
export const ArrowEndIcon = ({ className, ...props }: IconProps) => (
  <ArrowRightIcon className={cn("rtl:-scale-x-100", className)} {...props} />
)

/** A chevron toward the end of the line: right in English, left in Arabic. */
export const ChevronEndIcon = ({ className, ...props }: IconProps) => (
  <ChevronRightIcon className={cn("rtl:-scale-x-100", className)} {...props} />
)

/** Two opposing arrows: the "mirrors" tag. */
export const MirrorIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4" />
  </Icon>
)

/** A padlock: the "stays" tag. */
export const LockIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Icon>
)

/** A page with a folded corner. */
export const FileIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Icon>
)

/** Dark theme. */
export const MoonIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
)

/** Light theme. */
export const SunIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Icon>
)

/** Sanad sidebar: Overview. */
export const OverviewIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Icon>
)

/** Sanad sidebar: Transactions. */
export const TransactionsIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 4v16M3 8l4-4 4 4M17 20V4M21 16l-4 4-4-4" />
  </Icon>
)

/** Sanad sidebar: Cards. */
export const CardIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </Icon>
)

/** Sanad sidebar: Savings. */
export const TargetIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Icon>
)

/** Sanad sidebar: Settings. */
export const SettingsIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Icon>
)

/** Export. */
export const DownloadIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </Icon>
)

/** Sanad stat card: Balance. */
export const WalletIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v4h-4a2 2 0 0 0 0 4h4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" />
  </Icon>
)

/** Sanad stat card: Monthly spend. */
export const BagIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  </Icon>
)

/** Film control: play (filled). */
export const PlayIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
  </svg>
)

/** Film control: pause (filled). */
export const PauseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)

/** Film control: muted. */
export const SoundOffIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M11 5 6 9H3v6h3l5 4z" />
    <path d="m22 9-6 6M16 9l6 6" />
  </Icon>
)

/** Film control: sound on. */
export const SoundOnIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M11 5 6 9H3v6h3l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  </Icon>
)

/** The status dot a Badge carries as its icon. */
export const DotIcon = () => (
  <span aria-hidden="true" className="block size-1.5 rounded-full bg-current" />
)

/** Storybook link. */
export const BookIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2" />
    <path d="M8 7h7M8 11h5" />
  </Icon>
)

/** Leaves the site: up and away, the same in both directions. */
export const ExternalIcon = (props: IconProps) => (
  <Icon strokeWidth={2} {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
)

/** Four diamonds: a Figma component set. */
export const ComponentIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2.5 15 5.5 12 8.5 9 5.5ZM12 15.5l3 3-3 3-3-3ZM5.5 9l3 3-3 3-3-3ZM18.5 9l3 3-3 3-3-3Z" />
  </Icon>
)
