"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../../../../packages/smi-ui/registry/ui/card"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function CardPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-[980px]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Card</h1>
          <p className="text-lg text-muted-foreground">
            A composable card component with header, content, and footer sections.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">Installation</h2>
            <div className="mt-4">
              <CodeBlock>npx smi-ui add card</CodeBlock>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card content with any React children.</p>
                  </CardContent>
                  <CardFooter>
                    <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Action
                    </button>
                  </CardFooter>
                </Card>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Simple Card</h2>
            <div className="mt-4">
              <ComponentPreview>
                <Card className="w-[350px] p-6">
                  <p>A simple card with just content.</p>
                </Card>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Usage</h2>
            <div className="mt-4">
              <CodeBlock>{`import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )
}`}</CodeBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
