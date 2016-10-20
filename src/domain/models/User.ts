import { WebUrl } from './WebUrl';
import { EmailAddress } from './EmailAddress';

// @TODO uid and email should be value objects
export class User {
  private _uid: string;

  private _displayName: string;

  private _portraitUrl: WebUrl;

  private _emailAddress: EmailAddress;

  constructor(
    uid: string,
    displayName: string,
    portraitUrl: WebUrl,
    emailAddress: EmailAddress
  ) {
    this.setUid(uid);
    this.setDisplayName(displayName);
    this.setPortraitUrl(portraitUrl);
    this.setEmailAddress(emailAddress);
  }

  uid(): string {
    return this._uid;
  }

  displayName(): string {
    return this._displayName;
  }

  portraitUrl(): WebUrl {
    return this._portraitUrl;
  }

  emailAddress(): EmailAddress {
    return this._emailAddress;
  }

  private setUid(uid: string) {
    this._uid = uid;
  }

  private setDisplayName(displayName: string) {
    this._displayName = displayName;
  }

  private setPortraitUrl(portraitUrl: WebUrl) {
    this._portraitUrl = portraitUrl;
  }

  private setEmailAddress(emailAddress: EmailAddress) {
    this._emailAddress = emailAddress;
  }
}