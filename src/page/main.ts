import { FirebaseSource, QueueSink, QueueSource } from '../driver/cyclic-fire';
import { AuthenticationInput, AuthenticationOutput } from '../driver/firebase-authentication';
import { Stream, just } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { Sources, Sinks } from '../component/types';
import { merge } from 'ramda';

import Landing from './Landing';
import Login from './Login';

import ComponentRouter from '../component/ComponentRouter';

const routes = {
  '/': Landing,
  '/login': Login
};

export interface MainSinks extends Sinks {
  DOM: Stream<VNode>;
  router: Stream<string>;
  authentication$: Stream<AuthenticationInput>;
  queue$: QueueSink;
}

export interface MainSources extends Sources {
  DOM: DOMSource;
  router: RouterSource;
  authentication$: Stream<AuthenticationOutput>;
  firebase: FirebaseSource;
  queue$: QueueSource;
}

export function main(sources: MainSources): MainSinks {
  const isAuthenticated$ = sources.authentication$.map((auth) => {
    return !!auth.userCredential.user;
  });

  isAuthenticated$.observe(x => console.log(x));

  const page = ComponentRouter(merge(sources, {
    routes$: just(routes)
  }));

  return {
    DOM: page.DOM,
    router: page.route$,
    authentication$: page.pluck('auth$'),
    queue$: page.pluck('queue$'),
    preventDefault: page.pluck('preventDefault')
  };
}
