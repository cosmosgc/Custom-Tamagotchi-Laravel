import { api, InventoryItemData } from '../../api/client';

type VisitUserCallback = (userId: number, userName: string) => void;
type PlaceItemCallback = (itemId: string) => void;
type UseItemCallback = (itemId: string) => void;

export class SidebarUI {
  private onVisit: VisitUserCallback | null = null;
  private saveCb: (() => void) | null = null;
  private onPlaceItem: PlaceItemCallback | null = null;
  private onUseItem: UseItemCallback | null = null;
  private itemEffects: Set<string> = new Set();

  setCallbacks(onVisit: VisitUserCallback, saveCb: () => void, onPlaceItem?: PlaceItemCallback, onUseItem?: UseItemCallback): void {
    this.onVisit = onVisit;
    this.saveCb = saveCb;
    this.onPlaceItem = onPlaceItem ?? null;
    this.onUseItem = onUseItem ?? null;
  }

  setItemEffects(effects: Set<string>): void {
    this.itemEffects = effects;
  }

  async refreshUsers(): Promise<void> {
    const container = document.getElementById('user-list');
    if (!container) return;

    try {
      const res = await api.getUsers();
      const users = res.data;

      if (!users.length) {
        container.innerHTML = '<p class="text-gray-400">No other users yet</p>';
        return;
      }

      container.innerHTML = users
        .map(
          (u) =>
            `<button class="visit-user-btn w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" data-user-id="${u.id}" data-user-name="${u.name}">
              ${u.name}
            </button>`
        )
        .join('');

      container.querySelectorAll('.visit-user-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = parseInt((btn as HTMLElement).dataset.userId!);
          const name = (btn as HTMLElement).dataset.userName!;
          this.onVisit?.(id, name);
        });
      });
    } catch {
      container.innerHTML = '<p class="text-red-400">Failed to load users</p>';
    }
  }

  async refreshInventory(): Promise<void> {
    const container = document.getElementById('inventory-list');
    if (!container) return;

    try {
      const res = await api.getInventory();
      const items = res.data;

      if (!items.length) {
        container.innerHTML = '<p class="text-gray-400">No items yet</p>';
        return;
      }

      container.innerHTML = items
        .map((item) => {
          const hasEffect = this.itemEffects.has(item.item_id);
          const actions = [];
          if (hasEffect) {
            actions.push(`<button class="use-item-btn text-xs px-2 py-0.5 bg-green-600 text-white rounded hover:bg-green-700" data-item-id="${item.item_id}">Use</button>`);
          }
          actions.push(`<button class="place-item-btn text-xs px-2 py-0.5 bg-indigo-600 text-white rounded hover:bg-indigo-700" data-item-id="${item.item_id}">Place</button>`);
          return `<div class="flex justify-between items-center py-1 border-b dark:border-gray-700 last:border-0">
            <span>${item.item_id}</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-400 text-xs">x${item.quantity}</span>
              ${actions.join('')}
            </div>
          </div>`;
        })
        .join('');

      container.querySelectorAll('.place-item-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemId = (btn as HTMLElement).dataset.itemId!;
          this.onPlaceItem?.(itemId);
        });
      });
      container.querySelectorAll('.use-item-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const itemId = (btn as HTMLElement).dataset.itemId!;
          this.onUseItem?.(itemId);
        });
      });
    } catch {
      container.innerHTML = '<p class="text-red-400">Failed to load inventory</p>';
    }
  }

  wireSaveButton(): void {
    const btn = document.getElementById('save-now-btn');
    btn?.addEventListener('click', () => this.saveCb?.());
  }
}
