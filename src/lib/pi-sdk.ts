import type { PaymentDTO, AuthResult, PaymentCallbacks } from "@/types/pi-sdk";

const PI_SDK_URL = "https://sdk.minepi.com/pi-sdk.js";

/**
 * Load the Pi SDK script dynamically (client-side only).
 * Resolves immediately in server-side rendering context.
 */
export function loadPiSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Pi SDK is only available in the browser
    if (typeof window === "undefined") return resolve();
    if (window.Pi) return resolve();

    const script = document.createElement("script");
    script.src = PI_SDK_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pi SDK"));
    document.head.appendChild(script);
  });
}

/**
 * Authenticate with Pi Network.
 * Returns user data and access token.
 */
export async function piAuthenticate(): Promise<AuthResult> {
  await loadPiSDK();

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.warn("Incomplete payment found:", payment);
  };

  return window.Pi.authenticate(["username", "payments"], onIncompletePaymentFound);
}

/**
 * Create a Pi payment for a given amount.
 */
export function piCreatePayment(
  amount: number,
  memo: string,
  metadata: Record<string, unknown>,
  callbacks: PaymentCallbacks
): void {
  if (typeof window === "undefined" || !window.Pi) {
    throw new Error("Pi SDK not loaded");
  }
  window.Pi.createPayment({ amount, memo, metadata }, callbacks);
}

/**
 * Share content via Pi Browser.
 */
export function piShare(title: string, message: string): void {
  if (typeof window === "undefined" || !window.Pi) {
    throw new Error("Pi SDK not loaded");
  }
  window.Pi.openShareDialog(title, message);
}
