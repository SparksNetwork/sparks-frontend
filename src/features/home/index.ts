import { MainSinks, MainSources } from '../../app';
import { a, div, h2, p } from '@motorcycle/dom';
import { combine, never } from 'most';

import { FirebaseUserChange } from '../../drivers/firebase-user';
import { Location } from '@motorcycle/history';

export function Home(sources: MainSources): MainSinks {
  return {
    dom: combine(view, sources.router.history(), sources.user$),
    router: never(),
    i18n: never(),
    authentication$: never(),
  };
}

function view(location: Location, user: FirebaseUserChange) {
  return div([
    h2(`Home: ${location.path}`),
    div([
      a('.connect', { props: { href: '/connect' } }, 'Connect'),
      p(' | '),
      a('.signin', { props: { href: '/signin' } }, 'Sign In'),
    ]),
    div(`${user}`),
  ]);
}
