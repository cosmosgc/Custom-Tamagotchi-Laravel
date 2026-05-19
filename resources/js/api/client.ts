import { resolveApi } from '../utils/config';

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
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
}

export const api = new ApiClient();
