import { Assets, Texture, Rectangle } from 'pixi.js';
import { resolveAsset } from '../../utils/config';

export interface SpritesheetDef {
  id: string;
  src: string;
  frameWidth: number;
  frameHeight: number;
  rows: number;
  cols: number;
}

export class SpritesheetLoader {
  private static cache: Map<string, Texture[]> = new Map();

  static async load(def: SpritesheetDef): Promise<Texture[]> {
    const key = def.id;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const resolved = resolveAsset(def.src);
    const sheet = await Assets.load<Texture>(resolved);
    const frames: Texture[] = [];

    for (let row = 0; row < def.rows; row++) {
      for (let col = 0; col < def.cols; col++) {
        const x = col * def.frameWidth;
        const y = row * def.frameHeight;
        const region = new Rectangle(x, y, def.frameWidth, def.frameHeight);
        const frame = new Texture({
          source: sheet.source,
          frame: region,
        });
        frames.push(frame);
      }
    }

    this.cache.set(key, frames);
    return frames;
  }

  static getSheet(id: string): Texture[] | undefined {
    return this.cache.get(id);
  }

  static clear(): void {
    this.cache.clear();
  }
}
