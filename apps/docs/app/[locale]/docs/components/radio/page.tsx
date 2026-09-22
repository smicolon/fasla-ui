"use client"

import { useTranslations } from "next-intl"

import { useState } from "react"
import { Radio } from "@fasla-ui/ui/radio"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"

export default function RadioPage() {
  const t = useTranslations("docs.sections")
  const [plan, setPlan] = useState("standard")

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Radio</h1>
        {/*
         * `dir="ltr"` on every English run. This page's prose is untranslated
         * (the site localises section headings only), and in the Arabic locale a
         * sentence's trailing full stop is bidi-neutral — without this it is
         * reordered to the head of the line.
         */}
        <p dir="ltr" className="text-xl text-muted-foreground">
          A control for choosing exactly one option from a set.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("installation")}</h2>
        <CodeBlock>npx @smicolon/fasla-ui add radio</CodeBlock>
      </section>

      {/* Preview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("preview")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Radio name="preview" value="a" label="Standard delivery" defaultChecked />
            <Radio name="preview" value="b" label="Express delivery" />
            <Radio name="preview" value="c" label="Same-day courier" disabled />
          </div>
        </ComponentPreview>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("variants")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          The <code className="text-sm">layout</code> variant wraps the control and its
          text in a bordered card, so the whole card becomes the target. Use it when the
          options carry a description; use the default when they are single words in a
          tight list.
        </p>
        <ComponentPreview>
          <div className="grid w-full gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Radio name="v-default" value="a" label="Default" defaultChecked />
              <Radio name="v-default" value="b" label="Default" />
            </div>
            <div className="flex flex-col gap-2">
              <Radio
                name="v-layout"
                value="a"
                variant="layout"
                label="Layout"
                description="The card is the target"
                className="w-full"
                defaultChecked
              />
              <Radio
                name="v-layout"
                value="b"
                variant="layout"
                label="Layout"
                description="Hover fills the card"
                className="w-full"
              />
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("sizes")}</h2>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Radio name="sizes" value="sm" size="sm" label="Small" />
            <Radio name="sizes" value="md" size="md" label="Medium" defaultChecked />
            <Radio name="sizes" value="lg" size="lg" label="Large" />
          </div>
        </ComponentPreview>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("states")}</h2>
        <p dir="ltr" className="text-muted-foreground">
          Hover and focus are real CSS states rather than props — hover an option, or tab
          to it, to see them. Selection is carried by the dot alone; the card chrome does
          not change.
        </p>
        <ComponentPreview>
          <div className="flex flex-col gap-4">
            <Radio name="states-a" label="Unselected" />
            <Radio name="states-b" label="Selected" defaultChecked />
            <Radio name="states-c" label="Disabled" disabled />
            <Radio name="states-d" label="Disabled, selected" disabled defaultChecked />
          </div>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("accessibility")}</h2>
        <ul dir="ltr" className="list-disc space-y-2 ps-6 text-muted-foreground">
          <li>
            Renders a native <code className="text-sm">&lt;input type=&quot;radio&quot;&gt;</code>,
            so arrow-key navigation and form submission work without extra code.
          </li>
          <li>
            Options sharing a <code className="text-sm">name</code> form one group, and
            only one can be selected.
          </li>
          <li>
            <code className="text-sm">description</code> is linked with{" "}
            <code className="text-sm">aria-describedby</code>; the control graphic is
            hidden from assistive technology.
          </li>
          <li>
            Without a <code className="text-sm">label</code> or{" "}
            <code className="text-sm">description</code>, pass an{" "}
            <code className="text-sm">aria-label</code>.
          </li>
          <li>
            Direction is inherited from <code className="text-sm">dir</code>, never a
            prop, so the control can never disagree with the page.
          </li>
        </ul>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">{t("usage")}</h2>
        <CodeBlock>{`import { Radio } from "@/components/ui/radio"

// A group — options share a name
<Radio name="plan" value="standard" label="Standard" />
<Radio name="plan" value="express" label="Express" />

// With a description
<Radio
  name="plan"
  value="courier"
  label="Same-day courier"
  description="Arrives before 6pm"
/>

// Bordered card layout
<Radio variant="layout" name="plan" value="express" label="Express" />

// Controlled
<Radio
  name="plan"
  value="express"
  label="Express"
  checked={plan === "express"}
  onChange={(e) => setPlan(e.target.value)}
/>`}</CodeBlock>
        <ComponentPreview>
          <div className="flex w-full max-w-sm flex-col gap-2">
            {[
              { value: "standard", label: "Standard", description: "3–5 business days" },
              { value: "express", label: "Express", description: "Arrives tomorrow" },
            ].map((option) => (
              <Radio
                key={option.value}
                name="controlled"
                value={option.value}
                variant="layout"
                label={option.label}
                description={option.description}
                className="w-full"
                checked={plan === option.value}
                onChange={(e) => setPlan(e.target.value)}
              />
            ))}
            <p dir="ltr" className="text-sm text-muted-foreground">
              Selected: <code className="text-sm">{plan}</code>
            </p>
          </div>
        </ComponentPreview>
      </section>
    </div>
  )
}
