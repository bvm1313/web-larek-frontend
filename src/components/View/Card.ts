import { ensureElement } from "../../utils/utils";
import { Component } from '../base/components';
import { ILotItem } from '../../types/index';

interface ILotActions {
    onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ILotItem> {
    protected _title: HTMLElement; 
    protected _price: HTMLElement; 

    constructor(container: HTMLElement) {
        super(container); 
        this._title = ensureElement<HTMLElement>('.card__title', container); 
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        this.setText(this._price, value ? `${value.toString()} синапсов` : 'Бесценно');
    }
}

export class CardBasket extends Card {
    protected _buttonDelete?: HTMLButtonElement; 
    protected _index: HTMLElement; 

    constructor(container: HTMLElement, actions?: ILotActions) {
        super(container);
        this._buttonDelete = container.querySelector('.basket__item-delete'); 
        this._index = container.querySelector('.basket__item-index'); 

        if (actions?.onClick) {
            if (this._buttonDelete) {
                this._buttonDelete.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}

export class CardList extends Card {
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement; 
    protected ProductCategoryType: Record<string, string> = {
        "софт-скил": "_soft",
        "кнопка": "_button",
        "другое": "_other",
        "хард-скил": "_hard",
        "дополнительное": "_additional",
    }

    constructor(container: HTMLElement, actions?: ILotActions) {
        super(container);  
        this._category = container.querySelector('.card__category');
        this._image = container.querySelector('.card__image');  

        if (actions?.onClick) {
            if (this._image) {
                this._image.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        this.setText(this._category, value); 
        this.toggleClass(this._category, this.ProductCategoryType[value], true);
    }

    set image(value: string) {
        this.setImage(this._image, value); 
    }
}

export class CardPreview extends Card {
    protected _category?: HTMLElement; 
    protected _description?: HTMLElement; 
    protected _image?: HTMLImageElement;
    protected _buttonChange: HTMLButtonElement;  
    protected ProductCategoryType: Record<string, string> = {
        "софт-скил": "_soft",
        "кнопка": "_button",
        "другое": "_other",
        "хард-скил": "_hard",
        "дополнительное": "_additional",
    }

    constructor(container: HTMLElement, actions?: ILotActions) {
        super(container); 
        this._category = container.querySelector('.card__category'); 
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');  
        this._buttonChange = container.querySelector('.button'); 

        if (actions?.onClick) {
            if (this._buttonChange) {
                this._buttonChange.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        this.setText(this._category, value); 
        this.toggleClass(this._category, this.ProductCategoryType[value], true); 
    }

    set image(value: string) {
        this.setImage(this._image, value); 
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonChange(text: string) {
        this.setText(this._buttonChange, text);
    }

    disableButton() {
        this.setDisabled(this._buttonChange, true);
    }
}