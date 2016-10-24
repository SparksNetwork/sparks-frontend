import { UserId } from './UserId';
import { EmailAddress } from './EmailAddress'

export class User {
  private _userId: UserId;
  private _emailAddress: EmailAddress;

  constructor(userId: UserId, emailAddress: EmailAddress) {
    this._userId = userId;
    this._emailAddress = emailAddress;
  }

  userId(): UserId {
    return this._userId;
  }

  emailAddress(): EmailAddress {
    return this._emailAddress;
  }
}
