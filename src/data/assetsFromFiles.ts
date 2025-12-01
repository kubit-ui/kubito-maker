import type { Asset, AssetCategory } from '@/types';

/**
 * Asset definition with SVG path
 */
export interface AssetDefinition {
  id: string;
  name: string;
  category: AssetCategory;
  file: string;
}

/**
 * Convert asset definitions to Asset objects
 */
export function createAssetsFromDefinitions(
  definitions: AssetDefinition[]
): Asset[] {
  return definitions.map((def) => ({
    id: def.id,
    name: def.name,
    category: def.category,
    svgPath: `/assets/svg/${def.category.toLowerCase()}/${def.file}`,
  }));
}

/**
 * Convert asset definitions with custom folder path
 */
export function createAssetsFromDefinitionsWithFolder(
  definitions: AssetDefinition[],
  folder: string
): Asset[] {
  return definitions.map((def) => ({
    id: def.id,
    name: def.name,
    category: def.category,
    svgPath: `/assets/svg/${folder}/${def.file}`,
  }));
}

/**
 * Eyes assets
 */
export const EYES_DEFINITIONS: AssetDefinition[] = [
  { id: 'eye', name: 'Classic Round Eyes', category: 'Eyes', file: 'eye.svg' },
  {
    id: 'eye-89',
    name: 'Eye 89',
    category: 'Eyes',
    file: 'eye_89.svg',
  },
  { id: 'eye02', name: 'Wide Open Eyes', category: 'Eyes', file: 'eye02.svg' },
  {
    id: 'eye02-alone',
    name: 'Wide Open (Single)',
    category: 'Eyes',
    file: 'eye02_alone.svg',
  },
  { id: 'eye03', name: 'Happy Eyes', category: 'Eyes', file: 'eye03.svg' },
  {
    id: 'eye03-1',
    name: 'Happy Sparkle',
    category: 'Eyes',
    file: 'eye03-1.svg',
  },
  {
    id: 'eye03-alone',
    name: 'Happy (Single)',
    category: 'Eyes',
    file: 'eye03_alone.svg',
  },
  { id: 'eye04', name: 'Sleepy Eyes', category: 'Eyes', file: 'eye04.svg' },
  {
    id: 'eye04-alone',
    name: 'Sleepy (Single)',
    category: 'Eyes',
    file: 'eye04_alone.svg',
  },
  { id: 'eye05', name: 'Wink Eyes', category: 'Eyes', file: 'eye05.svg' },
  {
    id: 'eye05-alone',
    name: 'Wink (Single)',
    category: 'Eyes',
    file: 'eye05_alone.svg',
  },
  { id: 'eye09', name: 'Curious Eyes', category: 'Eyes', file: 'eye09.svg' },
  {
    id: 'eye09-2',
    name: 'Curious Variant',
    category: 'Eyes',
    file: 'eye09.2.svg',
  },
  { id: 'eye10', name: 'Eye 10', category: 'Eyes', file: 'eye10.svg' },
  { id: 'eye11', name: 'Eye 11', category: 'Eyes', file: 'eye11.svg' },
  { id: 'eye12', name: 'Eye 12', category: 'Eyes', file: 'eye12.svg' },
  {
    id: 'eye12-2',
    name: 'Eye 12 Variant',
    category: 'Eyes',
    file: 'eye12.2.svg',
  },
  { id: 'eye13', name: 'Eye 13', category: 'Eyes', file: 'eye13.svg' },
  {
    id: 'eye13-2',
    name: 'Eye 13 Variant',
    category: 'Eyes',
    file: 'eye13.2.svg',
  },
  { id: 'eye14', name: 'Eye 14', category: 'Eyes', file: 'eye14.svg' },
  { id: 'eye15', name: 'Eye 15', category: 'Eyes', file: 'eye15.svg' },
  {
    id: 'eye15-1',
    name: 'Eye 15 Variant',
    category: 'Eyes',
    file: 'eye15-1.svg',
  },
  { id: 'eyes', name: 'Simple Dots', category: 'Eyes', file: 'eyes.svg' },
  {
    id: 'eyes-alone',
    name: 'Simple Dot (Single)',
    category: 'Eyes',
    file: 'eyes_alone.svg',
  },
  { id: 'eyes-1', name: 'Oval Eyes', category: 'Eyes', file: 'eyes-1.svg' },
  {
    id: 'eyes-1-alone',
    name: 'Oval (Single)',
    category: 'Eyes',
    file: 'eyes-1_alone.svg',
  },
];

/**
 * Mouths assets
 */
