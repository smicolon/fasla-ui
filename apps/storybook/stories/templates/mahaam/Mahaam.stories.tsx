import type { Meta, StoryObj } from "@storybook/react"
import { MahaamAsk, mahaamAskCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-ask"
import { MahaamBanner, mahaamBannerCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-banner"
import { MahaamFaq, mahaamFaqCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-faq"
import { MahaamFeatures, mahaamFeaturesCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-features"
import { MahaamFooter, mahaamFooterCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-footer"
import { MahaamHero, mahaamHeroCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-hero"
import { MahaamLogoMarquee, mahaamLogoMarqueeCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-logo-marquee"
import { MahaamNavbar, mahaamNavbarCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-navbar"
import { MahaamPlans, mahaamPlansCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-plans"
import { MahaamTestimonials, mahaamTestimonialsCopy } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-testimonials"
import { mahaamHeroPhotoProps, mahaamPhotoProps } from "../../../../docs/components/blocks/mahaam-photos"
import { localeOf, mahaamArgTypes, mahaamViewports, motionOf } from "./mahaam-story-kit"

/**
 * Mahaam: the landing template, one story per section (navbar, hero, logo marquee, features, ask, banner,
 * testimonials, plans, FAQ, footer).
 * Viewport, direction and theme come from the toolbar, as on the blocks; Motion sets the loops, since
 * the template draws no pause button.
 */
/*
 * The sidebar and the Docs page list the ten sections only. The per-state stories, whole-page ones included
 * (Final, Playing, Paused and Reduced motion, per breakpoint and direction) are in the Mahaam*.stories.tsx
 * files beside this one, tagged `!dev` and `!autodocs`: hidden from both, but still built under the same
 * ids, so the pixel-diff scripts and old links reach them. The tags are written out on each story, as the
 * indexer reads them statically.
 */
const meta: Meta = {
  title: "Templates/Mahaam",
  parameters: { layout: "fullscreen", viewport: { viewports: mahaamViewports } },
  tags: ["autodocs"],
}

export default meta

/** Motion is the toolbar's, so the story's own motion props have no row. */
const MOTION = ["paused", "still", "reducedMotion"]

export const Navbar: StoryObj<typeof MahaamNavbar> = {
  name: "Navbar",
  argTypes: mahaamArgTypes(MahaamNavbar, mahaamNavbarCopy, ["menuOpen"]),
  render: (args, context) => <MahaamNavbar locale={localeOf(context)} {...args} />,
}

export const Hero: StoryObj<typeof MahaamHero> = {
  name: "Hero",
  argTypes: mahaamArgTypes(MahaamHero, mahaamHeroCopy, [...MOTION, "frame"]),
  render: (args, context) => <MahaamHero locale={localeOf(context)} {...motionOf(context)} {...mahaamHeroPhotoProps} {...args} />,
}

export const LogoMarquee: StoryObj<typeof MahaamLogoMarquee> = {
  name: "Logo marquee",
  argTypes: mahaamArgTypes(MahaamLogoMarquee, mahaamLogoMarqueeCopy, [...MOTION, "progress"]),
  render: (args, context) => <MahaamLogoMarquee locale={localeOf(context)} {...motionOf(context)} {...args} />,
}

export const Features: StoryObj<typeof MahaamFeatures> = {
  name: "Features",
  argTypes: mahaamArgTypes(MahaamFeatures, mahaamFeaturesCopy, [...MOTION, "progress"]),
  render: (args, context) => <MahaamFeatures locale={localeOf(context)} {...motionOf(context)} avatars={mahaamPhotoProps.avatars} flags={mahaamPhotoProps.flags} {...args} />,
}

export const Ask: StoryObj<typeof MahaamAsk> = {
  name: "Ask",
  argTypes: mahaamArgTypes(MahaamAsk, mahaamAskCopy, [...MOTION, "progress"]),
  render: (args, context) => <MahaamAsk locale={localeOf(context)} {...motionOf(context)} {...args} />,
}

export const Banner: StoryObj<typeof MahaamBanner> = {
  name: "Banner",
  argTypes: mahaamArgTypes(MahaamBanner, mahaamBannerCopy, [...MOTION, "progress"]),
  render: (args, context) => <MahaamBanner locale={localeOf(context)} {...motionOf(context)} {...args} />,
}

export const Testimonials: StoryObj<typeof MahaamTestimonials> = {
  name: "Testimonials",
  argTypes: mahaamArgTypes(MahaamTestimonials, mahaamTestimonialsCopy, ["reducedMotion"]),
  render: (args, context) => <MahaamTestimonials locale={localeOf(context)} reducedMotion={motionOf(context).reducedMotion} portraits={mahaamPhotoProps.portraits} {...args} />,
}

export const Plans: StoryObj<typeof MahaamPlans> = {
  name: "Plans",
  argTypes: mahaamArgTypes(MahaamPlans, mahaamPlansCopy, ["billing"]),
  render: (args, context) => <MahaamPlans locale={localeOf(context)} {...args} />,
}

export const Faq: StoryObj<typeof MahaamFaq> = {
  name: "FAQ",
  argTypes: mahaamArgTypes(MahaamFaq, mahaamFaqCopy),
  render: (args, context) => <MahaamFaq locale={localeOf(context)} {...args} />,
}

export const Footer: StoryObj<typeof MahaamFooter> = {
  name: "Footer",
  argTypes: mahaamArgTypes(MahaamFooter, mahaamFooterCopy),
  render: (args, context) => <MahaamFooter locale={localeOf(context)} {...args} />,
}
