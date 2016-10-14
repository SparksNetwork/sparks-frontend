/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { CREATE_USER,
  ANONYMOUSLY, EMAIL_AND_PASSWORD, POPUP, REDIRECT, SIGN_OUT
} from './types';
import {
  makeFirebaseAuthenticationDriver
} from './makeFirebaseAuthenticationDriver';
import firebase = require('firebase');
import { just, periodic } from 'most';

import { MockFirebase } from './MockFirebase';

const firebaseConfig = {
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

firebase.initializeApp(firebaseConfig);

const anonymouslyAuthenticationInput = {
  method: ANONYMOUSLY
};

const emailAndPasswordAuthenticationInput = {
  method: EMAIL_AND_PASSWORD,
  email: 'sparkstestuser@sparks.network',
  password: 'testpassword'
};

const popupAuthenticationInput = {
  method: POPUP,
  provider: new firebase.auth.GoogleAuthProvider() as firebase.auth.AuthProvider
};

const redirectAuthenticationInput = {
  method: REDIRECT,
  provider: new firebase.auth.GoogleAuthProvider() as firebase.auth.AuthProvider
};

const signOutAuthenticationInput = {
  method: SIGN_OUT
};

const firebaseAuthenticationDriver =
  makeFirebaseAuthenticationDriver(new MockFirebase(
      emailAndPasswordAuthenticationInput.email));

const createUserAuthenticationInput = {
  method: CREATE_USER,
  email: 'newuser@sparks.network',
  password: '1234'
};

describe('firebase authentication', () => {
  describe('makeFirebaseAuthenticationDriver', () => {
    it('should be a function', () => {
      assert(typeof makeFirebaseAuthenticationDriver === 'function');
    });
  });

  describe('firebaseAuthenticationDriver', () => {
    it('should be a function', () => {
      assert(typeof firebaseAuthenticationDriver === 'function');
    });

    it('should return a Stream', () => {
      const source = firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput));

      assert(typeof source.observe === 'function');
    });

    describe('source', () => {
      it('should start with an intitial AuthenticationOutput', (done) => {
        const source = firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).take(1);

        source.observe((authenticationOutput) => {
          assert(authenticationOutput.error === null);
          assert(authenticationOutput.userCredential !== null);
          done();
        }).catch(done);
      });

      it('should contain an AuthenticationOutput', (done) => {
        firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).skip(1)
          .observe((authenticationOutput) => {
            assert(authenticationOutput.hasOwnProperty('error'));
            assert(authenticationOutput.hasOwnProperty('userCredential'));
            done();
          });
      });

      describe('AuthenticationOutput', () => {
        describe('Not Authenticated', () => {
          it('should have property user equal to `null`', (done) => {
            firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).take(1)
              .observe(authenticationOutput => {
                assert(authenticationOutput.userCredential.user === null);
                done();
              });
          });

          it('should have property credential equal to `null`', (done) => {
             firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).take(1)
              .observe(authenticationOutput => {
                assert(authenticationOutput.userCredential.credential === null);
                done();
              });
          });
        });

        describe('Authenticated', () => {
          it('should have property user of type firebase.User', (done) => {
            firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).skip(1)
              .observe(authenticationOutput => {
                const user: firebase.User | null = authenticationOutput.userCredential.user;
                assert(user !== null);
                done();
              }).catch(done);
          });
        });
      });
    });

    describe('Sign In', () => {
      describe('Email & Password', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).skip(1)
            .observe(authenticationOutput => {
              const user: firebase.User | null = authenticationOutput.userCredential.user;

              if (user === null) {
                return done('User can not be null');
              }

              assert(user.email === emailAndPasswordAuthenticationInput.email);
              done();
            });
        });

        it('should throw Authentication Errors',
          assertFirebaseAuthenticationError(emailAndPasswordAuthenticationInput));
      });

      describe('Popup', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          firebaseAuthenticationDriver(just(popupAuthenticationInput)).skip(1)
            .observe(authenticationOutput => {
              const user: firebase.User | null = authenticationOutput.userCredential.user;

              if (user === null) {
                return done('User can not be null');
              }

              assert(user.email === emailAndPasswordAuthenticationInput.email);
              done();
            });
        });

        it('should throw Authentication Errors',
          assertFirebaseAuthenticationError(popupAuthenticationInput));
      });

      describe('Redirect', () => {
        it('should return null firebase UserCredential', (done) => {
          firebaseAuthenticationDriver(just(redirectAuthenticationInput)).skip(1)
            .observe(authenticationOutput => {
              const user: firebase.User | null = authenticationOutput.userCredential.user;

              assert(user === null);
              done();
            });
        });

        it('should throw Authentication Errors',
          assertFirebaseAuthenticationError(redirectAuthenticationInput));
      });

      describe('Anonymously', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).skip(1)
            .observe(authenticationOutput => {
              const user: firebase.User | null = authenticationOutput.userCredential.user;

              if (user === null) {
                return done('User can not be null');
              }

              assert(user.isAnonymous);
              done();
            });
        });

        it('should throw Authentication Errors',
          assertFirebaseAuthenticationError(anonymouslyAuthenticationInput));
      });
    });

    describe('Sign Out', () => {
      it('should return a null firebase UserCredential', (done) => {
        const input = [
          anonymouslyAuthenticationInput,
          signOutAuthenticationInput
        ];

        const authenticationInput$ = periodic(100, 1)
          .skip(1)
          .scan(x => x + 1, 0)
          .map(x => input[x])
          .take(2);

        firebaseAuthenticationDriver(authenticationInput$).skip(2)
          .observe(authenticationOutput => {
            const user: firebase.User | null = authenticationOutput.userCredential.user;

            assert(user === null);
            done();
          });
      });

      it('should throw Authentication Errors',
        assertFirebaseAuthenticationError(signOutAuthenticationInput));
    });

    describe('Create Email And Password Account', () => {
      it('should return a non-null firebase UserCredential', (done) => {
        firebaseAuthenticationDriver(just(createUserAuthenticationInput)).skip(1)
          .observe(authenticationOutput => {
            const user: firebase.User | null = authenticationOutput.userCredential.user;

            assert(user !== null);
            done();
          });
      });

      it('should throw Authentication Errors',
        assertFirebaseAuthenticationError(createUserAuthenticationInput));
    });
  });
});

function assertFirebaseAuthenticationError(authenticationInput) {
  const code = 'SomeError';
  const driver = makeAuthenticationDriverWithError(code);

  return function (done) {
    driver(just(authenticationInput)).skip(1)
      .observe(({ error }) => {
        assert(error !== null && error.code === code);
        done();
      }).catch(done);
  };
}

function makeAuthenticationDriverWithError(error: string) {
  return makeFirebaseAuthenticationDriver(new MockFirebase(
    'test@sparks.network',
    error
  ));
}