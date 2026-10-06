"use client"

import { useLocale, useTranslations } from "next-intl"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { Button } from "@fasla-ui/ui/button/button"
import { Checkbox } from "@fasla-ui/ui/checkbox/checkbox"
import { Input } from "@fasla-ui/ui/input/input"
import { cn } from "@/lib/utils"
import { BI, type BlockIconName } from "./block-icons"
import type { BlockKey } from "./blocks-data"

/**
 * The block previews in the Blocks grid and the Templates carousel: one
 * component per block, drawn at the block's own width (880px, or 560px for
 * the narrow ones) and scaled to fit by ScaledPreview. They are pictures of
 * Fasla blocks, built from Fasla components where one exists (Button, Badge,
 * Avatar, Input, Checkbox) and from tokens everywhere else, so they follow the
 * page's language, direction and theme. The Dashboard and AI assistant are
 * dark in both themes, as in the reference.
 *
 * The copy is in messages under landing.blk, one language per page; photos
 * are the reference's, matched to each block's text.
 *
 * A client module because Checkbox uses hooks without "use client" and cannot
 * render from a server component.
 */


/** Block copy is structured data from the messages, read with t.raw. */
type Copy = any

/** One block's copy from `landing.blk`, as the raw message object. */
function useCopy(k: BlockKey): Copy {
  return useTranslations("landing.blk").raw(k)
}

/** The public path of a block photo. */
const IMG = (name: string) => `/landing/img/blocks/${name}.webp`

/** A photo as a cover background: previews are pictures, so no alt text to carry. */
function Photo({ name, className, children }: { name: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("bg-muted bg-cover bg-center", className)} style={{ backgroundImage: `url(${IMG(name)})` }}>
      {children}
    </div>
  )
}

/** A block heading: tight in English, open and heavier in Arabic. */
const H = "whitespace-pre-line font-[650] leading-[1.02] tracking-[-0.035em] rtl:font-extrabold rtl:leading-[1.3] rtl:tracking-normal"
const SUB = "text-[13px] text-muted-foreground"
const ROOT = "relative size-full overflow-hidden bg-card text-[15px] leading-[1.45] text-card-foreground"
/** Glass on a photo: a light veil with a hairline. */
const GLASS = "bg-fasla-white/15 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--fasla-white)_28%,transparent)] backdrop-blur-md"
/** A Button on a photo or dark ground, in white. */
const WHITE_BTN = "bg-fasla-white text-fasla-ink hover:bg-fasla-white"

/** Keeps numbers, prices and codes left to right inside Arabic copy. */
const ltr = (x: React.ReactNode) => <bdi dir="ltr">{x}</bdi>

/** A row of small pill labels. */
function Chips({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex gap-1.5", className)}>
      {items.map((x, i) => (
        <span
          key={x}
          className={cn(
            "rounded-full px-[11px] py-[5px] text-[12.5px]",
            i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground ring-1 ring-inset ring-border"
          )}
        >
          {x}
        </span>
      ))}
    </div>
  )
}

/* ── Heroes ──────────────────────────────────────────────────────────── */

function Hero({ k, photo, mark }: { k: "hero" | "dhero"; photo: string; mark: [string, string] }) {
  const c = useCopy(k)
  const ar = useLocale() === "ar"
  return (
    <div className={cn(ROOT, "text-fasla-white")}>
      <Photo name={photo} className="absolute inset-0" />
      <div className="l-scrim-hero absolute inset-0" />
      <div className="absolute inset-x-[22px] top-[18px] z-[1] flex items-center gap-[22px] text-[13.5px]">
        <span className="flex items-center gap-2 text-base font-bold">
          <i className="grid size-6 place-items-center rounded-[7px] bg-fasla-white text-[13px] not-italic text-fasla-ink">{ar ? mark[1] : mark[0]}</i>
          {c.lg}
        </span>
        <span className="flex gap-[18px] opacity-85">
          {c.ln.map((x: string) => (
            <span key={x}>{x}</span>
          ))}
        </span>
        <span className={cn("ms-auto inline-flex h-8 items-center rounded-[10px] px-4 text-[13px] font-medium", GLASS)}>{c.sg}</span>
      </div>
      <div className="absolute bottom-[104px] start-[30px] z-[1]">
        <span className={cn("inline-flex items-center gap-[7px] rounded-full px-[11px] py-1 text-[12.5px]", GLASS)}>
          <b className="size-1.5 rounded-full bg-fasla-red" />
          {c.k}
        </span>
        <div className={cn(H, "mt-3 text-[52px] [text-shadow:0_2px_24px_rgb(0_0_0/25%)] rtl:text-[46px]")}>{c.h}</div>
      </div>
      <div className="absolute inset-x-[22px] bottom-5 z-[1] grid h-16 grid-cols-[1.3fr_1fr_1fr_auto] items-center rounded-2xl bg-card pe-2 ps-1 text-card-foreground shadow-2xl">
        {c.f.map(([label, value]: [string, string], i: number) => (
          <div key={label} className={cn("px-[18px]", i < 2 && "border-e")}>
            <span className="block text-[11px] uppercase tracking-[.06em] text-muted-foreground rtl:text-xs rtl:normal-case rtl:tracking-normal">{label}</span>
            <b className="text-[15px] font-semibold">{value}</b>
          </div>
        ))}
        <Button className="h-12 rounded-[11px] px-5 text-sm">
          <BI n="search" />
          {c.go}
        </Button>
      </div>
    </div>
  )
}

/* ── Features ────────────────────────────────────────────────────────── */

