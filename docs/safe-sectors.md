# Safe Sectors for Industry Packs (V13–V15)

> This document defines which industry sectors are approved targets for Koschei Industry Packs
> and which sectors are explicitly prohibited. All Industry Pack implementations must validate
> against this list before scaffolding or shipping.

---

## ✅ Safe Sectors

These sectors are approved for Industry Pack development. They involve marketing, operations,
content, and business services that do not require regulated professional advice or high-stakes
automated decisions.

### 1. Tourism

**Slug:** `tourism`

**Description:** Travel agencies, tour operators, booking services, hospitality businesses, and destination marketing organizations.

**Typical use cases:**
- AI-generated destination guides and itineraries
- Automated booking inquiry responses
- Social media content for tourism campaigns
- Seasonal promotion planning

**Koschei capabilities applicable:** Intake, Proposal Engine, Production Engine, Deploy Connectors, Industry Pack templates

---

### 2. E-commerce

**Slug:** `ecommerce`

**Description:** Online stores, dropshippers, product-based businesses, and marketplaces.

**Typical use cases:**
- Product description generation
- Campaign planning and ad copy
- Customer retention email sequences
- Launch strategy proposals

**Koschei capabilities applicable:** Proposal Engine, Production Engine, Revenue Operator, Sector Workflows

---

### 3. Agencies

**Slug:** `agencies`

**Description:** Marketing agencies, creative agencies, PR firms, and consultancies that sell services to other businesses.

**Typical use cases:**
- Client proposal generation
- Campaign brief and strategy documents
- Deliverable production at scale
- Internal SOP automation

**Koschei capabilities applicable:** Full platform (V1–V15), Autonomous Units, Operations Operator

---

### 4. Services

**Slug:** `services`

**Description:** General B2B and B2C service businesses: cleaning, home services, coaching, consulting, and professional services (excluding regulated advice).

**Typical use cases:**
- Service proposal automation
- Onboarding document generation
- Email follow-up sequences
- Client reporting

**Koschei capabilities applicable:** Intake, Proposal Engine, Production Engine, Deploy Connectors

---

### 5. Real Estate Marketing

**Slug:** `real-estate-marketing`

**Description:** Real estate agents, property marketers, and listing services. Scoped to **marketing and content only** — not investment advice, mortgage guidance, or financial returns analysis.

**Typical use cases:**
- Property listing copy generation
- Social media content for listings
- Email campaign automation
- Virtual tour script writing

**Boundary:** Must not produce financial return projections, mortgage advice, or investment recommendations. Those functions fall under the prohibited investment advice category.

**Koschei capabilities applicable:** Proposal Engine, Production Engine, Industry Pack templates, Sector Knowledge

---

### 6. Education Content

**Slug:** `education-content`

**Description:** Online course creators, tutors, curriculum designers, and educational content publishers. Scoped to **content and curriculum** — not student assessment, credentialing, or clinical educational therapy.

**Typical use cases:**
- Course outline generation
- Lesson plan drafting
- Email nurture for course sales
- Social media content for educators

**Boundary:** Must not produce medical or psychological educational content (e.g., therapy scripts, clinical training materials). Must not automate grading of credentialed assessments.

**Koschei capabilities applicable:** Proposal Engine, Production Engine, Sector Knowledge, Sector Workflows

---

### 7. Small Business Ops

**Slug:** `small-business-ops`

**Description:** General small business operational support: SOPs, communications, admin automation, and internal documentation.

**Typical use cases:**
- SOP drafting and formatting
- Internal communication templates
- Staff onboarding document generation
- Business process documentation

**Koschei capabilities applicable:** Operations Operator, Production Engine, Team OS, Sector Workflows

---

## 🚫 Prohibited (Risky) Sectors

The following sectors **must not be implemented** in any Koschei Industry Pack, Sector Knowledge base, or Sector Workflow.

These restrictions exist because:
1. Automated AI decisions in these domains can cause severe real-world harm
2. Regulated professional licensing exists specifically to protect people in these domains
3. Liability and regulatory exposure would be unacceptable

---

### ❌ Legal

Includes: contract generation presented as legal advice, legal strategy, court filing assistance, legal rights interpretation.

**Why prohibited:** The practice of law requires licensed professionals. AI-generated legal advice without attorney oversight creates serious liability and can directly harm users who rely on it.

**Note:** General document formatting or internal business template generation (e.g., a non-disclosure agreement template with a "consult your attorney" disclaimer) falls in a grey area and must be reviewed case by case.

---

### ❌ Healthcare

Includes: medical diagnosis support, clinical decision support, patient treatment plans, drug interaction checking, symptom assessment.

**Why prohibited:** Medical decisions require licensed clinicians. AI errors in healthcare can directly cause physical harm or death. Regulated under HIPAA and equivalent global frameworks.

---

### ❌ Investment Advice

Includes: stock picking, portfolio allocation recommendations, return projections presented as advice, financial planning guidance beyond basic budgeting.

**Why prohibited:** Investment advice is regulated by financial authorities (SEC, FCA, ASIC, etc.). Automated investment recommendations without proper licensing expose the platform to severe regulatory penalties.

---

### ❌ Credit / Insurance Decision Systems

Includes: automated credit scoring, loan approval recommendations, insurance underwriting automation, risk classification for financial products.

**Why prohibited:** These systems are heavily regulated under fair lending and anti-discrimination law (ECOA, FCRA, EU AI Act high-risk classification). Automated decisions in this domain must meet strict explainability and fairness standards that are not compatible with general-purpose AI generation.

---

### ❌ Medical

Includes: medical content generation for patient-facing clinical settings, AI-generated prescriptions, dosage calculators, clinical trial matching, mental health crisis intervention scripts.

**Why prohibited:** Overlaps with healthcare prohibition. Distinct callout for content generation specifically — generating medical content for direct patient consumption without clinical review is prohibited.

---

### ❌ Active Cybersecurity Intervention

Includes: automated penetration testing execution, vulnerability exploitation, active threat response that modifies production systems, offensive security tooling.

**Why prohibited:** Active cybersecurity interventions can cause damage to third-party systems, violate computer fraud laws (CFAA, Computer Misuse Act), and create uncontrollable blast radius from automated actions.

**Note:** Passive security auditing tools, compliance checklists, and security awareness content are not prohibited.

---

## Validation Gate

Before any Industry Pack is scaffolded, the following check must pass:

```typescript
import { SAFE_SECTORS, PROHIBITED_SECTORS } from '@/lib/features/capabilities';

function validateSector(slug: string): boolean {
  if ((PROHIBITED_SECTORS as readonly string[]).includes(slug)) {
    throw new Error(`Sector "${slug}" is prohibited. See docs/safe-sectors.md.`);
  }
  return (SAFE_SECTORS as readonly string[]).includes(slug);
}
```

Any pack targeting a prohibited sector must be rejected at the planning stage, not the build stage.

---

## Review Process for Edge Cases

If a proposed sector does not clearly fall into either list:

1. Document the proposed sector and specific use cases
2. Identify whether any regulatory body governs advice or decisions in that domain
3. Identify whether an AI error in that domain could cause physical, financial, or legal harm to end users
4. Consult legal review before proceeding
5. If approved, add the sector to the safe sectors list with explicit boundaries documented here
