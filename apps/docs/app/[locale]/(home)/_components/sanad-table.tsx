"use client"

import { useTranslations } from "next-intl"
import { Avatar } from "@fasla-ui/ui/avatar/avatar"
import { Badge } from "@fasla-ui/ui/badge/badge"
import { DataTable, type Column } from "@fasla-ui/blocks/data-table/DataTable"
import { DotIcon } from "./icons"
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

const tone = { done: "success", pend: "warning", sched: "info" } as const

/**
 * Sanad's recent transactions. A client component because DataTable wires a
 * click handler on every row, which a server component cannot pass down.
 */
export function SanadTable() {
  const t = useTranslations("landing.sanad")

  const columns: Column<Row>[] = [
    {
      id: "who",
      header: t("th1"),
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            {...(row.id === 1 ? xrayTag("Avatar", 10) : {})}
            variant={row.photo ? "image" : "initials"}
            src={row.photo ? `/landing/img/${row.photo}.webp` : undefined}
            name={t(`${row.key}n`)}
            radius="rounded"
          />
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
      cell: (row) => (
        <span className="whitespace-nowrap font-medium">
          <bdi dir="ltr" className="tabular-nums">
            {row.amount}
          </bdi>{" "}
          <span className="text-xs font-normal text-muted-foreground">{t("cur")}</span>
        </span>
      ),
    },
    {
      id: "status",
      header: t("th4"),
      cell: (row) => (
        <Badge
          {...(row.id === 1 ? xrayTag("Badge", 11) : {})}
          variant="soft"
          tone={tone[row.status]}
          size="md"
          icon={<DotIcon />}
        >
          {t(row.status)}
        </Badge>
      ),
    },
  ]

  return (
    <DataTable
      {...xrayTag("DataTable", 8)}
      data={ROWS}
      columns={columns}
      getRowKey={(row) => row.id}
      className="rounded-none border-0 [&_thead]:bg-muted/50 [&_tr:last-child]:border-b-0"
    />
  )
}
