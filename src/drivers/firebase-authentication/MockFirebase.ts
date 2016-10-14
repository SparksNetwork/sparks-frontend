import firebase = require('firebase');
import { convertUserToUserCredential } from './convertUserToUserCredential';

export class MockFirebase {
  constructor(private email: string, private error: string = '') {}

  auth() {
    return new MockAuth(this.email, this.error);
  }
}

class MockAuth {
  constructor(private email: string, private error: string) {}

  signInAnonymously(): firebase.Promise<firebase.User> {
    return this.checkForError(makeUser('', true));
  }

  signInWithEmailAndPassword(email: string): firebase.Promise<firebase.User> {
    return this.checkForError(makeUser(email, false));
  }

  signInWithPopup(provider: firebase.auth.AuthProvider): firebase.Promise<firebase.auth.UserCredential> {
    return this.checkForError(emailAndPasswordSignIn(this.email, provider));
  }

  signInWithRedirect(): firebase.Promise<void> {
    return this.checkForError(firebase.Promise.resolve(void 0));
  }

  getRedirectResult(): firebase.Promise<firebase.auth.UserCredential> {
    return emailAndPasswordSignIn(this.email, new firebase.auth.EmailAuthProvider());
  }

  signOut(): firebase.Promise<void> {
    return this.checkForError(firebase.Promise.resolve(void 0));
  }

  createUserWithEmailAndPassword(email: string): firebase.Promise<firebase.User> {
    return this.checkForError(makeUser(email, false));
  }

  checkForError(returnValue) {
    if (this.error) {
      return makeAuthenticationError(
        this.error,
        this.error
      );
    }

    return returnValue;
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
  return firebase.Promise.reject(new AuthenticationError(code, message));
}
