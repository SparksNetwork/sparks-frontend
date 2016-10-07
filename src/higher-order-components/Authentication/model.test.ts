/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { AuthInput } from '../../driver/cyclic-fire';
import { model } from './model';

describe('Login', () => {
  describe('model', () => {
    it('should be a function', () => {
      assert(typeof model === 'function');
    });

    it('should output a state object', () => {
      const authInput: AuthInput = model();
      assert(typeof authInput === 'object');
    });

    describe('state object', () => {
      it('should contain a property `type`', () => {
        assert(model().hasOwnProperty('type'));
      });

      it('should contain property `provider`', () => {
        assert(model().hasOwnProperty('provider'));
      });
    });

    describe('Google Login Action', () => {
      it('should return object with property `type` of value `redirect`', () => {
        assert(model('google').type === 'redirect');
      });

      it('should return object with property `provider` of value `google`', () => {
        assert(model('google').provider === 'google');
      });
    });

    describe('Facebook Login Action', () => {
      it('should return object with property `type` of value `redirect`', () => {
        assert(model('facebook').type === 'redirect');
      });

      it('should return object with property `provider` of value `facebook`', () => {
        assert(model('facebook').provider === 'facebook');
      });
    });

    describe('Email and Password Login Action', () => {
      it('should return object with property `type` of value `password`', () => {
        assert(model('password').type === 'password');
      });

      it('should return object with property `provider` of value `password`', () => {
        assert(model('password').provider === 'password');
      });
    });
  });
});
