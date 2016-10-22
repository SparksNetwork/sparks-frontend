import { Missing } from '../../../../common/Missing'

export class UserId
    implements Missing {

  private _id: string

  constructor(id: string) {
    this._id = id;
  }

  id(): string {
    return this._id;
  }

  isMissing(): boolean {
    return false;
  }
}