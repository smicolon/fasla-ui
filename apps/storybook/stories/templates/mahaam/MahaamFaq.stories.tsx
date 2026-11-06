import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFaq } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-faq"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"
import { sectionDocs } from "./mahaam-docs"

/**
 * FAQ: The Split Sticky FAQ: a heading and a link on one side, six questions on the other, the first one open.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamFaq> = {
  title: "Templates/Mahaam/FAQ",
  component: MahaamFaq,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["eyebrow", "heading", "description", "cta"] },
    docs: {
      page: sectionDocs({
        what: "The Split Sticky FAQ: a heading and a link on one side, six questions on the other, the first one open.",
        item: "mahaam-faq",
        props: [
        ["eyebrow / heading / description / cta", "string", "The copy beside the questions."],
        ["items", "FaqItem[]", "The questions and answers."],
        ["ctaHref", "string", "Where the link goes."],
        ["defaultValue", "string[]", "Which questions start open."],
        ],
      }),
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamFaq locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFaq>

/* Playground: the section as the toolbars set it: Direction, Theme, Viewport and Motion. */
export const Playground: Story = {
  name: "Playground",
  tags: ["dev", "autodocs"],
  parameters: { viewport: { viewports: mahaamViewports, defaultViewport: "desktop" } },
}

export const FinalDesktopLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "ltr"), ...variant("desktop", "ltr") }
export const FinalDesktopRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("desktop", "rtl"), ...variant("desktop", "rtl") }
export const FinalTabletLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "ltr"), ...variant("tablet", "ltr") }
export const FinalTabletRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("tablet", "rtl"), ...variant("tablet", "rtl") }
export const FinalMobileLtr: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "ltr"), ...variant("mobile", "ltr") }
export const FinalMobileRtl: Story = { tags: ["!dev", "!autodocs"], name: "Final · " + label("mobile", "rtl"), ...variant("mobile", "rtl") }
