import { UserId } from './';

export class UserDescriptor {
  private _userId: UserId;
  private _emailAddress: string;

  constructor(userId: UserId, emailAddress: string) {
    this._userId = userId;
    this._emailAddress = emailAddress;
  }

  userId(): UserId {
    return this._userId;
  }

  emailAddress(): string {
    return this._emailAddress;
  }
}
