import { Stream, just, never } from 'most';
import isolate from '@cycle/isolate';
import { div, h1, VNode } from '@motorcycle/dom';

export type LoginSinks = {
  DOM: Stream<VNode>;
  route$: Stream<string>;
}

function Login() {
  return {
    DOM: just(
      div({}, [
        h1('.login', 'Login page')
      ])
    ),
    route$: never()
  };
}

export default sources => isolate(Login)(sources);
