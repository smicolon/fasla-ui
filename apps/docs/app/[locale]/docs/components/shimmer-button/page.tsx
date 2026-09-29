"use client"

import { useTranslations } from "next-intl"

import { ShimmerButton } from "@fasla-ui/effects/shimmer-button"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const A11Y = ["button", "motion", "dir", "contrast"] as const

export default function ShimmerButtonPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.shimmerButton")

  // Literal markup, passed as a value so ICU does not parse it as a tag.
  const rich = { ...richCode, button: "<button>" }

  const props: PropRow[] = [
    { prop: "children", type: "ReactNode", fallback: "", description: s.rich("props.children", rich) },
    { prop: "shimmerColor", type: "string", fallback: '"color-mix(in oklch, var(--primary-foreground) 35%, transparent)"', description: s.rich("props.shimmerColor", rich) },
    { prop: "shimmerDuration", type: "string", fallback: '"2s"', description: s.rich("props.shimmerDuration", rich) },
    { prop: "shimmerSize", type: "string", fallback: '"100%"', description: s.rich("props.shimmerSize", rich) },
    { prop: "background", type: "string", fallback: '"var(--primary)"', description: s.rich("props.background", rich) },
    { prop: "borderRadius", type: "string", fallback: '"0.5rem"', description: s.rich("props.borderRadius", rich) },
    { prop: "...props", type: "ButtonHTMLAttributes", fallback: "", description: s.rich("props.native", rich) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", rich) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/shimmer-button/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="shimmer-button" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <ShimmerButton>{s("preview")}</ShimmerButton>
        </ComponentPreview>
      </section>

      {/* Custom colours */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("coloursTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("coloursBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-center gap-4">
            <ShimmerButton
              background="linear-gradient(135deg, var(--chart-2), var(--chart-3))"
              shimmerColor="color-mix(in oklch, var(--primary-foreground) 35%, transparent)"
              shimmerSize="40%"
              shimmerDuration="1.5s"
            >
              {s("colours.a")}
            </ShimmerButton>
            <ShimmerButton
              background="linear-gradient(135deg, var(--chart-1), var(--chart-5))"
              shimmerColor="color-mix(in oklch, var(--primary-foreground) 35%, transparent)"
              shimmerDuration="1.5s"
            >
              {s("colours.b")}
            </ShimmerButton>
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          {A11Y.map((key) => (
            <li key={key}>{s.rich(`a11y.${key}`, rich)}</li>
          ))}
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
        <CodeBlock>{`import { ShimmerButton } from "@/components/ui/shimmer-button"

<ShimmerButton>${s("preview")}</ShimmerButton>

<ShimmerButton
  background="linear-gradient(135deg, var(--chart-2), var(--chart-3))"
  shimmerColor="color-mix(in oklch, var(--primary-foreground) 35%, transparent)"
  shimmerSize="40%"
>
  ${s("colours.a")}
</ShimmerButton>`}</CodeBlock>
      </section>
    </div>
  )
}
