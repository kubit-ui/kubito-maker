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
  { id: '_k', name: 'K Eyes', category: 'Eyes', file: '_k.svg' },
  { id: 'eye', name: 'Classic Round Eyes', category: 'Eyes', file: 'eye.svg' },
  { id: 'eye-1', name: 'Eye Variant 1', category: 'Eyes', file: 'eye-1.svg' },
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
  {
    id: 'eye15-1-v',
    name: 'Eye 15 Variant V',
    category: 'Eyes',
    file: 'eye15-1_v.svg',
  },
  {
    id: 'eye-bg',
    name: 'Eye Background',
    category: 'Eyes',
    file: 'eye_bg.svg',
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
  {
    id: 'big-eye',
    name: 'Big Eye',
    category: 'Eyes',
    file: 'big_eye.svg',
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
  { id: 'afro', name: 'Afro Hair', category: 'Hairs', file: 'afro.svg' },
  { id: 'afro-2', name: 'Afro Hair 2', category: 'Hairs', file: 'afro_2.svg' },
  { id: 'hair-2', name: 'Wavy Hair', category: 'Hairs', file: 'hair_2.svg' },
  {
    id: 'hair-big-square',
    name: 'Square Hair',
    category: 'Hairs',
    file: 'hair_big_square.svg',
  },
  { id: 'hairs', name: 'Spiky Hair', category: 'Hairs', file: 'hairs.svg' },
  {
    id: 'litle-hair',
    name: 'Small Tuft',
    category: 'Hairs',
    file: 'litle hair.svg',
  },
  {
    id: 'punk-hair',
    name: 'Punk Hair',
    category: 'Hairs',
    file: 'punk_hair.svg',
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
    id: 'moustache-1',
    name: 'Thin Mustache',
    category: 'Hairs',
    file: 'moustache-1.svg',
  },
  {
    id: 'moustache-2',
    name: 'Curly Mustache',
    category: 'Hairs',
    file: 'moustache_2.svg',
  },
  {
    id: 'moustache-3',
    name: 'Handlebar Mustache',
    category: 'Hairs',
    file: 'moustache_3.svg',
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
  {
    id: 'astroboots',
    name: 'Astro Boots',
    category: 'Accessories',
    file: 'astroboots.svg',
  },
  { id: 'ay', name: 'Speech Bubble', category: 'Accessories', file: 'ay.svg' },
  { id: 'band', name: 'Band', category: 'Accessories', file: 'band.svg' },
  { id: 'beer', name: 'Beer Glass', category: 'Accessories', file: 'beer.svg' },
  { id: 'boot', name: 'Boot', category: 'Accessories', file: 'boot.svg' },
  {
    id: 'bowtie',
    name: 'Bow Tie',
    category: 'Accessories',
    file: 'bowtie.svg',
  },
  {
    id: 'cap',
    name: 'Cap',
    category: 'Accessories',
    file: 'cap.svg',
  },
  {
    id: 'cigarette',
    name: 'Cigarette',
    category: 'Accessories',
    file: 'cigarrette.svg',
  },
  {
    id: 'cross',
    name: 'Cross',
    category: 'Accessories',
    file: 'cross.svg',
  },
  {
    id: 'crown',
    name: 'Royal Crown',
    category: 'Accessories',
    file: 'crown.svg',
  },
  {
    id: 'double-monocle',
    name: 'Double Monocle',
    category: 'Accessories',
    file: 'double_monocule.svg',
  },
  {
    id: 'drop',
    name: 'Drop',
    category: 'Accessories',
    file: 'drop.svg',
  },
  { id: 'ear', name: 'Ear', category: 'Accessories', file: 'ear.svg' },
  {
    id: 'ear-1',
    name: 'Ear Variant',
    category: 'Accessories',
    file: 'ear-1.svg',
  },
  {
    id: 'ear-devil',
    name: 'Devil Ear',
    category: 'Accessories',
    file: 'ear_devil.svg',
  },
  {
    id: 'ellipse-693',
    name: 'Circle Accessory',
    category: 'Accessories',
    file: 'Ellipse 693.svg',
  },
  {
    id: 'ellipse-712',
    name: 'Circle Accessory 712',
    category: 'Accessories',
    file: 'Ellipse 712.svg',
  },
  {
    id: 'hair',
    name: 'Hair Accessory',
    category: 'Accessories',
    file: 'hair.svg',
  },
  { id: 'hat', name: 'Top Hat', category: 'Accessories', file: 'hat.svg' },
  {
    id: 'hat-1',
    name: 'Party Hat',
    category: 'Accessories',
    file: 'hat-1.svg',
  },
  { id: 'head', name: 'Head', category: 'Accessories', file: 'head.svg' },
  { id: 'leaf', name: 'Leaf', category: 'Accessories', file: 'leaf.svg' },
  { id: 'mask', name: 'Face Mask', category: 'Accessories', file: 'mask.svg' },
  {
    id: 'monocle',
    name: 'Monocle',
    category: 'Accessories',
    file: 'monocule.svg',
  },
  {
    id: 'naruto',
    name: 'Headband',
    category: 'Accessories',
    file: 'naruto.svg',
  },
  {
    id: 'original-hat',
    name: 'Classic Cap',
    category: 'Accessories',
    file: 'original_hat.svg',
  },
  {
    id: 'pelusa',
    name: 'Pelusa',
    category: 'Accessories',
    file: 'pelusa.svg',
  },
  {
    id: 'pluma',
    name: 'Feather',
    category: 'Accessories',
    file: 'pluma.svg',
  },
  {
    id: 'rectangle-3463856',
    name: 'Rectangle Accessory 856',
    category: 'Accessories',
    file: 'Rectangle 3463856.svg',
  },
  {
    id: 'rectangle-3463857',
    name: 'Rectangle Accessory 857',
    category: 'Accessories',
    file: 'Rectangle 3463857.svg',
  },
  {
    id: 'shadow',
    name: 'Floor Shadow',
    category: 'Accessories',
    file: 'shadow.svg',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    category: 'Accessories',
    file: 'sunglasses.svg',
  },
  {
    id: 'sunglasses-real',
    name: 'Sunglasses Real',
    category: 'Accessories',
    file: 'sunglasses_real.svg',
  },
  {
    id: 'tail',
    name: 'Tail',
    category: 'Accessories',
    file: 'tail.svg',
  },
  {
    id: 'tattoo',
    name: 'Tattoo',
    category: 'Accessories',
    file: 'tattoo.svg',
  },
  {
    id: 'tattoo-1',
    name: 'Tattoo 1',
    category: 'Accessories',
    file: 'tattoo-1.svg',
  },
  {
    id: 'tattoo-2',
    name: 'Tattoo 2',
    category: 'Accessories',
    file: 'tattoo-2.svg',
  },
  {
    id: 'tattoo-3',
    name: 'Tattoo 3',
    category: 'Accessories',
    file: 'tattoo-3.svg',
  },
  {
    id: 'vector-824',
    name: 'Vector Accessory',
    category: 'Accessories',
    file: 'Vector 824.svg',
  },
  {
    id: 'vector-845',
    name: 'Vector Accessory 845',
    category: 'Accessories',
    file: 'Vector 845.svg',
  },
  {
    id: 'vector-896',
    name: 'Vector Accessory 896',
    category: 'Accessories',
    file: 'Vector 896.svg',
  },
];

/**
 * Backgrounds assets
 */
export const BACKGROUNDS_DEFINITIONS: AssetDefinition[] = [
  {
    id: 'bg-01',
    name: 'Background 01',
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
    name: 'Pattern 08',
    category: 'Backgrounds',
    file: 'Bg-08.svg',
  },
  {
    id: 'bg-08-1',
    name: 'Pattern 08-1',
    category: 'Backgrounds',
    file: 'Bg-08-1.svg',
  },
  {
    id: 'bg-08-2',
    name: 'Pattern 08-2',
    category: 'Backgrounds',
    file: 'Bg-08-2.svg',
  },
  {
    id: 'bg-08-3',
    name: 'Pattern 08-3',
    category: 'Backgrounds',
    file: 'Bg-08-3.svg',
  },
  {
    id: 'bg-08-4',
    name: 'Pattern 08-4',
    category: 'Backgrounds',
    file: 'Bg-08-4.svg',
  },
  {
    id: 'bg-08-5',
    name: 'Pattern 08-5',
    category: 'Backgrounds',
    file: 'Bg-08-5.svg',
  },
  {
    id: 'bg-08-6',
    name: 'Pattern 08-6',
    category: 'Backgrounds',
    file: 'Bg-08-6.svg',
  },
  {
    id: 'bg-08-7',
    name: 'Pattern 08-7',
    category: 'Backgrounds',
    file: 'Bg-08-7.svg',
  },
  {
    id: 'bg-08-8',
    name: 'Pattern 08-8',
    category: 'Backgrounds',
    file: 'Bg-08-8.svg',
  },
  {
    id: 'bg-08-9',
    name: 'Pattern 08-9',
    category: 'Backgrounds',
    file: 'Bg-08-9.svg',
  },
  {
    id: 'bg-08-10',
    name: 'Pattern 08-10',
    category: 'Backgrounds',
    file: 'Bg-08-10.svg',
  },
  {
    id: 'bg-08-11',
    name: 'Pattern 08-11',
    category: 'Backgrounds',
    file: 'Bg-08-11.svg',
  },
  {
    id: 'bg-08-12',
    name: 'Pattern 08-12',
    category: 'Backgrounds',
    file: 'Bg-08-12.svg',
  },
  {
    id: 'bg-08-13',
    name: 'Pattern 08-13',
    category: 'Backgrounds',
    file: 'Bg-08-13.svg',
  },
  {
    id: 'bg-08-14',
    name: 'Pattern 08-14',
    category: 'Backgrounds',
    file: 'Bg-08-14.svg',
  },
  {
    id: 'bg-08-15',
    name: 'Pattern 08-15',
    category: 'Backgrounds',
    file: 'Bg-08-15.svg',
  },
  {
    id: 'bg-08-16',
    name: 'Pattern 08-16',
    category: 'Backgrounds',
    file: 'Bg-08-16.svg',
  },
  {
    id: 'bg-08-17',
    name: 'Pattern 08-17',
    category: 'Backgrounds',
    file: 'Bg-08-17.svg',
  },
  {
    id: 'bg-08-18',
    name: 'Pattern 08-18',
    category: 'Backgrounds',
    file: 'Bg-08-18.svg',
  },
  {
    id: 'bg-08-19',
    name: 'Pattern 08-19',
    category: 'Backgrounds',
    file: 'Bg-08-19.svg',
  },
  {
    id: 'bg-08-20',
    name: 'Pattern 08-20',
    category: 'Backgrounds',
    file: 'Bg-08-20.svg',
  },
  {
    id: 'bg-08-21',
    name: 'Pattern 08-21',
    category: 'Backgrounds',
    file: 'Bg-08-21.svg',
  },
  {
    id: 'bg-08-22',
    name: 'Pattern 08-22',
    category: 'Backgrounds',
    file: 'Bg-08-22.svg',
  },
  {
    id: 'bg-08-23',
    name: 'Pattern 08-23',
    category: 'Backgrounds',
    file: 'Bg-08-23.svg',
  },
  {
    id: 'hair-1-bg',
    name: 'Hair Pattern',
    category: 'Backgrounds',
    file: 'hair-1.svg',
  },
  {
    id: 'vector-925-bg',
    name: 'Vector Pattern',
    category: 'Backgrounds',
    file: 'Vector 925.svg',
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
 * Decorations assets (mountains, clouds, etc.)
 */
export const DECORATIONS_DEFINITIONS: AssetDefinition[] = [
  {
    id: 'cloud-dec',
    name: 'Cloud',
    category: 'Decorations',
    file: 'cloud.svg',
  },
  {
    id: 'cloud2-dec',
    name: 'Cloud 2',
    category: 'Decorations',
    file: 'cloud2.svg',
  },
  {
    id: 'mountain',
    name: 'Mountain',
    category: 'Decorations',
    file: 'mountain.svg',
  },
  {
    id: 'mountain-1',
    name: 'Mountain Peak',
    category: 'Decorations',
    file: 'mountain-1.svg',
  },
  {
    id: 'mountain-green',
    name: 'Green Mountain',
    category: 'Decorations',
    file: 'mountain_green.svg',
  },
  {
    id: 'image-13',
    name: 'Image 13',
    category: 'Decorations',
    file: 'image 13.svg',
  },
];

/**
 * Combined assets library
 * Note: Eyebrows and Moustache are now merged into Hairs
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
  Accessories: createAssetsFromDefinitions(ACCESSORIES_DEFINITIONS),
  Decorations: createAssetsFromDefinitionsWithFolder(
    DECORATIONS_DEFINITIONS,
    'decorations'
  ),
  Backgrounds: createAssetsFromDefinitions(BACKGROUNDS_DEFINITIONS),
  Bodies: createAssetsFromDefinitions(BODIES_DEFINITIONS),
};
