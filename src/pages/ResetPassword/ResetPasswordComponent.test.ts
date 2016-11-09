/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
// import {Diff, NativeAdapter, CompactCodec} from 'modern-diff'
// better use http://benjamine.github.io/jsondiffpatch/demo/index.html
import firebase = require('firebase');
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
import {DASHBOARD_ROUTE, LOGIN_ROUTE} from '../config.properties'

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
const dummyTooShortPassword = 'dummy';
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
const authenticationStatePasswordResetOK = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: null,
  isAuthenticated: false
}
const authenticationStatePasswordResetExpiredCode = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/expired-action-code'},
  isAuthenticated: false
}
const authenticationStatePasswordResetInvalidCode = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/invalid-action-code'},
  isAuthenticated: false
}
const authenticationStatePasswordResetUserDisabled = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/user-disabled'},
  isAuthenticated: false
}
const authenticationStatePasswordResetUserNotFound = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/user-not-found'},
  isAuthenticated: false
}
const authenticationStatePasswordResetWeakPassword = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/weak-password'},
  isAuthenticated: false
};
const authenticationStateLoggedInOK = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  email: dummyEmail,
  authenticationError: null,
  isAuthenticated: true
};
const authenticationStateLogInInvalidEmailError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/invalid-email'},
  isAuthenticated: false
};
const authenticationStateLogInUserDisabledError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/user-disabled'},
  isAuthenticated: false
};
const authenticationStateLogInUserNotFoundError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/user-not-found'},
  isAuthenticated: false
};
const authenticationStateLogInWrongPasswordError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  email: dummyEmail,
  authenticationError: {message: 'dummy', code: 'auth/wrong-password'},
  isAuthenticated: false
};
const authenticationStateLogInInvalidStateError = {
  method: 'sendPasswordResetEmail',
  result: null,
  email: dummyEmail,
  authenticationError: null,
  isAuthenticated: false
};

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

const viewVerifyCodeOK = section(classes.sel('photo-background'), {
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

const viewVerifyCodeInvalidError = section(classes.sel('photo-background'), {
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

const viewVerifyCodeUserNotFoundError = section(classes.sel('photo-background'), {
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

const viewVerifyCodeUserDisabledError = section(classes.sel('photo-background'), {
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

const viewVerifyCodeExpiredError = section(classes.sel('photo-background'), {
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

const viewPasswordResetExpiredCode = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
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

const viewPasswordResetInvalidCode = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
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

const viewPasswordResetUserDisabled = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
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

const viewPasswordResetUserNotFound = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
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

const viewPasswordResetWeakPassword = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.weakPasswordError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetLoggedIn = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.loggedIn'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetLogInInvalidEmail = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.invalidEmailError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetLogInUserDisabled = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.userDisabledError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetLogInUserNotFound = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.userNotFoundError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetLogInWrongPassword = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.wrongPasswordError'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordResetInvalidState = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.invalidState'}
        } as any)
      ]),
    ]),
  ])
]);

const viewPasswordTooShortError = section(classes.sel('photo-background'), {
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
          fieldset({attrs: {disabled: false}}, [
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.tooShortPassword'}
        } as any)
      ]),
    ]),
  ])
]);

const viewWrongRepeatedPasswordError = section(classes.sel('photo-background'), {
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
          fieldset({attrs: {disabled: false}}, [
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
          fieldset(classes.sel('actions'), {attrs: {disabled: false}}, [
            button(classes.sel('submit'), {
              polyglot: {phrase: 'resetPassword.resetPassword'}
            } as any)
          ])
        ]),
        // feedback message area
        h4(classes.sel('error'), {
          polyglot: {phrase: 'resetPassword.wrongRepeatedPassword'}
        } as any)
      ]),
    ]),
  ])
]);

const viewValidPasswordProcessingReset = section(classes.sel('photo-background'), {
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
          polyglot: {phrase: 'resetPassword.validPassword'}
        } as any)
      ]),
    ]),
  ])
]);

