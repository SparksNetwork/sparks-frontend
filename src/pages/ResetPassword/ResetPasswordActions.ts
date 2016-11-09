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
import {
  cond,
  always,
  merge as mergeR,
  mergeAll,
  equals,
  allPass,
  complement
} from 'ramda';
import {Sources, Sinks, Source} from '../../components/types';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods
} from '../types/authentication/types';
import {MIN_PASSWORD_LENGTH, REDIRECT_DELAY} from './config.properties'
import {computeView} from './ResetPasswordView'
import { DASHBOARD_ROUTE , LOGIN_ROUTE } from '../config.properties'

// Properties
// TODO : move in some properties file

// Helper functions
function comparePasswordToRepeatedPassword({enterPassword, confirmPassword}) {
  return equals(enterPassword, confirmPassword);
}

function checkMinPasswordLength({enterPassword, confirmPassword}) {
  return enterPassword.length > MIN_PASSWORD_LENGTH;
}

function computeActions({mode, oobCode, authenticationState, authResetState}, childrenSinks): any {
  const verifyCodeCommand = {
    method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
    code: oobCode
  };
  // TODO : set the following two as typescript types and make a authCommand
  // type
  const confirmPasswordResetCommand = {
    method: AuthMethods.CONFIRM_PASSWORD_RESET,
    code: oobCode,
    newPassword: undefined
  };
  const logInWithEmailPasswordCommand = {
    method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
    email: undefined,
    password: undefined
  };

  let mergedChildrenSinks: any = mergeAll(childrenSinks)
  let {DOM, resetPassword$, confirmPassword$} = mergedChildrenSinks;

  switch (authResetState as AuthResetState) {
    case AuthResetStateEnum.RESET_PWD_INIT :
      return {
        DOM: DOM,
        router: empty(),
        authentication$: just(verifyCodeCommand)
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK :
      return {
        // Update the DOM if password fails client-side validation rules
        DOM: mergeArray([
          DOM,
          checkValidationRule(resetPassword$, checkMinPasswordLength,
            'validation/too-short', AuthResetStateEnum.INVALID_PASSWORD),
          checkValidationRule(resetPassword$, comparePasswordToRepeatedPassword,
            'validation/wrong-repeated-password', AuthResetStateEnum.INVALID_PASSWORD),
          // Will trigger iff all validation rules are satisfied
          checkValidationRule(resetPassword$, complement(
            allPass([checkMinPasswordLength, comparePasswordToRepeatedPassword])
            ), 'validation/valid-password', AuthResetStateEnum.VALID_PASSWORD
          ),
        ]),
        router: empty(),
        // If password pass client-side validation rules, emit the reset
        // password command
        authentication$: resetPassword$
          .filter(allPass([checkMinPasswordLength, comparePasswordToRepeatedPassword]))
          .map(resetPassword => ({
            method: AuthMethods.CONFIRM_PASSWORD_RESET,
            code: oobCode,
            newPassword: resetPassword.enterPassword
          }))
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK:
      return {
        DOM: DOM,
        router: empty(),
        authentication$: empty()
      }
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK:
      return {
        DOM: DOM,
        router: empty(),
        authentication$: confirmPassword$.map(confirmPassword => {
          return {
            method: AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD,
            // TODO : gotten from the verify code... need to keep it in state.
            // might need a scan upstream to retain that information,
            // supposing the auth driver is a dumb API call driver. Or the
            // auth driver could hold that state logic, choice to make
            // Note that neither email nor password are kept at this point
            email: authenticationState.email,
            password: confirmPassword
          }
        })
      }
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_NOK:
      return {
        DOM: DOM,
        router: empty(),
        authentication$: empty()
      }
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK:
      return {
        DOM: DOM,
        router: just(DASHBOARD_ROUTE),
        authentication$: empty()
      }
    // TODO
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK:
      return {
        DOM: DOM,
        router: just(LOGIN_ROUTE),
        authentication$: empty()
      }
    case AuthResetStateEnum.INVALID_STATE :
    default :
      return {
        DOM: DOM,
        router: just(LOGIN_ROUTE).delay(REDIRECT_DELAY),
        authentication$: empty()
      }
  }
}

function checkValidationRule(resetPassword$, ruleFn, errorCode, authState) {
  return resetPassword$.filter(complement(ruleFn))
    .constant(
      computeView({
        authenticationState: {
          authenticationError: {
            code: errorCode
          }
        },
        authResetState: authState
      }))
}

export {
  computeActions
}
