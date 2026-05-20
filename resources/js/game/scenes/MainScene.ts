import { Container, Graphics, Text } from 'pixi.js';
import { BaseScene } from './BaseScene';
import { GameStore } from '../state/GameStore';
import { Companion } from '../entities/Companion';
import { Room } from '../entities/Room';
import { getDefaultCompanionConfig } from '../entities/CompanionConfig';
import { TimeSimulationSystem } from '../systems/TimeSimulationSystem';
import { NeedsSystem } from '../systems/NeedsSystem';
import { IdleBehaviorSystem } from '../systems/IdleBehaviorSystem';
import { InteractionSystem, InteractionType } from '../systems/InteractionSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { FurnitureInteractionSystem } from '../systems/FurnitureInteractionSystem';
import { fetchRoomTemplate } from '../../api/gameDataLoader';
import { api } from '../../api/client';
import { FurnitureInfoPanel } from '../ui/FurnitureInfoPanel';

type MoodKey = 'happy' | 'neutral' | 'sad' | 'sleepy' | 'hungry' | 'greeting';

const INTERACTION_EMOTE: Record<InteractionType, string> = {
  feed: 'feed',
  pet: 'pet',
  play: 'play',
  clean: 'clean',
  talk: 'talk',
};

const INTERACTION_DIALOGUE: Record<InteractionType, MoodKey> = {
  feed: 'happy',
  pet: 'happy',
  play: 'happy',
  clean: 'neutral',
  talk: 'happy',
};

export class MainScene extends BaseScene {
  private store: GameStore;
  private companion!: Companion;
  private room!: Room;
  private needs: NeedsSystem;
  private idleBehavior!: IdleBehaviorSystem;
  private interaction: InteractionSystem;
  private movement!: MovementSystem;
  private furnitureInteraction!: FurnitureInteractionSystem;
  private infoText: Text = new Text({
    text: '',
    style: {
      fill: 0x333333,
      fontSize: 16,
      fontFamily: 'monospace',
    },
  });
  private modeText: Text = new Text({
    text: '',
    style: {
      fill: 0xffffff,
      fontSize: 12,
      fontFamily: 'monospace',
    },
  });
  private arrangeMode: boolean = false;
  private placementItemId: string | null = null;
  private furniturePanel: FurnitureInfoPanel;
  private afterPlacementCb: (() => void) | null = null;

  constructor(store: GameStore) {
    super('main');
    this.store = store;

    const timeSim = new TimeSimulationSystem(store);
    this.needs = new NeedsSystem(store, timeSim);
    this.interaction = new InteractionSystem(store);
  }

  async init(): Promise<void> {
    this.container.removeChildren();

    this.needs.processOffline();

    const roomData = await fetchRoomTemplate('default');
    this.room = new Room(roomData, this.store);
    await this.room.init();
    this.container.addChild(this.room.container);
    this.container.swapChildren(this.room.container, this.container.children[0]);

    const config = await getDefaultCompanionConfig();
    this.companion = new Companion(config, this.store);
    this.companion.x = 400;
    this.companion.y = 280;
    this.container.addChild(this.companion.container);
    await this.companion.init();

    this.movement = new MovementSystem(this.companion);
    this.idleBehavior = new IdleBehaviorSystem(this.store, this.movement);
    this.furnitureInteraction = new FurnitureInteractionSystem(
      this.store, this.movement, this.interaction, this.room
    );

    this.furniturePanel = new FurnitureInfoPanel();
    this.furniturePanel.onAction('use', () => {
      const id = this.furniturePanel.getCurrentItemId();
      if (id) this.furnitureInteraction.interactWithFurniture(id);
      this.furniturePanel.hide();
    });
    this.furniturePanel.onAction('pickup', async () => {
      const id = this.furniturePanel.getCurrentItemId();
      if (!id) return;
      const def = this.room.getDef(id);
      if (!def) return;
      try {
        await api.addInventoryItem(id);
        const placed = this.store.getState().room.furniture.find((f) => f.itemId === id);
        if (placed) this.store.removeFurniture(placed.col, placed.row);
      } catch { /* ignore */ }
      this.furniturePanel.hide();
    });
    this.furniturePanel.onAction('remove', () => {
      const id = this.furniturePanel.getCurrentItemId();
      if (!id) return;
      const item = this.store.getState().room.furniture.find((f) => f.itemId === id);
      if (item) {
        this.store.removeFurniture(item.col, item.row);
      }
      this.furniturePanel.hide();
    });
    this.container.addChild(this.furniturePanel.container);

    this.room.setFurnitureClickHandler((itemId, col, row) => {
      if (this.placementItemId) return;
      if (this.arrangeMode) return;
      if (this.furniturePanel.isVisible()) {
        this.furniturePanel.hide();
        return;
      }
      const def = this.room.getDef(itemId);
      if (def) {
        const pos = this.room.getCellCenter(col, row);
        this.furniturePanel.show(itemId, def, pos.x + this.room.container.x, pos.y + this.room.container.y);
      }
    });

    this.room.container.on('pointerdown', (e) => {
      if (!this.placementItemId) return;
      const local = e.getLocalPosition(this.room.furnitureLayer);
      const { cellSize } = this.room.getGrid();
      const col = Math.floor(local.x / cellSize);
      const row = Math.floor(local.y / cellSize);
      const grid = this.room.getGrid();
      if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return;
      if (this.room.getFurnitureAt(col, row)) return;

      this.store.placeFurniture(this.placementItemId, col, row);
      this.store.removeFromInventory(this.placementItemId);
      api.removeInventoryItem(this.placementItemId).catch(() => {});
      this.placementItemId = null;
      this.afterPlacementCb?.();
      this.updateModeDisplay();
    });

    this.idleBehavior.onEvent((event) => {
      if (event === 'sleep') {
        this.companion.emote.show('sleep');
        this.companion.dialogue.say('sleepy');
      } else if (event === 'wake') {
        this.companion.emote.show('wake');
      }
    });

    this.interaction.onInteraction((type) => {
      this.companion.emote.show(INTERACTION_EMOTE[type]);
      this.companion.dialogue.say(INTERACTION_DIALOGUE[type]);
    });

    this.modeText = new Text({
      text: '',
      style: {
        fill: 0xffffff,
        fontSize: 12,
        fontFamily: 'monospace',
      },
    });
    this.modeText.x = 10;
    this.modeText.y = 5;
    this.container.addChild(this.modeText);

    this.infoText = new Text({
      text: this.formatStatus(),
      style: {
        fill: 0x333333,
        fontSize: 16,
        fontFamily: 'monospace',
      },
    });
    this.infoText.y = 450;
    this.container.addChild(this.infoText);

    this.createInteractionUI();
    this.updateModeDisplay();
    this.companion.dialogue.greet();
  }

