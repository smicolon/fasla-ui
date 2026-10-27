# Gallery block — photo brief

All Gallery photos come from Unsplash (free licence), are placed in **both** Figma and code, and every photo is different. Never reuse a photo across types. Inside one type, a thumbnail may repeat the big photo it belongs to (Filmstrip, Lightbox, Featured + Thumb Rail).

Figma file: `yGEQmCZOvs7KptsYUdB0Xg`, Gallery component set `42478:479` (22 Types × Desktop/Tablet/Mobile × LTR/RTL).

## Mood rules (non-negotiable)

- Calm, simple, muted colours: beige, white, grey, soft wood, soft natural light. No saturated or neon colours.
- Prefer places, objects, details and hands over groups of people.
- Conservative for any people or team scene: no dancing, no alcohol, no mixed-gender gatherings, no couples. A single person seen from behind or far away is fine.
- No brands or logos (no Apple products, no visible labels), no text in the photo.
- Free photos only (`plus: none`), never Unsplash+.

## Already picked (use these exact photos)

| Type | Slot | Unsplash ID | Photographer |
|---|---|---|---|
| Culture Photo Grid | 1 Design crit | ii_KJyGe2ew | Vitalii Abakumov |
| Culture Photo Grid | 2 Launch night | 9yMSZR-KfVg | Arawark chen |
| Culture Photo Grid | 3 Lisbon trip | IJq0V8tcbqc | João Reguengos |
| Culture Photo Grid | 4 Summer picnic | BzLUmuRDMWE | Evangelina Silina |
| Culture Photo Grid | 5 Innovation week | ETRPjvb0KM0 | Patrick Perkins |
| Culture Photo Grid | 6 New studio | wdlFqI0s_Kg | Szcze hoo |
| Masonry Gallery | 1 | nQBc6clG3X4 | Jakob Owens |
| Masonry Gallery | 2 | zeGT9j4ltRA | Yana Hurska |
| Masonry Gallery | 3 | 0B7ijYKaKcE | Alesia Kazantceva |
| Masonry Gallery | 4 | Uo2W75MB8uU | OMK |
| Masonry Gallery | 5 | X5BWooeO4Cw | Hutomo Abrianto |
| Masonry Gallery | 6 | tSkPbVkiCqY | Tamara Harhai |
| Masonry Gallery | 7 | 9uH-hM0VwPg | Kirill |
| Masonry Gallery | 8 | 85u5oGSBJ1s | Jocelyn Morales |
| Masonry Gallery | 9 | iFVuDQZAxFc | mahmoud azmy |
| Photo Bento | 1 Hero | 5684tm9pat8 | Ryan Ancill |
| Photo Bento | 2 | wwXr6GGUej4 | Theo Bickel |

## Still to pick (search ideas per slot, in slot order)

Slot order = the order of image layers in the Desktop LTR variant. Match each slot's caption.

- **Photo Bento** (3 more, portrait): studio details — "linen curtain window light", "wooden shelf books minimal", "architect drawings table".
- **Filmstrip Carousel** (8, the stage + thumbs are the same 8): "The 2026 collection" — fabric, textile and garment details on hangers, no models: "linen fabric texture", "neutral clothes rack", "folded knitwear".
- **Full-Bleed Slider** (1, very wide): "Light studies from the coast house" — "coastal house window light", calm sea through a window.
- **Filter Tabs + Grid** (8): Atrium refit (atrium interior), Brass table lamp, Studio portraits (single person, back view or hands at work), Launch evening (empty event space, evening), Riverside offices (office by a river), Ceramic series, Founders 2026 (two chairs at a table, or hands on a desk — no faces needed), Summer meet-up (outdoor table, no people).
- **Hover Caption Cards** (3, tall): When we shipped the big one (desk with sketches at night), Offsite October (autumn landscape, cabin), Team dinner in London (set dinner table, no people, no wine).
- **Lightbox Viewer** (8): "Atrium refit" series — 8 different calm atrium / lobby interiors.
- **Horizontal Scroll Rail** (5): Kick-off in the mountains (misty mountains), Dashboards day one (notebook and screen, no brand), The people behind the product (hands working), Riverside offices open (river and building), Hack week (sticky notes / whiteboard, different from Culture Photo Grid).
- **Editorial Split** (4): "Built by people obsessed with the details" — close-up details: hands sketching, material swatches, pencils, paper.
- **Scattered Collage** (7, postcard style): Lisbon (not the Alfama photo above), Tokyo street, Dolomites, Kyoto temple, Lake Bled, vineyard landscape (no wine), coast road.
- **Social Feed Strip** (1 avatar + 6 posts): avatar = an abstract or object (no face); posts = calm square interiors and objects.
- **Video Gallery** (4, wide): Inside the studio (studio wide shot), Dashboards explained (desk with screen, no brand), How we run design crits (sketches on a wall), Summer picnic (picnic set-up, different from Culture Photo Grid).
- **Before / After Compare** (2): the same room before and after. If no real pair exists, use one photo of an unfinished room (bare walls, tools) and one of a finished minimal room with the same framing direction.
- **Dark Cinema Wall** (12, this one is dark): moody low-light stills — night city, dark interiors, shadows, film-like frames. Still muted, not neon.
- **Hover Index List** (1): Atrium refit preview — atrium interior, different from Lightbox and Filter Tabs.
- **Mosaic + Statement Tile** (10 — Tablet and Mobile have one more slot than Desktop): "Life at Fasla — two studios, one long table and a lot of coffee": coffee cups, long wooden table, plants, notebooks, light on walls.
- **Contact Sheet Wall** (18, small): an archive of varied calm frames — architecture, textures, landscapes, objects.
- **Featured + Thumb Rail** (4): Financial services (calm bank / office building), Logistics fleet (trucks or containers, muted), Retail onboarding (calm shop interior), Architecture (three-office workspace interior).
- **Album Cards** (3): Offsite 2026 (landscape), Studio life (studio desk), New offices (empty bright office).
- **Timeline Gallery** (12 = 4 per year: 2026, 2025, 2024): studio life moments, each year a slightly different set; objects and spaces.
- **Photo Spotlight** (1): "Riverside offices, first light" — an empty office at sunrise by the water.

## Files and naming

- Code: `apps/docs/public/images/gallery/<type-slug>-<slot>.webp` (e.g. `photo-bento-1.webp`). Long edge 1600 px for big slots, 800 px for thumbnails, webp quality about 80.
- Credits: `apps/docs/public/images/gallery/CREDITS.md` with file, Unsplash link and photographer for every photo.
- Figma: set the same photo as the fill on that slot in **all six variants** of the type (3 breakpoints × 2 directions). Variants with fewer slots (Filmstrip/Lightbox Mobile = 5, Timeline Tablet = 9) take the first N photos in order; Mosaic Tablet/Mobile take all 10, Desktop the first 9.
