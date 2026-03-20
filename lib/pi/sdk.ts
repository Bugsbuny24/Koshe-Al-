export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof window.Pi !== 'undefined';
}

export async function authenticateWithPi(): Promise<{
  accessToken: string;
  uid: string;
  username: string;
} | null> {
  if (!isPiBrowser()) return null;

  const auth = await window.Pi.authenticate(
    ['username', 'payments'],
    async (payment) => {
      await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier }),
      });
    }
  );

  if (!auth?.accessToken || !auth?.user?.uid || !auth?.user?.username) {
    throw new Error('Pi auth incomplete');
  }

  return {
    accessToken: auth.accessToken,
    uid: auth.user.uid,
    username: auth.user.username,
  };
}
