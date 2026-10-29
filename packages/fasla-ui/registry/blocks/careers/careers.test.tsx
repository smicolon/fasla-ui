import { describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"
import { CareersRoleAction, Figures, arabicCount, distinctValues, filterRoles, type CareersRole } from "./careers"
import { CareersOpenRolesHairlineList, careersOpenRolesHairlineListCopy } from "../careers-open-roles-hairline-list/CareersOpenRolesHairlineList"
import { CareersRoleCardsGrid, careersRoleCardsGridCopy } from "../careers-role-cards-grid/CareersRoleCardsGrid"
import { CareersRolesByDepartment, careersRolesByDepartmentCopy } from "../careers-roles-by-department/CareersRolesByDepartment"
import { CareersOpenVacanciesTable, careersOpenVacanciesTableCopy } from "../careers-open-vacancies-table/CareersOpenVacanciesTable"
import {
  CareersRolesListAccordionExpanded,
  careersRolesListAccordionExpandedCopy,
} from "../careers-roles-list-accordion-expanded/CareersRolesListAccordionExpanded"
import { CareersAboutCardRoleList, careersAboutCardRoleListCopy } from "../careers-about-card-role-list/CareersAboutCardRoleList"
import { CareersFeaturedRoleSpotlight, careersFeaturedRoleSpotlightCopy } from "../careers-featured-role-spotlight/CareersFeaturedRoleSpotlight"
import { CareersPerksBenefits, careersPerksBenefitsCopy } from "../careers-perks-benefits/CareersPerksBenefits"
import { CareersRoleDetailPanel, careersRoleDetailPanelCopy } from "../careers-role-detail-panel/CareersRoleDetailPanel"
import { CareersRoleDetailPage, careersRoleDetailPageCopy } from "../careers-role-detail-page/CareersRoleDetailPage"
import { Sheet, SheetContent, SheetTitle } from "../../ui/sheet/sheet"
import { CareersNoOpenRolesEmptyState, careersNoOpenRolesEmptyStateCopy } from "../careers-no-open-roles-empty-state/CareersNoOpenRolesEmptyState"

const ROLES: CareersRole[] = [
  { id: "a", title: "Senior Product Designer", department: "Design", summary: "Own the system", location: "Remote", commitment: "Full-time" },
  { id: "b", title: "Motion Designer", department: "Design", summary: "Define how it moves", location: "Dubai", commitment: "Contract" },
  { id: "c", title: "Platform Engineer", department: "Engineering", summary: "Run the pipeline", location: "Remote", commitment: "Full-time" },
]

describe("filterRoles", () => {
  it("narrows by team, place and type, and treats an empty or `all` value as no filter", () => {
    expect(filterRoles(ROLES).map((role) => role.id)).toEqual(["a", "b", "c"])
    expect(filterRoles(ROLES, { department: "all" }).map((role) => role.id)).toEqual(["a", "b", "c"])
    expect(filterRoles(ROLES, { department: "Design" }).map((role) => role.id)).toEqual(["a", "b"])
    expect(filterRoles(ROLES, { department: "Design", commitment: "Contract" }).map((role) => role.id)).toEqual(["b"])
    expect(filterRoles(ROLES, { location: "Remote" }).map((role) => role.id)).toEqual(["a", "c"])
  })

  it("searches the title, the summary and the team without regard to case", () => {
    expect(filterRoles(ROLES, { query: "PIPELINE" }).map((role) => role.id)).toEqual(["c"])
    expect(filterRoles(ROLES, { query: "  motion " }).map((role) => role.id)).toEqual(["b"])
    expect(filterRoles(ROLES, { query: "engineering" }).map((role) => role.id)).toEqual(["c"])
    expect(filterRoles(ROLES, { query: "nothing here" })).toEqual([])
  })
})

describe("distinctValues", () => {
  it("lists each value once, in order of first appearance, and skips roles without one", () => {
    expect(distinctValues(ROLES, "department")).toEqual(["Design", "Engineering"])
    expect(distinctValues([...ROLES, { id: "d", title: "No team" }], "department")).toEqual(["Design", "Engineering"])
  })
})

describe("arabicCount", () => {
  const forms = { zero: "لا وظائف", one: "وظيفة", two: "وظيفتان", few: "{n} وظائف", many: "{n} وظيفة" }
  it("picks the form that agrees with the number and writes it in Western digits", () => {
    expect([0, 1, 2, 3, 10, 11, 25].map((n) => arabicCount(n, forms))).toEqual(["لا وظائف", "وظيفة", "وظيفتان", "3 وظائف", "10 وظائف", "11 وظيفة", "25 وظيفة"])
  })
})

describe("Figures", () => {
  it("keeps a pay range in one left-to-right run and each figure in an Arabic sentence in its own", () => {
    const range = render(<Figures>{"$95K–$120K"}</Figures>)
    expect([...range.container.querySelectorAll("bdi")].map((bdi) => bdi.textContent)).toEqual(["$95K–$120K"])
    const sentence = render(<Figures>{"من 95 إلى 120 ألف دولار"}</Figures>)
    expect([...sentence.container.querySelectorAll("bdi")].map((bdi) => bdi.textContent)).toEqual(["95", "120"])
  })
})

describe("CareersRoleAction", () => {
  const first = ROLES[0] as CareersRole
  it("is a link when the role has an href, and a button that calls onSelect when it has none", () => {
    const onSelect = vi.fn()
    const { rerender } = render(<CareersRoleAction role={{ ...first, href: "/careers/a" }} label="View role" onSelect={onSelect} />)
    expect(screen.getByRole("link", { name: "View role: Senior Product Designer" }).getAttribute("href")).toBe("/careers/a")
    rerender(<CareersRoleAction role={first} label="View role" onSelect={onSelect} />)
    fireEvent.click(screen.getByRole("button", { name: "View role: Senior Product Designer" }))
    expect(onSelect).toHaveBeenCalledWith(first)
  })
})

describe("Open Roles — Hairline List", () => {
  it("filters the list with the team chips, and the count follows", () => {
    render(<CareersOpenRolesHairlineList />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6)
    expect(screen.getByText("6 open roles")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Design" }))
    expect(screen.getByRole("button", { name: "Design" }).getAttribute("aria-pressed")).toBe("true")
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
    expect(screen.getByText("2 open roles")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "All roles" }))
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6)
  })

  it("shows the total it is given while no chip is pressed, and says so when a chip leaves nothing", () => {
    const { rerender } = render(<CareersOpenRolesHairlineList total={24} />)
    expect(screen.getByText("24 open roles")).toBeTruthy()
    rerender(<CareersOpenRolesHairlineList roles={[]} />)
    expect(screen.getByText("No open roles match this team.")).toBeTruthy()
  })

  it("writes the Arabic count in the form that agrees with it", () => {
    render(<CareersOpenRolesHairlineList locale="ar" />)
    expect(screen.getByText("6 وظائف متاحة")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "التصميم" }))
    expect(screen.getByText("وظيفتان متاحتان")).toBeTruthy()
  })
})

