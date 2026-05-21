import { api } from './client';

interface SpritesheetDef {
  id: string;
  src: string;
  frameWidth: number;
  frameHeight: number;
  rows: number;
  cols: number;
}

interface AnimDef {
  spritesheet: string;
  frames: number[];
  speed: number;
  loop: boolean;
}

interface DialogueSet {
  lines: Record<string, string[]>;
}

interface FurnitureDef {
  id: string;
  item_id: string;
  label: string;
  color: string;
  width: number;
  height: number;
  interactions: string[];
  price: number;
}

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
  furnitureSlots: { id: string; col: number; row: number; label: string }[];
}

export async function fetchAnimationConfig(configKey = 'default'): Promise<{
  spritesheets: SpritesheetDef[];
  animations: Record<string, AnimDef>;
}> {
  const res = await api.get<{ spritesheets: SpritesheetDef[]; animations: Record<string, AnimDef> }>(
    `/game-data/animations/${configKey}`
  );
  return res.data;
}

export async function fetchDialogue(configKey = 'default'): Promise<DialogueSet> {
  const res = await api.get<DialogueSet>(`/game-data/dialogue/${configKey}`);
  return res.data;
}

export async function fetchRoomTemplate(configKey = 'default'): Promise<RoomConfig> {
  const res = await api.get<RoomConfig>(`/game-data/room-template/${configKey}`);
  return res.data;
}

export interface ItemEffectDef {
  item_type: string;
  effects: { stat: string; value: number }[];
}

export async function fetchItemEffects(): Promise<Record<string, ItemEffectDef>> {
  const res = await api.get<Record<string, ItemEffectDef>>('/game-data/item-effects');
  return res.data ?? {};
}

export async function fetchFurnitureCatalog(): Promise<FurnitureDef[]> {
  const res = await api.get<FurnitureDef[]>('/catalog');
  return (Array.isArray(res.data) ? res.data : []).map((f: any) => ({
    id: f.item_id ?? f.id,
    item_id: f.item_id,
    label: f.label,
    color: f.color,
    width: f.width ?? 1,
    height: f.height ?? 1,
    interactions: f.interactions ?? [],
    price: f.price ?? 0,
  }));
}
