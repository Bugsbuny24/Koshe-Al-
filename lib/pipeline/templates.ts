/**
 * Built-in pipeline templates — inspired by Dify's workflow template library.
 *
 * Dify ships a set of ready-made workflow templates (sentiment analysis,
 * translation, summarisation, etc.) that users can import and customise.
 * These Koschei pipeline templates follow the same philosophy: composable,
 * pre-wired nodes that cover common AI work patterns.
 */

import type { Pipeline } from '@/types/pipeline';

function now(): string {
  return new Date().toISOString();
}

// ── 1. Brief → Full Execution Plan ───────────────────────────────────────────

const EXECUTION_PLAN_PIPELINE: Pipeline = {
  id: 'koschei-execution-plan-v1',
  name: 'Execution Plan',
  description:
    'Brief\'i gereksinimlere, mimariye, görev listesine ve teslim kontrolüne dönüştürür. Koschei\'nin temel V2 Execution Core akışını dört ayrı LLM adımına böler.',
  entryNodeId: 'n1',
  nodes: [
    {
      id: 'n1',
      label: 'Gereksinim Çıkarımı',
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Sen bir yazılım analisti ve iş analistisin.
Aşağıdaki kullanıcı brief'ini analiz et ve gereksinim çıkarımı yap.

Brief: {{input}}

JSON formatında yanıtla:
{
  "project_type": "...",
  "business_goal": "...",
  "target_user": "...",
  "core_features": [],
  "estimated_complexity": "low|medium|high",
  "suggested_stack": []
}`,
        jsonMode: true,
        outputKey: 'requirements',
        temperature: 0.3,
      },
    },
    {
      id: 'n2',
      label: 'Mimari Planlama',
      dependsOn: ['n1'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Aşağıdaki gereksinimlere dayanarak yazılım mimarisi planı oluştur.

Gereksinimler: {{requirements}}

JSON formatında yanıtla:
{
  "recommended_stack": [],
  "frontend": "...",
  "backend": "...",
  "database": "...",
  "architecture_notes": []
}`,
        jsonMode: true,
        outputKey: 'architecture',
        temperature: 0.3,
      },
    },
    {
      id: 'n3',
      label: 'Görev Kırılımı',
      dependsOn: ['n1', 'n2'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Gereksinimler ve mimari plana göre görev listesi oluştur.

Gereksinimler: {{requirements}}
Mimari: {{architecture}}

JSON formatında yanıtla:
{
  "phases": [
    {
      "title": "...",
      "goal": "...",
      "tasks": [{ "id": "t1", "title": "...", "priority": "high|medium|low", "estimated_output": "..." }]
    }
  ],
  "milestone_suggestions": []
}`,
        jsonMode: true,
        outputKey: 'tasks',
        temperature: 0.4,
      },
    },
    {
      id: 'n4',
      label: 'Teslim Checklist',
      dependsOn: ['n1', 'n2', 'n3'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Proje teslim öncesi kontrol listesi oluştur.

Gereksinimler: {{requirements}}
Mimari: {{architecture}}

JSON formatında yanıtla:
{
  "checklist_title": "...",
  "items": [{ "title": "...", "category": "scope|technical|qa|handoff", "required": true }],
  "handoff_notes": [],
  "acceptance_checkpoints": []
}`,
        jsonMode: true,
        outputKey: 'checklist',
        temperature: 0.3,
      },
    },
    {
      id: 'n5',
      label: 'Sonuç Toplama',
      dependsOn: ['n4'],
      config: {
        type: 'output',
        collectKeys: ['requirements', 'architecture', 'tasks', 'checklist'],
      },
    },
  ],
  createdAt: now(),
  updatedAt: now(),
};

// ── 2. Content Summariser ─────────────────────────────────────────────────────

