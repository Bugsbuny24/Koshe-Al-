'use client';
import { usePiAuth } from '@/hooks/usePiAuth';
import { Button } from '@/components/ui/Button';

export function PiAuthButton() {
  const { login, loading, error } = usePiAuth();

  return (
    <div className="space-y-2">
      <Button onClick={login} loading={loading} size="lg">
        🟣 Pi ile Giriş Yap
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
