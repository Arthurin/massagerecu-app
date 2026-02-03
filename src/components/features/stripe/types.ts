import type { Ref } from "react";
import type { StripeAddressElementOptions } from "@stripe/stripe-js";
import { CarteCadeauFormData, MassageOption } from "../carte-cadeau/types";
import type { CheckoutFormPersistHandle } from "./CheckoutForm";

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
  persistRef?: Ref<CheckoutFormPersistHandle>;
  email?: string;
  addressDefaultValues?: StripeAddressElementOptions["defaultValues"] | null;
  onEmailChange?: (email: string) => void;
  onAddressChange?: (
    address: StripeAddressElementOptions["defaultValues"],
  ) => void;
}
