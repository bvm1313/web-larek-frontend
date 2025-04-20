import { IEvents } from '../base/events';
import { ensureElement } from "../../utils/utils";
import { Component } from '../base/components';

interface IModalData {
    content: HTMLElement; 
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    private scrollPosition: number;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); 

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', () => events.emit('modal:close'));
        this.container.addEventListener('click', this.close.bind(this)); 
        this.handleEscUp = this.handleEscUp.bind(this); 
        
        this._content.addEventListener('click', (event) => event.stopPropagation()); 
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open() {
        this.scrollPosition = window.scrollY; 
        this.toggleClass(this.container, 'modal_active');        
        document.addEventListener('keyup', this.handleEscUp); 
        this.events.emit('modal:open');
    }

    close() {
        this.toggleClass(this.container, 'modal_active');
        document.removeEventListener('keyup', this.handleEscUp); 
        this.content = null;
        this.events.emit('modal:close'); 
        
        if (document.activeElement) {
            (document.activeElement as HTMLElement).blur();
        }

        window.scrollTo(0, this.scrollPosition);

    }

    handleEscUp(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            this.close(); 
        }
    }

    render(data: IModalData): HTMLElement {
        super.render(data); 
        this.open();
        return this.container; 
    }
}