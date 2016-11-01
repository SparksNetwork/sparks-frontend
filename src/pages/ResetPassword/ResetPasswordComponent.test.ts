/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
// import {Diff, NativeAdapter, CompactCodec} from 'modern-diff'
// better use http://benjamine.github.io/jsondiffpatch/demo/index.html
import firebase = require('firebase');
import {
  AuthenticationError
} from '../../drivers/firebase-authentication';
import {AuthenticationState} from '../types/authentication/types'
import {
  div, span, section, form, fieldset, label, a, p, input, h1, h4, button, VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM, empty, never, just} from 'most';
import {always} from 'ramda';
import {
  isFunction, hasExpectedSinks,
  decorateWithPreventDefault, stubClickEvent, stubSubmitEvent, stubInputEvent,
  analyzeTestResults as _analyzeTestResults, plan
} from '../../utils/testing/checks';
import {runTestScenario} from '../../utils/testing/runTestScenario'
import {makeMockDOMSource} from '../../utils/testing/mockDOM'
import {ResetPasswordComponent, resetPasswordClasses} from './index.ts';
import {cssClasses} from '../../utils/classes';

const classes = cssClasses({});
const backgroundImage = require('assets/images/login-background.jpg');

const stubbedDOMSource = {
  select: function () {
    return {
      events: always(just(null))
    }
  }
};
const dummyIncompleteSources = {DOM: never()};
const dummySources = {DOM: stubbedDOMSource, authenticationState$: never(),};
const dummyAuthParams = {mode: 'dummy', oobCode: 'dummy'};

describe('The ResetPassword component', () => {
  it('should be a function', () => {
    assert.ok(isFunction(ResetPasswordComponent));
  });

  it('should be called with a source list including' +
    ' authenticationState$', () => {
    assert.throws(()=>ResetPasswordComponent(dummyIncompleteSources, dummyAuthParams),
      'throws an error when at least one expected source is missing')
  });

  it('should return at least DOM, authentication, and route sinks', () => {
    const sinks = ResetPasswordComponent(dummySources, dummyAuthParams);

    const actual = hasExpectedSinks(sinks, ['DOM', 'authentication$', 'router']);

    assert.ok(actual, 'computes DOM, authentication, and route sinks');
  });

  describe.skip('When the user is not already logged in AND' +
    ' no authentication was attempted yet (authenticationState)', ()=> {
    it('should emit a `verifyPasswordResetCode` command to firebase auth API' +
      ' AND display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button  and 1 ENABLED' +
      ' feedback message area which indicates that the reset code is being' +
      ' verified', (done) => {
      // TODO

    });
  });

});
