/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
// import {Diff, NativeAdapter, CompactCodec} from 'modern-diff'
// better use http://benjamine.github.io/jsondiffpatch/demo/index.html
import firebase = require('firebase');
import {
  AuthenticationError
} from '../../drivers/firebase-authentication';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods
} from '../types/authentication/types';
import {
  div, span, section, form, fieldset, label, a, p, input, h1, h4, button, VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM, empty, never, just} from 'most';
import {holdSubject} from 'most-subject'
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
const dummyEmail = 'dummy@email.com';
const dummyPassword = 'dummyPassword';
const dummyAuthParams = {mode: 'dummy', oobCode: 'dummy'};
const authenticationStateNoAuthError: AuthenticationState = {
  method: null,
  result: null,
  authenticationError: null,
  isAuthenticated: false
}
const authenticationStateVerifyCodeOK: AuthenticationState = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: dummyEmail,
  authenticationError: null,
  isAuthenticated: false
}
const authenticationStateVerifyCodeExpiredError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  authenticationError: {message: 'dummy', code: 'auth/expired-action-code'},
  isAuthenticated: false
}
const authenticationStateVerifyCodeInvalidCodeError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  authenticationError: {message: 'dummy', code: 'auth/invalid-action-code'},
  isAuthenticated: false
}
const authenticationStateVerifyCodeUserDisabledError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  authenticationError: {message: 'dummy', code: 'auth/user-disabled'},
  isAuthenticated: false
}
const authenticationStateVerifyCodeUserNotFoundError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  authenticationError: {message: 'dummy', code: 'auth/user-not-found'},
  isAuthenticated: false
}
const authenticationStateWeakPasswordError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  authenticationError: {message: 'dummy', code: 'auth/weak-password'},
  isAuthenticated: false
}
const authenticationStatePasswordResetOK = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email : dummyEmail,
  authenticationError: null,
  isAuthenticated: false
}

const viewNoAuthError = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    // TODO : define a style for reset?? or reuse those under the same
    // name?
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'resetPassword.title'}} as any),
      // TODO : define a style for reset?? or reuse those?
      div(classes.sel('login', 'form'), [
        form([
          fieldset({attrs: {disabled: true}}, [
            // Enter password
            label({
              props: {for: 'email'},
              // TODO : forgotPassword.email for some reason is not resolved??
              polyglot: {phrase: 'resetPassword.enterPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.enterPassword'), {
              props: {
                type: 'password',
                name: 'enterPassword'
              }
            } as any),
            // Confirm password
            label({
              props: {for: 'email'},
              // TODO : forgotPassword.email for some reason is not resolved??
              polyglot: {phrase: 'resetPassword.confirmPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.confirmPassword'), {
              props: {
                type: 'password',
                name: 'confirmPassword'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('feedback'), {
          polyglot: {phrase: 'resetPassword.verifying'}
        } as any)
      ]),
    ]),
  ])
]);

const viewVerifyCodeOK= section(classes.sel('photo-background'), {
  style: {
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'resetPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset({attrs: {disabled: false}}, [
            // Enter password
            label({
              props: {for: 'email'},
              // TODO : forgotPassword.email for some reason is not resolved??
              polyglot: {phrase: 'resetPassword.enterPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.enterPassword'), {
              props: {
                type: 'password',
                name: 'enterPassword'
              }
            } as any),
            // Confirm password
            label({
              props: {for: 'email'},
              // TODO : forgotPassword.email for some reason is not resolved??
              polyglot: {phrase: 'resetPassword.confirmPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.confirmPassword'), {
              props: {
                type: 'password',
                name: 'confirmPassword'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('feedback'), {
          polyglot: {phrase: 'resetPassword.verifyCodeSuccessful'}
        } as any)
      ]),
    ]),
  ])
]);

 const viewVerifyCodeInvalidError= section(classes.sel('photo-background'), {
   style: {
     // QUESTION: where does this url function comes from
     backgroundImage: `url(${backgroundImage})`
   }
 }, [
   h1('sparks.network'),
   div([
     div(classes.sel('login', 'box'), [
       h1({polyglot: {phrase: 'resetPassword.title'}} as any),
       // TODO : define a style for reset?? or reuse those?
       div(classes.sel('login', 'form'), [
         form([
           fieldset({attrs: {disabled: true}}, [
             // Enter password
             label({
               props: {for: 'email'},
               polyglot: {phrase: 'resetPassword.enterPassword'}
             } as any),
             // TODO : create a style for password fields
             input(classes.sel('resetPassword.enterPassword'), {
               props: {
                 type: 'password',
                 name: 'enterPassword'
               }
             } as any),
             // Confirm password
             label({
               props: {for: 'email'},
               polyglot: {phrase: 'resetPassword.confirmPassword'}
             } as any),
             // TODO : create a style for password fields
             input(classes.sel('resetPassword.confirmPassword'), {
               props: {
                 type: 'password',
                 name: 'confirmPassword'
               }
             } as any),
           ]),
           fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
             button(classes.sel('submit'), {
               polyglot: {phrase: 'resetPassword.resetPassword'}
             } as any)
           ])
         ]),
         // feedback message area
         h4(classes.sel('error'), {
           polyglot: {phrase: 'resetPassword.verifyCodeInvalidError'}
         } as any)
       ]),
     ]),
   ])
 ]);

