import { FirebaseSource, QueueSink, QueueSource } from './drivers/cyclic-fire';
import { AuthenticationType, Authentication } from './drivers/firebase-authentication';
import { Stream, just } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { Sources, Sinks } from './components/types';
import { merge } from 'ramda';

import Landing from './ui/screens/Landing';
import Login from './ui/screens/Login';
import { UserRegistration } from './ui/screens/UserRegistration'

import ComponentRouter from './components/ComponentRouter';

const routes = {
  '/': Landing,
  '/login': Login,
  '/join': UserRegistration
};

export interface MainSinks extends Sinks {
  DOM: Stream<VNode>;
  router: Stream<string>;
  authentication$: Stream<AuthenticationType>;
  queue$: QueueSink;
}

export interface MainSources extends Sources {
  DOM: DOMSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
  firebase: FirebaseSource;
  queue$: QueueSource;
}

export function main(sources: MainSources): MainSinks {
  const page = ComponentRouter(merge(sources, {
    routes$: just(routes)
  }));

  return {
    DOM: page.DOM,
    router: page.route$,
    authentication$: page.pluck('authentication$'),
    queue$: page.pluck('queue$'),
    preventDefault: page.pluck('preventDefault')
  };
}
