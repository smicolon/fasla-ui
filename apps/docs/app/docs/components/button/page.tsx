"use client"

import { Button } from "../../../../../../packages/smi-ui/registry/ui/button"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function ButtonPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Button</h1>
          <p className="text-lg text-muted-foreground">
            A button component with multiple variants, sizes, and loading state.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {/* Installation */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx smi-ui add button</CodeBlock>
            </div>
          </section>

          {/* Preview */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Button>Click me</Button>
              </ComponentPreview>
            </div>
          </section>

          {/* Variants */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Variants</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </ComponentPreview>
            </div>
          </section>

          {/* Sizes */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Sizes</h2>
            <div className="mt-4">
              <ComponentPreview>
                <div className="flex items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </ComponentPreview>
            </div>
          </section>

          {/* Loading */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Loading</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Button loading>Loading...</Button>
              </ComponentPreview>
            </div>
          </section>

          {/* Usage */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Usage</h2>
            <div className="mt-4">
              <CodeBlock>{`import { Button } from "@/components/ui/button"

export function Example() {
  return (
    <Button variant="default" size="default">
      Click me
    </Button>
  )
}`}</CodeBlock>
            </div>
          </section>

          {/* Props */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Props</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-semibold">Prop</th>
                    <th className="px-4 py-2 text-left font-semibold">Type</th>
                    <th className="px-4 py-2 text-left font-semibold">Default</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">variant</td>
                    <td className="px-4 py-2 font-mono text-xs">default | destructive | outline | secondary | ghost | link</td>
                    <td className="px-4 py-2 font-mono text-xs">default</td>
                    <td className="px-4 py-2">The visual style of the button</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">size</td>
                    <td className="px-4 py-2 font-mono text-xs">default | sm | lg | icon</td>
                    <td className="px-4 py-2 font-mono text-xs">default</td>
                    <td className="px-4 py-2">The size of the button</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">loading</td>
                    <td className="px-4 py-2 font-mono text-xs">boolean</td>
                    <td className="px-4 py-2 font-mono text-xs">false</td>
                    <td className="px-4 py-2">Shows a loading spinner</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">asChild</td>
                    <td className="px-4 py-2 font-mono text-xs">boolean</td>
                    <td className="px-4 py-2 font-mono text-xs">false</td>
                    <td className="px-4 py-2">Render as child component</td>
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
