import {Stream} from 'most';
import {
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../../drivers/firebase-authentication';

export type AuthenticationState = {
  method?: string | number | null,
  result?: any,
  isAuthenticated: boolean,
  authenticationError: AuthenticationError | string | null
}

// export type AuthResetState =
//   "RESET_PWD_INIT"
//     | "VERIFY_PASSWORD_RESET_CODE_OK"
//     | "VERIFY_PASSWORD_RESET_CODE_NOK"
//     | "CONFIRM_PASSWORD_RESET_OK"
//     | "CONFIRM_PASSWORD_RESET_NOK"
//     | "SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK"
//     | "SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK"
//     | "INVALID_STATE"
//     | null;
//
// export type AuthMethods =
//   "VERIFY_PASSWORD_RESET_CODE"
//     | "CONFIRM_PASSWORD_RESET"
//     | "SIGN_IN_WITH_EMAIL_AND_PASSWORD"
//     | null;

export const enum AuthResetStateEnum {
  RESET_PWD_INIT,
  VERIFY_PASSWORD_RESET_CODE_OK,
  VERIFY_PASSWORD_RESET_CODE_NOK,
  CONFIRM_PASSWORD_RESET_OK,
  CONFIRM_PASSWORD_RESET_NOK,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK,
  INVALID_STATE
}

export type AuthResetState = AuthResetStateEnum | null

export const enum AuthMethods {
  VERIFY_PASSWORD_RESET_CODE,
  CONFIRM_PASSWORD_RESET,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD
}


