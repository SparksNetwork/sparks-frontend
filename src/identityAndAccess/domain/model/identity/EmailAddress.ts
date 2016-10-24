export class EmailAddress {
  private _address: string;

  constructor(address: string) {
    if (!address)
      throw new Error(`\`address\` required.`);

    this._address = address;
  }

  address(): string {
    return this._address;
  }
}
