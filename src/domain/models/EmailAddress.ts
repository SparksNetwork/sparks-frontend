import { isEmailAddressValid } from '../services/isEmailAddressValid';

export class EmailAddress {
  private _address: string;

  constructor(address: string) {
    this.setAddress(address);
  }

  address(): string {
    return this._address;
  }

  private setAddress(address: string) {
    guardEmailAddress(address);
    this._address = address;
  };
}

function guardEmailAddress(address: string) {
  if (!isEmailAddressValid(address)) {
    throw new Error(`Invalid email address.`);
  }
}