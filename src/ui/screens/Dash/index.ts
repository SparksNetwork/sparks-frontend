import { Stream, combineArray, just } from 'most';
import { VNode, div, h2 } from '@motorcycle/dom';
import hold from '@most/hold';
// import firebase = require('firebase');
import { Authentication, GET_REDIRECT_RESULT } from '../../../drivers/firebase-authentication';

export interface DashSources {
  authentication$: Stream<Authentication>;
}

export interface DashSinks {
  DOM: Stream<VNode>;
}

export function Dash(sources: DashSources) {
  const auth$ = sources.authentication$.thru(hold);

  const isAuthenticated$ = auth$
    .filter(a => a.error === null)
    .filter(a => a.userCredential.user !== null)
    .map(() => true)
    .startWith(false)
    .multicast();

  const userDisplayName$: Stream<string> =
    isAuthenticated$
      .filter(x => !!x)
      .map(() => auth$)
      .switch()
      .map((authentication: Authentication) => {
        const userCredential: firebase.auth.UserCredential =
          authentication.userCredential as firebase.auth.UserCredential;

        const user = userCredential.user as firebase.User;

        return user.displayName as string;
      })
      .startWith('');

  const view$ = combineArray(view, [
    isAuthenticated$,
    userDisplayName$,
  ]);

  return {
    DOM: view$,
    authentication$: just({ method: GET_REDIRECT_RESULT }),
  };
}

function view(isAuthenticated: boolean, displayName: string) {
  return div({ style: { backgroundColor: 'white' } }, [
    h2({}, [
      isAuthenticated ? `You are logged in as ${displayName}` :
        `You are not logged in`
    ])
  ]);
}
