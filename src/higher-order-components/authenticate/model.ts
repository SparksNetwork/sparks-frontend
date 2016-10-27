import firebase = require('firebase');
import { AuthenticationMethod, GOOGLE, FACEBOOK, EMAIL_AND_PASSWORD } from './types';
import {
  AuthenticationType,
  RedirectAuthentication,
  EmailAndPasswordAuthentication,
  REDIRECT,
  SIGN_OUT
} from '../../drivers/firebase-authentication';

export function model(authenticationMethod: AuthenticationMethod): AuthenticationType {
  const authenticationMethods = {};
  authenticationMethods[GOOGLE] = createGoogleAuthenticationInput;
  authenticationMethods[FACEBOOK] = createFacebookAuthenticationInput;
  authenticationMethods[EMAIL_AND_PASSWORD] = createEmailAndPasswordAuthenticationInput;

  const { method, email, password } = authenticationMethod as any;

  return authenticationMethods[method](email, password) || { method: SIGN_OUT };
}

function createGoogleAuthenticationInput(): RedirectAuthentication {
  return {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider()
  };
}

function createFacebookAuthenticationInput(): RedirectAuthentication {
  return {
    method: REDIRECT,
    provider: new firebase.auth.FacebookAuthProvider()
  };
}

function createEmailAndPasswordAuthenticationInput(email: string, password: string):
    EmailAndPasswordAuthentication {
  return {
    method: EMAIL_AND_PASSWORD,
    email,
    password
  };
}
