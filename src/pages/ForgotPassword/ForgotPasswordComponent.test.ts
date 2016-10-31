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
import {ForgotPasswordComponent, forgotPasswordClasses} from './index.ts';
import {cssClasses} from '../../utils/classes';

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
const authenticationStateInvalidEmail: AuthenticationState = {
  isAuthenticated: false,
  authenticationError: {
    code: 'auth/invalid-email',
    message: 'dummy'
  } as AuthenticationError
}

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
const authenticationStateUserNotFound: AuthenticationState = {
  isAuthenticated: false,
  authenticationError: {
    code: 'auth/user-not-found',
    message: 'dummy'
  } as AuthenticationError
}

const viewAuthErrorUserAlreadyLoggedIn = section(classes.sel('photo-background'), {
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
const authenticationStateUserAlreadyLoggedIn: AuthenticationState = {
  isAuthenticated: true,
  authenticationError: null
}

const dummyEmail = 'dummy@email.com';
const stubbedDOMSource = {
  select : function () {
    return {
      events : always(just(null))
    }
  }
};
const dummySources = {DOM: stubbedDOMSource, authenticationState$: never(),};
const dummyIncompleteSources = {DOM: never()};

describe('The ForgotPassword component', () => {
  it('should be a function', () => {
    assert.ok(isFunction(ForgotPasswordComponent));
  });

  it('should be called with a source list including authenticationState$', () => {
    assert.throws(()=>ForgotPasswordComponent(dummyIncompleteSources), 'throws an error when at least one expected source is missing')
  });

  it('should return at least DOM, authentication, and route sinks', () => {

    assert.ok(
      hasExpectedSinks(ForgotPasswordComponent(dummySources), [
        'DOM', 'authentication$', 'router'
      ]),
      'computes DOM, authentication, and route sinks'
    )
  });

  describe('When the user is not already logged in AND' +
    ' no authentication was attempted yet (authenticationState)', ()=> {
    it('should display a screen allowing to enter a new email', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateNoAuthError}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
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
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsUserAlreadyLoggedIn = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateUserAlreadyLoggedIn}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewAuthErrorUserAlreadyLoggedIn],
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

      runTestScenario(testInputsUserAlreadyLoggedIn, expected, ForgotPasswordComponent, {
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

  describe('When the user is not already logged in AND' +
    ' authentication was unsucessful due to an invalid' +
    ' email (authenticationState)', ()=> {
    it('should display a screen with an error message (invalid email' +
      ' address) and allowing to enter a new email', (done) => {

      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsUserInvalidEmail = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateInvalidEmail}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewAuthErrorInvalidEmail],
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

      runTestScenario(testInputsUserInvalidEmail, expected, ForgotPasswordComponent, {
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

  describe('When the user is not already logged in AND' +
    ' authentication was unsucessful because the email could not be matched' +
    ' to a user (authenticationState)', ()=> {
    it('should display a screen with an error message (user not found)' +
      ' and allowing to enter a new email', (done) => {

      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsUserInvalidEmail = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateUserNotFound}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewAuthErrorUserNotFound],
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

      runTestScenario(testInputsUserInvalidEmail, expected, ForgotPasswordComponent, {
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

  describe('When the user is not already logged in AND' +
    ' the user clicks on cancel button', ()=> {
    it('should navigate to screen "/"', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsUserInvalidEmail = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateNoAuthError}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: 'a-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
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
          outputs: ['/'],
          successMessage: 'DOM router produces home route "/" as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      runTestScenario(testInputsUserInvalidEmail, expected, ForgotPasswordComponent, {
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

  describe('When the user is not already logged in AND' +
    ' the user clicks on submit button AND email format is (auto-)validated' +
    ' by the DOM', ()=> {
    it('should emit a sendPasswordResetEmail command to the' +
      ' authentication driver ', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const cancelSelector = forgotPasswordClasses.sel('cancel');
      const loginEmailSelector = forgotPasswordClasses.sel('login.email');
      const formSelector = 'form';

      const testInputsUserInvalidEmail = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateNoAuthError}
          }
        },
        // NOTE : no value emitted in this case scenario, following code
        // kept for copy paste reasons
        {
          [`DOM!${cancelSelector}@click`]: {
            diagram: '-',
            values: {a: decorateWithPreventDefault(stubClickEvent(undefined))}
          }
        },
        // Note that as it is logical, the input must emit before the submit
        {
          [`DOM!${loginEmailSelector}@input`]: {
            diagram: 'a-',
            values: {a: decorateWithPreventDefault(stubInputEvent(dummyEmail))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: 'a-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
      ]

      const expected = {
        DOM: {
          outputs: [viewNoAuthError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [{
            email: dummyEmail,
            method: "SEND_PASSWORD_RESET_EMAIL"
          }],
          successMessage: 'DOM authentication$ produces' +
          ' SEND_PASSWORD_RESET_EMAIL command as expected',
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

      runTestScenario(testInputsUserInvalidEmail, expected, ForgotPasswordComponent, {
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

  // TODO : add transition scenario? not logged in -> submit -> logged in?
  // TODO : add transition scenario? not logged in -> submit -> invalid email?
  // Not necessary if we make hypothesis about the code (whitebox), but
  // could be necessary in a TDD context

})
