import { Container, Graphics, Text } from 'pixi.js';
import { GameStore, PlacedFurniture } from '../state/GameStore';
import { fetchFurnitureCatalog } from '../../api/gameDataLoader';
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

export interface FurnitureDef {
  id: string;
  label: string;
  color: string;
  width: number;
  height: number;
  interactions: string[];
  price: number;
}

let allFurniture: FurnitureDef[] = [];
let furnitureLoaded = false;

async function ensureFurnitureLoaded(): Promise<void> {
  if (!furnitureLoaded) {
    allFurniture = await fetchFurnitureCatalog();
    furnitureLoaded = true;
  }
}

export class Room {
  public container: Container;
  public furnitureLayer: Container;
  private config: RoomConfig;
  private store: GameStore;
  private gridGfx: Graphics;
  private bgGfx: Graphics;
  private selectedGfx: Graphics;
  private hoverGfx: Graphics;
  private arrangeMode: boolean = false;
  private selectedFurniture: { col: number; row: number } | null = null;
  private onFurnitureClick: ((itemId: string, col: number, row: number) => void) | null = null;

  constructor(config: RoomConfig, store: GameStore) {
    this.config = config;
    this.store = store;
    this.container = new Container();
    this.container.label = `room-${config.name}`;
    this.furnitureLayer = new Container();
    this.furnitureLayer.label = 'furniture';
    this.gridGfx = new Graphics();
    this.bgGfx = new Graphics();
    this.selectedGfx = new Graphics();
    this.hoverGfx = new Graphics();
  }

  setArrangeMode(enabled: boolean): void {
    this.arrangeMode = enabled;
    this.selectedFurniture = null;
    this.selectedGfx.clear();
    this.hoverGfx.clear();
    this.syncFurniture();
  }

  setFurnitureClickHandler(handler: ((itemId: string, col: number, row: number) => void) | null): void {
    this.onFurnitureClick = handler;
  }

  async init(): Promise<void> {
    await ensureFurnitureLoaded();
    this.drawBackground();
    this.drawGrid();
    this.container.addChild(this.gridGfx);
    this.container.addChild(this.selectedGfx);
    this.container.addChild(this.hoverGfx);
    this.container.addChild(this.furnitureLayer);
    this.syncFurniture();

    this.container.eventMode = 'static';
    this.container.on('pointerdown', (e) => this.handleClick(e));
  }

  private drawBackground(): void {
    this.bgGfx.clear();
    const { width, height, wallColor, floorColor } = this.config.background;

    this.bgGfx.rect(0, 0, width, height * 0.6);
    this.bgGfx.fill({ color: wallColor });

    this.bgGfx.rect(0, height * 0.6, width, height * 0.4);
    this.bgGfx.fill({ color: floorColor });

    this.container.addChildAt(this.bgGfx, 0);
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

  private handleClick(e: { getLocalPosition: (target: Container) => { x: number; y: number } }): void {
    const local = e.getLocalPosition(this.furnitureLayer);
    const { cellSize } = this.config.grid;
    const col = Math.floor(local.x / cellSize);
    const row = Math.floor(local.y / cellSize);
    if (col < 0 || col >= this.config.grid.cols || row < 0 || row >= this.config.grid.rows) return;

    const clicked = this.getFurnitureAt(col, row);

    if (this.arrangeMode) {
      if (clicked) {
        if (this.selectedFurniture?.col === col && this.selectedFurniture?.row === row) {
          this.store.removeFurniture(col, row);
          this.selectedFurniture = null;
          this.selectedGfx.clear();
          this.syncFurniture();
        } else {
          this.selectedFurniture = { col, row };
          this.highlightCell(col, row, 0x00ff00);
          this.syncFurniture();
        }
      } else if (this.selectedFurniture) {
        const def = this.getDefForPlaced(this.selectedFurniture.col, this.selectedFurniture.row);
        if (def) {
          this.store.removeFurniture(this.selectedFurniture.col, this.selectedFurniture.row);
          this.store.placeFurniture(def.id, col, row);
          this.selectedFurniture = null;
          this.selectedGfx.clear();
          this.syncFurniture();
        }
      }
    } else {
      if (clicked) {
        this.onFurnitureClick?.(clicked.itemId, col, row);
      }
    }
  }

  private getDefForPlaced(col: number, row: number): FurnitureDef | undefined {
    const p = this.getFurnitureAt(col, row);
    if (!p) return;
    return allFurniture.find((f) => f.id === p.itemId);
  }

  private highlightCell(col: number, row: number, color: number): void {
    const { cellSize } = this.config.grid;
    this.selectedGfx.clear();
    this.selectedGfx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
    this.selectedGfx.stroke({ width: 3, color, alpha: 0.8 });
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

    const isSelected = this.selectedFurniture?.col === pf.col && this.selectedFurniture?.row === pf.row;

    const g = new Graphics();
    g.roundRect(0, 0, fw, fh, 6);
    g.fill({ color: def.color });
    g.stroke({ width: isSelected ? 3 : 2, color: isSelected ? 0x00ff00 : 0x000000, alpha: isSelected ? 0.9 : 0.3 });

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
    item.cursor = this.arrangeMode ? 'move' : 'pointer';

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

  getFurnitureById(id: string): { col: number; row: number } | undefined {
    return this.store.getState().room.furniture.find((f) => f.itemId === id);
  }

  getDef(id: string): FurnitureDef | undefined {
    return allFurniture.find((f) => f.id === id);
  }

  getGrid(): { cols: number; rows: number; cellSize: number } {
    return this.config.grid;
  }

  isArrangeMode(): boolean {
    return this.arrangeMode;
  }

  update(): void {
    this.syncFurniture();
  }

  destroy(): void {
    this.container.removeChildren();
  }
}
