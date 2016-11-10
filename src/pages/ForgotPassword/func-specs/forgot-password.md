# Context
A user who is not logged in and navigates to the login screen is presented 
with various log in options.

# Specifications
- If the user has forgotten his password and wants to set a new one, it can 
click on a link:
   - which is clickable
   - which clearly indicates the purpose (reset the password)
   - which navigates on click to another screen, referred as the 
   `forgotPassword` screen
- The `forgotPassword` screen :
  - is linked to a route which when navigated to displays a view, referred as `forgotPasswordView`
- The `forgotPasswordView`
   - allows him to enter an email
   - has a submit button which triggers the sending of a 
     `resetPasswordEmail` email
   * could have a cancel button which navigates to the login screen
   * could warn the user in case of wrongly formatted email
   * could warn the user in case he is already logged in. No further action 
   beyond the warning should be taken.
   * must warn the user in case of any error occurring while trying to send the `resetPasswordEmail` (invalid email, user not found, etc.)
- The email format must be written according to a template which reflects:
   - some positive message in line with the company culture
   - some legal messages, footnotes etc. wherever apply
   - a link :
     - within the spark domain
     - with a `resetPasswordCode` code that will be used to check upon the 
     user identity


# Pending issues
- email template specification
- TECHNICAL : user repository configuration - firebase database needs to be configured :
  - link format
  - email template
- english version of feedback messages for the `sendCodeByEmailFeedback`.
- visual design
