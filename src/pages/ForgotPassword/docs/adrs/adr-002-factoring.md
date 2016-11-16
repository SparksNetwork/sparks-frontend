# ADR 2: factoring for forgot and reset password screen

## Participants
- Bruno Olivier Couriol <bcouriol@sparks.network>
- Frederik Krautwald <fkrautwald@sparks.network>
- Tylor Steinberger <tsteinberger@sparks.network>
- Stephen DeBaun <sdebaun@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context
Reminder : the proposed specification for the auth drivers can be found in `[adr-001]`.  

From the auth driver output, a 'state' object is computed to 
address the forgot and reset password screens concerns :

```
type ResetPasswordState = {
  stateEnum: AuthResetStateEnum,
  error : AuthenticationError | null, // in fact {code, message}
  email : string | null
}
const enum AuthResetStateEnum {
  RESET_PWD_INIT,
  VERIFY_PASSWORD_RESET_CODE_OK,
  VERIFY_PASSWORD_RESET_CODE_NOK,
  CONFIRM_PASSWORD_RESET_OK,
  CONFIRM_PASSWORD_RESET_NOK,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK,
  SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK,
  INVALID_STATE,
  INVALID_PASSWORD,
  VALID_PASSWORD
}
```

NOTE : it is necessary to hold track of the email here which is returned by the code verification API call, as it will be a necessary input to the login at a later point.

The proposition is to adopt that factoring in other cases. The factoring is the following :

- events/behaviours coming from the drivers
- on each screen, the 'local' state, i.e. the data derived from those drivers is computed after applying the router, and as a behavior
