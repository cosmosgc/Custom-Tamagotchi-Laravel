import { GameStore } from '../state/GameStore';

export type InteractionType = 'feed' | 'pet' | 'play' | 'clean' | 'talk';

export class InteractionSystem {
  private store: GameStore;
  private listeners: Set<(type: InteractionType) => void> = new Set();

  constructor(store: GameStore) {
    this.store = store;
  }

  onInteraction(cb: (type: InteractionType) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  feed(amount: number = 25): InteractionType {
    const s = this.store.getState().companion;
    const hunger = Math.min(100, s.hunger + amount);
    const fun = Math.min(100, s.fun + 3);
    const affection = Math.min(100, s.affection + 2);
    this.store.updateCompanion({ hunger, fun, affection });
    this.emit('feed');
    return 'feed';
  }

  pet(amount: number = 10): InteractionType {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + amount);
    const energy = Math.max(0, s.energy - 2);
    const affection = Math.min(100, s.affection + 5);
    this.store.updateCompanion({ fun, energy, affection });
    this.emit('pet');
    return 'pet';
  }

  play(amount: number = 20): InteractionType {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + amount);
    const energy = Math.max(0, s.energy - 10);
    const hunger = Math.max(0, s.hunger - 5);
    const affection = Math.min(100, s.affection + 3);
    this.store.updateCompanion({ fun, energy, hunger, affection });
    this.emit('play');
    return 'play';
  }

  clean(): InteractionType {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + 5);
    const affection = Math.min(100, s.affection + 1);
    this.store.updateCompanion({ fun, affection });
    this.emit('clean');
    return 'clean';
  }

  talk(): InteractionType {
    const s = this.store.getState().companion;
    const fun = Math.min(100, s.fun + 8);
    const affection = Math.min(100, s.affection + 4);
    this.store.updateCompanion({ fun, affection });
    this.emit('talk');
    return 'talk';
  }

  private emit(type: InteractionType): void {
    this.listeners.forEach((fn) => fn(type));
  }
}
