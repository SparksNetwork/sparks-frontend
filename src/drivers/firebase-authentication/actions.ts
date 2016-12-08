import { Stream, startWith, constant } from 'most';

import {
  REDIRECT,
  GET_REDIRECT_RESULT,
  AuthenticationType,
} from './types';

import firebase = require('firebase');

/*

Convenience methods for turning other streams into authentication driver actions

redirectAuthAction:
triggers a redirect authentication for specified provider whenever a click stream happens

Use:

  const googleAuth$: Stream<AuthenticationType> =
    redirectAuthAction(googleRedirectAuthentication, someClickStreamUsually$)

  return {
    authentication$: googleAuth$,
  }
*/

const redirectResultAuthenticationType: AuthenticationType =
  { method: GET_REDIRECT_RESULT };

export const googleRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider(),
  };

export const facebookRedirectAuthentication: AuthenticationType =
  {
    method: REDIRECT,
    provider: new firebase.auth.FacebookAuthProvider(),
  };

export function redirectAuthAction(authType: AuthenticationType, click$: Stream<any>) {
  return startWith(redirectResultAuthenticationType,
    constant(authType, click$));
}
