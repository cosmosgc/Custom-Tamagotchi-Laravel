import { GameStore, PlacedFurniture } from '../state/GameStore';
import { Room } from '../entities/Room';

export class FurnitureSystem {
  private store: GameStore;
  private room: Room;
  private placementMode: boolean = false;

  constructor(store: GameStore, room: Room) {
    this.store = store;
    this.room = room;
  }

  isPlacing(): boolean {
    return this.placementMode;
  }

  startPlacement(): void {
    this.placementMode = true;
  }

  cancelPlacement(): void {
    this.placementMode = false;
  }

  placeItem(itemId: string, col: number, row: number): boolean {
    if (!this.placementMode) return false;

    const existing = this.room.getFurnitureAt(col, row);
    if (existing) return false;

    const inv = this.store.getState().inventory;
    if (!inv.includes(itemId)) return false;

    this.store.placeFurniture(itemId, col, row);
    this.placementMode = false;
    return true;
  }

  removeItem(col: number, row: number): boolean {
    const existing = this.room.getFurnitureAt(col, row);
    if (!existing) return false;

    this.store.removeFurniture(col, row);
    return true;
  }

  getFurnitureAt(col: number, row: number): PlacedFurniture | undefined {
    return this.room.getFurnitureAt(col, row);
  }
}
