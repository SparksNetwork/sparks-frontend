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
import {equals, cond, always, merge as mergeR, mergeAll} from 'ramda';
import {Sources, Sinks, Source} from '../../components/types';
import {
  AuthenticationState, AuthResetState, AuthResetStateEnum, AuthMethods
} from '../types/authentication/types';
import {readRouteParams} from '../../utils';
import {Switch, Case} from '../../higher-order-components/combinators/Switch';
import {computeIntents} from './ResetPasswordIntents'
import {computeView, classes as resetPasswordClasses} from './ResetPasswordView'
import {computeActions} from './ResetPasswordActions'

interface PasswordResetEmailParams {
  mode: string,
  oobCode: string
}

const orElse = always(true);

// TODO
// authState {authenticationMethod, authenticationResult, authenticationError}:
// 0. whatever state, if user already logged in, deal with that on top of
// the specifics of that state.
// 1. {null, _, _} : not logged-in and no auth method ever executed
// 3. {verifyPasswordResetCode, _, null} : correct code
// 4. {verifyPasswordResetCode, _, error} : bad code
//  error :
//   - 4.1 auth/expired-action-code : Thrown if the password reset code has
//         expired.
//   - 4.2 auth/invalid-action-code : Thrown if the password reset code is
//   -     invalid. This can happen if the code is malformed or has already been
//         used.
//   - 4.3 auth/user-disabled : Thrown if the user corresponding to the given
//         password reset code has been disabled.
//   - 4.4 auth/user-not-found
//         Thrown if there is no user corresponding to the password reset code.
//         This may have happened if the user was deleted between when the code
//         was issued and when this method was called.
// 5. {confirmPasswordReset, _, null) : password reset
// 6. {confirmPasswordReset, _, error) :
// 6.1 auth/expired-action-code : Thrown if the password reset code has expired.
// 6.2 auth/invalid-action-code : Thrown if the password reset code is
// invalid. This can happen if the code is malformed or has already been used.
// 6.3 auth/user-disabled : Thrown if the user corresponding to the given
// password reset code has been disabled.
// 6.4 auth/user-not-found
// Thrown if there is no user corresponding to the password reset code.
// This may have happened if the user was deleted between when the code
// was issued and when this method was called.
// 6.5 auth/weak-password
// Thrown if the new password is not strong enough.
// 7. {signInWithEmailAndPassword, _, null} : correct sign-in
// 8. {signInWithEmailAndPassword, _, error} : incorrect sign-in
// 8.1 auth/invalid-email
// Thrown if the email address is not valid.
// 8.2 auth/user-disabled
// Thrown if the user corresponding to the given email has been disabled.
// 8.3 auth/user-not-found
// Thrown if there is no user corresponding to the given email.
// 8.4 auth/wrong-password
// Thrown if the password is invalid for the given email, or the account
// corresponding to the email does not have a password set.
// X. {sendPasswordResetEmail, _, _} : invalid state
// X2. {LogIn, success, _} : logged in successfully THERE IS NO 2!!! if log
// in with facebook/twittergoogle or else, makes no sense to change the password

// 1. User clicked on the link and the linked opened in a new browser tab
// View :
// - 2 password fields : Enter new pwd, Confirm new pwd
// - 1 button : submit
// - 1 feedback div : nothing WITH A IDENTIFIABLE SLOT
// - DOM :
//   - disabled fields, and div message : 'verifying code'
// Intent :
// - submit button
// Action <- Intent :
// - authenticationDriver :
//   - STARTSWITH : {method: verifyPasswordResetCode, code}
// 2. User is already logged-in
// View : cf. 1.
// Intent : cf. 1
// Action :
// - DOM :
//   - add warning message 'user already logged in' + 'verifying code'
// 3, Code vas successfully verified
// View :
// - STARTS WITH:
// - enable password fields
// - empty feedback div
// - feedback message slot
// Intent :
// - submit button
// Action <- Intent :
// - DOM :
//   - bad password : 'Password must be min. 6 characters' or else
//   - !! must be added to the current DOM sink in the corresponding slot...
//   - !! or rewritten here with two slots and two children and a combinator
//   - on INTENT.SUBMIT : replace feedback message in SLOT: 'changing password'
// - authenticationDriver :
//   - ON INTENT.SUBMIT : {method: 'confirmPasswordReset', code, newPassword}
// 4. Reset code verification failed
// View :
// STARTS WITH:
// - disable password fields, everything
// - add feedback message as f(error code)
// Intent :
// - none
// Action :
// - none
// 5. Password is successfully reset
// View :
// - disable pwd fields
// - feedback message : password successfully reset, logging you in
// Intents:
// - none
// Actions :
// - authenticationDriver :
//   - {method: 'signInWithEmailAndPassword', email, password}
// 6. Password could not be reset
// View :
// - enable pwd fields only if error code is `auth/weak-password`
// - disable otherwise
// - feedback message : f(error code)
// Intents :
// - submit button (note: will be disabled if not weak-password)
// Actions :
// - authenticationDriver :
//   - ON INTENT.SUBMIT : {method: 'confirmPasswordReset', code, newPassword}
// - DOM : cf. 3
//   - bad password : 'Password must be min. 6 characters' or else
//   - !! must be added to the current DOM sink in the corresponding slot...
//   - !! or rewritten here with two slots and two children and a combinator
//   - on INTENT.SUBMIT : replace feedback message in SLOT: 'changing password'
// 7. User successfully signed in with email and password
// - View :
//   - disable pwd fields
//   - display feedback message : you are logged in
// Intents :
// - none
// Actions :
// - route driver
//   - navigate to home page '/'
// 8. User could not be signed in : should not happened
// - View :
//   - disable password fields
//   - feedback message : user could not be logged in
// - Intents:
//   - none
// - Actions :
//   - none
// X.Else. {sendPasswordResetEmail || _, _, _} : invalid state
// - View :
//   - disable fields and everything
//   - feedback message : the application entered an invalid state, contact
// sparks
// - Intents :
//   - none
// - Actions :
//   - none

