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

  const language$ =
    sources.router
      .history()
      .map(location => location.queries.lang || 'en-US');

  const i18n =
    sinks$
      .map(sinks => sinks.i18n)
      .switch()
      .merge(language$);

  return {
    dom: sinks$.map(sinks => sinks.dom).switch(),
    router: sinks$.map(sinks => sinks.router).switch(),
    i18n,
    authentication$: sinks$.map(sinks => sinks.authentication$).switch(),
  };
};