export const MOUTHS_DEFINITIONS: AssetDefinition[] = [
  { id: 'mouth', name: 'Neutral Smile', category: 'Mouths', file: 'mouth.svg' },
  {
    id: 'mouth-1',
    name: 'Small Smile',
    category: 'Mouths',
    file: 'mouth-1.svg',
  },
  {
    id: 'mouth-2',
    name: 'Wide Smile',
    category: 'Mouths',
    file: 'mouth-2.svg',
  },
  { id: 'mouth-3', name: 'Big Grin', category: 'Mouths', file: 'mouth-3.svg' },
  {
    id: 'mouth-4',
    name: 'Gentle Smile',
    category: 'Mouths',
    file: 'mouth-4.svg',
  },
  {
    id: 'mouth02',
    name: 'Open Mouth',
    category: 'Mouths',
    file: 'mouth02.svg',
  },
  {
    id: 'mouth02-1',
    name: 'Open Mouth Variant',
    category: 'Mouths',
    file: 'mouth02-1.svg',
  },
  { id: 'mouth06', name: 'Laughing', category: 'Mouths', file: 'mouth06.svg' },
  {
    id: 'mouth06-1',
    name: 'Laughing Variant 1',
    category: 'Mouths',
    file: 'mouth06-1.svg',
  },
  {
    id: 'mouth06-2',
    name: 'Laughing Variant 2',
    category: 'Mouths',
    file: 'mouth06-2.svg',
  },
  { id: 'mouth09', name: 'Surprised', category: 'Mouths', file: 'mouth09.svg' },
  { id: 'mouth10', name: 'Speaking', category: 'Mouths', file: 'mouth10.svg' },
  {
    id: 'mouth11',
    name: 'Thoughtful',
    category: 'Mouths',
    file: 'mouth11.svg',
  },
  {
    id: 'mouth11-1',
    name: 'Thoughtful Variant',
    category: 'Mouths',
    file: 'mouth11-1.svg',
  },
  { id: 'mouth12', name: 'Mouth 12', category: 'Mouths', file: 'mouth12.svg' },
  { id: 'mouth13', name: 'Mouth 13', category: 'Mouths', file: 'mouth13.svg' },
  { id: 'mouth15', name: 'Mouth 15', category: 'Mouths', file: 'mouth15.svg' },
];

/**
 * Noses assets
 */
export const NOSES_DEFINITIONS: AssetDefinition[] = [];

/**
 * Hairs assets (includes hair, eyebrows, and moustache)
 */
export const HAIRS_DEFINITIONS: AssetDefinition[] = [
  { id: 'hair-2', name: 'Wavy Hair', category: 'Hairs', file: 'hair_2.svg' },
  { id: 'hairs', name: 'Spiky Hair', category: 'Hairs', file: 'hairs.svg' },
  {
    id: 'litle-hair',
    name: 'Small Tuft',
    category: 'Hairs',
    file: 'litle hair.svg',
  },
];

/**
 * Moustache assets (now part of Hairs category)
 */
export const MOUSTACHE_DEFINITIONS: AssetDefinition[] = [
  {
    id: 'moustache',
    name: 'Classic Mustache',
    category: 'Hairs',
    file: 'moustache.svg',
  },
  {
    id: 'moustache-2',
    name: 'Curly Mustache',
    category: 'Hairs',
    file: 'moustache_2.svg',
  },
];

/**
 * Eyebrows assets (now part of Hairs category)
 */
export const EYEBROWS_DEFINITIONS: AssetDefinition[] = [];

/**
 * Accessories assets
 */
export const ACCESSORIES_DEFINITIONS: AssetDefinition[] = [
  { id: 'hat', name: 'Top Hat', category: 'Accessories', file: 'hat.svg' },
  {
    id: 'hat-1',
    name: 'Party Hat',
    category: 'Accessories',
    file: 'hat-1.svg',
  },
  {
    id: 'original-hat',
    name: 'Classic Cap',
    category: 'Accessories',
    file: 'original_hat.svg',
  },
  {
    id: 'cigarette',
    name: 'Cigarette',
    category: 'Accessories',
    file: 'cigarrette.svg',
  },
  {
    id: 'monocule',
    name: 'Monocle',
    category: 'Accessories',
    file: 'monocule.svg',
  },
  {
    id: 'double-monocle',
    name: 'Double Monocle',
    category: 'Accessories',
    file: 'double_monocule.svg',
  },
  {
    id: 'shadow',
    name: 'Floor Shadow',
    category: 'Accessories',
    file: 'shadow.svg',
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    category: 'Accessories',
    file: 'crown.svg',
  },
  {
    id: 'ay',
    name: 'Speech Bubble',
    category: 'Accessories',
    file: 'ay.svg',
  },
  {
    id: 'bowtie',
    name: 'Bow Tie',
    category: 'Accessories',
    file: 'bowtie.svg',
  },
  {
    id: 'drop',
    name: 'Drop',
    category: 'Accessories',
    file: 'drop.svg',
  },
];

