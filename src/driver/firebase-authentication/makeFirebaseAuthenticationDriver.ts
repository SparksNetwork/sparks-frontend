import { Stream, just } from 'most';
import firebase = require('firebase');

import { AuthenticationInput, AuthenticationOutput } from './types';
import { createUserCredential$ } from './createUserCredential$';
import { defaultUserCredential } from './defaultUserCredential';

export function makeFirebaseAuthenticationDriver(firebaseInstance: any) {
  return function firebaseAuthenticationDriver(sink$: Stream<AuthenticationInput>):
      Stream<AuthenticationOutput> {
    return sink$.map((authenticationInput) => {
      const method = authenticationInput.method;

      return createUserCredential$(method, authenticationInput, firebaseInstance)
        .map(convertUserCredentialToAuthenticationOutput)
        .recoverWith<firebase.auth.Error>(createDefaultAuthenticationOutput$);
    })
      .switch()
      .startWith(convertUserCredentialToAuthenticationOutput(defaultUserCredential));
  };
}

function convertUserCredentialToAuthenticationOutput(
    userCredential: firebase.auth.UserCredential): AuthenticationOutput  {
  return {
    error: null,
    userCredential
  };
}


function createDefaultAuthenticationOutput$ (authenticationInput) {
  return just<AuthenticationOutput>({
    error: authenticationInput,
    userCredential: defaultUserCredential
  });
}