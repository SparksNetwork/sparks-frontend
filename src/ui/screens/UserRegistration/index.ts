import { Stream, just } from 'most';
import { VNode } from '@motorcycle/dom';

import { view } from './view';

export type UserRegistrationSinks = {
  DOM: Stream<VNode>
}

export function UserRegistration() {
  return {
    DOM: just(view())
  }
}
