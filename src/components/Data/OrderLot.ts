import { FormErrors, IOrderForm, TUserInfoAddressPayment, TUserInfoEmailPhone } from "../../types";
import { Model } from "../base/model";

export class OrderLot extends Model<IOrderForm> {
  orderAddressPayment: TUserInfoAddressPayment = {
    address: '',
    payment: '',
  }
  orderEmailPhone: TUserInfoEmailPhone = {
    email: '',
    phone: '',
  }
  protected formErrors: FormErrors = {};
  protected formErrorsEmailPhone: FormErrors = {};

  setAddressPayment(field: keyof TUserInfoAddressPayment, value: string): void {
    this.orderAddressPayment[field] = value;
    if (this.validateAddressPayment()) {
      this.events.emit('orderaddress:ready', this.orderAddressPayment)
    }
  }

  validateAddressPayment(): boolean {
    const errors: FormErrors = {};
  
    if (!this.orderAddressPayment.address) {
      errors.address = 'Введите адрес'
    } else if (!this.orderAddressPayment.payment) {
      errors.payment = 'Выберите способ оплаты'
    }
  
    this.formErrors = errors;
    this.events.emit('formErrorsAddress:change', this.formErrors);
  
    return Object.keys(errors).length === 0;
  }
  
  setEmailPhone(field: keyof TUserInfoEmailPhone, value: string): void {
    this.orderEmailPhone[field] = value; 

    if (this.validateEmailPhone()) {
      this.events.emit('ordercontacts:ready', this.orderEmailPhone)
    }
  }
    
  validateEmailPhone(): boolean {
    const errors: FormErrors = {};
  
    if (!this.orderEmailPhone.email) {
      errors.email = 'Необходимо указать email'
    } else if (!this.orderEmailPhone.phone) {
      errors.phone = 'Необходимо указать телефон'
    }
  
    this.formErrorsEmailPhone = errors;
    this.events.emit('formErrorsContacts:change', this.formErrorsEmailPhone);
  
    return Object.keys(errors).length === 0;
  }

  // метод для очистки формы адреса
  clearAddressPayment(): void {
    this.orderAddressPayment = {
      address: '',
      payment: '',
    };
  }

  // метод для очистки формы контактов
  clearEmailPhone(): void {
    this.orderEmailPhone = {
      email: '',
      phone: '',
    }
  }
}

