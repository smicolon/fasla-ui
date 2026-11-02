import type { Meta, StoryObj } from "@storybook/react"
import { ContactUsClassicCentered, contactUsClassicCenteredCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-classic-centered/ContactUsClassicCentered"
import { ContactUsDarkStatement, contactUsDarkStatementCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-dark-statement/ContactUsDarkStatement"
import { ContactUsOversizedWordmark, contactUsOversizedWordmarkCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-oversized-wordmark/ContactUsOversizedWordmark"
import { ContactUsEditorialStatement, contactUsEditorialStatementCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-editorial-statement/ContactUsEditorialStatement"
import { ContactUsRuledSplitForm, contactUsRuledSplitFormCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-ruled-split-form/ContactUsRuledSplitForm"
import { ContactUsGrandHeadlineForm, contactUsGrandHeadlineFormCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-grand-headline-form/ContactUsGrandHeadlineForm"
import { ContactUsPitchAndInquiry, contactUsPitchAndInquiryCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-pitch-and-inquiry/ContactUsPitchAndInquiry"
import { ContactUsFormContactMethods, contactUsFormContactMethodsCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-form-contact-methods/ContactUsFormContactMethods"
import { ContactUsSplitPhotoDark, contactUsSplitPhotoDarkCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-split-photo-dark/ContactUsSplitPhotoDark"
import { ContactUsPhotoAndDarkPanel, contactUsPhotoAndDarkPanelCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-photo-and-dark-panel/ContactUsPhotoAndDarkPanel"
import { ContactUsEditorialAndAddressCard, contactUsEditorialAndAddressCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-editorial-and-address-card/ContactUsEditorialAndAddressCard"
import { ContactUsMapSplit, contactUsMapSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-map-split/ContactUsMapSplit"
import { ContactUsOfficeCards, contactUsOfficeCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-office-cards/ContactUsOfficeCards"
import { ContactUsHqFeature, contactUsHqFeatureCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-hq-feature/ContactUsHqFeature"
import { ContactUsGlobalOfficesTable, contactUsGlobalOfficesTableCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-global-offices-table/ContactUsGlobalOfficesTable"
import { ContactUsHoursAndAvailability, contactUsHoursAndAvailabilityCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-hours-and-availability/ContactUsHoursAndAvailability"
import { ContactUsNamedOwners, contactUsNamedOwnersCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-named-owners/ContactUsNamedOwners"
import { ContactUsBookACall, contactUsBookACallCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-book-a-call/ContactUsBookACall"
import { ContactUsFormWithFaq, contactUsFormWithFaqCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-form-with-faq/ContactUsFormWithFaq"
import { ContactUsBentoGrid, contactUsBentoGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-bento-grid/ContactUsBentoGrid"
import { ContactUsSocialRail, contactUsSocialRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-social-rail/ContactUsSocialRail"
import { ContactUsNewsletterCombo, contactUsNewsletterComboCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-newsletter-combo/ContactUsNewsletterCombo"
import { ContactUsSupportChannels, contactUsSupportChannelsCopy } from "../../../../../packages/fasla-ui/registry/blocks/contact-us-support-channels/ContactUsSupportChannels"
import { contactUsArgTypes, contactUsViewports, fail, localeOf, photoPropsOf, settle, CONTACT_US_NOW, CONTACT_US_TABLE_NOW } from "./contact-us-story-kit"

/**
 * Contact Us: the Types of the Figma set, one block each. The forms come
 * first, the ones that carry the page with type alone: a centred card, a
 * statement beside a form, an oversized wordmark, an editorial statement, two
 * columns on a rule, a grand headline over a bordered form, and a pitch beside
 * an inquiry. Then the forms with photos: a form card with three contact
 * methods, a split with a full-height photo, a photo beside a panel in a
 * chart-4 frame, and a form card beside a photo and an address card. The
 * photos are the docs site's demo photos (public/images/contact-us/); a block
 * takes its own as a `photo`. Every form checks its fields, then sends: the stories settle
 * after a moment, so the button's pending state and the thank-you panel show.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. A Type's extra
 * states (the send that fails, the form turned off) are tagged `!dev` and
 * `!autodocs`: hidden from both, but still built, so tests and visual checks
 * reach them by id. The tags are written out on each story, as the indexer
 * reads them statically.
 */
const meta: Meta = {
  title: "Blocks/Contact Us",
  parameters: { layout: "fullscreen", viewport: { viewports: contactUsViewports } },
  tags: ["autodocs"],
}

export default meta

export const ClassicCentered: StoryObj<typeof ContactUsClassicCentered> = {
  name: "Classic Centered",
  argTypes: contactUsArgTypes(ContactUsClassicCentered, contactUsClassicCenteredCopy),
  render: (args, context) => <ContactUsClassicCentered locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const ClassicCenteredSendFails: StoryObj<typeof ContactUsClassicCentered> = {
  name: "Classic Centered: Send fails",
  tags: ["!dev", "!autodocs"],
  argTypes: contactUsArgTypes(ContactUsClassicCentered, contactUsClassicCenteredCopy, [], ["error"]),
  render: (args, context) => <ContactUsClassicCentered locale={localeOf(context)} {...args} onSubmit={() => fail()} />,
}

export const ClassicCenteredDisabled: StoryObj<typeof ContactUsClassicCentered> = {
  name: "Classic Centered: Disabled",
  tags: ["!dev", "!autodocs"],
  argTypes: contactUsArgTypes(ContactUsClassicCentered, contactUsClassicCenteredCopy),
  render: (args, context) => <ContactUsClassicCentered locale={localeOf(context)} {...args} disabled />,
}

export const DarkStatement: StoryObj<typeof ContactUsDarkStatement> = {
  name: "Dark Statement",
  argTypes: contactUsArgTypes(ContactUsDarkStatement, contactUsDarkStatementCopy),
  render: (args, context) => <ContactUsDarkStatement locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const OversizedWordmark: StoryObj<typeof ContactUsOversizedWordmark> = {
  name: "Oversized Wordmark",
  argTypes: contactUsArgTypes(ContactUsOversizedWordmark, contactUsOversizedWordmarkCopy),
  render: (args, context) => <ContactUsOversizedWordmark locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const EditorialStatement: StoryObj<typeof ContactUsEditorialStatement> = {
  name: "Editorial Statement",
  argTypes: contactUsArgTypes(ContactUsEditorialStatement, contactUsEditorialStatementCopy),
  render: (args, context) => <ContactUsEditorialStatement locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const RuledSplitForm: StoryObj<typeof ContactUsRuledSplitForm> = {
  name: "Ruled Split Form",
  argTypes: contactUsArgTypes(ContactUsRuledSplitForm, contactUsRuledSplitFormCopy, ["messageLimit"]),
  render: (args, context) => <ContactUsRuledSplitForm locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const GrandHeadlineForm: StoryObj<typeof ContactUsGrandHeadlineForm> = {
  name: "Grand Headline Form",
  argTypes: contactUsArgTypes(ContactUsGrandHeadlineForm, contactUsGrandHeadlineFormCopy),
  render: (args, context) => <ContactUsGrandHeadlineForm locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const PitchAndInquiry: StoryObj<typeof ContactUsPitchAndInquiry> = {
  name: "Pitch & Inquiry",
  argTypes: contactUsArgTypes(ContactUsPitchAndInquiry, contactUsPitchAndInquiryCopy),
  render: (args, context) => <ContactUsPitchAndInquiry locale={localeOf(context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const FormContactMethods: StoryObj<typeof ContactUsFormContactMethods> = {
  name: "Form + Contact Methods",
  argTypes: contactUsArgTypes(ContactUsFormContactMethods, contactUsFormContactMethodsCopy),
  render: (args, context) => <ContactUsFormContactMethods locale={localeOf(context)} {...photoPropsOf("form-contact-methods", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const SplitPhotoDark: StoryObj<typeof ContactUsSplitPhotoDark> = {
  name: "Split Photo Dark",
  argTypes: contactUsArgTypes(ContactUsSplitPhotoDark, contactUsSplitPhotoDarkCopy),
  render: (args, context) => <ContactUsSplitPhotoDark locale={localeOf(context)} {...photoPropsOf("split-photo-dark", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const PhotoAndDarkPanel: StoryObj<typeof ContactUsPhotoAndDarkPanel> = {
  name: "Photo & Dark Panel",
  argTypes: contactUsArgTypes(ContactUsPhotoAndDarkPanel, contactUsPhotoAndDarkPanelCopy),
  render: (args, context) => <ContactUsPhotoAndDarkPanel locale={localeOf(context)} {...photoPropsOf("photo-and-dark-panel", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const EditorialAndAddressCard: StoryObj<typeof ContactUsEditorialAndAddressCard> = {
  name: "Editorial & Address Card",
  argTypes: contactUsArgTypes(ContactUsEditorialAndAddressCard, contactUsEditorialAndAddressCardCopy),
  render: (args, context) => <ContactUsEditorialAndAddressCard locale={localeOf(context)} {...photoPropsOf("editorial-and-address-card", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const MapSplit: StoryObj<typeof ContactUsMapSplit> = {
  name: "Map Split",
  argTypes: contactUsArgTypes(ContactUsMapSplit, contactUsMapSplitCopy),
  render: (args, context) => <ContactUsMapSplit locale={localeOf(context)} {...photoPropsOf("map-split", context)} {...args} />,
}

export const OfficeCards: StoryObj<typeof ContactUsOfficeCards> = {
  name: "Office Cards",
  argTypes: contactUsArgTypes(ContactUsOfficeCards, contactUsOfficeCardsCopy),
  render: (args, context) => <ContactUsOfficeCards locale={localeOf(context)} {...photoPropsOf("office-cards", context)} {...args} />,
}

export const HqFeature: StoryObj<typeof ContactUsHqFeature> = {
  name: "HQ Feature",
  argTypes: contactUsArgTypes(ContactUsHqFeature, contactUsHqFeatureCopy),
  render: (args, context) => <ContactUsHqFeature locale={localeOf(context)} {...photoPropsOf("hq-feature", context)} {...args} now={CONTACT_US_NOW} />,
}

export const GlobalOfficesTable: StoryObj<typeof ContactUsGlobalOfficesTable> = {
  name: "Global Offices Table",
  argTypes: contactUsArgTypes(ContactUsGlobalOfficesTable, contactUsGlobalOfficesTableCopy),
  render: (args, context) => <ContactUsGlobalOfficesTable locale={localeOf(context)} {...photoPropsOf("global-offices-table", context)} {...args} now={CONTACT_US_TABLE_NOW} />,
}

export const HoursAndAvailability: StoryObj<typeof ContactUsHoursAndAvailability> = {
  name: "Hours and Availability",
  argTypes: contactUsArgTypes(ContactUsHoursAndAvailability, contactUsHoursAndAvailabilityCopy),
  render: (args, context) => <ContactUsHoursAndAvailability locale={localeOf(context)} {...photoPropsOf("hours-and-availability", context)} {...args} now={CONTACT_US_NOW} />,
}

export const NamedOwners: StoryObj<typeof ContactUsNamedOwners> = {
  name: "Named Owners",
  argTypes: contactUsArgTypes(ContactUsNamedOwners, contactUsNamedOwnersCopy),
  render: (args, context) => <ContactUsNamedOwners locale={localeOf(context)} {...photoPropsOf("named-owners", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const BookACall: StoryObj<typeof ContactUsBookACall> = {
  name: "Book a Call",
  argTypes: contactUsArgTypes(ContactUsBookACall, contactUsBookACallCopy),
  render: (args, context) => <ContactUsBookACall locale={localeOf(context)} {...photoPropsOf("book-a-call", context)} {...args} onBook={async () => { await settle() }} />,
}

export const FormWithFaq: StoryObj<typeof ContactUsFormWithFaq> = {
  name: "Form with FAQ",
  argTypes: contactUsArgTypes(ContactUsFormWithFaq, contactUsFormWithFaqCopy),
  render: (args, context) => <ContactUsFormWithFaq locale={localeOf(context)} {...photoPropsOf("form-with-faq", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const BentoGrid: StoryObj<typeof ContactUsBentoGrid> = {
  name: "Bento Grid",
  argTypes: contactUsArgTypes(ContactUsBentoGrid, contactUsBentoGridCopy),
  render: (args, context) => <ContactUsBentoGrid locale={localeOf(context)} {...photoPropsOf("bento-grid", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} />,
}

export const SocialRail: StoryObj<typeof ContactUsSocialRail> = {
  name: "Social Rail",
  argTypes: contactUsArgTypes(ContactUsSocialRail, contactUsSocialRailCopy),
  render: (args, context) => <ContactUsSocialRail locale={localeOf(context)} {...photoPropsOf("social-rail", context)} {...args} />,
}

export const NewsletterCombo: StoryObj<typeof ContactUsNewsletterCombo> = {
  name: "Newsletter Combo",
  argTypes: contactUsArgTypes(ContactUsNewsletterCombo, contactUsNewsletterComboCopy),
  render: (args, context) => <ContactUsNewsletterCombo locale={localeOf(context)} {...photoPropsOf("newsletter-combo", context)} {...args} onSubmit={async (values) => { args.onSubmit?.(values); await settle() }} onSubscribe={async () => { await settle() }} />,
}

export const SupportChannels: StoryObj<typeof ContactUsSupportChannels> = {
  name: "Support Channels",
  argTypes: contactUsArgTypes(ContactUsSupportChannels, contactUsSupportChannelsCopy),
  render: (args, context) => <ContactUsSupportChannels locale={localeOf(context)} {...photoPropsOf("support-channels", context)} {...args} />,
}
