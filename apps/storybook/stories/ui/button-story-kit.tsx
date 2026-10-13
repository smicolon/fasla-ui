import * as React from "react"
import {
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  HeartIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"
import { Button, type ButtonProps } from "../../../../packages/fasla-ui/registry/ui/button"

/**
 * Shared by the Button and Icon Button stories. Not a story file, so Storybook
 * doesn't list it: the stories glob only matches `*.stories.tsx`.
 */

export const TONES = ["primary", "secondary", "destructive"] as const
export const STATES = ["Enabled", "Hover", "Clicked", "Focus", "Disabled"] as const

/** Figma's five Types, each reached through one shadcn variant plus `tone`. */
export const TYPES = [
  { name: "Solid", variant: "default" },
  { name: "Soft", variant: "soft" },
  { name: "Outline", variant: "outline" },
  { name: "Ghost", variant: "ghost" },
  { name: "Link", variant: "link" },
] as const

/** Icon Button has every Type but Link. */
export const ICON_TYPES = TYPES.slice(0, 4)

/**
 * The icon picker's choices: common lucide glyphs, each with the action it
 * names in both languages, so an icon-only button's fallback name matches the
 * icon. `flips` marks the ones that point a way, which mirror in right-to-left.
 */
export const ICONS: Record<string, { Icon: LucideIcon; label: { en: string; ar: string }; flips?: boolean }> = {
  plus: { Icon: PlusIcon, label: { en: "Add", ar: "إضافة" } },
  "arrow-right": { Icon: ArrowRightIcon, label: { en: "Next", ar: "التالي" }, flips: true },
  download: { Icon: DownloadIcon, label: { en: "Download", ar: "تنزيل" } },
  upload: { Icon: UploadIcon, label: { en: "Upload", ar: "رفع ملف" } },
  copy: { Icon: CopyIcon, label: { en: "Copy", ar: "نسخ" } },
  pencil: { Icon: PencilIcon, label: { en: "Edit", ar: "تعديل" } },
  "trash-2": { Icon: Trash2Icon, label: { en: "Delete", ar: "حذف" } },
  search: { Icon: SearchIcon, label: { en: "Search", ar: "بحث" } },
  settings: { Icon: SettingsIcon, label: { en: "Settings", ar: "الإعدادات" } },
  heart: { Icon: HeartIcon, label: { en: "Like", ar: "إعجاب" } },
  x: { Icon: XIcon, label: { en: "Close", ar: "إغلاق" } },
}
export type IconName = keyof typeof ICONS
export const ICON_NAMES = Object.keys(ICONS) as IconName[]

/** The action an icon names, in the story's direction. */
export const iconLabel = (name: IconName, direction?: string) =>
  (ICONS[name] ?? ICONS.plus!).label[direction === "rtl" ? "ar" : "en"]

/** Figma's icons are 1.5px strokes at 16px; the button sizes them. */
export const StoryIcon = ({ name }: { name: IconName }) => {
  const entry = ICONS[name] ?? ICONS.plus!
  const { Icon, flips } = entry
  return <Icon aria-hidden="true" strokeWidth={1.5} className={flips ? "rtl:-scale-x-100" : undefined} />
}

/** A row or column label: always Latin, always on the line of what it names. */
export const Head = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span dir="ltr" className={["w-fit font-sans text-xs text-muted-foreground", className].filter(Boolean).join(" ")}>
    {children}
  </span>
)

const cell = (prefix: string, type: string, tone: string, state: string) =>
  `${prefix}-${type}-${tone}-${state}`.toLowerCase()

/** Pseudo-state targets for one grid: every Hover, Clicked and Focus cell's button. */
export const pseudoFor = (prefix: string, types: readonly { name: string }[]) => {
  const ids = (state: string) =>
    types.flatMap((t) => TONES.map((tone) => `#${cell(prefix, t.name, tone, state)} button`))
  return { hover: ids("Hover"), active: ids("Clicked"), focusVisible: ids("Focus") }
}

/**
 * Figma's Type × Style × State grid: every row a Type in one tone, every
 * column a state. Hover, Clicked and Focus are the real `:hover`, `:active`
 * and `:focus-visible` rules, forced by `storybook-addon-pseudo-states`.
 */
export const StateGrid = ({
  prefix,
  types,
  size,
  children,
}: {
  prefix: string
  types: readonly { name: string; variant: ButtonProps["variant"] }[]
  size?: ButtonProps["size"]
  children: React.ReactNode
}) => (
  <div className="grid grid-cols-[repeat(6,max-content)] items-center gap-x-5 gap-y-3">
    <span />
    {STATES.map((s) => (
      <Head key={s}>{s}</Head>
    ))}
    {types.map((t) =>
      TONES.map((tone) => (
        <React.Fragment key={`${t.name}-${tone}`}>
          <Head>
            {t.name} / {tone}
          </Head>
          {STATES.map((state) => (
            <span key={state} id={cell(prefix, t.name, tone, state)} className="inline-flex">
              <Button variant={t.variant} tone={tone} size={size} disabled={state === "Disabled"}>
                {children}
              </Button>
            </span>
          ))}
        </React.Fragment>
      ))
    )}
  </div>
)

/** Hides a prop from the Controls panel and the props table. */
export const hidden = { table: { disable: true } } as const

/** Every Button prop a page doesn't drive, so its table lists only the ones it does. */
export const HIDE_REST = {
  asChild: hidden,
  children: hidden,
  className: hidden,
  onClick: hidden,
  onClickCapture: hidden,
} as const