const CONTENT_SUMMARISER_PIPELINE: Pipeline = {
  id: 'koschei-content-summariser-v1',
  name: 'İçerik Özetleyici',
  description:
    'Uzun bir metni önce ana başlıklara böler, ardından her başlığı özetler ve son olarak tek bir özet paragraf üretir.',
  entryNodeId: 'cs1',
  nodes: [
    {
      id: 'cs1',
      label: 'Başlık Çıkarımı',
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Aşağıdaki metindeki ana başlıkları ve bölümleri tespit et.

Metin: {{input}}

JSON formatında yanıtla: { "sections": ["başlık1", "başlık2", ...] }`,
        jsonMode: true,
        outputKey: 'sections',
        temperature: 0.2,
      },
    },
    {
      id: 'cs2',
      label: 'Detaylı Özet',
      dependsOn: ['cs1'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Aşağıdaki metni bölüm bölüm özetle.

Metin: {{input}}
Bölümler: {{sections}}

Her bölüm için 2-3 cümlelik özet yaz. Türkçe yanıtla.`,
        jsonMode: false,
        outputKey: 'detailed_summary',
        temperature: 0.4,
      },
    },
    {
      id: 'cs3',
      label: 'Kısa Özet',
      dependsOn: ['cs2'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Aşağıdaki detaylı özeti tek bir paragrafta özetle. Maksimum 100 kelime.

Detaylı özet: {{detailed_summary}}`,
        jsonMode: false,
        outputKey: 'short_summary',
        temperature: 0.3,
      },
    },
    {
      id: 'cs4',
      label: 'Sonuç Toplama',
      dependsOn: ['cs3'],
      config: {
        type: 'output',
        collectKeys: ['sections', 'detailed_summary', 'short_summary'],
      },
    },
  ],
  createdAt: now(),
  updatedAt: now(),
};

// ── 3. Marketing Copy Generator ───────────────────────────────────────────────

const MARKETING_COPY_PIPELINE: Pipeline = {
  id: 'koschei-marketing-copy-v1',
  name: 'Pazarlama Metni Üretici',
  description:
    'Ürün veya hizmet bilgisinden hedef kitle analizi yaparak landing page için başlık, alt başlık, özellik listesi ve CTA metni üretir.',
  entryNodeId: 'mc1',
  nodes: [
    {
      id: 'mc1',
      label: 'Hedef Kitle Analizi',
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Aşağıdaki ürün/hizmet bilgisinden hedef kitle profili çıkar.

Ürün: {{input}}

JSON formatında yanıtla:
{
  "primary_audience": "...",
  "pain_points": [],
  "key_benefits": [],
  "tone": "professional|casual|exciting"
}`,
        jsonMode: true,
        outputKey: 'audience',
        temperature: 0.4,
      },
    },
    {
      id: 'mc2',
      label: 'Başlık ve Slogan',
      dependsOn: ['mc1'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Ürün için etkileyici başlık ve slogan yaz.

Ürün: {{input}}
Hedef kitle: {{audience}}

JSON formatında 3 seçenek sun:
{ "options": [{ "headline": "...", "subheadline": "...", "cta": "..." }] }`,
        jsonMode: true,
        outputKey: 'headlines',
        temperature: 0.7,
      },
    },
    {
      id: 'mc3',
      label: 'Özellik Listesi',
      dependsOn: ['mc1'],
      config: {
        type: 'llm',
        model: 'gemini-2.5-flash',
        promptTemplate: `Landing page için özellik kartları yaz.

Ürün: {{input}}
Hedef kitle acıları: {{audience}}

JSON formatında yanıtla:
{ "features": [{ "title": "...", "description": "...", "icon_hint": "..." }] }`,
        jsonMode: true,
        outputKey: 'features',
        temperature: 0.6,
      },
    },
    {
      id: 'mc4',
      label: 'Sonuç Toplama',
      dependsOn: ['mc2', 'mc3'],
      config: {
        type: 'output',
        collectKeys: ['audience', 'headlines', 'features'],
      },
    },
  ],
  createdAt: now(),
  updatedAt: now(),
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const PIPELINE_TEMPLATES: Pipeline[] = [
  EXECUTION_PLAN_PIPELINE,
  CONTENT_SUMMARISER_PIPELINE,
  MARKETING_COPY_PIPELINE,
];

export function getPipelineById(id: string): Pipeline | undefined {
  return PIPELINE_TEMPLATES.find((p) => p.id === id);
}
