"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"
import { localeDirection, type Locale } from "@/i18n/routing"

/** Sanad's month-end balance for 2025, in thousands of SAR. */
const DATA = [142.6, 148.1, 151.9, 149.4, 156.8, 161.2, 158.7, 165.3, 170.9, 174.2, 179.8, 184.3]
const MIN = 120
const MAX = 200
const HEIGHT = 230

/**
 * The balance chart in the hero's product window, drawn to scale. Time runs
 * with the reading direction: January sits on the start side, so in Arabic the
 * line climbs from right to left and the value axis moves to the right.
 *
 * Landing-only. Fasla has no chart component yet, so this is plain SVG on the
 * chart tokens, redrawn at the real width so its labels never scale.
 */
export function SanadChart({
  label,
  months,
  thousands,
  tip,
}: {
  label: string
  /** Twelve month names, comma-separated. */
  months: string
  /** Suffix for the axis values, e.g. "k". */
  thousands: string
  /** The last point's value, written out. */
  tip: string
}) {
  const locale = useLocale() as Locale
  const rtl = localeDirection[locale] === "rtl"
  const box = useRef<HTMLDivElement>(null)
  // A first guess for the server render; the observer corrects it.
  const [width, setWidth] = useState(900)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.round(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const w = width
  const h = HEIGHT
  // Arabic axis labels ("120 ألف") are wider than "120k".
  const padStart = rtl ? 58 : 44
  const padEnd = 14
  const padTop = 30
  const padBottom = 26
  const step = (w - padStart - padEnd) / (DATA.length - 1)
  const x = (i: number) => (rtl ? w - padStart - i * step : padStart + i * step)
  const y = (v: number) => padTop + (1 - (v - MIN) / (MAX - MIN)) * (h - padTop - padBottom)

  const names = months.split(",")
  // Every other month when the labels would collide, counted back from
  // December so the last label always shows and never crowds the one before.
  const every = step < (rtl ? 50 : 34) ? 2 : 1
  const line = DATA.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("")
  const last = DATA.length - 1
  const lx = x(last)
  const ly = y(DATA[last])
  const tipWidth = rtl ? 92 : 78
  const tipX = Math.max(0, rtl ? lx + 4 : lx - tipWidth - 4)
  const ticks = [120, 140, 160, 180, 200]

  return (
    <div ref={box} className="mt-2 h-[230px]">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} className="block size-full overflow-visible">
        {ticks.map((v) => (
          <g key={v}>
            <line
              x1={rtl ? padEnd : padStart}
              x2={rtl ? w - padStart : w - padEnd}
              y1={y(v)}
              y2={y(v)}
              className="stroke-border"
            />
            <text
              x={rtl ? w - padStart + 10 : padStart - 10}
              y={y(v) + 4}
              textAnchor="end"
              direction={rtl ? "rtl" : "ltr"}
              className="fill-muted-foreground text-[11px] tabular-nums"
            >
              {v}
              {thousands}
            </text>
          </g>
        ))}
        {names.map((m, i) =>
          (last - i) % every === 0 ? (
            <text key={m} x={x(i)} y={h - 6} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {m}
            </text>
          ) : null
        )}
        <path d={`${line}L${lx.toFixed(1)} ${y(MIN)}L${x(0).toFixed(1)} ${y(MIN)}Z`} className="fill-chart-2/[.12]" />
        <path d={line} className="fill-none stroke-chart-2 [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.25]" />
        <line x1={lx} x2={lx} y1={ly} y2={y(MIN)} strokeDasharray="3 3" className="stroke-border" />
        <circle cx={lx} cy={ly} r={4.5} className="fill-card stroke-chart-2 [stroke-width:2.25]" />
        <rect x={tipX} y={ly - 30} width={tipWidth} height={22} rx={6} className="fill-primary" />
        <text
          x={tipX + tipWidth / 2}
          y={ly - 15}
          textAnchor="middle"
          direction={rtl ? "rtl" : "ltr"}
          className="fill-primary-foreground text-[11px] font-semibold"
        >
          {tip}
        </text>
      </svg>
    </div>
  )
}
