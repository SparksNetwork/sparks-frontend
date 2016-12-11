import { Stream } from 'most';
import { Router } from '@motorcycle/router';
import { MainSources, MainSinks } from '../app';

import { ConnectScreen } from './connect';
import { SignInScreen } from './signin';
import { Dash } from './dash';
import { Home } from './home';

export function main(sources: MainSources): MainSinks {
  const sinks$: Stream<MainSinks> =
    Router({
      '/': Home,
      '/dash': Dash,
      '/connect': ConnectScreen,
      '/signin': SignInScreen,
    }, sources);

  return {
    dom: sinks$.map(sinks => sinks.dom).switch(),
    router: sinks$.map(sinks => sinks.router).switch(),
    authentication$: sinks$.map(sinks => sinks.authentication$).switch(),
  };
};
