'use client';
import { usePiPayment } from '@/hooks/usePiPayment';
import { Button } from '@/components/ui/Button';

interface PiPaymentProps {
  amount: number;
  memo: string;
  metadata?: Record<string, unknown>;
  label?: string;
  onSuccess?: (txid: string) => void;
  onError?: (error: Error) => void;
}

export function PiPayment({ amount, memo, metadata = {}, label, onSuccess, onError }: PiPaymentProps) {
  const { pay, loading } = usePiPayment();

  const handlePay = () => {
    pay({ amount, memo, metadata, onSuccess, onError });
  };

  return (
    <Button onClick={handlePay} loading={loading}>
      {label || `${amount} Pi Öde`}
    </Button>
  );
}
