export class RegisterUserCommand {
  constructor(
    private _emailAddress: string,
    private _password: string) {}

  emailAddress(): string {
    return this._emailAddress;
  }

  password(): string {
    return this._password;
  }
}