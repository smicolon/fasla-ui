import * as React from "react"
import type { ArgTypesEnhancer, Decorator, Preview } from "@storybook/react"
import { withThemeByClassName } from "@storybook/addon-themes"

// Self-hosted Cairo (arabic + latin), the Vite equivalent of the docs app's
// next/font/google call. Must land before globals.css so the @font-face rules
// are in place when the type ramp resolves.
import "@fontsource-variable/cairo"
import "../src/styles/globals.css"

/**
 * Direction switcher. The type ramp is direction-aware at theme level — every
 * `text-*` utility re-leads itself under `[dir="rtl"]` — so flipping this is the
 * only way to see whether a component's Arabic setting is right.
 *
 * Mirrors apps/docs/app/[locale]/layout.tsx: `dir` and `lang` on a wrapper, and
 * `font-arabic` to reach Cairo, which is what the docs site renders.
 *
 * In single-story view the document element follows the toolbar too: that is
 * what the a11y addon, screen readers and the scrollbar read, and anything
 * portalled into <body> would render outside the wrapper.
 *
 * In Docs view the page itself is English prose (title, description, props
 * table), so the document stays en/ltr and only each story canvas, through
 * the wrapper, takes the toolbar direction. Storybook 8.6 has no htmlLang or
 * docs.lang parameter for this. The iframe is reused across view modes, so
 * Docs view resets the document explicitly rather than leaving it alone.
 */
const withDirection: Decorator = (Story, context) => {
  const direction = context.globals.direction === "rtl" ? "rtl" : "ltr"
  const isRtl = direction === "rtl"
  const lang = isRtl ? "ar" : "en"
  const isDocs = context.viewMode === "docs"

  document.documentElement.dir = isDocs ? "ltr" : direction
  document.documentElement.lang = isDocs ? "en" : lang

  return (
    <div dir={direction} lang={lang} className={isRtl ? "font-arabic" : undefined}>
      <Story />
    </div>
  )
}

/**
 * `className` is always the last row of the controls table, for every
 * component (CLAUDE.md, "Storybook controls table"). Storybook lists the
 * props it reads from the component first and a story's own args after them,
 * so without this `className` lands mid-table whenever a story adds args of
 * its own, or whenever it comes early in the component's props. It is a
 * second-pass enhancer, like Storybook's own `inferArgTypes`, which adds the
 * rows for a story's `args` and puts them first; running after it, it sees
 * the finished table. It only moves the row, and leaves every row's settings
 * as they are.
 */
const classNameLast: ArgTypesEnhancer = Object.assign(
  ({ argTypes }: Parameters<ArgTypesEnhancer>[0]) => {
    if (!("className" in argTypes)) return argTypes
    const { className, ...rest } = argTypes
    return { ...rest, className }
  },
  { secondPass: true }
)

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: "centered",
    // Button and Icon Button lead the UI section; everything else keeps the
    // order of its files, which is alphabetical.
    options: {
      storySort: { order: ["Blocks", "Effects", "UI", ["Button", "Icon Button"]] },
    },
  },
  globalTypes: {
    direction: {
      description: "Text direction — LTR sets Geist, RTL sets Cairo and the Arabic leading",
      defaultValue: "ltr",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR (English)" },
          { value: "rtl", title: "RTL (العربية)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withDirection,
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
  ],
  argTypesEnhancers: [classNameLast],
  tags: ["autodocs"],
}

export default preview
