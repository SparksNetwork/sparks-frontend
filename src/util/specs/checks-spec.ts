/// <reference path="../../../typings/index.d.ts" />

import * as assert from 'assert';
import { assertSignature } from '../checks';

describe('Testing utils functions', () => {
  it('assertSignature(fnName, _arguments, vRules', () => {
    const fnName = 'test';
    const _arguments = [2, false];
    const _argInvalid = [false, 2];
    const vRules = [
      {arg1: function isNumber(x) {return typeof x === 'number'}},
      {arg2: function isBoolean(x) {return typeof x === 'boolean'}},
    ]

    assert.equal(assertSignature(fnName, _arguments, vRules), true,
      'assertSignature validates the arguments of a function according to a list' +
      'of validation rules. When those validation rules are observed, ' +
      'it should return true.')

    assert.throws(function () {assertSignature(fnName, _argInvalid, vRules); },
      /fails/,
      'Each failing validation rule generates an error message; error messages' +
      'are gathered and thrown in an exception.'
    );
  });
});
