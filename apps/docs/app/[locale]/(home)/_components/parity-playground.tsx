"use client"

import { Fragment, useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@fasla-ui/ui/button/button"
import { Switch } from "@fasla-ui/ui/switch/switch"
import { cn } from "@/lib/utils"
import { ArrowRightIcon, BookIcon, ComponentIcon, ExternalIcon } from "./icons"
import { landingLinks } from "./links"
import { SectionHead, Stroked } from "./section-head"
import { visibleOffSwitch } from "./switch-style"

type Props = {
  dir: "ltr" | "rtl"
  variant: "default" | "outline" | "ghost"
  size: "sm" | "default" | "lg"
  icon: boolean
  loading: boolean
  disabled: boolean
}

/**
 * What each choice resolves to in the Fasla Button: the classes its variant
 * and size apply, written out. Read from button.tsx; keep in step with it.
 */
const BACKGROUND = { default: "--primary", outline: "--background", ghost: "transparent" }
const SIZE = { sm: { height: 32, padding: 12 }, default: { height: 36, padding: 16 }, lg: { height: 40, padding: 32 } }

/**
 * A segmented control: one of a few values. Fasla has no Toggle Group in code
 * yet, so this is landing-only.
 */
function Segmented<V extends string>({ label, value, options, onChange }: { label: string; value: V; options: V[]; onChange: (v: V) => void }) {
  return (
    <div role="group" aria-label={label} className="grid w-full auto-cols-fr grid-flow-col gap-0.5 rounded-[10px] bg-muted p-[3px]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-7 rounded-[7px] px-1.5 font-mono text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground",
            value === option ? "bg-background text-foreground shadow-sm" : "text-[color:var(--l-fg-2)] hover:text-foreground"
          )}
        >
          {option === "ltr" || option === "rtl" ? option.toUpperCase() : option}
        </button>
      ))}
    </div>
  )
}

/**
 * "Same tokens on both sides." A properties panel beside the real Fasla
 * Button: each property changes the live button, the resolved styles under it
 * and the JSX that renders it, which flashes the attribute that changed.
 * The Direction property starts on the page's direction.
 */
