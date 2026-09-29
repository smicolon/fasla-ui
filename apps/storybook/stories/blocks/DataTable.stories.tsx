import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DataTable, Pagination, Column } from "../../../../packages/fasla-ui/registry/blocks/data-table/DataTable"
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
    pagination: undefined,
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
    pagination: {
      pagination: "التنقّل بين الصفحات",
      status: (page: number, total: number) => `الصفحة ${page} من ${total}`,
      previous: "السابق",
      next: "التالي",
      goToPrevious: "الانتقال إلى الصفحة السابقة",
      goToNext: "الانتقال إلى الصفحة التالية",
      goToPage: (page: number) => `الانتقال إلى الصفحة ${page}`,
    },
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
  // `right` is the end of the reading direction, so it mirrors in RTL.
  { id: "createdAt", header: c.headers.created, cell: (row) => row.createdAt, align: "right" },
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
      <div>
        <DataTable data={paginatedData} columns={columnsFor(c)} getRowKey={(row) => row.id} />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} labels={c.pagination} />
      </div>
    )
  },
}
