/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { model } from './model';
import { EmailAndPasswordAuthenticationRequest} from './model';

const defaultAuthenticationRequest = {
  method: 'google' as 'google'
};

describe('Login', () => {
  describe('model', () => {
    it('should be a function', () => {
      assert(typeof model === 'function');
    });

    it('should output a state object', () => {
      const state = model(defaultAuthenticationRequest);
      assert(typeof state === 'object');
    });

    describe('state object', () => {
      it('should contain authenticationMethod', () => {
        const state = model(defaultAuthenticationRequest);
        assert(state.hasOwnProperty('authenticationMethod'));
      });

      describe('authenticationMethod', () => {
        it('should be an AuthenticationMethod', () => {
          const { authenticationMethod } = model(defaultAuthenticationRequest);
          assert(typeof authenticationMethod.method === 'string');
        });

        describe('given a request of google', () => {
          it('should be a GoogleAuthenticationMethod', () => {
            const { authenticationMethod } = model(defaultAuthenticationRequest);
            assert(authenticationMethod.method === 'google');
          });
        });

        describe('given a request of facebook', () => {
          it('should be a FacebookAuthenticationMethod', () => {
            const { authenticationMethod } = model({ method: 'facebook' });
            assert(authenticationMethod.method === 'facebook');
          });
        });

        describe('given a request of email and password', () => {
          it('should be a EmailAndPasswordAuthenticationMethod', () => {
            const authenticationMethod = model({
              method: 'emailAndPassword',
              email: 'user@sparks.network',
              password: 'testpassword'
            }).authenticationMethod as EmailAndPasswordAuthenticationRequest;

            assert(authenticationMethod.method === 'emailAndPassword');
            assert(typeof authenticationMethod.email === 'string');
            assert(typeof authenticationMethod.password === 'string');
            assert(authenticationMethod.email === 'user@sparks.network');
            assert(authenticationMethod.password === 'testpassword');
          });
        });
      });
    });
  });
});
