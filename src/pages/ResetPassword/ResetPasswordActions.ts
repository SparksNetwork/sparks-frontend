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

// Properties
// TODO : move in some properties file
const MIN_PASSWORD_LENGTH = 6;

// Helper functions
function comparePasswordToRepeatedPassword({enterPassword, confirmPassword}) {
  return equals(enterPassword, confirmPassword);
}

function checkMinPasswordLenth({enterPassword, confirmPassword}) {
  return enterPassword.length > MIN_PASSWORD_LENGTH;
}

const validatePassword = allPass([
  checkMinPasswordLenth,
  comparePasswordToRepeatedPassword
])

function computeActions({mode, oobCode, authenticationState, authResetState}, childrenSinks): any {
  const verifyCodeCommand = {
    method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
    code: oobCode
  };
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
        DOM: mergedChildrenSinks.DOM,
        router: empty(),
        authentication$: just(verifyCodeCommand)
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK :
      return {
        // TODO : update the DOM in the right place if fails validation
        DOM: mergeArray([
          DOM,
          DOM.sampleWith(
            resetPassword$.filter(complement(validatePassword))
          )
            .map(x => x) // TODO : addErrorMessageToDOM
        ]),
        router: empty(),
        authentication$: mergedChildrenSinks.resetPassword$
          .filter(validatePassword)
          .map(resetPassword => ({
            method: AuthMethods.CONFIRM_PASSWORD_RESET,
            code: oobCode,
            newPassword: resetPassword.enterPassword
          }))
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK:
      return {
        DOM: mergedChildrenSinks.DOM,
        router: empty(),
        authentication$: empty()
      }
    // TODO
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK:
      return {
        DOM: mergedChildrenSinks.DOM,
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
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK:
    case AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK:
    case AuthResetStateEnum.INVALID_STATE :
    default :
      break;
  }

  throw 'should never reach that place'
}

export {
  computeActions
}
