import { Companion } from '../entities/Companion';

export interface MoveGoal {
  x: number;
  y: number;
  onArrive?: () => void;
}

export class MovementSystem {
  private companion: Companion;
  private goal: MoveGoal | null = null;
  private speed: number = 2;
  private arrived: boolean = true;

  constructor(companion: Companion) {
    this.companion = companion;
  }

  moveTo(x: number, y: number, onArrive?: () => void): void {
    this.goal = { x, y, onArrive };
    this.arrived = false;
  }

  update(): void {
    if (!this.goal || this.arrived) return;

    const cx = this.companion.container.x;
    const cy = this.companion.container.y;
    const dx = this.goal.x - cx;
    const dy = this.goal.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed) {
      this.companion.container.x = this.goal.x;
      this.companion.container.y = this.goal.y;
      this.arrived = true;
      this.goal.onArrive?.();
      this.goal = null;
      return;
    }

    this.companion.container.x += (dx / dist) * this.speed;
    this.companion.container.y += (dy / dist) * this.speed;

    this.companion.spriteContainer.scale.x = dx < 0 ? Math.abs(this.companion.spriteContainer.scale.x) : -Math.abs(this.companion.spriteContainer.scale.x);
  }

  isMoving(): boolean {
    return !this.arrived;
  }

  stop(): void {
    this.goal = null;
    this.arrived = true;
  }
}
