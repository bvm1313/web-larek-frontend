export interface ILotItem {
  id: string;
  title: string;
  price: number | null;
  category: string; 
  description: string;
  image: string;
}

export interface ILots {
  lots: ILotItem[];
}

export interface IOrderForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
  totalCost: string | number;
}

export interface IOrder extends IOrderForm {
  id: string;
  total: number;
}

export type TUserInfoEmailPhone = Pick<IOrderForm, 'email' | 'phone'>;

export type TUserInfoAddressPayment = Pick<IOrderForm, 'address' | 'payment'>;

export type TBasket = Pick<ILotItem, 'id' | 'title' | 'price'>;

