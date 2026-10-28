/**
 * The Gallery block's demo photos, for the docs previews and the Storybook
 * stories. No block ships with photos; these are the Unsplash photos in
 * public/images/gallery/ (credits in its CREDITS.md), the same ones Figma's
 * Gallery set shows, each with its alt text in English and Arabic.
 *
 * Each list is in the file's order, `<slug>-1.webp` first. That is the
 * block's slot order everywhere except Culture Photo Grid, whose files follow
 * the photo brief and whose cards follow Figma; `SLOT_ORDER` maps those.
 */

type Locale = "en" | "ar"
type Alt = { en: string; ar: string }

const ALTS: Record<string, Alt[]> = {
  "culture-photo-grid": [
    { en: "A pencil on dot-grid paper covered in hand-drawn wireframes", ar: "قلم رصاص على ورق منقّط مليء برسوم تخطيطية يدوية" },
    { en: "A row of folding chairs in a dark room", ar: "صف من الكراسي القابلة للطي في غرفة مظلمة" },
    { en: "Red rooftops of Lisbon running down to the river", ar: "أسطح لشبونة الحمراء تنحدر نحو النهر" },
    { en: "A wicker picnic basket, a sun hat and an open book on a white blanket", ar: "سلة نزهة من الخيزران وقبعة شمس وكتاب مفتوح على بطانية بيضاء" },
    { en: "Sticky notes pinned to a grey board", ar: "أوراق ملاحظات لاصقة مثبّتة على لوح رمادي" },
    { en: "An empty studio with a brick wall, pendant lamps and sunlight on the floor", ar: "استوديو فارغ بجدار من الطوب ومصابيح معلّقة وضوء الشمس على الأرض" },
  ],
  "masonry-gallery": [
    { en: "A white sofa and a wooden armchair in a bright living room", ar: "أريكة بيضاء وكرسي خشبي في غرفة جلوس مضيئة" },
    { en: "Three clay vases on a concrete plinth", ar: "ثلاث مزهريات من الطين على قاعدة خرسانية" },
    { en: "White concrete stairs rising to a landing", ar: "درج خرساني أبيض يصعد إلى بسطة" },
    { en: "A speckled vase on a stone ledge in the sun", ar: "مزهرية منقّطة على حافة حجرية تحت الشمس" },
    { en: "A round table and a white chair by a sheer curtain", ar: "طاولة مستديرة وكرسي أبيض بجانب ستارة شفافة" },
    { en: "Two ceramic vases on a linen backdrop", ar: "مزهريتان من الخزف أمام خلفية من الكتان" },
    { en: "A grey sofa and a low wooden table in a corner", ar: "أريكة رمادية وطاولة خشبية منخفضة في زاوية" },
    { en: "A stoneware cup on a saucer in hard light", ar: "كوب من الفخار على صحن صغير في ضوء حاد" },
    { en: "A cream sofa with a throw beside a textured vase", ar: "أريكة كريمية عليها غطاء بجانب مزهرية خشنة الملمس" },
  ],
  "photo-bento": [
    { en: "A wooden desk under a window in a timber-lined studio", ar: "مكتب خشبي تحت نافذة في استوديو مكسوّ بالخشب" },
    { en: "A cluttered desk with books, plants and a lit lamp", ar: "مكتب مزدحم بالكتب والنباتات ومصباح مضاء" },
    { en: "Sunlight through sheer curtains with leaf shadows", ar: "ضوء الشمس عبر ستائر شفافة مع ظلال أوراق الشجر" },
    { en: "A lit wooden shelf with a few small objects", ar: "رفّ خشبي مضاء عليه بعض القطع الصغيرة" },
    { en: "Architectural drawings spread across a table", ar: "رسوم معمارية مفروشة على طاولة" },
  ],
  "filmstrip-carousel": [
    { en: "A rail of cream clothes beside a tall cactus", ar: "علّاقة ملابس كريمية بجانب صبّار طويل" },
    { en: "Soft folds of cream linen", ar: "طيّات ناعمة من الكتان الكريمي" },
    { en: "Cream and sage knitwear laid side by side", ar: "ملابس محبوكة بلون الكريم والمريمية متجاورة" },
    { en: "A stack of folded knitwear in shades of grey", ar: "كومة من الملابس المحبوكة المطوية بدرجات الرمادي" },
    { en: "White shelves and a rail of pale clothes in a shop", ar: "رفوف بيضاء وعلّاقة ملابس فاتحة في متجر" },
    { en: "Folded sweaters stacked in warm light", ar: "كنزات مطوية مكدّسة في ضوء دافئ" },
    { en: "Folded fabric samples in sand and sage", ar: "عيّنات قماش مطوية بلون الرمل والمريمية" },
    { en: "A pile of sweaters on a stool against a sunlit wall", ar: "كومة كنزات على مقعد أمام جدار مشمس" },
  ],
  "full-bleed-slider": [
    { en: "A grey sea and a headland seen through a window", ar: "بحر رمادي ورأس بحري يظهران من نافذة" },
    { en: "A concrete room opening onto a pale beach and sea", ar: "غرفة خرسانية مفتوحة على شاطئ فاتح وبحر" },
    { en: "A headland and the sea through a window in warm evening light", ar: "رأس بحري والبحر من نافذة في ضوء مسائي دافئ" },
    { en: "An armchair by a window over the dunes and a grey sea", ar: "كرسي بجانب نافذة تطلّ على الكثبان وبحر رمادي" },
    { en: "A sheer curtain beside a window onto the sea", ar: "ستارة شفافة بجانب نافذة تطلّ على البحر" },
  ],
  "filter-tabs-grid": [
    { en: "A stone atrium under a glass roof, seen from below", ar: "فناء حجري تحت سقف زجاجي، من الأسفل" },
    { en: "A brass lamp on a desk beside a small plant", ar: "مصباح نحاسي على مكتب بجانب نبتة صغيرة" },
    { en: "Hands shaping clay on a potter's wheel", ar: "يدان تشكّلان الطين على عجلة الفخّار" },
    { en: "An empty event hall with brick walls", ar: "قاعة مناسبات فارغة بجدران من الطوب" },
    { en: "A stone office building beside a river", ar: "مبنى مكاتب حجري بجانب نهر" },
    { en: "Three white ceramic vases in a row", ar: "ثلاث مزهريات خزفية بيضاء في صف" },
    { en: "A white table and two chairs between tall windows", ar: "طاولة بيضاء وكرسيان بين نوافذ طويلة" },
    { en: "A wooden picnic table in a sunlit field", ar: "طاولة نزهة خشبية في حقل مشمس" },
  ],
  "hover-caption-cards": [
    { en: "A stone cabin below an autumn forest in fog", ar: "كوخ حجري تحت غابة خريفية في الضباب" },
    { en: "A table set with plates and bowls by a sheer curtain", ar: "طاولة معدّة بالصحون والأوعية بجانب ستارة شفافة" },
    { en: "A desk lamp lit on a dark desk, in black and white", ar: "مصباح مكتب مضاء على مكتب داكن، بالأبيض والأسود" },
  ],
  "lightbox-viewer": [
    { en: "A white atrium with a lattice of glass and steel", ar: "فناء أبيض بشبكة من الزجاج والفولاذ" },
    { en: "A white atrium with balconies on several floors", ar: "فناء أبيض بشرفات على عدة طوابق" },
    { en: "Looking down a tall round atrium ringed with floors", ar: "نظرة إلى أسفل فناء دائري طويل تحيط به الطوابق" },
    { en: "A symmetrical atrium under a glass skylight, looking up", ar: "فناء متماثل تحت كوة زجاجية، نظرة إلى الأعلى" },
    { en: "A pale stone staircase beside a slatted wall", ar: "درج حجري فاتح بجانب جدار من الشرائح" },
    { en: "A bright lobby with white curved sofas", ar: "ردهة مضيئة بأرائك بيضاء منحنية" },
    { en: "A quiet lounge with cream armchairs", ar: "صالة هادئة بكراسٍ كريمية" },
    { en: "A round skylight seen from the floor of a white dome", ar: "كوة دائرية من أرضية قبة بيضاء" },
  ],
  "horizontal-scroll-rail": [
    { en: "Layers of misty mountains", ar: "طبقات من الجبال يلفّها الضباب" },
    { en: "An open notebook, a pencil and glasses on a white desk", ar: "دفتر مفتوح وقلم رصاص ونظارة على مكتب أبيض" },
    { en: "Hands resting on clay beside unfinished pots", ar: "يدان على الطين بجانب أوانٍ لم تكتمل" },
    { en: "A curved building on the water at a river's edge", ar: "مبنى منحنٍ على الماء عند ضفة نهر" },
    { en: "Pale sticky notes in a grid on a grey wall", ar: "أوراق ملاحظات فاتحة في شبكة على جدار رمادي" },
  ],
  "editorial-split": [
    { en: "A hand sketching with a pencil on brown paper", ar: "يد ترسم بقلم رصاص على ورق بني" },
    { en: "A hand holding a fan of colour swatches over drawings", ar: "يد تمسك مروحة من عيّنات الألوان فوق رسوم" },
    { en: "Wooden pencils pointing at a sheet of white paper", ar: "أقلام خشبية تشير إلى ورقة بيضاء" },
    { en: "A blank sheet with pens and a sharpener on brown paper", ar: "ورقة بيضاء مع أقلام ومبراة على ورق بني" },
  ],
  "scattered-collage": [
    { en: "White houses and a palm tree above the sea in Lisbon", ar: "بيوت بيضاء ونخلة فوق البحر في لشبونة" },
    { en: "Wooden houses and bicycles on a quiet Tokyo street", ar: "بيوت خشبية ودراجات في شارع هادئ في طوكيو" },
    { en: "Green pasture below the peaks of the Dolomites", ar: "مرعى أخضر تحت قمم جبال الدولوميت" },
    { en: "A pagoda and temple roofs above Kyoto", ar: "باغودا وأسطح معبد تطلّ على كيوتو" },
    { en: "A wooden boat at a misty jetty on Lake Bled", ar: "قارب خشبي عند رصيف ضبابي على بحيرة بليد" },
    { en: "Morning light through vines in a vineyard", ar: "ضوء الصباح بين الكروم في مزرعة عنب" },
    { en: "A coast road curving along the sea under cloud", ar: "طريق ساحلي ينعطف بمحاذاة البحر تحت الغيوم" },
  ],
  "social-feed-strip": [
    { en: "Light from window blinds across a wall", ar: "ضوء من ستائر نافذة على جدار" },
    { en: "A white vase with dried grass on linen", ar: "مزهرية بيضاء فيها عشب مجفّف على قماش كتان" },
    { en: "White flowers on a white plate on linen", ar: "زهور بيضاء على صحن أبيض فوق قماش كتان" },
    { en: "A curved fluted wall in warm sunlight", ar: "جدار منحنٍ مضلّع في ضوء شمس دافئ" },
    { en: "Palm shadows on a wall around wooden shutters", ar: "ظلال نخيل على جدار حول نافذة بمصاريع خشبية" },
    { en: "Two steaming mugs on a wooden table", ar: "كوبان يتصاعد منهما البخار على طاولة خشبية" },
    { en: "The shadow of a tall plant on a textured wall", ar: "ظل نبتة طويلة على جدار خشن الملمس" },
  ],
  "video-gallery": [
    { en: "A photo studio with a light, chairs and stools against concrete", ar: "استوديو تصوير فيه مصباح وكراسٍ ومقاعد أمام جدار خرساني" },
    { en: "A wooden desk with a monitor, a white chair and a plant", ar: "مكتب خشبي عليه شاشة، مع كرسي أبيض ونبتة" },
    { en: "Sketches pinned to a wire grid on a white wall", ar: "رسوم مثبّتة على شبكة معدنية فوق جدار أبيض" },
    { en: "A picnic blanket with a cushion and a basket on the grass", ar: "بطانية نزهة عليها وسادة وسلة على العشب" },
  ],
  "before-after-compare": [
    { en: "The room before: bare plaster, open doors and debris on the floor", ar: "الغرفة قبل: جدران عارية وأبواب مفتوحة وأنقاض على الأرض" },
    { en: "The room after: a table and chair between tall windows", ar: "الغرفة بعد: طاولة وكرسي بين نوافذ طويلة" },
  ],
  "dark-cinema-wall": [
    { en: "Street lamps glowing in fog at night", ar: "أعمدة إنارة تتوهّج في الضباب ليلًا" },
    { en: "A dark corridor lit by one window", ar: "ممر مظلم تضيئه نافذة واحدة" },
    { en: "A city's lights at night, seen from above", ar: "أضواء مدينة ليلًا من الأعلى" },
    { en: "Tall arched windows in a dark hall", ar: "نوافذ مقوّسة طويلة في قاعة مظلمة" },
    { en: "A dim, ornate room under a chandelier", ar: "غرفة مزخرفة خافتة الإضاءة تحت ثريا" },
    { en: "A street lamp against the city at dusk", ar: "عمود إنارة أمام المدينة عند الغسق" },
    { en: "A half-open window in a dark room", ar: "نافذة نصف مفتوحة في غرفة مظلمة" },
    { en: "A tram stop in fog under amber lights", ar: "محطة ترام في الضباب تحت أضواء كهرمانية" },
    { en: "The shadow of a window frame on a concrete wall", ar: "ظل إطار نافذة على جدار خرساني" },
    { en: "Light from two windows falling on a dark floor", ar: "ضوء من نافذتين يسقط على أرضية مظلمة" },
    { en: "Parked cars along a street at night", ar: "سيارات مصطفّة على طول شارع ليلًا" },
    { en: "A dark, empty corridor in black and white", ar: "ممر فارغ مظلم بالأبيض والأسود" },
  ],
  "hover-index-list": [
    { en: "A curved plaster atrium with round skylights", ar: "فناء جصّي منحنٍ بكوّات دائرية" },
    { en: "A lit brass lamp on a walnut base", ar: "مصباح نحاسي مضاء على قاعدة من خشب الجوز" },
    { en: "A hand drawing with a fine tool at a workbench", ar: "يد ترسم بأداة دقيقة على طاولة عمل" },
    { en: "Office buildings across a still river at dawn", ar: "مبانٍ مكتبية على ضفة نهر ساكن عند الفجر" },
    { en: "Three white ceramic bottles on a white table", ar: "ثلاث قوارير خزفية بيضاء على طاولة بيضاء" },
  ],
  "mosaic-statement-tile": [
    { en: "Speckled ceramic cups, some stacked, on stone", ar: "أكواب خزفية منقّطة، بعضها فوق بعض، على حجر" },
    { en: "A long wooden table under a pendant lamp", ar: "طاولة خشبية طويلة تحت مصباح معلّق" },
    { en: "The shadow of a flowering plant on a pale wall", ar: "ظل نبتة مزهرة على جدار فاتح" },
    { en: "A notebook, a pen and a coffee on a white table", ar: "دفتر وقلم وقهوة على طاولة بيضاء" },
    { en: "An empty white cup on a worn wooden table", ar: "كوب أبيض فارغ على طاولة خشبية قديمة" },
    { en: "A long table in a bright room with a timber ceiling", ar: "طاولة طويلة في غرفة مضيئة بسقف خشبي" },
    { en: "Leaf shadows dappling a wall", ar: "ظلال أوراق الشجر تتراقص على جدار" },
    { en: "A notebook and a coffee cup on a wooden board", ar: "دفتر وكوب قهوة على لوح خشبي" },
    { en: "A cup and teapot on a sunlit windowsill", ar: "كوب وإبريق شاي على حافة نافذة مشمسة" },
    { en: "A yellow-flowering branch against a white wall", ar: "غصن بأزهار صفراء أمام جدار أبيض" },
  ],
  "contact-sheet-wall": [
    { en: "A white wall with a thin stair climbing it", ar: "جدار أبيض يصعد عليه درج رفيع" },
    { en: "Wind ripples in pale sand", ar: "تموّجات الريح في رمل فاتح" },
    { en: "A calm sea at dusk under a gold horizon", ar: "بحر هادئ عند الغسق تحت أفق ذهبي" },
    { en: "Wooden shutters in a wall striped with palm shadows", ar: "مصاريع خشبية في جدار تخطّطه ظلال النخيل" },
    { en: "The curved steel roof of a concert hall", ar: "السقف الفولاذي المنحني لقاعة موسيقية" },
    { en: "Peeling paint on a pale plaster wall", ar: "طلاء متقشّر على جدار جصّي فاتح" },
    { en: "A lone tree in a dry field under a pale sky", ar: "شجرة وحيدة في حقل جاف تحت سماء شاحبة" },
    { en: "A white bottle, a pear and grapes on a dark table", ar: "قارورة بيضاء وإجاصة وعنب على طاولة داكنة" },
    { en: "A white building's corner against the sky", ar: "زاوية مبنى أبيض أمام السماء" },
    { en: "Rippled sand in soft light", ar: "رمل متموّج في ضوء ناعم" },
    { en: "A low island on a grey, still sea", ar: "جزيرة منخفضة في بحر رمادي ساكن" },
    { en: "Dried grasses and flowers on an old dresser", ar: "أعشاب وزهور مجفّفة على خزانة قديمة" },
    { en: "Concrete beams against a pale sky", ar: "عوارض خرسانية أمام سماء شاحبة" },
    { en: "Rough beige paper texture", ar: "ملمس ورق بيج خشن" },
    { en: "A misty lake between mountains", ar: "بحيرة ضبابية بين الجبال" },
    { en: "Palm-leaf shadows on a white wall", ar: "ظلال سعف النخيل على جدار أبيض" },
    { en: "Distant hills beyond a dry plain", ar: "تلال بعيدة خلف سهل جاف" },
    { en: "A calm blue sea meeting a pale horizon", ar: "بحر أزرق هادئ يلتقي بأفق شاحب" },
  ],
  "featured-thumb-rail": [
    { en: "A pale office building with dark windows under cloud", ar: "مبنى مكاتب فاتح بنوافذ داكنة تحت الغيوم" },
    { en: "A container ship berthed at a busy port", ar: "سفينة حاويات راسية في ميناء مزدحم" },
    { en: "A cream jacket and shorts on a rail in a white shop", ar: "سترة وسروال قصير بلون كريمي على علّاقة في متجر أبيض" },
    { en: "A meeting room with glass walls looking onto trees", ar: "غرفة اجتماعات بجدران زجاجية تطلّ على الأشجار" },
  ],
  "album-cards": [
    { en: "Mountains reflected in a still lake", ar: "جبال تنعكس على بحيرة ساكنة" },
    { en: "A trestle table and a stool in a sunlit studio", ar: "طاولة على حاملين ومقعد في استوديو مشمس" },
    { en: "An empty bright office with windows onto trees", ar: "مكتب فارغ مضيء بنوافذ تطلّ على الأشجار" },
  ],
  "timeline-gallery": [
    { en: "A studio desk with an orange chair by a tall window", ar: "مكتب في استوديو مع كرسي برتقالي بجانب نافذة طويلة" },
    { en: "A plant in a brass pot on a white table", ar: "نبتة في أصيص نحاسي على طاولة بيضاء" },
    { en: "Carving chisels on a pale wooden board", ar: "أزاميل نحت على لوح خشبي فاتح" },
    { en: "A mirror and a potted plant on a white desk", ar: "مرآة ونبتة في أصيص على مكتب أبيض" },
    { en: "A wooden stool in a square of sunlight", ar: "مقعد خشبي في مربّع من ضوء الشمس" },
    { en: "A laptop on a long desk by floor-to-ceiling windows", ar: "حاسوب محمول على مكتب طويل بجانب نوافذ ممتدة" },
    { en: "Hand tools laid out on a wooden table", ar: "أدوات يدوية مرتّبة على طاولة خشبية" },
    { en: "A white desk with plants in a bright room", ar: "مكتب أبيض ونباتات في غرفة مضيئة" },
    { en: "A laptop among plants on a wooden desk", ar: "حاسوب محمول بين النباتات على مكتب خشبي" },
    { en: "Potted plants on a round table beside an armchair", ar: "نباتات في أصص على طاولة مستديرة بجانب كرسي" },
    { en: "Hand tools hung on a workshop wall", ar: "أدوات يدوية معلّقة على جدار ورشة" },
    { en: "Plants in a long white planter by a glass wall", ar: "نباتات في حوض أبيض طويل بجانب جدار زجاجي" },
  ],
  "photo-spotlight": [
    { en: "Early sun flooding an empty office through tall windows", ar: "شمس الصباح الباكر تغمر مكتبًا فارغًا عبر نوافذ طويلة" },
  ],
}

