import { Stream, constant, just, startWith } from 'most';
import { DOMSource, VNode, button } from '@motorcycle/dom';
import { REDIRECT, GET_REDIRECT_RESULT, AuthenticationType }
  from '../../drivers/firebase-authentication';
import firebase = require('firebase');

export function FacebookAuthenticationButton(
  sources: FacebookAuthenticationButtonSources): FacebookAuthenticationButtonSinks
{
  const { dom } = sources;

  const click$: Stream<Event> =
    dom.select(facebookButtonId).events('click');

  const authentication$: Stream<AuthenticationType> =
    startWith(redirectResultAuthenticationType,
      constant(facebookRedirectAuthentication, click$));

  const view$: Stream<VNode> = just(view);

  return {
    dom: view$,
    authentication$,
  };
}

const redirectResultAuthenticationType: AuthenticationType =
  { method: GET_REDIRECT_RESULT };

const facebookRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.FacebookAuthProvider(),
  };

export const facebookButtonId = `#facebook-auth`;

const classNames: string =
  '.c-btn--large';

const style =
  {
    backgroundColor: 'royalblue',
    color: 'lavender',
  };

const view: VNode =
  button(facebookButtonId + classNames, { style }, [ 'Sign in with Facebook' ]);

export interface FacebookAuthenticationButtonSources {
  dom: DOMSource;
}

export interface FacebookAuthenticationButtonSinks {
  dom: Stream<VNode>;
  authentication$: Stream<AuthenticationType>;
}
