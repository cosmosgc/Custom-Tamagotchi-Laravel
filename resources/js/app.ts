import Alpine from 'alpinejs';
import { Renderer } from './game/rendering/Renderer';
import { SceneManager } from './game/scenes/SceneManager';
import { MainScene } from './game/scenes/MainScene';
import { GameStore } from './game/state/GameStore';

window.Alpine = Alpine;
Alpine.start();

class Game {
  private renderer!: Renderer;
  private scenes!: SceneManager;
  private store: GameStore;
  private running = false;

  constructor() {
    this.store = new GameStore();
  }

  async init(canvasId: string = 'game-canvas'): Promise<void> {
    this.renderer = await Renderer.create(800, 600);
    const canvas = this.renderer.canvas;
    canvas.id = canvasId;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';

    const container = document.getElementById('game-container');
    if (container) {
      container.appendChild(canvas);
      container.style.position = 'relative';
    } else {
      document.body.appendChild(canvas);
    }

    this.renderer.addLayer('scene', 0);

    this.scenes = new SceneManager(this.renderer.getLayer('scene')!);

    this.scenes.register(new MainScene(this.store));
    await this.scenes.switchTo('main');

    this.running = true;
    this.renderer.app.ticker.add((ticker) => this.update(ticker.deltaTime));
  }

  private update(delta: number): void {
    if (!this.running) return;
    this.scenes.update(delta);
  }

  destroy(): void {
    this.running = false;
    this.scenes.destroy();
    this.renderer.destroy();
  }
}

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  game.init();
});
