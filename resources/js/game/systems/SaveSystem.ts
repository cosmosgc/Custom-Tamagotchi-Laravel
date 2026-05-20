import { GameStore } from '../state/GameStore';
import { api } from '../../api/client';

export class SaveSystem {
  private store: GameStore;
  private saveTimer: number = 0;
  private saveInterval: number = 300;
  private loading: boolean = false;

  constructor(store: GameStore) {
    this.store = store;
  }

  async load(): Promise<void> {
    if (this.loading) return;
    this.loading = true;

    try {
      const [companionRes, roomRes] = await Promise.all([
        api.getCompanion(),
        api.getRoom(),
      ]);

      const cd = companionRes.data;
      const rd = roomRes.data;

      this.store.update({
        companion: {
          hunger: cd.hunger,
          energy: cd.energy,
          fun: cd.fun,
          affection: cd.affection,
          mood: cd.mood as 'happy' | 'neutral' | 'sad' | 'sleepy',
          sleeping: cd.sleeping,
        },
        room: {
          currentRoom: rd.room_id,
          furniture: rd.furniture.map((f) => ({
            itemId: f.itemId,
            col: f.col,
            row: f.row,
            rotation: f.rotation,
          })),
        },
        coins: cd.coins,
        lastOnline: new Date(cd.last_online).getTime(),
      });
    } catch (e) {
      console.warn('Failed to load save data, using defaults', e);
    } finally {
      this.loading = false;
    }
  }

  async saveNow(): Promise<void> {
    const state = this.store.getState();

    try {
      await Promise.all([
        api.saveCompanion({
          hunger: state.companion.hunger,
          energy: state.companion.energy,
          fun: state.companion.fun,
          affection: state.companion.affection,
          mood: state.companion.mood,
          sleeping: state.companion.sleeping,
          coins: state.coins,
        }),
        api.saveRoom({
          room_id: state.room.currentRoom,
          furniture: state.room.furniture,
        }),
      ]);
    } catch (e) {
      console.warn('Failed to save', e);
    }
  }

  update(delta: number): void {
    this.saveTimer += delta;
    if (this.saveTimer >= this.saveInterval) {
      this.saveTimer = 0;
      this.saveNow();
    }
  }
}
