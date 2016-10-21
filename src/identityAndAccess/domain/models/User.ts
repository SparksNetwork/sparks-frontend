import { EmailAddress } from './EmailAddress';

export class User {
  private _emailAddress: EmailAddress;

  private _password: string;

  constructor(emailAddress: EmailAddress, password: string) {
    this.setEmailAddress(emailAddress);
    this.setPassword(password);
  }

  emailAddress(): EmailAddress {
    return this._emailAddress;
  }

  password(): string {
    return this._password;
  }

  private setEmailAddress(emailAddress) {
    this._emailAddress = emailAddress;
  }

  private setPassword(password) {
    this._password = password;
  }
}