describe("Role Cards Grid", () => {
  it("searches the cards, and the count follows", () => {
    render(<CareersRoleCardsGrid />)
    expect(screen.getAllByRole("article")).toHaveLength(6)
    expect(screen.getByText("Showing 6 of 6 roles")).toBeTruthy()
    fireEvent.change(screen.getByRole("searchbox", { name: "Search roles or keywords" }), { target: { value: "motion" } })
    expect(screen.getAllByRole("article")).toHaveLength(1)
    expect(screen.getByText("Showing 1 of 6 roles")).toBeTruthy()
    fireEvent.change(screen.getByRole("searchbox", { name: "Search roles or keywords" }), { target: { value: "zzz" } })
    expect(screen.getByText(/No roles match your search/)).toBeTruthy()
  })

  it("saves a role with its bookmark and reports the saved ids", () => {
    const onSavedChange = vi.fn()
    render(<CareersRoleCardsGrid onSavedChange={onSavedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Save role: Motion Designer" }))
    expect(onSavedChange).toHaveBeenCalledWith(["motion-designer"])
    expect(screen.getByRole("button", { name: "Saved: Motion Designer" }).getAttribute("aria-pressed")).toBe("true")
  })
})

describe("Roles by Department", () => {
  it("counts each team's roles from its own list", () => {
    render(<CareersRolesByDepartment />)
    expect(screen.getAllByText("3 open roles")).toHaveLength(2)
    expect(screen.getAllByText("2 open roles")).toHaveLength(2)
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(["Design", "Engineering", "Product", "Go-to-market"])
  })

  it("uses the Arabic dual for two roles", () => {
    render(<CareersRolesByDepartment locale="ar" />)
    expect(screen.getAllByText("وظيفتان متاحتان")).toHaveLength(2)
    expect(screen.getAllByText("3 وظائف متاحة")).toHaveLength(2)
  })
})

describe("Open Vacancies Table", () => {
  it("pages the rows, six to a page, and the count follows the page", () => {
    render(<CareersOpenVacanciesTable />)
    expect(screen.getByText("10 vacancies")).toBeTruthy()
    expect(screen.getByText("Showing 6 of 10 vacancies")).toBeTruthy()
    expect(screen.getAllByRole("row")).toHaveLength(7)
    fireEvent.click(screen.getByRole("link", { name: "Page 2" }))
    expect(screen.getByText("Showing 4 of 10 vacancies")).toBeTruthy()
    expect(screen.getAllByRole("row")).toHaveLength(5)
    expect(screen.getByRole("link", { name: "Page 2" }).getAttribute("aria-current")).toBe("page")
  })

  it("opens a row to its description, one at a time", () => {
    render(<CareersOpenVacanciesTable />)
    const first = screen.getByRole("button", { name: "Expand: Senior Product Designer" })
    expect(first.getAttribute("aria-expanded")).toBe("false")
    fireEvent.click(first)
    expect(screen.getByRole("button", { name: "Collapse: Senior Product Designer" }).getAttribute("aria-expanded")).toBe("true")
    expect(screen.getByRole("button", { name: "View role: Senior Product Designer" })).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Expand: Motion Designer" }))
    expect(screen.getByRole("button", { name: "Expand: Senior Product Designer" }).getAttribute("aria-expanded")).toBe("false")
  })
})

describe("Roles List — Accordion Expanded", () => {
  it("opens the Design Systems Engineer row to start, and opens one row at a time", () => {
    render(<CareersRolesListAccordionExpanded />)
    const trigger = (name: string) => screen.getByRole("button", { name: new RegExp(`^${name}`) })
    expect(trigger("Design Systems Engineer").getAttribute("aria-expanded")).toBe("true")
    expect(screen.getByText("About the role")).toBeTruthy()
    fireEvent.click(trigger("Motion Designer"))
    expect(trigger("Motion Designer").getAttribute("aria-expanded")).toBe("true")
    expect(trigger("Design Systems Engineer").getAttribute("aria-expanded")).toBe("false")
  })

  it("lets the page open a row, and report which one the reader opened", () => {
    const onExpandedChange = vi.fn()
    render(<CareersRolesListAccordionExpanded defaultExpanded="motion-designer" onExpandedChange={onExpandedChange} />)
    expect(screen.getByRole("button", { name: /^Motion Designer/ }).getAttribute("aria-expanded")).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: /^Developer Advocate/ }))
    expect(onExpandedChange).toHaveBeenCalledWith("developer-advocate")
  })
})

