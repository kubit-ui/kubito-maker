import type { KubitoItem, VisualEffects, Transform } from "@/types";
import { DEFAULT_EFFECTS } from "@/types";

/**
 * Domain model for KubitoItem with business logic methods.
 * Encapsulates item behavior and validation.
 */
export class KubitoItemModel {
  private item: KubitoItem;

  constructor(item: KubitoItem) {
    this.item = item;
  }

  /**
   * Gets the raw item data
   */
  get data(): KubitoItem {
    return { ...this.item };
  }

  /**
   * Creates a new KubitoItemModel from partial data with defaults
   */
  static create(
    data: Omit<KubitoItem, "id" | "z" | "locked" | "visible" | "effects">,
    id: string,
    z: number,
  ): KubitoItemModel {
    const item: KubitoItem = {
      ...data,
      id,
      z,
      locked: false,
      visible: true,
      effects: { ...DEFAULT_EFFECTS },
    };
    return new KubitoItemModel(item);
  }

  /**
   * Creates a duplicate of this item with new position
   */
  duplicate(newId: string, newZ: number, offset = 20): KubitoItemModel {
    return new KubitoItemModel({
      ...this.item,
      id: newId,
      x: this.item.x + offset,
      y: this.item.y + offset,
      z: newZ,
    });
  }

  /**
   * Updates item properties
   */
  update(updates: Partial<KubitoItem>): KubitoItemModel {
    return new KubitoItemModel({
      ...this.item,
      ...updates,
    });
  }

  /**
   * Checks if item is selectable (not locked and visible)
   */
  isSelectable(): boolean {
    return !this.item.locked && this.item.visible;
  }

  /**
   * Toggles visibility
   */
  toggleVisibility(): KubitoItemModel {
    return this.update({ visible: !this.item.visible });
  }

  /**
   * Toggles lock state
   */
  toggleLock(): KubitoItemModel {
    return this.update({ locked: !this.item.locked });
  }

  /**
   * Applies transformation
   */
  applyTransform(transform: Partial<Transform>): KubitoItemModel {
    return this.update(transform);
  }

  /**
   * Applies visual effects
   */
  applyEffects(effects: Partial<VisualEffects>): KubitoItemModel {
    return this.update({
      effects: { ...this.item.effects, ...effects },
    });
  }

  /**
   * Moves item by delta
   */
  moveBy(dx: number, dy: number): KubitoItemModel {
    return this.update({
      x: this.item.x + dx,
      y: this.item.y + dy,
    });
  }

  /**
   * Moves item to absolute position
   */
  moveTo(x: number, y: number): KubitoItemModel {
    return this.update({ x, y });
  }

  /**
   * Scales item by factor
   */
  scaleBy(factor: number): KubitoItemModel {
    return this.update({
      scale: this.item.scale * factor,
    });
  }

  /**
   * Sets absolute scale
   */
  scaleTo(scale: number): KubitoItemModel {
    return this.update({ scale });
  }

  /**
   * Rotates item by delta degrees
   */
  rotateBy(degrees: number): KubitoItemModel {
    return this.update({
      rotate: (this.item.rotate + degrees) % 360,
    });
  }

  /**
   * Sets absolute rotation
   */
  rotateTo(degrees: number): KubitoItemModel {
    return this.update({ rotate: degrees % 360 });
  }

  /**
   * Flips item horizontally
   */
  flipHorizontal(): KubitoItemModel {
    return this.update({ flipX: !this.item.flipX });
  }

  /**
   * Flips item vertically
   */
  flipVertical(): KubitoItemModel {
    return this.update({ flipY: !this.item.flipY });
  }

  /**
   * Updates z-index
   */
  setZ(z: number): KubitoItemModel {
    return this.update({ z });
  }

  /**
   * Gets item bounds (simple approximation)
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    const baseSize = 100 * this.item.scale; // Approximate base size
    return {
      x: this.item.x - baseSize / 2,
      y: this.item.y - baseSize / 2,
      width: baseSize,
      height: baseSize,
    };
  }

  /**
   * Checks if item intersects with another item
   */
  intersects(other: KubitoItemModel): boolean {
    const bounds1 = this.getBounds();
    const bounds2 = other.getBounds();

    return !(
      bounds1.x + bounds1.width < bounds2.x ||
      bounds2.x + bounds2.width < bounds1.x ||
      bounds1.y + bounds1.height < bounds2.y ||
      bounds2.y + bounds2.height < bounds1.y
    );
  }

  /**
   * Validates item data
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.item.id) errors.push("Item must have an ID");
    if (!this.item.category) errors.push("Item must have a category");
    if (!this.item.assetId) errors.push("Item must have an assetId");
    if (typeof this.item.x !== "number") errors.push("x must be a number");
    if (typeof this.item.y !== "number") errors.push("y must be a number");
    if (this.item.scale <= 0) errors.push("scale must be positive");

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Serializes item to JSON
   */
  toJSON(): KubitoItem {
    return this.data;
  }

  /**
   * Creates model from JSON
   */
  static fromJSON(json: KubitoItem): KubitoItemModel {
    return new KubitoItemModel(json);
  }
}
