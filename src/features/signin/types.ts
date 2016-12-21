import { Pathname } from '@motorcycle/history';
import { Stream } from 'most';
import { VNode } from '@motorcycle/dom';

export interface SigninScreenSinks {
  dom: Stream<VNode>;
  router: Stream<Pathname>;
}
