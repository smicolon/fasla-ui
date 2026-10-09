"use client"

import { useTranslations } from "next-intl"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fasla-ui/ui/tabs"
import { ComponentPreview, UsageExample } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, richCode, type PropRow } from "@/components/props-table"

const TABS = ["account", "password", "settings"] as const

export default function TabsPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.tabs")

  const props: PropRow[] = [
    { prop: "value", type: "string", fallback: "", description: a.rich("props.value", richCode) },
    { prop: "defaultValue", type: "string", fallback: "", description: a.rich("props.defaultValue", richCode) },
    { prop: "onValueChange", type: "(value) => void", fallback: "", description: a.rich("props.onValueChange", richCode) },
    { prop: "TabsTrigger", type: "{ value, disabled }", fallback: "", description: a.rich("props.trigger", richCode) },
    { prop: "TabsContent", type: "{ value }", fallback: "", description: a.rich("props.content", richCode) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", richCode) },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold"><ComponentName path="/docs/components/tabs/" /></h1>
        <p className="text-xl text-muted-foreground">{a("lead")}</p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <InstallCommand name="tabs" />
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <Tabs defaultValue="account" className="w-full max-w-md">
            <TabsList>
              {TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {a(`tabs.${tab}`)}
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="mt-2 rounded-lg border p-4">
                  <h3 className="font-semibold">{a(`tabs.${tab}`)}</h3>
                  <p className="text-sm text-muted-foreground">{a(`panels.${tab}`)}</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ComponentPreview>
      </section>

      {/* With Disabled Tab */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{a("disabledTitle")}</h2>
        <ComponentPreview>
          <Tabs defaultValue="current" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="current">{a("disabled.current")}</TabsTrigger>
              <TabsTrigger value="invoices" disabled>
                {a("disabled.invoices")}
              </TabsTrigger>
              <TabsTrigger value="past">{a("disabled.past")}</TabsTrigger>
            </TabsList>
            <TabsContent value="current">
              <div className="mt-2 rounded-lg border p-4">{a("disabled.currentText")}</div>
            </TabsContent>
            <TabsContent value="past">
              <div className="mt-2 rounded-lg border p-4">{a("disabled.pastText")}</div>
            </TabsContent>
          </Tabs>
        </ComponentPreview>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <UsageExample title={a("usage.basic")}>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function AccountTabs() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">${a("tabs.account")}</TabsTrigger>
        <TabsTrigger value="password">${a("tabs.password")}</TabsTrigger>
      </TabsList>
      <TabsContent value="account">${a("usage.accountContent")}</TabsContent>
      <TabsContent value="password">${a("usage.passwordContent")}</TabsContent>
    </Tabs>
  )
}`}</UsageExample>
        <UsageExample title={a("usage.controlled")}>{`"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function ControlledAccountTabs() {
  const [value, setValue] = useState("account")

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="account">${a("tabs.account")}</TabsTrigger>
        <TabsTrigger value="password">${a("tabs.password")}</TabsTrigger>
      </TabsList>
      <TabsContent value="account">${a("usage.accountContent")}</TabsContent>
      <TabsContent value="password">${a("usage.passwordContent")}</TabsContent>
    </Tabs>
  )
}`}</UsageExample>
      </section>
    </div>
  )
}
