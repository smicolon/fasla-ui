import type { Meta, StoryObj } from "@storybook/react"
import { MahaamFooter } from "../../../../../packages/fasla-ui/registry/templates/mahaam/mahaam-footer"
import { label, localeOf, mahaamViewports, variant } from "./mahaam-story-kit"
import { sectionDocs } from "./mahaam-docs"

/**
 * Footer: The brand with store buttons, three link columns, and the credits line.
 *
 * Playground is the one story in the sidebar: the Direction, Theme, Viewport and Motion
 * toolbars set it. The Final, Playing, Paused and Reduced motion stories, per breakpoint and
 * direction, stay in the code under the same ids, hidden from the sidebar, for the pixel-diff
 * scripts and old links.
 */
const meta: Meta<typeof MahaamFooter> = {
  title: "Templates/Mahaam/Footer",
  component: MahaamFooter,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: mahaamViewports },
    controls: { include: ["brand", "tagline", "note"] },
    docs: {
      page: sectionDocs({
        what: "The brand with its store buttons, three link columns, and the credits line.",
        item: "mahaam-footer",
        props: [
        ["brand / tagline / note", "string", "The copy."],
        ["stores", "object[]", "The two store buttons."],
        ["columns", "MahaamFooterColumn[]", "The link columns."],
        ["credits", "ReactNode", "The credits line."],
        ],
      }),
    },
  },
  tags: ["autodocs"],
  render: (args, context) => <MahaamFooter locale={localeOf(context)} {...args} />,
}
export default meta

type Story = StoryObj<typeof MahaamFooter>

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
