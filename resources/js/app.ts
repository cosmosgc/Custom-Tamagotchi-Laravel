import Alpine from 'alpinejs';
import { Renderer } from './game/rendering/Renderer';
import { SceneManager } from './game/scenes/SceneManager';
import { MainScene } from './game/scenes/MainScene';
import { GameStore } from './game/state/GameStore';
import { SaveSystem } from './game/systems/SaveSystem';
import { SidebarUI } from './game/ui/SidebarUI';
import { api } from './api/client';

window.Alpine = Alpine;
Alpine.start();

class Game {
  private renderer!: Renderer;
  private scenes!: SceneManager;
  private store: GameStore;
  private saveSystem!: SaveSystem;
  private sidebar: SidebarUI;
  private running = false;
  private mainScene!: MainScene;

  constructor() {
    this.store = new GameStore();
    this.sidebar = new SidebarUI();
  }

  async init(canvasId: string = 'game-canvas'): Promise<void> {
    this.saveSystem = new SaveSystem(this.store);
    await this.saveSystem.load();

    this.mainScene = new MainScene(this.store);
    this.sidebar.setCallbacks(
      async (userId) => {
        try {
          const res = await api.getUserCompanion(userId);
          if (res.data) {
            this.store.update({
              companion: {
                hunger: res.data.hunger,
                energy: res.data.energy,
                fun: res.data.fun,
                affection: res.data.affection,
                mood: res.data.mood as 'happy' | 'neutral' | 'sad' | 'sleepy',
                sleeping: res.data.sleeping,
              },
            });
          }
        } catch {
          console.warn('Failed to load user companion');
        }
      },
      () => this.saveSystem.saveNow(),
      (itemId) => this.mainScene.startPlacement(itemId)
    );

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

    this.mainScene.setAfterPlacementCallback(() => this.sidebar.refreshInventory());
    this.scenes.register(this.mainScene);
    await this.scenes.switchTo('main');

    this.running = true;
    this.renderer.app.ticker.add((ticker) => this.update(ticker.deltaTime));

    this.sidebar.refreshUsers();
    this.sidebar.refreshInventory();
    this.sidebar.wireSaveButton();
  }

  private update(delta: number): void {
    if (!this.running) return;
    this.saveSystem.update(delta);
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
