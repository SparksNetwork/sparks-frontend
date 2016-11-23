import { Stream, constant, just, startWith } from 'most';
import { DOMSource, VNode, button } from '@motorcycle/dom';
import { REDIRECT, GET_REDIRECT_RESULT, AuthenticationType }
  from '../../drivers/firebase-authentication';
import firebase = require('firebase');

export function GoogleAuthenticationButton(
  sources: GoogleAuthenticationButtonSources): GoogleAuthenticationButtonSinks
{
  const { dom } = sources;

  const click$: Stream<Event> =
    dom.select(googleButtonId).events('click');

  const authentication$: Stream<AuthenticationType> =
    startWith(redirectResultAuthenticationType,
      constant(googleRedirectAuthentication, click$));

  const view$: Stream<VNode> = just(view);

  return {
    dom: view$,
    authentication$,
  };
}

const redirectResultAuthenticationType: AuthenticationType =
  { method: GET_REDIRECT_RESULT };

const googleRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider(),
  };

export const googleButtonId = `#google-auth`;

const classNames: string =
  '.c-btn--large';

const style =
  {
    backgroundColor: 'crimson',
    color: 'snow',
  };

const view: VNode =
  button(googleButtonId + classNames, { style }, [ 'Sign in with Google' ]);

export interface GoogleAuthenticationButtonSources {
  dom: DOMSource;
}

export interface GoogleAuthenticationButtonSinks {
  dom: Stream<VNode>;
  authentication$: Stream<AuthenticationType>;
}
