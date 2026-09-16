"use client"

import { EmptyState, EmptySearchResults, EmptyData } from "../../../../../../packages/fasla-ui/registry/blocks/empty-state/EmptyState"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function EmptyStatePage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">EmptyState</h1>
          <p className="text-lg text-muted-foreground">
            Display contextual empty states with icons, titles, descriptions, and actions.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx fasla-ui add empty-state</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <EmptyState
                  title="No projects yet"
                  description="Get started by creating your first project."
                  action={
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Create Project
                    </button>
                  }
                />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Search Results</h2>
            <div className="mt-4">
              <ComponentPreview>
                <EmptySearchResults query="dashboard" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Empty Data</h2>
            <div className="mt-4">
              <ComponentPreview>
                <EmptyData resourceName="tasks" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Sizes</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="space-y-8">
                  <EmptyState size="sm" title="Small empty state" />
                  <EmptyState size="default" title="Default empty state" />
                  <EmptyState size="lg" title="Large empty state" />
                </div>
              </ComponentPreview>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
