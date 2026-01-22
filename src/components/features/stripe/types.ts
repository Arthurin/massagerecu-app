export interface StripeInputProps {
  checkoutData: {
    purchaserEmail: string;
    purchaserName: string;
    recipientName: string;
    message: string;
    stripeProductId: string;
    quantity: number;
  };
  onSuccess: () => void;
}
