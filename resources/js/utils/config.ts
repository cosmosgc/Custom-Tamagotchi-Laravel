function getMeta(name: string): string {
  const el = document.querySelector(`meta[name="${name}"]`);
  return el?.getAttribute('content') ?? '';
}

export const baseUrl = getMeta('base-url');
export const assetUrl = getMeta('asset-url') || baseUrl;

export function resolveAsset(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = assetUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
}

export function resolveApi(path: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
}
