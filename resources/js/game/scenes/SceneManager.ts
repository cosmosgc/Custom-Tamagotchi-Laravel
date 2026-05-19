import { Container } from 'pixi.js';
import { BaseScene } from './BaseScene';

export class SceneManager {
  private scenes: Map<string, BaseScene> = new Map();
  private currentScene: BaseScene | null = null;
  private layer: Container;

  constructor(layer: Container) {
    this.layer = layer;
  }

  register(scene: BaseScene): void {
    this.scenes.set(scene.label, scene);
  }

  async switchTo(label: string): Promise<void> {
    const next = this.scenes.get(label);
    if (!next) {
      console.warn(`Scene "${label}" not found`);
      return;
    }

    if (this.currentScene) {
      this.layer.removeChild(this.currentScene.container);
      this.currentScene.destroy();
    }

    this.currentScene = next;
    this.layer.addChild(next.container);
    await next.init();
  }

  update(delta: number): void {
    this.currentScene?.update(delta);
  }

  destroy(): void {
    this.scenes.forEach((scene) => scene.destroy());
    this.scenes.clear();
    this.currentScene = null;
  }
}
