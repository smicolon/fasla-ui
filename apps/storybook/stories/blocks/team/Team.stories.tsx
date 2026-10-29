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
import { emptyPropsOf, localeOf, photoPropsOf, teamArgTypes, teamViewports } from "./team-story-kit"

/**
 * Team: the 14 Types of the Figma set, one block each, from leadership grids
 * and portrait walls to directories, tables and a hiring call to action. The
 * photos are the docs site's demo set, described in the toolbar's language.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states, without photos (a neutral tile with initials stands in) and empty
 * (no people), are tagged `!dev` and `!autodocs`: hidden from both, but still
 * built, so tests and visual checks reach them by id. The tags are written
 * out on each story, as the indexer reads them statically.
 *
 * Controls: every row changes the preview. What only assistive tech reads
 * (Member Table's `linkLabel`, Department Tabs' `tabsLabel`), starting and
 * controlled state (Department Tabs' `value`) and a list of labels that Controls
 * would edit as raw text (Meta Profile Cards' `metaLabels`) are hidden per story.
 */
const meta: Meta = {
  title: "Blocks/Team",
  parameters: { layout: "fullscreen", viewport: { viewports: teamViewports } },
  tags: ["autodocs"],
}

export default meta

export const LeadershipGrid: StoryObj<typeof TeamLeadershipGrid> = {
  name: "Leadership Grid",
  argTypes: teamArgTypes(TeamLeadershipGrid, teamLeadershipGridCopy),
  render: (args, context) => <TeamLeadershipGrid locale={localeOf(context)} {...photoPropsOf("leadership-grid", context, teamLeadershipGridCopy)} {...args} />,
}

export const LeadershipGridWithoutPhotos: StoryObj<typeof TeamLeadershipGrid> = {
  name: "Leadership Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamLeadershipGrid, teamLeadershipGridCopy),
  render: (args, context) => <TeamLeadershipGrid locale={localeOf(context)} {...args} />,
}

export const LeadershipGridEmpty: StoryObj<typeof TeamLeadershipGrid> = {
  name: "Leadership Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamLeadershipGrid, teamLeadershipGridCopy),
  render: (args, context) => <TeamLeadershipGrid locale={localeOf(context)} {...emptyPropsOf(teamLeadershipGridCopy)} {...args} />,
}

export const MetaProfileCards: StoryObj<typeof TeamMetaProfileCards> = {
  name: "Meta Profile Cards",
  argTypes: teamArgTypes(TeamMetaProfileCards, teamMetaProfileCardsCopy, ["metaLabels"]),
  render: (args, context) => <TeamMetaProfileCards locale={localeOf(context)} {...photoPropsOf("meta-profile-cards", context, teamMetaProfileCardsCopy)} {...args} />,
}

export const MetaProfileCardsWithoutPhotos: StoryObj<typeof TeamMetaProfileCards> = {
  name: "Meta Profile Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMetaProfileCards, teamMetaProfileCardsCopy, ["metaLabels"]),
  render: (args, context) => <TeamMetaProfileCards locale={localeOf(context)} {...args} />,
}

export const MetaProfileCardsEmpty: StoryObj<typeof TeamMetaProfileCards> = {
  name: "Meta Profile Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMetaProfileCards, teamMetaProfileCardsCopy, ["metaLabels"]),
  render: (args, context) => <TeamMetaProfileCards locale={localeOf(context)} {...emptyPropsOf(teamMetaProfileCardsCopy)} {...args} />,
}

export const OverlayPortraitCards: StoryObj<typeof TeamOverlayPortraitCards> = {
  name: "Overlay Portrait Cards",
  argTypes: teamArgTypes(TeamOverlayPortraitCards, teamOverlayPortraitCardsCopy),
  render: (args, context) => <TeamOverlayPortraitCards locale={localeOf(context)} {...photoPropsOf("overlay-portrait-cards", context, teamOverlayPortraitCardsCopy)} {...args} />,
}

export const OverlayPortraitCardsWithoutPhotos: StoryObj<typeof TeamOverlayPortraitCards> = {
  name: "Overlay Portrait Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamOverlayPortraitCards, teamOverlayPortraitCardsCopy),
  render: (args, context) => <TeamOverlayPortraitCards locale={localeOf(context)} {...args} />,
}