export function ParityPlayground({ pageDir }: { pageDir: "ltr" | "rtl" }) {
  const t = useTranslations("landing.parity")
  const [p, setP] = useState<Props>({ dir: pageDir, variant: "default", size: "default", icon: true, loading: false, disabled: false })
  const [changed, setChanged] = useState<keyof Props | null>(null)

  useEffect(() => {
    setP((prev) => ({ ...prev, dir: pageDir }))
  }, [pageDir])

  useEffect(() => {
    if (!changed) return
    const timer = window.setTimeout(() => setChanged(null), 900)
    return () => window.clearTimeout(timer)
  }, [changed])

  const set = <K extends keyof Props>(key: K, value: Props[K]) => {
    setP((prev) => ({ ...prev, [key]: value }))
    setChanged(key)
  }

  const rtl = p.dir === "rtl"
  const label = rtl ? t("labelAr") : t("labelEn")
  const size = SIZE[p.size]
  const rows = (
    [
      ["dir", t("dir"), <Segmented key="d" label={t("dir")} value={p.dir} options={["ltr", "rtl"]} onChange={(v) => set("dir", v)} />],
      ["variant", t("variant"), <Segmented key="v" label={t("variant")} value={p.variant} options={["default", "outline", "ghost"]} onChange={(v) => set("variant", v)} />],
      ["size", t("size"), <Segmented key="s" label={t("size")} value={p.size} options={["sm", "default", "lg"]} onChange={(v) => set("size", v)} />],
      ["icon", t("icon"), null],
      ["loading", t("loading"), null],
      ["disabled", t("disabled"), null],
    ] as [keyof Props, string, React.ReactNode][]
  ).map(([key, name, control]) => (
    <div key={key} className="grid min-h-12 grid-cols-[92px_1fr] items-center gap-3 border-b px-4 last:border-b-0">
      {control ? (
        <>
          <span className="text-xs text-[color:var(--l-fg-2)]">{name}</span>
          {control}
        </>
      ) : (
        <Switch
          layout="label-first"
          label={name}
          checked={p[key] as boolean}
          onChange={(event) => set(key, event.target.checked as never)}
          className={cn(visibleOffSwitch, "col-span-2 w-full [&_[id$=-label]]:text-xs [&_[id$=-label]]:font-normal [&_[id$=-label]]:text-[color:var(--l-fg-2)]")}
        />
      )}
    </div>
  ))

  const attr = (key: keyof Props, value?: string) => (
    <span className={cn("rounded-[3px] transition-colors duration-700", changed === key && "bg-terminal-foreground/15")}>
      {" "}
      <span className="text-terminal-accent">{key}</span>
      {value !== undefined && (
        <>
          =<span className="text-chart-2">&quot;{value}&quot;</span>
        </>
      )}
    </span>
  )

  const specs: [string, string][] = [
    ["background", BACKGROUND[p.variant]],
    ["height", `${size.height}px`],
    ["padding-inline", `${size.padding}px`],
    ["radius", "rounded-md"],
    ["font", rtl ? "font-arabic" : "font-sans"],
  ]

  return (
    <section aria-labelledby="parity-h" className="l-sec">
      <div className="l-wrap">
        <SectionHead
          id="parity-h"
          title={<Stroked text={t("title")} />}
          lede={t("lede")}
          eyebrow={
            <span className="mb-[18px] inline-flex h-7 items-center gap-2 rounded-full border bg-[color:var(--l-bg-2)] pe-3 ps-2.5 font-mono text-[12.5px] font-medium text-[color:var(--l-fg-2)]">
              <BookIcon className="size-[15px] text-fasla-red" />
              {t("eyebrow")}
            </span>
          }
          action={
            <Button asChild variant="outline" size="lg" className="h-12 rounded-[10px] px-[22px] text-[15px]">
              <a href={landingLinks.storybook} target="_blank" rel="noopener noreferrer">
                <BookIcon className="size-[17px]" />
                {t("storybook")}
                <ExternalIcon className="size-[17px]" />
                <span className="sr-only">({t("newTab")})</span>
              </a>
            </Button>
          }
        />

        <div className="grid grid-cols-[minmax(280px,360px)_1fr] overflow-hidden rounded-2xl border bg-card max-[900px]:grid-cols-1">
          <div className="border-e text-xs max-[900px]:border-b max-[900px]:border-e-0">
            <div className="flex h-11 items-center gap-2 border-b px-4 text-[13px] font-semibold">
              <ComponentIcon className="size-3.5 text-[color:var(--l-fg-2)]" />
              <span>Button</span>
              <span className="ms-auto font-mono text-xs font-normal text-muted-foreground">Figma</span>
            </div>
            {rows}
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex h-11 items-center justify-between border-b px-4 text-[13px] font-semibold">
              <span>{t("live")}</span>
              <span className="font-mono text-xs font-normal text-muted-foreground">React</span>
            </div>
            <div
              dir={p.dir}
              lang={rtl ? "ar" : "en"}
              className={cn(
                "grid min-h-60 flex-1 place-items-center bg-[color:var(--l-bg-2)] px-4 py-8 [background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_18%,transparent)_1px,transparent_1px)] [background-size:16px_16px]",
                rtl ? "font-arabic" : "font-sans"
              )}
            >
              <Button
                variant={p.variant}
                size={p.size}
                loading={p.loading}
                loadingLabel={rtl ? t("loadingAr") : t("loadingEn")}
                disabled={p.disabled}
                className={cn(p.variant === "outline" && "bg-background")}
              >
                {label}
                {p.icon && !p.loading && <ArrowRightIcon className={cn(rtl && "-scale-x-100")} />}
              </Button>
            </div>
            <dl dir="ltr" className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] border-t">
              {specs.map(([k, v]) => (
                <div key={k} className="border-e px-4 py-3 text-left font-mono text-xs last:border-e-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <div dir="ltr" aria-live="polite" className="overflow-x-auto whitespace-pre border-t border-terminal-border bg-terminal px-[18px] py-4 text-left font-mono text-[13px] leading-[1.7] text-terminal-foreground">
              <span className="text-terminal-muted">{"// components/ui/button.tsx"}</span>
              {"\n"}
              <span className="text-terminal-muted">&lt;</span>
              <span className="text-chart-5">Button</span>
              {attr("variant", p.variant)}
              {attr("size", p.size)}
              {attr("dir", p.dir)}
              {p.loading && attr("loading")}
              {p.disabled && attr("disabled")}
              <span className="text-terminal-muted">&gt;</span>
              {label}
              {p.icon && !p.loading && (
                <Fragment>
                  <span className="text-terminal-muted"> {"{"}</span>
                  <span className="text-terminal-accent">&lt;ArrowRight /&gt;</span>
                  <span className="text-terminal-muted">{"}"}</span>
                </Fragment>
              )}
              <span className="text-terminal-muted">&lt;/</span>
              <span className="text-chart-5">Button</span>
              <span className="text-terminal-muted">&gt;</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
