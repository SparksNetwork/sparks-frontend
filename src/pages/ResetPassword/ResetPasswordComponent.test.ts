/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
// TODO : add a actual vs. expected diff. when the test errors (in runTestSce..)
// import {Diff, NativeAdapter, CompactCodec} from 'modern-diff'
// better use http://benjamine.github.io/jsondiffpatch/demo/index.html
import firebase = require('firebase');
import {
  AuthMethods, ResetPasswordState
} from '../types/authentication/types';
import {
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import {
  div, span, section, form, fieldset, label, a, p, input, h1, h4, button, VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM, empty, never, just} from 'most';
import {hold, sync, async} from 'most-subject'
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
import {
  DASHBOARD_ROUTE, LOGIN_ROUTE,
  FORGOT_PASSWORD_ROUTE
} from '../config.properties'

function holdSubjectFactory(name) {
  return hold(1, sync());
}

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
const dummySources = {DOM: stubbedDOMSource, authentication$: never(),};
const dummyEmail = 'dummy@email.com';
const dummyPassword = 'dummyPassword';
const dummyTooShortPassword = 'dummy';
const dummyAuthParams = {mode: 'dummy', oobCode: 'dummy'};

const verifyPasswordResetCodeCommand = {
  code: dummyAuthParams.oobCode,
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE
};
const signInCommand = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  email: dummyEmail,
  password: dummyPassword
};
const confirmPasswordResetCommand = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  code: dummyAuthParams.oobCode,
  newPassword: dummyPassword
};

const authenticationStateVerifyCodeOK = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: dummyEmail,
  error: null
}
const authenticationStateVerifyCodeExpiredError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  error: {message: 'dummy', code: 'auth/expired-action-code'},
}
const authenticationStateVerifyCodeInvalidCodeError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  error: {message: 'dummy', code: 'auth/invalid-action-code'},
}
const authenticationStateVerifyCodeUserDisabledError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  error: {message: 'dummy', code: 'auth/user-disabled'},
}
const authenticationStateVerifyCodeUserNotFoundError = {
  method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
  result: null,
  error: {message: 'dummy', code: 'auth/user-not-found'},
}
const authenticationStatePasswordResetOK = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: null,
}
const authenticationStatePasswordResetExpiredCode = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: {message: 'dummy', code: 'auth/expired-action-code'},
}
const authenticationStatePasswordResetInvalidCode = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: {message: 'dummy', code: 'auth/invalid-action-code'},
}
const authenticationStatePasswordResetUserDisabled = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: {message: 'dummy', code: 'auth/user-disabled'},
}
const authenticationStatePasswordResetUserNotFound = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: {message: 'dummy', code: 'auth/user-not-found'},
}
const authenticationStatePasswordResetWeakPassword = {
  method: AuthMethods.CONFIRM_PASSWORD_RESET,
  result: null,
  error: {message: 'dummy', code: 'auth/weak-password'},
};
const authenticationStateLoggedInOK = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  error: null,
};
const authenticationStateLogInInvalidEmailError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  error: {message: 'dummy', code: 'auth/invalid-email'},
};
const authenticationStateLogInUserDisabledError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  error: {message: 'dummy', code: 'auth/user-disabled'},
};
const authenticationStateLogInUserNotFoundError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  error: {message: 'dummy', code: 'auth/user-not-found'},
};
const authenticationStateLogInWrongPasswordError = {
  method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  result: null,
  error: {message: 'dummy', code: 'auth/wrong-password'},
};
const authenticationStateLogInInvalidStateError = {
  method: 'sendPasswordResetEmail',
  result: null,
  error: null,
};

