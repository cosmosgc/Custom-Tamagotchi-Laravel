import { Container, Sprite } from 'pixi.js';
import { SpritesheetLoader, SpritesheetDef } from '../rendering/SpritesheetLoader';
import { AnimationController, AnimDef } from '../rendering/AnimationController';
import { GameStore } from '../state/GameStore';
import { EmoteSystem } from '../systems/EmoteSystem';
import { DialogueSystem } from '../systems/DialogueSystem';

export interface CompanionConfig {
  name: string;
  scale: number;
  spritesheets: SpritesheetDef[];
  animations: Record<string, AnimDef>;
}

export class Companion {
  public container: Container;
  public spriteContainer: Container;
  private bodySprite: Sprite;
  private expressionSprite: Sprite;
  private animController: AnimationController;
  private expressionController: AnimationController;
  private config: CompanionConfig;
  private store: GameStore;
  public emote: EmoteSystem;
  public dialogue: DialogueSystem;

  constructor(config: CompanionConfig, store: GameStore) {
    this.config = config;
    this.store = store;
    this.container = new Container();
    this.container.label = `companion-${config.name}`;

    this.spriteContainer = new Container();
    this.spriteContainer.label = 'sprites';
    this.container.addChild(this.spriteContainer);

    this.bodySprite = new Sprite();
    this.bodySprite.anchor.set(0.5);
    this.bodySprite.scale.set(config.scale);
    this.spriteContainer.addChild(this.bodySprite);

    this.expressionSprite = new Sprite();
    this.expressionSprite.anchor.set(0.5);
    this.expressionSprite.scale.set(config.scale);
    this.expressionSprite.alpha = 0;
    this.spriteContainer.addChild(this.expressionSprite);

    this.animController = new AnimationController(this.bodySprite);
    this.expressionController = new AnimationController(this.expressionSprite);

    this.emote = new EmoteSystem(this.container);
    this.dialogue = new DialogueSystem(store, this.container);
  }

  get x(): number {
    return this.container.x;
  }

  get y(): number {
    return this.container.y;
  }

  set x(v: number) {
    this.container.x = v;
  }

  set y(v: number) {
    this.container.y = v;
  }

  async init(): Promise<void> {
    const primarySheet = this.config.spritesheets[0];
    const frames = await SpritesheetLoader.load(primarySheet);
    this.animController.setFrames(frames);

    for (let i = 1; i < this.config.spritesheets.length; i++) {
      const sheetFrames = await SpritesheetLoader.load(this.config.spritesheets[i]);
      if (i === 1) {
        this.expressionController.setFrames(sheetFrames);
      }
    }

    this.updateAnimation();
  }

  update(delta: number): void {
    this.animController.update(delta);
    this.expressionController.update(delta);
    this.emote.update(delta);
    this.dialogue.update(delta);
    this.updateAnimation();
  }

  private updateAnimation(): void {
    const needs = this.store.getState().companion;

    let animKey = 'idle';
    if (needs.sleeping) {
      animKey = 'sleep';
    } else if (needs.hunger < 20) {
      animKey = 'hungry';
    } else if (needs.mood === 'happy') {
      animKey = 'happy';
    } else if (needs.mood === 'sad') {
      animKey = 'sad';
    }

    const def = this.config.animations[animKey];
    if (def && this.animController.getCurrentAnim() !== animKey) {
      this.animController.play(def);
    }
  }

  destroy(): void {
    this.emote.destroy();
    this.dialogue.destroy();
    this.container.removeChildren();
  }
}
