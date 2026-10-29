import { describe, it, expect, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { Isolated, SocialProofStars, toColumns } from "./social-proof"
import { SocialProofClassicTrioGrid } from "../social-proof-classic-trio-grid/SocialProofClassicTrioGrid"
import { SocialProofVerticalColumnWall } from "../social-proof-vertical-column-wall/SocialProofVerticalColumnWall"
import { SocialProofTweetWall } from "../social-proof-tweet-wall/SocialProofTweetWall"
import { SocialProofAppReviewRow, socialProofAppReviewRowCopy } from "../social-proof-app-review-row/SocialProofAppReviewRow"
import { SocialProofHighlightedPhraseSpotlight } from "../social-proof-highlighted-phrase-spotlight/SocialProofHighlightedPhraseSpotlight"
import { SocialProofDarkEditorialSplit } from "../social-proof-dark-editorial-split/SocialProofDarkEditorialSplit"
import { SocialProofOverlayPhotoQuote } from "../social-proof-overlay-photo-quote/SocialProofOverlayPhotoQuote"
import { SocialProofSpotlightCarousel } from "../social-proof-spotlight-carousel/SocialProofSpotlightCarousel"
import { SocialProofAvatarSelectorRow } from "../social-proof-avatar-selector-row/SocialProofAvatarSelectorRow"
import { SocialProofProgressCarousel } from "../social-proof-progress-carousel/SocialProofProgressCarousel"
import { SocialProofPersonaPillars } from "../social-proof-persona-pillars/SocialProofPersonaPillars"
import { SocialProofWorkplacePortraitStories } from "../social-proof-workplace-portrait-stories/SocialProofWorkplacePortraitStories"
import { SocialProofStatStoryCards } from "../social-proof-stat-story-cards/SocialProofStatStoryCards"
import { SocialProofVideoStoryCards, socialProofVideoStoryCardsCopy } from "../social-proof-video-story-cards/SocialProofVideoStoryCards"
import { SocialProofCaseStudyRow } from "../social-proof-case-study-row/SocialProofCaseStudyRow"
import { SocialProofProofBento } from "../social-proof-proof-bento/SocialProofProofBento"

describe("Isolated", () => {
  it("sets every figure, handle and time in its own left-to-right run", () => {
    const { container } = render(
      <p>
        <Isolated>{"يعتمد على فاصلة أكثر من 2,300 فريق، بنسبة 28% و2.1× مع @Fasla في 2:14 والعدّاد 01 / 04"}</Isolated>
      </p>
    )
    expect([...container.querySelectorAll("bdi")].map((bdi) => [bdi.getAttribute("dir"), bdi.textContent])).toEqual([
      ["ltr", "2,300"],
      ["ltr", "28%"],
      ["ltr", "2.1×"],
      ["ltr", "@Fasla"],
      ["ltr", "2:14"],
      ["ltr", "01 / 04"],
    ])
    expect(container.textContent).toBe("يعتمد على فاصلة أكثر من 2,300 فريق، بنسبة 28% و2.1× مع @Fasla في 2:14 والعدّاد 01 / 04")
  })
})

describe("SocialProofStars", () => {
  it("draws five full stars under one accessible name, in each language", () => {
    const { rerender } = render(<SocialProofStars />)
    const stars = screen.getByRole("img", { name: "Rated 5 out of 5" })
    expect(stars.querySelectorAll("svg")).toHaveLength(5)
    rerender(<SocialProofStars locale="ar" />)
    expect(screen.getByRole("img", { name: "التقييم 5 من 5" })).toBeTruthy()
  })
})

describe("toColumns", () => {
  it("deals items into columns as Figma's walls do: runs for three, turns for two", () => {
    const items = [1, 2, 3, 4, 5, 6]
    expect(toColumns(items, 3)).toEqual([[1, 2], [3, 4], [5, 6]])
    expect(toColumns(items, 2)).toEqual([[1, 3, 5], [2, 4, 6]])
    expect(toColumns(items, 1)).toEqual([items])
  })
})

describe("Classic Trio Grid", () => {
  it("names the section by its heading and attributes every quote", () => {
    render(<SocialProofClassicTrioGrid />)
    expect(screen.getByRole("region", { name: "Loved by the teams that ship" })).toBeTruthy()
    expect([...document.querySelectorAll("figure cite")].map((cite) => cite.textContent)).toEqual(["Sami Naji", "Khalid Saad", "Rashed Al-Amri"])
  })
})

describe("Vertical Column Wall", () => {
  it("holds all twelve cards, each ready for the one-time reveal", () => {
    const { container } = render(<SocialProofVerticalColumnWall />)
    expect(container.querySelectorAll("[data-reveal]")).toHaveLength(12)
  })
})

describe("Tweet Wall", () => {
  it("sets every mention in info, in its own left-to-right run", () => {
    const { container } = render(<SocialProofTweetWall locale="ar" />)
    const mentions = [...container.querySelectorAll("bdi.text-info")]
    expect(mentions).toHaveLength(6)
    expect(mentions.every((bdi) => bdi.textContent === "@Fasla" && bdi.getAttribute("dir") === "ltr")).toBe(true)
  })
})

describe("App Review Row", () => {
  it("disables both arrows when Figma's three reviews make one set", () => {
    render(<SocialProofAppReviewRow />)
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("steps to the next set of three and back, stopping at both ends", async () => {
    const reviews = socialProofAppReviewRowCopy.en.items
    const more = [...reviews, ...reviews.map((review) => ({ ...review, quote: `${review.handle} again` }))]
    render(<SocialProofAppReviewRow items={more} />)
    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement
    expect(previous.disabled).toBe(true)
    fireEvent.click(next)
    expect(await screen.findByText("· chicago_pm again")).toBeTruthy()
    expect(next.disabled).toBe(true)
    expect(previous.disabled).toBe(false)
    fireEvent.click(previous)
    expect(await screen.findByText(/Fasla Studio is flat-out awesome/)).toBeTruthy()
  })
})

describe("Highlighted-Phrase Spotlight", () => {
  it("marks each highlighted phrase whole, in both languages", () => {
    const { container, rerender } = render(<SocialProofHighlightedPhraseSpotlight />)
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual(["two design days a week", "finally feels finished"])
    rerender(<SocialProofHighlightedPhraseSpotlight locale="ar" />)
    expect([...container.querySelectorAll("mark")].map((mark) => mark.textContent)).toEqual(["يومين من التصميم كل أسبوع", "يبدو مكتملًا"])
  })
})

describe("Photo slots", () => {
  it("leave the slot empty without a photo, and fill it with one", () => {
    const { container, rerender } = render(<SocialProofDarkEditorialSplit />)
    expect(container.querySelector("img")).toBeNull()
    rerender(<SocialProofDarkEditorialSplit photos={{ "yousef-amin": "/yousef.webp" }} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/yousef.webp")
  })

  it("set Overlay Photo Quote's photograph from its own key", () => {
    const { container } = render(<SocialProofOverlayPhotoQuote photos={{ "overlay-photo-quote": "/office.webp" }} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/office.webp")
    expect(screen.getByRole("region", { name: "What customers say" })).toBeTruthy()
  })
})

describe("Spotlight Carousel", () => {
  it("opens on the first quote with previous disabled, steps with next and the arrow keys, and stops at the end", async () => {
    render(<SocialProofSpotlightCarousel />)
    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement
    expect(previous.disabled).toBe(true)
    expect(screen.getByText(/Support tickets about visual bugs/)).toBeTruthy()
    fireEvent.click(next)
    expect(await screen.findByText(/turned our design language into a growth channel/)).toBeTruthy()
    fireEvent.keyDown(screen.getByRole("group", { name: "Quote 2 of 4" }), { key: "End" })
    expect(await screen.findByText(/set a new bar for quality/)).toBeTruthy()
    expect(next.disabled).toBe(true)
  })

  it("moves forward with the left arrow on an Arabic page", async () => {
    render(
      <div dir="rtl">
        <SocialProofSpotlightCarousel locale="ar" />
      </div>
    )
    fireEvent.keyDown(screen.getByRole("group", { name: "الاقتباس 1 من 4" }), { key: "ArrowLeft" })
    expect(await screen.findByText(/جعلت فاصلة هويتنا البصرية/)).toBeTruthy()
  })
})

describe("Avatar-Selector Row", () => {
  it("opens on Khalid Saad, and selecting another portrait shows that person's quote", () => {
    render(<SocialProofAvatarSelectorRow />)
    expect(screen.getByRole("tab", { name: /Khalid Saad/ }).getAttribute("aria-selected")).toBe("true")
    fireEvent.click(screen.getByRole("tab", { name: /Hani Jaber/ }))
    expect(screen.getByRole("tab", { name: /Hani Jaber/ }).getAttribute("aria-selected")).toBe("true")
    expect(screen.getByRole("tabpanel").textContent).toContain("You just have to build one screen")
  })
})

describe("Progress Carousel", () => {
  it("counts the story and steps the bar by a quarter, only when you navigate", async () => {
    render(<SocialProofProgressCarousel />)
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("25")
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(await screen.findByText("ARVENNA BANK")).toBeTruthy()
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50")
  })

  it("gives every story a photo key of its own", async () => {
    const photos = { "progress-carousel-1": "/one.webp", "progress-carousel-2": "/two.webp" }
    const { container } = render(<SocialProofProgressCarousel photos={photos} />)
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/one.webp")
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    await screen.findByText("ARVENNA BANK")
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/two.webp")
  })
})

describe("Persona Pillars", () => {
  it("opens on Engineers and widens the pillar you press into its quote", () => {
    render(<SocialProofPersonaPillars />)
    expect(screen.getByRole("button", { name: "Engineers", pressed: true })).toBeTruthy()
    fireEvent.click(screen.getAllByRole("button", { name: "Product" })[0]!)
    expect(screen.getByRole("button", { name: "Product", pressed: true })).toBeTruthy()
    expect(screen.getByText(/turned our design language into a growth channel/)).toBeTruthy()
  })
})

describe("Workplace Portrait Stories", () => {
  it("features Design leads first, and shows a benefit line only where Figma has one", () => {
    render(<SocialProofWorkplacePortraitStories />)
    expect(screen.getAllByText(/Give every squad the same tokens/).length).toBeGreaterThan(0)
    fireEvent.click(screen.getAllByRole("button", { name: "Founders" })[0]!)
    expect(screen.queryByText(/Give every squad the same tokens/)).toBeNull()
    expect(screen.getAllByText("Yousef Amin").length).toBeGreaterThan(0)
  })
})

describe("Stat-Story Cards", () => {
  it("shows the first set of three, and a dot pages to another set, manually", async () => {
    render(<SocialProofStatStoryCards />)
    expect(screen.getAllByRole("article")).toHaveLength(3)
    expect(screen.getByText("41%")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Set 2 of 3" }))
    expect(await screen.findByText(/We deleted forty thousand lines/)).toBeTruthy()
    expect(screen.queryByText("41%")).toBeNull()
  })

  it("moves between dots with the arrow keys, Home and End, and follows the page direction", async () => {
    render(
      <div dir="rtl">
        <SocialProofStatStoryCards locale="ar" />
      </div>
    )
    const group = screen.getByRole("group", { name: "مجموعات القصص" })
    fireEvent.keyDown(group, { key: "ArrowLeft" })
    expect(await screen.findByText(/حذفنا أربعين ألف سطر/)).toBeTruthy()
    fireEvent.keyDown(group, { key: "Home" })
    expect(await screen.findByText(/لم أدرك كم كلّفتنا الواجهات البطيئة/)).toBeTruthy()
    fireEvent.keyDown(group, { key: "End" })
    expect(await screen.findByText(/أنهينا الإعداد في صباح واحد/)).toBeTruthy()
  })
})

describe("Video Story Cards", () => {
  it("shows posters only until play is pressed, then plays that story and can close it", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve())
    const items = socialProofVideoStoryCardsCopy.en.items.map((item) => ({ ...item, videoSrc: "/film.mp4" }))
    const { container } = render(<SocialProofVideoStoryCards items={items} />)
    expect(container.querySelector("video")).toBeNull()
    fireEvent.click(screen.getAllByRole("button", { name: "Play" })[0]!)
    expect(container.querySelectorAll("video")).toHaveLength(1)
    expect(play).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole("button", { name: "Close video" }))
    expect(container.querySelector("video")).toBeNull()
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(2)
    play.mockRestore()
  })

  it("does nothing on play without a video", () => {
    const { container } = render(<SocialProofVideoStoryCards />)
    fireEvent.click(screen.getAllByRole("button", { name: "Play" })[0]!)
    expect(container.querySelector("video")).toBeNull()
  })
})

describe("Case-Study Row", () => {
  it("sets two case studies with their figures and links, and no controls but links", () => {
    render(<SocialProofCaseStudyRow />)
    expect(screen.getAllByRole("article")).toHaveLength(2)
    expect(screen.getByText("2.1×")).toBeTruthy()
    expect(screen.getAllByRole("link", { name: /Read more/ })).toHaveLength(2)
    expect(screen.queryAllByRole("button")).toHaveLength(0)
  })
})

describe("Proof Bento", () => {
  it("plays the video tile only when its button is pressed, and closes it", () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve())
    const { container } = render(<SocialProofProofBento videoSrc="/film.mp4" />)
    expect(container.querySelector("video")).toBeNull()
    expect(screen.getByText((_, el) => el?.tagName === "P" && el.textContent === "Watch Rashed's story · 2:14")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(container.querySelector("video")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Close video" }))
    expect(container.querySelector("video")).toBeNull()
    play.mockRestore()
  })
})
