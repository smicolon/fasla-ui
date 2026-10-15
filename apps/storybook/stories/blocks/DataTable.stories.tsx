import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DataTable, Column } from "../../../../packages/fasla-ui/registry/blocks/data-table/DataTable"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../packages/fasla-ui/registry/ui/pagination"
import { Badge } from "../../../../packages/fasla-ui/registry/ui/badge"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"

const meta: Meta<typeof DataTable> = {
  title: "Blocks/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DataTable>

interface User {
  id: number
  name: string
  email: string
  role: string
  active: boolean
  createdAt: string
}

/**
 * Sample copy, per script: the same store team as the docs page. Emails and
 * dates stay Latin; names, roles, headers and the table's own text change. The
 * Arabic follows design/content/. Role and status use the library's Badge.
 */
const COPY = {
  ltr: {
    names: ["Layla Haddad", "Omar Khalil", "Sara Nasser", "Yousef Amin", "Noor Saleh"],
    roles: ["Admin", "Editor", "Viewer", "Editor", "Viewer"],
    headers: { name: "Name", email: "Email", role: "Role", status: "Status", created: "Created" },
    active: "Active",
    inactive: "Inactive",
    empty: "No users found",
    addFirst: "Add your first user",
    clicked: (name: string) => `Clicked: ${name}`,
    pagination: "Pagination",
    status: (page: number, total: number) => `Page ${page} of ${total}`,
  },
  rtl: {
    names: ["ليلى حداد", "عمر خليل", "سارة ناصر", "يوسف أمين", "نور صالح"],
    roles: ["مدير", "محرر", "مشاهد", "محرر", "مشاهد"],
    headers: { name: "الاسم", email: "البريد الإلكتروني", role: "الدور", status: "الحالة", created: "تاريخ الإنشاء" },
    active: "نشط",
    inactive: "غير نشط",
    empty: "لا يوجد مستخدمون",
    addFirst: "أضف أول مستخدم",
    clicked: (name: string) => `تم النقر على: ${name}`,
    pagination: "التنقّل بين الصفحات",
    status: (page: number, total: number) => `الصفحة ${page} من ${total}`,
  },
}

type StoryCtx = { globals: { direction?: string } }
type Copy = (typeof COPY)["ltr"] | (typeof COPY)["rtl"]
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const EMAILS = ["layla", "omar", "sara", "yousef", "noor"]
const DATES = ["2024-01-15", "2024-02-20", "2024-03-10", "2024-04-05", "2024-05-12"]

const usersFor = (c: Copy): User[] =>
  c.names.map((name, i) => ({
    id: i + 1,
    name,
    email: `${EMAILS[i]}@example.com`,
    role: c.roles[i]!,
    active: i !== 2,
    createdAt: DATES[i]!,
  }))

const columnsFor = (c: Copy): Column<User>[] => [
  { id: "name", header: c.headers.name, cell: (row) => <span className="font-medium">{row.name}</span> },
  { id: "email", header: c.headers.email, cell: (row) => row.email },
  {
    id: "role",
    header: c.headers.role,
    cell: (row) => (
      <Badge variant="soft" tone="secondary">
        {row.role}
      </Badge>
    ),
  },
  {
    id: "status",
    header: c.headers.status,
    cell: (row) => (
      <Badge variant="soft" tone={row.active ? "success" : "secondary"}>
        {row.active ? c.active : c.inactive}
      </Badge>
    ),
  },
  // `end` follows the reading direction, so the dates sit on the left in RTL.
  { id: "createdAt", header: c.headers.created, cell: (row) => row.createdAt, align: "end" },
]

export const Default: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return <DataTable data={usersFor(c)} columns={columnsFor(c)} getRowKey={(row) => row.id} />
  },
}

export const Loading: Story = {
  render: (_args, ctx) => (
    <DataTable data={[]} columns={columnsFor(copy(ctx))} getRowKey={(row: User) => row.id} loading />
  ),
}

export const Empty: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <DataTable
        data={[]}
        columns={columnsFor(c)}
        getRowKey={(row: User) => row.id}
        emptyState={
          <div className="text-center">
            <p className="text-muted-foreground">{c.empty}</p>
            <Button variant="link" className="mt-2">
              {c.addFirst}
            </Button>
          </div>
        }
      />
    )
  },
}

export const Clickable: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <DataTable
        data={usersFor(c)}
        columns={columnsFor(c)}
        getRowKey={(row) => row.id}
        onRowClick={(row) => alert(c.clicked(row.name))}
      />
    )
  },
}

export const WithSelection: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const [selectedKey, setSelectedKey] = useState<number | undefined>(1)
    return (
      <DataTable
        data={usersFor(c)}
        columns={columnsFor(c)}
        getRowKey={(row) => row.id}
        selectedKey={selectedKey}
        onRowClick={(row) => setSelectedKey(row.id)}
      />
    )
  },
}

export const StickyHeader: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const users = usersFor(c)
    const rows = [...users, ...users, ...users].map((user, i) => ({ ...user, id: i + 1 }))
    return (
      <DataTable
        data={rows}
        columns={columnsFor(c)}
        getRowKey={(row) => row.id}
        stickyHeader
        className="max-h-[300px] overflow-auto"
      />
    )
  },
}

export const WithPagination: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    const users = usersFor(c)
    const [page, setPage] = useState(1)
    const pageSize = 2
    const totalPages = Math.ceil(users.length / pageSize)
    const paginatedData = users.slice((page - 1) * pageSize, page * pageSize)

    return (
      <div className="space-y-3">
        <DataTable data={paginatedData} columns={columnsFor(c)} getRowKey={(row) => row.id} />
        {/* The table's own Pagination: buttons, since paging here changes state, not the URL. */}
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{c.status(page, totalPages)}</p>
          <Pagination aria-label={c.pagination} size="sm" className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious asChild iconOnly disabled={page === 1}>
                  <button type="button" onClick={() => setPage(page - 1)} />
                </PaginationPrevious>
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink asChild isActive={n === page}>
                    <button type="button" onClick={() => setPage(n)}>
                      {n}
                    </button>
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext asChild iconOnly disabled={page === totalPages}>
                  <button type="button" onClick={() => setPage(page + 1)} />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    )
  },
}
