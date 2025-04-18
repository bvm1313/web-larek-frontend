import { IDataBasket, TBasket } from '../../types'
import { Model } from '../base/model';

export class BasketLot extends Model<IDataBasket> {
  
  protected lotsBasket: TBasket[] = [];

  set lots(lots: TBasket[]) {
    this.lotsBasket = lots; 
    this.events.emit('basket: change', this.lotsBasket); 
  }

  get lots() {
    return this.lotsBasket; 
  }

  addLotBasket(lot: TBasket): void {
    this.lotsBasket = [lot, ...this.lotsBasket]; 
  }  

  deleteLotBasket(lotId: string): void {
    this.lotsBasket = this.lotsBasket.filter(lot => lot.id !== lotId); 
  }

  clearBasket(): void {
    this.lotsBasket = []; 
  } 

  getLotsBasket(): string[] {
    return this.lotsBasket.map(lot => lot.id);
  }

  getCountLotsBasket(): number {
    return this.lotsBasket.length; 
  }

  getTotalCost(): number {
    return this.lotsBasket.reduce((all, lot) => all + lot.price, 0); 
  }

  checkBasket(lotId: string): boolean {
    return this.lotsBasket.some(lot => lot.id === lotId); 
  }    
}
