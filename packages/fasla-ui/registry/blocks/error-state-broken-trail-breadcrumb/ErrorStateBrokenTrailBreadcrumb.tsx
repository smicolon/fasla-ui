"use client"

import * as React from "react"
import { File, Folder, House, Workflow } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { buttonVariants } from "../../ui/button/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb/breadcrumb"

/*
 * Figma: `Error State` (42556:548), Type=Broken Trail Breadcrumb.
 *
 * The page trail that led here, a rule under it, then a centred message and
 * two ways back up the trail. The trail is the Breadcrumb component with
 * icons (Figma's Breadcrumbs, Style Default, Count 4); on Mobile Figma shows
 * Count 2, the first and the last step, so the steps between are hidden
 * below `md:`.
 *
 * Mobile first: the base classes are Figma's Mobile (360), `md:` its Tablet
 * (768) and `lg:` its Desktop (1440). Direction is the page's `dir`; every
 * side is a logical one, and the Breadcrumb mirrors its own chevrons.
 */

export interface ErrorStateBrokenTrailBreadcrumbStep {
  label: React.ReactNode
  /** Where the step links to. The last step is the current page and takes none. */
  href?: string
  /** A 14px glyph before the label, usually a lucide icon. */
  icon?: React.ReactNode
}

export interface ErrorStateBrokenTrailBreadcrumbAction {
  label: React.ReactNode
  href: string
}

export interface ErrorStateBrokenTrailBreadcrumbCopy {
  /** The breadcrumb navigation's accessible name. */
  trailLabel: string
  /** The trail, first step to the current page. The last step is the page the visitor is on. */
  trail: ErrorStateBrokenTrailBreadcrumbStep[]
  /** The page's heading, an `h1`. */
  heading: React.ReactNode
  /** The line under the heading: what happened and where to go. */
  description: React.ReactNode
  /** The solid button: back up the trail. */
  primaryAction: ErrorStateBrokenTrailBreadcrumbAction
  /** The outline button beside it. Hidden when null. */
  secondaryAction: ErrorStateBrokenTrailBreadcrumbAction | null
}

/** The Breadcrumb sizes these to its 14px glyph and sets their stroke. */
const ICONS = { home: <House />, projects: <Workflow />, documents: <File />, page: <Folder /> }

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", ErrorStateBrokenTrailBreadcrumbCopy> = {
  en: {
    trailLabel: "Breadcrumb",
    trail: [
      { label: "Home", href: "/", icon: ICONS.home },
      { label: "Projects", href: "#projects", icon: ICONS.projects },
      { label: "Documents", href: "#documents", icon: ICONS.documents },
      { label: "Add Document", icon: ICONS.page },
    ],
    heading: "The trail ends here",
    description:
      "“rollout-v1” was archived when this guide was rewritten. The three steps before it are still live — pick up from the last one that works.",
    primaryAction: { label: "Go up one level", href: "#documents" },
    secondaryAction: { label: "Back to documentation", href: "#docs" },
  },
  ar: {
    trailLabel: "مسار التنقّل",
    trail: [
      { label: "الرئيسية", href: "/", icon: ICONS.home },
      { label: "المشاريع", href: "#projects", icon: ICONS.projects },
      { label: "المستندات", href: "#documents", icon: ICONS.documents },
      { label: "إضافة مستند", icon: ICONS.page },
    ],
    heading: "المسار ينتهي هنا",
    description: (
      <>
        تمت أرشفة ”<bdi dir="ltr">rollout-v1</bdi>“ عند إعادة كتابة هذا الدليل. الخطوات الثلاث السابقة لا تزال متاحة. تابع
        من آخر خطوة تعمل.
      </>
    ),
    primaryAction: { label: "الصعود مستوى واحد", href: "#documents" },
    secondaryAction: { label: "العودة إلى التوثيق", href: "#docs" },
  },
}

export interface ErrorStateBrokenTrailBreadcrumbProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<ErrorStateBrokenTrailBreadcrumbCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function ErrorStateBrokenTrailBreadcrumb({
  locale = "en",
  trailLabel,
  trail,
  heading,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: ErrorStateBrokenTrailBreadcrumbProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const steps = trail ?? copy.trail
  const primary = primaryAction ?? copy.primaryAction
  const secondary = secondaryAction === undefined ? copy.secondaryAction : secondaryAction
  const last = steps.length - 1

  return (
    <section aria-labelledby={headingId} className={cn("bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        {steps.length > 0 ? (
          <Breadcrumb aria-label={trailLabel ?? copy.trailLabel}>
            <BreadcrumbList>
              {steps.map((step, index) => {
                // Figma's Mobile keeps only the first step and the page.
                const middle = index > 0 && index < last
                return (
                  <React.Fragment key={index}>
                    {index > 0 ? <BreadcrumbSeparator className={cn(middle && "hidden md:inline-flex")} /> : null}
                    <BreadcrumbItem className={cn(middle && "hidden md:inline-flex")}>
                      {index === last ? (
                        <BreadcrumbPage icon={step.icon}>{step.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={step.href} icon={step.icon}>
                          {step.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}

        <hr className="border-border" />

        <div className="mx-auto flex w-full max-w-[680px] flex-col items-center gap-6 py-6 text-center md:gap-7 md:py-8 lg:py-10">
          <div className="flex w-full flex-col gap-2.5">
            <h1 id={headingId} className="text-2xl font-semibold text-foreground md:text-3xl">
              {heading ?? copy.heading}
            </h1>
            <p className="text-base text-muted-foreground">{description ?? copy.description}</p>
          </div>
          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row md:gap-3">
            <a href={primary.href} className={buttonVariants()}>
              {primary.label}
            </a>
            {secondary ? (
              <a href={secondary.href} className={buttonVariants({ variant: "outline" })}>
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const errorStateBrokenTrailBreadcrumbCopy = COPY
