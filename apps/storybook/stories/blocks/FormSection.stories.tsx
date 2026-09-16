import type { Meta, StoryObj } from "@storybook/react"
import { FormSection, FormField, FormActions } from "../../../../packages/fasla-ui/registry/blocks/form-section/FormSection"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input/input"

const meta: Meta<typeof FormSection> = {
  title: "Blocks/FormSection",
  component: FormSection,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof FormSection>

const Button = ({ variant = "default", children }: { variant?: "default" | "outline"; children: React.ReactNode }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      variant === "outline"
        ? "border border-input bg-background hover:bg-accent"
        : "bg-primary text-primary-foreground hover:bg-primary/90"
    }`}
  >
    {children}
  </button>
)

export const Default: Story = {
  args: {
    title: "Personal Information",
    description: "Update your personal details here.",
    children: (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First Name" htmlFor="firstName" required>
          <Input id="firstName" placeholder="John" />
        </FormField>
        <FormField label="Last Name" htmlFor="lastName" required>
          <Input id="lastName" placeholder="Doe" />
        </FormField>
        <FormField
          label="Email"
          htmlFor="email"
          description="We'll never share your email."
          className="sm:col-span-2"
        >
          <Input id="email" type="email" placeholder="john@example.com" />
        </FormField>
      </div>
    ),
  },
}

export const WithError: Story = {
  args: {
    title: "Account Settings",
    description: "Configure your account preferences.",
    children: (
      <div className="grid gap-4">
        <FormField
          label="Username"
          htmlFor="username"
          required
          error="Username is already taken"
        >
          <Input id="username" variant="error" defaultValue="johndoe" />
        </FormField>
        <FormField label="Display Name" htmlFor="displayName">
          <Input id="displayName" placeholder="How you appear to others" />
        </FormField>
      </div>
    ),
  },
}

export const NoDivider: Story = {
  args: {
    title: "Notification Preferences",
    description: "Choose how you want to be notified.",
    divider: false,
    children: (
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-input" />
          <span className="text-sm">Email notifications</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-input" />
          <span className="text-sm">Push notifications</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="h-4 w-4 rounded border-input" />
          <span className="text-sm">SMS notifications</span>
        </label>
      </div>
    ),
  },
}

export const CompleteForm: Story = {
  render: () => (
    <form className="mx-auto max-w-2xl space-y-6">
      <FormSection
        title="Personal Information"
        description="Update your personal details here."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="First Name" htmlFor="firstName" required>
            <Input id="firstName" placeholder="John" />
          </FormField>
          <FormField label="Last Name" htmlFor="lastName" required>
            <Input id="lastName" placeholder="Doe" />
          </FormField>
          <FormField
            label="Email"
            htmlFor="email"
            description="We'll never share your email."
            className="sm:col-span-2"
          >
            <Input id="email" type="email" placeholder="john@example.com" />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Password"
        description="Update your password to keep your account secure."
      >
        <div className="grid gap-4">
          <FormField label="Current Password" htmlFor="currentPassword" required>
            <Input id="currentPassword" type="password" />
          </FormField>
          <FormField label="New Password" htmlFor="newPassword" required>
            <Input id="newPassword" type="password" />
          </FormField>
          <FormField
            label="Confirm Password"
            htmlFor="confirmPassword"
            required
          >
            <Input id="confirmPassword" type="password" />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Danger Zone"
        description="Irreversible actions for your account."
        divider={false}
      >
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Once you delete your account, there is no going back.
          </p>
          <button className="mt-3 rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
            Delete Account
          </button>
        </div>
      </FormSection>

      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </FormActions>
    </form>
  ),
}

export const FormActionsAlignments: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">align="right" (default)</p>
        <FormActions align="right">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">align="left"</p>
        <FormActions align="left">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">align="center"</p>
        <FormActions align="center">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">align="between"</p>
        <FormActions align="between">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </FormActions>
      </div>
    </div>
  ),
}
