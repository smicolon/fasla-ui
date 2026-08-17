import { addons } from "@storybook/manager-api"
import { create } from "@storybook/theming/create"

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "SMI-UI Component Explorer",
    brandUrl: "https://ui.smicolon.com/components/",
    brandImage: "/components/Logo-dark.svg",
    brandTarget: "_self",
  }),
})
