import { just, Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources } from '../../components/types';

import { authenticate, AuthenticationSinks } from '../../higher-order-components/authenticate';
import isolate from '@cycle/isolate';
import { createAuthenticationMethod$ } from './createAuthenticationMethod$';
import { view } from './view';

export type LoginSinks = { DOM: Stream<VNode> } & AuthenticationSinks

export function Login(sources: Sources & { DOM: DOMSource }): LoginSinks {
  const authenticationMethod$ = createAuthenticationMethod$(sources.DOM);

  return {
    DOM: just(view(null)),
    authenticationMethod$
  };
}

export default sources => isolate(authenticate(Login))(sources);