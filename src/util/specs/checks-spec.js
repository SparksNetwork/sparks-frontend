/// <reference path="../../../typings/index.d.ts" />
"use strict";
var assert = require('assert');
var checks_1 = require('../checks');
describe('Testing utils functions', function () {
    it('assertSignature(fnName, _arguments, vRules', function () {
        var fnName = 'test';
        var _arguments = [2, false];
        var _argInvalid = [false, 2];
        var vRules = [
            { arg1: function isNumber(x) { return typeof x === 'number'; } },
            { arg2: function isBoolean(x) { return typeof x === 'boolean'; } },
        ];
        assert.equal(checks_1.assertSignature(fnName, _arguments, vRules), true, 'assertSignature validates the arguments of a function according to a list' +
            'of validation rules. When those validation rules are observed, ' +
            'it should return true.');
        assert.throws(function () { checks_1.assertSignature(fnName, _argInvalid, vRules); }, /fails/, 'Each failing validation rule generates an error message; error messages' +
            'are gathered and thrown in an exception.');
    });
});
