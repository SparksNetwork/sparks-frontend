import { Stream, just } from 'most';
import firebase = require('firebase');
import { create } from '@most/create';
import {
  AuthenticationType, CreateUserAuthentication,
  EmailAndPasswordAuthentication, PopupAuthentication,
  REDIRECT, EMAIL_AND_PASSWORD, CREATE_USER, POPUP, ANONYMOUSLY, SIGN_OUT,
  GET_REDIRECT_RESULT,
} from './types';
import { convertUserToUserCredential } from './convertUserToUserCredential';
import { defaultUserCredential } from './defaultUserCredential';

export function createUserCredential$(
    method: string,
    authenticationType: AuthenticationType,
    firebaseInstance: any): Stream<firebase.auth.UserCredential> {
  // Ordered most common on top for optimisation.
  // We use if-statements instead of switch, because few conditionals
  // optimise better with if-statements.

  if (method === GET_REDIRECT_RESULT) {
    return getRedirectResult(firebaseInstance);
  }

  if (method === REDIRECT) {
    return redirectSignIn(authenticationType, firebaseInstance)
      .constant(defaultUserCredential);
  }

  if (method === EMAIL_AND_PASSWORD) {
    return emailAndPasswordSignIn(authenticationType, firebaseInstance);
  }

  if (method === CREATE_USER) {
    const { email, password } = authenticationType as CreateUserAuthentication;

    return fromFirebasePromise<firebase.User>(
      firebaseInstance.auth().createUserWithEmailAndPassword(email, password))
      .map(convertUserToUserCredential(new firebase.auth.EmailAuthProvider()));
  }

  if (method === POPUP) {
    return popupSignIn(authenticationType, firebaseInstance);
  }

  if (method === ANONYMOUSLY) {
    return fromFirebasePromise<firebase.User>(
      firebaseInstance.auth().signInAnonymously())
      .map(user => ({ user, credential: null }));
  }

  if (method === SIGN_OUT) {
    return fromFirebasePromise<void>(firebaseInstance.auth().signOut())
      .constant(defaultUserCredential);
  }

  return just(defaultUserCredential);
}

function emailAndPasswordSignIn(authenticationInput: AuthenticationType, firebaseInstance: any) {
  const { email, password } = (authenticationInput as EmailAndPasswordAuthentication);

  return fromFirebasePromise<firebase.User>(
    firebaseInstance.auth().signInWithEmailAndPassword(email, password))
    .map(convertUserToUserCredential(new firebase.auth.EmailAuthProvider()));
}

function popupSignIn(authenticationInput: AuthenticationType, firebaseInstance: any) {
  const { provider } = authenticationInput as PopupAuthentication;

  return fromFirebasePromise<firebase.auth.UserCredential>(
    firebaseInstance.auth().signInWithPopup(provider));
}

function redirectSignIn(authenticationInput: AuthenticationType, firebaseInstance: any) {
  const { provider } = authenticationInput as PopupAuthentication;

  return fromFirebasePromise<firebase.auth.UserCredential>(
    firebaseInstance.auth().signInWithRedirect(provider));
}

function getRedirectResult(firebaseInstance: any) {
  return fromFirebasePromise<firebase.auth.UserCredential>(
    firebaseInstance.auth().getRedirectResult(),
  );
}

function fromFirebasePromise<T>(firebasePromise: firebase.Promise<T>): Stream<T> {
  return create<T>((add, end, error) => {
    firebasePromise.then((value: T) => {
      add(value);
      end(value);
    }).catch((err) => {
      error(err);
    });
  });
}
