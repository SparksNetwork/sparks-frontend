import { Stream } from 'most';
import { Router } from '@motorcycle/router';
import { MainSources, MainSinks } from './app';

import { augmentWithAnchorClicks } from './augmenters';

import { ConnectScreen } from './features/connect';
import { SignInScreen } from './features/signin';
import { Dash } from './features/dash';
import { Home } from './features/home';

export function main(sources: MainSources): MainSinks {
  const sinks$: Stream<MainSinks> =
    Router({
      '/': augmentWithAnchorClicks(Home),
      '/dash': augmentWithAnchorClicks(Dash),
      '/connect': augmentWithAnchorClicks(ConnectScreen),
      '/signin': augmentWithAnchorClicks(SignInScreen),
    }, sources);

  return {
    dom: sinks$.map(sinks => sinks.dom).switch(),
    router: sinks$.map(sinks => sinks.router).switch(),
    authentication$: sinks$.map(sinks => sinks.authentication$).switch(),
  };
};