describe("About Card + Role List", () => {
  it("calls onPlay from the play button, and lists every role with its button", () => {
    const onPlay = vi.fn()
    render(<CareersAboutCardRoleList onPlay={onPlay} />)
    fireEvent.click(screen.getByRole("button", { name: "Play the team video" }))
    expect(onPlay).toHaveBeenCalledTimes(1)
    expect(screen.getAllByRole("button", { name: /^Apply Now:/ })).toHaveLength(4)
  })

  it("draws the photo it is given, and none without one", () => {
    const { container, rerender } = render(<CareersAboutCardRoleList />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<CareersAboutCardRoleList photo={{ src: "/team.jpg", alt: "The team at a table" }} />)
    expect(within(container).getByAltText("The team at a table").getAttribute("src")).toBe("/team.jpg")
  })
})

describe("Featured Role Spotlight", () => {
  it("lists the role's four facts and the team's other roles", () => {
    render(<CareersFeaturedRoleSpotlight />)
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain("Senior Product Designer")
    expect(screen.getAllByRole("term").map((term) => term.textContent)).toEqual(["Salary", "Location", "Commitment", "Team"])
    expect(screen.getByRole("button", { name: /Motion Designer/ })).toBeTruthy()
  })

  it("copies the link where there is no share sheet, says so, and reports the press", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const onShare = vi.fn()
    render(<CareersFeaturedRoleSpotlight shareUrl="https://example.com/roles/1" onShare={onShare} />)
    fireEvent.click(screen.getByRole("button", { name: "Share role" }))
    expect(await screen.findByText("Link copied")).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith("https://example.com/roles/1")
    expect(onShare).toHaveBeenCalledTimes(1)
  })

  it("sends a card without an href to onRoleSelect", () => {
    const onRoleSelect = vi.fn()
    render(<CareersFeaturedRoleSpotlight onRoleSelect={onRoleSelect} />)
    fireEvent.click(screen.getByRole("button", { name: /Design Ops Lead/ }))
    expect(onRoleSelect.mock.calls[0]?.[0].id).toBe("design-ops-lead")
  })
})

