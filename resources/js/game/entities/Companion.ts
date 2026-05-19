import { Container, Sprite } from 'pixi.js';
import { SpritesheetLoader, SpritesheetDef } from '../rendering/SpritesheetLoader';
import { AnimationController, AnimDef } from '../rendering/AnimationController';
import { GameStore } from '../state/GameStore';

export interface CompanionConfig {
  name: string;
  scale: number;
  spritesheets: SpritesheetDef[];
  animations: Record<string, AnimDef>;
}

export class Companion {
  public container: Container;
  private bodySprite: Sprite;
  private animController: AnimationController;
  private config: CompanionConfig;
  private store: GameStore;

  constructor(config: CompanionConfig, store: GameStore) {
    this.config = config;
    this.store = store;
    this.container = new Container();
    this.container.label = `companion-${config.name}`;

    this.bodySprite = new Sprite();
    this.bodySprite.anchor.set(0.5);
    this.bodySprite.scale.set(config.scale);
    this.container.addChild(this.bodySprite);

    this.animController = new AnimationController(this.bodySprite);
  }

  async init(): Promise<void> {
    const primarySheet = this.config.spritesheets[0];
    const frames = await SpritesheetLoader.load(primarySheet);
    this.animController.setFrames(frames);

    for (let i = 1; i < this.config.spritesheets.length; i++) {
      await SpritesheetLoader.load(this.config.spritesheets[i]);
    }

    this.updateAnimation();
  }

  update(delta: number): void {
    this.animController.update(delta);
    this.updateAnimation();
  }

  private updateAnimation(): void {
    const mood = this.store.getState().companion.mood;
    const needs = this.store.getState().companion;

    let animKey = 'idle';

    if (needs.hunger < 20) {
      animKey = 'hungry';
    } else if (needs.energy < 15) {
      animKey = 'sleep';
    } else if (mood === 'happy') {
      animKey = 'happy';
    } else if (mood === 'sad') {
      animKey = 'sad';
    }

    const def = this.config.animations[animKey];
    if (def && this.animController.getCurrentAnim() !== animKey) {
      this.animController.play(def);
    }
  }

  destroy(): void {
    this.container.removeChildren();
  }
}