export const OverlayPortraitCardsEmpty: StoryObj<typeof TeamOverlayPortraitCards> = {
  name: "Overlay Portrait Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamOverlayPortraitCards, teamOverlayPortraitCardsCopy),
  render: (args, context) => <TeamOverlayPortraitCards locale={localeOf(context)} {...emptyPropsOf(teamOverlayPortraitCardsCopy)} {...args} />,
}

export const PortraitWall: StoryObj<typeof TeamPortraitWall> = {
  name: "Portrait Wall",
  argTypes: teamArgTypes(TeamPortraitWall, teamPortraitWallCopy),
  render: (args, context) => <TeamPortraitWall locale={localeOf(context)} {...photoPropsOf("portrait-wall", context, teamPortraitWallCopy)} {...args} />,
}

export const PortraitWallWithoutPhotos: StoryObj<typeof TeamPortraitWall> = {
  name: "Portrait Wall: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamPortraitWall, teamPortraitWallCopy),
  render: (args, context) => <TeamPortraitWall locale={localeOf(context)} {...args} />,
}

export const PortraitWallEmpty: StoryObj<typeof TeamPortraitWall> = {
  name: "Portrait Wall: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamPortraitWall, teamPortraitWallCopy),
  render: (args, context) => <TeamPortraitWall locale={localeOf(context)} {...emptyPropsOf(teamPortraitWallCopy)} {...args} />,
}

export const HairlineGrid: StoryObj<typeof TeamHairlineGrid> = {
  name: "Hairline Team Grid",
  argTypes: teamArgTypes(TeamHairlineGrid, teamHairlineGridCopy),
  render: (args, context) => <TeamHairlineGrid locale={localeOf(context)} {...photoPropsOf("hairline-grid", context, teamHairlineGridCopy)} {...args} />,
}

export const HairlineGridWithoutPhotos: StoryObj<typeof TeamHairlineGrid> = {
  name: "Hairline Team Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamHairlineGrid, teamHairlineGridCopy),
  render: (args, context) => <TeamHairlineGrid locale={localeOf(context)} {...args} />,
}

export const HairlineGridEmpty: StoryObj<typeof TeamHairlineGrid> = {
  name: "Hairline Team Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamHairlineGrid, teamHairlineGridCopy),
  render: (args, context) => <TeamHairlineGrid locale={localeOf(context)} {...emptyPropsOf(teamHairlineGridCopy)} {...args} />,
}

export const GridBackdropRoster: StoryObj<typeof TeamGridBackdropRoster> = {
  name: "Grid Backdrop Roster",
  argTypes: teamArgTypes(TeamGridBackdropRoster, teamGridBackdropRosterCopy),
  render: (args, context) => <TeamGridBackdropRoster locale={localeOf(context)} {...photoPropsOf("grid-backdrop-roster", context, teamGridBackdropRosterCopy)} {...args} />,
}

export const GridBackdropRosterWithoutPhotos: StoryObj<typeof TeamGridBackdropRoster> = {
  name: "Grid Backdrop Roster: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamGridBackdropRoster, teamGridBackdropRosterCopy),
  render: (args, context) => <TeamGridBackdropRoster locale={localeOf(context)} {...args} />,
}

export const GridBackdropRosterEmpty: StoryObj<typeof TeamGridBackdropRoster> = {
  name: "Grid Backdrop Roster: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamGridBackdropRoster, teamGridBackdropRosterCopy),
  render: (args, context) => <TeamGridBackdropRoster locale={localeOf(context)} {...emptyPropsOf(teamGridBackdropRosterCopy)} {...args} />,
}

export const AnnotatedPortraitLineup: StoryObj<typeof TeamAnnotatedPortraitLineup> = {
  name: "Annotated Portrait Lineup",
  argTypes: teamArgTypes(TeamAnnotatedPortraitLineup, teamAnnotatedPortraitLineupCopy),
  render: (args, context) => <TeamAnnotatedPortraitLineup locale={localeOf(context)} {...photoPropsOf("annotated-portrait-lineup", context, teamAnnotatedPortraitLineupCopy)} {...args} />,
}

export const AnnotatedPortraitLineupWithoutPhotos: StoryObj<typeof TeamAnnotatedPortraitLineup> = {
  name: "Annotated Portrait Lineup: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamAnnotatedPortraitLineup, teamAnnotatedPortraitLineupCopy),
  render: (args, context) => <TeamAnnotatedPortraitLineup locale={localeOf(context)} {...args} />,
}

