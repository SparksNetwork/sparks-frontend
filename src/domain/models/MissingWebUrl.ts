import { WebUrl } from './WebUrl';

class MissingWebUrl extends WebUrl {
  constructor() {
    super(`http://dummy.url`);
  }

  isMissing(): boolean {
    return true;
  }
}

const missingWebUrl = new MissingWebUrl();

export function instance(): MissingWebUrl {
  return missingWebUrl;
}