"use client"

import { PageHeader } from "../../../../../../packages/fasla-ui/registry/blocks/page-header/PageHeader"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function PageHeaderPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">PageHeader</h1>
          <p className="text-lg text-muted-foreground">
            Page header with title, description, breadcrumbs, and actions.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add page-header</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <PageHeader
                  title="Projects"
                  description="Manage your projects and team members"
                  headingLevel={3}
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">With Actions</h2>
            <div className="mt-4">
              <ComponentPreview>
                <PageHeader
                  title="Team Members"
                  description="Invite and manage your team"
                  headingLevel={3}
                  actions={
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Add Member
                    </button>
                  }
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">With Breadcrumb</h2>
            <div className="mt-4">
              <ComponentPreview>
                <PageHeader
                  title="Settings"
                  headingLevel={3}
                  breadcrumb={
                    <div className="flex items-center gap-2 text-sm">
                      <a href="#">Home</a>
                      <span>/</span>
                      <span>Settings</span>
                    </div>
                  }
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Props</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">Prop</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">title</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">required</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">description</td>
                    <td className="px-4 py-2 font-mono text-xs">string</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">actions</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">breadcrumb</td>
                    <td className="px-4 py-2 font-mono text-xs">ReactNode</td>
                    <td className="px-4 py-2 font-mono text-xs">-</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">bordered</td>
                    <td className="px-4 py-2 font-mono text-xs">boolean</td>
                    <td className="px-4 py-2 font-mono text-xs">true</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">headingLevel</td>
                    <td className="px-4 py-2 font-mono text-xs">1 | 2 | 3</td>
                    <td className="px-4 py-2 font-mono text-xs">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
