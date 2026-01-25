export interface StripeInputProps {
  checkoutData: {
    purchaserName: string;
    recipientName: string;
    message: string;
    massagePriceId: string;
    quantity: number;
  };
  onSuccess: () => void;
}
