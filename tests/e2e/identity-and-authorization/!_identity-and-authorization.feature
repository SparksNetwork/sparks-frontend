Feature: identity and authorization
  As a User
  I want to identify myself
  So I can be authorized to use the application

Scenario: Connect with Google
  Given the User isn’t connected
   When the User navigates to the "connect" URL
    And clicks the "Connect with Google" button
   Then the User is taken to Google OAuth form
   When the User enters GOOGLE_TEST_EMAIL
    And enters GOOGLE_TEST_EMAIL_PASSWORD
    And submits the form
   Then the User is taken to the "dashboard" URL
    And the User GOOGLE_TEST_EMAIL is visible

Scenario: Connect with Facebook
  Given the User isn’t connected
   When the User navigates to the "connect" URL
    And clicks the "Connect with Facebook" button
   Then the User is taken to Facebook OAuth form
   When the User enters FACEBOOK_TEST_EMAIL
    And enters FACEBOOK_TEST_EMAIL_PASSWORD
    And submits the form
   Then the User is taken to the "dashboard" URL
    And the User FACEBOOK_TEST_EMAIL is visible

Scenario: Connect with email
  Given the User isn’t connected
   When the User navigates to the connect URL
    And enters EMAIL_AND_PASSWORD_TEST_EMAIL
    And enters EMAIL_AND_PASSWORD_TEST_PASSWORD
    And clicks the "Connect" button
   Then the User is taken to the "dashboard" URL
    And the User EMAIL_AND_PASSWORD_TEST_EMAIL is visible

Scenario: Connect with existing email
  Given the User is connected with EMAIL_AND_PASSWORD_TEST_EMAIL
   When the User navigates to the "connect" URL
    And enters EMAIL_AND_PASSWORD_TEST_EMAIL
    And enters EMAIL_AND_PASSWORD_TEST_PASSWORD
    And clicks the "Connect" button
   Then the User is taken to the "dashboard" URL
    And the User EMAIL_AND_PASSWORD_TEST_EMAIL is visible

Scenario: Connect with existing email using wrong password
  Given the User is connected with EMAIL_AND_PASSWORD_TEST_EMAIL
   When the User navigates to the "connect" URL
    And enters EMAIL_AND_PASSWORD_TEST_EMAIL
    And enters a wrong password
    And clicks the "Connect" button
   Then error message "There already exists an account for EMAIL_AND_PASSWORD_TEST_EMAIL" is visible

Scenario: Missing fields connecting with email
  Given the User isn’t connected
   When the User navigates to the "connect" URL
    And enters EMAIL_AND_PASSWORD_TEST_EMAIL
    And clicks the "Connect" button
   Then error message "Password is required" is visible

Scenario: Switch to "sign-in" URL
  Given the User isn’t signed in
   When the User navigates to the "connect" URL
    And clicks the "I’m already connected" link
   Then the User is taken to the "sign in" URL

Scenario: Switch to "connect" URL
  Given the User isn’t signed in
   When the User navigates to the "sign-in" URL
    And clicks the "connect" link
   Then the User is taken to the "connect" URL

Scenario: Sign in with Google
  Given the User is connected with GOOGLE_TEST_EMAIL
    And isn’t signed in
   When the User navigates to the "sign-in" URL
    And clicks the "Sign in with Google" button
   Then the User is taken to Google OAuth form
   When the User enters GOOGLE_TEST_EMAIL
    And enters GOOGLE_TEST_EMAIL_PASSWORD
    And submits the form
   Then the User is taken to the "dashboard" URL
    And the User GOOGLE_TEST_EMAIL is visible

Scenario: Sign in with Facebook
  Given the User is connected with FACEBOOK_TEST_EMAIL
    And isn’t signed in
   When the User navigates to the "sign-in" URL
    And clicks the "Sign in with Facebook" button
   Then the User is taken to Facebook OAuth form
   When the User enters FACEBOOK_TEST_EMAIL
    And enters FACEBOOK_TEST_EMAIL_PASSWORD
    And submits the form
   Then the User is taken to the "dashboard" URL
    And the User FACEBOOK_TEST_EMAIL is visible
