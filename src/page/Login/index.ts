import { just, Stream } from 'most';
import { VNode, div } from '@motorcycle/dom';

export type LoginSinks = {
  DOM: Stream<VNode>
}

export function Login(): LoginSinks {
  return {
    DOM: just(div())
  }
}
