"use client"

import { useTranslations } from "next-intl"

import { Avatar } from "@fasla-ui/ui/avatar"
import { ComponentPreview, CodeBlock, UsageExample } from "@/components/component-preview"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

/** The Avatar set's own illustration, exported from Figma. */
const PHOTO = "/samples/avatar-portrait.png"

const SIZES = ["32", "24", "12"] as const
const STATUSES = ["online", "away", "busy", "offline"] as const

export default function AvatarPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.avatar")

  // The same person in both locales, named in the page's language.
  const person = a("person")
  const rich = { ...richCode, emptyName: 'name=""' }

  const props: PropRow[] = [
    { prop: "variant", type: '"image" | "initials" | "icon"', fallback: '"image"', description: a.rich("props.variant", rich) },
    { prop: "size", type: '"32" | "24" | "12"', fallback: '"32"', description: a.rich("props.size", rich) },
    { prop: "radius", type: '"standard" | "rounded"', fallback: '"standard"', description: a.rich("props.radius", rich) },
    { prop: "border", type: "boolean", fallback: "false", description: a.rich("props.border", rich) },
    { prop: "src", type: "string", fallback: "", description: a.rich("props.src", rich) },
    { prop: "name", type: "string", fallback: "", description: a.rich("props.name", rich) },
    { prop: "status", type: '"online" | "away" | "busy" | "offline"', fallback: "", description: a.rich("props.status", rich) },
    { prop: "statusLabel", type: "string", fallback: "", description: a.rich("props.statusLabel", rich) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/avatar/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <CodeBlock language="bash">{`npx @smicolon/fasla-ui@latest init
npx @smicolon/fasla-ui@latest add avatar status-indicator`}</CodeBlock>
        <p className="text-muted-foreground">{a.rich("installNote", rich)}</p>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Avatar src={PHOTO} name={person} />
            <Avatar name={person} />
            <Avatar />
            <Avatar src={PHOTO} name={person} radius="rounded" status="online" />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{a.rich("variantsBody", rich)}</p>
        <p className="text-muted-foreground">{a("fallback")}</p>
        <ComponentPreview>
          <div className="grid grid-cols-4 items-center gap-4">
            {(["standard", "rounded"] as const).flatMap((radius) =>
              [false, true].flatMap((border) => [
                <Avatar key={`${radius}-${border}-i`} variant="image" radius={radius} border={border} src={PHOTO} name={person} />,
                <Avatar key={`${radius}-${border}-n`} variant="initials" radius={radius} border={border} src={PHOTO} name={person} />,
                <Avatar key={`${radius}-${border}-u`} variant="icon" radius={radius} border={border} src={PHOTO} name={person} />,
                // Prop values stay code in both locales, so the label needs no translation.
                <span key={`${radius}-${border}-l`} className="text-xs text-muted-foreground">
                  <code>{radius}</code>
                  {border && (
                    <>
                      {" + "}
                      <code>border</code>
                    </>
                  )}
                </span>,
              ])
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{a("sizesBody")}</p>
        <ComponentPreview>
          <div className="flex items-end gap-4">
            {SIZES.map((size) => (
              <div key={size} className="flex items-end gap-2">
                <Avatar size={size} src={PHOTO} name={person} />
                <Avatar size={size} name={person} />
                <Avatar size={size} />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Status */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("statusTitle")}</h2>
        <p className="text-muted-foreground">{a.rich("statusBody", rich)}</p>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            {STATUSES.map((status) => (
              <Avatar key={status} src={PHOTO} name={person} status={status} />
            ))}
            <Avatar size="12" src={PHOTO} name={person} status="online" />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{a.rich("a11y.name", rich)}</li>
          <li>{a.rich("a11y.empty", rich)}</li>
          <li>{a.rich("a11y.dot", rich)}</li>
          <li>{a.rich("a11y.dir", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={a("usage.photo")}>{`import { Avatar } from "@/components/ui/avatar"

const user = { name: "${a("usage.sampleName")}", photo: "/avatars/layla.jpg" }

export function UserAvatar() {
  return <Avatar src={user.photo} name={user.name} />
}`}</UsageExample>
        <UsageExample title={a("usage.initials")}>{`import { Avatar } from "@/components/ui/avatar"

const user = { name: "${a("usage.sampleName")}" }

export function UserAvatarWithoutPhoto() {
  return (
    <div className="flex items-center gap-4">
      <Avatar variant="initials" name={user.name} />
      <Avatar variant="icon" name={user.name} />
    </div>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.lazy")}>{`import { Avatar } from "@/components/ui/avatar"

const user = {
  name: "${a("usage.sampleName")}",
  photo: "/avatars/layla.jpg",
  photo2x: "/avatars/layla@2x.jpg",
}

export function LazyUserAvatar() {
  return (
    <Avatar
      src={user.photo}
      srcSet={\`\${user.photo} 1x, \${user.photo2x} 2x\`}
      loading="lazy"
      name={user.name}
    />
  )
}`}</UsageExample>
        <UsageExample title={a("usage.circle")}>{`import { Avatar } from "@/components/ui/avatar"

const user = { name: "${a("usage.sampleName")}", photo: "/avatars/layla.jpg" }

export function OnlineUserAvatar() {
  return <Avatar src={user.photo} name={user.name} radius="rounded" border status="online" />
}`}</UsageExample>
        <UsageExample title={a("usage.inline")}>{`import { Avatar } from "@/components/ui/avatar"

const user = { name: "${a("usage.sampleName")}", photo: "/avatars/layla.jpg" }

export function UserByline() {
  return (
    <span className="inline-flex items-center gap-2">
      <Avatar size="12" src={user.photo} name="" />
      {user.name}
    </span>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