// TODO : write higher level components which incorporate slots mechanism
// TODO : specifiy the view slot mechanism

function computeAuthenticationStateEnum(authenticationState: AuthenticationState) {
  const {method, result, authenticationError} = authenticationState;
  let authStateEnum: AuthResetState = null;

  // TODO : put all auth methods enum values in a separate file in
  // TODO : method is a string right now, will have to change to an enum
  switch (method as any) {
    // User clicked on the link and the linked opened in a new browser tab
    // (this is initial value of driver output)
    case null :
      authStateEnum = AuthResetStateEnum.RESET_PWD_INIT;
      break;
    case AuthMethods.VERIFY_PASSWORD_RESET_CODE :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK;
          break;
        default :
          authStateEnum = AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK;
          break;
      }
      break;
    case AuthMethods.CONFIRM_PASSWORD_RESET :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK;
          break;
        default :
          authStateEnum = AuthResetStateEnum.CONFIRM_PASSWORD_RESET_NOK;
          break;
      }
      break;
    case AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK;
          break;
        default :
          authStateEnum = AuthResetStateEnum.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK;
          break;
      }
      break;
    default :
      authStateEnum = AuthResetStateEnum.INVALID_STATE;
      break;
  }

  return authStateEnum;
}

function checkSourcesContracts(sources, settings) {
  return !!sources.authenticationState$
}

function throwContractError() {
  throw 'Missing authenticationState$ source!!'
}

const ResetPasswordComponentCore = Switch({
  on: 'authenticationState$',
  eqFn : (a, b) => {
    const isEqual = equals(computeAuthenticationStateEnum(b), a)
    return isEqual
  },
  sinkNames: ['DOM', 'authentication$', 'router'],
}, [
  // AUTH_INIT is the auth state where no API calls were made yet to the
  // auth driver
  Case({caseWhen: AuthResetStateEnum.RESET_PWD_INIT}, [VerifyPasswordResetCode]),
  Case({caseWhen: AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_OK}, [ResetPassword]),
  Case({caseWhen: AuthResetStateEnum.VERIFY_PASSWORD_RESET_CODE_NOK}, [WarnFailedCodeVerification]),
  Case({caseWhen: AuthResetStateEnum.CONFIRM_PASSWORD_RESET_OK}, [SignInWithEmailPassword]),
  // TODO
]);

const ResetPasswordComponent = cond([
  [checkSourcesContracts, ResetPasswordComponentCore],
  [orElse, throwContractError]
]);

function VerifyPasswordResetCode(sources, settings) {
  // NOTE : `matched` is added by the Case higher-order component
  // and is the value streamed by the source on which the `Switch` acts
  // It is important to have it available here as it cannot be retrieved
  // from the source anymore, as it has already been emitted
  const {mode, oobCode, matched} = settings;
  console.warn('VerifyPasswordResetCode: settings', settings);

  const state = {
    authenticationState: matched,
    authResetState: computeAuthenticationStateEnum(matched)
  };

  const viewSinks = computeView(state);
  const intentsSinks = computeIntents(sources);
  const actionSinks = computeActions(mergeR(settings, state), [
    viewSinks,
    intentsSinks
  ]);

  return actionSinks;
}

function ResetPassword(sources, settings){
  const {mode, oobCode, matched} = settings;
  console.warn('VerifyPasswordResetCode: settings', settings);

  const state = {
    authenticationState: matched,
    authResetState: computeAuthenticationStateEnum(matched)
  };

  const viewSinks = computeView(state);
  const intentsSinks = computeIntents(sources);
  const actionSinks = computeActions(mergeR(settings, state), [
    viewSinks,
    intentsSinks
  ]);

  return actionSinks;
}

function WarnFailedCodeVerification(sources, settings) {
  const {mode, oobCode, matched} = settings;
  console.warn('WarnFailedCodeVerification: settings', settings);

  const state = {
    authenticationState: matched,
    authResetState: computeAuthenticationStateEnum(matched)
  };

  const viewSinks = computeView(state);
  const intentsSinks = computeIntents(sources);
  const actionSinks = computeActions(mergeR(settings, state), [
    viewSinks,
    intentsSinks
  ]);

  return actionSinks;
}

function SignInWithEmailPassword(sources, settings) {
  const {mode, oobCode, matched} = settings;
  console.warn('SignInWithEmailPassword: settings', settings);

  const state = {
    authenticationState: matched,
    authResetState: computeAuthenticationStateEnum(matched)
  };

  const viewSinks = computeView(state);
  const intentsSinks = computeIntents(sources);
  // TODO : I am here
  const actionSinks = computeActions(mergeR(settings, state), [
    viewSinks,
    intentsSinks
  ]);

  return actionSinks;
}

function ResetPasswordRouteAdapter(ResetPasswordComponent) {
  return function ResetPasswordRouteAdapter(urlSegment) {
    // read the params from the string
    // @type {{mode: string, oobCode: string}} PasswordResetEmailParams
    // {mode, oobCode} = settings;
    const settings: PasswordResetEmailParams = readRouteParams(urlSegment);

    // return parameterized component
    return function ResetPasswordComponentCurried(sources) {
      // TODO : might have to change isolate so it also uses settings
      return isolate(ResetPasswordComponent)(sources, settings);
    }

  }
}

export {
  ResetPasswordComponent,
  resetPasswordClasses,
  ResetPasswordRouteAdapter,
  readRouteParams
}

// TODO : test routing and parameters passing
