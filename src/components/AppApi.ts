import { IOrder, ILotItem, IApi, IOrderLots } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
  private _baseApi: IApi;
  readonly _cdnApi: string;

	constructor(cdnApi: string, baseApi: IApi) {
		this._baseApi = baseApi;
    this._cdnApi = cdnApi;
  }

  async getLotsApi(): Promise<ILotItem[]> {
     return this._baseApi.get('/product/').then((data: ApiListResponse<ILotItem>) =>
      data.items.map((item) => ({
          ...item,
          image: this._cdnApi + item.image,
      })));
  }

  async getLotApi(lotId: string): Promise<ILotItem> {
    return this._baseApi.get(`/product/${lotId}`).then((item: ILotItem) => ({
      ...item,
      image: this._cdnApi + item.image,
      }))
  }

  async postOrderApi(order: IOrderLots): Promise<IOrder> {
    const data = await this._baseApi.post<IOrder>('/order/', order);
    return data;
  }
}
