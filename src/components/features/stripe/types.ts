import type { Ref } from "react";
import { CarteCadeauFormData, MassageOption } from "../carte-cadeau/types";

export interface StripeMetaData {
  checkoutData: {
    recipientName: string;
    message: string;
    massagePriceId: string;
    quantity: number;
  };
}

export interface StripeCheckoutProps {
  massage: MassageOption;
  checkoutData: CarteCadeauFormData;
  onSuccess: (paymentIntentId: string) => void;
  formRef?: Ref<HTMLFormElement>;
}
