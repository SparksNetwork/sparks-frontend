import { Stream, just } from 'most';
import create = require('@most/create');
import firebase = require('firebase');

export const ANONYMOUSLY: 'ANONYMOUSLY' = 'ANONYMOUSLY';
export const EMAIL_AND_PASSWORD: 'EMAIL_AND_PASSWORD' = 'EMAIL_AND_PASSWORD';
export const POPUP: 'POPUP' = 'POPUP';
export const REDIRECT: 'REDIRECT' = 'REDIRECT';
export const SIGN_OUT: 'SIGN_OUT' = 'SIGN_OUT';
export const CREATE_USER: 'CREATE_USER' = 'CREATE_USER';

export interface AnonymousAuthenticationInput {
  method: 'ANONYMOUSLY';
}

export interface EmailAndPasswordAuthenticationInput {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export interface PopupAuthenticationInput {
  method: 'POPUP';
  provider: firebase.auth.AuthProvider;
}

export interface RedirectAuthenticationInput {
  method: 'REDIRECT';
  provider: firebase.auth.AuthProvider;
}

export interface SignOutAuthenticationInput {
  method: 'SIGN_OUT';
}

export interface CreateUserAuthenticationInput {
  method: 'CREATE_USER';
  email: string;
  password: string;
}

export type AuthenticationInput =
  AnonymousAuthenticationInput |
  EmailAndPasswordAuthenticationInput |
  PopupAuthenticationInput |
  RedirectAuthenticationInput |
  SignOutAuthenticationInput |
  CreateUserAuthenticationInput;

const defaultUserCredential = {
  user: null,
  credential: null
};

export function makeFirebaseAuthenticationDriver(firebaseInstance: any) {
  return function firebaseAuthenticationDriver(sink$: Stream<AuthenticationInput>):
      Stream<firebase.auth.UserCredential> {
    return sink$.map((authenticationInput) => {
      const method = authenticationInput.method;

      // Ordered most common on top for optimisation.
      // We use if-statements instead of switch, because few conditionals
      // optimise better with if-statements.
      if (method === REDIRECT) {
        return redirectSignIn(authenticationInput, firebaseInstance);
      }

      if (method === EMAIL_AND_PASSWORD) {
        return emailAndPasswordSignIn(authenticationInput, firebaseInstance);
      }

      if (method === CREATE_USER) {
        const { email, password } = authenticationInput as CreateUserAuthenticationInput;

        return fromFirebasePromise(
          firebaseInstance.auth().createUserWithEmailAndPassword(email, password))
            .map(convertUserToUserCredential(new firebase.auth.EmailAuthProvider()));
      }

      if (method === POPUP) {
        return popupSignIn(authenticationInput, firebaseInstance);
      }

      if (method === ANONYMOUSLY) {
        return fromFirebasePromise<firebase.User>(
          firebaseInstance.auth().signInAnonymously())
          .map(user => ({ user, credential: null}));
      }

      if (method === SIGN_OUT) {
        return fromFirebasePromise<void>(firebaseInstance.auth().signOut())
          .constant(defaultUserCredential);
      }

      return just(defaultUserCredential);
    }).switch().startWith(defaultUserCredential);
  };
}

function emailAndPasswordSignIn(authenticationInput: AuthenticationInput, firebaseInstance: any) {
  const { email, password } = (authenticationInput as EmailAndPasswordAuthenticationInput);

  return fromFirebasePromise<firebase.User>(
    firebaseInstance.auth().signInWithEmailAndPassword(email, password))
      .map(convertUserToUserCredential(new firebase.auth.EmailAuthProvider()));
}

function popupSignIn(authenticationInput: AuthenticationInput, firebaseInstance: any) {
  const { provider } = authenticationInput as PopupAuthenticationInput;

  return fromFirebasePromise<firebase.auth.UserCredential>(
    firebaseInstance.auth().signInWithPopup(provider));
}

function redirectSignIn(authenticationInput: AuthenticationInput, firebaseInstance: any) {
  const { provider } = authenticationInput as PopupAuthenticationInput;

  return fromFirebasePromise<firebase.auth.UserCredential>(
    firebaseInstance.auth().signInWithRedirect(provider));
}

export function convertUserToUserCredential(provider: firebase.auth.AuthProvider) {
  return function (user: firebase.User): firebase.auth.UserCredential {
    return {
      user,
      credential: { provider: provider.providerId }
    };
  };
}

function fromFirebasePromise<T>(firebasePromise: firebase.Promise<T>): Stream<T> {
  return create<T>((add, end, error) => {
    firebasePromise.then((value: T) => {
      add(value);
      end(value);
    }).catch(err => {
      error(err);
    });
  });
}
