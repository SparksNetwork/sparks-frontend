export class EmailAddress {
  private _address: string;

  constructor(address: string) {
    this.setAddress(address);
  }

  address(): string {
    return this._address;
  }

  private setAddress(address: string) {
    this._address = address;
  }
}