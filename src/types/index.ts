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
  total: string | number;
}

export interface IOrderLots extends IOrderForm {
  items: string[];
  total: number;
}

export interface IOrder {
  id: string;
  total: number;
}

export type TUserInfoEmailPhone = Pick<IOrderForm, 'email' | 'phone'>;

export type TUserInfoAddressPayment = Pick<IOrderForm, 'address' | 'payment'>;

export type TBasket = Pick<ILotItem, 'id' | 'title' | 'price'>;

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IDataBasket {
  lots: TBasket[]; 
  addLotBasket(lot: TBasket): void; 
  deleteLotBasket(lotId: string): void; 
  clearBasket(): void;
  getLotsBasket(): string[];
  getCountLotsBasket(): number;
  getTotalCost(): number;
  checkBasket(lotId: string): boolean;
}

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}