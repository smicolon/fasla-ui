import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { DataTable, Pagination, Column } from "../../../../packages/fasla-ui/registry/blocks/data-table/DataTable"

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

// Sample data
interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  createdAt: string
}

const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", createdAt: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "active", createdAt: "2024-02-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "inactive", createdAt: "2024-03-10" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "active", createdAt: "2024-04-05" },
  { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "Viewer", status: "active", createdAt: "2024-05-12" },
]

const columns: Column<User>[] = [
  {
    id: "name",
    header: "Name",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "email",
    header: "Email",
    cell: (row) => row.email,
  },
  {
    id: "role",
    header: "Role",
    cell: (row) => (
      <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-secondary">
        {row.role}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          row.status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    id: "createdAt",
    header: "Created",
    cell: (row) => row.createdAt,
    align: "right",
  },
]

export const Default: Story = {
  render: () => (
    <DataTable
      data={users}
      columns={columns}
      getRowKey={(row) => row.id}
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      getRowKey={(row: User) => row.id}
      loading
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      getRowKey={(row: User) => row.id}
      emptyState={
        <div className="text-center">
          <p className="text-muted-foreground">No users found</p>
          <button className="mt-2 text-sm text-primary hover:underline">
            Add your first user
          </button>
        </div>
      }
    />
  ),
}

export const Clickable: Story = {
  render: () => (
    <DataTable
      data={users}
      columns={columns}
      getRowKey={(row) => row.id}
      onRowClick={(row) => alert(`Clicked: ${row.name}`)}
    />
  ),
}

export const WithSelection: Story = {
  render: () => {
    const [selectedKey, setSelectedKey] = useState<number | undefined>(1)
    return (
      <DataTable
        data={users}
        columns={columns}
        getRowKey={(row) => row.id}
        selectedKey={selectedKey}
        onRowClick={(row) => setSelectedKey(row.id)}
      />
    )
  },
}

export const StickyHeader: Story = {
  render: () => (
    <DataTable
      data={[...users, ...users, ...users]}
      columns={columns}
      getRowKey={(row) => row.id}
      stickyHeader
      className="max-h-[300px] overflow-auto"
    />
  ),
}

export const WithPagination: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const pageSize = 2
    const totalPages = Math.ceil(users.length / pageSize)
    const paginatedData = users.slice((page - 1) * pageSize, page * pageSize)

    return (
      <div>
        <DataTable
          data={paginatedData}
          columns={columns}
          getRowKey={(row) => row.id}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    )
  },
}
