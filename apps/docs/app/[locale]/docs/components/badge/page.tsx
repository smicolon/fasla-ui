"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { Badge } from "@fasla-ui/ui/badge"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

const VARIANTS = ["solid", "soft", "outline"] as const
const TONES = ["primary", "secondary", "info", "success", "warning", "destructive"] as const
const FILTERS = ["Design", "Engineering", "Research", "Marketing"]

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
 * A placeholder portrait, not the library's Avatar, which is being rebuilt.
 * Inline rather than an image file so it takes theme tokens and follows the
 * mode. The badge owns the 12px size and the circular clip; an empty `alt`
 * marks it decorative, for when the label already names the person.
 */
function sampleAvatar(alt: string) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-full"
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
    >
      <rect width="48" height="48" className="fill-muted" />
      <circle cx="24" cy="19" r="9" className="fill-muted-foreground" />
      <path d="M6 48c1.5-10 9-16 18-16s16.5 6 18 16Z" className="fill-muted-foreground" />
    </svg>
  )
}

const PROPS = [
  ["children", "ReactNode — the label", "—"],
  ["variant", "solid | soft | outline", "solid"],
  ["tone", "primary | secondary | info | success | warning | destructive", "primary"],
  ["size", "sm | md | lg", "sm"],
  ["radius", "rounded | standard", "rounded"],
  ["icon", "ReactNode", "—"],
  ["avatar", "ReactNode", "—"],
  ["onClose", "(event) => void", "—"],
  ["closeLabel", "string", "\"Remove {label}\" / \"إزالة {label}\""],
] as const

export default function BadgePage() {
  const t = useTranslations("docs.sections")
  const [filters, setFilters] = useState(FILTERS)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Badge</h1>
        {/*
         * `dir="ltr"` on every English run: the page prose is untranslated, and
         * in the Arabic locale a trailing full stop is bidi-neutral and would
         * jump to the head of the line.
         */}
        <p dir="ltr" className="text-xl text-muted-foreground">
          A compact inline label for status, category or metadata, with an optional
          icon, avatar and close button.
        </p>
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
            <Badge>Badge</Badge>
            <Badge variant="soft" tone="success">
              Paid
            </Badge>
            <Badge variant="outline" tone="warning" icon={<StarIcon />}>
              Featured
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          <code className="text-sm">variant</code> sets the visual weight and{" "}
          <code className="text-sm">tone</code> the meaning. Solid is the loudest; Soft
          lays a tint over the card surface, so it reads the same wherever it sits;
          Outline is the quietest.
        </p>
        <ComponentPreview>
          <div className="flex flex-col gap-3">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-wrap items-center gap-2">
                {TONES.map((tone) => (
                  <Badge key={tone} variant={variant} tone={tone}>
                    {tone[0]!.toUpperCase() + tone.slice(1)}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </ComponentPreview>
        <p dir="ltr" className="text-muted-foreground">
          <code className="text-sm">radius=&quot;standard&quot;</code> swaps the pill for
          the design system&apos;s small radius.
        </p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Badge radius="rounded">Rounded</Badge>
            <Badge radius="standard">Standard</Badge>
            <Badge variant="soft" radius="standard">
              Standard
            </Badge>
            <Badge variant="outline" radius="standard">
              Standard
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          Heights are minimums: 20, 22 and 26px in English. Arabic&apos;s taller line
          grows them to 24, 24 and 28px rather than squeezing the text.
        </p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            <Badge size="sm" icon={<StarIcon />}>
              Small
            </Badge>
            <Badge size="md" icon={<StarIcon />}>
              Medium
            </Badge>
            <Badge size="lg" icon={<StarIcon />}>
              Large
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          Pass <code className="text-sm">onClose</code> and the badge gets a real close
          button. Tab to one to see the focus ring, which wraps the whole badge 2px out.
        </p>
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
                dir="ltr"
                className="text-sm text-muted-foreground underline"
                onClick={() => setFilters(FILTERS)}
              >
                Reset filters
              </button>
            )}
          </div>
        </ComponentPreview>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={<StarIcon />}>Featured</Badge>
            <Badge variant="soft" avatar={sampleAvatar("")}>
              Layla
            </Badge>
            <Badge
              variant="outline"
              icon={<StarIcon />}
              avatar={sampleAvatar("Layla")}
              onClose={() => {}}
            >
              Reviewer
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul dir="ltr" className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>
            The badge is a plain <code className="text-sm">&lt;span&gt;</code>. Only the
            close button is interactive, and it is a native{" "}
            <code className="text-sm">&lt;button&gt;</code>.
          </li>
          <li>
            The close button is named after the label, &quot;Remove Cairo&quot;, or
            &quot;إزالة القاهرة&quot; when the nearest <code className="text-sm">lang</code>{" "}
            is Arabic. It follows a language change without a reload. Pass{" "}
            <code className="text-sm">closeLabel</code> for more context, such as
            &quot;Remove filter: Cairo&quot;.
          </li>
          <li>
            The icon is decorative and hidden from assistive technology. The avatar is
            not: give its image an <code className="text-sm">alt</code>, or{" "}
            <code className="text-sm">alt=&quot;&quot;</code> when the label already
            names the person.
          </li>
          <li>
            Don&apos;t rely on tone alone to carry meaning — the label should say it.
          </li>
          <li>
            Direction is inherited from <code className="text-sm">dir</code>, never a
            prop, so the badge can never disagree with the page.
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
        <CodeBlock>{`import { Badge } from "@/components/ui/badge"

<Badge>New</Badge>
<Badge variant="soft" tone="success">Paid</Badge>
<Badge variant="outline" tone="destructive" size="md">Overdue</Badge>

// Icon and avatar — the badge sizes and colours them
<Badge icon={<Star />}>Featured</Badge>
<Badge avatar={<img src={user.photo} alt="" />}>{user.name}</Badge>

// Removable
<Badge variant="soft" onClose={() => remove(tag)} closeLabel={\`Remove filter: \${tag}\`}>
  {tag}
</Badge>`}</CodeBlock>
      </section>
    </div>
  )
}
