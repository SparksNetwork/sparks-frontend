import { isWebUrlValid } from '../services/isWebUrlValid'

export class WebUrl {
  private _value: string;

  constructor(value: string) {
    this.setValue(value);
  }

  value(): string {
    return this._value;
  }

  private setValue(value: string) {
    if (!isWebUrlValid(value)) {
      throw new Error(`Invalid Web URL.`);
    }
    this._value = value;
  }
}