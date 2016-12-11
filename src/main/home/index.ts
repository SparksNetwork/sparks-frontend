import { Stream, never, combine, merge } from 'most';
import { Pathname, Location } from '@motorcycle/history';
import { h2, a, div, p } from '@motorcycle/dom';
import { MainSinks, MainSources } from '../../app';
import { FirebaseUserChange } from '../../drivers/firebase-user';

export function Home(sources: MainSources): MainSinks {
  const connect$: Stream<Pathname> =
    sources.dom.select('a.connect').events('click')
      .tap(evt => evt.preventDefault())
      .map(() => '/connect');

  const signin$: Stream<Pathname> =
    sources.dom.select('a.signin').events('click')
      .tap(evt => evt.preventDefault())
      .map(() => '/signin');

  sources.user$.observe(u => console.log('userchange', u));

  return {
    dom: combine(view, sources.router.history(), sources.user$),
    router: merge(connect$, signin$),
    authentication$: never(),
  };
}

function view(location: Location, user: FirebaseUserChange) {
  return div([
    h2(`Home: ${location.pathname}`),
    div([
      a('.connect', { props: { href: '/connect' } }, 'Connect'),
      p(' | '),
      a('.signin', { props: { href: '/signin' } }, 'Sign In'),
    ]),
    div(`${user}`),
  ]);
}
