import type { Meta, StoryObj } from "@storybook/react"
import { HeroEditorialArch, heroEditorialArchCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-editorial-arch/HeroEditorialArch"
import { HeroPhotoConstellation, heroPhotoConstellationCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-photo-constellation/HeroPhotoConstellation"
import { HeroArcGallery, heroArcGalleryCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-arc-gallery/HeroArcGallery"
import { HeroInlineImageHeadline, heroInlineImageHeadlineCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-inline-image-headline/HeroInlineImageHeadline"
import { HeroBentoSplit, heroBentoSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-bento-split/HeroBentoSplit"
import { HeroFramedFullBleed, heroFramedFullBleedCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-framed-full-bleed/HeroFramedFullBleed"
import { HeroAnnotatedObject, heroAnnotatedObjectCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-annotated-object/HeroAnnotatedObject"
import { HeroEditorialTriptych, heroEditorialTriptychCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-editorial-triptych/HeroEditorialTriptych"
import { HeroColourStage, heroColourStageCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-colour-stage/HeroColourStage"
import { HeroTwinPanels, heroTwinPanelsCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-twin-panels/HeroTwinPanels"
import { HeroSplitBandHeadline, heroSplitBandHeadlineCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-split-band-headline/HeroSplitBandHeadline"
import { HeroTexturedDark, heroTexturedDarkCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-textured-dark/HeroTexturedDark"
import { HeroComponentPattern, heroComponentPatternCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-component-pattern/HeroComponentPattern"
import { HeroCurvedMediaRail, heroCurvedMediaRailCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-curved-media-rail/HeroCurvedMediaRail"
import { HeroFramedStudioCard, heroFramedStudioCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-framed-studio-card/HeroFramedStudioCard"
import { HeroOrbitTrack, heroOrbitTrackCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-orbit-track/HeroOrbitTrack"
import { HeroFloatingIntegrations, heroFloatingIntegrationsCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-floating-integrations/HeroFloatingIntegrations"
import { HeroShapeGrid, heroShapeGridCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-shape-grid/HeroShapeGrid"
import { HeroWaveBand, heroWaveBandCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-wave-band/HeroWaveBand"
import { HeroStudioMosaic, heroStudioMosaicCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-studio-mosaic/HeroStudioMosaic"
import { HeroIllustrationSplit, heroIllustrationSplitCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-illustration-split/HeroIllustrationSplit"
import { HeroMaskedTypeReveal, heroMaskedTypeRevealCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-masked-type-reveal/HeroMaskedTypeReveal"
import { HeroVelocityMarquee, heroVelocityMarqueeCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-velocity-marquee/HeroVelocityMarquee"
import { HeroDuoCard, heroDuoCardCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-duo-card/HeroDuoCard"
import { HeroVideoSpotlight, heroVideoSpotlightCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-video-spotlight/HeroVideoSpotlight"
import { HeroBrandColorBlock, heroBrandColorBlockCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-brand-color-block/HeroBrandColorBlock"
import { HeroScrambleDecode, heroScrambleDecodeCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-scramble-decode/HeroScrambleDecode"
import { HeroSplitFlapCounters, heroSplitFlapCountersCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-split-flap-counters/HeroSplitFlapCounters"
import { HeroVideoInType, heroVideoInTypeCopy } from "../../../../../packages/fasla-ui/registry/blocks/hero-video-in-type/HeroVideoInType"
import { heroArgTypes, heroViewports, localeOf, photoPropsOf } from "./hero-story-kit"

/**
 * Hero: the Types of the Figma set, one block each. The photos are the docs
 * site's demo set, described in the toolbar's language. Viewport, direction
 * and theme come from the toolbar.
 */

/*
 * The sidebar and the Docs page list the Figma Types only. Each Type's
 * without-photos state (its placeholders) is tagged `!dev` and `!autodocs`:
 * hidden from both, but still built, so tests and visual checks reach it by
 * id. The tags are written out on each story, as the indexer reads them
 * statically.
 */
const meta: Meta = {
  title: "Blocks/Hero",
  parameters: { layout: "fullscreen", viewport: { viewports: heroViewports } },
  tags: ["autodocs"],
}

export default meta

export const EditorialArch: StoryObj<typeof HeroEditorialArch> = {
  name: "Editorial Arch",
  argTypes: heroArgTypes(HeroEditorialArch, heroEditorialArchCopy),
  render: (args, context) => <HeroEditorialArch locale={localeOf(context)} {...photoPropsOf("editorial-arch", context)} {...args} />,
}

export const EditorialArchWithoutPhotos: StoryObj<typeof HeroEditorialArch> = {
  name: "Editorial Arch: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroEditorialArch, heroEditorialArchCopy),
  render: (args, context) => <HeroEditorialArch locale={localeOf(context)} {...args} />,
}

export const PhotoConstellation: StoryObj<typeof HeroPhotoConstellation> = {
  name: "Photo Constellation",
  argTypes: heroArgTypes(HeroPhotoConstellation, heroPhotoConstellationCopy),
  render: (args, context) => <HeroPhotoConstellation locale={localeOf(context)} {...photoPropsOf("photo-constellation", context)} {...args} />,
}

export const PhotoConstellationWithoutPhotos: StoryObj<typeof HeroPhotoConstellation> = {
  name: "Photo Constellation: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroPhotoConstellation, heroPhotoConstellationCopy),
  render: (args, context) => <HeroPhotoConstellation locale={localeOf(context)} {...args} />,
}

export const ArcGallery: StoryObj<typeof HeroArcGallery> = {
  name: "Arc Gallery",
  argTypes: heroArgTypes(HeroArcGallery, heroArcGalleryCopy),
  render: (args, context) => <HeroArcGallery locale={localeOf(context)} {...photoPropsOf("arc-gallery", context)} {...args} />,
}

export const ArcGalleryWithoutPhotos: StoryObj<typeof HeroArcGallery> = {
  name: "Arc Gallery: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroArcGallery, heroArcGalleryCopy),
  render: (args, context) => <HeroArcGallery locale={localeOf(context)} {...args} />,
}

export const InlineImageHeadline: StoryObj<typeof HeroInlineImageHeadline> = {
  name: "Inline Image Headline",
  argTypes: heroArgTypes(HeroInlineImageHeadline, heroInlineImageHeadlineCopy),
  render: (args, context) => <HeroInlineImageHeadline locale={localeOf(context)} {...photoPropsOf("inline-image-headline", context)} {...args} />,
}

export const InlineImageHeadlineWithoutPhotos: StoryObj<typeof HeroInlineImageHeadline> = {
  name: "Inline Image Headline: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroInlineImageHeadline, heroInlineImageHeadlineCopy),
  render: (args, context) => <HeroInlineImageHeadline locale={localeOf(context)} {...args} />,
}

export const BentoSplit: StoryObj<typeof HeroBentoSplit> = {
  name: "Bento Split",
  argTypes: heroArgTypes(HeroBentoSplit, heroBentoSplitCopy, ["chartLabel"]),
  render: (args, context) => <HeroBentoSplit locale={localeOf(context)} {...photoPropsOf("bento-split", context)} {...args} />,
}

export const BentoSplitWithoutPhotos: StoryObj<typeof HeroBentoSplit> = {
  name: "Bento Split: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroBentoSplit, heroBentoSplitCopy, ["chartLabel"]),
  render: (args, context) => <HeroBentoSplit locale={localeOf(context)} {...args} />,
}

export const FramedFullBleed: StoryObj<typeof HeroFramedFullBleed> = {
  name: "Framed Full-Bleed",
  argTypes: heroArgTypes(HeroFramedFullBleed, heroFramedFullBleedCopy),
  render: (args, context) => <HeroFramedFullBleed locale={localeOf(context)} {...photoPropsOf("framed-full-bleed", context)} {...args} />,
}

export const FramedFullBleedWithoutPhotos: StoryObj<typeof HeroFramedFullBleed> = {
  name: "Framed Full-Bleed: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroFramedFullBleed, heroFramedFullBleedCopy),
  render: (args, context) => <HeroFramedFullBleed locale={localeOf(context)} {...args} />,
}

export const AnnotatedObject: StoryObj<typeof HeroAnnotatedObject> = {
  name: "Annotated Object",
  argTypes: heroArgTypes(HeroAnnotatedObject, heroAnnotatedObjectCopy),
  render: (args, context) => <HeroAnnotatedObject locale={localeOf(context)} {...photoPropsOf("annotated-object", context)} {...args} />,
}

export const AnnotatedObjectWithoutPhotos: StoryObj<typeof HeroAnnotatedObject> = {
  name: "Annotated Object: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroAnnotatedObject, heroAnnotatedObjectCopy),
  render: (args, context) => <HeroAnnotatedObject locale={localeOf(context)} {...args} />,
}

export const EditorialTriptych: StoryObj<typeof HeroEditorialTriptych> = {
  name: "Editorial Triptych",
  argTypes: heroArgTypes(HeroEditorialTriptych, heroEditorialTriptychCopy),
  render: (args, context) => <HeroEditorialTriptych locale={localeOf(context)} {...photoPropsOf("editorial-triptych", context)} {...args} />,
}

export const EditorialTriptychWithoutPhotos: StoryObj<typeof HeroEditorialTriptych> = {
  name: "Editorial Triptych: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroEditorialTriptych, heroEditorialTriptychCopy),
  render: (args, context) => <HeroEditorialTriptych locale={localeOf(context)} {...args} />,
}

export const ColourStage: StoryObj<typeof HeroColourStage> = {
  name: "Colour Stage",
  argTypes: heroArgTypes(HeroColourStage, heroColourStageCopy),
  render: (args, context) => <HeroColourStage locale={localeOf(context)} {...photoPropsOf("colour-stage", context)} {...args} />,
}

export const TwinPanels: StoryObj<typeof HeroTwinPanels> = {
  name: "Twin Panels",
  argTypes: heroArgTypes(HeroTwinPanels, heroTwinPanelsCopy),
  render: (args, context) => <HeroTwinPanels locale={localeOf(context)} {...photoPropsOf("twin-panels", context)} {...args} />,
}

export const TwinPanelsWithoutPhotos: StoryObj<typeof HeroTwinPanels> = {
  name: "Twin Panels: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroTwinPanels, heroTwinPanelsCopy),
  render: (args, context) => <HeroTwinPanels locale={localeOf(context)} {...args} />,
}

export const SplitBandHeadline: StoryObj<typeof HeroSplitBandHeadline> = {
  name: "Split Band Headline",
  argTypes: heroArgTypes(HeroSplitBandHeadline, heroSplitBandHeadlineCopy),
  render: (args, context) => <HeroSplitBandHeadline locale={localeOf(context)} {...photoPropsOf("split-band-headline", context)} {...args} />,
}

export const SplitBandHeadlineWithoutPhotos: StoryObj<typeof HeroSplitBandHeadline> = {
  name: "Split Band Headline: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroSplitBandHeadline, heroSplitBandHeadlineCopy),
  render: (args, context) => <HeroSplitBandHeadline locale={localeOf(context)} {...args} />,
}

export const TexturedDark: StoryObj<typeof HeroTexturedDark> = {
  name: "Textured Dark",
  argTypes: heroArgTypes(HeroTexturedDark, heroTexturedDarkCopy),
  render: (args, context) => <HeroTexturedDark locale={localeOf(context)} {...photoPropsOf("textured-dark", context)} {...args} />,
}

export const TexturedDarkWithoutPhotos: StoryObj<typeof HeroTexturedDark> = {
  name: "Textured Dark: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroTexturedDark, heroTexturedDarkCopy),
  render: (args, context) => <HeroTexturedDark locale={localeOf(context)} {...args} />,
}

export const ComponentPattern: StoryObj<typeof HeroComponentPattern> = {
  name: "Component Pattern",
  argTypes: heroArgTypes(HeroComponentPattern, heroComponentPatternCopy),
  render: (args, context) => <HeroComponentPattern locale={localeOf(context)} {...photoPropsOf("component-pattern", context)} {...args} />,
}

export const CurvedMediaRail: StoryObj<typeof HeroCurvedMediaRail> = {
  name: "Curved Media Rail",
  argTypes: heroArgTypes(HeroCurvedMediaRail, heroCurvedMediaRailCopy),
  render: (args, context) => <HeroCurvedMediaRail locale={localeOf(context)} {...photoPropsOf("curved-media-rail", context)} {...args} />,
}

export const CurvedMediaRailWithoutPhotos: StoryObj<typeof HeroCurvedMediaRail> = {
  name: "Curved Media Rail: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroCurvedMediaRail, heroCurvedMediaRailCopy),
  render: (args, context) => <HeroCurvedMediaRail locale={localeOf(context)} {...args} />,
}

export const FramedStudioCard: StoryObj<typeof HeroFramedStudioCard> = {
  name: "Framed Studio Card",
  argTypes: heroArgTypes(HeroFramedStudioCard, heroFramedStudioCardCopy),
  render: (args, context) => <HeroFramedStudioCard locale={localeOf(context)} {...photoPropsOf("framed-studio-card", context)} {...args} />,
}

export const FramedStudioCardWithoutPhotos: StoryObj<typeof HeroFramedStudioCard> = {
  name: "Framed Studio Card: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroFramedStudioCard, heroFramedStudioCardCopy),
  render: (args, context) => <HeroFramedStudioCard locale={localeOf(context)} {...args} />,
}

export const OrbitTrack: StoryObj<typeof HeroOrbitTrack> = {
  name: "Orbit Track",
  argTypes: heroArgTypes(HeroOrbitTrack, heroOrbitTrackCopy),
  render: (args, context) => <HeroOrbitTrack locale={localeOf(context)} {...photoPropsOf("orbit-track", context)} {...args} />,
}

export const OrbitTrackWithoutPhotos: StoryObj<typeof HeroOrbitTrack> = {
  name: "Orbit Track: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroOrbitTrack, heroOrbitTrackCopy),
  render: (args, context) => <HeroOrbitTrack locale={localeOf(context)} {...args} />,
}

export const FloatingIntegrations: StoryObj<typeof HeroFloatingIntegrations> = {
  name: "Floating Integrations",
  argTypes: heroArgTypes(HeroFloatingIntegrations, heroFloatingIntegrationsCopy),
  render: (args, context) => <HeroFloatingIntegrations locale={localeOf(context)} {...photoPropsOf("floating-integrations", context)} {...args} />,
}

export const ShapeGrid: StoryObj<typeof HeroShapeGrid> = {
  name: "Shape Grid",
  argTypes: heroArgTypes(HeroShapeGrid, heroShapeGridCopy),
  render: (args, context) => <HeroShapeGrid locale={localeOf(context)} {...photoPropsOf("shape-grid", context)} {...args} />,
}

export const ShapeGridWithoutPhotos: StoryObj<typeof HeroShapeGrid> = {
  name: "Shape Grid: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroShapeGrid, heroShapeGridCopy),
  render: (args, context) => <HeroShapeGrid locale={localeOf(context)} {...args} />,
}

export const WaveBand: StoryObj<typeof HeroWaveBand> = {
  name: "Wave Band",
  argTypes: heroArgTypes(HeroWaveBand, heroWaveBandCopy),
  render: (args, context) => <HeroWaveBand locale={localeOf(context)} {...photoPropsOf("wave-band", context)} {...args} />,
}

export const WaveBandWithoutPhotos: StoryObj<typeof HeroWaveBand> = {
  name: "Wave Band: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroWaveBand, heroWaveBandCopy),
  render: (args, context) => <HeroWaveBand locale={localeOf(context)} {...args} />,
}

export const StudioMosaic: StoryObj<typeof HeroStudioMosaic> = {
  name: "Studio Mosaic",
  argTypes: heroArgTypes(HeroStudioMosaic, heroStudioMosaicCopy),
  render: (args, context) => <HeroStudioMosaic locale={localeOf(context)} {...photoPropsOf("studio-mosaic", context)} {...args} />,
}

export const StudioMosaicWithoutPhotos: StoryObj<typeof HeroStudioMosaic> = {
  name: "Studio Mosaic: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroStudioMosaic, heroStudioMosaicCopy),
  render: (args, context) => <HeroStudioMosaic locale={localeOf(context)} {...args} />,
}

export const IllustrationSplit: StoryObj<typeof HeroIllustrationSplit> = {
  name: "Illustration Split",
  argTypes: heroArgTypes(HeroIllustrationSplit, heroIllustrationSplitCopy),
  render: (args, context) => <HeroIllustrationSplit locale={localeOf(context)} {...photoPropsOf("illustration-split", context)} {...args} />,
}

export const IllustrationSplitWithoutPhotos: StoryObj<typeof HeroIllustrationSplit> = {
  name: "Illustration Split: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroIllustrationSplit, heroIllustrationSplitCopy),
  render: (args, context) => <HeroIllustrationSplit locale={localeOf(context)} {...args} />,
}

export const MaskedTypeReveal: StoryObj<typeof HeroMaskedTypeReveal> = {
  name: "Masked Type Reveal",
  argTypes: heroArgTypes(HeroMaskedTypeReveal, heroMaskedTypeRevealCopy),
  render: (args, context) => <HeroMaskedTypeReveal locale={localeOf(context)} {...photoPropsOf("masked-type-reveal", context)} {...args} />,
}

export const MaskedTypeRevealWithoutPhotos: StoryObj<typeof HeroMaskedTypeReveal> = {
  name: "Masked Type Reveal: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroMaskedTypeReveal, heroMaskedTypeRevealCopy),
  render: (args, context) => <HeroMaskedTypeReveal locale={localeOf(context)} {...args} />,
}

export const VelocityMarquee: StoryObj<typeof HeroVelocityMarquee> = {
  name: "Velocity Marquee",
  argTypes: heroArgTypes(HeroVelocityMarquee, heroVelocityMarqueeCopy, ["pauseLabel", "playLabel"]),
  render: (args, context) => <HeroVelocityMarquee locale={localeOf(context)} {...photoPropsOf("velocity-marquee", context)} {...args} />,
}

export const DuoCard: StoryObj<typeof HeroDuoCard> = {
  name: "Duo Card",
  argTypes: heroArgTypes(HeroDuoCard, heroDuoCardCopy),
  render: (args, context) => <HeroDuoCard locale={localeOf(context)} {...photoPropsOf("duo-card", context)} {...args} />,
}

export const DuoCardWithoutPhotos: StoryObj<typeof HeroDuoCard> = {
  name: "Duo Card: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroDuoCard, heroDuoCardCopy),
  render: (args, context) => <HeroDuoCard locale={localeOf(context)} {...args} />,
}

export const VideoSpotlight: StoryObj<typeof HeroVideoSpotlight> = {
  name: "Video Spotlight",
  argTypes: heroArgTypes(HeroVideoSpotlight, heroVideoSpotlightCopy, ["playLabel"]),
  render: (args, context) => <HeroVideoSpotlight locale={localeOf(context)} {...photoPropsOf("video-spotlight", context)} {...args} />,
}

export const VideoSpotlightWithoutPhotos: StoryObj<typeof HeroVideoSpotlight> = {
  name: "Video Spotlight: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroVideoSpotlight, heroVideoSpotlightCopy, ["playLabel"]),
  render: (args, context) => <HeroVideoSpotlight locale={localeOf(context)} {...args} />,
}

export const BrandColorBlock: StoryObj<typeof HeroBrandColorBlock> = {
  name: "Brand Color-Block",
  argTypes: heroArgTypes(HeroBrandColorBlock, heroBrandColorBlockCopy),
  render: (args, context) => <HeroBrandColorBlock locale={localeOf(context)} {...photoPropsOf("brand-color-block", context)} {...args} />,
}

export const BrandColorBlockWithoutPhotos: StoryObj<typeof HeroBrandColorBlock> = {
  name: "Brand Color-Block: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroBrandColorBlock, heroBrandColorBlockCopy),
  render: (args, context) => <HeroBrandColorBlock locale={localeOf(context)} {...args} />,
}

export const ScrambleDecode: StoryObj<typeof HeroScrambleDecode> = {
  name: "Scramble Decode",
  argTypes: heroArgTypes(HeroScrambleDecode, heroScrambleDecodeCopy, ["decodingLabel"]),
  render: (args, context) => <HeroScrambleDecode locale={localeOf(context)} {...photoPropsOf("scramble-decode", context)} {...args} />,
}

export const SplitFlapCounters: StoryObj<typeof HeroSplitFlapCounters> = {
  name: "Split-Flap Counters",
  argTypes: heroArgTypes(HeroSplitFlapCounters, heroSplitFlapCountersCopy),
  render: (args, context) => <HeroSplitFlapCounters locale={localeOf(context)} {...photoPropsOf("split-flap-counters", context)} {...args} />,
}

export const VideoInType: StoryObj<typeof HeroVideoInType> = {
  name: "Video-in-Type",
  argTypes: heroArgTypes(HeroVideoInType, heroVideoInTypeCopy, ["controlsLabel", "pauseLabel", "playLabel"]),
  render: (args, context) => <HeroVideoInType locale={localeOf(context)} {...photoPropsOf("video-in-type", context)} {...args} />,
}

export const VideoInTypeWithoutPhotos: StoryObj<typeof HeroVideoInType> = {
  name: "Video-in-Type: Without Photos",
  tags: ["!dev", "!autodocs"],
  argTypes: heroArgTypes(HeroVideoInType, heroVideoInTypeCopy, ["controlsLabel", "pauseLabel", "playLabel"]),
  render: (args, context) => <HeroVideoInType locale={localeOf(context)} {...args} />,
}
