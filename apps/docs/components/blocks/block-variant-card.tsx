"use client"

import * as React from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fasla-ui/ui/tabs/tabs"
import { CodeBlock } from "@/components/component-preview"
import { PackageManagerTabs } from "@/components/package-manager-tabs"
import { inlineCode } from "@/components/inline-code"
import { PREVIEW_HEIGHT_MESSAGE } from "@/components/blocks/block-preview"
import { cn } from "@/lib/utils"
import { BREAKPOINTS, addCommand, previewPath, type BlockType, type Breakpoint } from "@/lib/blocks"
import { INVERSE_CSS } from "@/lib/inverse-tokens"

/** True once the element has come within a screen of the viewport, and stays true. */
function useNearView<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [near, setNear] = React.useState(false)
  React.useEffect(() => {
    const node = ref.current
    if (!node || near) return
    if (typeof IntersectionObserver === "undefined") return setNear(true)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true)
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [near])
  return [ref, near] as const
}

/** The available width of an element, kept current. */
function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null)
  const [width, setWidth] = React.useState(0)
  React.useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/**
 * A segmented choice, as toggle buttons: one of them is pressed. Not tabs,
 * because nothing below is a tab panel; the frame changes in place.
 */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-lg bg-muted p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fasla-red",
            value === option.value && "bg-background text-foreground shadow-sm"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/**
 * The block in a frame at one of Figma's breakpoints, scaled down to fit the
 * column, so the block's own breakpoints apply. The frame loads once it is near
 * the screen, and takes the block's height from the message the preview page
 * sends. The frame's page shares the site's storage, so it follows the theme.
 */
function PreviewFrame({ slug, frameLocale, breakpoint, title }: { slug: string; frameLocale: string; breakpoint: Breakpoint; title: string }) {
  const [nearRef, near] = useNearView<HTMLDivElement>()
  const [boxRef, available] = useWidth<HTMLDivElement>()
  const frameRef = React.useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = React.useState(640)
  const width = BREAKPOINTS[breakpoint]
  const scale = available > 0 ? Math.min(1, available / width) : 1

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return
      if (event.data?.type === PREVIEW_HEIGHT_MESSAGE && typeof event.data.height === "number") setHeight(event.data.height)
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <div ref={nearRef}>
      <div ref={boxRef} className="w-full">
        {/* The frame is laid out left to right in both directions, so scaling
            from its top-left corner keeps it inside the box. */}
        <div
          dir="ltr"
          className="mx-auto overflow-hidden rounded-md border border-border bg-background"
          style={{ width: width * scale, height: height * scale }}
        >
          {near && available > 0 ? (
            <iframe
              ref={frameRef}
              src={previewPath(frameLocale, slug)}
              title={title}
              loading="lazy"
              style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0" }}
              className="block border-0"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

/** The source as the registry publishes it, fetched when the Code tab opens. */
function useRegistrySource(slug: string, enabled: boolean) {
  const [source, setSource] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!enabled || source !== null) return
    let cancelled = false
    fetch(`/r/${slug}.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((item: { files?: { content?: string }[] }) => {
        if (!cancelled) setSource(item.files?.[0]?.content ?? "")
      })
      .catch(() => {
        if (!cancelled) setSource("")
      })
    return () => {
      cancelled = true
    }
  }, [slug, enabled, source])
  return source
}

/**
 * One Type of a block family: its name, a live preview at Desktop, Tablet or
 * Mobile in either direction, its source, the install command and the manual
 * steps.
 */
export function BlockVariantCard({
  type,
  name,
  components,
  packages,
}: {
  type: BlockType
  name: string
  /** The Fasla components it uses, which `add` installs with it. */
  components: string[]
  /** The npm packages it imports itself. */
  packages: string[]
}) {
  const t = useTranslations("docs.blockCard")
  const locale = useLocale()
  const [tab, setTab] = React.useState("preview")
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("desktop")
  const [direction, setDirection] = React.useState<"ltr" | "rtl">(locale === "ar" ? "rtl" : "ltr")
  const frameLocale = direction === "rtl" ? "ar" : "en"
  const source = useRegistrySource(type.slug, tab !== "preview")
  const id = type.slug

  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-24 space-y-4 rounded-xl border border-border p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="text-xl font-semibold">
          {name}
        </h2>
        <Link
          href={previewPath(frameLocale, type.slug)}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {t("fullScreen")}
          <span className="sr-only"> {t("newTab")}</span>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList variant="boxed" size="sm" aria-label={t("view")}>
            <TabsTrigger value="preview">{t("preview")}</TabsTrigger>
            <TabsTrigger value="code">{t("code")}</TabsTrigger>
            <TabsTrigger value="manual">{t("manual")}</TabsTrigger>
          </TabsList>
          {tab === "preview" ? (
            <div className="flex flex-wrap gap-2">
              <Segmented
                label={t("breakpoint")}
                value={breakpoint}
                onChange={setBreakpoint}
                options={[
                  { value: "desktop", label: t("desktop") },
                  { value: "tablet", label: t("tablet") },
                  { value: "mobile", label: t("mobile") },
                ]}
              />
              <Segmented
                label={t("direction")}
                value={direction}
                onChange={setDirection}
                options={[
                  { value: "ltr", label: "LTR" },
                  { value: "rtl", label: "RTL" },
                ]}
              />
            </div>
          ) : null}
        </div>

        <TabsContent value="preview" className="mt-4" data-toc-ignore>
          <PreviewFrame
            slug={type.slug}
            frameLocale={frameLocale}
            breakpoint={breakpoint}
            title={t("frameTitle", { name, width: BREAKPOINTS[breakpoint] })}
          />
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          {source === null ? (
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          ) : source === "" ? (
            <p className="text-sm text-muted-foreground">{t("loadFailed")}</p>
          ) : (
            <CodeBlock>{source}</CodeBlock>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-4 space-y-4">
          <ol className="list-decimal space-y-4 ps-5 text-sm text-muted-foreground marker:text-foreground">
            {/* Only the steps this block needs: three blocks use no Fasla
                component, and a bare `add` installs nothing. */}
            {addCommand(components) ? (
              <li className="space-y-2">
                <p>{t("manualDependencies")}</p>
                <CodeBlock language="bash">{addCommand(components)!}</CodeBlock>
              </li>
            ) : null}
            {packages.length > 0 ? (
              <li className="space-y-2">
                <p>{t("manualPackages")}</p>
                <PackageManagerTabs packages={packages.join(" ")} />
              </li>
            ) : null}
            <li className="space-y-2">
              <p>{t.rich("manualSource", { ...inlineCode, file: `components/blocks/${type.slug}.tsx` })}</p>
              {source ? <CodeBlock>{source}</CodeBlock> : <p>{source === null ? t("loading") : t("loadFailed")}</p>}
            </li>
            {type.inverse ? (
              <li className="space-y-2">
                <p>
                  {t.rich("manualInverse", {
                    ...inlineCode,
                    link: (chunks) => (
                      <Link href={`/${locale}/docs/installation/#inverse-tokens`} className="font-medium text-foreground underline underline-offset-4">
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
                <CodeBlock language="css">{INVERSE_CSS}</CodeBlock>
              </li>
            ) : null}
          </ol>
        </TabsContent>
      </Tabs>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t("install")}</p>
        <CodeBlock language="bash">{`npx @smicolon/fasla-ui@latest add ${type.slug}`}</CodeBlock>
      </div>
    </section>
  )
}
