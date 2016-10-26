import { UserId } from './UserId';
import { EmailAddress, UserDescriptor } from './'

export class User {
  private _userId: UserId;
  private _emailAddress: EmailAddress;
  private _password: string;

  constructor(userId: UserId, emailAddress: EmailAddress, password: string) {
    this._userId = userId;
    this._emailAddress = emailAddress;
    this._password = password;
  }

  userId(): UserId {
    return this._userId;
  }

  emailAddress(): EmailAddress {
    return this._emailAddress;
  }

  password(): string {
    return this._password;
  }

  userDescriptor(): UserDescriptor {
    return new UserDescriptor(
      this._userId,
      this._emailAddress.address()
    );
  }
}
