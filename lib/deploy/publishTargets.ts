import type { PublishTargetType } from '@/types/deploy';

export const PUBLISH_TARGET_TYPES: PublishTargetType[] = ['web', 'cdn', 'api', 'static', 'container'];

export type PublishTargetConfig = {
  label: string;
  icon: string;
  description: string;
};

const PUBLISH_TARGET_CONFIGS: Record<PublishTargetType, PublishTargetConfig> = {
  web: {
    label: 'Web',
    icon: '🌐',
    description: 'Full-stack web application target.',
  },
  cdn: {
    label: 'CDN',
    icon: '⚡',
    description: 'Content delivery network for static assets.',
  },
  api: {
    label: 'API',
    icon: '🔌',
    description: 'REST or GraphQL API endpoint target.',
  },
  static: {
    label: 'Static',
    icon: '📄',
    description: 'Static file hosting target.',
  },
  container: {
    label: 'Container',
    icon: '🐳',
    description: 'Containerized deployment target.',
  },
};

export function getPublishTargetConfig(type: PublishTargetType): PublishTargetConfig {
  return PUBLISH_TARGET_CONFIGS[type];
}
