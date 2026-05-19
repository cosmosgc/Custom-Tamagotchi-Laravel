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
import { FurnitureSystem } from '../systems/FurnitureSystem';
import defaultRoomData from '../../data/rooms/default.json';

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
  private furnitureSystem!: FurnitureSystem;
  private infoText: Text = new Text({
    text: '',
    style: {
      fill: 0x333333,
      fontSize: 16,
      fontFamily: 'monospace',
    },
  });

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

    this.room = new Room(defaultRoomData, this.store);
    this.room.init();
    this.container.addChild(this.room.container);
    this.container.swapChildren(this.room.container, this.container.children[0]);

    const config = getDefaultCompanionConfig();
    this.companion = new Companion(config, this.store);
    this.companion.x = 400;
    this.companion.y = 280;
    this.container.addChild(this.companion.container);
    await this.companion.init();

    this.movement = new MovementSystem(this.companion);
    this.idleBehavior = new IdleBehaviorSystem(this.store, this.movement);
    this.furnitureSystem = new FurnitureSystem(this.store, this.room);

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
    this.companion.dialogue.greet();
  }

  update(delta: number): void {
    this.needs.update(delta);
    this.idleBehavior.update(delta);
    this.movement.update();
    this.companion.update(delta);
    this.room.update();
    this.infoText.text = this.formatStatus();
  }

  private createInteractionUI(): void {
    const buttons: { label: string; action: () => void }[] = [
      { label: 'Feed', action: () => this.interaction.feed() },
      { label: 'Pet', action: () => this.interaction.pet() },
      { label: 'Play', action: () => this.interaction.play() },
      { label: 'Clean', action: () => this.interaction.clean() },
      { label: 'Talk', action: () => this.interaction.talk() },
    ];

    const startX = 200;
    buttons.forEach((btn, i) => {
      const bg = new Graphics();
      bg.roundRect(0, 0, 80, 36, 8);
      bg.fill({ color: 0x4a90d9 });

      const txt = new Text({
        text: btn.label,
        style: { fill: 0xffffff, fontSize: 14, fontFamily: 'monospace' },
      });
      txt.anchor.set(0.5);
      txt.x = 40;
      txt.y = 18;

      const btnContainer = new Container();
      btnContainer.addChild(bg);
      btnContainer.addChild(txt);
      btnContainer.x = startX + i * 90;
      btnContainer.y = 520;
      btnContainer.eventMode = 'static';
      btnContainer.cursor = 'pointer';
      btnContainer.on('pointerdown', () => {
        btn.action();
        this.animateButton(btnContainer);
      });

      this.container.addChild(btnContainer);
    });
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
