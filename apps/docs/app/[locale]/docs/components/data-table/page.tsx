"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { DataTable, Pagination, type Column } from "@fasla-ui/blocks/data-table/DataTable"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

interface User {
  id: number
  name: string
  email: string
  role: string
}

/** The same team in both locales; emails stay Latin. */
const PEOPLE = [
  { id: 1, key: "a", email: "layla@example.com", role: "admin" },
  { id: 2, key: "b", email: "omar@example.com", role: "editor" },
  { id: 3, key: "c", email: "sara@example.com", role: "viewer" },
] as const

export default function DataTablePage() {
  const t = useTranslations("docs.sections")
  const d = useTranslations("docs.dataTable")
  const [page, setPage] = useState(2)

  const users: User[] = PEOPLE.map((person) => ({
    id: person.id,
    name: d(`people.${person.key}`),
    email: person.email,
    role: d(`roles.${person.role}`),
  }))

  const columns: Column<User>[] = [
    { id: "name", header: d("columns.name"), cell: (row) => row.name },
    { id: "email", header: d("columns.email"), cell: (row) => row.email },
    { id: "role", header: d("columns.role"), cell: (row) => row.role },
  ]

  const labels = {
    pagination: d("pagination.label"),
    status: (current: number, total: number) => d("pagination.status", { page: current, total }),
    previous: d("pagination.previous"),
    next: d("pagination.next"),
    goToPrevious: d("pagination.goToPrevious"),
    goToNext: d("pagination.goToNext"),
    goToPage: (target: number) => d("pagination.goToPage", { page: target }),
  }

  const props: PropRow[] = [
    { prop: "data", type: "T[]", fallback: "", description: d.rich("props.data", richCode) },
    { prop: "columns", type: "Column<T>[]", fallback: "", description: d.rich("props.columns", richCode) },
    { prop: "getRowKey", type: "(row) => string | number", fallback: "", description: d.rich("props.getRowKey", richCode) },
    { prop: "loading", type: "boolean", fallback: "false", description: d.rich("props.loading", richCode) },
    { prop: "emptyState", type: "ReactNode", fallback: "", description: d.rich("props.emptyState", richCode) },
    { prop: "onRowClick", type: "(row) => void", fallback: "", description: d.rich("props.onRowClick", richCode) },
    { prop: "selectedKey", type: "string | number", fallback: "", description: d.rich("props.selectedKey", richCode) },
    { prop: "stickyHeader", type: "boolean", fallback: "false", description: d.rich("props.stickyHeader", richCode) },
    { prop: "Pagination", type: "{ page, totalPages, onPageChange, labels }", fallback: "", description: d.rich("props.pagination", richCode) },
    { prop: "className", type: "string", fallback: "", description: d.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/data-table/" /></h1>
        <p className="text-xl text-muted-foreground">{d("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="data-table" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <DataTable data={users} columns={columns} getRowKey={(row) => row.id} />
        </ComponentPreview>
      </section>

      {/* Pagination */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("paginationTitle")}</h2>
        <ComponentPreview>
          <Pagination page={page} totalPages={5} onPageChange={setPage} labels={labels} className="w-full" />
        </ComponentPreview>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("loadingTitle")}</h2>
        <ComponentPreview>
          <DataTable data={[]} columns={columns} getRowKey={(row) => row.id} loading />
        </ComponentPreview>
      </section>

      {/* Empty State */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{d("emptyTitle")}</h2>
        <ComponentPreview>
          <DataTable
            data={[]}
            columns={columns}
            getRowKey={(row) => row.id}
            emptyState={<p className="text-center text-muted-foreground">{d("empty")}</p>}
          />
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
        <UsageExample>{`"use client"

import { useState } from "react"
import { DataTable, type Column } from "@/components/blocks/data-table"

interface User {
  id: number
  name: string
  email: string
  role: string
}

const users: User[] = [
${users.map((u) => `  { id: ${u.id}, name: "${u.name}", email: "${u.email}", role: "${u.role}" },`).join("\n")}
]

const columns: Column<User>[] = [
  { id: "name", header: "${d("columns.name")}", cell: (row) => row.name },
  { id: "email", header: "${d("columns.email")}", cell: (row) => row.email },
  { id: "role", header: "${d("columns.role")}", cell: (row) => row.role },
]

export function UsersTable() {
  const [selected, setSelected] = useState<number>()

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowKey={(row) => row.id}
      selectedKey={selected}
      onRowClick={(row) => setSelected(row.id)}
    />
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
