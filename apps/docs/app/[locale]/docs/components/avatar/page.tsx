"use client"

import { useTranslations } from "next-intl"

import { Avatar } from "@fasla-ui/ui/avatar"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

/** The Avatar set's own illustration, exported from Figma. */
const PHOTO = "/samples/avatar-portrait.png"
const SIZES = ["32", "24", "12"] as const
const STATUSES = ["online", "away", "busy", "offline"] as const

const PROPS = [
  ["variant", "\"image\" | \"initials\" | \"icon\"", "\"image\""],
  ["size", "\"32\" | \"24\" | \"12\"", "\"32\""],
  ["radius", "\"standard\" | \"rounded\"", "\"standard\""],
  ["border", "boolean", "false"],
  ["src", "string", "—"],
  ["name", "string", "—"],
  ["status", "\"online\" | \"away\" | \"busy\" | \"offline\"", "— (no dot)"],
  ["statusLabel", "string", "the status in the page's language"],
] as const

export default function AvatarPage() {
  const t = useTranslations("docs.sections")
  const tAvatar = useTranslations("docs.avatar")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Avatar</h1>
        {/*
         * `dir="ltr"` on every English run: the page prose is untranslated, and
         * in the Arabic locale a trailing full stop is bidi-neutral and would
         * jump to the head of the line.
         */}
        <p dir="ltr" className="text-xl text-muted-foreground">
          A person&apos;s photo, initials or icon, with an optional border and
          presence dot.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <CodeBlock language="bash">{`npx @smicolon/cli init
npx @smicolon/cli add avatar`}</CodeBlock>
        <p dir="ltr" className="text-muted-foreground">
          This also adds <code className="text-sm">status-indicator</code>, which the
          avatar uses for its dot.
        </p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Avatar src={PHOTO} name="Vera Brandt" />
            <Avatar name="Vera Brandt" />
            <Avatar />
            <Avatar src={PHOTO} name="Vera Brandt" radius="rounded" status="online" />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          <code className="text-sm">variant</code> picks the content, as Figma&apos;s Style
          does. <code className="text-sm">image</code>, the default, shows the photo, and
          while it loads or if it fails falls back to initials from{" "}
          <code className="text-sm">name</code>, then to the user icon when there is no name.{" "}
          <code className="text-sm">initials</code> and <code className="text-sm">icon</code>{" "}
          show theirs even when a photo is passed. <code className="text-sm">radius</code>{" "}
          picks a rounded square or a circle, and <code className="text-sm">border</code> adds
          a ring inside the edge.
        </p>
        {/* Translated, unlike the page prose, so it takes the locale's direction. */}
        <p className="text-muted-foreground">{tAvatar("fallback")}</p>
        <ComponentPreview>
          <div className="grid grid-cols-4 items-center gap-4">
            {(["standard", "rounded"] as const).flatMap((radius) =>
              [false, true].flatMap((border) => [
                <Avatar key={`${radius}-${border}-i`} variant="image" radius={radius} border={border} src={PHOTO} name="Vera Brandt" />,
                <Avatar key={`${radius}-${border}-n`} variant="initials" radius={radius} border={border} src={PHOTO} name="Vera Brandt" />,
                <Avatar key={`${radius}-${border}-u`} variant="icon" radius={radius} border={border} src={PHOTO} name="Vera Brandt" />,
                <span key={`${radius}-${border}-l`} className="text-xs text-muted-foreground">
                  {radius}
                  {border ? " · border" : ""}
                </span>,
              ])
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          32 for headers, cards and comments; 24 for dense tables and lists; 12 for inline
          mentions, where initials shrink to one letter at the 10px XXS size.
        </p>
        <ComponentPreview>
          <div className="flex items-end gap-4">
            {SIZES.map((size) => (
              <div key={size} className="flex items-end gap-2">
                <Avatar size={size} src={PHOTO} name="Vera Brandt" />
                <Avatar size={size} name="Vera Brandt" />
                <Avatar size={size} />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Status */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Status</h2>
        <p dir="ltr" className="text-muted-foreground">
          <code className="text-sm">status</code> adds a Status Indicator at the end corner —
          bottom-right, or bottom-left in a right-to-left page. There is no dot unless you
          set one: it claims the person&apos;s presence, so show it only when you know it.
        </p>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            {STATUSES.map((status) => (
              <Avatar key={status} src={PHOTO} name="Vera Brandt" status={status} />
            ))}
            <Avatar size="12" src={PHOTO} name="Vera Brandt" status="online" />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul dir="ltr" className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>
            <code className="text-sm">name</code> names the avatar in every variant: it is
            the photo&apos;s <code className="text-sm">alt</code>, and hidden text behind the
            initials or icon, whose visible letters are not read out.
          </li>
          <li>
            Pass <code className="text-sm">name=&quot;&quot;</code> when a label beside the
            avatar already names the person, so it isn&apos;t announced twice.
          </li>
          <li>
            The dot is read after the name — &quot;Vera Brandt&quot;, then
            &quot;Online&quot;, or &quot;متصل&quot; when the nearest{" "}
            <code className="text-sm">lang</code> is Arabic. Pass <code className="text-sm">statusLabel</code> to say more.
          </li>
          <li>
            Direction is inherited from <code className="text-sm">dir</code>, never a prop,
            so the dot always sits on the right corner for the page.
          </li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <div dir="ltr" className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-start font-semibold">Prop</th>
                <th className="px-4 py-2 text-start font-semibold">Type</th>
                <th className="px-4 py-2 text-start font-semibold">Default</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map(([prop, type, fallback]) => (
                <tr key={prop} className="border-b">
                  <td className="px-4 py-2 font-mono text-xs">{prop}</td>
                  <td className="px-4 py-2 font-mono text-xs">{type}</td>
                  <td className="px-4 py-2 font-mono text-xs">{fallback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { Avatar } from "@/components/ui/avatar"

// Photo, falling back to initials, then the user icon
<Avatar src={user.photo} name={user.name} />

// Initials or the icon, whatever else is passed
<Avatar variant="initials" name={user.name} />
<Avatar variant="icon" name={user.name} />

// Long lists: defer photos below the fold, and give dense screens a sharper source
<Avatar src={user.photo} srcSet={\`\${user.photo} 1x, \${user.photo2x} 2x\`} loading="lazy" name={user.name} />

// Circle with a border and a presence dot
<Avatar src={user.photo} name={user.name} radius="rounded" border status="online" />

// Inline, beside a name that already says who it is
<Avatar size="12" src={user.photo} name="" /> {user.name}`}</CodeBlock>
      </section>
    </div>
  )
}
