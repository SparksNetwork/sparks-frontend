import { Missing } from '../../../../common/Missing'

export class User
    implements Missing {

  constructor() { }

  isMissing(): boolean {
    return false
  }
}
