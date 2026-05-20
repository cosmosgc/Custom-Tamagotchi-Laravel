import { Container, Graphics, Text } from 'pixi.js';
import { api } from '../../api/client';
import type { FurnitureDef } from '../entities/Room';

type PanelAction = 'use' | 'pickup' | 'remove';

export class FurnitureInfoPanel {
  public container: Container;
  private bg: Graphics;
  private titleText: Text;
  private descText: Text;
  private closeBtn: Container;
  private actionCallbacks: Map<PanelAction, () => void> = new Map();
  private currentItemId: string | null = null;
  private buttons: Container[] = [];

  constructor() {
    this.container = new Container();
    this.container.label = 'furniture-info-panel';
    this.container.visible = false;
    this.container.eventMode = 'static';

    this.bg = new Graphics();

    this.titleText = new Text({
      text: '',
      style: { fill: 0xffffff, fontSize: 15, fontFamily: 'monospace', fontWeight: 'bold' },
    });
    this.titleText.x = 12;
    this.titleText.y = 10;

    this.descText = new Text({
      text: '',
      style: { fill: 0xcccccc, fontSize: 11, fontFamily: 'monospace' },
    });
    this.descText.x = 12;
    this.descText.y = 32;

    this.closeBtn = this.makeButton('X', 0xcc4444, 28, 20);
    this.closeBtn.x = 214;
    this.closeBtn.y = 6;
    this.closeBtn.on('pointerdown', () => this.hide());

    this.container.addChild(this.bg, this.titleText, this.descText, this.closeBtn);
  }

  private makeButton(label: string, color: number, w: number, h: number): Container {
    const bg = new Graphics();
    bg.roundRect(0, 0, w, h, 4);
    bg.fill({ color });

    const txt = new Text({
      text: label,
      style: { fill: 0xffffff, fontSize: 11, fontFamily: 'monospace' },
    });
    txt.anchor.set(0.5);
    txt.x = w / 2;
    txt.y = h / 2;

    const btn = new Container();
    btn.addChild(bg, txt);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    return btn;
  }

  show(itemId: string, def: FurnitureDef, x: number, y: number): void {
    this.currentItemId = itemId;
    this.titleText.text = def.label;
    this.descText.text = `${def.width}x${def.height} cells | ${def.interactions.join(', ') || 'decorative'}`;

    this.closeBtn.visible = true;

    const pw = 240;
    const ph = 120;

    this.bg.clear();
    this.bg.roundRect(0, 0, pw, ph, 8);
    this.bg.fill({ color: 0x222222, alpha: 0.92 });
    this.bg.stroke({ width: 2, color: def.color });

    this.clearButtons();
    const actions: { label: string; color: number; action: PanelAction }[] = [
      { label: 'Use', color: 0x4a90d9, action: 'use' },
      { label: 'Pick Up', color: 0xcc8b22, action: 'pickup' },
      { label: 'Remove', color: 0xcc4444, action: 'remove' },
    ];

    actions.forEach((a, i) => {
      const btn = this.makeButton(a.label, a.color, 68, 28);
      btn.x = 12 + i * 78;
      btn.y = 80;
      btn.on('pointerdown', () => this.actionCallbacks.get(a.action)?.());
      this.buttons.push(btn);
      this.container.addChild(btn);
    });

    this.container.x = Math.min(x, 800 - pw - 10);
    this.container.y = Math.min(y, 600 - ph - 10);
    this.container.visible = true;
  }

  onAction(action: PanelAction, cb: () => void): void {
    this.actionCallbacks.set(action, cb);
  }

  getCurrentItemId(): string | null {
    return this.currentItemId;
  }

  hide(): void {
    this.container.visible = false;
    this.currentItemId = null;
    this.clearButtons();
  }

  isVisible(): boolean {
    return this.container.visible;
  }

  private clearButtons(): void {
    this.buttons.forEach((b) => {
      b.removeAllListeners();
      this.container.removeChild(b);
    });
    this.buttons = [];
  }
}
