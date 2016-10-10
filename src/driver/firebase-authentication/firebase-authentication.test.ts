/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { makeFirebaseAuthenticationDriver, CREATE_USER,
        ANONYMOUSLY, EMAIL_AND_PASSWORD, POPUP, REDIRECT, SIGN_OUT } from './makeFirebaseAuthenticationDriver';
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
  method: ANONYMOUSLY,
  email: '',
  password: '',
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

describe('firebase authentication', () => {
  describe('makeFirebaseAuthenticationDriver', () => {
    it('should be a function', () => {
      assert(typeof makeFirebaseAuthenticationDriver === 'function');
    });
  });

  describe('firebaseAuthenticationDriver', () => {
    it('should be a function', () => {
      const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
        emailAndPasswordAuthenticationInput.email));
      assert(typeof firebaseAuthenticationDriver === 'function');
    });

    it('should return a Stream', () => {
      const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
        emailAndPasswordAuthenticationInput.email));
      const source = firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput));

      assert(typeof source.observe === 'function');
    });

    describe('source', () => {
      it('should start with an intitial UserCredential', (done) => {
        const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
          emailAndPasswordAuthenticationInput.email));
        const source = firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).take(1);

        source.observe((userCredential) => {
          assert(userCredential.user === null);
          assert(userCredential.credential === null);
          done();
        }).catch(done);
      });

      it('should contain a UserCredential', (done) => {
        const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
          emailAndPasswordAuthenticationInput.email));
        firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).skip(1).observe((userCredential: firebase.auth.UserCredential) => {
          assert(userCredential.hasOwnProperty('user'));
          assert(userCredential.hasOwnProperty('credential'));
          done();
        });
      });

      describe('UserCredential', () => {
        describe('Not Authenticated', () => {
          it('should have property user equal to `null`', (done) => {
            const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));
            firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).take(1).observe(userCredential => {
              assert(userCredential.user === null);
              done();
            });
          });

          it('should have property credential equal to `null`', (done) => {
            const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

            firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).take(1).observe(userCredential => {
              assert(userCredential.credential === null);
              done();
            });
          });
        });

        describe('Authenticated', () => {
          it('should have property user of type firebase.User', (done) => {
            const firebaseAuthenticationDriver = makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

            firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).skip(1).observe(userCredential => {
              const user: firebase.User | null = userCredential.user;
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
          const firebaseAuthenticationDriver =
            makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

          firebaseAuthenticationDriver(just(emailAndPasswordAuthenticationInput)).skip(1).observe(userCredential => {
            const user: firebase.User | null = userCredential.user;

            if (user === null) {
              return done('User can not be null');
            }

            assert(user.email === emailAndPasswordAuthenticationInput.email);
            done();
          });
        });
      });

      describe('Popup', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          const firebaseAuthenticationDriver =
            makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

          firebaseAuthenticationDriver(just(popupAuthenticationInput)).skip(1).observe(userCredential => {
            const user: firebase.User | null = userCredential.user;

            if (user === null) {
              return done('User can not be null');
            }

            assert(user.email === emailAndPasswordAuthenticationInput.email);
            done();
          });
        });
      });

      describe('Redirect', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          const firebaseAuthenticationDriver =
            makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

          firebaseAuthenticationDriver(just(redirectAuthenticationInput)).skip(1).observe(userCredential => {
            const user: firebase.User | null = userCredential.user;

            if (user === null) {
              return done('User can not be null');
            }

            assert(user.email === emailAndPasswordAuthenticationInput.email);
            done();
          });
        });
      });

      describe('Anonymously', () => {
        it('should return a non-null firebase UserCredential', (done) => {
          const firebaseAuthenticationDriver =
            makeFirebaseAuthenticationDriver(new MockFirebase(
              emailAndPasswordAuthenticationInput.email));

          firebaseAuthenticationDriver(just(anonymouslyAuthenticationInput)).skip(1).observe(userCredential => {
            const user: firebase.User | null = userCredential.user;

            if (user === null) {
              return done('User can not be null');
            }

            assert(user.isAnonymous);
            done();
          });
        });
      });
    });

    describe('Sign Out', () => {
      it('should return a null firebase UserCredential', (done) => {
        const firebaseAuthenticationDriver =
          makeFirebaseAuthenticationDriver(new MockFirebase(
            emailAndPasswordAuthenticationInput.email));

        const input = [
          anonymouslyAuthenticationInput,
          signOutAuthenticationInput
        ];

        const authenticationInput$ = periodic(100, 1)
          .skip(1)
          .scan(x => x + 1, 0)
          .map(x => input[x])
          .take(2);

        firebaseAuthenticationDriver(authenticationInput$).skip(2).observe(userCredential => {
          const user: firebase.User | null = userCredential.user;

          assert(user === null);
          done();
        });
      });
    });

    describe('Create Email And Password Account', () => {
      it('should return a non-null firebase UserCredential', (done) => {
        const firebaseAuthenticationDriver =
          makeFirebaseAuthenticationDriver(new MockFirebase(
            emailAndPasswordAuthenticationInput.email));

        const createUserAuthenticationInput = {
          method: CREATE_USER,
          email: 'newuser@sparks.network',
          password: '1234'
        };

        firebaseAuthenticationDriver(just(createUserAuthenticationInput)).skip(1).observe(userCredential => {
          const user: firebase.User | null = userCredential.user;

          assert(user !== null);
          done();
        });
      });

      it('should throw Authentication Error for email already in use', (done) => {
        const firebaseAuthenticationDriver =
          makeFirebaseAuthenticationDriver(new MockFirebase(
            emailAndPasswordAuthenticationInput.email));

        const createUserAuthenticationInput = {
          method: CREATE_USER,
          email: 'existinguser@sparks.network',
          password: '1234'
        };

        firebaseAuthenticationDriver(just(createUserAuthenticationInput)).skip(1).observe(userCredential => {
          const user: firebase.User | null = userCredential.user;

          assert();
          done();
        });
      });
    });
  });
});

/*
X 1. Bastardize on userCredential for Errors as well as actual UserCredentials
2. Allow returning something *other* than a UserCredential to represent Errors
3. { errror: null, userCredential } | error: Error, userCredential { null null }
*/