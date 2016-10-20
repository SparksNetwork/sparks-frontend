import { Missing } from '../../common/Missing';
import { isWebUrlValid } from '../services/isWebUrlValid';
import { instance as missingWebUrlInstance } from './MissingWebUrl';

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

  static missingWebUrl(): WebUrl {
    return missingWebUrlInstance();
  }

  private setValue(value: string) {
    if (!isWebUrlValid(value)) {
      throw new Error(`Invalid Web URL.`);
    }
    this._value = value;
  }
}