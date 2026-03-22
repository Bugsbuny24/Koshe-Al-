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

const ARTIFACT_TYPE_COLORS: Record<ArtifactType, string> = {
  document: 'text-pi-gold',
  code: 'text-accent-blue',
  report: 'text-accent-green',
  presentation: 'text-pi-gold',
  data: 'text-accent-blue',
  media: 'text-accent-green',
  other: 'text-slate-400',
};

export function getArtifactTypeConfig(type: ArtifactType): ArtifactTypeConfig {
  return {
    label: ARTIFACT_TYPE_LABELS[type],
    icon: ARTIFACT_TYPE_ICONS[type],
    color: ARTIFACT_TYPE_COLORS[type],
  };
}
