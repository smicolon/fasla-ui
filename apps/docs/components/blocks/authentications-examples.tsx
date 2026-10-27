import { QrCode } from "lucide-react"
import { FaslaLogo } from "../../../../packages/fasla-ui/registry/ui/fasla-logo/fasla-logo"

/**
 * What the Authentications examples pass besides `locale`: the Fasla Logo in
 * the slot Figma shows it in, and the photos and avatars no block ships with,
 * hosted with the docs site in public/blocks/authentications/. The docs
 * previews and the Storybook stories both read them from here, so the two show
 * the same example.
 *
 * A block's people live in its copy, so the avatars are added to the copy the
 * caller passes in: the block's own `…Copy`, which the caller has loaded
 * already. Imported by relative path, as Storybook has no `@/` alias.
 */

type Locale = "en" | "ar"
type Copy = Record<Locale, Record<string, unknown>>
type Person = { name: string; avatar?: string }

const DIR = "/blocks/authentications"

// Built once, not per render: Storybook's source panel and React both expect
// the same element each time.
const ICON = <FaslaLogo variant="icon" />
const LOCKUP = <FaslaLogo />
const LOCKUP_ON_DARK = <FaslaLogo className="text-foreground-inverse" />
// Figma draws the lucide `qr-code` glyph scaled up, so its stroke scales too.
const QR = <QrCode size={120} strokeWidth={1.5} aria-hidden="true" className="size-[120px] text-foreground" />

const MEMBERS = [1, 2, 3, 4].map((n) => `${DIR}/avatar-member-${n}.webp`)

/** The copy's `key` list of people, each with the photo at the same place in `photos`. */
const withPhotos = (copy: Copy | undefined, locale: Locale, key: string, photos: string[]) =>
  ((copy?.[locale]?.[key] as Person[] | undefined) ?? []).map((person, index) => ({ ...person, avatar: photos[index] }))

const withPhoto = (copy: Copy | undefined, locale: Locale, key: string, avatar: string) => {
  const item = copy?.[locale]?.[key] as object | null | undefined
  return item ? { ...item, avatar } : item
}

const EXAMPLES: Record<string, (locale: Locale, copy?: Copy) => Record<string, unknown>> = {
  "auth-centered-card-sign-in": () => ({ logo: ICON }),
  "auth-social-first-sign-in": () => ({ logo: LOCKUP }),
  "auth-split-photo-sign-in": (locale, copy) => ({
    logo: LOCKUP,
    image: {
      src: `${DIR}/split-photo.webp`,
      alt: locale === "ar" ? "مكتب هادئ قرب نافذة مضيئة" : "A calm desk by a bright window",
    },
    quote: withPhoto(copy, locale, "quote", `${DIR}/avatar-nadia.webp`),
  }),
  "auth-split-testimonial-sign-up": (locale, copy) => ({
    logo: LOCKUP_ON_DARK,
    quote: withPhoto(copy, locale, "quote", `${DIR}/avatar-omar.webp`),
  }),
  "auth-minimal-centered-sign-in": () => ({ logo: ICON }),
  "auth-sign-up-password-strength": () => ({ logo: ICON }),
  "auth-sign-up-benefits-column": (locale, copy) => ({ logo: LOCKUP, members: withPhotos(copy, locale, "members", MEMBERS) }),
  "auth-tabbed-sign-in-sign-up": () => ({ logo: ICON }),
  "auth-magic-link-request": () => ({}),
  "auth-check-your-email": () => ({}),
  "auth-otp-verification": () => ({}),
  "auth-two-factor-authenticator": () => ({}),
  "auth-two-factor-method-chooser": () => ({ logo: ICON }),
  "auth-forgot-password": () => ({}),
  "auth-reset-password": () => ({}),
  "auth-password-changed": () => ({}),
  "auth-team-invite-accept": (locale, copy) => ({
    image: { src: `${DIR}/team-invite-banner.webp`, alt: "" },
    members: withPhotos(copy, locale, "members", [`${DIR}/avatar-nadia.webp`, MEMBERS[0]!, MEMBERS[1]!]),
  }),
  "auth-profile-setup-onboarding": () => ({ logo: LOCKUP, avatar: `${DIR}/avatar-alex.webp` }),
  "auth-photo-background-sign-in": () => ({ logo: ICON, image: { src: `${DIR}/photo-background.webp`, alt: "" } }),
  "auth-phone-number-sign-in": () => ({}),
  "auth-qr-device-login": () => ({ logo: LOCKUP, qr: QR }),
  "auth-passkey-sign-in": () => ({}),
  "auth-locked-session-re-authenticate": (locale) => ({
    account: {
      name: locale === "ar" ? "أليكس" : "Alex",
      email: "alex@northwind.co",
      avatar: `${DIR}/avatar-alex.webp`,
    },
  }),
  "auth-multi-step-sign-up-wizard": () => ({ logo: LOCKUP }),
  "auth-sign-in-error-state": () => ({ logo: ICON }),
  "auth-waitlist-early-access": (locale, copy) => ({
    logo: LOCKUP,
    image: { src: `${DIR}/waitlist-art.webp`, alt: "" },
    members: withPhotos(copy, locale, "members", MEMBERS),
  }),
}

/** The example props for one block, in one language. Pass the block's own copy when it lists people. */
export function authExample(slug: string, locale: Locale, copy?: Copy): Record<string, unknown> {
  return EXAMPLES[slug]?.(locale, copy) ?? {}
}
