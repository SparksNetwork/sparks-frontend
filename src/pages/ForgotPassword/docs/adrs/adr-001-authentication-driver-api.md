# ADR 1: `forgot password` feature : impact on authentication driver APIs

## Participants
- Bruno Olivier Couriol <bcouriol@sparks.network>
- Frederik Krautwald <fkrautwald@sparks.network>
- Tylor Steinberger <tsteinberger@sparks.network>
- Stephen DeBaun <sdebaun@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

The current version of the authentication driver only addresses concerns 
originating from the login screen, i.e. is specialized.
```
  error: AuthenticationError | null;
  userCredential: firebase.auth.UserCredential;
```
 
The proposed implementation of the `forgotPassword` feature requires changes 
in the authentication driver API to make it more generic to fit larger 
purposes. The authentication driver takes commands as input and returns the result of executing the commands. The necessary changes correspond to :
 
 - new commands which need to be executed
 - the necessity to get the result of these commands
 
## Proposed modifications
The proposed structure for drivers output is :
```
// Reminder, inputs to the driver are similar to :
// type AuthDriverRequest = {
//   method: string | number | null,
//   any extra data fields required by the API to execute
// }

type AuthDriverResponse = {
  method: string | number | null,
  result: any,
  authenticationError: AuthenticationError | null
}
```

The `method` property could be a string, or a number (enum) according to :

```
const enum AuthMethods {
  VERIFY_PASSWORD_RESET_CODE,
  CONFIRM_PASSWORD_RESET,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD,
  GET_REDIRECT_RESULT,
  SIGN_IN_WITH_REDIRECT,
  SIGN_IN_WITH_POPUP,
  // + any other relevant methods relevant to other screens
}
```

The `result` property could left unspecified (`any`) or be a union types of the different values returned by the API calls, i.e. :
```
// - void
// - firebase.auth.ActionCodeInfo
// - firebase.User 
// - Array of string 
// - firebase.auth.UserCredential 
// - non-null function()
// - string
```

## Pros/Cons
### Pros
- Auth drivers have only one concern which is executing authentication 
commands and passing on their results
- using enumeration types prevent bugs from spelling mistakes when typing 
command strings
- Login information (user credentials etc.) can be easily separately derived 
from the result of the corresponding API call

### Cons
- fill in the blanks folks

## Decision
PENDING

## Consequences
PENDING
