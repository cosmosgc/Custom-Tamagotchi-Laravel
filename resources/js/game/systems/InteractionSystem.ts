import { GameStore } from '../state/GameStore';

export class InteractionSystem {
  private store: GameStore;

  constructor(store: GameStore) {
    this.store = store;
  }

  feed(amount: number = 25): void {
    const s = this.store.getState().companion;
    const hunger = Math.min(100, s.hunger + amount);
    const fun = Math.min(100, s.fun + 3);
    this.store.updateCompanion({ hunger, fun });
  }

  pet(amount: number = 10): void {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + amount);
    const energy = Math.max(0, s.energy - 2);
    this.store.updateCompanion({ fun, energy });
  }

  play(amount: number = 20): void {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + amount);
    const energy = Math.max(0, s.energy - 10);
    const hunger = Math.max(0, s.hunger - 5);
    this.store.updateCompanion({ fun, energy, hunger });
  }
}
