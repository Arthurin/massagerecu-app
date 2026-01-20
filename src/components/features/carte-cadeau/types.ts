export interface MassageOption {
  id: string;
  title: string;
  price: number;
  stripePriceId: string;
}

export interface CarteCadeauFormData {
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message?: string;
  quantity: number;
}

export interface CarteCadeauOrder {
  massage: MassageOption;
  formData: CarteCadeauFormData;
}
