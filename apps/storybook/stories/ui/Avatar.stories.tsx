import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, type AvatarProps } from "../../../../packages/fasla-ui/registry/ui/avatar"

/** The Avatar set's own illustration, exported from Figma (5593:1593). */
const PHOTO = "/samples/avatar-portrait.png"

const COPY = {
  ltr: { name: "Vera Brandt" },
  rtl: { name: "دانة أحمد" },
} as const

type StoryCtx = { globals: { direction?: string } }
const copy = (ctx: StoryCtx) => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const IMAGE_ATTRS = ["srcSet", "sizes", "loading", "decoding", "crossOrigin", "referrerPolicy"] as const

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    variant: "image",
    size: "32",
    radius: "standard",
    border: false,
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["image", "initials", "icon"],
      description:
        "Figma `Style`. `image` shows the photo; `initials` and `icon` show their content even when a photo is passed. A missing photo falls back to the initials, then the icon.",
    },
    size: { control: "inline-radio", options: ["32", "24", "12"], description: "Figma `Size`, in px." },
    radius: {
      control: "inline-radio",
      options: ["standard", "rounded"],
      description: "Figma `Radius`. Standard is `border radius/md`, or `xs` at 12.",
    },
    border: { control: "boolean", description: "Figma `Border`: a `ring` stroke inside the edge." },
    // The story always passes the sample photo; `variant` decides whether it shows.
    src: { table: { disable: true } },
    name: {
      control: "text",
      description: "The person's name: the photo's alt, the source of the initials, and the accessible name of every variant. Leave empty for the sample name in the current direction.",
    },
    status: {
      control: "select",
      options: [undefined, "online", "away", "busy", "offline"],
      description: "Shows the status dot. Off unless set.",
    },
    statusLabel: { control: "text", description: "Not visible. Overrides the dot's accessible name." },
    // Pass-throughs to the `<img>`: props of the component, not of the design.
    ...Object.fromEntries(IMAGE_ATTRS.map((attr) => [attr, { table: { disable: true } }])),
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

const SIZES = ["32", "24", "12"] as const
const RADII = ["standard", "rounded"] as const

export const Default: Story = {
  render: (args, ctx) => <Avatar {...args} src={PHOTO} name={args.name || copy(ctx).name} />,
}

/**
 * Figma's grid: Style × Radius × Border, at every size. Every avatar gets the
 * same photo and name; `variant` alone picks what shows. Initials are Base 16px
 * at 32, XS 12px at 24 and XXS 10px at 12.
 */
export const Variants: Story = {
  render: (_, ctx) => {
    const styles: Array<[string, Partial<AvatarProps>]> = [
      ["Image", { variant: "image", src: PHOTO, name: copy(ctx).name }],
      ["Initials", { variant: "initials", src: PHOTO, name: copy(ctx).name }],
      ["Icon", { variant: "icon", src: PHOTO, name: copy(ctx).name }],
    ]
    return (
      <div className="flex flex-col gap-8">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col gap-3">
            <span className="text-xs text-muted-foreground">
              {size}px
            </span>
            <div className="flex flex-wrap gap-x-8 gap-y-6">
              {styles.map(([label, props]) => (
                <div key={label} className="flex flex-col gap-3">
                  <span className="text-xs text-muted-foreground">
                    {label}
                  </span>
                  <div className="grid grid-cols-4 items-center gap-4">
                    {RADII.flatMap((radius) =>
                      [false, true].map((border) => (
                        <Avatar
                          key={`${radius}-${border}`}
                          size={size}
                          radius={radius}
                          border={border}
                          status="online"
                          {...props}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  },
}

/**
 * The dot takes its size from the avatar: 8px at 32 and 24, 4px at 12. One
 * grid, so every column — radius × status — stays centred across the three
 * sizes; `dir="rtl"` mirrors it. Below `sm` each row wraps to 4 columns, one
 * radius per line.
 */
export const Status: Story = {
  render: (_, ctx) => (
    <div className="grid grid-cols-4 place-items-center gap-x-6 gap-y-6 sm:grid-cols-8">
      {SIZES.flatMap((size) =>
        RADII.flatMap((radius) =>
          (["online", "away", "busy", "offline"] as const).map((status) => (
            <Avatar
              key={`${size}-${radius}-${status}`}
              size={size}
              radius={radius}
              src={PHOTO}
              name={copy(ctx).name}
              status={status}
            />
          ))
        )
      )}
    </div>
  ),
}
