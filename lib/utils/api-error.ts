// ── API error utilities ───────────────────────────────────────────────────────
// Centralised response-parsing helper used by lesson, live, and credit flows.

type ApiErrorShape = {
  error?: string;
  message?: string;
};

/**
 * Extracts a human-readable error message from a failed API response.
 * Returns a fallback string when the response body cannot be parsed.
 */
export async function parseApiError(
  res: Response,
  fallback = "Beklenmeyen bir hata oluştu."
): Promise<string> {
  try {
    const json = (await res.json()) as ApiErrorShape;
    if (typeof json.error === "string" && json.error.length > 0) {
      return json.error;
    }
    if (typeof json.message === "string" && json.message.length > 0) {
      return json.message;
    }
  } catch {
    // non-JSON response body — ignore
  }
  return fallback;
}
