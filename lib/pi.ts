declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: unknown) => void
      ) => Promise<{
        user: {
          uid: string;
          username: string;
        };
        accessToken: string;
      }>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, unknown>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (paymentId: string, txid: string) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: unknown, payment?: unknown) => void;
        }
      ) => void;
    };
  }
}

export function isPiBrowser() {
  return typeof window !== "undefined" && !!window.Pi;
}

export function initPi() {
  if (typeof window === "undefined" || !window.Pi) return false;

  window.Pi.init({
    version: "2.0",
    sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
  });

  return true;
}
