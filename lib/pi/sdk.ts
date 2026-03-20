export type PiAuthPayload = {
  accessToken: string;
  uid: string;
  username: string;
};

export function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof window.Pi !== 'undefined';
}

function normalizePiAuth(auth: PiAuthResult | null | undefined): PiAuthPayload {
  if (!auth?.accessToken || !auth?.user?.uid || !auth?.user?.username) {
    throw new Error('Pi auth incomplete');
  }

  return {
    accessToken: auth.accessToken,
    uid: auth.user.uid,
    username: auth.user.username,
  };
}

// Normal login için aynen kalsın
export async function authenticateWithPi(): Promise<PiAuthPayload | null> {
  if (!isPiBrowser()) return null;

  const auth = await window.Pi.authenticate(['username'], async () => {});
  return normalizePiAuth(auth);
}

// Sadece ödeme öncesi bunu çağır
export async function authenticateWithPiForPayment(): Promise<PiAuthPayload | null> {
  if (!isPiBrowser()) return null;

  const auth = await window.Pi.authenticate(
    ['username', 'payments'],
    async () => {}
  );

  return normalizePiAuth(auth);
}
