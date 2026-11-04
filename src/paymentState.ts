export type PaymentState = 'ready' | 'processing' | 'done';

export const PROCESSING_DURATION_MS = 1500;
export const DONE_DURATION_MS = 3000;

export function getNextPaymentState(current: PaymentState, event: 'CLICK_CARD' | 'PROCESSING_COMPLETE' | 'DONE_TIMEOUT'): PaymentState {
  switch (event) {
    case 'CLICK_CARD':
      return current === 'ready' ? 'processing' : current;
    case 'PROCESSING_COMPLETE':
      return current === 'processing' ? 'done' : current;
    case 'DONE_TIMEOUT':
      return current === 'done' ? 'ready' : current;
    default:
      return current;
  }
}

export function getStatusText(state: PaymentState): string {
  switch (state) {
    case 'ready':
      return 'Hold Near Reader';
    case 'processing':
      return 'Processing...';
    case 'done':
      return 'Done';
  }
}

export function isPayingAnimationActive(state: PaymentState): boolean {
  return state !== 'ready';
}

export function playApplePaySuccessSound(): void {
  const successSound = new Audio('/apple-pay.mp3');
  successSound.play().catch((err) => console.log(err));
}
