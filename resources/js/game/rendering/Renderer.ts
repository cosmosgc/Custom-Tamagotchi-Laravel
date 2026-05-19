import { Application, Container, Graphics } from 'pixi.js';

export class Renderer {
  public app: Application;
  public stage: Container;
  private layers: Map<string, Container> = new Map();

  private constructor(app: Application) {
    this.app = app;
    this.stage = app.stage;
  }

  static async create(width: number, height: number): Promise<Renderer> {
    const app = new Application();
    await app.init({
      width,
      height,
      backgroundColor: 0x87ceeb,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    return new Renderer(app);
  }

  addLayer(name: string, zIndex: number = 0): Container {
    const layer = new Container();
    layer.label = name;
    layer.zIndex = zIndex;
    this.stage.addChild(layer);
    this.layers.set(name, layer);
    this.stage.sortableChildren = true;
    return layer;
  }

  getLayer(name: string): Container | undefined {
    return this.layers.get(name);
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas;
  }

  get screenWidth(): number {
    return this.app.screen.width;
  }

  get screenHeight(): number {
    return this.app.screen.height;
  }

  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  destroy(): void {
    this.app.destroy(true);
  }
}
