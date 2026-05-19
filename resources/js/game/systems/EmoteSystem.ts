import { Container, Graphics, Text } from 'pixi.js';

const EMOTE_MAP: Record<string, { icon: string; color: number }> = {
  feed: { icon: '🍽️', color: 0xff6347 },
  pet: { icon: '❤️', color: 0xff69b4 },
  play: { icon: '🎮', color: 0x32cd32 },
  clean: { icon: '✨', color: 0x00bfff },
  talk: { icon: '💬', color: 0x9370db },
  sleep: { icon: '💤', color: 0x8b8b8b },
  wake: { icon: '☀️', color: 0xffd700 },
  hungry: { icon: '🍞', color: 0xcd853f },
  happy: { icon: '⭐', color: 0xffd700 },
};

export class EmoteSystem {
  private emote: Container;
  private emoteText: Text;
  private timer: number = 0;
  private showing: boolean = false;
  private duration: number = 60;

  constructor(parent: Container) {
    this.emoteText = new Text({
      text: '',
      style: { fontSize: 28 },
    });
    this.emoteText.anchor.set(0.5);

    this.emote = new Container();
    this.emote.addChild(this.emoteText);
    this.emote.visible = false;
    this.emote.y = -40;
    parent.addChild(this.emote);
  }

  show(type: string): void {
    const entry = EMOTE_MAP[type];
    if (!entry) return;

    this.emoteText.text = entry.icon;
    this.emote.visible = true;
    this.showing = true;
    this.timer = 0;
    this.duration = type === 'sleep' ? 120 : 50;
  }

  update(delta: number): void {
    if (!this.showing) return;

    this.timer += delta;
    if (this.timer >= this.duration) {
      this.emote.visible = false;
      this.showing = false;
      return;
    }

    this.emote.y = -40 - Math.abs(Math.sin(this.timer * 0.05) * 10);
    this.emote.alpha = Math.max(0, 1 - this.timer / this.duration);
  }

  destroy(): void {
    this.emote.removeChildren();
  }
}
