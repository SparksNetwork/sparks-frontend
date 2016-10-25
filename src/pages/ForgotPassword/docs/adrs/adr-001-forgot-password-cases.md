# ADR 1: `forgot password` feature : edge cases

## Participants
- Bruno Olivier Couriol <bcouriol@sparks.network>
- Frederik Krautwald <fkrautwald@sparks.network>
- Tylor Steinberger <tsteinberger@sparks.network>
- Stephen DeBaun <sdebaun@sparks.network>

## Status

**Proposed** | ~~Accepted~~ | ~~Depreciated~~ | ~~Superceded~~

## Context

Two decisions to be taken :
- The implementation of the `forgotPassword` feature implies some modification on the authentication driver to more accurately report authentication state. Go/No go
- Do we bother managing authentication edge cases (that is, now, can always be done later)?

Follows a description of the main and edge cases which trigger the necessity to take those decisions.

### Main cases
#### reset password code is correct
- One option is to have a new route
  + Positive part is that it is very simple to do
  - Negative part is that that route also needs to be secured (routes are global) so that duplicates some logic which is already present in the other routes
- Second option is to hide/show the modify password fields
  + this implies modifying the authentication driver which so far does not allow to track the result of operations other than logging in (`isAuthenticated` property). 

In both options, it would be necessary in that scenario to extend the auth driver to include the executed method in its return value. This would allow, while staying on the same page, or when changing page, to precisely know the state in which we stand (LOGGED_IN - already discriminated, PASSWORD_SENT, CODE_ENTERED, etc.) and reactively display the correct view.

### Edge cases
Then there are some edge cases to think about. 

#### forgotPassword
- If the user is already logged-in, and then click on the reset password email link, should we let him proceed? Is there a possibility that one user would be logged in on a computer, goes to take a coffee, a second user comes in on that same computer and clicks on the reset password link in his email, should we let him? Or should we log out the current user first? Do we even care?
- reporting of errors (authentication error codes returned by the drier). The proposed option is to associate a message to each error code in a dedicated space below the form. Success of driver call means no message displayed

#### Reset password code entry
- if the user is already logged-in... same question as before

## Decision

**PENDING**

## Consequences

**PENDING**
