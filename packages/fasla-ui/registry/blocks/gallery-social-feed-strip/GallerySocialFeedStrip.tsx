"use client"

import * as React from "react"
import { HeartIcon, MessageCircleIcon, PlusIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"
import { SocialIcon } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Gallery` (42478:479), Type=Social Feed Strip.
 *
 * A social profile over a strip of its latest posts: the account's avatar,
 * the Instagram mark and handle, a followers-and-posts line, and a Follow
 * button at the far end; under it six square-ish post tiles, in one row from
 * Tablet up and in two rows of three on a phone. No photos come with the
 * block: pass `photos`, and until then each tile shows a `muted` placeholder
 * of the same box and the avatar shows its own fallback.
 *
 * Every tile is a link to its post (or, without one, to the profile). On
 * hover or keyboard focus a scrim fades in over the photo with the post's
 * like and comment counts, as Figma's second tile shows. The counts are in
 * the DOM all the time, so a screen reader hears them as part of the link's
 * name whether or not the scrim shows. The scrim and its text are the inverse
 * tokens Figma binds, so the block needs the `theme-inverse` item.
 *
 * Follow is a link, not an action: the block can't follow anyone on another
 * network, so it takes the visitor to the profile. The Instagram mark is
 * the library's Social Icons in Figma's Negative colour (`muted-foreground`). Figma's
 * avatar carries an Online status dot; it is left off here, because an
 * account's profile has no presence to report (Avatar's own rule).
 *
 * In Arabic the row mirrors: avatar and handle on the right, Follow on the
 * left, and the tiles fill from the right. The handle is a Latin run, so it
 * sits in `<bdi>`, and every count is in `<bdi dir="ltr">`. The followers
 * line is two parts with a middle dot between them, so the dot stays between
 * the parts in both directions. The photographs are never flipped.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container, so the block lays out for the room it is
 * given, such as a docs preview narrower than the screen. The base classes
 * are Figma's Mobile (360); `[@container(min-width:40rem)]:` is its Tablet,
 * from 640px of content (Figma's Tablet, 768 less its padding), and
 * `[@container(min-width:64rem)]:` its Desktop, from 1024px of content.
 * The section's own padding still follows the window, since an element
 * can't query itself.
 */

export interface GallerySocialFeedStripPhoto {
  src: string
  /** Describes the photo. Pass "" for a purely decorative one. */
  alt: string
}

export interface GallerySocialFeedStripPost {
  /** How many likes the post has. Shown on hover and focus, with thousands separated ("2,140"). */
  likes: number
  /** How many comments the post has. Shown on hover and focus. */
  comments: number
  /** Where the tile links to. Defaults to `followAction.href`, the profile. */
  href?: string
}

export interface GallerySocialFeedStripCopy {
  /** The account's handle, the section's `h2`. */
  handle: React.ReactNode
  /** The network's name: the accessible name of the mark beside the handle. */
  platform: string
  /** The parts of the line under the handle (followers, posts), joined by middle dots. */
  stats: React.ReactNode[]
  /** The Follow button: a link to the profile. */
  followAction: { label: React.ReactNode; href: string }
  /** The posts, in order. Each has its `likes` and `comments` and an optional `href`. */
  posts: GallerySocialFeedStripPost[]
  /**
   * Read after a post's like count by screen readers, given the count: "likes".
   * A function, because Arabic changes the noun's form with the number.
   */
  likesLabel: (count: number) => string
  /** Read after a post's comment count by screen readers, given the count: "comments". */
  commentsLabel: (count: number) => string
  /** Shown in place of the tiles when `posts` is empty. */
  empty: React.ReactNode
}

/**
 * Figma's copy, English and Arabic. Figma shows counts on the second post
 * only (2,140 and 86); the other five posts' counts are sample figures.
 */
const COPY: Record<"en" | "ar", GallerySocialFeedStripCopy> = {
  en: {
    handle: "@fasla.studio",
    platform: "Instagram",
    stats: ["12.4k followers", "318 posts"],
    followAction: { label: "Follow", href: "#follow" },
    posts: [
      { likes: 1284, comments: 42 },
      { likes: 2140, comments: 86 },
      { likes: 956, comments: 31 },
      { likes: 1702, comments: 57 },
      { likes: 2418, comments: 104 },
      { likes: 1063, comments: 38 },
    ],
    likesLabel: (count) => (count === 1 ? "like" : "likes"),
    commentsLabel: (count) => (count === 1 ? "comment" : "comments"),
    empty: "No photos yet.",
  },
  ar: {
    handle: <bdi>@fasla.studio</bdi>,
    platform: "إنستغرام",
    stats: [
      <React.Fragment key="followers">
        <bdi dir="ltr">12.4</bdi> ألف متابع
      </React.Fragment>,
      <React.Fragment key="posts">
        <bdi dir="ltr">318</bdi> منشورًا
      </React.Fragment>,
    ],
    followAction: { label: "متابعة", href: "#follow" },
    posts: [
      { likes: 1284, comments: 42 },
      { likes: 2140, comments: 86 },
      { likes: 956, comments: 31 },
      { likes: 1702, comments: 57 },
      { likes: 2418, comments: 104 },
      { likes: 1063, comments: 38 },
    ],
    likesLabel: (count) => arabicCounted(count, ["إعجاب", "إعجابان", "إعجابات", "إعجابًا"]),
    commentsLabel: (count) => arabicCounted(count, ["تعليق", "تعليقان", "تعليقات", "تعليقًا"]),
    empty: "لا توجد صور بعد.",
  },
}

const AR_PLURAL = typeof Intl === "undefined" ? null : new Intl.PluralRules("ar")

/**
 * The noun after an Arabic count, in the form the number takes: singular for
 * one and after hundreds and thousands, dual for two, the plural from three
 * to ten, and the accusative singular from eleven to ninety-nine.
 */
function arabicCounted(count: number, [one, two, few, many]: [string, string, string, string]) {
  switch (AR_PLURAL?.select(count)) {
    case "two":
      return two
    case "few":
      return few
    case "many":
      return many
    default:
      return one
  }
}

/** A count as it reads on the tile, thousands separated, in Latin digits in both languages. */
const formatCount = (count: number) => count.toLocaleString("en-US")

export interface GallerySocialFeedStripProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<GallerySocialFeedStripCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
  /**
   * The photos, in Figma's order: the profile's avatar first, then one per
   * post, in the order of `posts`. None by default: each tile shows a `muted`
   * placeholder and the avatar its own fallback. The avatar's `alt` is read
   * as the account's name; pass "" when the handle beside it says enough.
   * @default none: `muted` placeholders
   */
  photos?: GallerySocialFeedStripPhoto[]
}

export function GallerySocialFeedStrip({
  locale = "en",
  handle,
  platform,
  stats,
  followAction,
  posts,
  likesLabel,
  commentsLabel,
  empty,
  photos = [],
  className,
  ...props
}: GallerySocialFeedStripProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = posts ?? copy.posts
  const follow = followAction ?? copy.followAction
  const parts = stats ?? copy.stats
  const avatar = photos[0]

  return (
    <section aria-labelledby={headingId} className={cn("[container-type:inline-size] bg-background p-8 md:p-16 lg:p-24", className)} {...props}>
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar
              size="32"
              radius="rounded"
              border
              src={avatar?.src}
              name={avatar?.alt ?? ""}
              loading="lazy"
              decoding="async"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <SocialIcon platform="instagram" color="negative" title={platform ?? copy.platform} className="size-5" />
                <h2 id={headingId} className="truncate text-sm font-semibold text-foreground [@container(min-width:40rem)]:text-base">
                  {handle ?? copy.handle}
                </h2>
              </div>
              <p className="whitespace-nowrap text-xs text-muted-foreground [@container(min-width:40rem)]:text-sm">
                {parts.map((part, index) => (
                  <React.Fragment key={index}>
                    {index > 0 ? (
                      <span aria-hidden="true" className="mx-1">
                        ·
                      </span>
                    ) : null}
                    <span>{part}</span>
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
          {/* Figma's Follow is xs on a phone and sm from Tablet up. */}
          <a
            href={follow.href}
            className={buttonVariants({ size: "xs", className: "[@container(min-width:40rem)]:h-8 [@container(min-width:40rem)]:px-3 [@container(min-width:40rem)]:text-sm" })}
          >
            <PlusIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
            {follow.label}
          </a>
        </div>

        {list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">{empty ?? copy.empty}</p>
        ) : (
          <ul className="grid grid-cols-3 gap-3 [@container(min-width:40rem)]:grid-cols-6 [@container(min-width:40rem)]:gap-4">
            {list.map((post, index) => {
              const photo = photos[index + 1]
              return (
                <li key={index}>
                  <a
                    href={post.href ?? follow.href}
                    className="group relative flex aspect-[91/100] overflow-hidden rounded-md bg-muted [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [@container(min-width:40rem)]:aspect-[93/96] [@container(min-width:64rem)]:aspect-[195/196]"
                  >
                    {photo ? (
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center bg-background-inverse/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                      <span className="flex flex-col items-start gap-1 text-sm font-semibold text-foreground-inverse [@container(min-width:40rem)]:items-center [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:gap-4">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <HeartIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                          <bdi dir="ltr">{formatCount(post.likes)}</bdi>
                          <span className="sr-only"> {(likesLabel ?? copy.likesLabel)(post.likes)},</span>
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MessageCircleIcon size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden="true" />
                          <bdi dir="ltr">{formatCount(post.comments)}</bdi>
                          <span className="sr-only"> {(commentsLabel ?? copy.commentsLabel)(post.comments)}</span>
                        </span>
                      </span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const gallerySocialFeedStripCopy = COPY
