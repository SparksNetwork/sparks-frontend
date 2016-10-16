import { just, Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources } from '../../components/types';

import { authenticate, AuthenticationSinks } from '../../higher-order-components/authenticate';
import isolate from '@cycle/isolate';
import { createAuthenticationMethod$ } from './createAuthenticationMethod$';
import { view } from './view';

export type LoginSinks = { DOM: Stream<VNode> } & AuthenticationSinks

export type LoginSources = Sources & {
  DOM: DOMSource;
  isAuthenticated$: Stream<boolean>;
}

export function Login(sources: LoginSources): LoginSinks {
  const authenticationMethod$ = createAuthenticationMethod$(sources.DOM);

  sources.isAuthenticated$.observe(x => console.log(x));

  return {
    DOM: just(view()),
    authenticationMethod$
  };
}

export default sources => isolate(authenticate(Login))(sources);