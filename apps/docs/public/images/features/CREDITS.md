# Features demo photos

The photos in the Features block's docs previews and Storybook stories are exactly the photos Figma's
Features set (`42367:57765`) shows, slot for slot. Every Figma photo was exported at its original size
and compared with the file in the repo; each one is the same image.

- **23 are in this folder.** Each was found on [Unsplash](https://unsplash.com/?utm_source=fasla-ui&utm_medium=referral)
  by image search, and matched to Figma's original by pixel comparison. All are free photos under the
  [Unsplash License](https://unsplash.com/license); none is Unsplash+. They are the Figma originals, WebP at quality 80,
  1600px on the long side at most, never upscaled.
- **15 are files already committed** for the Hero, Blog Cards and About blocks, credited in their own folders. Two of
  them are the 32px avatars.
- **Figma's image hash** is the SHA-1 of the original image's bytes. The tables give the first ten characters of
  it for every photo, so a slot can be checked against Figma.
- Three photos in Figma's Tablet and Mobile variants of Notched Photo Columns carry different hashes from the Desktop
  ones (`dc3e4ad1e3` and `082bc234f6`) but are the same images as `6f8ee760f6` and `19ada339b8`, uploaded again.
- A photo that appears in more than one Type is repeated across Types, as in Figma, never inside one.
- Figma draws no photo for the Photo Carousel's slides 2 to 4 or the Photo Tabs Panel's tabs 2 to 4, so the code has
  none: they show the empty slot.

## Photos in this folder

| File | Figma image hash | Types and slots | Photo | Photographer | Size (px) | Notes |
|---|---|---|---|---|---|---|
| `boardroom-with-long-table.webp` | `d4993d2920` | Full-Bleed Photo Banner | [eHD8Y1Znfpk](https://unsplash.com/photos/eHD8Y1Znfpk?utm_source=fasla-ui&utm_medium=referral) | [Nastuh Abootalebi](https://unsplash.com/@sunday_digital?utm_source=fasla-ui&utm_medium=referral) | 1400×935 |  |
| `collaborative-meeting-seated.webp` | `ebe87f0a2e` | Photo Collage 1 | [5U_28ojjgms](https://unsplash.com/photos/5U_28ojjgms?utm_source=fasla-ui&utm_medium=referral) | [Redd Francisco](https://unsplash.com/@reddfrancisco?utm_source=fasla-ui&utm_medium=referral) | 1400×788 |  |
| `collaborative-meeting-table.webp` | `b760edd120` | Accordion + Photo | [PTRzqc_h1r4](https://unsplash.com/photos/PTRzqc_h1r4?utm_source=fasla-ui&utm_medium=referral) | [Redd Francisco](https://unsplash.com/@reddfrancisco?utm_source=fasla-ui&utm_medium=referral) | 1400×788 |  |
| `colleagues-at-whiteboard.webp` | `f1a2ed42c3` | Feature List + Thumbnails 3; Numbered Steps + Floating Cards 1 | [uOhBxB23Wao](https://unsplash.com/photos/uOhBxB23Wao?utm_source=fasla-ui&utm_medium=referral) | [ThisisEngineering](https://unsplash.com/@thisisengineering?utm_source=fasla-ui&utm_medium=referral) | 1400×934 | The photographer asks to be credited with "© This is Engineering". |
| `coworkers-laptop-design-review.webp` | `b210336509` | Split Photo + Icon List | [Of_m3hMsoAA](https://unsplash.com/photos/Of_m3hMsoAA?utm_source=fasla-ui&utm_medium=referral) | [Jud Mackrill](https://unsplash.com/@judmackrill?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `hands-on-laptop-analytics.webp` | `2f7f81487b` | Photo Bento 2 | [pypeCEaJeZY](https://unsplash.com/photos/pypeCEaJeZY?utm_source=fasla-ui&utm_medium=referral) | [Campaign Creators](https://unsplash.com/@campaign_creators?utm_source=fasla-ui&utm_medium=referral) | 1400×1013 | The photographer asks for a backlink to campaigncreators.com. |
| `laptop-analytics-report.webp` | `60f4f372ce` | Feature List + Thumbnails 1 | [eveI7MOcSmw](https://unsplash.com/photos/eveI7MOcSmw?utm_source=fasla-ui&utm_medium=referral) | [Myriam Jessier](https://unsplash.com/@mjessier?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `laptop-line-graph.webp` | `058f2f95b1` | Feature List + Thumbnails 2 | [dBI_My696Rk](https://unsplash.com/photos/dBI_My696Rk?utm_source=fasla-ui&utm_medium=referral) | [Chris Liverani](https://unsplash.com/@chrisliverani?utm_source=fasla-ui&utm_medium=referral) | 1400×1050 |  |
| `laptop-statistics-on-glass-table.webp` | `3324367173` | Photo Tabs Panel | [hpjSkU2UYSU](https://unsplash.com/photos/hpjSkU2UYSU?utm_source=fasla-ui&utm_medium=referral) | [Carlos Muza](https://unsplash.com/@kmuza?utm_source=fasla-ui&utm_medium=referral) | 1400×997 | Uploaded before Unsplash's licence change in June 2017, so it is also CC0. |
| `macbook-beside-mouse.webp` | `19ada339b8` | Notched Photo Columns 2 | [9l_326FISzk](https://unsplash.com/photos/9l_326FISzk?utm_source=fasla-ui&utm_medium=referral) | [Luca Bravo](https://unsplash.com/@lucabravo?utm_source=fasla-ui&utm_medium=referral) | 1600×1066 |  |
| `men-around-office-tables.webp` | `a66b04d19e` | Photo Carousel | [mpN7xjKQ_Ns](https://unsplash.com/photos/mpN7xjKQ_Ns?utm_source=fasla-ui&utm_medium=referral) | [Austin Distel](https://unsplash.com/@austindistel?utm_source=fasla-ui&utm_medium=referral) | 1400×1050 |  |
| `office-hallway-glass-walls.webp` | `8a870949b2` | Photo Collage 7; Showcase Card Pair 2 | [jjhvyxm34nY](https://unsplash.com/photos/jjhvyxm34nY?utm_source=fasla-ui&utm_medium=referral) | [Mia Baker](https://unsplash.com/@miabaker?utm_source=fasla-ui&utm_medium=referral) | 1067×1600 |  |
| `pastel-folders-stack.webp` | `e8c04e800a` | Notched Photo Columns 1 | [X-dHJLZGRpo](https://unsplash.com/photos/X-dHJLZGRpo?utm_source=fasla-ui&utm_medium=referral) | [Agnivesh Jayadeep](https://unsplash.com/@agniveshaj?utm_source=fasla-ui&utm_medium=referral) | 1280×1600 |  |
| `person-working-on-wooden-desk.webp` | `6f8ee760f6` | Notched Photo Columns 3 | [pEVjp7yIc2A](https://unsplash.com/photos/pEVjp7yIc2A?utm_source=fasla-ui&utm_medium=referral) | [Microsoft Copilot](https://unsplash.com/@microsoftcopilot?utm_source=fasla-ui&utm_medium=referral) | 1067×1600 | Posted by Unsplash's Microsoft Copilot account; Unsplash does not say whether it is a photograph or generated. |
| `pink-chairs-in-workspace.webp` | `e2a227f7d2` | Editorial Photo Split; Perforated Photo Strip 7 | [Gdufctyvzjo](https://unsplash.com/photos/Gdufctyvzjo?utm_source=fasla-ui&utm_medium=referral) | [Jean-Philippe Delberghe](https://unsplash.com/@jipy32?utm_source=fasla-ui&utm_medium=referral) | 1067×1600 |  |
| `presenter-laptops-room.webp` | `f58c04a3a4` | Photo Collage 4 | [gMsnXqILjp4](https://unsplash.com/photos/gMsnXqILjp4?utm_source=fasla-ui&utm_medium=referral) | [Campaign Creators](https://unsplash.com/@campaign_creators?utm_source=fasla-ui&utm_medium=referral) | 1400×933 | The photographer asks for a backlink to campaigncreators.com. |
| `startup-team-around-laptops.webp` | `20745d89a3` | Photo Collage 3 | [rtD_lcsN6_U](https://unsplash.com/photos/rtD_lcsN6_U?utm_source=fasla-ui&utm_medium=referral) | [Lyubomyr Reverchuk](https://unsplash.com/@lreverchuk?utm_source=fasla-ui&utm_medium=referral) | 1400×933 | The photographer asks for a credit link to echoglobal.tech. |
| `stock-chart-on-laptop.webp` | `d5ebd5e240` | Media Rail 2 | [IrRbSND5EUc](https://unsplash.com/photos/IrRbSND5EUc?utm_source=fasla-ui&utm_medium=referral) | [Markus Winkler](https://unsplash.com/@markuswinkler?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `team-around-meeting-table.webp` | `f1ed44c42f` | Media Rail 1 | [2pPw5Glro5I](https://unsplash.com/photos/2pPw5Glro5I?utm_source=fasla-ui&utm_medium=referral) | [Memento Media](https://unsplash.com/@heymemento?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `team-whiteboard-meeting.webp` | `dcd47011c3` | Photo Bento 1 | [wD1LRb9OeEo](https://unsplash.com/photos/wD1LRb9OeEo?utm_source=fasla-ui&utm_medium=referral) | [Austin Distel](https://unsplash.com/@austindistel?utm_source=fasla-ui&utm_medium=referral) | 1400×1050 |  |
| `three-men-laughing-at-laptop.webp` | `2b8e590251` | Photo + Feature Chips; Photo Collage 2 | [XkKCui44iM0](https://unsplash.com/photos/XkKCui44iM0?utm_source=fasla-ui&utm_medium=referral) | [Priscilla Du Preez](https://unsplash.com/@priscilladupreez?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `two-men-at-computer.webp` | `89aeef9417` | Feature List + Thumbnails 4; Photo Collage 5 | [l90zRbWvCoE](https://unsplash.com/photos/l90zRbWvCoE?utm_source=fasla-ui&utm_medium=referral) | [Proxyclick Visitor Management System](https://unsplash.com/@proxyclick?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |
| `whiteboard-discussion.webp` | `ea90c4beb1` | Photo Collage 6 | [R3jJvOSzjrk](https://unsplash.com/photos/R3jJvOSzjrk?utm_source=fasla-ui&utm_medium=referral) | [Jud Mackrill](https://unsplash.com/@judmackrill?utm_source=fasla-ui&utm_medium=referral) | 1400×933 |  |

## Committed photos Figma uses too

| File (under `public/images/`) | Figma image hash | Types and slots |
|---|---|---|
| `blog-cards/photo-06.webp` | `e5b947cae6` | Perforated Photo Strip 1 |
| `hero/ceramic-mug-still-life.webp` | `edcfa3b338` | Perforated Photo Strip 2 |
| `hero/brick-modular-housing.webp` | `3bf2bc485f` | Perforated Photo Strip 3 |
| `blog-cards/photo-15.webp` | `8e801994a5` | Perforated Photo Strip 4 |
| `hero/balanced-sculpture.webp` | `904c727ac7` | Perforated Photo Strip 5 |
| `hero/living-room-gallery-wall.webp` | `00dadcb294` | Perforated Photo Strip 6 |
| `blog-cards/photo-09.webp` | `ae2e0312d8` | Perforated Photo Strip 8 |
| `blog-cards/photo-16.webp` | `9b3b3f9e0e` | Perforated Photo Strip 9; Portrait Photo Cards + Link Row 2 |
| `about/statement-band-2.webp` | `ee1a467f91` | Media Rail 4; Perforated Photo Strip 10; Showcase Card Pair 1 |
| `hero/laptop-code-desk.webp` | `95357103e6` | Media Rail 3 |
| `blog-cards/photo-13.webp` | `722962652d` | Portrait Photo Cards + Link Row 1 |
| `blog-cards/photo-14.webp` | `1cbf92419c` | Portrait Photo Cards + Link Row 3 |
| `blog-cards/photo-04.webp` | `05bffbeedc` | Portrait Photo Cards + Link Row 4 |
| `hero/businesswoman-window-portrait.webp` | `c92a186086` | Numbered Steps + Floating Cards 2 |
| `hero/woman-white-collar-portrait.webp` | `e2eca63adc` | Icon-Titled Preview Rail |
