/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import {keys} from 'ramda'
import firebase = require('firebase');
import {
  AuthenticationError
} from '../../drivers/firebase-authentication';

import {AuthenticationState} from './types'
import {
  div, span, section, form, fieldset, label, a, p, input, h1, h4, button, VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM, empty, never} from 'most';
import {cssClasses} from '../../utils/classes';
import ForgotPasswordComponent from './index.ts';
import {
  isFunction, hasExpectedSinks,
  analyzeTestResults as _analyzeTestResults, plan
} from '../../utils/testing/checks';
import {runTestScenario} from '../../utils/testing/runTestScenario'
import {makeMockDOMSource} from '../../utils/testing/mockDOM'

const classes = cssClasses({});
const backgroundImage = require('assets/images/login-background.jpg');

// TODO : find a way not to duplicate this with the actual view implementation
// Views corresponding to the miscellaneous authenticatation states
const viewNoAuthError = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel(''), {
          polyglot: {phrase: 'error.auth.none'}
        } as any)
      ]),
    ]),
  ])
]);
const authenticationStateNoAuthError: AuthenticationState = {
  isAuthenticated: false,
  authenticationError: null
}

const viewAuthErrorInvalidEmail = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('error'), {
          polyglot: {phrase: 'error.auth.invalid-email'}
        } as any)
      ]),
    ]),
  ])
]);

const viewAuthErrorUserNotFound = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('error'), {
          polyglot: {phrase: 'error.auth.user-not-found'}
        } as any)
      ]),
    ]),
  ])
]);

const viewAuthErrorUserLoggedIn = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('warning'), {
          polyglot: {phrase: 'error.auth.none'}
        } as any)
      ]),
    ]),
  ])
]);

const dummySources = {DOM: never(), authenticationState$: never(),};
const dummyIncompleteSources = {DOM: never()};

describe('The ForgotPassword component', () => {
  it('should be a function', () => {
    assert.ok(isFunction(ForgotPasswordComponent));
  });

  it('should be called with a source list including authenticationState$', () => {
    assert.throws(()=>ForgotPasswordComponent(dummyIncompleteSources), 'throws an error when at least one expected source is missing')
  });

  // TODO : this is already included in the output tests, add it somewhere
//  //it('should return at least DOM, authentication, and route sinks', () => {
//    assert.ok(
//      hasExpectedSinks(ForgotPasswordComponent(dummySources), ['DOM',
// 'authentication$', 'router']),
//      'computes DOM, authentication, and route sinks'
//    )
//  });

  // TODO : change this or add transition scenario
  // not logged-in -> logged in successfully
  // NOTE : there are 4 starting scenariis, write the possibilities
  describe('When the user is not already logged in AND' +
    ' no authentication was attempted yet (authenticationState)', ()=> {
    it('should display a screen allowing to enter a new email', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3)(done));

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateNoAuthError}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewNoAuthError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [],
          successMessage: 'DOM authentication$ produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [],
          successMessage: 'DOM router produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected, ForgotPasswordComponent, {
        tickDuration: 5,
        waitForFinishDelay: 20,
        mocks: {
          DOM: makeMockDOMSource
        },
        errorHandler: function (err) {
          done(err)
        }
      })


    })
  })

  describe('When the user is already logged in (authenticationState)', ()=> {
    it('should display a screen with a warning message (user already' +
      ' logged-in) and allowing to enter an email', (done) => {

    })
  })

  describe('When the user is not already logged in AND' +
    ' authentication was unsucessful due to an invalid' +
    ' email (authenticationState)', ()=> {
    it('should display a screen with an error message (invalid email' +
      ' address) and allowing to enter a new email', (done) => {

    })
  })

  describe('When the user is not already logged in AND' +
    ' authentication was unsucessful because the email could not be matched' +
    ' to a user (authenticationState)', ()=> {
    it('should display a screen with an error message (user not found)' +
      ' and allowing to enter a new email', (done) => {

    })
  })

})
