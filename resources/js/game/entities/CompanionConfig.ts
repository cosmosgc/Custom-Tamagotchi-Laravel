import type { CompanionConfig } from './Companion';
import defaultAnimData from '../../data/animations/default.json';

export function getDefaultCompanionConfig(): CompanionConfig {
  return {
    name: 'Milo',
    scale: 2,
    spritesheets: defaultAnimData.spritesheets,
    animations: defaultAnimData.animations,
  };
}
