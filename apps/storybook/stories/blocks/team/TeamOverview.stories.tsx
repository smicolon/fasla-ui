import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { teamViewports } from "./team-story-kit"

/**
 * Team, all at once: one Type at a time in the six frames Figma has for it,
 * Desktop, Tablet and Mobile in left-to-right English and right-to-left
 * Arabic, each in light and in dark. Pick the Type with the control.
 *
 * Each frame is the Type's own story in an iframe of the frame's real width,
 * shrunk to fit the page. The blocks size themselves by the browser's width
 * (the section's padding follows the window, the layout follows the section),
 * so only a frame with its own window shows its own breakpoint.
 */

/** The Figma Type names and the id of each one's story. */
const TYPES: Record<string, string> = {
  "Leadership Grid": "leadership-grid",
  "Meta Profile Cards": "meta-profile-cards",
  "Overlay Portrait Cards": "overlay-portrait-cards",
  "Portrait Wall": "portrait-wall",
  "Hairline Team Grid": "hairline-grid",
  "Grid Backdrop Roster": "grid-backdrop-roster",
  "Annotated Portrait Lineup": "annotated-portrait-lineup",
  "Team Carousel": "member-carousel",
  "Founder Spotlight": "founder-spotlight",
  "Compact Directory Rows": "compact-directory-rows",
  "Team Table": "member-table",
  "We're Hiring CTA": "we-re-hiring-cta",
  "Split Intro + Member Rail": "split-intro-member-rail",
  "Department Tabs Directory": "department-tabs-directory",
}

const FRAMES = [
  { label: "Desktop", width: 1440, scale: 0.33 },
  { label: "Tablet", width: 768, scale: 0.62 },
  { label: "Mobile", width: 360, scale: 1 },
] as const

function Frame({ slug, width, scale, dir, theme }: { slug: string; width: number; scale: number; dir: "ltr" | "rtl"; theme: "light" | "dark" }) {
  const ref = React.useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = React.useState(480)
  // The frame is as tall as its story, read once it has loaded (same origin) and again as photos and fonts settle.
  const fit = React.useCallback(() => {
    const doc = ref.current?.contentDocument
    if (doc?.documentElement) setHeight(Math.max(120, doc.documentElement.scrollHeight))
  }, [])
  React.useEffect(() => {
    const id = window.setInterval(fit, 700)
    return () => window.clearInterval(id)
  }, [fit])
  return (
    <div className="flex items-start justify-center">
      <div className="overflow-hidden rounded-md border border-border" style={{ width: width * scale, height: height * scale }}>
        <iframe
          ref={ref}
          title={`${slug} ${width} ${dir} ${theme}`}
          src={`iframe.html?id=blocks-team--${slug}&viewMode=story&globals=direction:${dir};theme:${theme}`}
          onLoad={fit}
          style={{ width, height, border: 0, transform: `scale(${scale})`, transformOrigin: "top left" }}
        />
      </div>
    </div>
  )
}

function Theme({ slug, dark }: { slug: string; dark: boolean }) {
  return (
    <div className={dark ? "dark" : undefined}>
      <div className="flex flex-col gap-6 bg-background p-6 text-foreground">
        <p className="text-sm font-medium text-muted-foreground">{dark ? "Dark" : "Light"}</p>
        {FRAMES.map((frame) => (
          <div key={frame.label} className="flex flex-col gap-3">
            <p className="text-center text-xs text-muted-foreground">{frame.label} ({frame.width})</p>
            <div className="grid grid-cols-2 items-start gap-6">
              <Frame slug={slug} width={frame.width} scale={frame.scale} dir="ltr" theme={dark ? "dark" : "light"} />
              <Frame slug={slug} width={frame.width} scale={frame.scale} dir="rtl" theme={dark ? "dark" : "light"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface OverviewArgs {
  type: string
}

const meta: Meta<OverviewArgs> = {
  title: "Blocks/Team Overview",
  parameters: { layout: "fullscreen", viewport: { viewports: teamViewports } },
  // Hidden from the sidebar and the Docs pages, as the other block families have no overview.
  // To show it again, change this line to `tags: ["autodocs"]`.
  tags: ["!dev", "!autodocs"],
  args: { type: Object.keys(TYPES)[0] },
  argTypes: {
    type: { control: "select", options: Object.keys(TYPES), description: "The Type shown in every frame." },
  },
}

export default meta

export const AllFrames: StoryObj<OverviewArgs> = {
  name: "All frames",
  render: ({ type }) => {
    const slug = TYPES[type] ?? Object.values(TYPES)[0]
    return (
      <div className="flex flex-col">
        <Theme slug={slug} dark={false} />
        <Theme slug={slug} dark />
      </div>
    )
  },
}
