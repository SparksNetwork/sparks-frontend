export class RegisterUserCommand {
  private _emailAddress: string;
  private _password: string;

  constructor(emailAddress: string, password: string) {
    this._emailAddress = emailAddress;
    this._password = password;
  }

  emailAddress(): string {
    return this._emailAddress;
  }

  password(): string {
    return this._password;
  }
}
