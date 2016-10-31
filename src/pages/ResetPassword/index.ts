import isolate from '@cycle/isolate';
import {Stream, combine, merge as mergeM, empty, never, just} from 'most';
import {cond, complement} from 'ramda';
import {
  AuthenticationState,
  AuthResetState,
  AuthResetStateE,
  AuthMethods
} from '../types/authentication/types';
import {Switch, Case} from '../../higher-order-components/combinators/Switch';

interface PasswordResetEmailParams {
  mode: string,
  oobCode: string
}

function readRouteParams(_str): Object & any {
  let vars = {};
  // copy that string to not modify it
  const str = (' ' + _str).slice(1);

  str.replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
      return ""
    }
  );

  return vars;
}

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

// TODO : structure this with switchCase combinator, and CaseWhen combinators
// TODO : write higher level components which incorporate slots mechanism
// TODO : specifiy the view slot mechanism

// TODO : move that function in utils??
// TODO : look at https://github.com/unshiftio/url-parse as a replacement
function computeAuthenticationStateEnum(authenticationState: AuthenticationState) {
  const {method, result, authenticationError} = authenticationState;
  let authStateEnum: AuthResetState = null;

  // TODO : put all auth methods enum values in a separate file in
  // TODO : method is a string right now, will have to change to an enum
  switch (method as any) {
    // User clicked on the link and the linked opened in a new browser tab
    // (this is initial value of driver output)
    case null :
      authStateEnum = AuthResetStateE.RESET_PWD_INIT;
      break;
    case AuthMethods.VERIFY_PASSWORD_RESET_CODE :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateE.VERIFY_PASSWORD_RESET_CODE_OK;
          break;
        default :
          authStateEnum = AuthResetStateE.VERIFY_PASSWORD_RESET_CODE_NOK;
          break;
      }
      break;
    case AuthMethods.CONFIRM_PASSWORD_RESET :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateE.CONFIRM_PASSWORD_RESET_OK;
          break;
        default :
          authStateEnum = AuthResetStateE.CONFIRM_PASSWORD_RESET_NOK;
          break;
      }
      break;
    case AuthMethods.SIGN_IN_WITH_EMAIL_AND_PASSWORD :
      switch (authenticationError) {
        case null :
          authStateEnum = AuthResetStateE.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK;
          break;
        default :
          authStateEnum = AuthResetStateE.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK;
          break;
      }
      break;
    default :
      authStateEnum = AuthResetStateE.INVALID_STATE;
      break;
  }

  return authStateEnum;
}

function checkVerifyPasswordResetSourcesContracts(sources, settings) {
  return !!sources.authenticationState$
}

function throwContractError() {
  throw 'Missing authenticationState$ source!!'
}

const ResetPasswordComponentCore = Switch({
  on: (sources, settings) => {
    return sources.authenticationState$
      .map(computeAuthenticationStateEnum)
  },
  sinkNames: ['DOM', 'authentication$', 'router']
}, [
  // AUTH_INIT is the auth state where no API calls were made yet to the
  // auth driver
// TODO : do it this time with simple functions
  Case({caseWhen: AuthResetStateE.RESET_PWD_INIT}, [VerifyPasswordResetCode])
]);

const ResetPasswordComponent = cond([
  [checkVerifyPasswordResetSourcesContracts, ResetPasswordComponentCore],
  [complement(checkVerifyPasswordResetSourcesContracts), throwContractError]
]);

function VerifyPasswordResetCode(sources, settings) {
  console.warn('VerifyPasswordResetCode: settings', settings);

  return {
    DOM: never(),
    authentication$: never(),
    router: '/'
  }
}

function ResetPasswordRouteAdapter(ResetPasswordComponent) {
  return function ResetPasswordRouteAdapter(urlSegment) {
    // read the params from the string
    // @type {{mode: string, oobCode: string}} PasswordResetEmailParams
    // {mode, oobCode} = settings;
    const settings: PasswordResetEmailParams = readRouteParams(urlSegment);

    // return parameterized component
    return function ResetPasswordComponentCurried(sources) {
      if (!sources.authenticationState$) {
        throw 'Missing authenticationState$ source!!'
      }

      return isolate(ResetPasswordComponent)(sources, settings);
    }

  }
}

// TODO
const resetPasswordClasses: any = undefined

export {
  ResetPasswordComponent,
  resetPasswordClasses,
  ResetPasswordRouteAdapter,
  readRouteParams
}

// TODO : test routing and parameters passing
