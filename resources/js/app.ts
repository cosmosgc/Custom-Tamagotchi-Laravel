import Alpine from 'alpinejs';
import { Renderer } from './game/rendering/Renderer';
import { SceneManager } from './game/scenes/SceneManager';
import { MainScene } from './game/scenes/MainScene';
import { GameStore } from './game/state/GameStore';
import { SaveSystem } from './game/systems/SaveSystem';
import { SidebarUI } from './game/ui/SidebarUI';
import { api } from './api/client';
import { fetchItemEffects } from './api/gameDataLoader';

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

    const itemEffects = await fetchItemEffects();
    const effectKeys = new Set(Object.keys(itemEffects));
    this.sidebar.setItemEffects(effectKeys);

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
      (itemId) => this.mainScene.startPlacement(itemId),
      async (itemId) => {
        const def = itemEffects[itemId];
        if (!def) return;
        const state = this.store.getState().companion as Record<string, unknown>;
        const patch: Record<string, number> = {};
        for (const e of def.effects) {
          const val = state[e.stat];
          if (typeof val === 'number') {
            patch[e.stat] = Math.max(0, Math.min(100, val + e.value));
          }
        }
        this.store.updateCompanion(patch as any);
        try {
          await api.removeInventoryItem(itemId);
        } catch { /* ignore */ }
        this.sidebar.refreshInventory();
      }
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

    const coinDisplay = document.getElementById('coin-display');
    const refreshCoins = () => {
      const c = this.store.getState().coins;
      if (coinDisplay) coinDisplay.textContent = String(c);
      if (typeof window.__shopRefreshCoins === 'function') window.__shopRefreshCoins(c);
    };
    refreshCoins();
    this.store.subscribe(() => refreshCoins());

    window.__shopRefreshInventory = () => this.sidebar.refreshInventory();

    try {
      const catRes = await api.get<{ item_id: string; item_type: string; label: string; description: string; price: number; category: string }[]>('/shop/catalog');
      if (Array.isArray(catRes.data) && typeof window.__shopSetItems === 'function') {
        window.__shopSetItems(catRes.data);
      }
    } catch { /* shop catalog will be empty */ }
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
