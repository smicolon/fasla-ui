import type { Meta, StoryObj } from "@storybook/react"
import { MahaamTemplate } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-template"
import { mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { label, localeOf, mahaamViewports, pausedOf, variant } from "./mahaam-story-kit"

/**
 * The whole Mahaam template: a ten-section landing page for a voice-first task manager, in English and Arabic, at three screen sizes.
 */
const meta: Meta<typeof MahaamTemplate> = {
  // The id keeps the story links stable; the title puts the page first in the Mahaam group.
  id: "templates-mahaam-template",
  title: "Templates/Mahaam/Overview",
  component: MahaamTemplate,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["locale", "className"] },
    docs: {
      description: {
        component: [
          "**What it is.** One landing page built from the Figma set *Mahaam Template*. Each section is its own registry item, so you can take the whole page or one section.",
          "",
          "**The ten sections.** Navbar, Hero, Logo marquee, Features, Ask, Banner, Testimonials, Plans, FAQ and Footer. The next pages in this group show one section each.",
          "",
          "**The six variants.** Desktop (1440), Tablet (768) and Mobile (360), each in LTR with English copy and in RTL with Arabic copy. One build covers all six: each section is sized by its own width, and the page's `dir` mirrors it. The stories below open each state on each variant.",
          "",
          "**Install.** `npx @smicolon/fasla-ui@latest add template-mahaam`. The template ships no photographs; pass them in `photos`.",
          "",
          "**Motion.** The Hero, the logo strip, the Features cards, the Ask rows and the Banner rings play on their own, which is a documented exception to the repo's motion rules. Motion stops under `prefers-reduced-motion`, under the pointer and while a section is off screen. The Testimonials stack does not autoplay.",
          "",
          "**Accessibility.** The template draws no pause button, so the design stays clean. Autoplay longer than 5 seconds needs a way to stop it (WCAG 2.2.2, Level A), so a site that ships it must place a `MahaamMotionToggle` (in its navbar or footer, for example) and pass the same `paused` to `MahaamTemplate`. In this Storybook, the Motion toolbar item does the same.",
          "",
          "**Credits.** The painting is *Port of Marseille* by Paul Signac (public domain, Hermitage). Faisal's portrait is by Christoph Eigner via Unsplash; Noura's and Khalid's are Images by Freepik. The full list is in `public/images/mahaam/CREDITS.md`.",
          "",
          "**Stories.** Final holds every section on Figma's still frame. Playing lets every section loop. Reduced motion is what a visitor who asks for it sees.",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamTemplate locale={localeOf(context)} paused={pausedOf(context)} photos={mahaamPhotoProps} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamTemplate>

/* Final: Every section held on Figma's still frame. */
export const FinalDesktopLtr: Story = { name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { still: true } }
export const FinalDesktopRtl: Story = { name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { still: true } }
export const FinalTabletLtr: Story = { name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { still: true } }
export const FinalTabletRtl: Story = { name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { still: true } }
export const FinalMobileLtr: Story = { name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { still: true } }
export const FinalMobileRtl: Story = { name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { still: true } }

/* Playing: Every section playing on its own. */
export const PlayingDesktopLtr: Story = { name: "Playing · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: {} }
export const PlayingDesktopRtl: Story = { name: "Playing · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: {} }
export const PlayingTabletLtr: Story = { name: "Playing · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: {} }
export const PlayingTabletRtl: Story = { name: "Playing · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: {} }
export const PlayingMobileLtr: Story = { name: "Playing · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: {} }
export const PlayingMobileRtl: Story = { name: "Playing · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: {} }

/* Reduced motion: What a visitor who asks for reduced motion sees: every section's finished frame. */
export const ReducedMotionDesktopLtr: Story = { name: "Reduced motion · " + label("desktop", "ltr"), ...variant("desktop", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionDesktopRtl: Story = { name: "Reduced motion · " + label("desktop", "rtl"), ...variant("desktop", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionTabletLtr: Story = { name: "Reduced motion · " + label("tablet", "ltr"), ...variant("tablet", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionTabletRtl: Story = { name: "Reduced motion · " + label("tablet", "rtl"), ...variant("tablet", "rtl"), args: { reducedMotion: true } }
export const ReducedMotionMobileLtr: Story = { name: "Reduced motion · " + label("mobile", "ltr"), ...variant("mobile", "ltr"), args: { reducedMotion: true } }
export const ReducedMotionMobileRtl: Story = { name: "Reduced motion · " + label("mobile", "rtl"), ...variant("mobile", "rtl"), args: { reducedMotion: true } }

