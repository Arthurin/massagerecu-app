export interface MassageOption {
  title: string;
  unitPrice: number;
  massagePriceId: string;
}

export interface CarteCadeauFormData {
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
  quantity: number;
}

export interface CarteCadeauOrder {
  massage: MassageOption;
  formData: CarteCadeauFormData;
}
