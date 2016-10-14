import firebase = require('firebase');
import { AuthenticationMethod, GOOGLE, FACEBOOK, EMAIL_AND_PASSWORD } from './types';
import {
  AuthenticationInput,
  RedirectAuthenticationInput,
  EmailAndPasswordAuthenticationInput,
  SignOutAuthenticationInput,
  REDIRECT,
  SIGN_OUT
} from '../../drivers/firebase-authentication';

export function model(authenticationMethod: AuthenticationMethod): AuthenticationInput {
  if (authenticationMethod.method === GOOGLE) {
    return createGoogleAuthenticationInput();
  }

  if (authenticationMethod.method === FACEBOOK) {
    return createFacebookAuthenticationInput();
  }

  if (authenticationMethod.method === EMAIL_AND_PASSWORD) {
    return createEmailAndPasswordAuthenticationInput(
      authenticationMethod.email, authenticationMethod.password);
  }

  return { method: SIGN_OUT } as SignOutAuthenticationInput;
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