export interface CompanionState {
  hunger: number;
  energy: number;
  fun: number;
  affection: number;
  sleeping: boolean;
  mood: 'happy' | 'neutral' | 'sad' | 'sleepy';
}

export interface PlacedFurniture {
  itemId: string;
  col: number;
  row: number;
  rotation: number;
}

export interface RoomState {
  currentRoom: string;
  furniture: PlacedFurniture[];
}

export interface GameState {
  companion: CompanionState;
  room: RoomState;
  inventory: string[];
  coins: number;
  lastSave: number;
  lastOnline: number;
}

type Listener = (state: GameState) => void;

const initialState: GameState = {
  companion: {
    hunger: 80,
    energy: 80,
    fun: 50,
    affection: 30,
    sleeping: false,
    mood: 'neutral',
  },
  room: {
    currentRoom: 'default',
    furniture: [
      { itemId: 'bed', col: 3, row: 3, rotation: 0 },
      { itemId: 'bowl', col: 7, row: 5, rotation: 0 },
      { itemId: 'toy_box', col: 8, row: 2, rotation: 0 },
    ],
  },
  inventory: [],
  coins: 0,
  lastSave: Date.now(),
  lastOnline: Date.now(),
};

export class GameStore {
  private state: GameState = { ...initialState, room: { ...initialState.room, furniture: [...initialState.room.furniture] } };
  private listeners: Set<Listener> = new Set();

  constructor(initial?: Partial<GameState>) {
    if (initial) {
      this.state = { ...this.state, ...initial };
      if (initial.companion) {
        this.state.companion = { ...this.state.companion, ...initial.companion };
      }
      if (initial.room) {
        this.state.room = { ...this.state.room, ...initial.room };
      }
    }
  }

  getState(): GameState {
    return this.state;
  }

  update(patch: Partial<GameState>): void {
    this.state = { ...this.state, ...patch };
    if (patch.companion) {
      this.state.companion = { ...this.state.companion, ...patch.companion };
    }
    if (patch.room) {
      this.state.room = { ...this.state.room, ...patch.room };
    }
    this.emit();
  }

  updateCompanion(patch: Partial<CompanionState>): void {
    this.state.companion = { ...this.state.companion, ...patch };
    this.emit();
  }

  updateRoom(patch: Partial<RoomState>): void {
    this.state.room = { ...this.state.room, ...patch };
    this.emit();
  }

  placeFurniture(itemId: string, col: number, row: number): void {
    const existing = this.state.room.furniture.findIndex(
      (f) => f.col === col && f.row === row
    );
    if (existing >= 0) {
      this.state.room.furniture[existing] = { itemId, col, row, rotation: 0 };
    } else {
      this.state.room.furniture.push({ itemId, col, row, rotation: 0 });
    }
    this.emit();
  }

  removeFurniture(col: number, row: number): void {
    this.state.room.furniture = this.state.room.furniture.filter(
      (f) => f.col !== col || f.row !== row
    );
    this.emit();
  }

  removeFromInventory(itemId: string): void {
    this.state.inventory = this.state.inventory.filter((id) => id !== itemId);
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.state = { ...initialState, room: { ...initialState.room, furniture: [...initialState.room.furniture] } };
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((fn) => fn(this.state));
  }

  toJSON(): GameState {
    return { ...this.state, lastSave: Date.now() };
  }

  static fromJSON(data: GameState): GameStore {
    return new GameStore(data);
  }
}
