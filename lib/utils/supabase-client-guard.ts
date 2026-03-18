// lib/utils/supabase-client-guard.ts
// Client component'lerde API fetch sonrası 401 gelirse login'e yönlendir.

export function handleApiResponse(res: Response): boolean {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
  return true;
}
