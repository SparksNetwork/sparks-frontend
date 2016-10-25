import { UserId } from './UserId';
import { EmailAddress, UserDescriptor } from './'

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

  userDescriptor(): UserDescriptor {
    return new UserDescriptor(
      this._userId,
      this._emailAddress.address()
    );
  }
}
