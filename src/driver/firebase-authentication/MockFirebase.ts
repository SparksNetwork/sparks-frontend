import firebase = require('firebase');
import { convertUserToUserCredential } from './makeFirebaseAuthenticationDriver';

export class MockFirebase {
  constructor(private email: string) { }

  auth() {
    return new MockAuth(this.email);
  }
}

class MockAuth {
  constructor(private email: string) {}

  signInAnonymously(): firebase.Promise<firebase.User> {
    return makeUser('', true);
  }

  signInWithEmailAndPassword(email: string): firebase.Promise<firebase.User> {
    return makeUser(email, false);
  }

  signInWithPopup(provider: firebase.auth.AuthProvider): firebase.Promise<firebase.auth.UserCredential> {
    return emailAndPasswordSignIn(this.email, provider);
  }

  signInWithRedirect(provider: firebase.auth.AuthProvider): firebase.Promise<firebase.auth.UserCredential> {
    return emailAndPasswordSignIn(this.email, provider);
  }

  signOut(): firebase.Promise<void> {
    return firebase.Promise.resolve(void 0);
  }

  createUserWithEmailAndPassword(email: string): firebase.Promise<firebase.User> {
    if (email === 'existinguser@sparks.network') {
      return firebase.Promise.reject(makeAuthenticationError(
        'auth/email-already-in-use',
        'This email is already in use'
      ));
    }

    return makeUser(email, false);
  }
}

function emailAndPasswordSignIn(email, provider) {
  return makeUser(email, false).then(convertUserToUserCredential(provider));
}

function makeUser(email, isAnonymous) {
  return firebase.Promise.resolve({ email, isAnonymous } as any as firebase.User);
}

class AuthenticationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

function makeAuthenticationError(code: string, message: string) {
  return new AuthenticationError(code, message);
}
