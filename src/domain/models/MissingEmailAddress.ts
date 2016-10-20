import { EmailAddress } from './EmailAddress';

class MissingEmailAddress extends EmailAddress {
  constructor() {
    super(`dummy@email.address`);
  }

  isMissing(): boolean {
    return true;
  }
}

const missingEmailAddress = new MissingEmailAddress();

export function instance(): MissingEmailAddress {
  return missingEmailAddress;
}