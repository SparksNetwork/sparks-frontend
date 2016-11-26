import { Stream, never } from 'most';
import { VNode } from '@motorcycle/dom';
import { RouterInput, Router } from '@motorcycle/router';

import { AuthenticationType } from '../drivers/firebase-authentication';
import { switchMap } from '../helpers';
import { routes } from './routes';
import { AppSources, AppSinks } from './types';

export function App(sources: AppSources): AppSinks {
  return switchSinks(Router<AppSources, AppSinks>(routes, sources));
};

function switchSinks(sinks$: Stream<AppSinks>): AppSinks {
  const dom: Stream<VNode> =
    switchMap(pluckSink('dom'), sinks$);

  const router: RouterInput =
    switchMap(pluckSink('router'), sinks$);

  const authentication$: Stream<AuthenticationType> =
    switchMap(pluckSink('authentication$'), sinks$);

  return {
    dom,
    router,
    authentication$,
  };
}

function pluckSink(sinkName: keyof AppSinks) {
  return function pluckOrNever (sinks: AppSinks): Stream<any> {
    return sinks[sinkName] || never();
  };
}