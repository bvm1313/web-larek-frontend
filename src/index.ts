import './scss/styles.scss';
import { IApi, ILotItem, ILots, TBasket, TUserInfoAddressPayment, TUserInfoEmailPhone } from './types'; 
import { cloneTemplate, ensureElement } from './utils/utils'; 
import { API_URL, CDN_URL} from "./utils/constants";
import { AppApi } from "./components/AppApi"; 
import { Api } from './components/base/api';
import { EventEmitter } from "./components/base/events"; 
import { Lots } from "./components/Data/Lots"; 
import { BasketLot } from "./components/Data/BasketLot"; 
import { OrderLot } from './components/Data/OrderLot'; 
import { Basket } from "./components/View/Basket";
import { Modal } from "./components/View/Modal"; 
import { CardBasket, CardList, CardPreview } from "./components/View/Card"; 
import { OrderFormContactsView } from "./components/View/OrderFormContactsView"; 
import { OrderFormAddressView } from "./components/View/OrderFormAddressView"; 
import { Page } from "./components/View/Page"; 
import { Success } from './components/View/Success'; 

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL);
const api = new AppApi(CDN_URL, baseApi);

const productViewlistTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productViewpreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productViewbasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketViewTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressViewTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsViewTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const productsData = new Lots({}, events);
const basketData = new BasketLot({}, events);
const orderForms = new OrderLot({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketViewTemplate), events);
const addressPayment  = new OrderFormAddressView(cloneTemplate(addressViewTemplate), events);
const contacts = new OrderFormContactsView(cloneTemplate(contactsViewTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.on<ILots>('lots:changed', () => {
    page.catalog = productsData.getLots().map(lot => {
        const product = new CardList(cloneTemplate(productViewlistTemplate), {
            onClick: () => events.emit('lot:selected', lot)
        });
        return product.render(lot);
    });
});

events.on('lot:selected', (lot: ILotItem) => {
    const productpreview = new CardPreview(cloneTemplate(productViewpreviewTemplate), {
        onClick: () => {
            if (basketData.checkBasket(lot.id)) {
                basketData.deleteLotBasket(lot.id);
                productpreview.buttonChange = 'Купить';
            } else {
                basketData.addLotBasket(lot);
                productpreview.buttonChange = 'Убрать';
            }
            page.counter = basketData.getCountLotsBasket();
        },
    });

    if (lot.price === null) {
        productpreview.disableButton(); 
    } else {
        productpreview.buttonChange = basketData.checkBasket(lot.id) ? 'Убрать' : 'Купить';
    }

    modal.render({ content: productpreview.render(lot) });
});

const renderBasketItems = () => {
    const basketitems = basketData.lots.map((lot, index) => {
        const basketitem = new CardBasket(cloneTemplate(productViewbasketTemplate), {
            onClick: () => events.emit('basket:delete', lot)
        });
        basketitem.index = index + 1;
        return basketitem.render(lot);
    });
    return basketitems;
};

events.on('basket:open', () => {
    modal.render({
        content: basket.render({
            items: renderBasketItems(),
            total: basketData.getTotalCost(),
        })
    });
});

events.on('basket:delete', (item: TBasket) => {
    basketData.deleteLotBasket(item.id);
    page.counter = basketData.getCountLotsBasket();
    modal.open();
    modal.render({
        content: basket.render({
            items: renderBasketItems(), 
            total: basketData.getTotalCost(),
        })
    });
});

events.on('basket:submit', () => {
    events.emit('addressPayment:open');
});

events.on('formErrorsAddress:change', (errors: Partial<TUserInfoAddressPayment>) => {
    const { payment, address } = errors;
    addressPayment.valid = !payment && !address;
    addressPayment.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof TUserInfoAddressPayment, value: string }) => {
    orderForms.setAddressPayment(data.field, data.value);
});

events.on('addressPayment:open', () => {
    modal.open();
    modal.render({
        content: addressPayment.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        }),
    });
});

events.on('order:submit', () => {
    events.emit('emailPhone:open');
});

events.on('formErrorsContacts:change', (errors: Partial<TUserInfoEmailPhone>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof TUserInfoEmailPhone, value: string }) => {
    orderForms.setEmailPhone(data.field, data.value);
});

events.on('emailPhone:open', () => {
    modal.open();
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

events.on('contacts:submit', () => {
    api.postOrderApi({
        payment: orderForms.orderAddressPayment.payment,
        address: orderForms.orderAddressPayment.address,
        email: orderForms.orderEmailPhone.email,
        phone: orderForms.orderEmailPhone.phone,
        total: basketData.getTotalCost(),
        items: basketData.getLotsBasket(),
    })
    .then((res) => {
        modal.open()
        modal.render({
            content: success.render({
              total: res.total
            })
            
        });
        orderForms.clearAddressPayment();
        orderForms.clearEmailPhone();
        basketData.clearBasket();
        page.counter = 0;
    })
    .catch(console.error);
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

api.getLotsApi()
    .then((res) => {
        productsData.catalog = res;
    })
    .catch(console.error);
