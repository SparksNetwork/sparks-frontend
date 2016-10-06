import { Stream, never, merge, combineArray } from 'most';
import isolate from '@cycle/isolate';
import {  VNode, DOMSource } from '@motorcycle/dom';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { REDIRECT, PASSWORD, AuthSource } from '../../driver/cyclic-fire';

import {cssClasses} from '../../util/classes';
const classes = cssClasses({});

import { view } from './view';

export type LoginSinks = {
  DOM: Stream<VNode>;
  route$: Stream<string>;
  auth$: Stream<{ type: string, provider: string, userInfo?: [string, string] }>;
}

export type LoginSources = {
  DOM: DOMSource;
  router: RouterSource;
  auth$: AuthSource;
}

const matches = (selector: string) => (ev: Event): boolean =>
  (ev.target as HTMLElement).matches(selector);

function createAuth$(sources: LoginSources, userDoesNotExist$: Stream<boolean | null>) {
  const google$ = sources.DOM.select(classes.sel('google')).events('click')
    .constant({ type: REDIRECT, provider: 'google' });
  const facebook$ = sources.DOM.select(classes.sel('facebook')).events('click')
    .constant({ type: REDIRECT, provider: 'facebook' });

  const input$ = sources.DOM.select('*').events('input');

  const email$ = input$.filter(matches('.login.email'))
    .map(ev => (ev.target as HTMLInputElement).value)
    .multicast();

  const password$ = input$.filter(matches('.login.password'))
    .map(ev => (ev.target as HTMLInputElement).value)
    .multicast();

  // isolation with 'form' seems broken
  const submit$ = sources.DOM.select('*').events('submit')
    .tap(ev => ev.preventDefault())
    .multicast();

  const formValue$ = combineArray((...args) => args, [email$, password$])
    .sampleWith(submit$)
    .map(userInfo => ({ type: PASSWORD, provider: 'password', userInfo }))
    .multicast();

  const createUser$ = combineArray((...args) => args, [email$, password$])
    .sampleWith(userDoesNotExist$)
    .map(userInfo => ({ type: 'CREATE', provider: 'password', userInfo }))
    .multicast();

   return merge(google$, facebook$, formValue$, createUser$).multicast();
}

function Login(sources: LoginSources): LoginSinks {
  const userDoesNotExist$: Stream<boolean | null> = sources.auth$
    .map((x) => x && (x as any).failure && (x as any).failure !== 'NoUser')
    .multicast();

  const auth$ = createAuth$(sources, userDoesNotExist$)

  const view$ = userDoesNotExist$.startWith(null).map(view);

  return {
    DOM: view$,
    route$: never(),
    auth$
 };
}

export default sources => isolate(Login)(sources);
