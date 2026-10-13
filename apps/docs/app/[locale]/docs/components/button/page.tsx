"use client"

import { useTranslations } from "next-intl"
import { ArrowRightIcon, DownloadIcon, UploadIcon, XIcon } from "lucide-react"

import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "soft", "link"] as const
const TONES = ["primary", "secondary", "destructive"] as const
/** Figma's Types, each reached through one variant plus `tone`. */
const TYPES = ["default", "soft", "outline", "ghost", "link"] as const
const SIZES = ["xs", "sm", "default", "lg"] as const

export default function ButtonPage() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.button")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; `nowrap` keeps each one a single unit.
  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  const props: PropRow[] = [
    {
      prop: "variant",
      type: '"default" | "secondary" | "destructive" | "outline" | "ghost" | "soft" | "link"',
      fallback: '"default"',
      description: b.rich("props.variant", rich),
    },
    { prop: "tone", type: '"primary" | "secondary" | "destructive"', fallback: "", description: b.rich("props.tone", rich) },
    {
      prop: "size",
      type: '"xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg"',
      fallback: '"default"',
      description: b.rich("props.size", rich),
    },
    { prop: "radius", type: '"standard" | "rounded"', fallback: '"standard"', description: b.rich("props.radius", rich) },
    { prop: "loading", type: "boolean", fallback: "false", description: b.rich("props.loading", rich) },
    { prop: "loadingLabel", type: "string", fallback: '"Loading"', description: b.rich("props.loadingLabel", rich) },
    { prop: "disabled", type: "boolean", fallback: "false", description: b.rich("props.disabled", rich) },
    { prop: "asChild", type: "boolean", fallback: "false", description: b.rich("props.asChild", rich) },
    { prop: "onClick", type: "(event) => void", fallback: "", description: b.rich("props.onClick", rich) },
    { prop: "className", type: "string", fallback: "", description: b.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/button/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="button" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            <Button>{b("preview")}</Button>
            <Button variant="outline">{b("cancel")}</Button>
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{b.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {b(`variants.${variant}`)}
              </Button>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Tones */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("tones.title")}</h2>
        <p className="text-muted-foreground">{b.rich("tones.body", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full grid-cols-[max-content_1fr] items-start gap-x-4 gap-y-3">
            {TYPES.map((variant) => (
              <div key={variant} className="contents">
                <code className="flex h-8 w-fit items-center text-sm text-muted-foreground">{variant}</code>
                <div className="flex flex-wrap items-center gap-2">
                  {TONES.map((tone) => (
                    <Button key={tone} variant={variant} tone={tone} size="sm">
                      {b(`tones.${tone}`)}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{b.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            {SIZES.map((size) => (
              <Button key={size} size={size}>
                {b(`sizes.${size}`)}
              </Button>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Radius */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("radius.title")}</h2>
        <p className="text-muted-foreground">{b.rich("radius.body", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            <Button radius="standard">{b("preview")}</Button>
            <Button radius="rounded">{b("preview")}</Button>
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{b.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full grid-cols-[max-content_1fr] items-start gap-x-4 gap-y-3">
            <span className="flex h-8 items-center text-sm text-muted-foreground">{b("states.enabled")}</span>
            <div className="flex flex-wrap items-center gap-2">
              {TYPES.map((variant) => (
                <Button key={variant} variant={variant} size="sm">
                  {b(`variants.${variant}`)}
                </Button>
              ))}
            </div>
            <span className="flex h-8 items-center text-sm text-muted-foreground">{b("states.disabled")}</span>
            <div className="flex flex-wrap items-center gap-2">
              {TYPES.map((variant) => (
                <Button key={variant} variant={variant} size="sm" disabled>
                  {b(`variants.${variant}`)}
                </Button>
              ))}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Link or ghost */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("link.title")}</h2>
        <p className="text-muted-foreground">{b.rich("link.body", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-3">
              <span className="text-sm text-muted-foreground">{b("link.ghostLabel")}</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="icon" aria-label={b("link.close")}>
                  <XIcon aria-hidden="true" strokeWidth={1.5} />
                </Button>
                <Button variant="ghost">{b("link.edit")}</Button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="text-sm text-muted-foreground">{b("link.linkLabel")}</span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Button variant="link" asChild>
                  <a href="#forgot-password">{b("link.forgot")}</a>
                </Button>
                <Button variant="link" asChild>
                  <a href="#learn-more">{b("link.learnMore")}</a>
                </Button>
                <Button variant="link" asChild>
                  <a href="#view-all">{b("link.viewAll")}</a>
                </Button>
              </div>
            </div>
            {/* The other half of the rule: inside a sentence, a plain text link. */}
            <p className="text-sm sm:col-span-2">
              {b.rich("link.sentence", {
                link: (chunks) => (
                  <a href="#privacy" className="font-medium underline underline-offset-4">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </ComponentPreview>
      </section>

      {/* With icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("icons.title")}</h2>
        <p className="text-muted-foreground">{b.rich("icons.body", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <UploadIcon aria-hidden="true" strokeWidth={1.5} />
              {b("icons.upload")}
            </Button>
            <Button variant="outline">
              {b("icons.download")}
              <DownloadIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
            <Button variant="soft" tone="secondary">
              {b("icons.next")}
              <ArrowRightIcon aria-hidden="true" className="rtl:-scale-x-100" strokeWidth={1.5} />
            </Button>
          </div>
        </ComponentPreview>
      </section>

      {/* Loading */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("loadingTitle")}</h2>
        <p className="text-muted-foreground">{b.rich("loadingBody", rich)}</p>
        <ComponentPreview>
          <Button loading loadingLabel={b("loadingLabel")}>
            {b("loading")}
          </Button>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{b.rich("a11y.nativeButton", rich)}</li>
          <li>{b.rich("a11y.focus", rich)}</li>
          <li>{b.rich("a11y.asChild", rich)}</li>
          <li>{b.rich("a11y.loading", rich)}</li>
          <li>{b.rich("a11y.direction", rich)}</li>
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
        <UsageExample title={b("usage.basic")}>{`import { Button } from "@/components/ui/button"

export function SaveButton() {
  return <Button type="submit">${b("preview")}</Button>
}`}</UsageExample>
        <UsageExample title={b("usage.tone")}>{`import { Button } from "@/components/ui/button"

export function DeleteAccountButton() {
  return (
    <Button variant="outline" tone="destructive">
      ${b("variants.destructive")}
    </Button>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.link")}>{`import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ForgotPasswordLink() {
  return (
    <Button variant="link" asChild>
      <Link href="/forgot-password">${b("link.forgot")}</Link>
    </Button>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.icon")}>{`import { UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UploadButton() {
  return (
    <Button>
      <UploadIcon aria-hidden="true" strokeWidth={1.5} />
      ${b("icons.upload")}
    </Button>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.loading")}>{`import { Button } from "@/components/ui/button"

export function SavingButton() {
  return (
    <Button loading loadingLabel="${b("loadingLabel")}">
      ${b("loading")}
    </Button>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
