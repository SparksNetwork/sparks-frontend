import { User } from './User';

export class MissingUser
    extends User {

  constructor() {
    super();
  }

  isMissing(): boolean {
    return true;
  }
}
