import * as React from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "../../../src/lib/utils"
import { Avatar } from "../../ui/avatar/avatar"
import { buttonVariants } from "../../ui/button/button"
import { SocialIcon, type SocialPlatform } from "../../ui/social-icons/social-icons"

/*
 * Figma: `Blog Cards` (46368:243914), Type=Author Spotlight.
 *
 * One writer and their posts, on a `muted` band. The author card is a bordered
 * `card` panel: a 96px portrait, a name, a role, a short bio, a row of social
 * marks and a ruled row of three figures (posts, topics, the year they
 * joined). Beside it, the writer's posts: a label with a ghost "All 9 posts"
 * button, then three rows of a thumbnail, a line of category and date, a title
 * and an excerpt, each ruled by a hairline. Each row is one link named by its
 * title.
 *
 * The portrait is a reserved slot. It is the Avatar atom: initials from the
 * author's name until a photo is passed as `author.image`, and then the photo.
 *
 * Desktop (Figma 1440) sets the card 420 wide at the start and the posts 812
 * beside it, the thumbnails 160 by 108. Tablet (768) puts the posts above the
 * card, both at full width, the thumbnails 140 by 94. Mobile (360) does the
 * same with each post row stacked: a 328 by 184 thumbnail over its copy.
 *
 * Hovering a post row scales its thumbnail from 1.00 to 1.05 inside its clip
 * and turns its title `info` (180ms). Keyboard focus does the same. The
 * social marks are drawn in the `foreground` colour at rest, as Figma's frame
 * shows them, and do not change on hover. The portrait is still. There is no hover on Mobile; pressing a row dims it
 * to 92%. Reduced motion turns the scale off. Nothing plays on load or on a
 * timer.
 *
 * Arabic mirrors by the page's `dir`: on Desktop the card is at the right and
 * the posts at the left, the thumbnails sit at the right of each row, and the
 * button's arrow is mirrored. The social marks never mirror.
 *
 * Mobile first, and sized by the block's own width, not the window's: the
 * section is a query container. The base classes are Figma's Mobile (360);
 * `[@container(min-width:40rem)]:` is its Tablet and
 * `[@container(min-width:64rem)]:` its Desktop. The section's own padding
 * still follows the window, since an element can't query itself.
 */

export interface BlogCardsAuthorSpotlightAuthor {
  /** The portrait. Without one the Avatar shows the author's initials. */
  image?: { src: string; alt: string }
  /** The author's name, an `h2`. Their initials fill the portrait slot. */
  name: string
  /** The author's role, under the name. */
  role: React.ReactNode
  /** The short bio. */
  bio: React.ReactNode
  /** The social links, as marks from Social Icons. Hidden when empty. */
  socials: { platform: SocialPlatform; label: string; href: string }[]
  /** The row of figures, each a value over a label. Hidden when empty. */
  stats: { value: React.ReactNode; label: React.ReactNode }[]
}

export interface BlogCardsAuthorSpotlightPost {
  /** The thumbnail. Without one the thumbnail is a placeholder of the same size. */
  image?: { src: string; alt: string }
  /** The category. */
  category: React.ReactNode
  /** The date, as written: "Aug 11, 2026". */
  date: React.ReactNode
  /** The title, an `h3`, and the row's accessible name. */
  title: React.ReactNode
  /** The excerpt. */
  excerpt: React.ReactNode
  /** Where the row goes. */
  href: string
}

export interface BlogCardsAuthorSpotlightCopy {
  /** The author card. Without one the posts stand alone. */
  author: BlogCardsAuthorSpotlightAuthor | null
  /** The label over the posts, an `h2`. */
  postsLabel: React.ReactNode
  /** The ghost button at the end of the label. Hidden when null. */
  allPosts: { label: React.ReactNode; href: string } | null
  /** The author's posts, in reading order. */
  posts: BlogCardsAuthorSpotlightPost[]
  /** Shown instead of the rows when `posts` is empty. */
  emptyLabel: React.ReactNode
}

