import isolate from '@cycle/isolate';
import {
  Stream,
  combine,
  merge as mergeM,
  mergeArray,
  empty,
  never,
  just
} from 'most';
import {
  DOMSource, div, span, section, form, fieldset, label, a, p, input, h1,
  h4, button, VNode
} from '@motorcycle/dom';
import hold from '@most/hold';
import {cond, always, merge as mergeR, mergeAll} from 'ramda';
import {Sources, Sinks, Source} from '../../components/types';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods
} from '../types/authentication/types';
import {cssClasses} from '../../utils/classes';
import {AuthenticationError} from "../../drivers/firebase-authentication/AuthenticationError"

const classes = cssClasses({});
const backgroundImage = require('assets/images/login-background.jpg');
const resetPasswordFeedbackTypeMap = {
  'none': 'feedback',
  'authenticated': 'warning',
  "failed": 'error',
}
const resetPasswordFeedbackPhraseMap = {
  'auth/expired-action-code': 'resetPassword.verifyCodeExpiredError',
  'auth/invalid-action-code': 'resetPassword.verifyCodeInvalidError',
  'auth/user-disabled': 'resetPassword.verifyCodeDisabledUserError',
  'auth/user-not-found': 'resetPassword.verifyCodeUserNotFoundError',
  'auth/weak-password': 'resetPassword.weakPasswordError',
  'LoggedIn|auth/invalid-email': 'resetPassword.invalidEmailError',
  'LoggedIn|auth/user-disabled': 'resetPassword.userDisabledError',
  'LoggedIn|auth/user-not-found': 'resetPassword.userNotFoundError',
  'LoggedIn|auth/wrong-password': 'resetPassword.wrongPasswordError',
  'internal/invalid-state' : 'resetPassword.invalidState',
  'validation/too-short' : 'resetPassword.tooShortPassword',
  'validation/wrong-repeated-password' : 'resetPassword.wrongRepeatedPassword'
}

// TODO : polyglot sentences
// TODO : form design and css styling
function computeResetPasswordView(params) {
  const {
          isDisabled, resetPasswordFeedbackType, resetPasswordFeedbackPhrase
        } = params;

  return section(classes.sel('photo-background'), {
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
            fieldset({attrs: {disabled: isDisabled}}, [
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
            fieldset(classes.sel('actions'), {attrs: {disabled: isDisabled}}, [
              button(classes.sel('submit'), {
                polyglot: {phrase: 'resetPassword.resetPassword'}
              } as any)
            ])
          ]),
          // feedback message area
          h4(classes.sel(resetPasswordFeedbackType), {
            polyglot: {phrase: resetPasswordFeedbackPhrase}
          } as any)
        ]),
      ]),
    ])
  ]);
}

function computeView({authenticationState, authResetState}) {
  let view;
  const error = authenticationState && authenticationState.authenticationError &&
    authenticationState.authenticationError.code;

  switch (authResetState as AuthResetState) {
    case AuthResetStateEnum.RESET_PWD_INIT :
      view = computeResetPasswordView({
        // view is disabled till code is verified
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
        resetPasswordFeedbackPhrase: 'resetPassword.verifying'
      });
      break;
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK :
      view = computeResetPasswordView({
        // view is enabled <- code is verified
        isDisabled: false,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
        resetPasswordFeedbackPhrase: 'resetPassword.verifyCodeSuccessful'
      });
      break;
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK:
      view = computeResetPasswordView({
        // view is disabled <- code failed verification ; display error message
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
        resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
      });
      break;
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK:
      view = computeResetPasswordView({
        // view is disabled while logging the user in
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
        resetPasswordFeedbackPhrase: 'resetPassword.loggingIn'
      });
      break;
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_NOK:
      view = computeResetPasswordView({
        // view is enabled so the user can try another password
        isDisabled: false,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
        resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
      });
      break;
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK:
      view = computeResetPasswordView({
        // view is disabled while the application changes screen
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
        resetPasswordFeedbackPhrase: 'resetPassword.loggedIn'
      });
      break;
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK:
      view = computeResetPasswordView({
        // view is disabled while the application changes screen
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
        resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap['LoggedIn|'+error]
      });
      break;
    case AuthResetStateEnum.INVALID_PASSWORD :
      view = computeResetPasswordView({
        // view is enabled so the user can try another password
        isDisabled: false,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
        resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
      });
      break;
    case AuthResetStateEnum.INVALID_STATE :
    default :
      view = computeResetPasswordView({
        // view is disabled while the application changes screen
        isDisabled: true,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
        resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap['internal/invalid-state']
      });
      break;
  }

  return {
    DOM: just(view).tap(x=>console.info('DOM orig', x))
  }
}

export {
  computeView,
  classes
}
