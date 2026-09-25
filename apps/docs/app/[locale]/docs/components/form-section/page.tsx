"use client"

import { useTranslations } from "next-intl"

import { FormSection, FormField, FormActions } from "@fasla-ui/blocks/form-section/FormSection"
import { Input } from "@fasla-ui/ui/input"
import { ComponentPreview, CodeBlock } from "@/components/component-preview"
import { InstallCommand } from "@/components/install-command"

export default function FormSectionPage() {
  const t = useTranslations("docs.sections")
  return (
    <div>
      <div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">FormSection</h1>
          <p className="text-lg text-muted-foreground">
            Form sections for grouping related fields with labels and descriptions.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold">{t("installation")}</h2>
            <div className="mt-4">
              <InstallCommand name="form-section" />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("preview")}</h2>
            <div className="mt-4">
              <ComponentPreview>
                <FormSection
                  title="Personal Information"
                  description="Update your personal details."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="First Name" required>
                      <Input placeholder="John" />
                    </FormField>
                    <FormField label="Last Name" required>
                      <Input placeholder="Doe" />
                    </FormField>
                  </div>
                </FormSection>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">With Error</h2>
            <div className="mt-4">
              <ComponentPreview>
                <FormField
                  label="Email"
                  error="This email is already taken"
                  required
                >
                  <Input variant="error" defaultValue="taken@example.com" />
                </FormField>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">Form Actions</h2>
            <div className="mt-4">
              <ComponentPreview>
                <FormActions>
                  <button className="rounded-md border px-4 py-2 text-sm">
                    Cancel
                  </button>
                  <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                    Save
                  </button>
                </FormActions>
              </ComponentPreview>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold">{t("usage")}</h2>
            <div className="mt-4">
              <CodeBlock>{`import { FormSection, FormField, FormActions } from "@/components/blocks/form-section"

<FormSection title="Account" description="Update your account settings.">
  <FormField label="Email" required>
    <Input type="email" />
  </FormField>
</FormSection>

<FormActions>
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
</FormActions>`}</CodeBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
