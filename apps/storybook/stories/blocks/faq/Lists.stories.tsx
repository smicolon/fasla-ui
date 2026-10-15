import type { Meta, StoryObj } from "@storybook/react"
import { FaqAccentActiveCard } from "../../../../../packages/fasla-ui/registry/blocks/faq-accent-active-card/FaqAccentActiveCard"
import { FaqClassicCentered } from "../../../../../packages/fasla-ui/registry/blocks/faq-classic-centered/FaqClassicCentered"
import { FaqDarkPanel } from "../../../../../packages/fasla-ui/registry/blocks/faq-dark-panel/FaqDarkPanel"
import { FaqFeaturedQuestion } from "../../../../../packages/fasla-ui/registry/blocks/faq-featured-question/FaqFeaturedQuestion"
import { FaqMonoIndex } from "../../../../../packages/fasla-ui/registry/blocks/faq-mono-index/FaqMonoIndex"
import { FaqNumberedEditorial } from "../../../../../packages/fasla-ui/registry/blocks/faq-numbered-editorial/FaqNumberedEditorial"
import { FaqSoftFilledRows } from "../../../../../packages/fasla-ui/registry/blocks/faq-soft-filled-rows/FaqSoftFilledRows"
import { FaqTableCompact } from "../../../../../packages/fasla-ui/registry/blocks/faq-table-compact/FaqTableCompact"
import { FaqUppercaseDense } from "../../../../../packages/fasla-ui/registry/blocks/faq-uppercase-dense/FaqUppercaseDense"
import { faqViewports, hiddenArgTypes, localeOf, withForeignTheme } from "./faq-story-kit"

/**
 * The FAQ blocks that are one list of questions, each with its own look.
 * Viewport, direction and theme come from the toolbar.
 */
const meta: Meta = {
  title: "Blocks/FAQ/Lists",
  parameters: { layout: "fullscreen", viewport: { viewports: faqViewports } },
  tags: ["autodocs"],
}

export default meta

export const ClassicCentered: StoryObj<typeof FaqClassicCentered> = {
  name: "Classic Centered",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqClassicCentered locale={localeOf(context)} {...args} />,
}

export const AccentActiveCard: StoryObj<typeof FaqAccentActiveCard> = {
  name: "Accent Active Card",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqAccentActiveCard locale={localeOf(context)} {...args} />,
}

export const SoftFilledRows: StoryObj<typeof FaqSoftFilledRows> = {
  name: "Soft Filled Rows",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqSoftFilledRows locale={localeOf(context)} {...args} />,
}

export const NumberedEditorial: StoryObj<typeof FaqNumberedEditorial> = {
  name: "Numbered Editorial",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqNumberedEditorial locale={localeOf(context)} {...args} />,
}

export const DarkPanel: StoryObj<typeof FaqDarkPanel> = {
  name: "Dark Panel",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqDarkPanel locale={localeOf(context)} {...args} />,
}

/** Light mode: the panel is dark. */
export const DarkPanelLight: StoryObj<typeof FaqDarkPanel> = {
  ...DarkPanel,
  name: "Dark Panel: Light",
  globals: { theme: "light" },
}

/** Dark mode: the same tokens turn the panel light. */
export const DarkPanelDark: StoryObj<typeof FaqDarkPanel> = {
  ...DarkPanel,
  name: "Dark Panel: Dark",
  globals: { theme: "dark" },
}

/**
 * In a theme without the inverse tokens, the mapping falls back to the page
 * colours swapped, so the panel still reads.
 */
export const DarkPanelForeignTheme: StoryObj<typeof FaqDarkPanel> = {
  ...DarkPanel,
  name: "Dark Panel: Theme without inverse tokens",
  decorators: [withForeignTheme],
}

/** Keyboard focus on the panel: the ring is drawn in the inverse foreground. */
export const DarkPanelFocus: StoryObj<typeof FaqDarkPanel> = {
  ...DarkPanel,
  name: "Dark Panel: Keyboard focus",
  parameters: { pseudo: { focusVisible: ["[data-slot=accordion-item]:nth-child(2) [data-slot=accordion-trigger]"] } },
}

export const MonoIndex: StoryObj<typeof FaqMonoIndex> = {
  name: "Mono Index",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqMonoIndex locale={localeOf(context)} {...args} />,
}

/** Light mode: the band is dark. */
export const MonoIndexLight: StoryObj<typeof FaqMonoIndex> = {
  ...MonoIndex,
  name: "Mono Index: Light",
  globals: { theme: "light" },
}

/** Dark mode: the same tokens turn the band light. */
export const MonoIndexDark: StoryObj<typeof FaqMonoIndex> = {
  ...MonoIndex,
  name: "Mono Index: Dark",
  globals: { theme: "dark" },
}

/**
 * In a theme without the inverse tokens, the mapping falls back to the page
 * colours swapped, so the band still reads.
 */
export const MonoIndexForeignTheme: StoryObj<typeof FaqMonoIndex> = {
  ...MonoIndex,
  name: "Mono Index: Theme without inverse tokens",
  decorators: [withForeignTheme],
}

/** Keyboard focus on the band: the ring is drawn in the inverse foreground. */
export const MonoIndexFocus: StoryObj<typeof FaqMonoIndex> = {
  ...MonoIndex,
  name: "Mono Index: Keyboard focus",
  parameters: { pseudo: { focusVisible: ["[data-slot=accordion-item]:nth-child(2) [data-slot=accordion-trigger]"] } },
}

export const UppercaseDense: StoryObj<typeof FaqUppercaseDense> = {
  name: "Uppercase Dense",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqUppercaseDense locale={localeOf(context)} {...args} />,
}

export const TableCompact: StoryObj<typeof FaqTableCompact> = {
  name: "Table Compact",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqTableCompact locale={localeOf(context)} {...args} />,
}

export const FeaturedQuestion: StoryObj<typeof FaqFeaturedQuestion> = {
  name: "Featured Question",
  argTypes: { ...hiddenArgTypes, onFeedback: { action: "feedback" } },
  render: (args, context) => <FaqFeaturedQuestion locale={localeOf(context)} {...args} />,
}
