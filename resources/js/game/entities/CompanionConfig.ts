import type { CompanionConfig } from './Companion';
import { fetchAnimationConfig } from '../../api/gameDataLoader';

export async function getDefaultCompanionConfig(): Promise<CompanionConfig> {
  const data = await fetchAnimationConfig('default');
  return {
    name: 'Milo',
    scale: 2,
    spritesheets: data.spritesheets,
    animations: data.animations,
  };
}
