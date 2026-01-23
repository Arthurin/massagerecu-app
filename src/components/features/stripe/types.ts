export interface StripeInputProps {
  checkoutData: {
    purchaserEmail: string;
    purchaserName: string;
    recipientName: string;
    message: string;
    massagePriceId: string;
    quantity: number;
  };
  onSuccess: () => void;
}
