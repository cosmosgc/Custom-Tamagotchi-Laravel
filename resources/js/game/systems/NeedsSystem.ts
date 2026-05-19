import { GameStore } from '../state/GameStore';

export class NeedsSystem {
  private store: GameStore;
  private timer: number = 0;

  constructor(store: GameStore) {
    this.store = store;
  }

  update(delta: number): void {
    this.timer += delta;

    if (this.timer >= 60) {
      this.timer = 0;
      this.tick();
    }
  }

  private tick(): void {
    const s = this.store.getState().companion;

    const hunger = Math.max(0, s.hunger - 0.5);
    const energy = Math.max(0, s.energy - 0.3);
    const fun = Math.max(0, s.fun - 0.4);

    let mood = s.mood;
    if (hunger < 20 || energy < 20) {
      mood = 'sad';
    } else if (fun < 30) {
      mood = 'sleepy';
    } else if (hunger > 60 && energy > 60) {
      mood = 'happy';
    } else {
      mood = 'neutral';
    }

    this.store.updateCompanion({ hunger, energy, fun, mood });
  }
}
