/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';

import { displayError } from './displayError';

describe('Login - displayError', () => {
  describe('displayError', () => {
    it('should be a function', () => {
      assert(typeof displayError === 'function');
    });

    describe('given null', () => {
      it('should return null', () => {
        assert(displayError(null) === null);
      });
    });

    describe('given true', () => {
      it('should return null', () => {
        assert(displayError(true) === null);
      });
    });

    describe('given false', () => {
      it('should return a vNode', () => {
        const error = displayError(false);
        assert(error !== null && typeof error === 'object');
      });
    });
  });
});