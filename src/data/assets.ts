import type { Asset, AssetCategory } from "@/types";
import { ASSETS_LIBRARY_FROM_FILES } from "./assetsFromFiles";

export const ASSETS_LIBRARY: Record<string, Asset[]> =
  ASSETS_LIBRARY_FROM_FILES;

export const getAllAssets = (): Asset[] => {
  return Object.values(ASSETS_LIBRARY).flat();
};

export const getAssetsByCategory = (category: AssetCategory): Asset[] => {
  return ASSETS_LIBRARY[category] || [];
};

export const findAssetById = (id: string): Asset | undefined => {
  return getAllAssets().find((asset) => asset.id === id);
};

export const findAssetByCategoryAndId = (
  category: AssetCategory,
  id: string,
): Asset | undefined => {
  return getAssetsByCategory(category).find((asset) => asset.id === id);
};
