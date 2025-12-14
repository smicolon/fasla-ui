"use client"

import { Textarea } from "../../../../../../packages/smi-ui/registry/ui/textarea"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function TextareaPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Textarea</h1>
        <p className="text-xl text-muted-foreground">
          A multi-line text input with character count and resize options.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add textarea</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <Textarea
            placeholder="Type your message here..."
            className="w-full max-w-sm"
          />
        </ComponentPreview>
      </section>

      {/* With Character Count */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Character Count</h2>
        <ComponentPreview>
          <Textarea
            placeholder="Type your message..."
            showCount
            maxLength={200}
            className="w-full max-w-sm"
          />
        </ComponentPreview>
      </section>

      {/* Resize Options */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Resize Options</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Textarea placeholder="No resize" resize="none" />
            <Textarea placeholder="Vertical resize (default)" resize="vertical" />
            <Textarea placeholder="Both directions" resize="both" />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <Textarea placeholder="Default" />
            <Textarea placeholder="Error state" variant="error" />
            <Textarea placeholder="Disabled" disabled />
          </div>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Textarea } from "@/components/ui/textarea"

// Basic textarea
<Textarea placeholder="Type your message..." />

// With character count
<Textarea
  placeholder="Type here..."
  showCount
  maxLength={200}
/>

// Different resize options
<Textarea resize="none" />
<Textarea resize="vertical" />
<Textarea resize="both" />

// Error state
<Textarea variant="error" />`}</CodeBlock>
      </section>
    </div>
  )
}