/** Figma's copy, English and Arabic. */
const COPY: Record<"en" | "ar", BlogCardsAuthorSpotlightCopy> = {
  en: {
    author: {
      name: "Noor Al-Amin",
      role: "Arabic Typography Lead, Fasla",
      bio: "Noor works on the Arabic layer of Fasla — the type ramp, the mirroring rules, and the parts of RTL that no component library gets right on the first try. Nine posts so far.",
      socials: [
        { platform: "linkedin", label: "LinkedIn", href: "#" },
        { platform: "x", label: "X", href: "#" },
        { platform: "github", label: "GitHub", href: "#" },
      ],
      stats: [
        { value: "9", label: "posts" },
        { value: "3", label: "topics" },
        { value: "2026", label: "joined" },
      ],
    },
    postsLabel: "POSTS BY NOOR",
    allPosts: { label: "All 9 posts", href: "#" },
    posts: [
      {
        category: "RTL & ARABIC",
        date: "Aug 11, 2026",
        title: "Arabic type on the web: what breaks and why",
        excerpt:
          "Line height, kashida, and the quiet assumptions baked into most UI kits — a field guide from building Fasla's RTL layer.",
        href: "#",
      },
      {
        category: "RTL & ARABIC",
        date: "Jul 14, 2026",
        title: "Mirroring is not flipping",
        excerpt: "The layout rules that actually change in RTL — and the ones designers keep mirroring by mistake.",
        href: "#",
      },
      {
        category: "RTL & ARABIC",
        date: "Apr 21, 2026",
        title: "Kashida, ligatures, and line height",
        excerpt: "Three Arabic typesetting features that most component libraries silently disable.",
        href: "#",
      },
    ],
    emptyLabel: "No articles yet.",
  },
  ar: {
    author: {
      name: "نور الأمين",
      role: "قائدة الخطوط العربية، فاصلة",
      bio: "تعمل نور على الطبقة العربية في فاصلة: سلّم الخطوط، وقواعد الانعكاس، وأجزاء RTL التي لا تصيبها أي مكتبة مكوّنات من المحاولة الأولى. تسعة مقالات حتى الآن.",
      socials: [
        { platform: "linkedin", label: "LinkedIn", href: "#" },
        { platform: "x", label: "X", href: "#" },
        { platform: "github", label: "GitHub", href: "#" },
      ],
      stats: [
        { value: "9", label: "مقالات" },
        { value: "3", label: "مواضيع" },
        { value: "2026", label: "انضمت" },
      ],
    },
    postsLabel: "مقالات نور",
    allPosts: { label: "كل المقالات التسعة", href: "#" },
    posts: [
      {
        category: "العربية وRTL",
        date: "11 أغسطس 2026",
        title: "الخط العربي على الويب: ما الذي ينكسر ولماذا",
        excerpt:
          "ارتفاع السطر، والكشيدة، والافتراضات الصامتة المخبوءة في معظم أطقم الواجهات، دليل ميداني من بناء طبقة RTL في فاصلة.",
        href: "#",
      },
      {
        category: "العربية وRTL",
        date: "14 يوليو 2026",
        title: "الانعكاس ليس مجرد قلب",
        excerpt: "قواعد التخطيط التي تتغير فعلاً في RTL، وتلك التي يعكسها المصممون بالخطأ.",
        href: "#",
      },
      {
        category: "العربية وRTL",
        date: "21 أبريل 2026",
        title: "الكشيدة والوصلات وارتفاع السطر",
        excerpt: "ثلاث خصائص لتنضيد العربية تعطّلها معظم مكتبات المكوّنات بصمت.",
        href: "#",
      },
    ],
    emptyLabel: "لا توجد مقالات بعد.",
  },
}

/** The block's English and Arabic copy, for stories and previews. */
export const blogCardsAuthorSpotlightCopy = COPY

/*
 * Every class below is written out whole: Tailwind finds a class by reading
 * the source, so none is built from pieces. The hover and focus ones are from
 * Tablet up (Mobile has none).
 */
const ROW =
  "group/row flex flex-col gap-3 border-b py-5 transition-opacity duration-[120ms] motion-reduce:transition-none [@container(min-width:40rem)]:flex-row [@container(min-width:40rem)]:items-center [@container(min-width:40rem)]:gap-6 [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:[@container(max-width:39.99rem)]:opacity-[0.92]"
const THUMB_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:motion-safe:scale-[1.05] group-focus-visible/row:[@container(min-width:40rem)]:motion-safe:scale-[1.05]"
const TITLE_HOVER =
  "group-hover/row:[@container(min-width:40rem)]:text-info group-focus-visible/row:[@container(min-width:40rem)]:text-info"
/** `relative` and a 44px hit area drawn by a pseudo-element, centred on the mark: the mark keeps its 20px. */
const SOCIAL =
  "relative after:absolute after:left-1/2 after:top-1/2 after:h-11 after:w-[max(100%,2.75rem)] after:-translate-x-1/2 after:-translate-y-1/2 after:content-[''] text-foreground [outline:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

export interface BlogCardsAuthorSpotlightProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    Partial<BlogCardsAuthorSpotlightCopy> {
  /** Which language the default copy is in. The page's `dir` sets the direction. */
  locale?: "en" | "ar"
}

export function BlogCardsAuthorSpotlight({
  locale = "en",
  author,
  postsLabel,
  allPosts,
  posts,
  emptyLabel,
  className,
  ...props
}: BlogCardsAuthorSpotlightProps) {
  const copy = COPY[locale]
  const nameId = React.useId()
  const postsId = React.useId()
  const rowId = React.useId()
  const writer = author === undefined ? copy.author : author
  const list = posts ?? copy.posts
  const all = allPosts === undefined ? copy.allPosts : allPosts

  return (
    <section
      aria-labelledby={writer ? nameId : postsId}
      className={cn(
        "[container-type:inline-size] bg-muted px-4 py-8 md:px-6 md:py-16 lg:px-20 lg:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 [@container(min-width:40rem)]:gap-10 [@container(min-width:64rem)]:flex-row [@container(min-width:64rem)]:items-start [@container(min-width:64rem)]:gap-12">
        {writer ? (
          <div className="order-last flex flex-col gap-5 rounded-xl border bg-card p-8 [@container(min-width:64rem)]:order-first [@container(min-width:64rem)]:w-[420px] [@container(min-width:64rem)]:shrink-0">
            <Avatar
              variant={writer.image ? "image" : "initials"}
              size="32"
              radius="rounded"
              border
              name={writer.name}
              src={writer.image?.src}
              aria-hidden="true"
              className="size-24 [&>span:first-child]:text-3xl"
            />
            <div className="flex flex-col gap-1">
              <h2
                id={nameId}
                className="text-xl font-semibold text-foreground [@container(min-width:40rem)]:text-2xl"
              >
                {writer.name}
              </h2>
              <p className="text-sm text-muted-foreground">{writer.role}</p>
            </div>
            <p className="text-base text-muted-foreground">{writer.bio}</p>
            {writer.socials.length > 0 ? (
              <ul className="flex items-center gap-4">
                {writer.socials.map((social) => (
                  <li key={social.platform} className="flex">
                    <a href={social.href} aria-label={social.label} className={SOCIAL}>
                      <SocialIcon platform={social.platform} color="current" className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            {writer.stats.length > 0 ? (
              <dl className="flex gap-4 border-t pt-5 [@container(min-width:40rem)]:gap-6">
                {writer.stats.map((stat, index) => (
                  <div key={index} className="flex min-w-0 flex-1 flex-col">
                    <dt className="order-last text-xs text-muted-foreground">{stat.label}</dt>
                    <dd className="text-xl font-semibold text-foreground">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col [@container(min-width:64rem)]:flex-1">
          <div className="flex items-center justify-between gap-4 border-b pb-3">
            <h2 id={postsId} className="min-w-0 text-xs font-medium uppercase text-muted-foreground">
              {postsLabel ?? copy.postsLabel}
            </h2>
            {all ? (
              <a href={all.href} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}>
                {all.label}
                <ArrowRightIcon aria-hidden="true" className="size-4 rtl:-scale-x-100" />
              </a>
            ) : null}
          </div>
          {list.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel ?? copy.emptyLabel}</p>
          ) : (
            <ul>
              {list.map((post, index) => (
                <li key={index} className="flex">
                  <a
                    href={post.href}
                    aria-labelledby={`${rowId}-${index}`}
                    className={cn(ROW, "w-full")}
                  >
                    <div className="relative aspect-[328/184] w-full shrink-0 overflow-hidden rounded-md bg-background [@container(min-width:40rem)]:aspect-[140/94] [@container(min-width:40rem)]:w-[140px] [@container(min-width:64rem)]:aspect-[160/108] [@container(min-width:64rem)]:w-[160px]">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image.src}
                          alt={post.image.alt}
                          loading="lazy"
                          className={cn(
                            "absolute inset-0 size-full object-cover transition-transform duration-[180ms] ease-out motion-reduce:transition-none",
                            THUMB_HOVER
                          )}
                        />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="uppercase">{post.category}</span>
                        <span aria-hidden="true" className="size-[3px] rounded-full bg-muted-foreground" />
                        <span>{post.date}</span>
                      </span>
                      <h3
                        id={`${rowId}-${index}`}
                        className={cn(
                          "text-xl font-semibold text-foreground transition-colors duration-[180ms] motion-reduce:transition-none",
                          TITLE_HOVER
                        )}
                      >
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