/**
 * Backgrounds assets
 */
export const BACKGROUNDS_DEFINITIONS: AssetDefinition[] = [
  {
    id: 'bg-01',
    name: 'Geometric Pattern',
    category: 'Backgrounds',
    file: 'Bg-01.svg',
  },
  {
    id: 'bg-02',
    name: 'Wave Pattern',
    category: 'Backgrounds',
    file: 'Bg-02.svg',
  },
  {
    id: 'bg-03',
    name: 'Dots Pattern',
    category: 'Backgrounds',
    file: 'Bg-03.svg',
  },
  {
    id: 'bg-04',
    name: 'Lines Pattern',
    category: 'Backgrounds',
    file: 'Bg-04.svg',
  },
  {
    id: 'bg-05',
    name: 'Grid Pattern',
    category: 'Backgrounds',
    file: 'Bg-05.svg',
  },
  {
    id: 'bg-06',
    name: 'Abstract Shapes',
    category: 'Backgrounds',
    file: 'Bg-06.svg',
  },
  {
    id: 'bg-06-1',
    name: 'Abstract Variant 1',
    category: 'Backgrounds',
    file: 'Bg-06-1.svg',
  },
  {
    id: 'bg-06-2',
    name: 'Abstract Variant 2',
    category: 'Backgrounds',
    file: 'Bg-06-2.svg',
  },
  {
    id: 'bg-07',
    name: 'Radial Burst',
    category: 'Backgrounds',
    file: 'Bg-07.svg',
  },
  {
    id: 'bg-08',
    name: 'Spiral Pattern',
    category: 'Backgrounds',
    file: 'Bg-08.svg',
  },
  {
    id: 'bg-08-1',
    name: 'Spiral Variant',
    category: 'Backgrounds',
    file: 'Bg-08-1.svg',
  },
];

/**
 * Bodies assets
 */
export const BODIES_DEFINITIONS: AssetDefinition[] = [
  { id: 'body1', name: 'Original Body', category: 'Bodies', file: 'body1.svg' },
  {
    id: 'body2',
    name: 'Alternative Body',
    category: 'Bodies',
    file: 'body2.svg',
  },
  {
    id: 'kubito-02',
    name: 'Pixel Art Body',
    category: 'Bodies',
    file: 'Kubito-02.svg',
  },
  {
    id: 'kubito-03',
    name: 'Outline Body',
    category: 'Bodies',
    file: 'Kubito-03.svg',
  },
  {
    id: 'kubito-04',
    name: 'Gradient Body',
    category: 'Bodies',
    file: 'Kubito-04.svg',
  },
  {
    id: 'kubito-3d-gray',
    name: '3D Gray Body',
    category: 'Bodies',
    file: 'Kubito_3D_gray.svg',
  },
];

/**
 * Decorations assets (now part of Accessories category)
 */
export const DECORATIONS_DEFINITIONS: AssetDefinition[] = [];

/**
 * Combined assets library
 * Note: Eyebrows and Moustache are now merged into Hairs
 * Decorations are now merged into Accessories
 */
export const ASSETS_LIBRARY_FROM_FILES: Record<string, Asset[]> = {
  Eyes: createAssetsFromDefinitions(EYES_DEFINITIONS),
  Mouths: createAssetsFromDefinitions(MOUTHS_DEFINITIONS),
  Noses: createAssetsFromDefinitions(NOSES_DEFINITIONS),
  Hairs: [
    ...createAssetsFromDefinitions(HAIRS_DEFINITIONS),
    ...createAssetsFromDefinitionsWithFolder(
      MOUSTACHE_DEFINITIONS,
      'moustache'
    ),
    ...createAssetsFromDefinitionsWithFolder(EYEBROWS_DEFINITIONS, 'eyebrows'),
  ],
  Accessories: [
    ...createAssetsFromDefinitions(ACCESSORIES_DEFINITIONS),
    ...createAssetsFromDefinitionsWithFolder(
      DECORATIONS_DEFINITIONS,
      'decorations'
    ),
  ],
  Backgrounds: createAssetsFromDefinitions(BACKGROUNDS_DEFINITIONS),
  Bodies: createAssetsFromDefinitions(BODIES_DEFINITIONS),
};
