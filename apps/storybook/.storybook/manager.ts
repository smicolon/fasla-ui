import { addons } from "@storybook/manager-api"
import { create } from "@storybook/theming/create"

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Fasla Component Explorer",
    brandUrl: "https://ui.smicolon.com/components/",
    // staticDirs serves apps/docs/public at the root.
    brandImage: "/brand/fasla-lockup-ltr.svg",
    brandTarget: "_self",
  }),
})
