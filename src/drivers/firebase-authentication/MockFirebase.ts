import firebase = require('firebase');
import { defaultUserCredential } from './defaultUserCredential';
import { convertUserToUserCredential } from './convertUserToUserCredential';

export class MockFirebase {
  private _mockAuth: MockAuth;

  constructor(private email: string, private error: string = '') {
    this._mockAuth = new MockAuth(this.email, this.error);
  }

  auth() {
    return this._mockAuth;
  }
}

class MockAuth {
  public authenticationOccured: boolean = false;
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
    const returnValue = this.authenticationOccured
      ? emailAndPasswordSignIn(this.email, new firebase.auth.EmailAuthProvider())
      : firebase.Promise.resolve(defaultUserCredential);

    return this.checkForError(returnValue);
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

    this.authenticationOccured = true;

    return returnValue;
  }
}

function emailAndPasswordSignIn(email, provider) {
  return makeUser(email, false).then(convertUserToUserCredential(provider));
}

function makeUser(email, isAnonymous) {
  return firebase.Promise.resolve({ email, isAnonymous } as any as firebase.User);
}

function makeAuthenticationError(code: string, message: string) {
  return firebase.Promise.reject(new MockAuthenticationError( code, message));
}

class MockAuthenticationError extends Error {
  constructor(public code: string, message) {
    super(message);
  }
}
