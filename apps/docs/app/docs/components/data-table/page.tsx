"use client"

import { useState } from "react"
import { DataTable, Pagination, Column } from "../../../../../../packages/fasla-ui/registry/blocks/data-table/DataTable"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

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
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">DataTable</h1>
          <p className="text-lg text-muted-foreground">
            A data table component with sorting, selection, and pagination.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add data-table</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
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
            <h2 className="text-2xl font-bold tracking-tight">Loading State</h2>
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
            <h2 className="text-2xl font-bold tracking-tight">Empty State</h2>
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
            <h2 className="text-2xl font-bold tracking-tight">Usage</h2>
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
