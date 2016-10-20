import { Missing } from '../../common/Missing';
import { isEmailAddressValid } from '../services/isEmailAddressValid';

export class EmailAddress implements Missing {
  private _address: string;

  constructor(address: string) {
    this.setAddress(address);
  }

  address(): string {
    return this._address;
  }

  isMissing(): boolean {
    return false;
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