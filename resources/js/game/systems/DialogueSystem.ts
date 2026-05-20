import { Container, Graphics, Text } from 'pixi.js';
import { GameStore } from '../state/GameStore';
import { randInt } from '../../utils/math';
import { fetchDialogue } from '../../api/gameDataLoader';

type MoodKey = 'happy' | 'neutral' | 'sad' | 'sleepy' | 'hungry' | 'greeting';

export class DialogueSystem {
  private store: GameStore;
  private bubble: Container;
  private bubbleBg: Graphics;
  private bubbleText: Text;
  private visible: boolean = false;
  private hideTimer: number = 0;
  private showTimer: number = 0;
  private lines: Record<string, string[]> = {};

  constructor(store: GameStore, parent: Container) {
    this.store = store;

    this.bubbleBg = new Graphics();
    this.bubbleText = new Text({
      text: '',
      style: { fill: 0x333333, fontSize: 13, fontFamily: 'monospace', wordWrap: true, wordWrapWidth: 160 },
    });
    this.bubbleText.x = 8;
    this.bubbleText.y = 6;

    this.bubble = new Container();
    this.bubble.addChild(this.bubbleBg);
    this.bubble.addChild(this.bubbleText);
    this.bubble.visible = false;
    parent.addChild(this.bubble);
  }

  async init(configKey = 'default'): Promise<void> {
    try {
      const data = await fetchDialogue(configKey);
      this.lines = data.lines ?? {};
    } catch {
      this.lines = {};
    }
  }

  say(mood: MoodKey, overrideText?: string): void {
    const moodLines = this.lines[mood];
    if (!moodLines || moodLines.length === 0) return;

    const text = overrideText ?? moodLines[randInt(0, moodLines.length - 1)];
    this.bubbleText.text = text;

    const padding = 8;
    const tw = this.bubbleText.width + padding * 2;
    const th = this.bubbleText.height + padding * 2;

    this.bubbleBg.clear();
    this.bubbleBg.roundRect(0, 0, tw, th, 8);
    this.bubbleBg.fill({ color: 0xffffff, alpha: 0.9 });
    this.bubbleBg.stroke({ width: 2, color: 0x333333, alpha: 0.3 });

    this.bubble.x = 50;
    this.bubble.y = -70;
    this.bubble.visible = true;
    this.visible = true;
    this.hideTimer = 0;
    this.showTimer = 0;
  }

  greet(): void {
    const affection = this.store.getState().companion.affection;
    this.say('greeting');
  }

  update(delta: number): void {
    if (!this.visible) {
      this.showTimer += delta;
      if (this.showTimer >= 300) {
        const state = this.store.getState().companion;
        const key = state.hunger < 20 ? 'hungry' : state.mood;
        this.say(key as MoodKey);
        this.showTimer = 0;
      }
      return;
    }

    this.hideTimer += delta;
    if (this.hideTimer >= 180) {
      this.bubble.visible = false;
      this.visible = false;
    }
  }

  destroy(): void {
    this.bubble.removeChildren();
  }
}
