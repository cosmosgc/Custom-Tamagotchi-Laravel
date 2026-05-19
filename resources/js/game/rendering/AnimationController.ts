import { Texture, Sprite } from 'pixi.js';

export interface AnimDef {
  spritesheet: string;
  frames: number[];
  speed: number;
  loop: boolean;
}

export class AnimationController {
  private sprite: Sprite;
  private frames: Texture[] = [];
  private currentAnim: string | null = null;
  private animDef: AnimDef | null = null;
  private frameIndex: number = 0;
  private timer: number = 0;
  private finished: boolean = false;
  private onComplete: (() => void) | null = null;

  constructor(sprite: Sprite) {
    this.sprite = sprite;
  }

  setFrames(frames: Texture[]): void {
    this.frames = frames;
  }

  play(animDef: AnimDef, onComplete?: () => void): void {
    if (this.currentAnim && !this.animDef?.loop && !this.finished) {
      return;
    }

    this.animDef = animDef;
    this.frameIndex = 0;
    this.timer = 0;
    this.finished = false;
    this.onComplete = onComplete ?? null;
    this.applyFrame();
  }

  update(delta: number): void {
    if (!this.animDef || this.finished) return;

    this.timer += delta * this.animDef.speed;

    if (this.timer >= 1) {
      this.timer = 0;
      this.frameIndex++;

      if (this.frameIndex >= this.animDef.frames.length) {
        if (this.animDef.loop) {
          this.frameIndex = 0;
        } else {
          this.frameIndex = this.animDef.frames.length - 1;
          this.finished = true;
          this.onComplete?.();
          return;
        }
      }

      this.applyFrame();
    }
  }

  private applyFrame(): void {
    if (!this.animDef) return;
    const frameIdx = this.animDef.frames[this.frameIndex];
    const tex = this.frames[frameIdx];
    if (tex) {
      this.sprite.texture = tex;
    }
  }

  isFinished(): boolean {
    return this.finished;
  }

  getCurrentAnim(): string | null {
    return this.currentAnim;
  }
}
