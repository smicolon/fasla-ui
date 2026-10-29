import type { Meta, StoryObj } from "@storybook/react"
import { CareersOpenRolesHairlineList, careersOpenRolesHairlineListCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-open-roles-hairline-list/CareersOpenRolesHairlineList"
import { CareersRoleCardsGrid, careersRoleCardsGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-role-cards-grid/CareersRoleCardsGrid"
import { CareersRolesByDepartment, careersRolesByDepartmentCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-roles-by-department/CareersRolesByDepartment"
import { CareersOpenVacanciesTable, careersOpenVacanciesTableCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-open-vacancies-table/CareersOpenVacanciesTable"
import {
  CareersRolesListAccordionExpanded,
  careersRolesListAccordionExpandedCopy,
} from "../../../../../packages/fasla-ui/registry/blocks/careers-roles-list-accordion-expanded/CareersRolesListAccordionExpanded"
import { CareersAboutCardRoleList, careersAboutCardRoleListCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-about-card-role-list/CareersAboutCardRoleList"
import { CareersFeaturedRoleSpotlight, careersFeaturedRoleSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-featured-role-spotlight/CareersFeaturedRoleSpotlight"
import { CareersPerksBenefits, careersPerksBenefitsCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-perks-benefits/CareersPerksBenefits"
import { CareersNoOpenRolesEmptyState, careersNoOpenRolesEmptyStateCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-no-open-roles-empty-state/CareersNoOpenRolesEmptyState"
import { CareersRoleDetailPanel, careersRoleDetailPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-role-detail-panel/CareersRoleDetailPanel"
import { CareersRoleDetailPage, careersRoleDetailPageCopy } from "../../../../../packages/fasla-ui/registry/blocks/careers-role-detail-page/CareersRoleDetailPage"
import { Button } from "../../../../../packages/fasla-ui/registry/ui/button/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../../../packages/fasla-ui/registry/ui/sheet/sheet"
import { careersArgTypes, careersViewports, localeOf, photoPropsOf } from "./careers-story-kit"

/**
 * Careers: the Types of the Figma set, one block each. The lists a reader
 * browses roles in come first: a hairline list with team chips, a grid of
 * cards with search and filters, roles grouped by team, a table with a pager,
 * an accordion that opens each role, and an About us card beside a role list.
 * Then the highlights: one featured role, the perks, and the empty state with
 * its email form. The chips, search, filters, pager, rows, Share role and the
 * email form all work. Viewport, direction and
 * theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states (the empty list) are tagged `!dev` and `!autodocs`: hidden from both,
 * but still built, so tests and visual checks reach them by id. The tags are
 * written out on each story, as the indexer reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Careers",
  parameters: { layout: "fullscreen", viewport: { viewports: careersViewports } },
  tags: ["autodocs"],
}

export default meta

export const OpenRolesHairlineList: StoryObj<typeof CareersOpenRolesHairlineList> = {
  name: "Open Roles — Hairline List",
  argTypes: careersArgTypes(CareersOpenRolesHairlineList, careersOpenRolesHairlineListCopy, ["filterLabel"]),
  render: (args, context) => <CareersOpenRolesHairlineList locale={localeOf(context)} {...args} />,
}

export const OpenRolesHairlineListEmpty: StoryObj<typeof CareersOpenRolesHairlineList> = {
  name: "Open Roles — Hairline List: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersOpenRolesHairlineList, careersOpenRolesHairlineListCopy, ["filterLabel"], ["empty"]),
  render: (args, context) => <CareersOpenRolesHairlineList locale={localeOf(context)} roles={[]} {...args} />,
}

export const RoleCardsGrid: StoryObj<typeof CareersRoleCardsGrid> = {
  name: "Role Cards Grid",
  argTypes: careersArgTypes(CareersRoleCardsGrid, careersRoleCardsGridCopy, ["filterLabels", "saveRole", "savedRole"]),
  render: (args, context) => <CareersRoleCardsGrid locale={localeOf(context)} {...args} />,
}

export const RoleCardsGridEmpty: StoryObj<typeof CareersRoleCardsGrid> = {
  name: "Role Cards Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersRoleCardsGrid, careersRoleCardsGridCopy, ["filterLabels", "saveRole", "savedRole"], ["empty"]),
  render: (args, context) => <CareersRoleCardsGrid locale={localeOf(context)} roles={[]} {...args} />,
}

export const RolesByDepartment: StoryObj<typeof CareersRolesByDepartment> = {
  name: "Roles by Department",
  argTypes: careersArgTypes(CareersRolesByDepartment, careersRolesByDepartmentCopy),
  render: (args, context) => <CareersRolesByDepartment locale={localeOf(context)} {...args} />,
}

export const OpenVacanciesTable: StoryObj<typeof CareersOpenVacanciesTable> = {
  name: "Open Vacancies Table",
  argTypes: careersArgTypes(CareersOpenVacanciesTable, careersOpenVacanciesTableCopy, ["columns", "tableLabel", "paginationLabel", "expand", "collapse"]),
  render: (args, context) => <CareersOpenVacanciesTable locale={localeOf(context)} {...args} />,
}

export const RolesListAccordionExpanded: StoryObj<typeof CareersRolesListAccordionExpanded> = {
  name: "Roles List — Accordion Expanded",
  argTypes: careersArgTypes(CareersRolesListAccordionExpanded, careersRolesListAccordionExpandedCopy, ["columns", "expanded"]),
  render: (args, context) => <CareersRolesListAccordionExpanded locale={localeOf(context)} {...args} />,
}

export const AboutCardRoleList: StoryObj<typeof CareersAboutCardRoleList> = {
  name: "About Card + Role List",
  argTypes: careersArgTypes(CareersAboutCardRoleList, careersAboutCardRoleListCopy, ["playLabel"]),
  render: (args, context) => <CareersAboutCardRoleList locale={localeOf(context)} {...photoPropsOf("about-card-role-list", context)} {...args} />,
}

export const FeaturedRoleSpotlight: StoryObj<typeof CareersFeaturedRoleSpotlight> = {
  name: "Featured Role Spotlight",
  argTypes: careersArgTypes(CareersFeaturedRoleSpotlight, careersFeaturedRoleSpotlightCopy, ["factLabels", "shareUrl", "copied"]),
  render: (args, context) => <CareersFeaturedRoleSpotlight locale={localeOf(context)} {...photoPropsOf("featured-role-spotlight", context)} {...args} />,
}

export const FeaturedRoleSpotlightWithoutPhoto: StoryObj<typeof CareersFeaturedRoleSpotlight> = {
  name: "Featured Role Spotlight: Without Photo",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersFeaturedRoleSpotlight, careersFeaturedRoleSpotlightCopy, ["factLabels", "shareUrl", "copied"]),
  render: (args, context) => <CareersFeaturedRoleSpotlight locale={localeOf(context)} {...args} />,
}

export const PerksBenefits: StoryObj<typeof CareersPerksBenefits> = {
  name: "Perks & Benefits",
  argTypes: careersArgTypes(CareersPerksBenefits, careersPerksBenefitsCopy),
  render: (args, context) => <CareersPerksBenefits locale={localeOf(context)} {...photoPropsOf("perks-benefits", context)} {...args} />,
}

export const PerksBenefitsWithoutPhoto: StoryObj<typeof CareersPerksBenefits> = {
  name: "Perks & Benefits: Without Photo",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersPerksBenefits, careersPerksBenefitsCopy),
  render: (args, context) => <CareersPerksBenefits locale={localeOf(context)} {...args} />,
}

export const NoOpenRolesEmptyState: StoryObj<typeof CareersNoOpenRolesEmptyState> = {
  name: "No Open Roles — Empty State",
  argTypes: careersArgTypes(CareersNoOpenRolesEmptyState, careersNoOpenRolesEmptyStateCopy, ["emailLabel"]),
  render: (args, context) => <CareersNoOpenRolesEmptyState locale={localeOf(context)} {...photoPropsOf("no-open-roles-empty-state", context)} {...args} />,
}

export const NoOpenRolesEmptyStateWithoutPhoto: StoryObj<typeof CareersNoOpenRolesEmptyState> = {
  name: "No Open Roles — Empty State: Without Photo",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersNoOpenRolesEmptyState, careersNoOpenRolesEmptyStateCopy, ["emailLabel"]),
  render: (args, context) => <CareersNoOpenRolesEmptyState locale={localeOf(context)} {...args} />,
}

export const NoOpenRolesEmptyStateSendFailed: StoryObj<typeof CareersNoOpenRolesEmptyState> = {
  name: "No Open Roles — Empty State: Send Failed",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersNoOpenRolesEmptyState, careersNoOpenRolesEmptyStateCopy, ["emailLabel"], ["sendError"]),
  render: (args, context) => (
    <CareersNoOpenRolesEmptyState locale={localeOf(context)} {...photoPropsOf("no-open-roles-empty-state", context)} {...args} onSubmit={() => Promise.reject(new Error("offline"))} />
  ),
}

export const RoleDetailPanel: StoryObj<typeof CareersRoleDetailPanel> = {
  name: "Role Detail Panel",
  argTypes: careersArgTypes(CareersRoleDetailPanel, careersRoleDetailPanelCopy, ["closeLabel", "savedLabel"]),
  parameters: { layout: "padded" },
  render: (args, context) => (
    <div className="mx-auto h-[52rem] w-[35rem] max-w-full overflow-hidden border border-border shadow-lg">
      <CareersRoleDetailPanel locale={localeOf(context)} {...args} />
    </div>
  ),
}

/**
 * The panel inside Sheet, as it is used: from the side on Desktop and Tablet,
 * from the bottom on Mobile. Sheet draws the overlay, the close button and the
 * slide; the block is only what is inside. Pick the side in Controls.
 */
export const RoleDetailPanelInSheet: StoryObj<Parameters<typeof CareersRoleDetailPanel>[0] & { side: "end" | "start" | "bottom" }> = {
  name: "Role Detail Panel: In Sheet",
  args: { side: "end" },
  argTypes: {
    ...careersArgTypes(CareersRoleDetailPanel, careersRoleDetailPanelCopy, ["closeLabel", "savedLabel"]),
    side: { control: "select", options: ["end", "start", "bottom"], description: "The edge Sheet slides in from: the side on Desktop and Tablet, the bottom on Mobile." },
  },
  parameters: { layout: "centered" },
  render: ({ side, ...args }, context) => {
    const locale = localeOf(context)
    const posting = careersRoleDetailPanelCopy[locale].posting
    return (
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>{locale === "ar" ? "افتح الوظيفة" : "Open role"}</SheetTrigger>
        <SheetContent side={side} className={side === "bottom" ? "h-[calc(100%-3rem)] p-0" : "w-[35rem] p-0"}>
          <SheetTitle className="sr-only">{posting.title}</SheetTitle>
          <CareersRoleDetailPanel locale={locale} {...args} />
        </SheetContent>
      </Sheet>
    )
  },
}

export const RoleDetailPage: StoryObj<typeof CareersRoleDetailPage> = {
  name: "Role Detail Page",
  argTypes: careersArgTypes(CareersRoleDetailPage, careersRoleDetailPageCopy, ["breadcrumbLabel", "factLabels", "shareLabels", "shareUrl", "copied", "savedRole", "savedForLater", "contactEmail"]),
  render: (args, context) => <CareersRoleDetailPage locale={localeOf(context)} {...photoPropsOf("role-detail-page", context)} {...args} />,
}

export const RoleDetailPageWithoutPhoto: StoryObj<typeof CareersRoleDetailPage> = {
  name: "Role Detail Page: Without Photo",
  tags: ["!dev", "!autodocs"],
  argTypes: careersArgTypes(CareersRoleDetailPage, careersRoleDetailPageCopy, ["breadcrumbLabel", "factLabels", "shareLabels", "shareUrl", "copied", "savedRole", "savedForLater", "contactEmail"]),
  render: (args, context) => <CareersRoleDetailPage locale={localeOf(context)} {...args} />,
}