/** Feature grid: a heading and tiles of short benefits. */
function Features() {
  const c = useCopy("feat")
  const tile = "flex flex-col gap-1 rounded-2xl bg-muted p-4"
  return (
    <div className={cn(ROOT, "flex flex-col gap-4 px-[26px] py-6")}>
      <div>
        <div className={cn(H, "text-[26px]")}>{c.h}</div>
        <p className="mt-1 text-[13.5px] text-muted-foreground">{c.p}</p>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3">
        <div className={tile}>
          <div className="mb-2 flex flex-1 items-center justify-center">
            {/* A switch, on: the thumb sits at the end. */}
            <span className="relative h-[30px] w-[54px] rounded-full bg-primary shadow-lg">
              <span className="absolute end-[3px] top-[3px] size-6 rounded-full bg-primary-foreground" />
            </span>
          </div>
          <b className="text-[14.5px]">{c.t[0][0]}</b>
          <span className="text-[12.5px] text-muted-foreground">{c.t[0][1]}</span>
        </div>
        <div className={tile}>
          <div className="mb-2 flex flex-1 items-center justify-center">
            <span className="flex">
              {["av-1", "av-4", "av-7", "av-9"].map((a, i) => (
                <Avatar key={a} src={IMG(a)} name="" radius="rounded" className={cn("ring-[2.5px] ring-muted", i > 0 && "-ms-2.5")} />
              ))}
              <span className="-ms-2.5 grid size-8 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground ring-[2.5px] ring-muted">
                {ltr("+81")}
              </span>
            </span>
          </div>
          <b className="text-[14.5px]">{c.t[1][0]}</b>
          <span className="text-[12.5px] text-muted-foreground">{c.t[1][1]}</span>
        </div>
        <div className={tile}>
          <div className="mb-2 flex flex-1 items-center justify-center">
            <span className="flex h-14 items-end gap-[5px]">
              {[38, 52, 44, 70, 62, 86, 92].map((h, i) => (
                <i key={i} className={cn("w-[11px] rounded", i === 6 ? "bg-primary" : "bg-foreground/15")} style={{ height: `${h}%` }} />
              ))}
            </span>
          </div>
          <b className="text-[14.5px]">{c.t[2][0]}</b>
          <span className="text-[12.5px] text-muted-foreground">{c.t[2][1]}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Gallery ─────────────────────────────────────────────────────────── */

/** Destination gallery: four photos in a bento grid with a caption. */
function Gallery() {
  const c = useCopy("gallery")
  const photos = ["f-dunes", "f-oasis", "f-oldtown", "f-coffee"]
  const span = ["row-span-2", "", "", "col-span-2"]
  return (
    <div className={cn(ROOT, "flex flex-col gap-3 px-[26px] py-6")}>
      <div className="flex items-center justify-between">
        <div className={cn(H, "text-[26px]")}>{c.h}</div>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
          {c.more}
          <BI n="arrow" flip className="size-[15px]" />
        </span>
      </div>
      <Chips items={c.ch} />
      <div className="grid min-h-0 flex-1 grid-cols-[1.4fr_1fr_1fr] grid-rows-2 gap-2.5">
        {photos.map((p, i) => (
          <Photo key={p} name={p} className={cn("relative overflow-hidden rounded-2xl", span[i])}>
            <div className="l-scrim-bottom absolute inset-0" />
            <span className="absolute bottom-3 start-3.5 z-[1] text-[11.5px] text-fasla-white/75">
              <b className="block text-sm font-semibold text-fasla-white">{c.cap[i][0]}</b>
              {c.cap[i][1]}
            </span>
          </Photo>
        ))}
      </div>
    </div>
  )
}

/* ── Banner ──────────────────────────────────────────────────────────── */

/** Campaign banner: a full-bleed photo with a headline and a call to action. */
function Banner() {
  const c = useCopy("ban")
  return (
    <div className={cn(ROOT, "text-fasla-white")}>
      <Photo name="f-riyadh" className="absolute inset-0" />
      <div className="l-scrim-side absolute inset-0" />
      <div className="absolute start-[34px] top-1/2 z-[1] flex -translate-y-1/2 flex-col items-start gap-3.5">
        <span className="text-[12.5px] uppercase tracking-[.08em] text-fasla-white/70 rtl:text-sm rtl:normal-case rtl:tracking-normal">{c.k}</span>
        <div className={cn(H, "max-w-[420px] text-[42px]")}>{c.h}</div>
        <div className="flex gap-2">
          {c.cd.map(([n, unit]: [string, string]) => (
            <div key={unit} className={cn("w-[66px] rounded-xl py-2 text-center", GLASS)}>
              <b className="block text-2xl font-[650] tabular-nums">{n}</b>
              <span className="text-[11px] text-fasla-white/65">{unit}</span>
            </div>
          ))}
        </div>
        <Button className={cn(WHITE_BTN, "h-[38px] rounded-[10px]")}>
          {c.b}
          <BI n="arrow" flip className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ── Authentication ──────────────────────────────────────────────────── */

/** Sign-in: the form beside a photo panel. */
function Auth() {
  const c = useCopy("auth")
  return (
    <div className={cn(ROOT, "grid grid-cols-[1fr_1.05fr]")}>
      <Photo name="f-lodge" className="relative m-3 overflow-hidden rounded-[18px]">
        <div className="l-scrim-bottom absolute inset-0" />
        <span className="absolute bottom-3.5 start-4 z-[1] flex items-center gap-1.5 text-[13px] text-fasla-white">
          <BI n="pin" className="size-4" />
          {c.loc}
        </span>
      </Photo>
      <div className="flex flex-col py-7 pe-[30px] ps-[18px]">
        <div className={cn(H, "text-[26px]")}>{c.h}</div>
        <span className={cn(SUB, "mt-1")}>{c.p}</span>
        <label className="mb-[5px] mt-3 text-[12.5px] font-medium text-muted-foreground">{c.l1}</label>
        <Input defaultValue={c.v1} startIcon={<BI n="mail" className="size-4" />} className="h-10 rounded-[10px] text-sm ring-2 ring-primary/10" />
        <label className="mb-[5px] mt-3 text-[12.5px] font-medium text-muted-foreground">{c.l2}</label>
        <Input type="password" defaultValue="••••••••••" startIcon={<BI n="lock" className="size-4" />} className="h-10 rounded-[10px] text-sm" />
        <div className="my-3 flex items-center justify-between text-[12.5px] text-muted-foreground">
          <Checkbox label={c.rm} defaultChecked className="[&_span]:text-[12.5px]" />
          <u className="no-underline">{c.fg}</u>
        </div>
        <Button className="h-[38px] rounded-[10px]">{c.b}</Button>
        <div className="my-2.5 flex items-center gap-2.5 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          {c.or}
        </div>
        <Button variant="outline" className="h-[38px] rounded-[10px]">
          <BI n="mail" className="size-4" />
          {c.b2}
        </Button>
      </div>
    </div>
  )
}

/* ── Pricing ─────────────────────────────────────────────────────────── */

/** Pricing table: three plans with the middle one featured. */
function Pricing() {
  const c = useCopy("price")
  const ar = useLocale() === "ar"
  return (
    <div className={cn(ROOT, "flex flex-col gap-4 px-7 py-[26px]")}>
      <div className="flex items-end justify-between">
        <div className={cn(H, "text-[28px]")}>{c.h}</div>
        <span className="inline-flex rounded-[10px] bg-muted p-[3px] text-[13px]">
          <span className="rounded-lg px-3 py-[5px] text-muted-foreground">{c.seg[0]}</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-[5px] font-medium shadow-sm">
            {c.seg[1]}
            <Badge variant="soft" tone="success" size="sm">
              {ltr(c.save)}
            </Badge>
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[1fr_1.08fr_1fr] gap-3">
        {c.t.map(([name, price, feats, cta]: [string, string, string[], string], i: number) => {
          const hi = i === 1
          return (
            <div
              key={name}
              className={cn(
                "relative flex flex-col gap-1 rounded-2xl p-[18px]",
                hi ? "-translate-y-1.5 bg-primary text-primary-foreground shadow-2xl" : "ring-1 ring-inset ring-border"
              )}
            >
              {hi && <Badge className="absolute end-4 top-4 bg-fasla-red text-fasla-white" size="sm">{c.pop}</Badge>}
              <b className="text-[15px]">{name}</b>
              <div className="mt-1.5 flex items-baseline gap-1.5 text-4xl font-[650] leading-[1.05] tracking-[-0.035em]">
                {ar ? (
                  <>
                    {ltr(price)}
                    <small className={cn("text-[13px] font-medium tracking-normal", hi ? "opacity-70" : "text-muted-foreground")}>
                      {c.cur} {c.per}
                    </small>
                  </>
                ) : (
                  <>
                    <small className={cn("text-[13px] font-medium tracking-normal", hi ? "opacity-70" : "text-muted-foreground")}>{c.cur}</small>
                    {price}
                    <small className={cn("text-[13px] font-medium tracking-normal", hi ? "opacity-70" : "text-muted-foreground")}>{c.per}</small>
                  </>
                )}
              </div>
              <ul className="mb-3.5 mt-3 flex flex-col gap-[7px] text-[13px]">
                {feats.map((f) => (
                  <li key={f} className="flex items-center gap-[7px]">
                    <BI n="check" className="size-[15px] text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={hi ? "default" : "outline"} className={cn("mt-auto h-[38px] w-full rounded-[10px]", hi && "bg-primary-foreground text-primary hover:bg-primary-foreground")}>
                {cta}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Checkout ────────────────────────────────────────────────────────── */

/** Checkout: contact, address and card fields beside the order total. */
function Checkout() {
  const c = useCopy("checkout")
  const label = "mb-[5px] mt-2.5 text-xs font-medium text-muted-foreground"
  const field = "flex h-[38px] items-center gap-2 rounded-[10px] px-3 text-[13.5px] ring-1 ring-inset ring-border"
  return (
    <div className={cn(ROOT, "grid grid-cols-[1.25fr_1fr]")}>
      <div className="flex flex-col px-[26px] py-[22px]">
        <div className="mb-3.5 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-[650]">
            <i className="grid size-[26px] place-items-center rounded-lg bg-primary text-primary-foreground">
              <BI n="cup" className="size-[15px]" />
            </i>
            {c.lg}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {c.st.map((s: string, i: number) => (
              <span key={s} className="contents">
                {i > 0 && <em className="h-px w-3.5 bg-border" />}
                <span className={cn("inline-flex items-center gap-[5px]", i === 2 && "font-semibold text-foreground")}>
                  {i < 2 ? (
                    <BI n="check" className="size-3.5 text-success" />
                  ) : (
                    <i className="grid size-4 place-items-center rounded-full bg-primary font-sans text-[10px] font-semibold not-italic text-primary-foreground">3</i>
                  )}
                  {s}
                </span>
              </span>
            ))}
          </span>
        </div>
        <div className={cn(H, "mb-1 text-2xl")}>{c.h}</div>
        <label className={label}>{c.c}</label>
        <div className={field}>
          <span dir="ltr">{c.em}</span>
          <BI n="check" className="ms-auto size-4 text-success" />
        </div>
        <label className={label}>{c.d}</label>
        <div className={field}>
          <BI n="pin" className="size-4 text-muted-foreground" />
          <span>{c.ad}</span>
        </div>
        <label className={label}>{c.p}</label>
        <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-border">
          <div className="flex h-[38px] items-center gap-2 border-b px-3 text-[13.5px]">
            <BI n="card" className="size-4 text-muted-foreground" />
            <span dir="ltr" className="tabular-nums">{c.cn}</span>
            <span className="ms-auto font-sans text-xs font-extrabold italic tracking-[.02em] text-info">VISA</span>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex h-[38px] items-center px-3 text-[13.5px]">
              <span dir="ltr" className="tabular-nums">{c.ex}</span>
            </div>
            <div className="flex h-[38px] items-center gap-2 border-s px-3 text-[13.5px]">
              <BI n="lock" className="size-4 text-muted-foreground" />
              <span>{c.cv}</span>
            </div>
          </div>
        </div>
        <Button className="mt-3.5 h-[42px] rounded-[11px]">
          <BI n="lock" className="size-4" />
          {c.b}
        </Button>
      </div>
      <div className="flex flex-col gap-3 border-s bg-muted/60 px-[22px] pb-[22px] pt-16">
        {c.it.map(([photo, name, price]: [string, string, string]) => (
          <div key={name} className="flex items-center gap-2.5 text-[13px]">
            <Photo name={photo === "q-main" ? "f-cupset" : "f-pitcher"} className="size-[46px] shrink-0 rounded-[10px]" />
            <b className="flex-1 font-semibold">{name}</b>
            <span className="tabular-nums">{price}</span>
          </div>
        ))}
        <div className="mt-auto flex flex-col gap-1.5 text-[12.5px] text-muted-foreground">
          {c.tot.map(([a, b]: [string, string], i: number) => (
            <div key={a} className={cn("flex justify-between", i === 2 && "border-t pt-2 text-[15px] font-[650] text-foreground")}>
              <span>{a}</span>
              <span className="tabular-nums">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Order summary ───────────────────────────────────────────────────── */

/** Order summary: the items, the totals and the delivery estimate. */
function Order() {
  const c = useCopy("order")
  const ar = useLocale() === "ar"
  return (
    <div className={cn(ROOT, "flex flex-col gap-2.5 px-[26px] py-[22px]")}>
      <div className="flex items-baseline justify-between">
        <div className={cn(H, "text-2xl")}>{c.h}</div>
        <span className={SUB}>{c.n}</span>
      </div>
      {c.it.map(([photo, name, spec, price]: [string, string, string, string]) => (
        <div key={name} className="flex items-center gap-3">
          <Photo name={photo === "q-main" ? "f-cupset" : "f-pitcher"} className="size-[52px] shrink-0 rounded-xl ring-1 ring-inset ring-foreground/5" />
          <div>
            <b className="block text-sm font-semibold">{name}</b>
            <span className={SUB}>{spec}</span>
          </div>
          <span className="ms-auto text-sm font-semibold tabular-nums">{ar ? <>{ltr(price)} ر.س</> : `SAR ${price}`}</span>
        </div>
      ))}
      <div className="mt-0.5 flex h-[38px] items-center gap-2 rounded-[10px] px-3 text-[13px] text-muted-foreground ring-1 ring-inset ring-border">
        <BI n="tag" className="size-[15px]" />
        <span>{c.promo}</span>
        <u className="ms-auto font-semibold text-foreground no-underline">{c.ap}</u>
      </div>
      <div className="flex flex-col gap-[5px] text-[13px] text-muted-foreground">
        {c.r.map(([a, b]: [string, string]) => (
          <div key={a} className="flex justify-between">
            <span>{a}</span>
            <span className="tabular-nums">{b}</span>
          </div>
        ))}
        <div className="mt-[3px] flex justify-between border-t border-dashed pt-2 text-base text-foreground">
          <b>{c.tot}</b>
          <b className="tabular-nums">{c.tv}</b>
        </div>
      </div>
      <Button className="h-[42px] w-full rounded-[11px]">
        {c.b}
        <BI n="arrow" flip className="size-4" />
      </Button>
      <span className="flex items-center justify-center gap-1.5 text-[11.5px] text-muted-foreground">
        <BI n="shield" className="size-[13px]" />
        {c.sec}
      </span>
    </div>
  )
}

/* ── Dashboard (dark) ────────────────────────────────────────────────── */

/** Dashboard, dark in both themes: sidebar, stat tiles and a monthly bar chart. */
function Dashboard() {
  const c = useCopy("dash")
  const ar = useLocale() === "ar"
  const months = (c.mo as string).split(",")
  const bars = [62, 66, 70, 68, 74, 78, 76, 81, 85, 88, 92, 97]
  const icons: BlockIconName[] = ["grid", "swap", "card", "target"]
  const panel = "rounded-[13px] bg-card ring-1 ring-inset ring-border"
  return (
    <div className={cn(ROOT, "grid grid-cols-[178px_1fr] bg-background")}>
      <aside className="flex flex-col gap-[3px] border-e px-3 py-[18px]">
        <span className="flex items-center gap-2 px-2 pb-4 text-[15px] font-[650]">
          <i className="grid size-[26px] place-items-center rounded-lg bg-primary text-[13px] font-bold not-italic text-primary-foreground">{ar ? "س" : "S"}</i>
          {c.lg}
        </span>
        {c.nav.map((n: string, i: number) => (
          <span
            key={n}
            className={cn(
              "flex h-[34px] items-center gap-[9px] rounded-[9px] px-2.5 text-[13px]",
              i === 0 ? "bg-card text-foreground ring-1 ring-inset ring-border" : "text-muted-foreground"
            )}
          >
            <BI n={icons[i]} className="size-4" />
            {n}
          </span>
        ))}
        <span className="mt-auto px-2">
          <Avatar src={IMG("p-khalid")} name="" radius="rounded" />
        </span>
      </aside>
      <div className="flex min-w-0 flex-col gap-3.5 px-[22px] py-5">
        <div className="flex items-start justify-between">
          <div>
            <b className={cn(H, "block text-[22px]")}>{c.t}</b>
            <span className={cn(SUB, "mt-0.5 block")}>{c.s}</span>
          </div>
          <span className="flex h-8 items-center gap-[7px] rounded-[9px] px-[11px] text-xs text-foreground/85 ring-1 ring-inset ring-border">
            <BI n="cal" className="size-3.5" />
            {c.range}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {c.k.map(([label, value, delta]: [string, string, string]) => (
            <div key={label} className={cn(panel, "flex flex-col gap-1 px-3.5 py-3")}>
              <span className={SUB}>{label}</span>
              <b className="text-[19px] font-[650] tabular-nums tracking-[-0.02em]">{value}</b>
              {delta ? (
                <em className={cn("text-[11.5px] not-italic", delta.startsWith("+") ? "text-success" : "text-muted-foreground")}>{ltr(delta)}</em>
              ) : (
                <span className="mt-[7px] h-[5px] overflow-hidden rounded-full bg-muted">
                  <i className="block h-full w-[68%] rounded-full bg-foreground" />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-2.5">
          <div className={cn(panel, "flex flex-col px-3.5 py-3")}>
            <span className={SUB}>{c.ch}</span>
            <div className="flex flex-1 items-end gap-[7px] pt-2.5">
              {bars.map((h, i) => (
                <span key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-[5px]">
                  <i
                    className={cn(
                      "w-full rounded-[5px_5px_2px_2px]",
                      i === 11 ? "bg-fasla-red shadow-[0_0_18px_color-mix(in_oklch,var(--fasla-red)_45%,transparent)]" : "bg-muted"
                    )}
                    style={{ height: `${h}%` }}
                  />
                  <small className="text-[10px] text-muted-foreground">{months[i]}</small>
                </span>
              ))}
            </div>
          </div>
          <div className={cn(panel, "flex flex-col justify-center gap-2.5 px-3.5 py-3")}>
            {c.tx.map(([photo, name, amount]: [string, string, string]) => (
              <div key={name} className="flex items-center gap-[9px] text-[12.5px]">
                <Avatar src={IMG(photo)} name="" size="24" radius="rounded" />
                <b className="flex-1 truncate font-medium">{name}</b>
                <span className={cn("tabular-nums", amount.startsWith("+") ? "text-success" : "text-foreground/85")}>{ltr(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Product grid ────────────────────────────────────────────────────── */

/** Product grid: Qahwa House items with prices and ratings. */
function Products() {
  const c = useCopy("prod")
  const photo: Record<string, string> = { "q-main": "f-cupset", "q-pour": "f-pitcher", "q-sugar2": "q-sugar2" }
  return (
    <div className={cn(ROOT, "flex flex-col gap-3.5 px-[26px] py-6")}>
      <div className="flex items-center justify-between">
        <div className={cn(H, "text-2xl")}>{c.h}</div>
        <Chips items={c.ch} />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3.5">
        {c.p.map(([p, name, price, tag]: [string, string, string, string]) => (
          <div key={name} className="flex flex-col gap-2">
            <Photo name={photo[p]} className="relative min-h-[170px] flex-1 rounded-[14px]">
              {tag && (
                <span className="absolute start-2.5 top-2.5 rounded-full bg-card px-2 py-0.5 text-[11px] font-medium text-card-foreground">{tag}</span>
              )}
              <span className="absolute bottom-2.5 end-2.5 grid size-[34px] place-items-center rounded-full bg-primary text-primary-foreground">
                <BI n="plus" className="size-4" />
              </span>
            </Photo>
            <div className="flex items-baseline justify-between text-sm">
              <b className="font-semibold">{name}</b>
              <span className="tabular-nums">{price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Messages ────────────────────────────────────────────────────────── */

/** Messages: one conversation with bubbles on both sides and a composer. */
function Messages() {
  const c = useCopy("chat")
  const bubble = "max-w-[78%] rounded-[14px] px-3 py-[9px]"
  return (
    <div className={cn(ROOT, "flex flex-col bg-muted/40")}>
      <div className="flex items-center gap-2.5 border-b bg-card px-[18px] py-3.5">
        <Avatar src={IMG("p-noura")} name="" radius="rounded" />
        <div>
          <b className="block text-[14.5px]">{c.who}</b>
          <span className="flex items-center gap-[5px] text-xs text-success">
            <i className="size-1.5 rounded-full bg-success" />
            {c.st}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-3.5 text-[13.5px]">
        <div className={cn(bubble, "self-start rounded-es-[4px] bg-card ring-1 ring-border")}>{c.m[0]}</div>
        <div className={cn(bubble, "self-end rounded-ee-[4px] bg-primary text-primary-foreground")}>{c.m[1]}</div>
        <div className={cn(bubble, "self-start rounded-es-[4px] bg-card ring-1 ring-border")}>{c.m[2]}</div>
        <div className="flex items-center gap-2.5 self-start rounded-xl bg-card p-2 text-[12.5px] ring-1 ring-border">
          <Photo name="interior" className="size-[46px] rounded-[9px]" />
          <div>
            <b className="block text-[13px]">{c.card[0]}</b>
            <span className={SUB}>{c.card[1]}</span>
          </div>
        </div>
      </div>
      <div className="mx-3.5 mb-3.5 flex h-[42px] items-center rounded-xl bg-card pe-1.5 ps-3.5 text-[13.5px] text-muted-foreground ring-1 ring-border">
        {c.ph}
        <span className="ms-auto grid size-8 place-items-center rounded-[9px] bg-primary text-primary-foreground">
          <BI n="send" flip className="size-4" />
        </span>
      </div>
    </div>
  )
}

/* ── AI assistant (dark) ─────────────────────────────────────────────── */

/** AI assistant, dark in both themes: a prompt, an answer and its sources. */
function Assistant() {
  const c = useCopy("ai")
  const control = "inline-flex h-[30px] items-center gap-1.5 rounded-[9px] px-[9px] text-xs text-foreground/85 ring-1 ring-inset ring-foreground/10"
  return (
    <div className={cn(ROOT, "bg-background")}>
      <div className="l-ai-glow absolute -inset-x-[10%] -bottom-[55%] h-[90%] blur-[8px]" />
      <div className="l-ai-dots absolute inset-0" />
      <div className="absolute inset-x-[22px] top-[18px] z-[1] flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-[650]">
          <i className="grid size-[26px] place-items-center rounded-lg bg-fasla-red text-fasla-white">
            <BI n="spark" className="size-3.5" />
          </i>
          {c.lg}
        </span>
        <span className="rounded-full px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-inset ring-foreground/10">{c.tag}</span>
      </div>
      <div className="absolute inset-x-[30px] bottom-[26px] top-[70px] z-[1] flex flex-col items-center justify-center gap-4">
        <div className={cn(H, "bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-center text-[30px] text-transparent rtl:text-[28px]")}>{c.h}</div>
        <div className="w-full rounded-[18px] bg-card/85 p-3.5 pb-2.5 shadow-2xl ring-1 ring-inset ring-foreground/10 backdrop-blur-md">
          <span className="block min-h-10 text-sm text-muted-foreground">
            {c.ph}
            <i className="ms-0.5 inline-block h-4 w-0.5 bg-fasla-red align-[-3px]" />
          </span>
          <div className="flex items-center gap-2">
            <span className={control}>
              <BI n="plus" className="size-3.5" />
            </span>
            <span className={control}>
              <BI n="spark" className="size-3.5" />
              {c.m}
            </span>
            <span className="ms-auto inline-flex h-[30px] items-center px-[9px] text-muted-foreground">
              <BI n="mic" className="size-3.5" />
            </span>
            <span className="grid size-[30px] place-items-center rounded-[9px] bg-primary text-primary-foreground">
              <BI n="up" className="size-3.5" />
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {c.ch.map((x: string) => (
            <span key={x} className="rounded-full bg-foreground/5 px-3 py-1.5 text-[12.5px] text-foreground/85 ring-1 ring-inset ring-foreground/10">
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── FAQ ─────────────────────────────────────────────────────────────── */

/** FAQ: a short accordion with the first answer open. */
function Faq() {
  const c = useCopy("faq")
  return (
    <div className={cn(ROOT, "px-[26px] py-6")}>
      <div className={cn(H, "mb-2 text-[26px]")}>{c.h}</div>
      {c.q.map(([q, a]: [string, string], i: number) => (
        <div key={q} className="border-b py-3">
          <div className="flex items-center justify-between gap-3.5 text-[14.5px] font-semibold">
            {q}
            <i className={cn("grid size-[26px] shrink-0 place-items-center rounded-full", i === 0 ? "bg-primary text-primary-foreground" : "ring-1 ring-inset ring-border")}>
              <BI n={i === 0 ? "minus" : "plus"} className="size-[13px]" />
            </i>
          </div>
          {a && <p className="mt-1.5 max-w-[92%] text-[13px] text-muted-foreground">{a}</p>}
        </div>
      ))}
    </div>
  )
}

/* ── Error state ─────────────────────────────────────────────────────── */

/** Error state: an illustration, a message and a retry action. */
function ErrorState() {
  const c = useCopy("err")
  return (
    <div className={cn(ROOT, "l-err flex flex-col items-center justify-center gap-2.5 text-center")}>
      {/* The number is cut out of the dune photo. */}
      <div
        className="bg-cover bg-clip-text bg-center font-sans text-[130px] font-[750] leading-[.85] tracking-[-0.07em] text-transparent"
        style={{ backgroundImage: `url(${IMG("f-dunes")})` }}
      >
        404
      </div>
      <div className={cn(H, "text-[22px]")}>{c.h}</div>
      <p className="max-w-[300px] text-[13.5px] text-muted-foreground">{c.p}</p>
      <div className="mt-1.5 flex gap-2">
        <Button className="h-[38px] rounded-[10px]">
          <BI n="arrow" flip className="size-4" />
          {c.b}
        </Button>
        <Button variant="outline" className="h-[38px] rounded-[10px]">
          {c.b2}
        </Button>
      </div>
    </div>
  )
}

/* ── Date picker ─────────────────────────────────────────────────────── */

/** Date picker: October 2026 with a five-night stay selected. */
function DatePicker() {
  const c = useCopy("cal")
  // October 2026 starts on a Thursday; the stay is the 12th to the 16th.
  const START = 4
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i - START + 1
    const out = d < 1 || d > 31
    return { label: d < 1 ? 30 + d : d > 31 ? d - 31 : d, out, start: d === 12, end: d === 16, between: d > 12 && d < 16 }
  })
  return (
    <div className={cn(ROOT, "flex flex-col gap-2.5 px-6 py-[22px]")}>
      <div className="flex items-center justify-between">
        <b className="text-base">{c.m}</b>
        <span className="flex gap-1.5">
          {(["chevL", "chevR"] as const).map((n) => (
            <span key={n} className="grid size-7 place-items-center rounded-lg ring-1 ring-inset ring-border">
              <BI n={n} flip className="size-3.5" />
            </span>
          ))}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-y-[3px] text-center text-[13px]">
        {c.wd.map((w: string) => (
          <span key={w} className="pb-1 text-[11px] text-muted-foreground">
            {w}
          </span>
        ))}
        {cells.map((cell, i) => (
          <span
            key={i}
            className={cn(
              "grid h-8 place-items-center tabular-nums",
              cell.out && "text-muted-foreground/50",
              cell.between && "bg-muted",
              (cell.start || cell.end) && "bg-primary font-semibold text-primary-foreground",
              cell.start && "rounded-s-[9px]",
              cell.end && "rounded-e-[9px]"
            )}
          >
            {cell.label}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between border-t pt-3 text-[13.5px]">
        <div>
          <b className="block text-[15px]">{c.n}</b>
          <span className={SUB}>{c.p}</span>
        </div>
        <Button className="h-[38px] rounded-[10px]">{c.b}</Button>
      </div>
    </div>
  )
}

/* ── Notifications ───────────────────────────────────────────────────── */

/** Notifications: three toasts stacked in their tones. */
function Notifications() {
  const c = useCopy("toast")
  const tones = ["bg-soft-success text-success", "bg-soft-primary text-foreground", "bg-soft-warning text-warning"]
  const icons: BlockIconName[] = ["card", "cal", "bell"]
  const fade = ["", "scale-95 opacity-85", "scale-90 opacity-60"]
  return (
    <div className={cn(ROOT, "l-toast flex flex-col items-center justify-center gap-2.5 p-6")}>
      {c.t.map(([title, sub, time]: [string, string, string], i: number) => (
        <div key={title} className={cn("flex w-full max-w-[440px] items-center gap-3 rounded-[14px] bg-card px-3.5 py-3 text-[13px] shadow-lg ring-1 ring-border", fade[i])}>
          <span className={cn("grid size-[34px] shrink-0 place-items-center rounded-[10px]", tones[i])}>
            <BI n={icons[i]} />
          </span>
          <div>
            <b className="block text-sm">{title}</b>
            <span className={SUB}>{sub}</span>
          </div>
          <span className="ms-auto self-start text-[11.5px] text-muted-foreground">{time}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Revenue card ────────────────────────────────────────────────────── */

/** Revenue card: the total, its change and a sparkline. */
function Stats() {
  const c = useCopy("stats")
  const v = [12, 14, 13, 16, 15, 18, 17, 20, 19, 23, 22, 26, 25, 29, 31]
  const W = 500
  const HT = 110
  const x = (i: number) => (i / (v.length - 1)) * W
  const y = (a: number) => HT - 6 - (a / 33) * (HT - 12)
  const line = v.map((a, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(a).toFixed(1)}`).join(" ")
  return (
    <div className={cn(ROOT, "flex flex-col gap-3.5 p-6")}>
      <div className="flex items-center justify-between">
        <b className="text-[15px]">{c.t}</b>
        <span className={SUB}>{c.r}</span>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className={cn(H, "text-[40px] tabular-nums")}>{c.v}</span>
        <Badge variant="soft" tone="success" size="md">
          {ltr(c.up)}
        </Badge>
      </div>
      {/* Time runs left to right in a chart, in both languages. */}
      <svg viewBox={`0 0 ${W} ${HT}`} preserveAspectRatio="none" className="block h-[110px] w-full" style={{ direction: "ltr" }}>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={W} y1={HT * f} y2={HT * f} className="stroke-border" />
        ))}
        <path d={`${line} L${W} ${HT} L0 ${HT} Z`} className="fill-foreground/10" />
        <path d={line} className="fill-none stroke-foreground [stroke-linejoin:round] [stroke-width:2.4]" />
        <circle cx={x(v.length - 1) - 3} cy={y(31)} r="5" className="fill-card stroke-foreground [stroke-width:2.4]" />
      </svg>
      <div className="grid grid-cols-2 gap-2.5">
        {c.k.map(([n, label]: [string, string]) => (
          <div key={label} className="rounded-xl bg-muted px-3.5 py-3">
            <b className="block text-xl font-[650] tabular-nums tracking-[-0.02em]">{ltr(n)}</b>
            <span className={SUB}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── App download ────────────────────────────────────────────────────── */

/** App download: store badges beside a phone mock-up. */
function AppDownload() {
  const c = useCopy("app")
  return (
    <div className={cn(ROOT, "grid grid-cols-[1.15fr_1fr] bg-secondary")}>
      <div className="flex flex-col items-start justify-center gap-2.5 py-[30px] ps-[34px]">
        <span className="flex items-center gap-2 text-sm font-[650]">
          <i className="grid size-[26px] place-items-center rounded-lg bg-primary text-primary-foreground">
            <BI n="cup" className="size-[15px]" />
          </i>
          {c.lg}
        </span>
        <span className="mt-2 text-xs uppercase tracking-[.06em] text-muted-foreground rtl:text-[13px] rtl:normal-case rtl:tracking-normal">{c.k}</span>
        <div className={cn(H, "text-[40px] rtl:text-4xl")}>{c.h}</div>
        <p className="max-w-[330px] text-sm text-muted-foreground">{c.p}</p>
        <div className="mt-2 flex gap-2">
          {([[c.b1, "phone"], [c.b2, "play"]] as [[string, string], BlockIconName][]).map(([[small, big], icon]) => (
            <span key={big} className="inline-flex h-[46px] items-center gap-[9px] rounded-xl bg-primary pe-4 ps-3 text-primary-foreground">
              <BI n={icon} className="size-5" />
              <span>
                <small className="block text-[10px] leading-[1.1] opacity-70">{small}</small>
                <b className="font-sans text-[15px] leading-[1.15]">{big}</b>
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute start-[50px] top-[34px] h-[440px] w-[220px] -rotate-6 overflow-hidden rounded-[36px] bg-card shadow-2xl ring-[7px] ring-primary rtl:rotate-6">
          <Photo name="q-main" className="absolute inset-0" />
          <div className="absolute inset-x-3 top-[188px] flex items-center gap-2.5 rounded-2xl bg-card/85 px-3 py-2.5 text-xs shadow-lg backdrop-blur-md">
            <span className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-primary text-primary-foreground">
              <BI n="cup" className="size-[15px]" />
            </span>
            <div>
              <b className="block text-[13px]">{c.card[0]}</b>
              <span className="text-[11px] text-muted-foreground">{c.card[1]}</span>
            </div>
            <b className="ms-auto text-[13px] tabular-nums">{c.pr}</b>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Majalla: three blocks that exist only in this showcase ──────────── */

/** Majalla front page: the lead story with its photo and kicker. */
function MagFront() {
  const c = useCopy("mag")
  const ar = useLocale() === "ar"
  const kicker = "text-[11.5px] font-semibold uppercase tracking-[.08em] text-fasla-red rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
  const serif = "font-serif font-semibold tracking-[-0.02em] rtl:font-arabic rtl:font-extrabold rtl:tracking-normal"
  return (
    <div className={cn(ROOT, "flex flex-col gap-5 bg-[color:var(--l-bg-2)] px-[30px] pb-[26px] pt-[22px]")}>
      <div className="flex items-center gap-[22px] border-b pb-3.5">
        <b className="text-[26px] font-[750] tracking-[-0.04em] rtl:tracking-normal">
          {c.lg}
          <i className="not-italic text-fasla-red">{ar ? "،" : ","}</i>
        </b>
        <span className="flex gap-[18px] text-[13.5px] text-muted-foreground">
          {c.ln.map((x: string) => (
            <span key={x}>{x}</span>
          ))}
        </span>
        <Button className="ms-auto h-[34px] rounded-[10px]">{c.sb}</Button>
      </div>
      <div className="grid grid-cols-[1.25fr_1fr] items-center gap-[26px]">
        <Photo name="f-oldtown" className="h-[300px] rounded-[10px]" />
        <div>
          <span className={kicker}>{c.k}</span>
          <div className={cn(serif, "mb-2.5 mt-2 whitespace-pre-line text-4xl leading-[1.1]")}>{c.h}</div>
          <p className="text-[14.5px] text-muted-foreground">{c.p}</p>
          <span className="mt-3 block text-xs text-muted-foreground">{c.by}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[18px] border-t pt-[18px]">
        {c.a.map(([photo, kind, title]: [string, string, string]) => (
          <div key={title}>
            <Photo name={photo} className="mb-2.5 h-[110px] rounded-[10px]" />
            <span className={kicker}>{kind}</span>
            <b className="mt-1 block text-[15.5px] leading-[1.3]">{title}</b>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Majalla most-read list, numbered. */
function MostRead() {
  const c = useCopy("read")
  return (
    <div className={cn(ROOT, "flex flex-col gap-[18px] bg-[color:var(--l-bg-2)] px-[30px] py-7")}>
      <div className="font-serif text-[26px] font-semibold tracking-[-0.02em] rtl:font-arabic rtl:font-extrabold rtl:tracking-normal">{c.h}</div>
      <div className="grid grid-cols-2 gap-x-7 gap-y-4">
        {c.it.map(([photo, kind, title, mins]: [string, string, string, string], i: number) => (
          <div key={title} className="grid grid-cols-[auto_120px_1fr] items-center gap-3.5 border-b pb-4">
            <span className="font-sans text-[28px] font-light tabular-nums text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
            <Photo name={photo} className="h-[84px] rounded-lg" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[.08em] text-fasla-red rtl:text-[12.5px] rtl:normal-case rtl:tracking-normal">{kind}</span>
              <b className="my-[3px] block text-[15.5px] leading-[1.3]">{title}</b>
              <small className="text-xs text-muted-foreground">{mins}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Majalla newsletter sign-up on the inverse surface. */
function Newsletter() {
  const c = useCopy("news")
  return (
    <div className={cn(ROOT, "grid grid-cols-2 items-center gap-[30px] bg-background-inverse px-11 text-foreground-inverse")}>
      <div>
        <div className={cn(H, "text-[30px]")}>{c.h}</div>
        <p className="mt-2 max-w-[340px] text-sm text-muted-foreground-inverse">{c.p}</p>
      </div>
      <div className="flex gap-2">
        <span className="flex h-11 flex-1 items-center gap-2 rounded-[10px] px-3.5 text-sm text-muted-foreground-inverse ring-1 ring-inset ring-muted-foreground-inverse/40">
          <BI n="mail" className="size-4" />
          {c.ph}
        </span>
        <Button className="h-11 rounded-[10px] bg-foreground-inverse text-background-inverse hover:bg-foreground-inverse">{c.b}</Button>
      </div>
    </div>
  )
}

/** One block preview, by key. */
export function Block({ k }: { k: BlockKey }) {
  switch (k) {
    case "hero":
      return <Hero k="hero" photo="f-hero" mark={["R", "ر"]} />
    case "dhero":
      return <Hero k="dhero" photo="dubai" mark={["D", "د"]} />
    case "feat":
      return <Features />
    case "gallery":
      return <Gallery />
    case "ban":
      return <Banner />
    case "auth":
      return <Auth />
    case "price":
      return <Pricing />
    case "checkout":
      return <Checkout />
    case "order":
      return <Order />
    case "dash":
      return <Dashboard />
    case "prod":
      return <Products />
    case "chat":
      return <Messages />
    case "ai":
      return <Assistant />
    case "faq":
      return <Faq />
    case "err":
      return <ErrorState />
    case "cal":
      return <DatePicker />
    case "toast":
      return <Notifications />
    case "stats":
      return <Stats />
    case "app":
      return <AppDownload />
    case "mag":
      return <MagFront />
    case "read":
      return <MostRead />
    case "news":
      return <Newsletter />
  }
}
