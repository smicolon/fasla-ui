import type { Meta, StoryObj } from "@storybook/react"
import { FormSection, FormField, FormActions } from "../../../../packages/fasla-ui/registry/blocks/form-section/FormSection"
import { Input } from "../../../../packages/fasla-ui/registry/ui/input/input"
import { Button } from "../../../../packages/fasla-ui/registry/ui/button"
import { Checkbox } from "../../../../packages/fasla-ui/registry/ui/checkbox"

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

/**
 * Sample copy, per script: account settings for the same person as the docs
 * page. Only the rendered text changes; the Arabic follows design/content/.
 * Buttons and checkboxes are the library's own, never hand-styled controls.
 */
const COPY = {
  ltr: {
    personal: { title: "Personal Information", description: "Update your personal details here." },
    first: "First Name",
    firstPlaceholder: "Layla",
    last: "Last Name",
    lastPlaceholder: "Haddad",
    email: "Email",
    emailHelp: "We’ll never share your email.",
    account: { title: "Account Settings", description: "Configure your account preferences." },
    username: "Username",
    usernameTaken: "Username is already taken",
    displayName: "Display Name",
    displayNamePlaceholder: "How you appear to others",
    notifications: { title: "Notification Preferences", description: "Choose how you want to be notified." },
    channels: ["Email notifications", "Push notifications", "SMS notifications"],
    password: { title: "Password", description: "Update your password to keep your account secure." },
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    danger: { title: "Danger Zone", description: "Irreversible actions for your account." },
    dangerBody: "Once you delete your account, there is no going back.",
    deleteAccount: "Delete Account",
    cancel: "Cancel",
    save: "Save",
    saveChanges: "Save Changes",
  },
  rtl: {
    personal: { title: "المعلومات الشخصية", description: "حدّث بياناتك الشخصية من هنا." },
    first: "الاسم الأول",
    firstPlaceholder: "ليلى",
    last: "اسم العائلة",
    lastPlaceholder: "حداد",
    email: "البريد الإلكتروني",
    emailHelp: "نحتفظ ببريدك الإلكتروني لنا وحدنا.",
    account: { title: "إعدادات الحساب", description: "اضبط تفضيلات حسابك." },
    username: "اسم المستخدم",
    usernameTaken: "اسم المستخدم مستخدم من قبل",
    displayName: "الاسم الظاهر",
    displayNamePlaceholder: "الاسم الذي يراه الآخرون",
    notifications: { title: "تفضيلات الإشعارات", description: "اختر كيف تصلك الإشعارات." },
    channels: ["إشعارات البريد الإلكتروني", "الإشعارات الفورية", "الرسائل النصية"],
    password: { title: "كلمة المرور", description: "حدّث كلمة المرور ليبقى حسابك آمنًا." },
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    danger: { title: "منطقة الخطر", description: "إجراءات نهائية على حسابك." },
    dangerBody: "بعد حذف حسابك، يتعذّر استرجاعه.",
    deleteAccount: "حذف الحساب",
    cancel: "إلغاء",
    save: "حفظ",
    saveChanges: "حفظ التغييرات",
  },
}

type StoryCtx = { globals: { direction?: string } }
type Copy = (typeof COPY)["ltr"]
const copy = (ctx: StoryCtx): Copy => (ctx.globals.direction === "rtl" ? COPY.rtl : COPY.ltr)

const PersonalFields = ({ c }: { c: Copy }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <FormField label={c.first} htmlFor="firstName" required>
      <Input id="firstName" placeholder={c.firstPlaceholder} />
    </FormField>
    <FormField label={c.last} htmlFor="lastName" required>
      <Input id="lastName" placeholder={c.lastPlaceholder} />
    </FormField>
    <FormField label={c.email} htmlFor="email" description={c.emailHelp} className="sm:col-span-2">
      <Input id="email" type="email" placeholder="layla@example.com" />
    </FormField>
  </div>
)

export const Default: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <FormSection {...args} title={c.personal.title} description={c.personal.description}>
        <PersonalFields c={c} />
      </FormSection>
    )
  },
}

export const WithError: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <FormSection {...args} title={c.account.title} description={c.account.description}>
        <div className="grid gap-4">
          <FormField label={c.username} htmlFor="username" required error={c.usernameTaken}>
            <Input id="username" variant="error" defaultValue="layla" />
          </FormField>
          <FormField label={c.displayName} htmlFor="displayName">
            <Input id="displayName" placeholder={c.displayNamePlaceholder} />
          </FormField>
        </div>
      </FormSection>
    )
  },
}

export const NoDivider: Story = {
  render: (args, ctx) => {
    const c = copy(ctx)
    return (
      <FormSection {...args} title={c.notifications.title} description={c.notifications.description} divider={false}>
        <div className="space-y-4">
          {c.channels.map((channel) => (
            <Checkbox key={channel} label={channel} />
          ))}
        </div>
      </FormSection>
    )
  },
}

export const CompleteForm: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <form className="mx-auto max-w-2xl space-y-6">
        <FormSection title={c.personal.title} description={c.personal.description}>
          <PersonalFields c={c} />
        </FormSection>

        <FormSection title={c.password.title} description={c.password.description}>
          <div className="grid gap-4">
            <FormField label={c.currentPassword} htmlFor="currentPassword" required>
              <Input id="currentPassword" type="password" />
            </FormField>
            <FormField label={c.newPassword} htmlFor="newPassword" required>
              <Input id="newPassword" type="password" />
            </FormField>
            <FormField label={c.confirmPassword} htmlFor="confirmPassword" required>
              <Input id="confirmPassword" type="password" />
            </FormField>
          </div>
        </FormSection>

        <FormSection title={c.danger.title} description={c.danger.description} divider={false}>
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{c.dangerBody}</p>
            <Button variant="destructive" size="sm" className="mt-3">
              {c.deleteAccount}
            </Button>
          </div>
        </FormSection>

        <FormActions>
          <Button variant="outline">{c.cancel}</Button>
          <Button>{c.saveChanges}</Button>
        </FormActions>
      </form>
    )
  },
}

/** `left` and `right` are the start and end of the reading direction. */
export const FormActionsAlignments: Story = {
  render: (_args, ctx) => {
    const c = copy(ctx)
    return (
      <div className="space-y-8">
        {(["right", "left", "center", "between"] as const).map((align) => (
          <div key={align}>
            <p className="mb-2 text-sm text-muted-foreground">
              <code>align=&quot;{align}&quot;</code>
            </p>
            <FormActions align={align}>
              <Button variant="outline">{c.cancel}</Button>
              <Button>{c.save}</Button>
            </FormActions>
          </div>
        ))}
      </div>
    )
  },
}
