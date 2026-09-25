"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { DataTable, Pagination, Column } from "@fasla-ui/blocks/data-table/DataTable"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"

interface User {
  id: number
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer" },
]

const columns: Column<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "email", header: "Email", cell: (row) => row.email },
  { id: "role", header: "Role", cell: (row) => row.role },
]

export default function DataTablePage() {
  const t = useTranslations("docs.sections")
  return (
    <div>
      <div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">DataTable</h1>
          <p className="text-lg text-muted-foreground">
            A data table component with sorting, selection, and pagination.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <InstallCommand name="data-table" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <DataTable
                  data={users}
                  columns={columns}
                  getRowKey={(row) => row.id}
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Loading State</h2>
            <div className="mt-4">
              <ComponentPreview>
                <DataTable
                  data={[]}
                  columns={columns}
                  getRowKey={(row) => row.id}
                  loading
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Empty State</h2>
            <div className="mt-4">
              <ComponentPreview>
                <DataTable
                  data={[]}
                  columns={columns}
                  getRowKey={(row) => row.id}
                  emptyState={<p className="text-center text-muted-foreground">No users found</p>}
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("usage")}</h2>
            <div className="mt-4">
              <CodeBlock>{`import { DataTable, Column } from "@/components/blocks/data-table"

const columns: Column<User>[] = [
  { id: "name", header: "Name", cell: (row) => row.name },
  { id: "email", header: "Email", cell: (row) => row.email },
]

<DataTable
  data={users}
  columns={columns}
  getRowKey={(row) => row.id}
  onRowClick={(row) => console.log(row)}
/>`}</CodeBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
