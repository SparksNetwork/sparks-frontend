/// <reference path="../../../typings/index.d.ts" />
import firebase = require('firebase');
import * as assert from 'assert';
import {
  AuthenticationInput,
  EmailAndPasswordAuthenticationInput,
  RedirectAuthenticationInput,
  REDIRECT,
} from '../../driver/firebase-authentication';
import { GOOGLE, FACEBOOK, EMAIL_AND_PASSWORD } from './index';
import { model } from './model';

describe('Login', () => {
  describe('model', () => {
    it('should be a function', () => {
      assert(typeof model === 'function');
    });

    it('should output a state object', () => {
      const authenticationInput: AuthenticationInput = model({ method: GOOGLE });
      assert(typeof authenticationInput === 'object');
    });

    describe('state object', () => {
      it('should contain property method`', () => {
        assert(model({ method: GOOGLE }).hasOwnProperty('method'));
      });
    });

    describe('Google Authentication Method', () => {
      it('should return object with property `method` of value `REDIRECT`', () => {
        assert(model({ method: GOOGLE }).method === REDIRECT);
      });

      it('should return object with property `provider` that is instance of firebase.auth.GoogleAuthProvider', () => {
        const authenticationInput = model({ method: GOOGLE });

        assert((authenticationInput as any).provider instanceof firebase.auth.GoogleAuthProvider);
      });
    });

    describe('Facebook Authentication Method', () => {
      it('should return object with property `method` of value `REDIRECT`', () => {
        assert(model({ method: FACEBOOK }).method === REDIRECT);
      });

      it('should return object with property `provider` that is an instance of firebaseh.auth.FacebookAuthProvider', () => {
        const authenticationInput = model({ method: FACEBOOK }) as RedirectAuthenticationInput;

        assert(authenticationInput.provider instanceof firebase.auth.FacebookAuthProvider);
      });
    });

    describe('Email and Password Authentication Method', () => {
      it('should return object with property `method` of value `EMAIL_AND_PASSWORD`', () => {
        const authenticationInput =
          model({ method: EMAIL_AND_PASSWORD, email: '', password: '' });

        assert(authenticationInput.method === EMAIL_AND_PASSWORD);
      });

      it('should return object with property `email` of given value', () => {
        const authenticationInput = <EmailAndPasswordAuthenticationInput>
          model({ method: EMAIL_AND_PASSWORD, email: 'email', password: '' });

        assert(authenticationInput.email === 'email');
      });

      it('should return object with property `password` of given value', () => {
        const authenticationInput = <EmailAndPasswordAuthenticationInput>
          model({ method: EMAIL_AND_PASSWORD, email: '', password: 'password' });

        assert(authenticationInput.password === 'password');
      });
    });
  });
});