/**
 * Where a block's slot order differs from its files: slot i shows file
 * SLOT_ORDER[type][i]. Culture Photo Grid's cards run Offsite in Lisbon,
 * Launch night, Design crit, New studio, Hack week finals, Summer picnic.
 */
const SLOT_ORDER: Record<string, number[]> = {
  "culture-photo-grid": [3, 2, 1, 6, 5, 4],
}

export type GalleryDemoPhoto = { src: string; alt: string }

/** A Gallery Type's demo photos in the block's slot order, alt text in `locale`. */
export function galleryPhotos(type: string, locale: Locale): GalleryDemoPhoto[] {
  const alts = ALTS[type] ?? []
  const order = SLOT_ORDER[type] ?? alts.map((_, index) => index + 1)
  return order.map((file) => ({
    src: `/images/gallery/${type}-${file}.webp`,
    alt: alts[file - 1]?.[locale] ?? "",
  }))
}

/**
 * One Gallery photo by its file, `<type>-<file>.webp`, with its alt text in
 * `locale`: for other blocks' demos that reuse it (About).
 */
export function galleryPhotoFile(type: string, file: number, locale: Locale): GalleryDemoPhoto {
  return { src: `/images/gallery/${type}-${file}.webp`, alt: ALTS[type]?.[file - 1]?.[locale] ?? "" }
}

