import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { TeamLeadershipGrid, teamLeadershipGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-leadership-grid/TeamLeadershipGrid"
import { TeamMetaProfileCards, teamMetaProfileCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-meta-profile-cards/TeamMetaProfileCards"
import { TeamOverlayPortraitCards, teamOverlayPortraitCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-overlay-portrait-cards/TeamOverlayPortraitCards"
import { TeamPortraitWall, teamPortraitWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-portrait-wall/TeamPortraitWall"
import { TeamHairlineGrid, teamHairlineGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-hairline-grid/TeamHairlineGrid"
import { TeamGridBackdropRoster, teamGridBackdropRosterCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-grid-backdrop-roster/TeamGridBackdropRoster"
import { TeamAnnotatedPortraitLineup, teamAnnotatedPortraitLineupCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-annotated-portrait-lineup/TeamAnnotatedPortraitLineup"
import { TeamMemberCarousel, teamMemberCarouselCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-member-carousel/TeamMemberCarousel"
import { TeamFounderSpotlight, teamFounderSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-founder-spotlight/TeamFounderSpotlight"
import { TeamCompactDirectoryRows, teamCompactDirectoryRowsCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-compact-directory-rows/TeamCompactDirectoryRows"
import { TeamMemberTable, teamMemberTableCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-member-table/TeamMemberTable"
import { TeamWeReHiringCta, teamWeReHiringCtaCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-we-re-hiring-cta/TeamWeReHiringCta"
import { TeamSplitIntroMemberRail, teamSplitIntroMemberRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-split-intro-member-rail/TeamSplitIntroMemberRail"
import { TeamDepartmentTabsDirectory, teamDepartmentTabsDirectoryCopy } from "../../../../../packages/fasla-ui/registry/blocks/team-department-tabs-directory/TeamDepartmentTabsDirectory"
import { teamPhotoProps } from "../../../../docs/components/blocks/team-photos"
import { teamViewports } from "./team-story-kit"

/**
 * Team, all at once: one Type at a time in the six frames Figma has for it,
 * Desktop, Tablet and Mobile in left-to-right English and right-to-left
 * Arabic, each in light and in dark. Pick the Type with the control. Each frame
 * is the block at its real width, shrunk to fit the page, so its breakpoint is
 * the one Figma's frame has.
 */
type Entry = { Block: React.ComponentType<any>; copy: { en: object; ar: object }; slug: string }

const TYPES: Record<string, Entry> = {
  "Leadership Grid": { Block: TeamLeadershipGrid, copy: teamLeadershipGridCopy, slug: "leadership-grid" },
  "Meta Profile Cards": { Block: TeamMetaProfileCards, copy: teamMetaProfileCardsCopy, slug: "meta-profile-cards" },
  "Overlay Portrait Cards": { Block: TeamOverlayPortraitCards, copy: teamOverlayPortraitCardsCopy, slug: "overlay-portrait-cards" },
  "Portrait Wall": { Block: TeamPortraitWall, copy: teamPortraitWallCopy, slug: "portrait-wall" },
  "Hairline Team Grid": { Block: TeamHairlineGrid, copy: teamHairlineGridCopy, slug: "hairline-grid" },
  "Grid Backdrop Roster": { Block: TeamGridBackdropRoster, copy: teamGridBackdropRosterCopy, slug: "grid-backdrop-roster" },
  "Annotated Portrait Lineup": { Block: TeamAnnotatedPortraitLineup, copy: teamAnnotatedPortraitLineupCopy, slug: "annotated-portrait-lineup" },
  "Team Carousel": { Block: TeamMemberCarousel, copy: teamMemberCarouselCopy, slug: "member-carousel" },
  "Founder Spotlight": { Block: TeamFounderSpotlight, copy: teamFounderSpotlightCopy, slug: "founder-spotlight" },
  "Compact Directory Rows": { Block: TeamCompactDirectoryRows, copy: teamCompactDirectoryRowsCopy, slug: "compact-directory-rows" },
  "Team Table": { Block: TeamMemberTable, copy: teamMemberTableCopy, slug: "member-table" },
  "We're Hiring CTA": { Block: TeamWeReHiringCta, copy: teamWeReHiringCtaCopy, slug: "we-re-hiring-cta" },
  "Split Intro + Member Rail": { Block: TeamSplitIntroMemberRail, copy: teamSplitIntroMemberRailCopy, slug: "split-intro-member-rail" },
  "Department Tabs Directory": { Block: TeamDepartmentTabsDirectory, copy: teamDepartmentTabsDirectoryCopy, slug: "department-tabs-directory" },
}

const FRAMES = [
  { label: "Desktop", width: 1440, scale: 0.33 },
  { label: "Tablet", width: 768, scale: 0.62 },
  { label: "Mobile", width: 360, scale: 1 },
] as const

function Frame({ entry, width, scale, dir }: { entry: Entry; width: number; scale: number; dir: "ltr" | "rtl" }) {
  const locale = dir === "rtl" ? "ar" : "en"
  const { Block, copy, slug } = entry
  return (
    <div className="flex items-start justify-center">
      <div dir={dir} className="overflow-hidden rounded-md border border-border bg-background text-foreground" style={{ width: width * scale }}>
        <div style={{ width, zoom: scale }}>
          <Block locale={locale} {...teamPhotoProps(slug, locale, copy)} />
        </div>
      </div>
    </div>
  )
}

function Theme({ entry, dark }: { entry: Entry; dark: boolean }) {
  return (
    <div className={dark ? "dark" : undefined}>
      <div className="flex flex-col gap-6 bg-background p-6 text-foreground">
        <p className="text-sm font-medium text-muted-foreground">{dark ? "Dark" : "Light"}</p>
        {FRAMES.map((frame) => (
          <div key={frame.label} className="flex flex-col gap-3">
            <p className="text-center text-xs text-muted-foreground">{frame.label} ({frame.width})</p>
            <div className="grid grid-cols-2 items-start gap-6">
              <Frame entry={entry} width={frame.width} scale={frame.scale} dir="ltr" />
              <Frame entry={entry} width={frame.width} scale={frame.scale} dir="rtl" />
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
  tags: ["autodocs"],
  args: { type: Object.keys(TYPES)[0] },
  argTypes: {
    type: { control: "select", options: Object.keys(TYPES), description: "The Type shown in every frame." },
  },
}

export default meta

export const AllFrames: StoryObj<OverviewArgs> = {
  name: "All frames",
  render: ({ type }) => {
    const entry = TYPES[type] ?? Object.values(TYPES)[0]
    return (
      <div className="flex flex-col">
        <Theme entry={entry} dark={false} />
        <Theme entry={entry} dark />
      </div>
    )
  },
}
