import type { KubitoItem } from "@/types";
import { KubitoItemModel } from "@/domain/models";
import toast from "react-hot-toast";

/**
 * Service for managing CRUD operations on KubitoItems.
 * Encapsulates all item manipulation logic.
 */
export class ItemService {
  private static idCounter = 1;

  /**
   * Generates a unique ID for a new item
   */
  static generateId(): string {
    return `item_${this.idCounter++}_${Date.now()}`;
  }

  /**
   * Creates a new item with default values
   */
  static createItem(
    data: Omit<KubitoItem, "id" | "z" | "locked" | "visible" | "effects">,
    zIndex: number,
  ): KubitoItem {
    const id = this.generateId();
    const model = KubitoItemModel.create(data, id, zIndex);
    return model.data;
  }

  /**
   * Updates an item in a collection
   */
  static updateItem(
    items: KubitoItem[],
    id: string,
    updates: Partial<KubitoItem>,
  ): KubitoItem[] {
    return items.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
  }

  /**
   * Removes items from collection
   */
  static removeItems(
    items: KubitoItem[],
    idsToRemove: string[],
  ): {
    items: KubitoItem[];
    removedCount: number;
  } {
    const filtered = items.filter((item) => !idsToRemove.includes(item.id));
    const removedCount = items.length - filtered.length;

    if (removedCount > 1) {
      toast.success(`${removedCount} items deleted`, {
        duration: 1500,
      });
    }

    return {
      items: filtered,
      removedCount,
    };
  }

  /**
   * Duplicates items with offset
   */
  static duplicateItems(
    items: KubitoItem[],
    idsToDuplicate: string[],
    offset = 20,
  ): {
    newItems: KubitoItem[];
    newIds: string[];
  } {
    const itemsToDuplicate = items.filter((i) => idsToDuplicate.includes(i.id));

    if (itemsToDuplicate.length === 0) {
      return { newItems: [], newIds: [] };
    }

    const newItems: KubitoItem[] = [];
    const newIds: string[] = [];
    const maxZ = Math.max(...items.map((i) => i.z), 0);

    itemsToDuplicate.forEach((item, index) => {
      const newId = this.generateId();
      const model = new KubitoItemModel(item);
      const duplicated = model.duplicate(newId, maxZ + index + 1, offset);
      newItems.push(duplicated.data);
      newIds.push(newId);
    });

    if (newItems.length > 1) {
      toast.success(`${newItems.length} items duplicated`, {
        duration: 1500,
      });
    }

    return { newItems, newIds };
  }

  /**
   * Copies items to clipboard (localStorage)
   */
  static copyToClipboard(items: KubitoItem[], idsToCopy: string[]): boolean {
    const itemsToCopy = items.filter((i) => idsToCopy.includes(i.id));

    if (itemsToCopy.length === 0) return false;

    try {
      localStorage.setItem("kubito-clipboard", JSON.stringify(itemsToCopy));
      const message =
        itemsToCopy.length > 1
          ? `${itemsToCopy.length} items copied`
          : "Item copied";
      toast.success(message, {
        duration: 1500,
      });
      return true;
    } catch (error) {
      console.error("Failed to copy items:", error);
      toast.error("Copy failed");
      return false;
    }
  }

  /**
   * Pastes items from clipboard
   */
  static pasteFromClipboard(
    currentItems: KubitoItem[],
    offset = 20,
  ): {
    newItems: KubitoItem[];
    newIds: string[];
  } | null {
    try {
      const clipboardData = localStorage.getItem("kubito-clipboard");
      if (!clipboardData) {
        toast.error("Nothing to paste");
        return null;
      }

      const copiedData = JSON.parse(clipboardData) as KubitoItem | KubitoItem[];
      const copiedItems = Array.isArray(copiedData) ? copiedData : [copiedData];

      const newItems: KubitoItem[] = [];
      const newIds: string[] = [];
      const maxZ = Math.max(...currentItems.map((i) => i.z), 0);

      copiedItems.forEach((copiedItem: KubitoItem, index) => {
        const newId = this.generateId();
        const model = new KubitoItemModel(copiedItem);
        const pasted = model.duplicate(newId, maxZ + index + 1, offset);
        newItems.push(pasted.data);
        newIds.push(newId);
      });

      const message =
        newItems.length > 1 ? `${newItems.length} items pasted` : "Item pasted";
      toast.success(message, {
        duration: 1500,
      });

      return { newItems, newIds };
    } catch (error) {
      console.error("Failed to paste items:", error);
      toast.error("Paste failed");
      return null;
    }
  }

  /**
   * Finds an item by ID
   */
  static findById(items: KubitoItem[], id: string): KubitoItem | undefined {
    return items.find((item) => item.id === id);
  }

  /**
   * Finds items by IDs
   */
  static findByIds(items: KubitoItem[], ids: string[]): KubitoItem[] {
    return items.filter((item) => ids.includes(item.id));
  }

  /**
   * Gets all selectable items (not locked and visible)
   */
  static getSelectableItems(items: KubitoItem[]): KubitoItem[] {
    return items.filter((item) => {
      const model = new KubitoItemModel(item);
      return model.isSelectable();
    });
  }

  /**
   * Toggles item visibility
   */
  static toggleVisibility(items: KubitoItem[], id: string): KubitoItem[] {
    return items.map((item) => {
      if (item.id === id) {
        const model = new KubitoItemModel(item);
        return model.toggleVisibility().data;
      }
      return item;
    });
  }

  /**
   * Toggles item lock state
   */
  static toggleLock(items: KubitoItem[], id: string): KubitoItem[] {
    return items.map((item) => {
      if (item.id === id) {
        const model = new KubitoItemModel(item);
        return model.toggleLock().data;
      }
      return item;
    });
  }

  /**
   * Sorts items by z-index
   */
  static sortByZ(items: KubitoItem[]): KubitoItem[] {
    return [...items].sort((a, b) => a.z - b.z);
  }

  /**
   * Validates all items
   */
  static validateAll(items: KubitoItem[]): {
    valid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};
    let valid = true;

    items.forEach((item) => {
      const model = new KubitoItemModel(item);
      const validation = model.validate();
      if (!validation.valid) {
        errors[item.id] = validation.errors;
        valid = false;
      }
    });

    return { valid, errors };
  }

  /**
   * Gets item count by category
   */
  static getCountByCategory(items: KubitoItem[]): Record<string, number> {
    return items.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  /**
   * Filters items by category
   */
  static filterByCategory(items: KubitoItem[], category: string): KubitoItem[] {
    return items.filter((item) => item.category === category);
  }
}
