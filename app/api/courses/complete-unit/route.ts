import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CollectibleMetadata } from "@/types/university";

// ─── Badge definitions ────────────────────────────────────────────────────────
const BADGE_TIERS = [
  {
    code: "BEGINNER",
    title: "Başlangıç Rozeti",
    description: "İlk adımını attın! Yolculuğun başlıyor.",
    image_url: "/badges/beginner.svg",
    level: "A1",
    threshold: 1,
    rarity: "common",
  },
  {
    code: "MID",
    title: "Orta Seviye Rozeti",
    description: "Yarı yola geldin. Harika ilerliyorsun!",
    image_url: "/badges/mid.svg",
    level: "B1",
    threshold: 50,
    rarity: "uncommon",
  },
  {
    code: "ADVANCED",
    title: "İleri Seviye Rozeti",
    description: "%80 tamamladın. Neredeyse ustaştın!",
    image_url: "/badges/advanced.svg",
    level: "C1",
    threshold: 80,
    rarity: "rare",
  },
  {
    code: "MASTER",
    title: "Usta Rozeti",
    description: "Kursu %100 tamamladın. Sen bir ustaısın!",
    image_url: "/badges/master.svg",
    level: "C2",
    threshold: 100,
    rarity: "epic",
  },
] as const;

function certTitleForLevel(level: string): string {
  if (level === "B1") return "Orta Seviye Sertifikası";
  if (level === "B2" || level === "C1") return "İleri Seviye Sertifikası";
  return "Usta Sertifikası";
}

function certImageForLevel(level: string): string {
  if (level === "B1") return "/certs/certificate-middle.svg";
  if (level === "B2" || level === "C1") return "/certs/certificate-advanced.svg";
  return "/certs/certificate-master.svg";
}

// ─── Helper: create NFT-ready collectible for a given source ─────────────────
async function upsertCollectible(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  sourceType: "badge" | "certificate",
  sourceId: string,
  tokenName: string,
  imageUrl: string,
  rarity: string,
  metadata: CollectibleMetadata
) {
  await supabase.from("collectible_rewards").upsert(
    {
      user_id: userId,
      source_type: sourceType,
      source_id: sourceId,
      token_name: tokenName,
      token_symbol: "KOSHEI",
      metadata_json: metadata,
      image_url: imageUrl,
      rarity,
      mint_status: "draft",
      downloadable_file_url: imageUrl,
      marketplace_status: "hidden",
    },
    { onConflict: "user_id,source_type,source_id" }
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { courseId, unitId, unitOrder, score } = await req.json();

  // 1. Record unit progress
  await supabase.from("unit_progress").upsert({
    user_id: user.id,
    course_id: courseId,
    unit_id: unitId,
    unit_order: unitOrder,
    completed: true,
    score,
    completed_at: new Date().toISOString(),
  });

  // 2. Calculate overall progress
  const { data: units } = await supabase
    .from("unit_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const completedCount = units?.filter((u) => u.completed).length ?? 0;

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) {
    return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
  }

  const total = enrollment.total_units_count || 1;
  const progress = Math.min(Math.floor((completedCount / total) * 100), 100);

  // 3. Update enrollment record
  await supabase
    .from("course_enrollments")
    .update({
      completed_units_count: completedCount,
      progress_percent: progress,
      current_unit: unitOrder + 1,
      status: progress === 100 ? "completed" : "active",
    })
    .eq("id", enrollment.id);

  const earnedAt = new Date().toISOString();
  const unlockedBadges: string[] = [];

  // 4. Badge unlock — 4-tier system (unique per course × badge tier)
  // Each course awards its own set of 4 badges at 1%, 50%, 80%, 100%
  for (const badge of BADGE_TIERS) {
    if (progress >= badge.threshold) {
      const badgeCode = `${courseId}_${badge.code}`;

      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", user.id)
        .eq("code", badgeCode)
        .maybeSingle();

      if (!existing) {
        const { data: newBadge } = await supabase
          .from("achievements")
          .insert({
            user_id: user.id,
            code: badgeCode,
            title: badge.title,
            description: badge.description,
            image_url: badge.image_url,
            level: badge.level,
          })
          .select("id")
          .single();

        if (newBadge) {
          unlockedBadges.push(badge.title);

          // Create NFT-ready collectible for this badge
          const meta: CollectibleMetadata = {
            name: badge.title,
            description: badge.description,
            image: badge.image_url,
            attributes: [
              { trait_type: "Course", value: courseId },
              { trait_type: "Badge Tier", value: badge.code },
              { trait_type: "Language Level", value: badge.level },
              { trait_type: "Progress Required", value: badge.threshold },
            ],
            language: enrollment.language_code,
            level: enrollment.level,
            earned_at: earnedAt,
          };

          await upsertCollectible(
            supabase,
            user.id,
            "badge",
            newBadge.id,
            `${badge.title} — ${courseId}`,
            badge.image_url,
            badge.rarity,
            meta
          );
        }
      }
    }
  }

  // 5. Certificate on 100% completion
  let certificateIssued = false;
  if (progress === 100) {
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    if (!existingCert) {
      const certTitle = certTitleForLevel(enrollment.level);
      const certImage = certImageForLevel(enrollment.level);

      const { data: newCert } = await supabase
        .from("certificates")
        .insert({
          user_id: user.id,
          course_id: courseId,
          language_code: enrollment.language_code,
          level: enrollment.level,
          title: certTitle,
          image_url: certImage,
        })
        .select("id")
        .single();

      certificateIssued = true;

      if (newCert) {
        // Create NFT-ready collectible for this certificate
        const meta: CollectibleMetadata = {
          name: certTitle,
          description: `${enrollment.language_code.toUpperCase()} ${enrollment.level} kursunu başarıyla tamamladın.`,
          image: certImage,
          attributes: [
            { trait_type: "Type", value: "Certificate" },
            { trait_type: "Course", value: courseId },
            { trait_type: "Language", value: enrollment.language_code },
            { trait_type: "Level", value: enrollment.level },
            { trait_type: "Completion", value: "100%" },
          ],
          language: enrollment.language_code,
          level: enrollment.level,
          earned_at: earnedAt,
        };

        await upsertCollectible(
          supabase,
          user.id,
          "certificate",
          newCert.id,
          certTitle,
          certImage,
          "legendary",
          meta
        );
      }
    }
  }

  return NextResponse.json({
    success: true,
    progress,
    unlockedBadges,
    certificateIssued,
  });
}
