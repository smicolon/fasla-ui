"use client"

import { useTranslations } from "next-intl"

import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from "@fasla-ui/ui/skeleton"
import { ComponentPreview } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

export default function SkeletonPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.skeleton")

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "circular" | "rectangular"', fallback: '"default"', description: s.rich("props.variant", richCode) },
    { prop: "animate", type: "boolean", fallback: "true", description: s.rich("props.animate", richCode) },
    { prop: "lines", type: "number", fallback: "3", description: s.rich("props.lines", richCode) },
    { prop: "className", type: "string", fallback: "", description: s.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/skeleton/" /></h1>
        <p className="text-xl text-muted-foreground">{s("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="skeleton" />
      </section>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("basicTitle")}</h2>
        <ComponentPreview>
          <Skeleton className="h-12 w-48" />
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <Skeleton variant="default" className="h-12 w-24" />
            <Skeleton variant="circular" className="h-12 w-12" />
            <Skeleton variant="rectangular" className="h-12 w-24" />
          </div>
        </ComponentPreview>
      </section>

      {/* Text Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("textTitle")}</h2>
        <ComponentPreview>
          <SkeletonText lines={3} className="max-w-sm" />
        </ComponentPreview>
      </section>

      {/* Avatar Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("avatarTitle")}</h2>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <SkeletonAvatar />
            <SkeletonAvatar className="h-16 w-16" />
          </div>
        </ComponentPreview>
      </section>

      {/* Card Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("cardTitle")}</h2>
        <ComponentPreview>
          <SkeletonCard className="max-w-sm" />
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>
    </div>
  )
}