const viewVerifyCodeUserNotFoundError= section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'resetPassword.title'}} as any),
      // TODO : define a style for reset?? or reuse those?
      div(classes.sel('login', 'form'), [
        form([
          fieldset({attrs: {disabled: true}}, [
            // Enter password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.enterPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.enterPassword'), {
              props: {
                type: 'password',
                name: 'enterPassword'
              }
            } as any),
            // Confirm password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.confirmPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.confirmPassword'), {
              props: {
                type: 'password',
                name: 'confirmPassword'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.verifyCodeUserNotFoundError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewVerifyCodeUserDisabledError= section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'resetPassword.title'}} as any),
      // TODO : define a style for reset?? or reuse those?
      div(classes.sel('login', 'form'), [
        form([
          fieldset({attrs: {disabled: true}}, [
            // Enter password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.enterPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.enterPassword'), {
              props: {
                type: 'password',
                name: 'enterPassword'
              }
            } as any),
            // Confirm password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.confirmPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.confirmPassword'), {
              props: {
                type: 'password',
                name: 'confirmPassword'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.verifyCodeDisabledUserError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewVerifyCodeExpiredError= section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'resetPassword.title'}} as any),
      // TODO : define a style for reset?? or reuse those?
      div(classes.sel('login', 'form'), [
        form([
          fieldset({attrs: {disabled: true}}, [
            // Enter password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.enterPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.enterPassword'), {
              props: {
                type: 'password',
                name: 'enterPassword'
              }
            } as any),
            // Confirm password
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'resetPassword.confirmPassword'}
            } as any),
            // TODO : create a style for password fields
            input(classes.sel('resetPassword.confirmPassword'), {
              props: {
                type: 'password',
                name: 'confirmPassword'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.verifyCodeExpiredError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewLoggingIn = section(classes.sel('photo-background'), {
   style: {
     // QUESTION: where does this url function comes from
     backgroundImage: `url(${backgroundImage})`
   }
 }, [
   h1('sparks.network'),
   div([
     div(classes.sel('login', 'box'), [
       h1({polyglot: {phrase: 'resetPassword.title'}} as any),
       // TODO : define a style for reset?? or reuse those?
       div(classes.sel('login', 'form'), [
         form([
           fieldset({attrs: {disabled: true}}, [
             // Enter password
             label({
               props: {for: 'email'},
               polyglot: {phrase: 'resetPassword.enterPassword'}
             } as any),
             // TODO : create a style for password fields
             input(classes.sel('resetPassword.enterPassword'), {
               props: {
                 type: 'password',
                 name: 'enterPassword'
               }
             } as any),
             // Confirm password
             label({
               props: {for: 'email'},
               polyglot: {phrase: 'resetPassword.confirmPassword'}
             } as any),
             // TODO : create a style for password fields
             input(classes.sel('resetPassword.confirmPassword'), {
               props: {
                 type: 'password',
                 name: 'confirmPassword'
               }
             } as any),
           ]),
           fieldset(classes.sel('actions'), {attrs: {disabled: true}}, [
             button(classes.sel('submit'), {
               polyglot: {phrase: 'resetPassword.resetPassword'}
             } as any)
           ])
         ]),
         // feedback message area
         h4(classes.sel('feedback'), {
           polyglot: {phrase: 'resetPassword.loggingIn'}
         } as any)
       ]),
     ]),
   ])
 ]);

// const viewTODO= section(classes.sel('photo-background'), {
//   style: {
//     // QUESTION: where does this url function comes from
//     backgroundImage: `url(${backgroundImage})`
//   }
// }, [
//   h1('sparks.network'),
//   div([
//     // TODO : define a style for reset?? or reuse those under the same
//     // name?
//     div(classes.sel('login', 'box'), [
//       h1({polyglot: {phrase: 'resetPassword.title'}} as any),
//       // TODO : define a style for reset?? or reuse those?
//       div(classes.sel('login', 'form'), [
//         form([
//           fieldset({attrs: {disabled: isDisabled}}, [
//             // Enter password
//             label({
//               props: {for: 'email'},
//               // TODO : forgotPassword.email for some reason is not
// resolved??
//               polyglot: {phrase: 'resetPassword.enterPassword'}
//             } as any),
//             // TODO : create a style for password fields
//             input(classes.sel('resetPassword.enterPassword'), {
//               props: {
//                 type: 'password',
//                 name: 'enterPassword'
//               }
//             } as any),
//             // Confirm password
//             label({
//               props: {for: 'email'},
//               // TODO : forgotPassword.email for some reason is not
// resolved??
//               polyglot: {phrase: 'resetPassword.confirmPassword'}
//             } as any),
//             // TODO : create a style for password fields
//             input(classes.sel('resetPassword.confirmPassword'), {
//               props: {
//                 type: 'password',
//                 name: 'confirmPassword'
//               }
//             } as any),
//           ]),
//           fieldset(classes.sel('actions'), {attrs: {disabled: isDisabled}}, [
//             button(classes.sel('submit'), {
//               polyglot: {phrase: 'resetPassword.resetPassword'}
//             } as any)
//           ])
//         ]),
//         // feedback message area
//         h4(classes.sel(resetPasswordFeedbackType), {
//           polyglot: {phrase: resetPasswordFeedbackPhrase}
//         } as any)
//       ]),
//     ]),
//   ])
// ]);

describe('The ResetPassword component', () => {
  it.skip('should be a function', () => {
    assert.ok(isFunction(ResetPasswordComponent));
  });

  it.skip('should be called with a source list including' +
    ' authenticationState$', () => {
    assert.throws(()=>ResetPasswordComponent(dummyIncompleteSources, dummyAuthParams),
      'throws an error when at least one expected source is missing')
  });

  it.skip('should return at least DOM, authentication, and route sinks', () => {
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
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateNoAuthError}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
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
          outputs: [{code: dummyAuthParams.oobCode, method: AuthMethods.VERIFY_PASSWORD_RESET_CODE}],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe.skip('When the password reset code has been successfully verified' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which indicates that the reset code was' +
      ' successfully verified', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeOK],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe.skip('When the password reset code has failed verification AND' +
    ' error code correspond to an expired code' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeExpiredError}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeExpiredError],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe.skip('When the password reset code has failed verification AND' +
    ' error code corresponds to an invalid code' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeInvalidCodeError}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeInvalidError],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe.skip('When the password reset code has failed verification AND' +
    ' error code corresponds to user not found' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeUserNotFoundError}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeUserNotFoundError],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe.skip('When the password reset code has failed verification AND' +
    ' error code corresponds to user disabled' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeUserDisabledError}
          }
        },
        // NOTE : form input data must go first before the streams it depends on
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        }
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeUserDisabledError],
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe('When the password has been successfully reset' +
    ' (authenticationState)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of the password reset. It should' +
      ' immediately try to log in the user', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        // TODO : update note
        // NOTE : form input data must go first before the streams it depends on
        // Must be after the DOM inputs simulation, as it happens on return
        // from a submit, so when the password fields are already filled in
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStatePasswordResetOK}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '--',
            //values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: 'a-',
            values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: 'a-',
            values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
          }
        },
      ]

      const expected = {
        DOM: {
          outputs: [viewLoggingIn],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [{
            method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
            email: dummyEmail,
            password: dummyPassword
          }],
          successMessage: 'DOM authentication$ receives a' +
          ' SIGN_IN_WITH_EMAIL_AND_PASSWORD command',
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

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputsNotLoggedInNoAuthOpYet, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          sourceFactory :{
            DOM : () => holdSubject(1)
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

});
