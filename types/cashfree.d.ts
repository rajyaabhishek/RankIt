declare module '@cashfreepayments/cashfree-js' {
  export interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: string;
    onSuccess?: (data: any) => void;
    onFailure?: (data: any) => void;
    onClose?: () => void;
  }

  export interface CashfreeInstance {
    checkout: (options: CheckoutOptions) => Promise<any>;
  }

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<CashfreeInstance>;
} 