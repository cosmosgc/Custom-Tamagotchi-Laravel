import { GameStore } from '../state/GameStore';

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60000;
const HUNGER_PER_HOUR = 15;
const FUN_PER_HOUR = 10;
const ENERGY_PER_HOUR_SLEEPING = 20;
const AFFECTION_DECAY_PER_HOUR = 2;

export class TimeSimulationSystem {
  private store: GameStore;

  constructor(store: GameStore) {
    this.store = store;
  }

  processOfflineTime(): void {
    const now = Date.now();
    const state = this.store.getState();
    const elapsed = now - state.lastOnline;
    const hours = elapsed / (MS_PER_MINUTE * 60);

    if (hours < 0.1) return;

    const companion = state.companion;
    const sleeping = companion.sleeping;

    const hungerDecay = HUNGER_PER_HOUR * hours;
    const funDecay = FUN_PER_HOUR * hours;
    const energyChange = sleeping
      ? ENERGY_PER_HOUR_SLEEPING * hours
      : -(FUN_PER_HOUR * hours * 0.5);
    const affectionDecay = AFFECTION_DECAY_PER_HOUR * hours;

    this.store.updateCompanion({
      hunger: Math.max(0, companion.hunger - hungerDecay),
      fun: Math.max(0, companion.fun - funDecay),
      energy: Math.max(0, Math.min(100, companion.energy + energyChange)),
      affection: Math.max(0, companion.affection - affectionDecay),
    });

    this.store.update({ lastOnline: now });
  }

  update(delta: number): void {
    const state = this.store.getState();
    const companion = state.companion;
    const dtHours = delta / 3600;

    if (!companion.sleeping) {
      const hunger = Math.max(0, companion.hunger - HUNGER_PER_HOUR * dtHours * 0.1);
      const fun = Math.max(0, companion.fun - FUN_PER_HOUR * dtHours * 0.1);
      const energy = Math.max(0, companion.energy - 5 * dtHours * 0.1);
      this.store.updateCompanion({ hunger, fun, energy });
    } else {
      const energy = Math.min(100, companion.energy + ENERGY_PER_HOUR_SLEEPING * dtHours * 0.1);
      this.store.updateCompanion({ energy });
    }
  }
}
