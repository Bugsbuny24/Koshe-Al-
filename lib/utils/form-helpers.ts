// Shared helpers for admin server actions (form data parsing, slug generation)

const TURKISH_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};

export function toSlug(text: string): string {
  return text
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = parseInt(value as string, 10);
  return isNaN(n) ? null : n;
}

export function toFloat(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = parseFloat(value as string);
  return isNaN(n) ? null : n;
}