describe("Perks & Benefits", () => {
  it("lists the six perks, and the footer button is a link only when it has somewhere to go", () => {
    const onSeeRoles = vi.fn()
    const { rerender } = render(<CareersPerksBenefits onSeeRoles={onSeeRoles} />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6)
    fireEvent.click(screen.getByRole("button", { name: "See open roles" }))
    expect(onSeeRoles).toHaveBeenCalledTimes(1)
    rerender(<CareersPerksBenefits seeRolesHref="/careers" />)
    expect(screen.getByRole("link", { name: "See open roles" }).getAttribute("href")).toBe("/careers")
  })
})

describe("No Open Roles — Empty State", () => {
  const type = (value: string) => fireEvent.change(screen.getByRole("textbox", { name: "Email address" }), { target: { value } })

  it("refuses a bad address without calling onSubmit, and clears the message when typing resumes", () => {
    const onSubmit = vi.fn()
    render(<CareersNoOpenRolesEmptyState onSubmit={onSubmit} />)
    type("not-an-email")
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }))
    expect(screen.getByText("Enter a valid email address.")).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
    type("a@b.co")
    expect(screen.queryByText("Enter a valid email address.")).toBeNull()
  })

  it("sends the address with the topics chosen, then says thank you", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onInterestsChange = vi.fn()
    render(<CareersNoOpenRolesEmptyState onSubmit={onSubmit} onInterestsChange={onInterestsChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Design" }))
    fireEvent.click(screen.getByRole("button", { name: "Product" }))
    fireEvent.click(screen.getByRole("button", { name: "Design" }))
    expect(onInterestsChange.mock.calls.map((call) => call[0])).toEqual([["Design"], ["Design", "Product"], ["Product"]])
    type("  yasmin@example.com ")
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }))
    expect(await screen.findByText("Thank you. We will write before the roles go public.")).toBeTruthy()
    expect(onSubmit).toHaveBeenCalledWith("yasmin@example.com", ["Product"])
    expect(screen.queryByRole("textbox", { name: "Email address" })).toBeNull()
  })

  it("says so when the send fails, and keeps the form for another try", async () => {
    render(<CareersNoOpenRolesEmptyState onSubmit={() => Promise.reject(new Error("offline"))} />)
    type("a@b.co")
    fireEvent.click(screen.getByRole("button", { name: "Notify me" }))
    expect(await screen.findByText("We could not send that. Please try again.")).toBeTruthy()
    expect(screen.getByRole("textbox", { name: "Email address" })).toBeTruthy()
  })
})