// VIEW TEMPLATE FOR COPY PASTING
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

describe.skip('The ResetPassword component', () => {
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

  describe('When the user is not already logged in AND' +
    ' no authentication was attempted yet (authenticationState)', ()=> {
    it('should emit a `verifyPasswordResetCode` command to firebase auth API' +
      ' AND display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button  and 1 ENABLED' +
      ' feedback message area which indicates that the reset code is being' +
      ' verified', (done) => {
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
        // NOTE : even if no values is sent, sources must exist
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
          outputs: [{
            code: dummyAuthParams.oobCode,
            method: AuthMethods.VERIFY_PASSWORD_RESET_CODE
          }],
          successMessage: 'DOM authentication$ produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [],
          successMessage: 'sink router produces no values as expected',
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

  describe('When the password reset code has been successfully verified', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which indicates that the reset code was' +
      ' successfully verified', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
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
          successMessage: 'sink router produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputs, expected,
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

  describe('When the password reset code has failed verification AND' +
    ' error code correspond to an expired code', ()=> {
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
            diagram: 'a-',
            values: {a: authenticationStateVerifyCodeExpiredError}
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
          successMessage: 'sink router produces no values as expected',
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

  describe('When the password reset code has failed verification AND' +
    ' error code corresponds to an invalid code', ()=> {
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
            diagram: 'a-',
            values: {a: authenticationStateVerifyCodeInvalidCodeError}
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
          successMessage: 'sink router produces no values as expected',
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

  describe('When the password reset code has failed verification AND' +
    ' error code corresponds to user not found', ()=> {
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
            diagram: 'a-',
            values: {a: authenticationStateVerifyCodeUserNotFoundError}
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
          successMessage: 'sink router produces no values as expected',
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

  describe('When the password reset code has failed verification AND' +
    ' error code corresponds to user disabled', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        {
          authenticationState$: {
            diagram: 'a-',
            values: {a: authenticationStateVerifyCodeUserDisabledError}
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
          successMessage: 'sink router produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputs, expected,
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

  describe('When the password has been successfully reset', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of the password reset. It should' +
      ' immediately try to log in the user', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        // NOTE : auth state must emit first to kick-off the intent sinks
        // (switch combinator is used on auth state stream)
        // Theoretically password inputs could go at any point as they are
        // modelled with replaySubjects (i.e. as behaviours) but for some
        // reasons, putting `authenticationState$` last fails the test...
        // Could be yet again some `most` subject/stream undocumented behaviour
        {
          authenticationState$: {
            diagram: 'a-',
            values: {a: authenticationStatePasswordResetOK}
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
          successMessage: 'sink router produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputs, expected,
        ResetPasswordComponentCurried(dummyAuthParams), {
          tickDuration: 5,
          waitForFinishDelay: 20,
          mocks: {
            DOM: makeMockDOMSource
          },
          sourceFactory: {
            DOM: () => holdSubject(1)
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe('When the password could not be successfully reset because' +
    ' the reset code has expired', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of failure of the password' +
      ' reset. The user can then try again to reset the password.',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          // NOTE : auth state must emit first to kick-off the intent sinks
          // (switch combinator is used on auth state stream)
          // Theoretically password inputs could go at any point as they are
          // modelled with replaySubjects (i.e. as behaviours) but for some
          // reasons, putting `authenticationState$` last fails the test...
          // Could be yet again some `most` subject/stream undocumented behaviour
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStatePasswordResetExpiredCode}
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
            outputs: [viewPasswordResetExpiredCode],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password could not be successfully reset because' +
    ' the reset code is invalid', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of failure of the password' +
      ' reset. The user can then try again to reset the password.',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          // NOTE : auth state must emit first to kick-off the intent sinks
          // (switch combinator is used on auth state stream)
          // Theoretically password inputs could go at any point as they are
          // modelled with replaySubjects (i.e. as behaviours) but for some
          // reasons, putting `authenticationState$` last fails the test...
          // Could be yet again some `most` subject/stream undocumented behaviour
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStatePasswordResetInvalidCode}
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
            outputs: [viewPasswordResetInvalidCode],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password could not be successfully reset because' +
    ' the user is disabled', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of failure of the password' +
      ' reset. The user can then try again to reset the password.',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          // NOTE : auth state must emit first to kick-off the intent sinks
          // (switch combinator is used on auth state stream)
          // Theoretically password inputs could go at any point as they are
          // modelled with replaySubjects (i.e. as behaviours) but for some
          // reasons, putting `authenticationState$` last fails the test...
          // Could be yet again some `most` subject/stream undocumented behaviour
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStatePasswordResetUserDisabled}
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
            outputs: [viewPasswordResetUserDisabled],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password could not be successfully reset because' +
    ' the user is not found', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of failure of the password' +
      ' reset. The user can then try again to reset the password.',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          // NOTE : auth state must emit first to kick-off the intent sinks
          // (switch combinator is used on auth state stream)
          // Theoretically password inputs could go at any point as they are
          // modelled with replaySubjects (i.e. as behaviours) but for some
          // reasons, putting `authenticationState$` last fails the test...
          // Could be yet again some `most` subject/stream undocumented behaviour
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStatePasswordResetUserNotFound}
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
            outputs: [viewPasswordResetUserNotFound],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password could not be successfully reset because' +
    ' the proposed password is weak', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of failure of the password' +
      ' reset. The user can then try again to reset the password.',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          // NOTE : auth state must emit first to kick-off the intent sinks
          // (switch combinator is used on auth state stream)
          // Theoretically password inputs could go at any point as they are
          // modelled with replaySubjects (i.e. as behaviours) but for some
          // reasons, putting `authenticationState$` last fails the test...
          // Could be yet again some `most` subject/stream undocumented behaviour
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStatePasswordResetWeakPassword}
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
            outputs: [viewPasswordResetWeakPassword],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user is successfully logged in (after a successful' +
    ' password reset)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user that he will be' +
      ' redirected to the dashboard screen. The user is redirected to the' +
      ' dashboard screen',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLoggedInOK}
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
            outputs: [viewPasswordResetLoggedIn],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/'],
            successMessage: 'sink router produces redirection route value',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful' +
    ' password reset (invalid email error))', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user of the situation. The' +
      ' user is redirected to the login screen',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLogInInvalidEmailError}
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
            outputs: [viewPasswordResetLogInInvalidEmail],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/login'],
            successMessage: 'sink router produces redirection route' +
            ' to login screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful password' +
    ' reset (user disabled error)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user of the situation. The' +
      ' user is redirected to the login screen',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLogInUserDisabledError}
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
            outputs: [viewPasswordResetLogInUserDisabled],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/login'],
            successMessage: 'sink router produces redirection route' +
            ' to login screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful password' +
    ' reset (user not found error)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user of the situation. The' +
      ' user is redirected to the login screen',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLogInUserNotFoundError}
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
            outputs: [viewPasswordResetLogInUserNotFound],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/login'],
            successMessage: 'sink router produces redirection route' +
            ' to login screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful password' +
    ' reset (wrong password error)', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user of the situation. The' +
      ' user is redirected to the login screen',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLogInWrongPasswordError}
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
            outputs: [viewPasswordResetLogInWrongPassword],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/login'],
            successMessage: 'sink router produces redirection route' +
            ' to login screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            waitForFinishDelay: 20,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user navigates to the reset password route AND the' +
    ' authentication data reflects an unexpected state', ()=> {

    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs the user of the situation. The' +
      ' user is redirected to the login screen after some delay',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-',
              values: {a: authenticationStateLogInInvalidStateError}
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
            outputs: [viewPasswordResetInvalidState],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [],
            successMessage: 'DOM authentication$ produces no values as' +
            ' expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: ['/login'],
            successMessage: 'sink router produces redirection route' +
            ' to login screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
          ResetPasswordComponentCurried(dummyAuthParams), {
            tickDuration: 5,
            // !! Need to put a value here superior to the expected delay
            // before rerouting
            waitForFinishDelay: 1500,
            mocks: {
              DOM: makeMockDOMSource
            },
            sourceFactory: {
              DOM: () => holdSubject(1)
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password reset code has been successfully verified' +
    ' AND' +
    ' the user enters a password with less than the minimum length AND' +
    ' confirms correctly the password AND submit the form', ()=> {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which indicates that the password is too short', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        {
          authenticationState$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
          }
        },
        // NOTE : form input data must go after (on another tick) authenticationState
        // Really hard to explain why with words, will have to carefully e2e
        // test to check behavior in actual non-simulated environment
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: '-a-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: '-a-',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-a-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
      ]

      const expected = {
        DOM: {
          outputs: [viewVerifyCodeOK, viewPasswordTooShortError],
          successMessage: 'DOM sink produces the expected sequence of screens',
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
          successMessage: 'sink router produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
      }

      function ResetPasswordComponentCurried(settings) {
        return function (sources) {
          return ResetPasswordComponent(sources, settings);
        }
      }

      runTestScenario(testInputs, expected,
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

  describe(
    `When the password reset code has been successfully verified
     AND the user enters an initial password and a confirmation password
      which are different AND submit the form`, ()=> {
      it('should display a view with 1 ENABLED "enter new password" fields, 1' +
        ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
        ' feedback message area which indicates that the passwords do not' +
        ' coincide', (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
            }
          },
          // NOTE : form input data must go after (on another tick) authenticationState
          // Really hard to explain why with words, will have to carefully e2e
          // test to check behavior in actual non-simulated environment
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword + '$'))}
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewVerifyCodeOK, viewWrongRepeatedPasswordError],
            successMessage: 'DOM sink produces the expected sequence of screens',
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
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
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

  describe('When the password reset code has been successfully verified AND' +
    ' the user enters an initial password and a confirmation password which' +
    ' are the same AND password is long enough AND user submits the form', ()=> {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which indicates that the password is being reset',
      (done) => {
        const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

        const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
        const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
        const formSelector = 'form';

        const testInputs = [
          {
            authenticationState$: {
              diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
            }
          },
          // NOTE : form input data must go after (on another tick) authenticationState
          // Really hard to explain why with words, will have to carefully e2e
          // test to check behavior in actual non-simulated environment
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewVerifyCodeOK, viewValidPasswordProcessingReset],
            successMessage: 'DOM sink produces the expected sequence of screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [{
              method: AuthMethods.CONFIRM_PASSWORD_RESET,
              code: dummyAuthParams.oobCode,
              newPassword: dummyPassword
            }],
            successMessage: 'DOM authentication$ produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          router: {
            outputs: [],
            successMessage: 'sink router produces no values as expected',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
        }

        function ResetPasswordComponentCurried(settings) {
          return function (sources) {
            return ResetPasswordComponent(sources, settings);
          }
        }

        runTestScenario(testInputs, expected,
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

  describe(
    `When no authentication was attempted yet 
  AND the password reset code failed verification due to an expired reset code 
  `, ()=> {
      it(
        `should display a view with 1 DISABLED "enter new password" fields, 
      1 DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED 
      feedback message area which reports about the error`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputs = [
            {
              authenticationState$: {
                diagram: 'ab----', values: {
                  a: authenticationStateNoAuthError,
                  b: authenticationStateVerifyCodeExpiredError,
                }
              }
            },
            // NOTE : form input data must go after (on another tick) authenticationState
            // Really hard to explain why with words, will have to carefully e2e
            // test to check behavior in actual non-simulated environment
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '-------',
                values: {}
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '-------',
                values: {
                }
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '-------',
                values: {}
              }
            },
          ]

          const expected = {
            DOM: {
              outputs: [
                viewNoAuthError,
                viewVerifyCodeExpiredError,
              ],
              successMessage: 'DOM sink produces the expected sequence of screens',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            authentication$: {
              outputs: [{
                method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
                code: dummyAuthParams.oobCode,
              }
              ],
              successMessage: `
            authentication$ produces 
            VERIFY_PASSWORD_RESET_CODE command`,
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            router: {
              outputs: [],
              successMessage: 'sink router produces nothing as expected',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
          }

          function ResetPasswordComponentCurried(settings) {
            return function (sources) {
              return ResetPasswordComponent(sources, settings);
            }
          }

          runTestScenario(testInputs, expected,
            ResetPasswordComponentCurried(dummyAuthParams), {
              tickDuration: 5,
              waitForFinishDelay: 20,
              mocks: {
                DOM: makeMockDOMSource
              },
              errorHandler: function (err) {
                done(err)
              },
              sourceFactory: {
                DOM: () => holdSubject(1)
              },
            })

        });
    });

  describe(
    `When no authentication was attempted yet 
  AND the password reset code has been successfully verified 
  AND the user enters an initial password and a confirmation password which
  are the same 
  AND password is long enough 
  AND user submits the form
  AND password is successfully reset
  `, ()=> {
      it(
        `should display a view with 1 DISABLED "enter new password" fields, 
      1 DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED 
      feedback message area which indicates that the user is being logged in 
      AND emit a log-in command with newly reset password`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputs = [
            {
              authenticationState$: {
                diagram: 'ab-c--', values: {
                  a: authenticationStateNoAuthError,
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                }
              }
            },
            // NOTE : form input data must go after (on another tick) authenticationState
            // Really hard to explain why with words, will have to carefully e2e
            // test to check behavior in actual non-simulated environment
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
          ]

          const expected = {
            DOM: {
              outputs: [viewNoAuthError, viewVerifyCodeOK, viewValidPasswordProcessingReset, viewLoggingIn],
              successMessage: 'DOM sink produces the expected sequence of screens',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            authentication$: {
              outputs: [{
                method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
                code: dummyAuthParams.oobCode,
              }, {
                method: AuthMethods.CONFIRM_PASSWORD_RESET,
                code: dummyAuthParams.oobCode,
                newPassword: dummyPassword
              }, {
                method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
                email: dummyEmail,
                password: dummyPassword
              }
              ],
              successMessage: `
            authentication$ produces 
            VERIFY_PASSWORD_RESET_CODE
            THEN CONFIRM_PASSWORD_RESET
            THEN SIGN_IN_WITH_EMAIL_AND_PASSWORD commands`,
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            router: {
              outputs: [],
              successMessage: 'sink router produces no values as expected',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
          }

          function ResetPasswordComponentCurried(settings) {
            return function (sources) {
              return ResetPasswordComponent(sources, settings);
            }
          }

          runTestScenario(testInputs, expected,
            ResetPasswordComponentCurried(dummyAuthParams), {
              tickDuration: 5,
              waitForFinishDelay: 20,
              mocks: {
                DOM: makeMockDOMSource
              },
              errorHandler: function (err) {
                done(err)
              },
              sourceFactory: {
                DOM: () => holdSubject(1)
              },
            })

        });
    });

  describe(
    `When no authentication was attempted yet 
  AND the password reset code has been successfully verified 
  AND the user enters an initial password and a confirmation password which
  are the same 
  AND password is long enough 
  AND user submits the form
  AND password is successfully reset
  AND user is successfully logged in with the new password`, ()=> {
      it(
        `should display a view with 1 DISABLED "enter new password" fields, 
      1 DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED 
      feedback message area which indicates that the user is being logged in 
      AND emit a redirect command to the dashboard`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputs = [
            {
              authenticationState$: {
                diagram: 'ab-c-d', values: {
                  a: authenticationStateNoAuthError,
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK
                }
              }
            },
            // NOTE : form input data must go after (on another tick) authenticationState
            // Really hard to explain why with words, will have to carefully e2e
            // test to check behavior in actual non-simulated environment
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--a-a',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
          ]

          const expected = {
            DOM: {
              outputs: [viewNoAuthError, viewVerifyCodeOK, viewValidPasswordProcessingReset, viewLoggingIn, viewPasswordResetLoggedIn],
              successMessage: 'DOM sink produces the expected sequence of screens',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            authentication$: {
              outputs: [{
                method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
                code: dummyAuthParams.oobCode,
              }, {
                method: AuthMethods.CONFIRM_PASSWORD_RESET,
                code: dummyAuthParams.oobCode,
                newPassword: dummyPassword
              }, {
                method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
                email: dummyEmail,
                password: dummyPassword
              }
              ],
              successMessage: `
            authentication$ produces 
            VERIFY_PASSWORD_RESET_CODE
            THEN CONFIRM_PASSWORD_RESET
            THEN SIGN_IN_WITH_EMAIL_AND_PASSWORD commands`,
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            router: {
              outputs: [DASHBOARD_ROUTE],
              successMessage: 'sink router streams out the dashboard route',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
          }

          function ResetPasswordComponentCurried(settings) {
            return function (sources) {
              return ResetPasswordComponent(sources, settings);
            }
          }

          runTestScenario(testInputs, expected,
            ResetPasswordComponentCurried(dummyAuthParams), {
              tickDuration: 5,
              waitForFinishDelay: 20,
              mocks: {
                DOM: makeMockDOMSource
              },
              errorHandler: function (err) {
                done(err)
              },
              sourceFactory: {
                DOM: () => holdSubject(1)
              },
            })

        });
    });

  describe(
    `When no authentication was attempted yet 
  AND the password reset code has been successfully verified 
  AND the user enters an initial password and a confirmation password which
  are the same 
  AND password is too short 
  AND the user enters another initial password and a confirmation password which
  are the same 
  AND password is long enough 
  AND user submits the form
  AND password is successfully reset
  AND user is successfully logged in with the new password`, ()=> {
      it(
        `should display a view with 1 DISABLED "enter new password" fields, 
      1 DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED 
      feedback message area which indicates that the user is being logged in 
      AND emit a redirect command to the dashboard`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputs = [
            {
              authenticationState$: {
                diagram: 'ab--cd', values: {
                  a: authenticationStateNoAuthError,
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK,
                }
              }
            },
            // NOTE : form input data must go after (on another tick) authenticationState
            // Really hard to explain why with words, will have to carefully e2e
            // test to check behavior in actual non-simulated environment
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '--ab---',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyTooShortPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '--abb--',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyTooShortPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--aa---',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
          ]

          const expected = {
            DOM: {
              outputs: [
                viewNoAuthError,
                viewVerifyCodeOK,
                viewPasswordTooShortError,
                viewValidPasswordProcessingReset,
                viewLoggingIn,
                viewPasswordResetLoggedIn
              ],
              successMessage: 'DOM sink produces the expected sequence of screens',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            authentication$: {
              outputs: [{
                method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
                code: dummyAuthParams.oobCode,
              }, {
                method: AuthMethods.CONFIRM_PASSWORD_RESET,
                code: dummyAuthParams.oobCode,
                newPassword: dummyPassword
              }, {
                method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
                email: dummyEmail,
                password: dummyPassword
              }
              ],
              successMessage: `
            authentication$ produces 
            VERIFY_PASSWORD_RESET_CODE
            THEN CONFIRM_PASSWORD_RESET
            THEN SIGN_IN_WITH_EMAIL_AND_PASSWORD commands`,
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            router: {
              outputs: [DASHBOARD_ROUTE],
              successMessage: 'sink router streams out the dashboard route',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
          }

          function ResetPasswordComponentCurried(settings) {
            return function (sources) {
              return ResetPasswordComponent(sources, settings);
            }
          }

          runTestScenario(testInputs, expected,
            ResetPasswordComponentCurried(dummyAuthParams), {
              tickDuration: 5,
              waitForFinishDelay: 20,
              mocks: {
                DOM: makeMockDOMSource
              },
              errorHandler: function (err) {
                done(err)
              },
              sourceFactory: {
                DOM: () => holdSubject(1)
              },
            })

        });
    });

  describe(
    `When no authentication was attempted yet 
  AND the password reset code has been successfully verified 
  AND the user enters an initial password and a confirmation password which
  are different
  AND the user enters another initial password and a confirmation password which
  are the same 
  AND password is long enough 
  AND user submits the form
  AND password is successfully reset
  AND user is successfully logged in with the new password`, ()=> {
      it(
        `should display a view with 1 DISABLED "enter new password" fields, 
      1 DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED 
      feedback message area which indicates that the user is being logged in 
      AND emit a redirect command to the dashboard`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputs = [
            {
              authenticationState$: {
                diagram: 'ab--cd', values: {
                  a: authenticationStateNoAuthError,
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK,
                }
              }
            },
            // NOTE : form input data must go after (on another tick) authenticationState
            // Really hard to explain why with words, will have to carefully e2e
            // test to check behavior in actual non-simulated environment
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '--ab---',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '--abb--',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyPassword + '$')),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--aa---',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
          ]

          const expected = {
            DOM: {
              outputs: [
                viewNoAuthError,
                viewVerifyCodeOK,
                viewWrongRepeatedPasswordError,
                viewValidPasswordProcessingReset,
                viewLoggingIn,
                viewPasswordResetLoggedIn
              ],
              successMessage: 'DOM sink produces the expected sequence of screens',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            authentication$: {
              outputs: [{
                method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
                code: dummyAuthParams.oobCode,
              }, {
                method: AuthMethods.CONFIRM_PASSWORD_RESET,
                code: dummyAuthParams.oobCode,
                newPassword: dummyPassword
              }, {
                method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
                email: dummyEmail,
                password: dummyPassword
              }
              ],
              successMessage: `
            authentication$ produces 
            VERIFY_PASSWORD_RESET_CODE
            THEN CONFIRM_PASSWORD_RESET
            THEN SIGN_IN_WITH_EMAIL_AND_PASSWORD commands`,
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
            router: {
              outputs: [DASHBOARD_ROUTE],
              successMessage: 'sink router streams out the dashboard route',
              analyzeTestResults: analyzeTestResults,
              transformFn: undefined,
            },
          }

          function ResetPasswordComponentCurried(settings) {
            return function (sources) {
              return ResetPasswordComponent(sources, settings);
            }
          }

          runTestScenario(testInputs, expected,
            ResetPasswordComponentCurried(dummyAuthParams), {
              tickDuration: 5,
              waitForFinishDelay: 20,
              mocks: {
                DOM: makeMockDOMSource
              },
              errorHandler: function (err) {
                done(err)
              },
              sourceFactory: {
                DOM: () => holdSubject(1)
              },
            })

        });
    });

  // TODO: remove the is not logged in first test, we don't discriminate on
  // login anymore, and remove it from the API call driver's response

  // TODO : make properties too for forgotPassword screen, all should load
  // in `en.ts `
  // TODO : specify driver commands
  // TODO : specify driver responses
  // TODO : specify authenticationState from driver responses and
  // onAuthStateChanged, separated from the user profile data

  // TODO : write the properties to be specified
  // - delay etc.
  // - en.ts strings
  // TODO : write specs of current design
  // - the state machine somehow for documentation purposes
  // - forms : style, error reporting
});

