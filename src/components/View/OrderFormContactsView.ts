import { IEvents } from '../base/events';
import { Form } from './Form';
import { TUserInfoEmailPhone } from "../../types/index";

export class OrderFormContactsView extends Form<TUserInfoEmailPhone> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value; 
    }
}