describe("Role Detail Panel", () => {
  it("draws the four sections, a close button only when asked, and Apply as a link when the posting has an href", () => {
    const onClose = vi.fn()
    const { rerender } = render(<CareersRoleDetailPanel />)
    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(["About the role", "What you'll do", "What we're looking for", "How we hire"])
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
    rerender(<CareersRoleDetailPanel onClose={onClose} />)
    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    expect(onClose).toHaveBeenCalledTimes(1)
    rerender(<CareersRoleDetailPanel posting={{ ...careersRoleDetailPanelCopy.en.posting, href: "/careers/spd" }} />)
    expect(screen.getByRole("link", { name: "Apply now: Senior Product Designer" }).getAttribute("href")).toBe("/careers/spd")
  })

  it("reports Save and shows the saved state", () => {
    const onSavedChange = vi.fn()
    render(<CareersRoleDetailPanel onSavedChange={onSavedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Save: Senior Product Designer" }))
    expect(onSavedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("button", { name: "Saved: Senior Product Designer" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("sits inside Sheet as its content, with no overlay logic of its own", () => {
    render(
      <Sheet defaultOpen>
        <SheetContent side="bottom">
          <SheetTitle className="sr-only">Senior Product Designer</SheetTitle>
          <CareersRoleDetailPanel />
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByRole("dialog")).toBeTruthy()
    expect(within(screen.getByRole("dialog")).getByText("About the role")).toBeTruthy()
  })
})

describe("Role Detail Page", () => {
  it("has one h1, the breadcrumb ends on the page, and the posting's two paragraphs and six offers show", () => {
    render(<CareersRoleDetailPage />)
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1)
    expect(screen.getByText("Careers").closest("a")?.getAttribute("href")).toBe("#")
    expect(document.querySelector("[aria-current=page]")?.textContent).toBe("Senior Product Designer")
    expect(screen.getByText(/This is a builder's role/)).toBeTruthy()
    expect(screen.getByRole("heading", { name: "What we offer" }).parentElement?.querySelectorAll("li")).toHaveLength(6)
  })

  it("keeps the two Save buttons in step and reports each press", () => {
    const onSavedChange = vi.fn()
    render(<CareersRoleDetailPage onSavedChange={onSavedChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Save role" }))
    expect(onSavedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole("button", { name: "Saved for later" }).getAttribute("aria-pressed")).toBe("true")
  })

  it("copies the link, says so, and reports the channel; the email button is a mailto link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
    const onShare = vi.fn()
    render(<CareersRoleDetailPage shareUrl="https://example.com/r/1" onShare={onShare} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }))
    expect(await screen.findByText("Link copied")).toBeTruthy()
    expect(writeText).toHaveBeenCalledWith("https://example.com/r/1")
    expect(onShare.mock.calls[0]?.[1]).toBe("link")
    expect(screen.getByRole("link", { name: "Share by email" }).getAttribute("href")).toContain("mailto:?subject=Senior%20Product%20Designer&body=https%3A%2F%2Fexample.com%2Fr%2F1")
  })

  it("does not pin or scroll-drive anything", () => {
    const { container } = render(<CareersRoleDetailPage />)
    expect(container.innerHTML).not.toMatch(/sticky|fixed|scroll-spy/)
  })
})

describe("Featured Role Spotlight pay tile", () => {
  it("keeps the default pay on one line: 14 characters in English, 19 in Arabic", () => {
    expect(String(careersFeaturedRoleSpotlightCopy.en.featured.pay).length).toBeLessThanOrEqual(14)
    expect(String(careersFeaturedRoleSpotlightCopy.ar.featured.pay).length).toBeLessThanOrEqual(19)
  })
})

describe("default copy stays inside the documented limits", () => {
  const titleLimit = 27
  const lists: [string, CareersRole[]][] = [
    ["en hairline", careersOpenRolesHairlineListCopy.en.roles],
    ["ar hairline", careersOpenRolesHairlineListCopy.ar.roles],
    ["en cards", careersRoleCardsGridCopy.en.roles],
    ["ar cards", careersRoleCardsGridCopy.ar.roles],
    ["en department", careersRolesByDepartmentCopy.en.departments.flatMap((group) => group.roles)],
    ["ar department", careersRolesByDepartmentCopy.ar.departments.flatMap((group) => group.roles)],
    ["en table", careersOpenVacanciesTableCopy.en.roles],
    ["ar table", careersOpenVacanciesTableCopy.ar.roles],
    ["en accordion", careersRolesListAccordionExpandedCopy.en.roles],
    ["ar accordion", careersRolesListAccordionExpandedCopy.ar.roles],
    ["en spotlight", [careersFeaturedRoleSpotlightCopy.en.featured, ...careersFeaturedRoleSpotlightCopy.en.others]],
    ["ar spotlight", [careersFeaturedRoleSpotlightCopy.ar.featured, ...careersFeaturedRoleSpotlightCopy.ar.others]],
    ["en panel", [careersRoleDetailPanelCopy.en.posting]],
    ["ar panel", [careersRoleDetailPanelCopy.ar.posting]],
    ["en page", [careersRoleDetailPageCopy.en.posting]],
    ["ar page", [careersRoleDetailPageCopy.ar.posting]],
    ["en about card", careersAboutCardRoleListCopy.en.roles],
    ["ar about card", careersAboutCardRoleListCopy.ar.roles],
  ]

  it.each(lists)("%s: a role's title is %i characters or fewer", (_name, roles) => {
    for (const role of roles) expect(String(role.title).length).toBeLessThanOrEqual(titleLimit)
  })

  it("writes Arabic without a Latin letter, a middle dot or a dash", () => {
    // Ids are keys, not copy; every other string is read by a person.
    const strings = (value: unknown, key = ""): string[] =>
      typeof value === "string"
        ? key === "id" || key === "contactEmail"
          ? []
          : [value]
        : Array.isArray(value)
          ? value.flatMap((item) => strings(item))
          : value && typeof value === "object"
            ? Object.entries(value).flatMap(([name, item]) => strings(item, name))
            : []
    const arabic = strings([
      careersOpenRolesHairlineListCopy.ar,
      careersRoleCardsGridCopy.ar,
      careersRolesByDepartmentCopy.ar,
      careersOpenVacanciesTableCopy.ar,
      careersRolesListAccordionExpandedCopy.ar,
      careersAboutCardRoleListCopy.ar,
      careersFeaturedRoleSpotlightCopy.ar,
      careersPerksBenefitsCopy.ar,
      careersNoOpenRolesEmptyStateCopy.ar,
      careersRoleDetailPanelCopy.ar,
      careersRoleDetailPageCopy.ar,
    ]).join("\n")
    expect(arabic).not.toMatch(/[A-Za-z]/)
    // An en dash is allowed only inside a number range, as Figma writes the Spotlight tile's pay.
    expect(arabic).not.toMatch(/[·—]|(?<!\d)–|–(?!\d)/)
  })
})
