// @TODO uid, fullName, portraitUrl, and email should be value objects 
export class User {
  constructor(private _uid: string, private _fullName: string,
              private _portraitUrl: string, private _email: string) {}

  id() {
    return this._uid;
  }

  fullName() {
    return this._fullName;
  }

  portraitUrl() {
    return this._portraitUrl;
  }

  email() {
    return this._email;
  }
}