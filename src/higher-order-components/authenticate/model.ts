import firebase = require('firebase');
import { AuthenticationMethod, GOOGLE, FACEBOOK, EMAIL_AND_PASSWORD } from './types';
import {
  AuthenticationInput,
  RedirectAuthenticationInput,
  EmailAndPasswordAuthenticationInput,
  REDIRECT,
  SIGN_OUT
} from '../../drivers/firebase-authentication';

export function model(authenticationMethod: AuthenticationMethod): AuthenticationInput {
  const authenticationMethods = {};
  authenticationMethods[GOOGLE] = createGoogleAuthenticationInput;
  authenticationMethods[FACEBOOK] = createFacebookAuthenticationInput;
  authenticationMethods[EMAIL_AND_PASSWORD] = createEmailAndPasswordAuthenticationInput;

  const { method, email, password } = authenticationMethod as any;

  return authenticationMethods[method](email, password) || { method: SIGN_OUT };
}

function createGoogleAuthenticationInput(): RedirectAuthenticationInput {
  return {
    method: REDIRECT,
    provider: new firebase.auth.GoogleAuthProvider()
  };
}

function createFacebookAuthenticationInput(): RedirectAuthenticationInput {
  return {
    method: REDIRECT,
    provider: new firebase.auth.FacebookAuthProvider()
  };
}

function createEmailAndPasswordAuthenticationInput(email: string, password: string):
    EmailAndPasswordAuthenticationInput {
  return {
    method: EMAIL_AND_PASSWORD,
    email,
    password
  };
}