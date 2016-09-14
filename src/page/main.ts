import { AuthSource, AuthSink, FirebaseSource, QueueSink, AuthInput } from '../driver/cyclic-fire';
import { Stream, just } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { merge } from 'ramda';

import Landing from './Landing';
import Login from './Login';

import ComponentRouter from '../component/ComponentRouter';

const routes = {
  '/': Landing,
  '/login': Login
};

export type MainSinks = {
  DOM: Stream<VNode>;
  router: Stream<string>;
  auth$: AuthSink,
  queue$: QueueSink
}

export type MainSources = {
  DOM: DOMSource,
  router: RouterSource,
  auth$: AuthSource,
  firebase: FirebaseSource,
}

export function main(sources: MainSources): MainSinks {
  const isAuthenticated$ = sources.auth$.map(user => {
    return !!user;
  });

  const page = ComponentRouter(merge(sources, {
    routes$: just(routes)
  }));

  const auth = { type: 'popup', provider: 'google' } as AuthInput;

  return {
    DOM: page.DOM,
    router: page.route$,
    auth$: isAuthenticated$.filter(x => !x).constant(auth),
    queue$: page.pluck('queue$')
  };
}
