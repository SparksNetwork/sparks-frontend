/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { AuthenticationInput } from '../../driver/cyclic-fire';
import { model } from './model';

describe('Login', () => {
  describe('model', () => {
    it('should be a function', () => {
      assert(typeof model === 'function');
    });

    it('should output a state object', () => {
      const authenticationInput: AuthenticationInput = model('google');
      assert(typeof authenticationInput === 'object');
    });

    describe('state object', () => {
      it('should contain a property `type`', () => {
        assert(model('google').hasOwnProperty('type'));
      });

      it('should contain property method`', () => {
        assert(model('google').hasOwnProperty('method'));
      });
    });

    describe('Google Authentication Method', () => {
      it('should return object with property `type` of value `redirect`', () => {
        assert(model('google').type === 'redirect');
      });

      it('should return object with property `method` of value `google`', () => {
        assert(model('google').method === 'google');
      });
    });

    describe('Facebook Authentication Method', () => {
      it('should return object with property `type` of value `redirect`', () => {
        assert(model('facebook').type === 'redirect');
      });

      it('should return object with property `method` of value `facebook`', () => {
        assert(model('facebook').method === 'facebook');
      });
    });

    describe('Email and Password Authentication Method', () => {
      it('should return object with property `type` of value `password`', () => {
        assert(model('password').type === 'password');
      });

      it('should return object with property `method` of value `password`', () => {
        assert(model('password').method === 'password');
      });
    });
  });
});
