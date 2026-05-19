import { GameStore } from '../state/GameStore';
import { TimeSimulationSystem } from './TimeSimulationSystem';

export class NeedsSystem {
  private store: GameStore;
  private timeSim: TimeSimulationSystem;
  private timer: number = 0;

  constructor(store: GameStore, timeSim: TimeSimulationSystem) {
    this.store = store;
    this.timeSim = timeSim;
  }

  processOffline(): void {
    this.timeSim.processOfflineTime();
  }

  update(delta: number): void {
    this.timeSim.update(delta);
    this.timer += delta;

    if (this.timer >= 60) {
      this.timer = 0;
      this.tick();
    }
  }

  private tick(): void {
    const s = this.store.getState().companion;

    let mood = s.mood;

    if (s.sleeping) {
      mood = 'sleepy';
    } else if (s.hunger < 20) {
      mood = 'sad';
    } else if (s.energy < 15) {
      mood = 'sleepy';
    } else if (s.hunger > 60 && s.energy > 60 && s.affection > 50) {
      mood = 'happy';
    } else if (s.fun < 30) {
      mood = 'sad';
    } else {
      mood = 'neutral';
    }

    this.store.updateCompanion({ mood });
  }
}
