import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { GalleryCulturePhotoGrid, galleryCulturePhotoGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-culture-photo-grid/GalleryCulturePhotoGrid"
import { GalleryMasonryGallery, galleryMasonryGalleryCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-masonry-gallery/GalleryMasonryGallery"
import { GalleryPhotoBento, galleryPhotoBentoCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-photo-bento/GalleryPhotoBento"
import { GalleryFilmstripCarousel, galleryFilmstripCarouselCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-filmstrip-carousel/GalleryFilmstripCarousel"
import { GalleryFullBleedSlider, galleryFullBleedSliderCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-full-bleed-slider/GalleryFullBleedSlider"
import { GalleryFilterTabsGrid, galleryFilterTabsGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-filter-tabs-grid/GalleryFilterTabsGrid"
import { GalleryHoverCaptionCards, galleryHoverCaptionCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-hover-caption-cards/GalleryHoverCaptionCards"
import { GalleryLightboxViewer, galleryLightboxViewerCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-lightbox-viewer/GalleryLightboxViewer"
import { GalleryHorizontalScrollRail, galleryHorizontalScrollRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-horizontal-scroll-rail/GalleryHorizontalScrollRail"
import { GalleryEditorialSplit, galleryEditorialSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-editorial-split/GalleryEditorialSplit"
import { GalleryScatteredCollage, galleryScatteredCollageCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-scattered-collage/GalleryScatteredCollage"
import { GallerySocialFeedStrip, gallerySocialFeedStripCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-social-feed-strip/GallerySocialFeedStrip"
import { GalleryVideoGallery, galleryVideoGalleryCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-video-gallery/GalleryVideoGallery"
import { GalleryBeforeAfterCompare, galleryBeforeAfterCompareCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-before-after-compare/GalleryBeforeAfterCompare"
import { GalleryDarkCinemaWall, galleryDarkCinemaWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-dark-cinema-wall/GalleryDarkCinemaWall"
import { GalleryHoverIndexList, galleryHoverIndexListCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-hover-index-list/GalleryHoverIndexList"
import { GalleryMosaicStatementTile, galleryMosaicStatementTileCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-mosaic-statement-tile/GalleryMosaicStatementTile"
import { GalleryContactSheetWall, galleryContactSheetWallCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-contact-sheet-wall/GalleryContactSheetWall"
import { GalleryFeaturedThumbRail, galleryFeaturedThumbRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-featured-thumb-rail/GalleryFeaturedThumbRail"
import { GalleryAlbumCards, galleryAlbumCardsCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-album-cards/GalleryAlbumCards"
import { GalleryTimelineGallery, galleryTimelineGalleryCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-timeline-gallery/GalleryTimelineGallery"
import { GalleryPhotoSpotlight, galleryPhotoSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/gallery-photo-spotlight/GalleryPhotoSpotlight"
import { emptyPropsOf, galleryArgTypes, galleryViewports, localeOf, photoPropsOf } from "./gallery-story-kit"

/**
 * Gallery: the 22 Types of the Figma set, one block each, from captioned
 * grids and walls to carousels and viewers with their own controls. The
 * photos are the docs site's demo set, described in the toolbar's language.
 * Viewport, direction and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the 22 Figma Types only. Each Type's
 * two extra states, without photos (the `muted` placeholders) and empty
 * (the block's "No photos yet." line), are tagged `!dev` and `!autodocs`:
 * hidden from both, but still built, so tests and visual checks reach them
 * by id. The tags are written out on each story, as the indexer reads them
 * statically.
 */
const meta: Meta = {
  title: "Blocks/Gallery",
  parameters: { layout: "fullscreen", viewport: { viewports: galleryViewports } },
  tags: ["autodocs"],
}

export default meta

export const CulturePhotoGrid: StoryObj<typeof GalleryCulturePhotoGrid> = {
  name: "Culture Photo Grid",
  argTypes: galleryArgTypes(GalleryCulturePhotoGrid, galleryCulturePhotoGridCopy),
  render: (args, context) => <GalleryCulturePhotoGrid locale={localeOf(context)} {...photoPropsOf("culture-photo-grid", context, galleryCulturePhotoGridCopy)} {...args} />,
}

export const CulturePhotoGridWithoutPhotos: StoryObj<typeof GalleryCulturePhotoGrid> = {
  name: "Culture Photo Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryCulturePhotoGrid, galleryCulturePhotoGridCopy),
  render: (args, context) => <GalleryCulturePhotoGrid locale={localeOf(context)} {...args} />,
}

export const CulturePhotoGridEmpty: StoryObj<typeof GalleryCulturePhotoGrid> = {
  name: "Culture Photo Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryCulturePhotoGrid, galleryCulturePhotoGridCopy),
  render: (args, context) => <GalleryCulturePhotoGrid locale={localeOf(context)} {...emptyPropsOf(galleryCulturePhotoGridCopy)} {...args} />,
}

export const MasonryGallery: StoryObj<typeof GalleryMasonryGallery> = {
  name: "Masonry Gallery",
  argTypes: galleryArgTypes(GalleryMasonryGallery, galleryMasonryGalleryCopy),
  args: { onPhotoOpen: fn(), onLoadMore: fn() },
  render: (args, context) => <GalleryMasonryGallery locale={localeOf(context)} {...photoPropsOf("masonry-gallery", context, galleryMasonryGalleryCopy)} {...args} />,
}

export const MasonryGalleryWithoutPhotos: StoryObj<typeof GalleryMasonryGallery> = {
  name: "Masonry Gallery: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryMasonryGallery, galleryMasonryGalleryCopy),
  args: { onPhotoOpen: fn(), onLoadMore: fn() },
  render: (args, context) => <GalleryMasonryGallery locale={localeOf(context)} {...args} />,
}

export const MasonryGalleryEmpty: StoryObj<typeof GalleryMasonryGallery> = {
  name: "Masonry Gallery: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryMasonryGallery, galleryMasonryGalleryCopy),
  args: { onPhotoOpen: fn(), onLoadMore: fn() },
  render: (args, context) => <GalleryMasonryGallery locale={localeOf(context)} {...emptyPropsOf(galleryMasonryGalleryCopy)} {...args} />,
}

export const PhotoBento: StoryObj<typeof GalleryPhotoBento> = {
  name: "Photo Bento",
  argTypes: galleryArgTypes(GalleryPhotoBento, galleryPhotoBentoCopy),
  render: (args, context) => <GalleryPhotoBento locale={localeOf(context)} {...photoPropsOf("photo-bento", context, galleryPhotoBentoCopy)} {...args} />,
}

export const PhotoBentoWithoutPhotos: StoryObj<typeof GalleryPhotoBento> = {
  name: "Photo Bento: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryPhotoBento, galleryPhotoBentoCopy),
  render: (args, context) => <GalleryPhotoBento locale={localeOf(context)} {...args} />,
}

export const PhotoBentoEmpty: StoryObj<typeof GalleryPhotoBento> = {
  name: "Photo Bento: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryPhotoBento, galleryPhotoBentoCopy),
  render: (args, context) => <GalleryPhotoBento locale={localeOf(context)} {...emptyPropsOf(galleryPhotoBentoCopy)} {...args} />,
}

export const FilmstripCarousel: StoryObj<typeof GalleryFilmstripCarousel> = {
  name: "Filmstrip Carousel",
  argTypes: galleryArgTypes(GalleryFilmstripCarousel, galleryFilmstripCarouselCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFilmstripCarousel locale={localeOf(context)} {...photoPropsOf("filmstrip-carousel", context, galleryFilmstripCarouselCopy)} {...args} />,
}

export const FilmstripCarouselWithoutPhotos: StoryObj<typeof GalleryFilmstripCarousel> = {
  name: "Filmstrip Carousel: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFilmstripCarousel, galleryFilmstripCarouselCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFilmstripCarousel locale={localeOf(context)} {...args} />,
}

export const FilmstripCarouselEmpty: StoryObj<typeof GalleryFilmstripCarousel> = {
  name: "Filmstrip Carousel: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFilmstripCarousel, galleryFilmstripCarouselCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFilmstripCarousel locale={localeOf(context)} {...emptyPropsOf(galleryFilmstripCarouselCopy)} {...args} />,
}

export const FullBleedSlider: StoryObj<typeof GalleryFullBleedSlider> = {
  name: "Full-Bleed Slider",
  argTypes: galleryArgTypes(GalleryFullBleedSlider, galleryFullBleedSliderCopy, ["heading", "previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFullBleedSlider locale={localeOf(context)} {...photoPropsOf("full-bleed-slider", context, galleryFullBleedSliderCopy)} {...args} />,
}

export const FullBleedSliderWithoutPhotos: StoryObj<typeof GalleryFullBleedSlider> = {
  name: "Full-Bleed Slider: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFullBleedSlider, galleryFullBleedSliderCopy, ["heading", "previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFullBleedSlider locale={localeOf(context)} {...args} />,
}

export const FullBleedSliderEmpty: StoryObj<typeof GalleryFullBleedSlider> = {
  name: "Full-Bleed Slider: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFullBleedSlider, galleryFullBleedSliderCopy, ["heading", "previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFullBleedSlider locale={localeOf(context)} {...emptyPropsOf(galleryFullBleedSliderCopy)} {...args} />,
}

export const FilterTabsGrid: StoryObj<typeof GalleryFilterTabsGrid> = {
  name: "Filter Tabs + Grid",
  argTypes: galleryArgTypes(GalleryFilterTabsGrid, galleryFilterTabsGridCopy),
  render: (args, context) => <GalleryFilterTabsGrid locale={localeOf(context)} {...photoPropsOf("filter-tabs-grid", context, galleryFilterTabsGridCopy)} {...args} />,
}

export const FilterTabsGridWithoutPhotos: StoryObj<typeof GalleryFilterTabsGrid> = {
  name: "Filter Tabs + Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFilterTabsGrid, galleryFilterTabsGridCopy),
  render: (args, context) => <GalleryFilterTabsGrid locale={localeOf(context)} {...args} />,
}

export const FilterTabsGridEmpty: StoryObj<typeof GalleryFilterTabsGrid> = {
  name: "Filter Tabs + Grid: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFilterTabsGrid, galleryFilterTabsGridCopy),
  render: (args, context) => <GalleryFilterTabsGrid locale={localeOf(context)} {...emptyPropsOf(galleryFilterTabsGridCopy)} {...args} />,
}

export const HoverCaptionCards: StoryObj<typeof GalleryHoverCaptionCards> = {
  name: "Hover Caption Cards",
  argTypes: galleryArgTypes(GalleryHoverCaptionCards, galleryHoverCaptionCardsCopy, ["openLabel"]),
  args: { onOpen: fn() },
  render: (args, context) => <GalleryHoverCaptionCards locale={localeOf(context)} {...photoPropsOf("hover-caption-cards", context, galleryHoverCaptionCardsCopy)} {...args} />,
}

export const HoverCaptionCardsWithoutPhotos: StoryObj<typeof GalleryHoverCaptionCards> = {
  name: "Hover Caption Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHoverCaptionCards, galleryHoverCaptionCardsCopy, ["openLabel"]),
  args: { onOpen: fn() },
  render: (args, context) => <GalleryHoverCaptionCards locale={localeOf(context)} {...args} />,
}

export const HoverCaptionCardsEmpty: StoryObj<typeof GalleryHoverCaptionCards> = {
  name: "Hover Caption Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHoverCaptionCards, galleryHoverCaptionCardsCopy, ["openLabel"]),
  args: { onOpen: fn() },
  render: (args, context) => <GalleryHoverCaptionCards locale={localeOf(context)} {...emptyPropsOf(galleryHoverCaptionCardsCopy)} {...args} />,
}

export const LightboxViewer: StoryObj<typeof GalleryLightboxViewer> = {
  name: "Lightbox Viewer",
  argTypes: galleryArgTypes(GalleryLightboxViewer, galleryLightboxViewerCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryLightboxViewer locale={localeOf(context)} {...photoPropsOf("lightbox-viewer", context, galleryLightboxViewerCopy)} {...args} />,
}

export const LightboxViewerWithoutPhotos: StoryObj<typeof GalleryLightboxViewer> = {
  name: "Lightbox Viewer: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryLightboxViewer, galleryLightboxViewerCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryLightboxViewer locale={localeOf(context)} {...args} />,
}

export const LightboxViewerEmpty: StoryObj<typeof GalleryLightboxViewer> = {
  name: "Lightbox Viewer: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryLightboxViewer, galleryLightboxViewerCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryLightboxViewer locale={localeOf(context)} {...emptyPropsOf(galleryLightboxViewerCopy)} {...args} />,
}

export const HorizontalScrollRail: StoryObj<typeof GalleryHorizontalScrollRail> = {
  name: "Horizontal Scroll Rail",
  argTypes: galleryArgTypes(GalleryHorizontalScrollRail, galleryHorizontalScrollRailCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryHorizontalScrollRail locale={localeOf(context)} {...photoPropsOf("horizontal-scroll-rail", context, galleryHorizontalScrollRailCopy)} {...args} />,
}

export const HorizontalScrollRailWithoutPhotos: StoryObj<typeof GalleryHorizontalScrollRail> = {
  name: "Horizontal Scroll Rail: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHorizontalScrollRail, galleryHorizontalScrollRailCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryHorizontalScrollRail locale={localeOf(context)} {...args} />,
}

export const HorizontalScrollRailEmpty: StoryObj<typeof GalleryHorizontalScrollRail> = {
  name: "Horizontal Scroll Rail: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHorizontalScrollRail, galleryHorizontalScrollRailCopy, ["previousLabel", "nextLabel"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryHorizontalScrollRail locale={localeOf(context)} {...emptyPropsOf(galleryHorizontalScrollRailCopy)} {...args} />,
}

export const EditorialSplit: StoryObj<typeof GalleryEditorialSplit> = {
  name: "Editorial Split",
  argTypes: galleryArgTypes(GalleryEditorialSplit, galleryEditorialSplitCopy),
  render: (args, context) => <GalleryEditorialSplit locale={localeOf(context)} {...photoPropsOf("editorial-split", context, galleryEditorialSplitCopy)} {...args} />,
}

export const EditorialSplitWithoutPhotos: StoryObj<typeof GalleryEditorialSplit> = {
  name: "Editorial Split: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryEditorialSplit, galleryEditorialSplitCopy),
  render: (args, context) => <GalleryEditorialSplit locale={localeOf(context)} {...args} />,
}

export const EditorialSplitEmpty: StoryObj<typeof GalleryEditorialSplit> = {
  name: "Editorial Split: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryEditorialSplit, galleryEditorialSplitCopy),
  render: (args, context) => <GalleryEditorialSplit locale={localeOf(context)} {...emptyPropsOf(galleryEditorialSplitCopy)} {...args} />,
}

export const ScatteredCollage: StoryObj<typeof GalleryScatteredCollage> = {
  name: "Scattered Collage",
  argTypes: galleryArgTypes(GalleryScatteredCollage, galleryScatteredCollageCopy),
  render: (args, context) => <GalleryScatteredCollage locale={localeOf(context)} {...photoPropsOf("scattered-collage", context, galleryScatteredCollageCopy)} {...args} />,
}

export const ScatteredCollageWithoutPhotos: StoryObj<typeof GalleryScatteredCollage> = {
  name: "Scattered Collage: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryScatteredCollage, galleryScatteredCollageCopy),
  render: (args, context) => <GalleryScatteredCollage locale={localeOf(context)} {...args} />,
}

export const ScatteredCollageEmpty: StoryObj<typeof GalleryScatteredCollage> = {
  name: "Scattered Collage: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryScatteredCollage, galleryScatteredCollageCopy),
  render: (args, context) => <GalleryScatteredCollage locale={localeOf(context)} {...emptyPropsOf(galleryScatteredCollageCopy)} {...args} />,
}

export const SocialFeedStrip: StoryObj<typeof GallerySocialFeedStrip> = {
  name: "Social Feed Strip",
  argTypes: galleryArgTypes(GallerySocialFeedStrip, gallerySocialFeedStripCopy, ["platform", "likesLabel", "commentsLabel"]),
  render: (args, context) => <GallerySocialFeedStrip locale={localeOf(context)} {...photoPropsOf("social-feed-strip", context, gallerySocialFeedStripCopy)} {...args} />,
}

export const SocialFeedStripWithoutPhotos: StoryObj<typeof GallerySocialFeedStrip> = {
  name: "Social Feed Strip: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GallerySocialFeedStrip, gallerySocialFeedStripCopy, ["platform", "likesLabel", "commentsLabel"]),
  render: (args, context) => <GallerySocialFeedStrip locale={localeOf(context)} {...args} />,
}

export const SocialFeedStripEmpty: StoryObj<typeof GallerySocialFeedStrip> = {
  name: "Social Feed Strip: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GallerySocialFeedStrip, gallerySocialFeedStripCopy, ["platform", "likesLabel", "commentsLabel"]),
  render: (args, context) => <GallerySocialFeedStrip locale={localeOf(context)} {...emptyPropsOf(gallerySocialFeedStripCopy)} {...args} />,
}

export const VideoGallery: StoryObj<typeof GalleryVideoGallery> = {
  name: "Video Gallery",
  argTypes: galleryArgTypes(GalleryVideoGallery, galleryVideoGalleryCopy, ["playLabel", "fullscreenLabel"]),
  args: { onPlayVideo: fn() },
  render: (args, context) => <GalleryVideoGallery locale={localeOf(context)} {...photoPropsOf("video-gallery", context, galleryVideoGalleryCopy)} {...args} />,
}

export const VideoGalleryWithoutPhotos: StoryObj<typeof GalleryVideoGallery> = {
  name: "Video Gallery: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryVideoGallery, galleryVideoGalleryCopy, ["playLabel", "fullscreenLabel"]),
  args: { onPlayVideo: fn() },
  render: (args, context) => <GalleryVideoGallery locale={localeOf(context)} {...args} />,
}

export const VideoGalleryEmpty: StoryObj<typeof GalleryVideoGallery> = {
  name: "Video Gallery: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryVideoGallery, galleryVideoGalleryCopy, ["playLabel", "fullscreenLabel"]),
  args: { onPlayVideo: fn() },
  render: (args, context) => <GalleryVideoGallery locale={localeOf(context)} {...emptyPropsOf(galleryVideoGalleryCopy)} {...args} />,
}

export const BeforeAfterCompare: StoryObj<typeof GalleryBeforeAfterCompare> = {
  name: "Before / After Compare",
  argTypes: galleryArgTypes(GalleryBeforeAfterCompare, galleryBeforeAfterCompareCopy, ["sliderLabel", "position"]),
  args: { onPositionChange: fn() },
  render: (args, context) => <GalleryBeforeAfterCompare locale={localeOf(context)} {...photoPropsOf("before-after-compare", context, galleryBeforeAfterCompareCopy)} {...args} />,
}

export const BeforeAfterCompareWithoutPhotos: StoryObj<typeof GalleryBeforeAfterCompare> = {
  name: "Before / After Compare: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryBeforeAfterCompare, galleryBeforeAfterCompareCopy, ["sliderLabel", "position"]),
  args: { onPositionChange: fn() },
  render: (args, context) => <GalleryBeforeAfterCompare locale={localeOf(context)} {...args} />,
}

export const BeforeAfterCompareEmpty: StoryObj<typeof GalleryBeforeAfterCompare> = {
  name: "Before / After Compare: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryBeforeAfterCompare, galleryBeforeAfterCompareCopy, ["sliderLabel", "position"]),
  args: { onPositionChange: fn() },
  render: (args, context) => <GalleryBeforeAfterCompare locale={localeOf(context)} {...emptyPropsOf(galleryBeforeAfterCompareCopy)} {...args} />,
}

export const DarkCinemaWall: StoryObj<typeof GalleryDarkCinemaWall> = {
  name: "Dark Cinema Wall",
  argTypes: galleryArgTypes(GalleryDarkCinemaWall, galleryDarkCinemaWallCopy),
  render: (args, context) => <GalleryDarkCinemaWall locale={localeOf(context)} {...photoPropsOf("dark-cinema-wall", context, galleryDarkCinemaWallCopy)} {...args} />,
}

export const DarkCinemaWallWithoutPhotos: StoryObj<typeof GalleryDarkCinemaWall> = {
  name: "Dark Cinema Wall: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryDarkCinemaWall, galleryDarkCinemaWallCopy),
  render: (args, context) => <GalleryDarkCinemaWall locale={localeOf(context)} {...args} />,
}

export const DarkCinemaWallEmpty: StoryObj<typeof GalleryDarkCinemaWall> = {
  name: "Dark Cinema Wall: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryDarkCinemaWall, galleryDarkCinemaWallCopy),
  render: (args, context) => <GalleryDarkCinemaWall locale={localeOf(context)} {...emptyPropsOf(galleryDarkCinemaWallCopy)} {...args} />,
}

export const HoverIndexList: StoryObj<typeof GalleryHoverIndexList> = {
  name: "Hover Index List",
  argTypes: galleryArgTypes(GalleryHoverIndexList, galleryHoverIndexListCopy),
  render: (args, context) => <GalleryHoverIndexList locale={localeOf(context)} {...photoPropsOf("hover-index-list", context, galleryHoverIndexListCopy)} {...args} />,
}

export const HoverIndexListWithoutPhotos: StoryObj<typeof GalleryHoverIndexList> = {
  name: "Hover Index List: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHoverIndexList, galleryHoverIndexListCopy),
  render: (args, context) => <GalleryHoverIndexList locale={localeOf(context)} {...args} />,
}

export const HoverIndexListEmpty: StoryObj<typeof GalleryHoverIndexList> = {
  name: "Hover Index List: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryHoverIndexList, galleryHoverIndexListCopy),
  render: (args, context) => <GalleryHoverIndexList locale={localeOf(context)} {...emptyPropsOf(galleryHoverIndexListCopy)} {...args} />,
}

export const MosaicStatementTile: StoryObj<typeof GalleryMosaicStatementTile> = {
  name: "Mosaic + Statement Tile",
  argTypes: galleryArgTypes(GalleryMosaicStatementTile, galleryMosaicStatementTileCopy),
  render: (args, context) => <GalleryMosaicStatementTile locale={localeOf(context)} {...photoPropsOf("mosaic-statement-tile", context, galleryMosaicStatementTileCopy)} {...args} />,
}

export const MosaicStatementTileWithoutPhotos: StoryObj<typeof GalleryMosaicStatementTile> = {
  name: "Mosaic + Statement Tile: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryMosaicStatementTile, galleryMosaicStatementTileCopy),
  render: (args, context) => <GalleryMosaicStatementTile locale={localeOf(context)} {...args} />,
}

export const MosaicStatementTileEmpty: StoryObj<typeof GalleryMosaicStatementTile> = {
  name: "Mosaic + Statement Tile: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryMosaicStatementTile, galleryMosaicStatementTileCopy),
  render: (args, context) => <GalleryMosaicStatementTile locale={localeOf(context)} {...emptyPropsOf(galleryMosaicStatementTileCopy)} {...args} />,
}

export const ContactSheetWall: StoryObj<typeof GalleryContactSheetWall> = {
  name: "Contact Sheet Wall",
  argTypes: galleryArgTypes(GalleryContactSheetWall, galleryContactSheetWallCopy),
  args: { onLoadMore: fn() },
  render: (args, context) => <GalleryContactSheetWall locale={localeOf(context)} {...photoPropsOf("contact-sheet-wall", context, galleryContactSheetWallCopy)} {...args} />,
}

export const ContactSheetWallWithoutPhotos: StoryObj<typeof GalleryContactSheetWall> = {
  name: "Contact Sheet Wall: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryContactSheetWall, galleryContactSheetWallCopy),
  args: { onLoadMore: fn() },
  render: (args, context) => <GalleryContactSheetWall locale={localeOf(context)} {...args} />,
}

export const ContactSheetWallEmpty: StoryObj<typeof GalleryContactSheetWall> = {
  name: "Contact Sheet Wall: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryContactSheetWall, galleryContactSheetWallCopy),
  args: { onLoadMore: fn() },
  render: (args, context) => <GalleryContactSheetWall locale={localeOf(context)} {...emptyPropsOf(galleryContactSheetWallCopy)} {...args} />,
}

export const FeaturedThumbRail: StoryObj<typeof GalleryFeaturedThumbRail> = {
  name: "Featured + Thumb Rail",
  argTypes: galleryArgTypes(GalleryFeaturedThumbRail, galleryFeaturedThumbRailCopy, ["previousLabel", "nextLabel", "activeIndex"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFeaturedThumbRail locale={localeOf(context)} {...photoPropsOf("featured-thumb-rail", context, galleryFeaturedThumbRailCopy)} {...args} />,
}

export const FeaturedThumbRailWithoutPhotos: StoryObj<typeof GalleryFeaturedThumbRail> = {
  name: "Featured + Thumb Rail: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFeaturedThumbRail, galleryFeaturedThumbRailCopy, ["previousLabel", "nextLabel", "activeIndex"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFeaturedThumbRail locale={localeOf(context)} {...args} />,
}

export const FeaturedThumbRailEmpty: StoryObj<typeof GalleryFeaturedThumbRail> = {
  name: "Featured + Thumb Rail: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryFeaturedThumbRail, galleryFeaturedThumbRailCopy, ["previousLabel", "nextLabel", "activeIndex"]),
  args: { onActiveIndexChange: fn() },
  render: (args, context) => <GalleryFeaturedThumbRail locale={localeOf(context)} {...emptyPropsOf(galleryFeaturedThumbRailCopy)} {...args} />,
}

export const AlbumCards: StoryObj<typeof GalleryAlbumCards> = {
  name: "Album Cards",
  argTypes: galleryArgTypes(GalleryAlbumCards, galleryAlbumCardsCopy),
  render: (args, context) => <GalleryAlbumCards locale={localeOf(context)} {...photoPropsOf("album-cards", context, galleryAlbumCardsCopy)} {...args} />,
}

export const AlbumCardsWithoutPhotos: StoryObj<typeof GalleryAlbumCards> = {
  name: "Album Cards: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryAlbumCards, galleryAlbumCardsCopy),
  render: (args, context) => <GalleryAlbumCards locale={localeOf(context)} {...args} />,
}

export const AlbumCardsEmpty: StoryObj<typeof GalleryAlbumCards> = {
  name: "Album Cards: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryAlbumCards, galleryAlbumCardsCopy),
  render: (args, context) => <GalleryAlbumCards locale={localeOf(context)} {...emptyPropsOf(galleryAlbumCardsCopy)} {...args} />,
}

export const TimelineGallery: StoryObj<typeof GalleryTimelineGallery> = {
  name: "Timeline Gallery",
  argTypes: galleryArgTypes(GalleryTimelineGallery, galleryTimelineGalleryCopy),
  render: (args, context) => <GalleryTimelineGallery locale={localeOf(context)} {...photoPropsOf("timeline-gallery", context, galleryTimelineGalleryCopy)} {...args} />,
}

export const TimelineGalleryWithoutPhotos: StoryObj<typeof GalleryTimelineGallery> = {
  name: "Timeline Gallery: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryTimelineGallery, galleryTimelineGalleryCopy),
  render: (args, context) => <GalleryTimelineGallery locale={localeOf(context)} {...args} />,
}

export const TimelineGalleryEmpty: StoryObj<typeof GalleryTimelineGallery> = {
  name: "Timeline Gallery: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryTimelineGallery, galleryTimelineGalleryCopy),
  render: (args, context) => <GalleryTimelineGallery locale={localeOf(context)} {...emptyPropsOf(galleryTimelineGalleryCopy)} {...args} />,
}

export const PhotoSpotlight: StoryObj<typeof GalleryPhotoSpotlight> = {
  name: "Photo Spotlight",
  argTypes: galleryArgTypes(GalleryPhotoSpotlight, galleryPhotoSpotlightCopy, ["expandLabel"]),
  args: { onExpand: fn() },
  render: (args, context) => <GalleryPhotoSpotlight locale={localeOf(context)} {...photoPropsOf("photo-spotlight", context, galleryPhotoSpotlightCopy)} {...args} />,
}

export const PhotoSpotlightWithoutPhotos: StoryObj<typeof GalleryPhotoSpotlight> = {
  name: "Photo Spotlight: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryPhotoSpotlight, galleryPhotoSpotlightCopy, ["expandLabel"]),
  args: { onExpand: fn() },
  render: (args, context) => <GalleryPhotoSpotlight locale={localeOf(context)} {...args} />,
}

export const PhotoSpotlightEmpty: StoryObj<typeof GalleryPhotoSpotlight> = {
  name: "Photo Spotlight: Empty",
  tags: ["!dev", "!autodocs"],
  argTypes: galleryArgTypes(GalleryPhotoSpotlight, galleryPhotoSpotlightCopy, ["expandLabel"]),
  args: { onExpand: fn() },
  render: (args, context) => <GalleryPhotoSpotlight locale={localeOf(context)} {...emptyPropsOf(galleryPhotoSpotlightCopy)} {...args} />,
}
