import { IEvents } from '../base/events';
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from '../base/components';

interface IBasket {
    items: HTMLElement[];
    total: number; 
}

export class Basket extends Component<IBasket> {
    
    protected _title: HTMLElement; 
    protected _list: HTMLElement; 
    protected _button: HTMLButtonElement; 
    protected _total: HTMLElement; 

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>('.modal__title', container);
        this._list = ensureElement<HTMLElement>('.basket__list', container); 
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container); 
        this._total = ensureElement<HTMLElement>('.basket__price', container);

        this._button.addEventListener('click', () => {
            this.events.emit('basket:submit'); 
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        this.setDisabled(this._button, !items.length);
        if (items.length) {
            this._list.replaceChildren(...items); 
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', { 
                    textContent: 'В корзине нет товаров'
                })
            );
        }
    }

    set title(value: string) {
        this.setText(this._title, value); 
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set list(value: HTMLElement[]) {
        this.items = value; 
    }

}