"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fasla-ui/ui/tabs"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"
import { ComponentName } from "@/components/component-name"
import { PropsTable, type PropRow } from "@/components/props-table"
import { localeDirection, type Locale } from "@/i18n/routing"

const TABS = ["account", "password", "billing", "settings"] as const
const VARIANTS = ["boxed", "bordered", "lifted"] as const
const SIZES = ["sm", "md", "lg"] as const

export default function TabsPage() {
  const t = useTranslations("docs.sections")
  const a = useTranslations("docs.tabs")
  const isRtl = localeDirection[useLocale() as Locale] === "rtl"
  const [value, setValue] = useState<string>("password")

  // Prop and value names are code identifiers, so they stay Latin in both
  // locales; the sentence around them is the locale's. `nowrap` keeps each one
  // a single unit: `aria-labelledby` must not break at its hyphen.
  const code = (chunks: React.ReactNode) => (
    <code className="whitespace-nowrap text-sm">{chunks}</code>
  )
  const rich = { code }

  /** One group of the four sample tabs, for the style and size sections. */
  const group = (variant: (typeof VARIANTS)[number], size?: (typeof SIZES)[number]) => (
    <Tabs defaultValue="account">
      <TabsList variant={variant} size={size} aria-label={a("examples.label")}>
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {a(`tabs.${tab}`)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )

  // One table, in a fixed order: state on Tabs, then appearance on TabsList,
  // then the two parts, then styling.
  const props: PropRow[] = [
    { prop: "value", type: "string", fallback: "", description: a.rich("props.value", rich) },
    { prop: "defaultValue", type: "string", fallback: "", description: a.rich("props.defaultValue", rich) },
    { prop: "onValueChange", type: "(value) => void", fallback: "", description: a.rich("props.onValueChange", rich) },
    { prop: "variant", type: '"boxed" | "bordered" | "lifted"', fallback: '"boxed"', description: a.rich("props.variant", rich) },
    { prop: "size", type: '"sm" | "md" | "lg"', fallback: '"md"', description: a.rich("props.size", rich) },
    { prop: "TabsTrigger", type: "{ value, disabled }", fallback: "", description: a.rich("props.trigger", rich) },
    { prop: "TabsContent", type: "{ value }", fallback: "", description: a.rich("props.content", rich) },
    { prop: "className", type: "string", fallback: "", description: a.rich("props.className", rich) },
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
            <TabsList aria-label={a("examples.label")}>
              {TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {a(`tabs.${tab}`)}
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold">{a(`tabs.${tab}`)}</h3>
                  <p className="text-sm text-muted-foreground">{a(`panels.${tab}`)}</p>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p className="text-muted-foreground">{a.rich("variantsBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-6">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col gap-2">
                <code className="w-fit text-sm text-muted-foreground">{variant}</code>
                {group(variant)}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <p className="text-muted-foreground">{a.rich("sizesBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            {SIZES.map((size) => (
              <div key={size} className="flex flex-col gap-2">
                <code className="w-fit text-sm text-muted-foreground">{size}</code>
                {group("boxed", size)}
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p className="text-muted-foreground">{a.rich("statesBody", rich)}</p>
        <ComponentPreview>
          <div className="flex flex-col gap-6">
            {VARIANTS.map((variant) => (
              <Tabs key={variant} defaultValue="current">
                <TabsList variant={variant} aria-label={a("disabled.label")}>
                  <TabsTrigger value="current">{a("disabled.current")}</TabsTrigger>
                  <TabsTrigger value="invoices" disabled>
                    {a("disabled.invoices")}
                  </TabsTrigger>
                  <TabsTrigger value="past">{a("disabled.past")}</TabsTrigger>
                </TabsList>
                <TabsContent value="current">
                  <p className="text-sm text-muted-foreground">{a("disabled.currentText")}</p>
                </TabsContent>
                <TabsContent value="past">
                  <p className="text-sm text-muted-foreground">{a("disabled.pastText")}</p>
                </TabsContent>
              </Tabs>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>{a.rich("a11y.roles", rich)}</li>
          <li>{a.rich("a11y.keyboard", rich)}</li>
          <li>{a.rich("a11y.label", rich)}</li>
          <li>{a.rich("a11y.icons", rich)}</li>
          <li>{a.rich("a11y.direction", rich)}</li>
        </ul>
      </section>

      {/* Props */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("props")}</h2>
        <PropsTable rows={props} />
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// ${a("usage.basic")}
<Tabs defaultValue="account">
  <TabsList aria-label="${a("examples.label")}">
    <TabsTrigger value="account">${a("tabs.account")}</TabsTrigger>
    <TabsTrigger value="password">${a("tabs.password")}</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    ${a("usage.accountContent")}
  </TabsContent>
  <TabsContent value="password">
    ${a("usage.passwordContent")}
  </TabsContent>
</Tabs>

// ${a("usage.variant")}
<TabsList variant="bordered" size="lg">
  ...
</TabsList>

// ${a("usage.icons")}
<TabsTrigger value="account">
  <User aria-hidden="true" />
  ${a("tabs.account")}
</TabsTrigger>

// ${a("usage.controlled")}
const [value, setValue] = useState("password")

<Tabs value={value} onValueChange={setValue}>
  ...
</Tabs>`}</CodeBlock>
        <ComponentPreview>
          <div className="flex flex-col gap-3">
            <Tabs value={value} onValueChange={setValue}>
              <TabsList aria-label={a("examples.label")}>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {a(`tabs.${tab}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="text-sm text-muted-foreground">
              {a("usage.active")}{" "}
              {/* Arabic never goes in a code span: its mono face has no Arabic glyphs. */}
              {isRtl ? (
                <span className="font-medium text-foreground">
                  {a(`tabs.${value as (typeof TABS)[number]}`)}
                </span>
              ) : (
                <code className="text-sm">{value}</code>
              )}
            </p>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
