import { IEvents } from '../base/events';
import { ensureElement } from "../../utils/utils"; 
import { Component } from '../base/components'; 

interface ISuccess {
  total: number; 
}

export class Success extends Component<ISuccess> {
    protected _title: HTMLElement; 
    protected _total: HTMLElement; 
    protected buttonClose: HTMLButtonElement; 

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); 

        this._title = ensureElement<HTMLElement>('.order-success__title', container);
        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this.buttonClose = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.buttonClose.addEventListener('click', () => {
            this.events.emit('success:close'); 
        });
    }

    set total(value: HTMLElement) {
        this.setText(this._total, `Списано ${value} синапсов`); 
    }

    set title(value: string) {
        this.setText(this._title, value); 
    }
}