export const AnnotatedPortraitLineupEmpty: StoryObj<typeof TeamAnnotatedPortraitLineup> = {
  name: "Annotated Portrait Lineup: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamAnnotatedPortraitLineup, teamAnnotatedPortraitLineupCopy),
  render: (args, context) => <TeamAnnotatedPortraitLineup locale={localeOf(context)} {...emptyPropsOf(teamAnnotatedPortraitLineupCopy)} {...args} />,
}

export const MemberCarousel: StoryObj<typeof TeamMemberCarousel> = {
  name: "Team Carousel",
  argTypes: teamArgTypes(TeamMemberCarousel, teamMemberCarouselCopy),
  render: (args, context) => <TeamMemberCarousel locale={localeOf(context)} {...photoPropsOf("member-carousel", context, teamMemberCarouselCopy)} {...args} />,
}

export const MemberCarouselWithoutPhotos: StoryObj<typeof TeamMemberCarousel> = {
  name: "Team Carousel: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMemberCarousel, teamMemberCarouselCopy),
  render: (args, context) => <TeamMemberCarousel locale={localeOf(context)} {...args} />,
}

export const MemberCarouselEmpty: StoryObj<typeof TeamMemberCarousel> = {
  name: "Team Carousel: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMemberCarousel, teamMemberCarouselCopy),
  render: (args, context) => <TeamMemberCarousel locale={localeOf(context)} {...emptyPropsOf(teamMemberCarouselCopy)} {...args} />,
}

export const FounderSpotlight: StoryObj<typeof TeamFounderSpotlight> = {
  name: "Founder Spotlight",
  argTypes: teamArgTypes(TeamFounderSpotlight, teamFounderSpotlightCopy),
  render: (args, context) => <TeamFounderSpotlight locale={localeOf(context)} {...photoPropsOf("founder-spotlight", context, teamFounderSpotlightCopy)} {...args} />,
}

export const FounderSpotlightWithoutPhotos: StoryObj<typeof TeamFounderSpotlight> = {
  name: "Founder Spotlight: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamFounderSpotlight, teamFounderSpotlightCopy),
  render: (args, context) => <TeamFounderSpotlight locale={localeOf(context)} {...args} />,
}

export const FounderSpotlightEmpty: StoryObj<typeof TeamFounderSpotlight> = {
  name: "Founder Spotlight: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamFounderSpotlight, teamFounderSpotlightCopy),
  render: (args, context) => <TeamFounderSpotlight locale={localeOf(context)} {...emptyPropsOf(teamFounderSpotlightCopy)} feature={null} {...args} />,
}

export const CompactDirectoryRows: StoryObj<typeof TeamCompactDirectoryRows> = {
  name: "Compact Directory Rows",
  argTypes: teamArgTypes(TeamCompactDirectoryRows, teamCompactDirectoryRowsCopy),
  render: (args, context) => <TeamCompactDirectoryRows locale={localeOf(context)} {...photoPropsOf("compact-directory-rows", context, teamCompactDirectoryRowsCopy)} {...args} />,
}

export const CompactDirectoryRowsWithoutPhotos: StoryObj<typeof TeamCompactDirectoryRows> = {
  name: "Compact Directory Rows: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamCompactDirectoryRows, teamCompactDirectoryRowsCopy),
  render: (args, context) => <TeamCompactDirectoryRows locale={localeOf(context)} {...args} />,
}

export const CompactDirectoryRowsEmpty: StoryObj<typeof TeamCompactDirectoryRows> = {
  name: "Compact Directory Rows: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamCompactDirectoryRows, teamCompactDirectoryRowsCopy),
  render: (args, context) => <TeamCompactDirectoryRows locale={localeOf(context)} {...emptyPropsOf(teamCompactDirectoryRowsCopy)} {...args} />,
}

export const MemberTable: StoryObj<typeof TeamMemberTable> = {
  name: "Team Table",
  argTypes: teamArgTypes(TeamMemberTable, teamMemberTableCopy, ["linkLabel"]),
  render: (args, context) => <TeamMemberTable locale={localeOf(context)} {...photoPropsOf("member-table", context, teamMemberTableCopy)} {...args} />,
}