  update(delta: number): void {
    this.needs.update(delta);
    this.idleBehavior.update(delta);
    this.movement.update();
    this.furnitureInteraction.update(delta);
    this.companion.update(delta);
    this.room.update();
    this.infoText.text = this.formatStatus();
  }

  private toggleArrangeMode(): void {
    if (this.placementItemId) {
      this.placementItemId = null;
    } else {
      this.arrangeMode = !this.arrangeMode;
      this.room.setArrangeMode(this.arrangeMode);
    }
    this.updateModeDisplay();
  }

  setAfterPlacementCallback(cb: () => void): void {
    this.afterPlacementCb = cb;
  }

  startPlacement(itemId: string): void {
    this.placementItemId = itemId;
    this.updateModeDisplay();
  }

  private updateModeDisplay(): void {
    if (this.placementItemId) {
      this.modeText.text = `PLACING: ${this.placementItemId} — click an empty cell to place`;
    } else if (this.arrangeMode) {
      this.modeText.text = 'ARRANGE MODE: Click furniture to select, click empty cell to move';
    } else {
      this.modeText.text = '';
    }
  }

  private createInteractionUI(): void {
    const buttons: { label: string; action: () => void; color?: number }[] = [
      { label: 'Feed', action: () => this.interaction.feed() },
      { label: 'Pet', action: () => this.interaction.pet() },
      { label: 'Play', action: () => this.interaction.play() },
      { label: 'Clean', action: () => this.interaction.clean() },
      { label: 'Talk', action: () => this.interaction.talk() },
    ];

    const startX = 140;
    buttons.forEach((btn, i) => {
      const bg = new Graphics();
      bg.roundRect(0, 0, 72, 32, 6);
      bg.fill({ color: btn.color ?? 0x4a90d9 });

      const txt = new Text({
        text: btn.label,
        style: { fill: 0xffffff, fontSize: 13, fontFamily: 'monospace' },
      });
      txt.anchor.set(0.5);
      txt.x = 36;
      txt.y = 16;

      const btnContainer = new Container();
      btnContainer.addChild(bg);
      btnContainer.addChild(txt);
      btnContainer.x = startX + i * 80;
      btnContainer.y = 490;
      btnContainer.eventMode = 'static';
      btnContainer.cursor = 'pointer';
      btnContainer.on('pointerdown', () => {
        btn.action();
        this.animateButton(btnContainer);
      });

      this.container.addChild(btnContainer);
    });

    const arrangeBtn = new Graphics();
    arrangeBtn.roundRect(0, 0, 100, 32, 6);
    arrangeBtn.fill({ color: 0x8b4513 });

    const arrangeTxt = new Text({
      text: 'Rearrange',
      style: { fill: 0xffffff, fontSize: 13, fontFamily: 'monospace' },
    });
    arrangeTxt.anchor.set(0.5);
    arrangeTxt.x = 50;
    arrangeTxt.y = 16;

    const arrangeContainer = new Container();
    arrangeContainer.addChild(arrangeBtn);
    arrangeContainer.addChild(arrangeTxt);
    arrangeContainer.x = 700;
    arrangeContainer.y = 490;
    arrangeContainer.eventMode = 'static';
    arrangeContainer.cursor = 'pointer';
    arrangeContainer.on('pointerdown', () => {
      this.toggleArrangeMode();
      this.animateButton(arrangeContainer);
    });

    this.container.addChild(arrangeContainer);

    this.infoText.y = 530;
  }

  private animateButton(btn: Container): void {
    btn.scale.set(0.9);
    setTimeout(() => btn.scale.set(1), 100);
  }

  private formatStatus(): string {
    const s = this.store.getState().companion;
    return [
      `Hunger: ${Math.round(s.hunger)}%`,
      `Energy: ${Math.round(s.energy)}%`,
      `Fun: ${Math.round(s.fun)}%`,
      `Affection: ${Math.round(s.affection)}%`,
      `Mood: ${s.mood}`,
      s.sleeping ? '💤' : '',
    ].join('  |  ');
  }

  destroy(): void {
    this.companion?.destroy();
    this.room?.destroy();
    this.container.removeChildren();
  }
}
