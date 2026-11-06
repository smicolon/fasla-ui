import * as React from "react"
import { addons, types, useGlobals } from "@storybook/manager-api"
import { IconButton, TooltipLinkList, WithTooltip } from "@storybook/components"
import { create } from "@storybook/theming/create"

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Fasla Component Explorer",
    brandUrl: "https://fasla.smicolon.com/components/",
    // staticDirs serves apps/docs/public at the root.
    brandImage: "/brand/fasla-lockup-ltr.svg",
    brandTarget: "_self",
  }),
})

/**
 * The Motion toolbar item: Playing, Paused, Final frame and Reduced motion. It
 * stands in for the pause button the Mahaam template does not draw, and it
 * shows only on the Templates / Mahaam stories: a global toolbar item cannot be
 * hidden per story, so it is a manager tool with a `match`.
 */
const MOTION = [
  { id: "playing", title: "Playing" },
  { id: "paused", title: "Paused" },
  { id: "final", title: "Final frame" },
  { id: "reduced", title: "Reduced motion" },
] as const

function MotionTool() {
  const [globals, updateGlobals] = useGlobals()
  const current = MOTION.find((item) => item.id === globals.motion) ?? MOTION[0]
  return (
    <WithTooltip
      placement="bottom"
      trigger="click"
      closeOnOutsideClick
      tooltip={({ onHide }: { onHide: () => void }) => (
        <TooltipLinkList
          links={MOTION.map((item) => ({
            id: item.id,
            title: item.title,
            active: item.id === current.id,
            onClick: () => {
              updateGlobals({ motion: item.id })
              onHide()
            },
          }))}
        />
      )}
    >
      <IconButton key="motion" title="Motion" active={current.id !== "playing"}>
        Motion: {current.title}
      </IconButton>
    </WithTooltip>
  )
}

addons.register("fasla/motion", () => {
  addons.add("fasla/motion/tool", {
    type: types.TOOL,
    title: "Motion",
    match: ({ storyId }) => Boolean(storyId?.startsWith("templates-mahaam")),
    render: () => <MotionTool />,
  })
})
