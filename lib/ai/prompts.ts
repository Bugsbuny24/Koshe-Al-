export function buildBriefCleanerPrompt(
  rawBrief: string,
  niche?: string,
  serviceType?: string
): string {
  return `Sen bir freelance proje yöneticisisin. Aşağıdaki ham müşteri briefini analiz et ve yapılandırılmış JSON çıktısı üret.

${niche ? `Sektör: ${niche}` : ''}
${serviceType ? `Hizmet türü: ${serviceType}` : ''}

Ham brief:
"""
${rawBrief}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "summary": "Projenin net ve öz özeti (2-3 cümle)",
  "objectives": ["Hedef 1", "Hedef 2"],
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "missing_information": ["Eksik bilgi 1", "Eksik bilgi 2"],
  "risks": ["Risk 1", "Risk 2"],
  "suggested_title": "Proje için önerilen başlık"
}`;
}

export function buildScopeBuilderPrompt(projectContext: string): string {
  return `Sen bir freelance proje yöneticisisin. Aşağıdaki proje bilgisini kullanarak detaylı bir proje scope belgesi oluştur.

Proje bağlamı:
"""
${projectContext}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "summary": "Scope özeti (2-3 cümle)",
  "objectives": ["Hedef 1", "Hedef 2"],
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "exclusions": ["Kapsam dışı madde 1", "Kapsam dışı madde 2"],
  "risks": ["Risk 1", "Risk 2"],
  "questions": ["Açık soru 1", "Açık soru 2"],
  "estimated_timeline": ["Aşama 1: X gün", "Aşama 2: Y gün"]
}`;
}

export function buildDraftGeneratorPrompt(
  projectContext: string,
  deliverables: string[]
): string {
  const deliverablesList = deliverables.join('\n- ');
  return `Sen bir profesyonel metin yazarısın (copywriter). Aşağıdaki proje için içerik taslakları oluştur.

Proje bağlamı:
"""
${projectContext}
"""

Üretilmesi gereken deliverable'lar:
- ${deliverablesList}

Her deliverable için bir taslak oluştur. Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "drafts": [
    {
      "draft_type": "deliverable-slug (örn: landing-page-copy)",
      "title": "Taslak başlığı",
      "content": "Taslak içeriği (markdown formatında olabilir)"
    }
  ]
}`;
}

export function buildRevisionInterpreterPrompt(
  rawFeedback: string,
  currentScope: string
): string {
  return `Sen bir freelance proje yöneticisisin. Müşteri geri bildirimini mevcut proje scope'u ile karşılaştırarak analiz et.

Mevcut scope:
"""
${currentScope}
"""

Müşteri geri bildirimi:
"""
${rawFeedback}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "summary": "Geri bildirimin özeti (1-2 cümle)",
  "scope_status": "in_scope | partially_out_of_scope | out_of_scope",
  "requested_changes": ["İstenen değişiklik 1", "İstenen değişiklik 2"],
  "affected_sections": ["Etkilenen bölüm 1", "Etkilenen bölüm 2"],
  "action_items": ["Aksiyon 1", "Aksiyon 2"],
  "client_reply_suggestion": "Müşteriye önerilen yanıt metni"
}`;
}

export function buildDeliveryComposerPrompt(
  projectContext: string,
  draftsText: string
): string {
  return `Sen bir freelance proje yöneticisisin. Tamamlanan proje için profesyonel bir teslim paketi oluştur.

Proje bağlamı:
"""
${projectContext}
"""

Hazırlanan içerikler:
"""
${draftsText}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "delivery_summary": "Teslim paketinin özeti (2-3 cümle)",
  "client_message": "Müşteriye gönderilecek teslim mesajı (profesyonel ve sıcak ton)",
  "assets": ["Teslim edilecek dosya/içerik 1", "Teslim edilecek dosya/içerik 2"],
  "next_steps": ["Sonraki adım 1", "Sonraki adım 2"]
}`;
}

export function buildScopeLockPrompt(rawScopeText: string): string {
  return `Sen bir freelance proje yöneticisisin. Aşağıdaki ham scope metnini analiz et ve yapılandırılmış bir scope lock belgesi oluştur.

Ham scope metni:
"""
${rawScopeText}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "summary": "Scope özeti (2-3 cümle)",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "exclusions": ["Kapsam dışı madde 1", "Kapsam dışı madde 2"],
  "revision_policy": ["Revizyon politikası maddesi 1", "Revizyon politikası maddesi 2"],
  "acceptance_criteria": ["Kabul kriteri 1", "Kabul kriteri 2"]
}`;
}

export function buildMilestonePlanPrompt(summaryText: string, totalAmount: number, mode?: string): string {
  return `Sen bir freelance proje yöneticisisin. Aşağıdaki proje için milestone planı oluştur.

Proje özeti:
"""
${summaryText}
"""

Toplam tutar: ${totalAmount} USD
Dağılım modu: ${mode || 'standard'}

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "milestones": [
    {
      "title": "Milestone başlığı",
      "description": "Milestone açıklaması",
      "amount": 400,
      "sort_order": 1
    }
  ]
}`;
}

export function buildRevisionParsePrompt(rawFeedback: string, scopeSummary: string): string {
  return `Sen bir freelance proje yöneticisisin. Müşteri geri bildirimini mevcut scope ile karşılaştırarak analiz et.

Mevcut scope özeti:
"""
${scopeSummary}
"""

Müşteri geri bildirimi:
"""
${rawFeedback}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "summary": "Geri bildirimin özeti (1-2 cümle)",
  "scope_status": "in_scope",
  "requested_changes": ["İstenen değişiklik 1", "İstenen değişiklik 2"],
  "action_items": ["Aksiyon 1", "Aksiyon 2"]
}

scope_status değeri: "in_scope", "partially_out_of_scope" veya "out_of_scope" olabilir.`;
}

export function buildDeliverySummaryPrompt(deliveryNote: string, scopeSummary: string): string {
  return `Sen bir freelance proje yöneticisisin. Teslim notuna göre müşteriye sunulacak bir teslimat özeti oluştur.

Scope özeti:
"""
${scopeSummary}
"""

Teslim notu:
"""
${deliveryNote}
"""

Yalnızca aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:

{
  "delivery_summary": "Teslimat özeti (2-3 cümle)",
  "client_message": "Müşteriye gönderilecek mesaj (profesyonel ton)",
  "evidence_points": ["Kanıt noktası 1", "Kanıt noktası 2"]
}`;
}
