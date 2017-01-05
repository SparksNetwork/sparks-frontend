import { MainSinks, MainSources } from './app';

import { ConnectScreen } from './features/connect';
import { Dash } from './features/dash';
import { Home } from './features/home';
import { Router } from '@motorcycle/router';
import { SignInScreen } from './features/signin';
import { Stream } from 'most';
import { augmentWithAnchorClicks } from './augmenters';

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
    i18n: sinks$.map(sinks => sinks.i18n).switch(),
    authentication$: sinks$.map(sinks => sinks.authentication$).switch(),
  };
};
