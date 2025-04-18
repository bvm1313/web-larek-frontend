import { ILotItem } from "../../types/index";
import { Model } from "../base/model";

export class Lots extends Model<ILotItem> {

  protected _catalog: ILotItem[] = [];
  protected _preview: string | null;

  set catalog(lots: ILotItem[]) {
    this._catalog = lots;
    this.events.emit('lots:changed');
  }

  set preview(lotId: string | null) {
    if (!lotId) {
      this._preview = null;
      return
    }
    const getId = this.getLotItem(lotId);
    if (getId) {
      this._preview = lotId;
      this.events.emit('lot:selected', getId);
    }
  }

  get preview() {
    return this._preview; 
  }

  getLotItem(lotId: string){
    return this._catalog.find(lot => lot.id === lotId);
  }

  getLots(){
    return this._catalog; 
  }
}

