"use client"

import type { ComponentProps, ReactNode } from "react"
import { useTranslations } from "next-intl"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { DotIcon } from "./icons"
import { Initials } from "./initials"
import { xrayTag } from "./xray-tag"

type Row = {
  id: number
  key: "r1" | "r2" | "r3" | "r4"
  amount: string
  photo?: string
  status: "done" | "pend" | "sched"
}

const ROWS: Row[] = [
  { id: 1, key: "r1", amount: "+4,500.00", photo: "p-noura", status: "done" },
  { id: 2, key: "r2", amount: "−1,250.00", photo: "p-khalid", status: "pend" },
  { id: 3, key: "r3", amount: "+186.50", photo: "p-faisal", status: "done" },
  { id: 4, key: "r4", amount: "−3,200.00", status: "sched" },
]

type Column<T> = {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  width?: string
  align?: "start" | "end"
}

const tone = { done: "success", pend: "warning", sched: "info" } as const

/** A transaction's status as a soft Badge in its tone. */
function StatusBadge({
  status,
  label,
  ...props
}: { status: Row["status"]; label: string } & Omit<ComponentProps<typeof Badge>, "children">) {
  return (
    <Badge variant="soft" tone={tone[status]} size="md" icon={<DotIcon />} {...props}>
      {label}
    </Badge>
  )
}

/**
 * Sanad's recent transactions: a plain table, drawn for the landing only.
 */
export function SanadTable() {
  const t = useTranslations("landing.sanad")

  const columns: Column<Row>[] = [
    {
      id: "who",
      header: t("th1"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <Avatar
              {...(row.id === 1 ? xrayTag("Avatar", 10, { space: "tight" }) : {})}
              src={`/landing/img/${row.photo}.webp`}
              name={t(`${row.key}n`)}
              radius="rounded"
            />
          ) : (
            <Initials>{t(`${row.key}i`)}</Initials>
          )}
          <div className="min-w-0">
            <span className="block whitespace-nowrap">{t(`${row.key}n`)}</span>
            <small className="block whitespace-nowrap text-xs text-muted-foreground">{t(`${row.key}t`)}</small>
          </div>
        </div>
      ),
    },
    {
      id: "date",
      header: t("th2"),
      width: "whitespace-nowrap tabular-nums max-[560px]:hidden",
      cell: (row) => t(`${row.key}d`),
    },
    {
      id: "amount",
      header: t("th3"),
      align: "end",
      // On phones the Status column is hidden and its badge sits under the
      // amount: the picture is inert, so a table wider than the screen could
      // never be scrolled to it.
      cell: (row) => (
        <div className="flex flex-col items-end gap-1">
          <span className="whitespace-nowrap font-medium">
            <bdi dir="ltr" className="tabular-nums">
              {row.amount}
            </bdi>{" "}
            <span className="text-xs font-normal text-muted-foreground">{t("cur")}</span>
          </span>
          <StatusBadge status={row.status} label={t(row.status)} className="min-[561px]:hidden" />
        </div>
      ),
    },
    {
      id: "status",
      header: t("th4"),
      width: "max-[560px]:hidden",
      cell: (row) => (
        <StatusBadge
          {...(row.id === 1 ? xrayTag("Badge", 11, { space: "tight" }) : {})}
          status={row.status}
          label={t(row.status)}
        />
      ),
    },
  ]

  return (
    <div {...xrayTag("Card", 8)} className="l-tag-in-end overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-muted/50">
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-5 py-2.5 text-xs font-medium text-muted-foreground max-[560px]:px-3.5 ${column.align === "end" ? "text-end" : "text-start"} ${column.width ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.id} className="border-b last:border-b-0">
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={`px-5 py-3 max-[560px]:px-3.5 ${column.align === "end" ? "text-end" : "text-start"} ${column.width ?? ""}`}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
