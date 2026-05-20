import { GameStore } from '../state/GameStore';
import { MovementSystem } from './MovementSystem';
import { InteractionSystem } from './InteractionSystem';
import { Room } from '../entities/Room';

const FURNITURE_ACTIONS: Record<string, string> = {
  bed: 'sleep',
  bowl: 'feed',
  toy_box: 'play',
  chair: 'talk',
};

export class FurnitureInteractionSystem {
  private store: GameStore;
  private movement: MovementSystem;
  private interaction: InteractionSystem;
  private room: Room;
  private timer: number = 0;
  private busy: boolean = false;

  constructor(
    store: GameStore,
    movement: MovementSystem,
    interaction: InteractionSystem,
    room: Room
  ) {
    this.store = store;
    this.movement = movement;
    this.interaction = interaction;
    this.room = room;
  }

  interactWithFurniture(itemId: string): void {
    if (this.busy) return;
    const pos = this.room.getFurnitureById(itemId);
    if (!pos) return;

    const center = this.room.getCellCenter(pos.col, pos.row);
    this.busy = true;
    this.movement.moveTo(center.x, center.y, () => {
      const action = FURNITURE_ACTIONS[itemId];
      if (action && action in this.interaction) {
        (this.interaction as unknown as Record<string, () => void>)[action]();
      }
      this.busy = false;
    });
  }

  update(delta: number): void {
    if (this.busy) return;
    this.timer += delta;
    if (this.timer < 300) return;
    this.timer = 0;

    const needs = this.store.getState().companion;

    if (needs.energy < 25) {
      this.interactWithFurniture('bed');
    } else if (needs.hunger < 30) {
      this.interactWithFurniture('bowl');
    } else if (needs.fun < 25) {
      this.interactWithFurniture('toy_box');
    }
  }
}
