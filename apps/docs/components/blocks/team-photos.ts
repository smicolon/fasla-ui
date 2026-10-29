/**
 * The Team blocks' demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos; these are the Unsplash photos in
 * public/blocks/team/ (credits in its CREDITS.md), the same ones Figma's Team
 * set shows, each with its alt text in English and Arabic.
 *
 * A person in a block's copy is known by an `id` or, without one, by their
 * English name as a slug. A Type gets its photos by that slug: `portrait-<id>.webp` for most, and for the two
 * cut-out Types the transparent files, `lineup-<first>.webp` and
 * `roster-<first>.webp`.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

/** The fifteen demo people whose photos could be traced and shipped. */
const ROSTER: Record<string, Alt> = {
  "layla-mansour": { en: "A smiling woman with short curly hair in a striped jacket", ar: "امرأة مبتسمة بشعر قصير مجعّد في سترة مخططة" },
  "karim-haddad": { en: "A man with dark hair and a calm expression in a grey knit sweater", ar: "رجل بشعر داكن وتعبير هادئ في سترة محبوكة رمادية" },
  "tomas-vidal": { en: "A smiling man with short dark hair in a white V-neck shirt", ar: "رجل مبتسم بشعر قصير داكن في قميص أبيض بياقة على شكل حرف V" },
  "omar-nasser": { en: "A man in a dark suit and burgundy tie with his arms crossed", ar: "رجل في بدلة داكنة وربطة عنق عنابية يعقد ذراعيه" },
  "lukas-berg": { en: "A bearded man in a chunky dark knit sweater", ar: "رجل ملتحٍ في سترة محبوكة سميكة داكنة" },
  "grace-okafor": { en: "A smiling woman with long braids beside a window", ar: "امرأة مبتسمة بضفائر طويلة بجانب نافذة" },
  "elena-novak": { en: "A smiling woman with long red hair in a dark top", ar: "امرأة مبتسمة بشعر أحمر طويل في قميص داكن" },
  "marcus-boateng": { en: "A smiling man in glasses and a black sweater against a white wall", ar: "رجل مبتسم بنظارة وسترة سوداء أمام جدار أبيض" },
  "rami-aziz": { en: "A smiling bearded man in a navy zip sweater with his arms crossed", ar: "رجل ملتحٍ مبتسم في سترة كحلية بسحّاب يعقد ذراعيه" },
  "sofia-marchetti": { en: "A smiling woman with long straight hair in a grey blazer", ar: "امرأة مبتسمة بشعر طويل مسترسل في سترة رمادية" },
  "hana-kobayashi": { en: "A woman with long dark hair in a cream cardigan", ar: "امرأة بشعر داكن طويل في سترة خفيفة بلون الكريم" },
  "clara-weiss": { en: "A black-and-white portrait of a woman with short curly hair", ar: "صورة بالأبيض والأسود لامرأة بشعر قصير مجعّد" },
  "yara-khalil": { en: "A woman with long dark hair in a checked shirt, looking at the camera", ar: "امرأة بشعر داكن طويل في قميص مربعات تنظر إلى الكاميرا" },
  "mei-tanaka": { en: "A smiling woman in a black blazer with her hand at her chin", ar: "امرأة مبتسمة في سترة سوداء تسند ذقنها بيدها" },
  "chloe-dubois": { en: "A woman with long wavy auburn hair in a grey checked blazer", ar: "امرأة بشعر كستنائي طويل مموّج في سترة رمادية مربعات" },
}

/**
 * Where each portrait is anchored when a box crops it, as CSS `object-position`
 * (50% across, then the percentage down). Worked out from where each face sits in
 * the photo, so the whole face and some headroom stay in every box the Team blocks
 * use. A person who is not listed sits close enough to the blocks' own default (50% 20%).
 */
const FOCUS: Record<string, string> = {
  "chloe-dubois": "50% 30%",
  "clara-weiss": "50% 50%",
  "elena-novak": "50% 30%",
  "hana-kobayashi": "50% 7%",
  "karim-haddad": "50% 10%",
  "layla-mansour": "50% 34%",
  "marcus-boateng": "50% 1%",
  "rami-aziz": "50% 41%",
  "tomas-vidal": "50% 26%",
  "yara-khalil": "50% 36%",
}

/** The Lineup's cut-outs are cropped to the figure: their size in pixels, for the column width. */
const LINEUP: Record<string, { width: number; height: number }> = {
  omar: { width: 596, height: 825 },
  rami: { width: 597, height: 870 },
  sofia: { width: 437, height: 819 },
  mei: { width: 693, height: 878 },
  chloe: { width: 602, height: 923 },
}

export type TeamDemoPhoto = { src: string; alt: string; width?: number; height?: number; position?: string }

const first = (id: string) => id.split("-")[0]

/** A person's demo photo for a Type, alt text in `locale`; undefined for anyone outside the roster. */
export function teamPhoto(type: string, id: string, locale: Locale): TeamDemoPhoto | undefined {
  const alt = ROSTER[id]?.[locale]
  if (!alt) return undefined
  if (type === "annotated-portrait-lineup") {
    const size = LINEUP[first(id)]
    return size ? { src: `/blocks/team/lineup-${first(id)}.webp`, alt, ...size } : undefined
  }
  if (type === "grid-backdrop-roster") return { src: `/blocks/team/roster-${first(id)}.webp`, alt }
  return { src: `/blocks/team/portrait-${id}.webp`, alt, ...(FOCUS[id] ? { position: FOCUS[id] } : {}) }
}

type Person = Record<string, unknown> & { id?: string }
const isPerson = (value: unknown): value is Person =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "name" in value &&
  ("role" in value || Object.keys(value).every((key) => key === "name" || key === "photo" || key === "id"))

const slugOf = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-")

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block: every list or object
 * of the block's own copy that holds people, with a photo added to each one.
 * A person is matched by their `id`, or else by their English name, found at
 * the same place in the English copy, so the Arabic copy gets the same photos.
 * `type` is the registry name without `team-`, and `copy` the block's exported
 * copy.
 */
export function teamPhotoProps(type: string, locale: Locale, copy: BlockCopy): Record<string, unknown> {
  let touched = false
  const walk = (value: unknown, en: unknown): unknown => {
    if (Array.isArray(value)) return value.map((item, index) => walk(item, Array.isArray(en) ? en[index] : undefined))
    if (isPerson(value)) {
      const enName = isPerson(en) && typeof en.name === "string" ? en.name : undefined
      const id = value.id ?? (enName ? slugOf(enName) : undefined)
      const photo = id ? teamPhoto(type, id, locale) : undefined
      if (photo) touched = true
      return photo ? { ...value, photo } : value
    }
    if (typeof value === "object" && value !== null && !("$$typeof" in value)) {
      const enRecord = typeof en === "object" && en !== null ? (en as Record<string, unknown>) : {}
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item, enRecord[key])]))
    }
    return value
  }
  const out: Record<string, unknown> = {}
  const enCopy = copy.en as Record<string, unknown>
  for (const [key, value] of Object.entries(copy[locale] as Record<string, unknown>)) {
    touched = false
    const next = walk(value, enCopy[key])
    if (touched) out[key] = next
  }
  return out
}
