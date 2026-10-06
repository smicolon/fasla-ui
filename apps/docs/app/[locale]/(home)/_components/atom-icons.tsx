/**
 * Lucide-style glyphs for the atoms table (24 grid, 1.75 stroke), one per
 * atom, drawn for the reference. An atom Figma adds later gets the generic
 * square until it has its own. Inner markup only; AtomIcon draws the frame.
 */
const GLYPHS: Record<string, React.ReactNode> = {
  "Button": (
    <>
      <rect x="3" y="7" width="18" height="10" rx="5" /><path d="M8 12h8" />
    </>
  ),
  "Icon Button": (
    <>
      <rect x="5" y="5" width="14" height="14" rx="4" /><path d="M12 9v6M9 12h6" />
    </>
  ),
  "Radio": (
    <>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
    </>
  ),
  "Tooltip": (
    <>
      <path d="M4 5h16v10h-6l-2 3-2-3H4z" />
    </>
  ),
  "Alert": (
    <>
      <path d="M12 3 2.5 20h19z" /><path d="M12 10v4M12 17h.01" />
    </>
  ),
  "Breadcrumb": (
    <>
      <path d="M3 12h3M10 12h4M18 12h3" /><path d="m7 9 2 3-2 3M15 9l2 3-2 3" />
    </>
  ),
  "Pagination": (
    <>
      <path d="m7 9-3 3 3 3M17 9l3 3-3 3" /><path d="M10 12h.01M12 12h.01M14 12h.01" />
    </>
  ),
  "Badge": (
    <>
      <rect x="3" y="8" width="18" height="8" rx="4" /><circle cx="7.5" cy="12" r="1" fill="currentColor" />
    </>
  ),
  "Avatar": (
    <>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="10" r="3" /><path d="M6.5 18.5a6 6 0 0 1 11 0" />
    </>
  ),
  "Status Indicator": (
    <>
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="8" opacity=".4" />
    </>
  ),
  "Rating": (
    <>
      <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1 6.1L12 17.2 6.5 20l1-6.1L3 9.5l6.2-.9z" />
    </>
  ),
  "Skeleton": (
    <>
      <rect x="3" y="5" width="6" height="6" rx="3" /><path d="M12 7h9M12 10h6M3 15h18M3 19h12" />
    </>
  ),
  "Separator": (
    <>
      <path d="M3 12h18" /><path d="M8 7h8M8 17h8" opacity=".4" />
    </>
  ),
  "Checkbox": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" /><path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  "Switch": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="5" /><circle cx="16.5" cy="12" r="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  "Navbar": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M6 6.5h3" />
    </>
  ),
  "Content Carousel": (
    <>
      <rect x="3" y="5" width="18" height="11" rx="2" /><path d="M7 19h10M9 9h6M9 12h4" />
    </>
  ),
  "Carousel": (
    <>
      <rect x="6" y="5" width="12" height="12" rx="2" /><path d="M3 7v8M21 7v8" /><path d="M10 20.5h.01M12 20.5h.01M14 20.5h.01" />
    </>
  ),
  "Modal": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" opacity=".4" /><rect x="6" y="7" width="12" height="10" rx="2" />
    </>
  ),
  "Input": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="M6.5 10v4" />
    </>
  ),
  "Alert Dialog": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M12 8v4M12 15h.01" />
    </>
  ),
  "Command Menu": (
    <>
      <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" />
    </>
  ),
  "Table": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M3 15h18M9 10v10" />
    </>
  ),
  "Drawer": (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M15 3v18" />
    </>
  ),
  "Textarea": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h10M7 17h5" /><path d="m17 19 2-2" />
    </>
  ),
  "Progress": (
    <>
      <rect x="2.5" y="9" width="19" height="6" rx="3" /><path d="M5.5 12h8" strokeWidth="3" />
    </>
  ),
  "Sidebar Item": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M5.5 8h1.5M5.5 11h1.5" />
    </>
  ),
  "Slider": (
    <>
      <path d="M3 12h18" /><circle cx="9" cy="12" r="3" className="fill-background" />
    </>
  ),
  "OTP Input": (
    <>
      <rect x="2.5" y="8" width="5" height="8" rx="1.5" /><rect x="9.5" y="8" width="5" height="8" rx="1.5" /><rect x="16.5" y="8" width="5" height="8" rx="1.5" />
    </>
  ),
  "Calendar": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  "Date Picker": (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><rect x="12" y="13" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  "Select": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="m14.5 11 2 2 2-2" />
    </>
  ),
  "Input Number": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="M15 10.5 17 9l2 1.5M15 13.5l2 1.5 2-1.5M6 12h4" />
    </>
  ),
  "Sonner": (
    <>
      <rect x="4" y="13" width="16" height="7" rx="2" /><rect x="6" y="9" width="12" height="3" rx="1.5" opacity=".5" /><rect x="8" y="5.5" width="8" height="2.5" rx="1.25" opacity=".3" />
    </>
  ),
  "Accordion": (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="m15 6.5 1.5 1.5 1.5-1.5" />
    </>
  ),
  "Popover": (
    <>
      <rect x="4" y="3" width="16" height="11" rx="2" /><path d="m10 14 2 3 2-3" /><circle cx="12" cy="20.5" r="1" fill="currentColor" />
    </>
  ),
  "Timeline": (
    <>
      <path d="M6 3v18" /><circle cx="6" cy="7" r="2" className="fill-background" /><circle cx="6" cy="16" r="2" className="fill-background" /><path d="M11 7h9M11 16h6" />
    </>
  ),
  "Dropdown Menu": (
    <>
      <rect x="3" y="3" width="18" height="6" rx="2" /><rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 15h7M7 18h5" />
    </>
  ),
  "Context Menu": (
    <>
      <path d="M4 4l6 15 2-6 6-2z" /><rect x="14" y="14" width="7" height="7" rx="1.5" opacity=".5" />
    </>
  ),
  "Toggle": (
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" /><path d="M9 9h4a2.5 2.5 0 0 1 0 5H9z" />
    </>
  ),
  "Toggle Group": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" /><path d="M9 7v10M15 7v10" /><rect x="9" y="7" width="6" height="10" fill="currentColor" opacity=".25" stroke="none" />
    </>
  ),
  "Menubar": (
    <>
      <rect x="2.5" y="5" width="19" height="5" rx="1.5" /><path d="M6 7.5h2M11 7.5h2M16 7.5h2" /><rect x="9.5" y="12" width="9" height="8" rx="1.5" opacity=".5" />
    </>
  ),
  "Combobox": (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" /><circle cx="8" cy="12" r="2.2" /><path d="m9.7 13.7 1.3 1.3M14.5 11l2 2 2-2" />
    </>
  ),
}

const FALLBACK = <rect x="4" y="4" width="16" height="16" rx="3" />

/** The glyph for one Figma atom, by its display name; unknown names get a plain square. */
export function AtomIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {GLYPHS[name] ?? FALLBACK}
    </svg>
  )
}
