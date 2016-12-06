# Context
A user received an email with a link which allows him to reset its password. That link encodes various pieces of information including `resetPasswordCode`, which is a code that allows to match to the user email. Cf. [forgot-password] specifications.

# Specifications
- On navigating to the link :
  - the user is presented with a `resetPasswordView` view which:
    - includes a field to enter its new password
    - includes a field to repeat its new password for confirmation
    - includes a submit/reset button
    - displays any relevant information to the user, in function of the state of the password reset operation and the user actions. We referred to this functionality as `resetPasswordFeedback`.

- The password resetting occurs in three stages:
  1. The code is checked against the user database
  2. A reset password request is issued to the user repository
  3. The user is logged-in automatically and redirected to `postLogIn`
  route

- Each stage can be comprised of one or several operations which might fail or succeed. The `resetPasswordFeedback` area should informed the user of the latest information of relevance on the operations in process.

- If the password reset code could not be verified, the applications 
navigates to the `forgotPassword` screen

- The corresponding state machine is described in [here](./reset-password-fsm-detailed.pdf)

- The visual design details are left unspecified and should follow the general design rules in vigor for the project :
  - error messages in popups? in text at the bottom of the form?

# Pending issues
- english version of feedback messages for the `resetPasswordFeedback`.
- visual design
  - layout
  - behaviours : 
    - error feedback to user
    - when navigating to another page (in case of unrecoverable error), ok to do message + delay + navigation?
- `postLogIn` route to specify
- TECHNICAL : firebase repository has to be configured (email template and email link format)