/** Every Gallery Type that has demo photos, by its name without `gallery-`. */
export const GALLERY_PHOTO_TYPES = Object.keys(ALTS)

/**
 * How each Type takes its photos: a `photos` list in slot order, or one photo
 * on each item of a copy list (a captioned card carries its own photo).
 */
const PHOTO_PROP: Record<string, "photos" | "photo" | { list: string; key: string }> = {
  "culture-photo-grid": { list: "items", key: "image" },
  "masonry-gallery": "photos",
  "photo-bento": "photos",
  "filmstrip-carousel": { list: "items", key: "image" },
  "full-bleed-slider": { list: "slides", key: "image" },
  "filter-tabs-grid": "photos",
  "hover-caption-cards": { list: "items", key: "image" },
  "lightbox-viewer": "photos",
  "horizontal-scroll-rail": { list: "items", key: "image" },
  "editorial-split": "photos",
  "scattered-collage": { list: "items", key: "image" },
  "social-feed-strip": "photos",
  "before-after-compare": "photos",
  "dark-cinema-wall": "photos",
  "hover-index-list": "photos",
  "mosaic-statement-tile": "photos",
  "contact-sheet-wall": "photos",
  "featured-thumb-rail": { list: "items", key: "image" },
  "album-cards": { list: "albums", key: "cover" },
  "video-gallery": { list: "videos", key: "image" },
  "timeline-gallery": "photos",
  "photo-spotlight": "photo",
}

type BlockCopy = Record<Locale, object>

/**
 * The props that put a Type's demo photos into its block: `photos`, or the
 * block's own copy list with a photo added to each item. `copy` is the block's
 * exported copy, needed for the second kind.
 */
export function galleryPhotoProps(type: string, locale: Locale, copy?: BlockCopy): Record<string, unknown> {
  const photos = galleryPhotos(type, locale)
  const prop = PHOTO_PROP[type]
  if (!prop) return {}
  if (prop === "photos") return { photos }
  if (prop === "photo") return { photo: photos[0] }
  const items = ((copy?.[locale] as Record<string, unknown> | undefined)?.[prop.list] as object[] | undefined) ?? []
  return { [prop.list]: items.map((item, index) => ({ ...item, [prop.key]: photos[index] })) }
}
