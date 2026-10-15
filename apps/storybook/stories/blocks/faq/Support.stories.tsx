import type { Meta, StoryObj } from "@storybook/react"
import { FaqContactCtaCard } from "../../../../../packages/fasla-ui/registry/blocks/faq-contact-cta-card/FaqContactCtaCard"
import { FaqSupportChannels } from "../../../../../packages/fasla-ui/registry/blocks/faq-support-channels/FaqSupportChannels"
import { FaqNewsletterClose } from "../../../../../packages/fasla-ui/registry/blocks/faq-newsletter-close/FaqNewsletterClose"
import { FaqSupportStats } from "../../../../../packages/fasla-ui/registry/blocks/faq-support-stats/FaqSupportStats"
import { FaqChatThread } from "../../../../../packages/fasla-ui/registry/blocks/faq-chat-thread/FaqChatThread"
import { faqViewports, hiddenArgTypes, localeOf } from "./faq-story-kit"

/**
 * The FAQ blocks that hand the reader to a person: a contact card, the support
 * channels, a newsletter, support's numbers and a chat. Viewport, direction
 * and theme come from the toolbar.
 */
const meta: Meta = {
  title: "Blocks/FAQ/Support and contact",
  parameters: { layout: "fullscreen", viewport: { viewports: faqViewports } },
  tags: ["autodocs"],
}

export default meta

/** The blocks ship no photos. These are Figma's, from apps/docs/public. */
const PEOPLE = {
  en: [
    { name: "Layla Haddad", src: "/blocks/faq/avatar-1.jpg" },
    { name: "Omar Khalil", src: "/blocks/faq/avatar-2.jpg" },
    { name: "Sara Mansour", src: "/blocks/faq/avatar-3.jpg" },
  ],
  ar: [
    { name: "ليلى حداد", src: "/blocks/faq/avatar-1.jpg" },
    { name: "عمر خليل", src: "/blocks/faq/avatar-2.jpg" },
    { name: "سارة منصور", src: "/blocks/faq/avatar-3.jpg" },
  ],
}

/** Settles after a moment, so the pending state shows. */
const later = (fail = false) => () =>
  new Promise<void>((resolve, reject) => setTimeout(() => (fail ? reject(new Error("Failed")) : resolve()), 1200))

export const ContactCtaCard: StoryObj<typeof FaqContactCtaCard> = {
  name: "Contact CTA Card",
  argTypes: hiddenArgTypes,
  render: (args, context) => (
    <FaqContactCtaCard locale={localeOf(context)} people={PEOPLE[localeOf(context)]} {...args} />
  ),
}

export const SupportChannels: StoryObj<typeof FaqSupportChannels> = {
  name: "Support Channels",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqSupportChannels locale={localeOf(context)} {...args} />,
}

/** Subscribe shows the button's loading state, then the success line. */
export const NewsletterClose: StoryObj<typeof FaqNewsletterClose> = {
  name: "Newsletter Close",
  argTypes: { ...hiddenArgTypes, onSubmit: { table: { disable: true } } },
  render: (args, context) => <FaqNewsletterClose locale={localeOf(context)} onSubmit={later()} {...args} />,
}

/** The sign-up fails: the error line shows and the form keeps what was typed. */
export const NewsletterCloseError: StoryObj<typeof FaqNewsletterClose> = {
  ...NewsletterClose,
  name: "Newsletter Close: Sign-up fails",
  render: (args, context) => <FaqNewsletterClose locale={localeOf(context)} onSubmit={later(true)} {...args} />,
}

/** The sign-up is turned off. */
export const NewsletterCloseDisabled: StoryObj<typeof FaqNewsletterClose> = {
  ...NewsletterClose,
  name: "Newsletter Close: Disabled",
  args: { disabled: true },
}

export const SupportStats: StoryObj<typeof FaqSupportStats> = {
  name: "Support Stats",
  argTypes: hiddenArgTypes,
  render: (args, context) => <FaqSupportStats locale={localeOf(context)} {...args} />,
}

/** Send stays disabled until something is typed, then loads while the question is sent. */
export const ChatThread: StoryObj<typeof FaqChatThread> = {
  name: "Chat Thread",
  argTypes: { ...hiddenArgTypes, onSend: { table: { disable: true } } },
  render: (args, context) => (
    <FaqChatThread
      locale={localeOf(context)}
      supportAvatar="/blocks/faq/avatar-support.png"
      onSend={later()}
      {...args}
    />
  ),
}

/** No messages yet: the empty line takes the thread's place. */
export const ChatThreadEmpty: StoryObj<typeof FaqChatThread> = {
  ...ChatThread,
  name: "Chat Thread: Empty",
  args: { messages: [] },
}
