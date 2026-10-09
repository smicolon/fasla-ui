"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { Badge } from "@fasla-ui/ui/badge"
import { Avatar } from "@fasla-ui/ui/avatar"
import { ComponentPreview, CodeBlock, UsageExample } from "@/components/component-preview"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const VARIANTS = ["solid", "soft", "outline"] as const
const TONES = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const FILTER_KEYS = ["a", "b", "c", "d"] as const

/** Any 24-grid SVG with no size or colour of its own; the badge sets both. */
function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
    </svg>
  )
}

/**
 * The library's Avatar, as the Figma Badge uses it: Size 12, Rounded, Image, no
 * border, no dot. The photo is the Avatar set's own illustration. An empty
 * `name` makes it silent, for when the label already names the person.
 */
function sampleAvatar(name: string) {
  return <Avatar size="12" radius="rounded" src="/samples/avatar-portrait.png" name={name} />
}

export default function BadgePage() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.badge")

  const allFilters = FILTER_KEYS.map((key) => b(`filters.${key}`))
  const [filters, setFilters] = useState(allFilters)

  // Literal markup, passed as values so ICU does not parse it as tags.
  const rich = {
    ...richCode,
    span: "<span>",
    button: "<button>",
    emptyName: 'name=""',
    radiusStandard: 'radius="standard"',
  }

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: b.rich("props.children", rich) },
    { prop: "variant", type: '"solid" | "soft" | "outline"', fallback: '"solid"', description: b.rich("props.variant", rich) },
    { prop: "tone", type: '"primary" | "secondary" | "info" | "success" | "warning" | "destructive"', fallback: '"primary"', description: b.rich("props.tone", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"sm"', description: b.rich("props.size", rich) },
    { prop: "radius", type: '"rounded" | "standard"', fallback: '"rounded"', description: b.rich("props.radius", rich) },
    { prop: "icon", type: "ReactNode", fallback: "", description: b.rich("props.icon", rich) },
    { prop: "avatar", type: "ReactNode", fallback: "", description: b.rich("props.avatar", rich) },
    { prop: "onClose", type: "(event) => void", fallback: "", description: b.rich("props.onClose", rich) },
    { prop: "closeLabel", type: "string", fallback: "", description: b.rich("props.closeLabel", rich) },
    { prop: "className", type: "string", fallback: "", description: b.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/badge/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        {/*
         * `@smicolon/cli` is the installer. `@smicolon/fasla-ui` also ships a
         * `fasla-ui` binary, but it is a repo-only scaffold, and `fasla-ui` is
         * not a package on npm. `init` writes components.json, which `add` needs.
         */}
        <CodeBlock language="bash">{`npx @smicolon/cli init
npx @smicolon/cli add badge`}</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{b("preview.new")}</Badge>
            <Badge variant="soft" tone="success">
              {b("preview.paid")}
            </Badge>
            <Badge variant="outline" tone="warning" icon={<StarIcon />}>
              {b("preview.featured")}
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{b.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-3">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-2">
                {TONES.map((tone) => (
                  <Badge key={tone} variant={variant} tone={tone}>
                    {b(`tones.${tone}`)}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </ComponentPreview>
        <p className="text-muted-foreground">{b.rich("radiusBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Badge radius="rounded">{b("radius")}</Badge>
            <Badge radius="standard">{b("radius")}</Badge>
            <Badge variant="soft" radius="standard">
              {b("radius")}
            </Badge>
            <Badge variant="outline" radius="standard">
              {b("radius")}
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{b("sizesBody")}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm" icon={<StarIcon />}>
              {b("sizes")}
            </Badge>
            <Badge size="md" icon={<StarIcon />}>
              {b("sizes")}
            </Badge>
            <Badge size="lg" icon={<StarIcon />}>
              {b("sizes")}
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{b.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className="flex min-h-7 flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant="soft"
                onClose={() => setFilters((all) => all.filter((f) => f !== filter))}
              >
                {filter}
              </Badge>
            ))}
            {filters.length === 0 && (
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => setFilters(allFilters)}
              >
                {b("reset")}
              </button>
            )}
          </div>
        </ComponentPreview>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={<StarIcon />}>{b("examples.featured")}</Badge>
            <Badge variant="soft" avatar={sampleAvatar("")}>
              {b("examples.person")}
            </Badge>
            <Badge
              variant="outline"
              icon={<StarIcon />}
              avatar={sampleAvatar(b("examples.person"))}
              onClose={() => {}}
            >
              {b("examples.reviewer")}
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{b.rich("a11y.span", rich)}</li>
          <li>{b.rich("a11y.closeName", rich)}</li>
          <li>{b.rich("a11y.icon", rich)}</li>
          <li>{b.rich("a11y.tone", rich)}</li>
          <li>{b.rich("a11y.dir", rich)}</li>
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
        <UsageExample title={b("usage.tones")}>{`import { Badge } from "@/components/ui/badge"

export function OrderBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>${b("usage.new")}</Badge>
      <Badge variant="soft" tone="success">${b("usage.paid")}</Badge>
      <Badge variant="outline" tone="destructive" size="md">${b("usage.overdue")}</Badge>
    </div>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.iconAvatar")}>{`import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

const user = { name: "${b("examples.person")}", photo: "/avatars/layla.jpg" }

export function ReviewerBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge icon={<Star />}>${b("usage.featured")}</Badge>
      <Badge avatar={<Avatar size="12" radius="rounded" src={user.photo} name="" />}>
        {user.name}
      </Badge>
    </div>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.removable")}>{`"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export function FilterBadges() {
  const [filters, setFilters] = useState(["${allFilters[0]}", "${allFilters[1]}", "${allFilters[2]}"])
  const remove = (filter: string) => setFilters((current) => current.filter((f) => f !== filter))

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Badge
          key={filter}
          variant="soft"
          onClose={() => remove(filter)}
          closeLabel={\`${b("usage.removeFilter")}: \${filter}\`}
        >
          {filter}
        </Badge>
      ))}
    </div>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
