"use client"

import * as React from "react"
import { Heart, MessageCircle } from "lucide-react"
import { SocialIcon } from "../../ui/social-icons/social-icons"
import {
  Isolated,
  SocialProofAuthor,
  SocialProofHeader,
  SocialProofSection,
  type SocialProofLocale,
  type SocialProofPerson,
  type SocialProofPhotos,
} from "../social-proof/social-proof"

/*
 * Figma: `Social Proof` (46368:3361), Type=Tweet Wall.
 *
 * A centred header over six posts as they appeared on X: the author's
 * avatar, name and handle with the X mark at the end, the post with every
 * mention in `info`, and a footer with the date and the like and reply
 * counts. The posts are display only: nothing here is a button.
 *
 * Desktop sets them three to a row, Tablet two, phones one under another.
 */

export interface SocialProofTweetWallItem {
  /** The author; `role` holds the handle, `@tariqbuilds`. Keep handles under 15 characters. */
  author: SocialProofPerson
  /** The post as written. Mentions (`@Fasla`) are set in `info`. Up to 122 characters in English, 129 in Arabic. */
  post: string
  date: React.ReactNode
  likes: React.ReactNode
  replies: React.ReactNode
}

export interface SocialProofTweetWallCopy {
  heading: React.ReactNode
  description: React.ReactNode
  /** The posts, in reading order. */
  items: SocialProofTweetWallItem[]
  /** Read before each count by assistive tech: "Likes", "Replies". */
  countLabels: { likes: string; replies: string }
  /** The X mark's accessible name. */
  networkLabel: string
}

const p = (id: string, name: string, role: string): SocialProofPerson => ({ id, name, role })

/** Figma's copy, English and Arabic, posts as their authors wrote them. Every person is invented. */
const COPY: Record<SocialProofLocale, SocialProofTweetWallCopy> = {
  en: {
    heading: "Loved in public",
    description: "Unfiltered posts from the timeline.",
    countLabels: { likes: "Likes", replies: "Replies" },
    networkLabel: "Posted on X",
    items: [
      { author: p("tariq-zaki", "Tariq Zaki", "@tariqbuilds"), post: "took me 2 minutes to wire @Fasla tokens into our app. everything just… matched. still suspicious.", date: "Apr 2", likes: "214", replies: "18" },
      { author: p("hani-jaber", "Hani Jaber", "@hanijaber"), post: "initial impressions of @Fasla: zero-config theming is real. shipped dark mode before standup.", date: "May 11", likes: "512", replies: "34" },
      { author: p("omar-haddad", "Omar Haddad", "@omarbuilds"), post: "i'm super bullish on @Fasla. self-served components first, and the new blocks program is exciting.", date: "Jun 3", likes: "128", replies: "9" },
      { author: p("ziad-karam", "Ziad Karam", "@ziadbuilds"), post: "really gotta commend @Fasla for sane defaults. never seen spacing this consistent in any library.", date: "Jun 19", likes: "342", replies: "21" },
      { author: p("adel-qasim", "Adel Qasim", "@adelqasim"), post: "our brand book is now literally just a link to @Fasla tokens", date: "Jul 8", likes: "890", replies: "56" },
      { author: p("khalid-saad", "Khalid Saad", "@ksaad"), post: "QA: “no visual regressions this sprint?”  me: @Fasla", date: "Aug 1", likes: "1.2K", replies: "73" },
    ],
  },
  ar: {
    heading: "إشادات على الملأ",
    description: "منشورات كما كتبها أصحابها، دون تعديل.",
    countLabels: { likes: "الإعجابات", replies: "الردود" },
    networkLabel: "منشور على X",
    items: [
      { author: p("tariq-zaki", "طارق زكي", "@tariqbuilds"), post: "استغرق مني ربط رموز التصميم من @Fasla بتطبيقنا دقيقتين. تطابق كل شيء… ببساطة. وما زلت غير مصدّق.", date: "2 أبريل", likes: "214", replies: "18" },
      { author: p("hani-jaber", "هاني جابر", "@hanijaber"), post: "انطباعي الأول عن @Fasla: تغيير السمات دون أي إعداد حقيقي فعلًا. أطلقت الوضع الداكن قبل الاجتماع اليومي.", date: "11 مايو", likes: "512", replies: "34" },
      { author: p("omar-haddad", "عمر حداد", "@omarbuilds"), post: "متفائل جدًا بشأن @Fasla. مكوّنات تستخدمها بنفسك من البداية، وبرنامج الكتل الجديد واعد.", date: "3 يونيو", likes: "128", replies: "9" },
      { author: p("ziad-karam", "زياد كرم", "@ziadbuilds"), post: "لا بد أن أثني على @Fasla لإعداداتها الافتراضية المدروسة. لم أرَ تباعدًا بهذا الاتساق في أي مكتبة.", date: "19 يونيو", likes: "342", replies: "21" },
      { author: p("adel-qasim", "عادل قاسم", "@adelqasim"), post: "دليل علامتنا صار حرفيًا رابطًا إلى رموز التصميم في @Fasla", date: "8 يوليو", likes: "890", replies: "56" },
      { author: p("khalid-saad", "خالد سعد", "@ksaad"), post: "فريق الجودة: «لا تراجعات بصرية في هذا السبرنت؟»  أنا: @Fasla", date: "1 أغسطس", likes: "1.2K", replies: "73" },
    ],
  },
}

