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
import {cond, always, merge as mergeR, mergeAll} from 'ramda';
import {Sources, Sinks, Source} from '../../components/types';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods
} from '../types/authentication/types';

function computeActions({mode, oobCode, authenticationState, authResetState}, childrenSinks) {
  const verifyCodeCommand = {
    method: AuthMethods.VERIFY_PASSWORD_RESET_CODE,
    code: oobCode
  };
  // TODO : TS what type should I put there?
  let mergedChildrenSinks: any = mergeAll(childrenSinks)

  switch (authResetState as AuthResetState) {
    case AuthResetStateEnum.RESET_PWD_INIT :
      return {
        DOM: mergedChildrenSinks.DOM,
        router: empty(),
        authentication$: just(verifyCodeCommand)
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK :
      return {
        DOM: mergedChildrenSinks.DOM,
        router: empty(),
        authentication$: empty()
      }
    case AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK:
      return {
        DOM: mergedChildrenSinks.DOM,
        router: empty(),
        authentication$: empty()
      }
    // TODO
    case AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK:
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
