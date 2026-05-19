import { GameStore } from '../state/GameStore';
import { MovementSystem } from './MovementSystem';
import { randInt } from '../../utils/math';

export class IdleBehaviorSystem {
  private store: GameStore;
  private movement: MovementSystem;
  private timer: number = 0;
  private actionTimer: number = 0;
  private wanderTimer: number = 0;

  constructor(store: GameStore, movement: MovementSystem) {
    this.store = store;
    this.movement = movement;
  }

  update(delta: number): void {
    this.timer += delta;
    this.actionTimer += delta;
    this.wanderTimer += delta;

    if (this.actionTimer >= 180) {
      this.actionTimer = 0;
      this.randomAction();
    }

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
}
