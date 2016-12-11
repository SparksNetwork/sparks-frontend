# Context
On the `CONNECT_ROUTE`, the user is presented with a few options to log in to the sparks network :
- connect with google
- connect with facebook
- create an account with email and password and log in with that

On the `CONNECT_ROUTE` screen, the user sees, among other things :
   - an input `EMAIL_INPUT` email field
   - an input `PASSWORD_INPUT` password field
   - a `CREATE_ACCOUNT` button

# Functional specs
When the user clicks on `CREATE_ACCOUNT` :
 - if the email and password pass client-side validation (`EMAIL_VALIDATION_RULES`, `PWD_VALIDATION_RULES`), an API call `createUserWithEmailAndPassword` is made to firebase. That call can succeed or fail for 4 reasons (cf. https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword)
   - if call fails for `auth/email-already-in-use`, then login is attempted with a firebase API call `signInWithEmailAndPassword`. That call can fail or succeed for 4 reasons (cf. [https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword])
     - If the call fails with error `auth/invalid-email`, `auth/user-disabled`, `auth/user-not-found`, `auth/wrong-password`, the corresponding error message is displayed to the user
     - If the call succeeds, the user is logged in and redirected to the `DASHBOARD_ROUTE` route
   - if call fails for `auth/invalid-email`, `auth/operation-not-allowed`, `auth/weak-password`, the corresponding error message is displayed to the user
   - if call succeeds, the user is logged in and redirected to the `DASHBOARD_ROUTE` route
 - if the email or password fail a client-side validation rule, the corresponding error message is displayed to the user

# Properties
- `EMAIL_VALIDATION_RULES` : none, we will rely on HTML5's email input field internal validation (cf. [http://blog.gerv.net/2011/05/html5_email_address_regexp]). This will for example accept `a@b.c` inputs and reject `a.c` inputs
- `PWD_VALIDATION_RULES` : password length must be >= 6 characters (to avoid firebase weak password exception, cf. [https://firebase.google.com/docs/reference/android/com/google/firebase/auth/FirebaseAuthWeakPasswordException])
- `CONNECT_ROUTE` : `/connect`

# Technical specs
Will use a 
- firebase driver

# Pending issues
- visual error feedback to specify : visual cues, what, where, etc. (pop-over, text area, etc.)
   

