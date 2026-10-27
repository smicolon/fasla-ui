import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { AuthCenteredCardSignIn, authCenteredCardSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-centered-card-sign-in/AuthCenteredCardSignIn"
import { AuthSocialFirstSignIn, authSocialFirstSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-social-first-sign-in/AuthSocialFirstSignIn"
import { AuthSplitPhotoSignIn, authSplitPhotoSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-split-photo-sign-in/AuthSplitPhotoSignIn"
import { AuthSplitTestimonialSignUp, authSplitTestimonialSignUpCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-split-testimonial-sign-up/AuthSplitTestimonialSignUp"
import { AuthMinimalCenteredSignIn, authMinimalCenteredSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-minimal-centered-sign-in/AuthMinimalCenteredSignIn"
import { AuthSignUpPasswordStrength, authSignUpPasswordStrengthCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-sign-up-password-strength/AuthSignUpPasswordStrength"
import { AuthSignUpBenefitsColumn, authSignUpBenefitsColumnCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-sign-up-benefits-column/AuthSignUpBenefitsColumn"
import { AuthTabbedSignInSignUp, authTabbedSignInSignUpCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-tabbed-sign-in-sign-up/AuthTabbedSignInSignUp"
import { AuthMagicLinkRequest, authMagicLinkRequestCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-magic-link-request/AuthMagicLinkRequest"
import { AuthCheckYourEmail, authCheckYourEmailCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-check-your-email/AuthCheckYourEmail"
import { AuthOtpVerification, authOtpVerificationCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-otp-verification/AuthOtpVerification"
import { AuthTwoFactorAuthenticator, authTwoFactorAuthenticatorCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-two-factor-authenticator/AuthTwoFactorAuthenticator"
import { AuthTwoFactorMethodChooser, authTwoFactorMethodChooserCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-two-factor-method-chooser/AuthTwoFactorMethodChooser"
import { AuthForgotPassword, authForgotPasswordCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-forgot-password/AuthForgotPassword"
import { AuthResetPassword, authResetPasswordCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-reset-password/AuthResetPassword"
import { AuthPasswordChanged, authPasswordChangedCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-password-changed/AuthPasswordChanged"
import { AuthTeamInviteAccept, authTeamInviteAcceptCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-team-invite-accept/AuthTeamInviteAccept"
import { AuthProfileSetupOnboarding, authProfileSetupOnboardingCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-profile-setup-onboarding/AuthProfileSetupOnboarding"
import { AuthPhotoBackgroundSignIn, authPhotoBackgroundSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-photo-background-sign-in/AuthPhotoBackgroundSignIn"
import { AuthPhoneNumberSignIn, authPhoneNumberSignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-phone-number-sign-in/AuthPhoneNumberSignIn"
import { AuthQrDeviceLogin, authQrDeviceLoginCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-qr-device-login/AuthQrDeviceLogin"
import { AuthPasskeySignIn, authPasskeySignInCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-passkey-sign-in/AuthPasskeySignIn"
import { AuthLockedSessionReAuthenticate, authLockedSessionReAuthenticateCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-locked-session-re-authenticate/AuthLockedSessionReAuthenticate"
import { AuthMultiStepSignUpWizard, authMultiStepSignUpWizardCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-multi-step-sign-up-wizard/AuthMultiStepSignUpWizard"
import { AuthSignInErrorState, authSignInErrorStateCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-sign-in-error-state/AuthSignInErrorState"
import { AuthWaitlistEarlyAccess, authWaitlistEarlyAccessCopy } from "../../../../../packages/fasla-ui/registry/blocks/auth-waitlist-early-access/AuthWaitlistEarlyAccess"
import { authExample } from "../../../../docs/components/blocks/authentications-examples"
import { authenticationsArgTypes, authenticationsViewports, localeOf } from "./authentications-story-kit"

/**
 * Authentications: the 26 Types of the Figma set, one block each. Fourteen
 * are ways in, from a sign-in card to a passkey; the other twelve are the
 * steps that follow, from a code to a locked session. Viewport, direction and
 * theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the 26 Figma Types only. The extra
 * states (pending, failure, no photo) are tagged `!dev` and `!autodocs`:
 * hidden from both, but still built, so tests and visual checks reach them by
 * id. The tags are written out on each story, as the indexer reads them
 * statically.
 */
const meta: Meta = {
  title: "Blocks/Authentications",
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: authenticationsViewports },
    // The examples pass logo elements; the source panel shows the story's code instead of a serialised tree.
    docs: { source: { type: "code" } },
  },
  tags: ["autodocs"],
}

export default meta

type StoryContext = { globals: { direction?: string } }
type BlockCopy = Parameters<typeof authExample>[2]

/** The language from the toolbar, plus the example's logo, photos and avatars (shared with the docs site). */
const example = (slug: string, context: StoryContext, copy?: object) => ({
  locale: localeOf(context),
  ...authExample(slug, localeOf(context), copy as BlockCopy),
})

// Stand-ins for the callbacks that would reach an app's server, so each
// action shows its pending state and its result.

/** Settles after a moment, so a button shows its pending state before its result. */
const settleSoon = () => new Promise<void>((resolve) => setTimeout(resolve, 1200))

/** Rejects after a moment: the error state. */
const failSoon = () => new Promise<void>((_, reject) => setTimeout(() => reject(new Error("rejected")), 1200))

/** Never settles: holds the pending state. */
const never = () => new Promise<void>(() => {})


// Ways in

export const CenteredCardSignIn: StoryObj<typeof AuthCenteredCardSignIn> = {
  name: "Centered Card Sign In",
  argTypes: authenticationsArgTypes(AuthCenteredCardSignIn, authCenteredCardSignInCopy),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => (
    <AuthCenteredCardSignIn {...example("auth-centered-card-sign-in", context, authCenteredCardSignInCopy)} {...args} />
  ),
}

/** Send the form: the button shows its spinner, then the error line. */
export const CenteredCardSignInError: StoryObj<typeof AuthCenteredCardSignIn> = {
  name: "Centered Card Sign In: error",
  tags: ["!dev", "!autodocs"],
  args: { onSubmit: failSoon },
  render: (args, context) => (
    <AuthCenteredCardSignIn {...example("auth-centered-card-sign-in", context, authCenteredCardSignInCopy)} {...args} />
  ),
}

/** Press a provider: it shows its spinner and the rest of the column dims. */
export const SocialFirstSignIn: StoryObj<typeof AuthSocialFirstSignIn> = {
  name: "Social-First Sign In",
  argTypes: authenticationsArgTypes(AuthSocialFirstSignIn, authSocialFirstSignInCopy, ["legalLabel"]),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => <AuthSocialFirstSignIn {...example("auth-social-first-sign-in", context, authSocialFirstSignInCopy)} {...args} />,
}
/** A provider that never settles: its spinner holds and the rest of the column dims. */
export const SocialFirstSignInPending: StoryObj<typeof AuthSocialFirstSignIn> = {
  name: "Social-First Sign In (provider pending)",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthSocialFirstSignIn {...example("auth-social-first-sign-in", context, authSocialFirstSignInCopy)} onProviderSelect={never} {...args} />,
}

export const SplitPhotoSignIn: StoryObj<typeof AuthSplitPhotoSignIn> = {
  name: "Split Photo Sign In",
  argTypes: authenticationsArgTypes(AuthSplitPhotoSignIn, authSplitPhotoSignInCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => <AuthSplitPhotoSignIn {...example("auth-split-photo-sign-in", context, authSplitPhotoSignInCopy)} {...args} />,
}

/** No photo: the panel keeps its size as a muted placeholder. */
export const SplitPhotoSignInNoPhoto: StoryObj<typeof AuthSplitPhotoSignIn> = {
  name: "Split Photo Sign In (no photo)",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <AuthSplitPhotoSignIn {...example("auth-split-photo-sign-in", context, authSplitPhotoSignInCopy)} image={undefined} {...args} />
  ),
}

export const SplitTestimonialSignUp: StoryObj<typeof AuthSplitTestimonialSignUp> = {
  name: "Split Testimonial Sign Up",
  argTypes: authenticationsArgTypes(AuthSplitTestimonialSignUp, authSplitTestimonialSignUpCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => <AuthSplitTestimonialSignUp {...example("auth-split-testimonial-sign-up", context, authSplitTestimonialSignUpCopy)} {...args} />,
}

/** The form after a failed attempt: the error line under the button. */
export const SplitTestimonialSignUpError: StoryObj<typeof AuthSplitTestimonialSignUp> = {
  name: "Split Testimonial Sign Up (error)",
  tags: ["!dev", "!autodocs"],
  args: { onSubmit: failSoon },
  render: (args, context) => <AuthSplitTestimonialSignUp {...example("auth-split-testimonial-sign-up", context, authSplitTestimonialSignUpCopy)} {...args} />,
}

export const MinimalCenteredSignIn: StoryObj<typeof AuthMinimalCenteredSignIn> = {
  name: "Minimal Centered Sign In",
  argTypes: authenticationsArgTypes(AuthMinimalCenteredSignIn, authMinimalCenteredSignInCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn() },
  render: (args, context) => <AuthMinimalCenteredSignIn {...example("auth-minimal-centered-sign-in", context, authMinimalCenteredSignInCopy)} {...args} />,
}

/** Type a password: the meter and the checklist follow it. */
export const SignUpPasswordStrength: StoryObj<typeof AuthSignUpPasswordStrength> = {
  name: "Sign Up + Password Strength",
  argTypes: authenticationsArgTypes(AuthSignUpPasswordStrength, authSignUpPasswordStrengthCopy, [
    "rulesError",
    "mismatchError",
    "ruleMetLabel",
    "ruleUnmetLabel",
  ]),
  args: { onSubmit: fn() },
  render: (args, context) => (
    <AuthSignUpPasswordStrength {...example("auth-sign-up-password-strength", context, authSignUpPasswordStrengthCopy)} {...args} />
  ),
}

/** Sending fails: the error line under the button. Type a matching valid password in both fields first. */
export const SignUpPasswordStrengthError: StoryObj<typeof AuthSignUpPasswordStrength> = {
  name: "Sign Up + Password Strength: error",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <AuthSignUpPasswordStrength {...example("auth-sign-up-password-strength", context, authSignUpPasswordStrengthCopy)} {...args} onSubmit={failSoon} />
  ),
}

export const SignUpBenefitsColumn: StoryObj<typeof AuthSignUpBenefitsColumn> = {
  name: "Sign Up + Benefits Column",
  argTypes: authenticationsArgTypes(AuthSignUpBenefitsColumn, authSignUpBenefitsColumnCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => <AuthSignUpBenefitsColumn {...example("auth-sign-up-benefits-column", context, authSignUpBenefitsColumnCopy)} {...args} />,
}

/** Switch tabs: the card eases between the two forms. */
export const TabbedSignInSignUp: StoryObj<typeof AuthTabbedSignInSignUp> = {
  name: "Tabbed Sign In / Sign Up",
  argTypes: authenticationsArgTypes(AuthTabbedSignInSignUp, authTabbedSignInSignUpCopy, [
    "tabsLabel",
    "nameLabel",
    "namePlaceholder",
    "newPasswordPlaceholder",
    "signUpLabel",
  ]),
  args: { onSignIn: fn(), onSignUp: fn(), onProviderSelect: fn(), onTabChange: fn() },
  render: (args, context) => (
    <AuthTabbedSignInSignUp {...example("auth-tabbed-sign-in-sign-up", context, authTabbedSignInSignUpCopy)} {...args} />
  ),
}

/** Opens on the Sign up tab. */
export const TabbedSignInSignUpSignUp: StoryObj<typeof AuthTabbedSignInSignUp> = {
  name: "Tabbed Sign In / Sign Up: sign up",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <AuthTabbedSignInSignUp {...example("auth-tabbed-sign-in-sign-up", context, authTabbedSignInSignUpCopy)} defaultTab="sign-up" {...args} />
  ),
}

/** Send the form: the button shows its spinner, then "Link sent". */
export const MagicLinkRequest: StoryObj<typeof AuthMagicLinkRequest> = {
  name: "Magic Link Request",
  argTypes: authenticationsArgTypes(AuthMagicLinkRequest, authMagicLinkRequestCopy),
  args: { onSubmit: fn(settleSoon), onProviderSelect: fn() },
  render: (args, context) => <AuthMagicLinkRequest {...example("auth-magic-link-request", context, authMagicLinkRequestCopy)} {...args} />,
}
export const MagicLinkRequestError: StoryObj<typeof AuthMagicLinkRequest> = {
  name: "Magic Link Request: send fails", tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthMagicLinkRequest locale={localeOf(context)} {...args} onSubmit={failSoon} />,
}

export const PhotoBackgroundSignIn: StoryObj<typeof AuthPhotoBackgroundSignIn> = {
  name: "Photo Background Sign In",
  argTypes: authenticationsArgTypes(AuthPhotoBackgroundSignIn, authPhotoBackgroundSignInCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn(), onProviderSelect: fn() },
  render: (args, context) => <AuthPhotoBackgroundSignIn {...example("auth-photo-background-sign-in", context, authPhotoBackgroundSignInCopy)} {...args} />,
}
/** No photo: the backdrop is the muted placeholder. */
export const PhotoBackgroundSignInNoPhoto: StoryObj<typeof AuthPhotoBackgroundSignIn> = {
  name: "Photo Background Sign In (no photo)",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <AuthPhotoBackgroundSignIn {...example("auth-photo-background-sign-in", context, authPhotoBackgroundSignInCopy)} image={undefined} {...args} />
  ),
}

/** Type a number: it groups as you type, and Send turns on once it is complete. */
export const PhoneNumberSignIn: StoryObj<typeof AuthPhoneNumberSignIn> = {
  name: "Phone Number Sign In",
  argTypes: authenticationsArgTypes(AuthPhoneNumberSignIn, authPhoneNumberSignInCopy),
  args: { onSubmit: fn(), onAlternativeSelect: fn() },
  render: (args, context) => <AuthPhoneNumberSignIn locale={localeOf(context)} {...args} />,
}

/** Sending holds its pending state: type a full number and press Send. */
export const PhoneNumberSignInPending: StoryObj<typeof AuthPhoneNumberSignIn> = {
  name: "Phone Number Sign In: pending",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthPhoneNumberSignIn locale={localeOf(context)} {...args} onSubmit={never} />,
}

/** The code expires after `expiresIn` seconds; Refresh code runs `onRefresh`. */
export const QrDeviceLogin: StoryObj<typeof AuthQrDeviceLogin> = {
  name: "QR Device Login",
  argTypes: authenticationsArgTypes(AuthQrDeviceLogin, authQrDeviceLoginCopy, ["refreshingLabel", "expired", "approvedLabel"]),
  args: { onRefresh: fn(settleSoon) },
  render: (args, context) => <AuthQrDeviceLogin {...example("auth-qr-device-login", context, authQrDeviceLoginCopy)} {...args} />,
}

export const QrDeviceLoginExpired: StoryObj<typeof AuthQrDeviceLogin> = {
  name: "QR Device Login: expired",
  tags: ["!dev", "!autodocs"],
  args: { onRefresh: fn(settleSoon), expiresIn: 1 },
  render: (args, context) => <AuthQrDeviceLogin {...example("auth-qr-device-login", context, authQrDeviceLoginCopy)} {...args} />,
}

export const QrDeviceLoginApproved: StoryObj<typeof AuthQrDeviceLogin> = {
  name: "QR Device Login: approved",
  tags: ["!dev", "!autodocs"],
  args: { approved: true },
  render: (args, context) => <AuthQrDeviceLogin {...example("auth-qr-device-login", context, authQrDeviceLoginCopy)} {...args} />,
}

/** Press Continue with passkey: the page dims while the passkey sheet would be open, then the badge shows a check. */
export const PasskeySignIn: StoryObj<typeof AuthPasskeySignIn> = {
  name: "Passkey Sign In",
  argTypes: authenticationsArgTypes(AuthPasskeySignIn, authPasskeySignInCopy, ["successLabel"]),
  args: { onPasskey: fn(settleSoon) },
  render: (args, context) => <AuthPasskeySignIn {...example("auth-passkey-sign-in", context, authPasskeySignInCopy)} {...args} />,
}

export const PasskeySignInPending: StoryObj<typeof AuthPasskeySignIn> = {
  name: "Passkey Sign In: waiting for the passkey",
  tags: ["!dev", "!autodocs"],
  argTypes: authenticationsArgTypes(AuthPasskeySignIn, authPasskeySignInCopy, ["successLabel"]),
  args: { onPasskey: never },
  render: (args, context) => <AuthPasskeySignIn locale={localeOf(context)} {...args} />,
}

/** Send the form: it turns into the confirmation and counts up to the place in the queue. */
export const WaitlistEarlyAccess: StoryObj<typeof AuthWaitlistEarlyAccess> = {
  name: "Waitlist Early Access",
  argTypes: authenticationsArgTypes(AuthWaitlistEarlyAccess, authWaitlistEarlyAccessCopy, ["successHeading", "successPositionLabel"]),
  args: { onSubmit: fn(() => new Promise<{ position: number }>((resolve) => setTimeout(() => resolve({ position: 2481 }), 1200))) },
  render: (args, context) => <AuthWaitlistEarlyAccess {...example("auth-waitlist-early-access", context, authWaitlistEarlyAccessCopy)} {...args} />,
}


// Next steps

/** The resend button counts down for real; at zero it can be pressed. */
export const CheckYourEmail: StoryObj<typeof AuthCheckYourEmail> = {
  name: "Check Your Email",
  argTypes: authenticationsArgTypes(AuthCheckYourEmail, authCheckYourEmailCopy),
  args: { resendDelay: 42, onResend: fn(settleSoon) },
  render: (args, context) => <AuthCheckYourEmail {...example("auth-check-your-email", context, authCheckYourEmailCopy)} {...args} />,
}
export const CheckYourEmailReady: StoryObj<typeof AuthCheckYourEmail> = {
  name: "Check Your Email: resend ready", tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthCheckYourEmail locale={localeOf(context)} {...args} resendDelay={0} onResend={settleSoon} />,
}

/** Type six digits and press Verify. A wrong code shakes the slots and clears them. */
export const OtpVerification: StoryObj<typeof AuthOtpVerification> = {
  name: "OTP Verification",
  argTypes: authenticationsArgTypes(AuthOtpVerification, authOtpVerificationCopy, ["codeLabel"]),
  args: { resendDelay: 29, onSubmit: fn(settleSoon), onResend: fn() },
  render: (args, context) => <AuthOtpVerification {...example("auth-otp-verification", context, authOtpVerificationCopy)} {...args} />,
}
export const OtpVerificationWrongCode: StoryObj<typeof AuthOtpVerification> = {
  name: "OTP Verification: wrong code", tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthOtpVerification locale={localeOf(context)} {...args} onSubmit={failSoon} />,
}

/** The sixth digit sends the form on its own. */
export const TwoFactorAuthenticator: StoryObj<typeof AuthTwoFactorAuthenticator> = {
  name: "Two-Factor Authenticator",
  argTypes: authenticationsArgTypes(AuthTwoFactorAuthenticator, authTwoFactorAuthenticatorCopy, ["codeLabel"]),
  args: { onSubmit: fn(settleSoon), onAlternativeSelect: fn() },
  render: (args, context) => <AuthTwoFactorAuthenticator {...example("auth-two-factor-authenticator", context, authTwoFactorAuthenticatorCopy)} {...args} />,
}
export const TwoFactorAuthenticatorWrongCode: StoryObj<typeof AuthTwoFactorAuthenticator> = {
  name: "Two-Factor Authenticator: wrong code", tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthTwoFactorAuthenticator locale={localeOf(context)} {...args} onSubmit={failSoon} />,
}

/** Pick a row: the ring moves to it. Continue sends the method's value. */
export const TwoFactorMethodChooser: StoryObj<typeof AuthTwoFactorMethodChooser> = {
  name: "Two-Factor Method Chooser",
  argTypes: authenticationsArgTypes(AuthTwoFactorMethodChooser, authTwoFactorMethodChooserCopy),
  args: { onSubmit: fn(settleSoon) },
  render: (args, context) => <AuthTwoFactorMethodChooser {...example("auth-two-factor-method-chooser", context, authTwoFactorMethodChooserCopy)} {...args} />,
}
export const TwoFactorMethodChooserNoneSelected: StoryObj<typeof AuthTwoFactorMethodChooser> = {
  name: "Two-Factor Method Chooser: nothing picked", tags: ["!dev", "!autodocs"],
  render: (args, context) => <AuthTwoFactorMethodChooser {...example("auth-two-factor-method-chooser", context, authTwoFactorMethodChooserCopy)} {...args} defaultMethod={null} />,
}

/** Send the form: the button spins, then says the link was sent. */
export const ForgotPassword: StoryObj<typeof AuthForgotPassword> = {
  name: "Forgot Password",
  argTypes: authenticationsArgTypes(AuthForgotPassword, authForgotPasswordCopy, ["sentLabel"]),
  args: { onSubmit: fn(settleSoon) },
  render: (args, context) => <AuthForgotPassword {...example("auth-forgot-password", context, authForgotPasswordCopy)} {...args} />,
}

export const ForgotPasswordError: StoryObj<typeof AuthForgotPassword> = {
  name: "Forgot Password: send fails",
  tags: ["!dev", "!autodocs"],
  argTypes: authenticationsArgTypes(AuthForgotPassword, authForgotPasswordCopy, ["sentLabel"], ["error"]),
  args: { onSubmit: failSoon },
  render: (args, context) => <AuthForgotPassword locale={localeOf(context)} {...args} />,
}

/** Type two different passwords and leave the second field: it says they don't match. */
export const ResetPassword: StoryObj<typeof AuthResetPassword> = {
  name: "Reset Password",
  argTypes: authenticationsArgTypes(AuthResetPassword, authResetPasswordCopy, ["showPassword", "hidePassword", "mismatchError"]),
  args: { onSubmit: fn(settleSoon) },
  render: (args, context) => <AuthResetPassword {...example("auth-reset-password", context, authResetPasswordCopy)} {...args} />,
}

export const ResetPasswordError: StoryObj<typeof AuthResetPassword> = {
  name: "Reset Password: reset fails",
  tags: ["!dev", "!autodocs"],
  argTypes: authenticationsArgTypes(AuthResetPassword, authResetPasswordCopy, ["showPassword", "hidePassword", "mismatchError"], ["error"]),
  args: { onSubmit: failSoon },
  render: (args, context) => <AuthResetPassword locale={localeOf(context)} {...args} />,
}

export const PasswordChanged: StoryObj<typeof AuthPasswordChanged> = {
  name: "Password Changed",
  argTypes: authenticationsArgTypes(AuthPasswordChanged, authPasswordChangedCopy),
  render: (args, context) => <AuthPasswordChanged {...example("auth-password-changed", context, authPasswordChangedCopy)} {...args} />,
}

/** Accept shows its spinner while `onAccept` runs; Decline asks once before `onDecline`. */
export const TeamInviteAccept: StoryObj<typeof AuthTeamInviteAccept> = {
  name: "Team Invite Accept",
  argTypes: authenticationsArgTypes(AuthTeamInviteAccept, authTeamInviteAcceptCopy, ["decliningLabel", "declineQuestion", "keepLabel", "confirmDeclineLabel"]),
  args: { onAccept: fn(settleSoon), onDecline: fn(settleSoon) },
  render: (args, context) => <AuthTeamInviteAccept {...example("auth-team-invite-accept", context, authTeamInviteAcceptCopy)} {...args} />,
}

/** Upload picks a photo and shows it; Continue sends the form to `onSubmit`. */
export const ProfileSetupOnboarding: StoryObj<typeof AuthProfileSetupOnboarding> = {
  name: "Profile Setup Onboarding",
  argTypes: authenticationsArgTypes(AuthProfileSetupOnboarding, authProfileSetupOnboardingCopy),
  args: { onSubmit: fn(settleSoon), onSkip: fn(), onBack: fn(), onPhotoChange: fn() },
  render: (args, context) => <AuthProfileSetupOnboarding {...example("auth-profile-setup-onboarding", context, authProfileSetupOnboardingCopy)} {...args} />,
}

export const LockedSessionReAuthenticate: StoryObj<typeof AuthLockedSessionReAuthenticate> = {
  name: "Locked Session Re-authenticate",
  argTypes: authenticationsArgTypes(AuthLockedSessionReAuthenticate, authLockedSessionReAuthenticateCopy, ["showPassword", "hidePassword"]),
  args: { onSubmit: fn(settleSoon) },
  render: (args, context) => (
    <AuthLockedSessionReAuthenticate {...example("auth-locked-session-re-authenticate", context, authLockedSessionReAuthenticateCopy)} {...args} />
  ),
}

/** Unlock with any password: it is wrong, so the field shakes once and says so. */
export const LockedSessionWrongPassword: StoryObj<typeof AuthLockedSessionReAuthenticate> = {
  name: "Locked Session Re-authenticate: wrong password",
  tags: ["!dev", "!autodocs"],
  argTypes: authenticationsArgTypes(AuthLockedSessionReAuthenticate, authLockedSessionReAuthenticateCopy, ["showPassword", "hidePassword"], ["error"]),
  args: { onSubmit: failSoon },
  render: (args, context) => (
    <AuthLockedSessionReAuthenticate {...example("auth-locked-session-re-authenticate", context, authLockedSessionReAuthenticateCopy)} {...args} />
  ),
}

/** Add a teammate, or copy the invite link. */
export const MultiStepSignUpWizard: StoryObj<typeof AuthMultiStepSignUpWizard> = {
  name: "Multi-Step Sign Up Wizard",
  argTypes: authenticationsArgTypes(AuthMultiStepSignUpWizard, authMultiStepSignUpWizardCopy, ["stepsLabel", "inviteUrl"]),
  args: { onSubmit: fn(), onSkip: fn(), onBack: fn(), onCopyLink: fn() },
  render: (args, context) => (
    <AuthMultiStepSignUpWizard {...example("auth-multi-step-sign-up-wizard", context, authMultiStepSignUpWizardCopy)} {...args} />
  ),
}

/** Sending fails: the error line under the actions. */
export const MultiStepSignUpWizardError: StoryObj<typeof AuthMultiStepSignUpWizard> = {
  name: "Multi-Step Sign Up Wizard: error",
  tags: ["!dev", "!autodocs"],
  render: (args, context) => (
    <AuthMultiStepSignUpWizard {...example("auth-multi-step-sign-up-wizard", context, authMultiStepSignUpWizardCopy)} {...args} onSubmit={failSoon} />
  ),
}

/** Press Try again: the attempt fails again, the alert opens, the field shakes and empties. */
export const SignInErrorState: StoryObj<typeof AuthSignInErrorState> = {
  name: "Sign In Error State",
  argTypes: authenticationsArgTypes(AuthSignInErrorState, authSignInErrorStateCopy, ["showPassword", "hidePassword"]),
  args: { onProviderSelect: fn() },
  render: (args, context) => (
    <AuthSignInErrorState {...example("auth-sign-in-error-state", context, authSignInErrorStateCopy)} onSubmit={failSoon} {...args} />
  ),
}
