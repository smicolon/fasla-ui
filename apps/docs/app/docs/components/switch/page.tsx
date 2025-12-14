"use client"

import { useState } from "react"
import { Switch } from "../../../../../../packages/smi-ui/registry/ui/switch"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Switch</h1>
        <p className="text-xl text-muted-foreground">
          A toggle control for switching between on and off states.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add switch</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Switch size="sm" />
            <Switch size="default" />
            <Switch size="lg" />
          </div>
        </ComponentPreview>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Label & Description</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <Switch label="Airplane mode" />
            <Switch
              label="Dark mode"
              description="Toggle dark mode on or off"
            />
            <Switch
              label="Notifications"
              description="Receive push notifications"
              defaultChecked
            />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <ComponentPreview>
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
            <Switch disabled />
            <Switch disabled defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Switch } from "@/components/ui/switch"

// Basic switch
<Switch />

// With label
<Switch label="Airplane mode" />

// With description
<Switch
  label="Dark mode"
  description="Toggle dark mode on or off"
/>

// Different sizes
<Switch size="sm" />
<Switch size="default" />
<Switch size="lg" />

// Controlled
const [enabled, setEnabled] = useState(false)
<Switch
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>`}</CodeBlock>
      </section>
    </div>
  )
}