export const MemberTableWithoutPhotos: StoryObj<typeof TeamMemberTable> = {
  name: "Team Table: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMemberTable, teamMemberTableCopy, ["linkLabel"]),
  render: (args, context) => <TeamMemberTable locale={localeOf(context)} {...args} />,
}

export const MemberTableEmpty: StoryObj<typeof TeamMemberTable> = {
  name: "Team Table: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamMemberTable, teamMemberTableCopy, ["linkLabel"]),
  render: (args, context) => <TeamMemberTable locale={localeOf(context)} {...emptyPropsOf(teamMemberTableCopy)} {...args} />,
}

export const WeReHiringCta: StoryObj<typeof TeamWeReHiringCta> = {
  name: "We're Hiring CTA",
  argTypes: teamArgTypes(TeamWeReHiringCta, teamWeReHiringCtaCopy),
  render: (args, context) => <TeamWeReHiringCta locale={localeOf(context)} {...photoPropsOf("we-re-hiring-cta", context, teamWeReHiringCtaCopy)} {...args} />,
}

export const WeReHiringCtaWithoutPhotos: StoryObj<typeof TeamWeReHiringCta> = {
  name: "We're Hiring CTA: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamWeReHiringCta, teamWeReHiringCtaCopy),
  render: (args, context) => <TeamWeReHiringCta locale={localeOf(context)} {...args} />,
}

export const WeReHiringCtaEmpty: StoryObj<typeof TeamWeReHiringCta> = {
  name: "We're Hiring CTA: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamWeReHiringCta, teamWeReHiringCtaCopy),
  render: (args, context) => <TeamWeReHiringCta locale={localeOf(context)} {...emptyPropsOf(teamWeReHiringCtaCopy)} {...args} />,
}

export const SplitIntroMemberRail: StoryObj<typeof TeamSplitIntroMemberRail> = {
  name: "Split Intro + Member Rail",
  argTypes: teamArgTypes(TeamSplitIntroMemberRail, teamSplitIntroMemberRailCopy),
  render: (args, context) => <TeamSplitIntroMemberRail locale={localeOf(context)} {...photoPropsOf("split-intro-member-rail", context, teamSplitIntroMemberRailCopy)} {...args} />,
}

export const SplitIntroMemberRailWithoutPhotos: StoryObj<typeof TeamSplitIntroMemberRail> = {
  name: "Split Intro + Member Rail: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamSplitIntroMemberRail, teamSplitIntroMemberRailCopy),
  render: (args, context) => <TeamSplitIntroMemberRail locale={localeOf(context)} {...args} />,
}

export const SplitIntroMemberRailEmpty: StoryObj<typeof TeamSplitIntroMemberRail> = {
  name: "Split Intro + Member Rail: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamSplitIntroMemberRail, teamSplitIntroMemberRailCopy),
  render: (args, context) => <TeamSplitIntroMemberRail locale={localeOf(context)} {...emptyPropsOf(teamSplitIntroMemberRailCopy)} {...args} />,
}

export const DepartmentTabsDirectory: StoryObj<typeof TeamDepartmentTabsDirectory> = {
  name: "Department Tabs Directory",
  argTypes: teamArgTypes(TeamDepartmentTabsDirectory, teamDepartmentTabsDirectoryCopy, ["tabsLabel", "value"]),
  render: (args, context) => <TeamDepartmentTabsDirectory locale={localeOf(context)} {...photoPropsOf("department-tabs-directory", context, teamDepartmentTabsDirectoryCopy)} {...args} />,
}

export const DepartmentTabsDirectoryWithoutPhotos: StoryObj<typeof TeamDepartmentTabsDirectory> = {
  name: "Department Tabs Directory: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamDepartmentTabsDirectory, teamDepartmentTabsDirectoryCopy, ["tabsLabel", "value"]),
  render: (args, context) => <TeamDepartmentTabsDirectory locale={localeOf(context)} {...args} />,
}

export const DepartmentTabsDirectoryEmpty: StoryObj<typeof TeamDepartmentTabsDirectory> = {
  name: "Department Tabs Directory: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: teamArgTypes(TeamDepartmentTabsDirectory, teamDepartmentTabsDirectoryCopy, ["tabsLabel", "value"]),
  render: (args, context) => <TeamDepartmentTabsDirectory locale={localeOf(context)} {...emptyPropsOf(teamDepartmentTabsDirectoryCopy)} {...args} />,
}
