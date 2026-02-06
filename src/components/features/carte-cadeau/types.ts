export interface MassageOption {
  [x: string]: ReactNode;
  title: string;
  unitPrice: number;
  massagePriceId: string;
}

export interface CarteCadeauFormData {
  recipientName: string;
  message: string;
  quantity: number;
}

export interface CarteCadeauOrder {
  massage: MassageOption;
  formData: CarteCadeauFormData;
}