const viewNoAuthError = section(classes.sel('photo-background'), {
  style: {
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

describe('The ResetPassword component', () => {
  it('should be a function', () => {
    assert.ok(isFunction(ResetPasswordComponent));
  });

  it('should be called with a source list including authentication$',
    () => {
      assert.throws(() => ResetPasswordComponent(dummyIncompleteSources, dummyAuthParams),
        'throws an error when at least one expected source is missing')
    });

  it('should return at least DOM, authentication, and route sinks', () => {
    const sinks = ResetPasswordComponent(dummySources, dummyAuthParams);

    const actual = hasExpectedSinks(sinks, ['DOM', 'authentication$', 'router']);

    assert.ok(actual, 'computes DOM, authentication, and route sinks');
  });

  describe(
    `When the user navigates to the reset password link 
    AND no authentication was attempted yet (initial state)`, () => {
      it(
        `should emit a verifyPasswordResetCode command to firebase auth API
         AND display a view with 1 DISABLED "enter new password" fields, 
             1 DISABLED "confirm password", 1 DISABLED SUBMIT button, and  
             1 ENABLED feedback message area which indicates that the reset code 
             is being verified`,
        (done) => {
          const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

          const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
          const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
          const formSelector = 'form';

          const testInputsNotLoggedInNoAuthOpYet = [
            {
              authentication$: {
                diagram: '--', values: {}
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
              outputs: [verifyPasswordResetCodeCommand],
              successMessage: 'sink authentication$ produces a' +
              ' VERIFY_PASSWORD_RESET_CODE command',
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

  describe('When the password reset code has been successfully verified', () => {
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
          authentication$: {
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
          outputs: [viewNoAuthError, viewVerifyCodeOK],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'DOM authentication$ produces only reset password' +
          ' command',
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
    ' error code corresponds to an expired code', () => {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authentication$: {
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
          outputs: [viewNoAuthError, viewVerifyCodeExpiredError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'sink authentication$ produces a' +
          ' VERIFY_PASSWORD_RESET_CODE command',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [FORGOT_PASSWORD_ROUTE],
          successMessage: 'sink router produces the FORGOT_PASSWORD_ROUTE',
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
    ' error code corresponds to an invalid code', () => {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authentication$: {
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
          outputs: [viewNoAuthError, viewVerifyCodeInvalidError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'DOM authentication$ produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [FORGOT_PASSWORD_ROUTE],
          successMessage: 'sink router produces the FORGOT_PASSWORD_ROUTE',
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
    ' error code corresponds to user not found', () => {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputsNotLoggedInNoAuthOpYet = [
        {
          authentication$: {
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
          outputs: [viewNoAuthError, viewVerifyCodeUserNotFoundError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'DOM authentication$ produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [FORGOT_PASSWORD_ROUTE],
          successMessage: 'sink router produces the FORGOT_PASSWORD_ROUTE',
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
    ' error code corresponds to user disabled', () => {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which gives account of the error', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        {
          authentication$: {
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
          outputs: [viewNoAuthError, viewVerifyCodeUserDisabledError],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'DOM authentication$ produces no values as expected',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        router: {
          outputs: [FORGOT_PASSWORD_ROUTE],
          successMessage: 'sink router produces the FORGOT_PASSWORD_ROUTE',
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

  describe('When the password has been successfully reset', () => {
    it('should display a view with 1 DISABLED "enter new password" fields, 1' +
      ' DISABLED "confirm password", 1 DISABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which informs of the password reset. It should' +
      ' immediately try to log in the user', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        {
          authentication$: {
            diagram: 'a-b-',
            values: {
              a: authenticationStateVerifyCodeOK,
              b: authenticationStatePasswordResetOK
            }
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
            diagram: 'a--',
            values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: 'a--',
            values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
          }
        },
      ]

      const expected = {
        DOM: {
          outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn],
          successMessage: 'DOM sink produces the expected screen',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand, signInCommand],
          successMessage: 'authentication$ receives a' +
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
            'DOM!form@submit': function DOMFactory(inputKey) {
              return holdSubjectFactory(inputKey)
            },
            'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
              return holdSubjectFactory(inputKey)
            },
            "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
              return holdSubjectFactory(inputKey)
            },
          },
          errorHandler: function (err) {
            done(err)
          }
        })

    });
  });

  describe('When the password could not be successfully reset because' +
    ' the reset code has expired', () => {
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
          {
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetExpiredCode
              }
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
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetExpiredCode],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces s command to verify' +
            ' the reset code',
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

  describe('When the password could not be successfully reset because' +
    ' the reset code is invalid', () => {
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
          {
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetInvalidCode
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetInvalidCode],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces s command to verify' +
            ' the reset code',
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

  describe('When the password could not be successfully reset because' +
    ' the user is disabled', () => {
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
          {
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetUserDisabled
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetUserDisabled],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces s command to verify' +
            ' the reset code',
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

  describe('When the password could not be successfully reset because' +
    ' the user is not found', () => {
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
          {
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetUserNotFound
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetUserNotFound],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces s command to verify' +
            ' the reset code',
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

  describe('When the password could not be successfully reset because' +
    ' the proposed password is weak', () => {
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
          {
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetWeakPassword
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetWeakPassword],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces s command to verify' +
            ' the reset code',
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

  describe('When the user is successfully logged in (after a successful' +
    ' password reset)', () => {
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
            authentication$: {
              diagram: 'ab-c',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetOK,
                c: authenticationStateLoggedInOK
              }
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
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn, viewPasswordResetLoggedIn],
            successMessage: 'DOM sink produces the expected screen',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, signInCommand],
            successMessage: 'authentication$ receives a' +
            ' SIGN_IN_WITH_EMAIL_AND_PASSWORD command',
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
              'DOM!form@submit': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful' +
    ' password reset (invalid email error))', () => {
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
            authentication$: {
              diagram: 'ab-c',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetOK,
                c: authenticationStateLogInInvalidEmailError
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: 'a--',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn, viewPasswordResetLogInInvalidEmail],
            successMessage: 'DOM sink produces the expected screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, signInCommand],
            successMessage: 'authentication$ produces the expected commands',
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
              'DOM!form@submit': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful' +
    ' password reset (user disabled error))', () => {
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
            authentication$: {
              diagram: 'ab-c',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetOK,
                c: authenticationStateLogInUserDisabledError
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: 'a--',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn, viewPasswordResetLogInUserDisabled],
            successMessage: 'DOM sink produces the expected screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, signInCommand],
            successMessage: 'authentication$ produces the expected commands',
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
              'DOM!form@submit': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful' +
    ' password reset (user not found error))', () => {
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
            authentication$: {
              diagram: 'ab-c',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetOK,
                c: authenticationStateLogInUserNotFoundError
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: 'a--',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn, viewPasswordResetLogInUserNotFound],
            successMessage: 'DOM sink produces the expected screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, signInCommand],
            successMessage: 'authentication$ produces the expected commands',
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
              'DOM!form@submit': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user fails log-in after a successful' +
    ' password reset (wrong password error))', () => {
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
            authentication$: {
              diagram: 'ab-c',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStatePasswordResetOK,
                c: authenticationStateLogInWrongPasswordError
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: 'a--',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: 'a---',
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewLoggingIn, viewPasswordResetLogInWrongPassword],
            successMessage: 'DOM sink produces the expected screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, signInCommand],
            successMessage: 'authentication$ produces the expected commands',
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
              'DOM!form@submit': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the user navigates to the reset password route AND the' +
    ' authentication data reflects an unexpected state', () => {

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
            authentication$: {
              diagram: 'ab',
              values: {
                a: authenticationStateVerifyCodeOK,
                b: authenticationStateLogInInvalidStateError
              }
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${enterPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
          {
            [`DOM!${confirmPasswordSelector}@input`]: {
              diagram: '--',
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordResetInvalidState],
            successMessage: 'DOM sink produces the expected screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
            successMessage: 'authentication$ produces the expected commands',
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
            errorHandler: function (err) {
              done(err)
            }
          })

      });
  });

  describe('When the password reset code has been successfully verified AND' +
    ' the user enters a password with less than the minimum length AND' +
    ' confirms correctly the password AND submit the form', () => {
    it('should display a view with 1 ENABLED "enter new password" fields, 1' +
      ' ENABLED "confirm password", 1 ENABLED SUBMIT button and 1 ENABLED' +
      ' feedback message area which indicates that the password is too short', (done) => {
      const analyzeTestResults = _analyzeTestResults(assert, plan(3, done));

      const enterPasswordSelector = resetPasswordClasses.sel('resetPassword.enterPassword');
      const confirmPasswordSelector = resetPasswordClasses.sel('resetPassword.confirmPassword');
      const formSelector = 'form';

      const testInputs = [
        {
          authentication$: {
            diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
          }
        },
        {
          [`DOM!${formSelector}@submit`]: {
            diagram: '-a-',
            values: {a: decorateWithPreventDefault(stubSubmitEvent())}
          }
        },
        {
          [`DOM!${enterPasswordSelector}@input`]: {
            diagram: 'a--',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
        {
          [`DOM!${confirmPasswordSelector}@input`]: {
            diagram: 'a--',
            values: {a: decorateWithPreventDefault(stubInputEvent('dummy'))}
          }
        },
      ]

      const expected = {
        DOM: {
          outputs: [viewNoAuthError, viewVerifyCodeOK, viewPasswordTooShortError],
          successMessage: 'DOM sink produces the expected sequence of screens',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        },
        authentication$: {
          outputs: [verifyPasswordResetCodeCommand],
          successMessage: 'authentication$ produces the expected values',
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
            'DOM!.resetPassword.enterPassword@input': holdSubjectFactory,
            "DOM!.resetPassword.confirmPassword@input": holdSubjectFactory,
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
      which are different AND submit the form`, () => {
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
            authentication$: {
              diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '-a-',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
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
              values: {a: decorateWithPreventDefault(stubInputEvent(dummyPassword + '$'))}
            }
          },
        ]

        const expected = {
          DOM: {
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewWrongRepeatedPasswordError],
            successMessage: 'DOM sink produces the expected sequence of screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand],
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
            sourceFactory: {
              'DOM!.resetPassword.enterPassword@input': holdSubjectFactory,
              "DOM!.resetPassword.confirmPassword@input": holdSubjectFactory,
            },
            errorHandler: function (err) {
              done(err)
            }
          })

      });
    });

  describe('When the password reset code has been successfully verified AND' +
    ' the user enters an initial password and a confirmation password which' +
    ' are the same AND password is long enough AND user submits the form', () => {
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
            authentication$: {
              diagram: 'a-', values: {a: authenticationStateVerifyCodeOK}
            }
          },
          {
            [`DOM!${formSelector}@submit`]: {
              diagram: '-a',
              values: {a: decorateWithPreventDefault(stubSubmitEvent())}
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
            outputs: [viewNoAuthError, viewVerifyCodeOK, viewValidPasswordProcessingReset],
            successMessage: 'DOM sink produces the expected sequence of screens',
            analyzeTestResults: analyzeTestResults,
            transformFn: undefined,
          },
          authentication$: {
            outputs: [verifyPasswordResetCodeCommand, confirmPasswordResetCommand],
            successMessage: 'authentication$ produces the expected values',
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
              'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
              "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                return holdSubjectFactory(inputKey)
              },
            },
            errorHandler: function (err) {
              done(err)
            }
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
  `, () => {
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
              authentication$: {
                diagram: '-b-c--', values: {
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
                diagram: '--a-',
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
              outputs: [
                verifyPasswordResetCodeCommand,
                confirmPasswordResetCommand,
                signInCommand
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
                'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
                "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
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
  AND user is successfully logged in with the new password`, () => {
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
              authentication$: {
                diagram: '-b-c-d', values: {
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK
                }
              }
            },
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
                diagram: '--a-',
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
              outputs: [
                verifyPasswordResetCodeCommand,
                confirmPasswordResetCommand,
                signInCommand
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
                'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
                "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
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
  AND user is successfully logged in with the new password`, () => {
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
              authentication$: {
                diagram: '-b--cd', values: {
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK,
                }
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--aa---',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '-ab---',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyTooShortPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '-ab--',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyTooShortPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
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
              outputs: [
                verifyPasswordResetCodeCommand,
                confirmPasswordResetCommand,
                signInCommand
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
                'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
                "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
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
  AND user is successfully logged in with the new password`, () => {
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
              authentication$: {
                diagram: '-b--cd', values: {
                  b: authenticationStateVerifyCodeOK,
                  c: authenticationStatePasswordResetOK,
                  d: authenticationStateLoggedInOK,
                }
              }
            },
            {
              [`DOM!${formSelector}@submit`]: {
                diagram: '--aa---',
                values: {a: decorateWithPreventDefault(stubSubmitEvent())}
              }
            },
            {
              [`DOM!${enterPasswordSelector}@input`]: {
                diagram: '-ab---',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
              }
            },
            {
              [`DOM!${confirmPasswordSelector}@input`]: {
                diagram: '-ab--',
                values: {
                  a: decorateWithPreventDefault(stubInputEvent(dummyPassword + '$')),
                  b: decorateWithPreventDefault(stubInputEvent(dummyPassword)),
                }
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
              outputs: [
                verifyPasswordResetCodeCommand,
                confirmPasswordResetCommand,
                signInCommand
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
                'DOM!.resetPassword.enterPassword@input': function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
                "DOM!.resetPassword.confirmPassword@input": function DOMFactory(inputKey) {
                  return holdSubjectFactory(inputKey)
                },
              },
            })

        });
    });
});
