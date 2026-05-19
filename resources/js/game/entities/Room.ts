import { Container, Graphics, Text } from 'pixi.js';
import { GameStore, PlacedFurniture } from '../state/GameStore';
import furnitureData from '../../data/items/furniture.json';
import type { SpritesheetDef } from '../rendering/SpritesheetLoader';

interface RoomConfig {
  name: string;
  background: {
    wallColor: string;
    floorColor: string;
    width: number;
    height: number;
  };
  grid: {
    cols: number;
    rows: number;
    cellSize: number;
  };
  spritesheets?: SpritesheetDef[];
}

interface FurnitureDef {
  id: string;
  label: string;
  color: string;
  width: number;
  height: number;
  interactions: string[];
}

const allFurniture: FurnitureDef[] = furnitureData.furniture;

export class Room {
  public container: Container;
  private config: RoomConfig;
  private store: GameStore;
  private furnitureLayer: Container;
  private gridGfx: Graphics;

  constructor(config: RoomConfig, store: GameStore) {
    this.config = config;
    this.store = store;
    this.container = new Container();
    this.container.label = `room-${config.name}`;
    this.furnitureLayer = new Container();
    this.furnitureLayer.label = 'furniture';
    this.gridGfx = new Graphics();
  }

  init(): void {
    this.drawBackground();
    this.drawGrid();
    this.container.addChild(this.gridGfx);
    this.container.addChild(this.furnitureLayer);
    this.syncFurniture();
  }

  private drawBackground(): void {
    const bg = new Graphics();
    const { width, height, wallColor, floorColor } = this.config.background;

    bg.rect(0, 0, width, height * 0.6);
    bg.fill({ color: wallColor });

    bg.rect(0, height * 0.6, width, height * 0.4);
    bg.fill({ color: floorColor });

    this.container.addChildAt(bg, 0);
  }

  private drawGrid(): void {
    this.gridGfx.clear();
    const { cols, rows, cellSize } = this.config.grid;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * cellSize;
        const y = r * cellSize;
        this.gridGfx.rect(x, y, cellSize, cellSize);
        this.gridGfx.stroke({ width: 1, color: 0x000000, alpha: 0.08 });
      }
    }
  }

  private syncFurniture(): void {
    this.furnitureLayer.removeChildren();
    const placed = this.store.getState().room.furniture;

    placed.forEach((pf) => {
      const def = allFurniture.find((f) => f.id === pf.itemId);
      if (!def) return;
      this.drawFurnitureItem(pf, def);
    });
  }

  private drawFurnitureItem(pf: PlacedFurniture, def: FurnitureDef): void {
    const { cellSize } = this.config.grid;
    const fx = pf.col * cellSize;
    const fy = pf.row * cellSize;
    const fw = def.width * cellSize;
    const fh = def.height * cellSize;

    const g = new Graphics();
    g.roundRect(0, 0, fw, fh, 6);
    g.fill({ color: def.color });
    g.stroke({ width: 2, color: 0x000000, alpha: 0.3 });

    const label = new Text({
      text: def.label,
      style: { fill: 0xffffff, fontSize: 10, fontFamily: 'monospace' },
    });
    label.x = 4;
    label.y = 4;

    const item = new Container();
    item.addChild(g);
    item.addChild(label);
    item.x = fx;
    item.y = fy;
    item.label = `furniture-${def.id}`;
    item.eventMode = 'static';
    item.cursor = 'pointer';

    this.furnitureLayer.addChild(item);
  }

  getCellCenter(col: number, row: number): { x: number; y: number } {
    const { cellSize } = this.config.grid;
    return {
      x: col * cellSize + cellSize / 2,
      y: row * cellSize + cellSize / 2,
    };
  }

  getFurnitureAt(col: number, row: number): PlacedFurniture | undefined {
    return this.store.getState().room.furniture.find(
      (f) => f.col === col && f.row === row
    );
  }

  update(): void {
    this.syncFurniture();
  }

  destroy(): void {
    this.container.removeChildren();
  }
}
