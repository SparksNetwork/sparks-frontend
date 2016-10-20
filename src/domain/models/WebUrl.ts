import { Missing } from '../../common/Missing';
import { isWebUrlValid } from '../services/isWebUrlValid';

export class WebUrl implements Missing {
  private _value: string;

  constructor(value: string) {
    this.setValue(value);
  }

  value(): string {
    return this._value;
  }

  isMissing(): boolean {
    return false;
  }

  private setValue(value: string) {
    if (!isWebUrlValid(value)) {
      throw new Error(`Invalid Web URL.`);
    }
    this._value = value;
  }
}