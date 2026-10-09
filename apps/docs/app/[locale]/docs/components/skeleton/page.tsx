"use client"

import { useTranslations } from "next-intl"

import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonListItem,
  SkeletonCard,
} from "@fasla-ui/ui/skeleton"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

// Every example uses Figma's own sizes: text and card at 210px, the list item
// at 373px. `max-w-full` lets them shrink on a narrow screen.
const TEXT_WIDTH = "w-[210px] max-w-full"
const LIST_ITEM_WIDTH = "w-[373px] max-w-full"

export default function SkeletonPage() {
  const t = useTranslations("docs.sections")
  const s = useTranslations("docs.skeleton")

  const props: PropRow[] = [
    { prop: "variant", type: '"default" | "circular" | "rectangular"', fallback: '"default"', description: s.rich("props.variant", richCode) },
    { prop: "animate", type: "boolean", fallback: "true", description: s.rich("props.animate", richCode) },
    { prop: "lines", type: "number", fallback: "2", description: s.rich("props.lines", richCode) },
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

      {/* List Item Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("listItemTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("listItemBody", richCode)}</p>
        <ComponentPreview>
          <SkeletonListItem className={LIST_ITEM_WIDTH} />
        </ComponentPreview>
      </section>

      {/* Card Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("cardTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("cardBody", richCode)}</p>
        <ComponentPreview>
          <SkeletonCard className={TEXT_WIDTH} />
        </ComponentPreview>
      </section>

      {/* Text Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("textTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("textBody", richCode)}</p>
        <ComponentPreview>
          <SkeletonText className={TEXT_WIDTH} />
        </ComponentPreview>
      </section>

      {/* Avatar Skeleton */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("avatarTitle")}</h2>
        <p className="text-muted-foreground">{s.rich("avatarBody", richCode)}</p>
        <ComponentPreview>
          <div className="flex items-center gap-4">
            <SkeletonAvatar />
            <SkeletonAvatar className="h-16 w-16" />
          </div>
        </ComponentPreview>
      </section>

      {/* Build your own: a single block and its shapes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{s("buildTitle")}</h2>
        <p className="text-muted-foreground">{s("buildBody")}</p>
        <p className="text-muted-foreground">{s.rich("basicBody", richCode)}</p>
        <ComponentPreview>
          <Skeleton className="h-4 w-48" />
        </ComponentPreview>
        <p className="text-muted-foreground">{s.rich("variantsBody", richCode)}</p>
        <ComponentPreview>
          <div className="flex flex-wrap items-end gap-8">
            {(["default", "circular", "rectangular"] as const).map((variant) => (
              <div key={variant} className="flex flex-col items-start gap-3">
                <Skeleton
                  variant={variant}
                  className={variant === "circular" ? "h-12 w-12" : "h-12 w-24"}
                />
                <code className="text-sm text-muted-foreground">{variant}</code>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{s.rich("a11y.decorative", richCode)}</li>
          <li>{s.rich("a11y.busy", richCode)}</li>
          <li>{s.rich("a11y.motion", richCode)}</li>
          <li>{s.rich("a11y.direction", richCode)}</li>
        </ul>
        <ComponentPreview>
          {/* The region announces loading; the blocks inside are aria-hidden. */}
          <section aria-busy="true" aria-labelledby="skeleton-comments" className={`flex flex-col gap-4 ${LIST_ITEM_WIDTH}`}>
            <h3 id="skeleton-comments" className="text-sm font-medium">{s("examples.comments")}</h3>
            <SkeletonListItem />
            <SkeletonListItem />
            <SkeletonListItem />
          </section>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={s("usage.basic")}>{`import { Skeleton } from "@/components/ui/skeleton"

export function TitleSkeleton() {
  return <Skeleton className="h-4 w-48" />
}`}</UsageExample>
        <UsageExample title={s("usage.text")}>{`import { SkeletonText } from "@/components/ui/skeleton"

export function ParagraphSkeleton() {
  return <SkeletonText lines={3} />
}`}</UsageExample>
        <UsageExample title={s("usage.listItem")}>{`import { SkeletonListItem } from "@/components/ui/skeleton"

export function RowSkeleton() {
  return <SkeletonListItem />
}`}</UsageExample>
        <UsageExample title={s("usage.card")}>{`import { SkeletonCard } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return <SkeletonCard />
}`}</UsageExample>
        <UsageExample title={s("usage.loading")}>{`import { SkeletonListItem } from "@/components/ui/skeleton"

interface Comment {
  id: number
  text: string
}

export function Comments({ comments }: { comments?: Comment[] }) {
  const isLoading = comments === undefined

  return (
    <section aria-busy={isLoading} aria-labelledby="comments">
      <h3 id="comments">${s("examples.comments")}</h3>
      {isLoading ? (
        <SkeletonListItem />
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.text}</li>
          ))}
        </ul>
      )}
    </section>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
