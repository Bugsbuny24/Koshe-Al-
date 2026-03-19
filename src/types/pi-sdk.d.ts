// Pi Network SDK Type Definitions

export interface PiUser {
  uid: string;
  username: string;
}

export interface AuthResult {
  user: PiUser;
  accessToken: string;
}

export interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: Record<string, unknown>;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface PaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PaymentDTO) => void;
}

export interface PiSDK {
  authenticate(
    scopes: string[],
    onIncompletePaymentFound: (payment: PaymentDTO) => void
  ): Promise<AuthResult>;
  createPayment(
    paymentData: {
      amount: number;
      memo: string;
      metadata: Record<string, unknown>;
    },
    callbacks: PaymentCallbacks
  ): void;
  openShareDialog(title: string, message: string): void;
}

declare global {
  interface Window {
    Pi: PiSDK;
  }
}
