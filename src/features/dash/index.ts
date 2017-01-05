import { AuthenticationType, signoutAuthentication } from '../../drivers/firebase-authentication';
import { MainSinks, MainSources } from '../../app';
import { Stream, map, never } from 'most';
import { a, div, p } from '@motorcycle/dom';

import { propOr } from 'ramda';

import firebase = require('firebase');

export function Dash(sources: MainSources): MainSinks {
  const userEmail$: Stream<string> =
    map<firebase.User | null, string>(toUserEmail, sources.user$);

  const click$: Stream<Event> =
    sources.dom.select('a.signout').events('click')
      .tap(evt => evt.preventDefault());

  const authentication$: Stream<AuthenticationType> =
    click$.map(() => signoutAuthentication);

  const view$ = userEmail$.map(view);

  return {
    dom: view$,
    router: never(),
    i18n: never(),
    authentication$,
  };
}

function toUserEmail(user: firebase.User | null): string {
  if (!user)
    return `Unknown User`;

  return propOr<string, firebase.User, string>('Unknown User', 'email', user);
}

function view(userEmail: string) {
  return div(`#dashboard`, [
    p([ `You are currently logged in as: `,
      p('#user-email', `${userEmail}`),
      div([
        a('.signout', { props: { href: '/connect' } }, 'Signout'),
      ]),
    ]),
  ]);
}
