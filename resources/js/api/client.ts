import { resolveApi } from '../utils/config';

function csrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface CompanionData {
  id: number;
  user_id: number;
  name: string;
  species: string;
  companion_config: string;
  hunger: number;
  energy: number;
  fun: number;
  affection: number;
  mood: string;
  sleeping: boolean;
  coins: number;
  last_online: string;
}

export interface RoomData {
  id: number;
  user_id: number;
  room_id: string;
  furniture: { itemId: string; col: number; row: number; rotation: number }[];
}

export interface InventoryItemData {
  id: number;
  user_id: number;
  item_id: string;
  item_type: string;
  quantity: number;
}

export interface CatalogItemData {
  id: number;
  item_id: string;
  label: string;
  color: string;
  width: number;
  height: number;
  interactions: string[];
  price: number;
}

export interface UserData {
  id: number;
  name: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? resolveApi('api');
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken(),
      'X-Requested-With': 'XMLHttpRequest',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  async post<T>(path: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  async put<T>(path: string, body?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }

  async getCompanion(): Promise<ApiResponse<CompanionData>> {
    return this.get<CompanionData>('/companion');
  }

  async saveCompanion(data: Partial<CompanionData>): Promise<ApiResponse<CompanionData>> {
    return this.put<CompanionData>('/companion', data as unknown as Record<string, unknown>);
  }

  async getRoom(): Promise<ApiResponse<RoomData>> {
    return this.get<RoomData>('/room');
  }

  async saveRoom(data: { room_id?: string; furniture?: RoomData['furniture'] }): Promise<ApiResponse<RoomData>> {
    return this.put<RoomData>('/room', data as unknown as Record<string, unknown>);
  }

  async getInventory(): Promise<ApiResponse<InventoryItemData[]>> {
    return this.get<InventoryItemData[]>('/inventory');
  }

  async getUsers(): Promise<ApiResponse<UserData[]>> {
    return this.get<UserData[]>('/users');
  }

  async getUserCompanion(userId: number): Promise<ApiResponse<CompanionData | null>> {
    return this.get<CompanionData | null>(`/companion/user/${userId}`);
  }

  async addInventoryItem(itemId: string, itemType = 'furniture', quantity = 1): Promise<ApiResponse<InventoryItemData>> {
    return this.post<InventoryItemData>('/inventory/add', { item_id: itemId, item_type: itemType, quantity });
  }

  async removeInventoryItem(itemId: string): Promise<ApiResponse<unknown>> {
    return this.delete<unknown>(`/inventory/remove/${itemId}`);
  }
}

export const api = new ApiClient();