const MENTION = /(@[A-Za-z0-9_]+)/

/** The post, every mention in `info` and in its own left-to-right isolate. */
function Post({ text }: { text: string }) {
  return (
    <>
      {text.split(MENTION).map((part, index) =>
        index % 2 === 1 ? (
          <bdi key={index} dir="ltr" className="text-info">
            {part}
          </bdi>
        ) : (
          <Isolated key={index}>{part}</Isolated>
        )
      )}
    </>
  )
}

export interface SocialProofTweetWallProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, Partial<SocialProofTweetWallCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: SocialProofLocale
  /** Avatar photos by person id. Without them the avatars show initials. */
  photos?: SocialProofPhotos
}

export function SocialProofTweetWall({
  locale = "en",
  heading,
  description,
  items,
  countLabels,
  networkLabel,
  photos,
  className,
  ...props
}: SocialProofTweetWallProps) {
  const copy = COPY[locale]
  const headingId = React.useId()
  const list = items ?? copy.items
  const labels = countLabels ?? copy.countLabels
  const network = networkLabel ?? copy.networkLabel

  return (
    <SocialProofSection labelledBy={headingId} className={className} contentClassName="gap-10" {...props}>
      <SocialProofHeader
        headingId={headingId}
        heading={heading ?? copy.heading}
        description={description === undefined ? copy.description : description}
        headingSize="3xl"
        descriptionSize="base"
        className="gap-3"
      />
      <ul className="grid w-full grid-cols-1 gap-5 [@container(min-width:40rem)]:grid-cols-2 [@container(min-width:64rem)]:grid-cols-3">
        {list.map((item, index) => (
          <li key={index} className="min-w-0 rounded-lg bg-card p-5 ring-1 ring-inset ring-border forced-colors:border">
            <figure className="m-0 flex flex-col gap-3">
              <SocialProofAuthor
                person={item.author}
                photos={photos}
                gap="2.5"
                avatarClassName="size-9"
                nameClassName="font-semibold"
                trailing={<SocialIcon platform="x" color="negative" title={network} className="size-[18px] shrink-0" />}
              />
              <blockquote className="m-0">
                <p className="text-sm text-foreground">
                  <Post text={item.post} />
                </p>
              </blockquote>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  <Isolated>{item.date}</Isolated>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart aria-hidden size={14} />
                  <span className="sr-only">{labels.likes}: </span>
                  <bdi dir="ltr">{item.likes}</bdi>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle aria-hidden size={14} />
                  <span className="sr-only">{labels.replies}: </span>
                  <bdi dir="ltr">{item.replies}</bdi>
                </span>
              </div>
            </figure>
          </li>
        ))}
      </ul>
    </SocialProofSection>
  )
}

/**
 * The default copy, English and Arabic, as `locale` picks it. Spread it to
 * change a few strings and keep the rest.
 */
export const socialProofTweetWallCopy = COPY
