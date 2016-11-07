import {MIN_PASSWORD_LENGTH, REDIRECT_DELAY} from '../pages/ResetPassword/config.properties'

const enUS = {
  'error': {
    'auth': {
      'none': '', // no errors
      'invalid-email': 'Email address is not valid! Please enter a valid' +
      ' email address.',
      'user-not-found': 'Could not find a user corresponding to the email' +
      ' address entered. Please enter the email address with which you subscribed' +
      ' to Sparks.'
    }
  },
  'none': '',
  'welcome': 'Welcome to the %{name}!',
  'submit': 'Let the form data fly!',
  'cancel': 'Recind',
  'fullName': 'Full Name',
  'emailAddress': 'Email Address',
  'phoneNumber': 'Phone Number',
  'loginGoogle': 'Login with Google',
  'login': {
    'title': 'Login',
    'email': 'Email',
    'password': 'Password',
    'forgotPassword': 'Forgot your password?',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'footer': 'Login to the Sparks.Network',
    'google': 'Login with Google',
    'facebook': 'Login with Facebook'
  },
  'forgotPassword': {
    'title': 'Please enter the email with which you subscribed to Sparks',
    'cancel': 'Cancel',
    'send': 'Send',
  },
  'resetPassword': {
    'title': 'TOD',
//    'cancel': 'Cancel',
    'verifying': 'Please wait, the reset password code is being checked upon',
    'verifyCodeSuccessful': 'Code was successfully verified',
    'verifyCodeNotSuccessful': 'Code was not successfully verified',
    'verifyCodeExpiredError': 'Thrown if the password reset code has expired.',
    'verifyCodeInvalidError': 'Thrown if the password reset code is invalid.' +
    ' This can happen if the code is malformed or has already been used.',
    'verifyCodeDisabledUserError': 'Thrown if the user corresponding to the given' +
    ' password reset code has been disabled',
    'verifyCodeUserNotFoundError': 'Thrown if there is no user corresponding to' +
    ' the password reset code. This may have happened if the user was deleted ' +
    'between when the code was issued and when this method was called.',
    'loggingIn': 'Logging you in with the new credentials',
    'resetPasswordError' : 'An error occurred while resetting your password',
    'weakPasswordError': 'Password is too weak',
    'loggedIn' : 'You have been successfully logged in',
    'invalidEmailError': 'Your password was successfully reset. Could not' +
    ' however log you in, your email seem to be invalid. Please log in' +
    ' directly through the login page',
    'wrongPasswordError' : 'Your password was successfully reset. Could not' +
    ' however log you in however (wrong password error??). Please log in' +
    ' directly through the login page',
    'userDisabledError' : 'Your password was successfully reset. Could not' +
    ' however log you in however (user disabled ??). Please log in' +
    ' directly through the login page',
    'userNotFoundError' : 'Your password was successfully reset. Could not' +
    ' however log you in however (user not found ??). Please log in' +
    ' directly through the login page',
    'invalidState': 'Application reached an invalid state while trying to' +
    ' verify the reset password code. Please return to the home page',
    'tooShortPassword': `Password is too short! Must be more than ${MIN_PASSWORD_LENGTH} characters`,
    'wrongRepeatedPassword' : 'The confirmed password does not match the' +
    ' entered password'
  },
};

export default enUS;
