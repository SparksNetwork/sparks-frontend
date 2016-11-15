import {
  DOMSource, div, span, section, form, fieldset, label, a, p, input, h1,
  h4, button, VNode
} from '@motorcycle/dom';
import hold from '@most/hold';
import {cond, always, merge as mergeR, mergeAll} from 'ramda';
import {Sources, Sinks, Source} from '../../components/types';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods,
  ResetPasswordState
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
  'internal/invalid-state': 'resetPassword.invalidState',
  'validation/too-short': 'resetPassword.tooShortPassword',
  'validation/wrong-repeated-password': 'resetPassword.wrongRepeatedPassword',
  'validation/valid-password': 'resetPassword.validPassword',
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

const paramsResetPwdInit = {
  // view is disabled till code is verified
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
  resetPasswordFeedbackPhrase: 'resetPassword.verifying'
};
const paramsVerifyPasswordResetCodeOK = {
  // view is enabled <- code is verified
  isDisabled: false,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
  resetPasswordFeedbackPhrase: 'resetPassword.verifyCodeSuccessful'
};
const paramsVerifyPasswordResetCodeNOK = error => ({
  // view is disabled <- code failed verification ; display error message
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
});
const paramsConfirmPasswordResetOk = ({
  // view is disabled while logging the user in
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
  resetPasswordFeedbackPhrase: 'resetPassword.loggingIn'
});
const paramsConfirmPasswordResetNOk = error => ({
  // view is enabled so the user can try another password
  isDisabled: false,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
});
const paramsSignInWithEmailAndPasswordOK = {
  // view is disabled while the application changes screen
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
  resetPasswordFeedbackPhrase: 'resetPassword.loggedIn'
};
const paramsSignInWithEmailAndPasswordNOK = error => ({
// view is disabled while the application changes screen
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap['LoggedIn|' + error]
});
const paramsInvalidPassword = error => ({
  // view is enabled so the user can try another password
  isDisabled: false,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap[error]
});
const paramsInvalidState = {
  // view is disabled while the application changes screen
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.failed,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap['internal/invalid-state']
};
const paramsValidPassword = {
  // view is disabled while the password is being reset
  isDisabled: true,
  resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
  resetPasswordFeedbackPhrase: resetPasswordFeedbackPhraseMap['validation/valid-password']
};

function computeView(resetPasswordState: ResetPasswordState) {
  const error: any = resetPasswordState && resetPasswordState.error &&
    resetPasswordState.error.code;
  const stateEnum = resetPasswordState.stateEnum;

  const switchTable = {
    [AuthResetStateEnum.RESET_PWD_INIT]: paramsResetPwdInit,
    [AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK]: paramsVerifyPasswordResetCodeOK,
    [AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK]: paramsVerifyPasswordResetCodeNOK,
    [AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK]: paramsConfirmPasswordResetOk,
    [AuthResetStateEnum.CONFIRM_PASSWORD_RESET_NOK]: paramsConfirmPasswordResetNOk,
    [AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK]: paramsSignInWithEmailAndPasswordOK,
    [AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK]: paramsSignInWithEmailAndPasswordNOK,
    [AuthResetStateEnum.INVALID_PASSWORD]: paramsInvalidPassword,
    [AuthResetStateEnum.INVALID_STATE]: paramsInvalidState,
    [AuthResetStateEnum.VALID_PASSWORD]: paramsValidPassword,
  };
  const viewParams : Object | (any) = switchTable[stateEnum];

  switch (typeof viewParams) {
    case 'function' : return computeResetPasswordView(viewParams(error))
    case 'object' : return computeResetPasswordView(viewParams)
    default :
      throw 'ResetPasswordView.computeView : Internal error'
  }
}

export {
  computeView,
  classes
}
