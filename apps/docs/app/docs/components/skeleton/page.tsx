"use client"

import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from "../../../../../../packages/smi-ui/registry/ui/skeleton"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function SkeletonPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Skeleton</h1>
          <p className="text-lg text-muted-foreground">
            Loading placeholder components for content that is loading.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx smi-ui add skeleton</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Basic</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Skeleton className="h-12 w-48" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Variants</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex items-center gap-4">
                  <Skeleton variant="default" className="h-12 w-24" />
                  <Skeleton variant="circular" className="h-12 w-12" />
                  <Skeleton variant="rectangular" className="h-12 w-24" />
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Text Skeleton</h2>
            <div className="mt-4">
              <ComponentPreview>
                <SkeletonText lines={3} className="max-w-sm" />
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Avatar Skeleton</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex items-center gap-4">
                  <SkeletonAvatar />
                  <SkeletonAvatar className="h-16 w-16" />
                </div>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Card Skeleton</h2>
            <div className="mt-4">
              <ComponentPreview>
                <SkeletonCard className="max-w-sm" />
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
                    <td className="px-4 py-2 font-mono text-xs">variant</td>
                    <td className="px-4 py-2 font-mono text-xs">default | circular | rectangular</td>
                    <td className="px-4 py-2 font-mono text-xs">default</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">animate</td>
                    <td className="px-4 py-2 font-mono text-xs">boolean</td>
                    <td className="px-4 py-2 font-mono text-xs">true</td>
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
