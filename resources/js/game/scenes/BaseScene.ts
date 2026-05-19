import { Container } from 'pixi.js';

export abstract class BaseScene {
  public container: Container;
  public label: string;

  constructor(label: string) {
    this.label = label;
    this.container = new Container();
    this.container.label = label;
  }

  abstract init(): Promise<void> | void;
  abstract update(delta: number): void;
  abstract destroy(): void;
}
