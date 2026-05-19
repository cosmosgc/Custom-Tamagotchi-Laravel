import { GameStore } from '../state/GameStore';
import { MovementSystem } from './MovementSystem';
import { randInt } from '../../utils/math';

export type IdleEvent = 'wake' | 'sleep' | 'emote';

export class IdleBehaviorSystem {
  private store: GameStore;
  private movement: MovementSystem;
  private timer: number = 0;
  private actionTimer: number = 0;
  private wanderTimer: number = 0;
  private sleepTimer: number = 0;
  private listeners: Set<(event: IdleEvent) => void> = new Set();

  constructor(store: GameStore, movement: MovementSystem) {
    this.store = store;
    this.movement = movement;
  }

  onEvent(cb: (event: IdleEvent) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  update(delta: number): void {
    this.timer += delta;
    this.actionTimer += delta;
    this.wanderTimer += delta;
    this.sleepTimer += delta;

    this.tickSleep();
    this.tickActions(delta);
    this.tickWander();
  }

  private tickSleep(): void {
    const s = this.store.getState().companion;

    if (s.energy < 15 && !s.sleeping) {
      this.store.updateCompanion({ sleeping: true });
      this.emit('sleep');
    }

    if (s.sleeping && s.energy >= 90) {
      this.store.updateCompanion({ sleeping: false });
      this.emit('wake');
    }
  }

  private tickActions(_delta: number): void {
    if (this.store.getState().companion.sleeping) return;

    if (this.actionTimer >= 180) {
      this.actionTimer = 0;
      this.randomAction();
    }
  }

  private tickWander(): void {
    if (this.store.getState().companion.sleeping) return;

    if (this.wanderTimer >= 240 && !this.movement.isMoving()) {
      this.wanderTimer = 0;
      this.randomWander();
    }
  }

  private randomAction(): void {
    const actions = ['blink', 'look_around', 'stretch', 'sigh'];
    const action = actions[randInt(0, actions.length - 1)];
    const state = this.store.getState().companion;

    let moodDelta = 0;
    if (action === 'stretch') {
      moodDelta = 1;
    } else if (action === 'sigh') {
      moodDelta = -2;
    }

    const fun = Math.max(0, Math.min(100, state.fun + moodDelta));
    this.store.updateCompanion({ fun });
  }

  private randomWander(): void {
    const range = 100;
    const cx = 400;
    const cy = 280;
    const tx = cx + randInt(-range, range);
    const ty = cy + randInt(-range, range);
    this.movement.moveTo(tx, ty);
  }

  private emit(event: IdleEvent): void {
    this.listeners.forEach((fn) => fn(event));
  }
}
