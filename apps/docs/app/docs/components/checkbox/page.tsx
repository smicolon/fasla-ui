"use client"

import { useState } from "react"
import { Checkbox } from "../../../../../../packages/smi-ui/registry/ui/checkbox"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Checkbox</h1>
        <p className="text-xl text-muted-foreground">
          A control that allows the user to toggle between checked and not checked.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add checkbox</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Checkbox />
            <Checkbox defaultChecked />
            <Checkbox label="Accept terms" />
          </div>
        </ComponentPreview>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Label & Description</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Checkbox label="Email notifications" />
            <Checkbox
              label="Marketing emails"
              description="Receive emails about new products and features"
            />
            <Checkbox
              label="Security alerts"
              description="Get notified about security updates"
              defaultChecked
            />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Checkbox label="Default" />
            <Checkbox label="Checked" defaultChecked />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Error state" error />
          </div>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Checkbox } from "@/components/ui/checkbox"

// Basic checkbox
<Checkbox />

// With label
<Checkbox label="Accept terms and conditions" />

// With description
<Checkbox
  label="Marketing emails"
  description="Receive emails about new products"
/>

// Indeterminate state
<Checkbox indeterminate />

// Error state
<Checkbox label="Required field" error />`}</CodeBlock>
      </section>
    </div>
  )
}
