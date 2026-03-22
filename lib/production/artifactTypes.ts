import type { ArtifactType } from '@/types/production';

export const ARTIFACT_TYPE_LABELS: Record<ArtifactType, string> = {
  document: 'Document',
  code: 'Code',
  report: 'Report',
  presentation: 'Presentation',
  data: 'Data',
  media: 'Media',
  other: 'Other',
};

export const ARTIFACT_TYPE_ICONS: Record<ArtifactType, string> = {
  document: '📄',
  code: '💻',
  report: '📊',
  presentation: '📽️',
  data: '🗄️',
  media: '🎬',
  other: '📦',
};

export type ArtifactTypeConfig = {
  label: string;
  icon: string;
  color: string;
};

export function getArtifactTypeConfig(type: ArtifactType): ArtifactTypeConfig {
  return {
    label: ARTIFACT_TYPE_LABELS[type],
    icon: ARTIFACT_TYPE_ICONS[type],
    color: type === 'code' ? 'text-accent-blue' : type === 'report' ? 'text-accent-green' : 'text-pi-gold',
  };
}
