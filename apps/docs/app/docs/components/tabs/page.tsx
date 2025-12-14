"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../../../packages/smi-ui/registry/ui/tabs"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function TabsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Tabs</h1>
        <p className="text-xl text-muted-foreground">
          A set of layered sections of content that display one panel at a time.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <CodeBlock>npx @smicolon/smi-ui add tabs</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Preview</h2>
        <ComponentPreview>
          <Tabs defaultValue="account" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <div className="p-4 border rounded-lg mt-2">
                <h3 className="font-semibold">Account</h3>
                <p className="text-sm text-muted-foreground">
                  Make changes to your account here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="p-4 border rounded-lg mt-2">
                <h3 className="font-semibold">Password</h3>
                <p className="text-sm text-muted-foreground">
                  Change your password here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="p-4 border rounded-lg mt-2">
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your settings here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ComponentPreview>
      </section>

      {/* With Disabled Tab */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Disabled Tab</h2>
        <ComponentPreview>
          <Tabs defaultValue="tab1" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="tab1">Active</TabsTrigger>
              <TabsTrigger value="tab2" disabled>Disabled</TabsTrigger>
              <TabsTrigger value="tab3">Another</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="p-4 border rounded-lg mt-2">
                Content for the first tab.
              </div>
            </TabsContent>
            <TabsContent value="tab3">
              <div className="p-4 border rounded-lg mt-2">
                Content for the third tab.
              </div>
            </TabsContent>
          </Tabs>
        </ComponentPreview>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <CodeBlock>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Basic tabs
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account content here.
  </TabsContent>
  <TabsContent value="password">
    Password content here.
  </TabsContent>
</Tabs>

// Controlled tabs
const [value, setValue] = useState("account")
<Tabs value={value} onValueChange={setValue}>
  ...
</Tabs>`}</CodeBlock>
      </section>
    </div>
  )
}
