import type { RequirementExtractionResult, ArchitecturePlanResult, TaskBreakdownResult } from '@/types/execution';

export function buildRequirementExtractorPrompt(brief: string, templateId?: string | null): string {
  return `Sen bir yazılım proje danışmanısın. Kullanıcının ham brief'ini analiz et ve teknik gereksinimleri çıkar.

${templateId ? `Seçilen şablon: ${templateId}` : ''}

Ham brief:
"""
${brief}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "project_type": "Proje türü (örn: landing page, web app, mobile app)",
  "business_goal": "İş hedefi (1-2 cümle)",
  "target_user": "Hedef kullanıcı kitlesi",
  "core_features": ["Temel özellik 1", "Temel özellik 2"],
  "optional_features": ["Opsiyonel özellik 1", "Opsiyonel özellik 2"],
  "technical_requirements": ["Teknik gereksinim 1", "Teknik gereksinim 2"],
  "integrations": ["Entegrasyon 1", "Entegrasyon 2"],
  "constraints": ["Kısıt 1", "Kısıt 2"],
  "risks": ["Risk 1", "Risk 2"],
  "unknowns": ["Bilinmeyen 1", "Bilinmeyen 2"],
  "recommended_template": null,
  "estimated_complexity": "low",
  "suggested_stack": ["Next.js", "Tailwind CSS"]
}

estimated_complexity değeri: "low", "medium" veya "high" olabilir.
recommended_template: eğer uygun bir şablon varsa şablon id'sini yaz (örn: "hotel-landing"), yoksa null bırak.`;
}

export function buildArchitecturePlannerPrompt(requirement: RequirementExtractionResult): string {
  return `Sen bir yazılım mimarısın. Aşağıdaki proje gereksinimlerine göre teknik mimari planı oluştur.

Proje gereksinimleri:
"""
${JSON.stringify(requirement, null, 2)}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "recommended_stack": ["Next.js", "Supabase", "Tailwind CSS"],
  "frontend": "Next.js 15 App Router",
  "backend": "Next.js API Routes",
  "database": "Supabase PostgreSQL",
  "auth": "Supabase Auth",
  "deployment": "Vercel",
  "external_services": ["WhatsApp Business API"],
  "pages": ["/", "/about", "/contact"],
  "components": ["Hero", "ContactForm", "Footer"],
  "data_entities": ["User", "Inquiry"],
  "api_endpoints": ["POST /api/contact", "GET /api/health"],
  "architecture_notes": ["Mobile-first tasarım", "SEO optimizasyonu gerekli"],
  "delivery_strategy": ["Aşama 1: Temel sayfa yapısı", "Aşama 2: Entegrasyonlar"],
  "scalability_notes": ["Başlangıçta statik site yeterli"]
}`;
}

export function buildTaskBreakdownPrompt(
  requirement: RequirementExtractionResult,
  architecture: ArchitecturePlanResult
): string {
  return `Sen bir yazılım proje yöneticisisin. Aşağıdaki gereksinimler ve mimari plana göre yapılabilir görevlere böl.

Gereksinimler:
"""
${JSON.stringify(requirement, null, 2)}
"""

Mimari plan:
"""
${JSON.stringify(architecture, null, 2)}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "phases": [
    {
      "title": "Faz 1: Kurulum ve Temel Yapı",
      "goal": "Projenin temel yapısını kur",
      "tasks": [
        {
          "id": "t1",
          "title": "Proje kurulumu",
          "description": "Next.js projesi oluştur ve temel bağımlılıkları yükle",
          "priority": "high",
          "difficulty": "low",
          "depends_on": [],
          "estimated_output": "Çalışır proje iskeleti"
        }
      ]
    }
  ],
  "milestone_suggestions": [
    {
      "title": "Milestone 1: Temel Yapı",
      "description": "Proje iskeleti ve temel sayfalar hazır",
      "suggested_percentage": 30
    }
  ]
}

priority değeri: "high", "medium" veya "low".
difficulty değeri: "low", "medium" veya "high".`;
}

export function buildDeliveryChecklistPrompt(
  requirement: RequirementExtractionResult,
  architecture: ArchitecturePlanResult,
  tasks: TaskBreakdownResult,
  scopeText?: string,
  milestoneMode?: string
): string {
  return `Sen bir yazılım proje yöneticisisin. Aşağıdaki proje bilgilerine göre teslim checklist'i oluştur.

${scopeText ? `Scope metni:\n"""\n${scopeText}\n"""\n` : ''}
Gereksinimler: ${JSON.stringify(requirement.core_features)}
Mimari özeti: ${JSON.stringify(architecture.recommended_stack)}
Görev fazları: ${tasks.phases.map((p) => p.title).join(', ')}
Milestone modu: ${milestoneMode || 'standard'}

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "checklist_title": "Proje Teslim Checklist'i",
  "items": [
    {
      "title": "Temel sayfalar tamamlandı",
      "description": "Tüm ana sayfalar tasarlandı ve geliştirildi",
      "category": "scope",
      "required": true
    },
    {
      "title": "Mobil uyumluluk test edildi",
      "description": "Tüm sayfalar mobil cihazlarda test edildi",
      "category": "qa",
      "required": true
    }
  ],
  "handoff_notes": ["Kaynak kodlar GitHub reposunda", "Deploy linki paylaşıldı"],
  "acceptance_checkpoints": ["Tüm sayfalar açılıyor", "Formlar çalışıyor"]
}

category değeri: "scope", "technical", "content", "qa" veya "handoff" olabilir.`;
}
