"use client"

import { useTranslations } from "next-intl"
import { EllipsisIcon, HeartIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"

import { Button } from "@fasla-ui/ui/button"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"

/** Figma's Icon Button Types: Button's, without Link. */
const TYPES = ["default", "soft", "outline", "ghost"] as const
const TONES = ["primary", "secondary", "destructive"] as const
const SIZES = ["icon-xs", "icon-sm", "icon-md", "icon-lg"] as const

export default function IconButtonPage() {
  const t = useTranslations("docs.sections")
  const b = useTranslations("docs.iconButton")

  const code = (chunks: React.ReactNode) => <code className="whitespace-nowrap text-sm">{chunks}</code>
  const rich = { code }

  // `secondary` and `destructive` (variant) and `icon` (size) still work for
  // shadcn compatibility; the note under the table says so.
  const props: PropRow[] = [
    { prop: "tone", type: '"primary" | "secondary" | "destructive"', fallback: "", description: b.rich("props.tone", rich) },
    {
      prop: "variant",
      type: '"default" | "outline" | "ghost" | "soft"',
      fallback: '"default"',
      description: b.rich("props.variant", rich),
    },
    { prop: "size", type: '"icon-xs" | "icon-sm" | "icon-md" | "icon-lg"', fallback: "", description: b.rich("props.size", rich) },
    { prop: "aria-label", type: "string", fallback: "", description: b.rich("props.ariaLabel", rich) },
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
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/icon-button/" /></h1>
        <p className="text-xl text-muted-foreground">{b("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <p className="text-muted-foreground">{b.rich("installNote", rich)}</p>
        <InstallCommand name="button" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="icon-md" aria-label={b("labels.add")}>
              <PlusIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
            <Button size="icon-md" variant="outline" aria-label={b("labels.like")}>
              <HeartIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
            <Button size="icon-md" variant="ghost" aria-label={b("labels.more")}>
              <EllipsisIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
          </div>
        </ComponentPreview>
      </section>

      {/* Variants and tones */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{b.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="grid grid-cols-[max-content_repeat(3,max-content)] items-center gap-x-4 gap-y-3">
            {TYPES.map((variant) => (
              <div key={variant} className="contents">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                {TONES.map((tone) => (
                  <Button key={tone} variant={variant} tone={tone} size="icon-md" aria-label={b("labels.like")}>
                    <HeartIcon aria-hidden="true" strokeWidth={1.5} />
                  </Button>
                ))}
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
              <Button key={size} size={size} variant="outline" aria-label={b("labels.add")}>
                <PlusIcon aria-hidden="true" strokeWidth={1.5} />
              </Button>
            ))}
            {SIZES.map((size) => (
              <Button key={size} size={size} variant="soft" radius="rounded" aria-label={b("labels.add")}>
                <PlusIcon aria-hidden="true" strokeWidth={1.5} />
              </Button>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{b.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className="grid w-full grid-cols-[max-content_1fr] items-start gap-x-4 gap-y-3">
            {(["enabled", "disabled"] as const).map((state) => (
              <div key={state} className="contents">
                <span className="flex h-9 items-center text-sm text-muted-foreground">{b(`states.${state}`)}</span>
                <div className="flex flex-wrap items-center gap-2">
                  {TYPES.map((variant) => (
                    <Button
                      key={variant}
                      variant={variant}
                      size="icon-md"
                      aria-label={b("labels.edit")}
                      disabled={state === "disabled"}
                    >
                      <PencilIcon aria-hidden="true" strokeWidth={1.5} />
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessible name */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{b("name.title")}</h2>
        <p className="text-muted-foreground">{b.rich("name.body", rich)}</p>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{b.rich("a11y.label", rich)}</li>
          <li>{b.rich("a11y.icon", rich)}</li>
          <li>{b.rich("a11y.focus", rich)}</li>
          <li>{b.rich("a11y.target", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
        <p className="text-sm text-muted-foreground">{b.rich("propsNote", rich)}</p>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={b("usage.basic")}>{`import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddButton() {
  return (
    <Button size="icon-md" aria-label="${b("labels.add")}">
      <PlusIcon aria-hidden="true" strokeWidth={1.5} />
    </Button>
  )
}`}</UsageExample>
        <UsageExample title={b("usage.toolbar")}>{`import { PencilIcon, Trash2Icon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RowActions() {
  return (
    <div className="flex items-center gap-1">
      <Button size="icon-sm" variant="ghost" aria-label="${b("labels.edit")}">
        <PencilIcon aria-hidden="true" strokeWidth={1.5} />
      </Button>
      <Button size="icon-sm" variant="ghost" tone="destructive" aria-label="${b("labels.delete")}">
        <Trash2Icon aria-hidden="true" strokeWidth={1.5} />
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="${b("labels.close")}">
        <XIcon aria-hidden="true" strokeWidth={1.5} />
      </Button>
    </div>
  )
}`}</UsageExample>
        {/* The toolbar example, live. */}
        <ComponentPreview>
          <div className="flex items-center gap-1">
            <Button size="icon-sm" variant="ghost" aria-label={b("labels.edit")}>
              <PencilIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
            <Button size="icon-sm" variant="ghost" tone="destructive" aria-label={b("labels.delete")}>
              <Trash2Icon aria-hidden="true" strokeWidth={1.5} />
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label={b("labels.close")}>
              <XIcon aria-hidden="true" strokeWidth={1.5} />
            </Button>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
