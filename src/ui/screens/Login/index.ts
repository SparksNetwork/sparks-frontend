import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources } from '../../../components/types';

import { authenticate, AuthenticationSinks } from '../../../higher-order-components/authenticate';
import isolate from '@cycle/isolate';
import { createAuthenticationMethod$ } from './createAuthenticationMethod$';
import { view } from './view';

export type LoginSinks = { DOM: Stream<VNode> } & AuthenticationSinks

export type LoginSources = Sources & {
  DOM: DOMSource;
  isAuthenticated$: Stream<boolean>;
  random: Stream<number>;
}

export function Login(sources: LoginSources): LoginSinks {
  const authenticationMethod$ = createAuthenticationMethod$(sources.DOM);

  return {
    DOM: sources.random.map(view),
    authenticationMethod$,
  };
}

export default sources => isolate(authenticate(Login))(sources);