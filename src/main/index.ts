import { Stream, map, merge, never } from 'most';
import { Location, Pathname } from '@motorcycle/history';
import { div, h2, a, p } from '@motorcycle/dom';
import { Routing, MainSources, MainSinks } from '../app';

import { ConnectScreen } from './connect';
import { SignInScreen } from './signin';
import { Dash } from './dash';

export function main(sources: MainSources): MainSinks {
  const sinks$: Stream<MainSinks> =
    Routing({
      '/': Screen,
      '/dash': Dash,
      '/connect': ConnectScreen,
      '/signin': SignInScreen,
    }, sources);

  return {
    dom: sinks$.map(sinks => sinks.dom).switch(),
    router: sinks$.map(sinks => sinks.router).switch(),
    authentication$: sinks$.map(sinks => sinks.authentication$).switch(),
  };
}

function Screen(sources: MainSources): MainSinks {
  const connect$: Stream<Pathname> =
    sources.dom.select('a.connect').events('click')
      .tap(evt => evt.preventDefault())
      .map(() => '/connect');

  const signin$: Stream<Pathname> =
    sources.dom.select('a.signin').events('click')
      .tap(evt => evt.preventDefault())
      .map(() => '/signin');

  return {
    dom: map(view, sources.router.history()),
    router: merge(connect$, signin$),
    authentication$: never(),
  };
}

function view(location: Location) {
  return div([
    h2(`Home: ${location.pathname}`),
    div([
      a('.connect', { props: { href: '/connect' } }, 'Connect'),
      p(' | '),
      a('.signin', { props: { href: '/signin' } }, 'Sign In'),
    ]),
  ]);
}
