Feature: identity and authorization

  As a User
  I want to identify myself
  So I can be authorized to use the application

@noci
Scenario: Connect with Google
  Given I’m not connected with "Google"
   When I navigate to the "Connect" URL
    And I click the "Google" connect button
   Then I’m taken to "Google" OAuth form
   When I enter my "Google" email
    And I click the Next button
    And I enter my "Google" password
    And I click the "Google" submit button
   Then I’m taken to my dashboard
    And I am signed in

Scenario: Connect with Facebook
  Given I’m not connected with "Facebook"
   When I navigate to the "Connect" URL
    And I click the "Facebook" connect button
   Then I’m taken to "Facebook" OAuth form
   When I enter my "Facebook" email
    And I enter my "Facebook" password
    And I click the "Facebook" submit button
   Then I’m taken to my dashboard
    And I am signed in

@wip @noci
Scenario: Connect with email and password
  Given I’m not connected with "email and password"
   When I navigate to the "Connect" URL
    And I enter my "Connect" email
    And I enter my "Connect" password
    And I click the "Connect" submit button
   Then I’m taken to my dashboard
    And I am signed in

@wip @noci
Scenario: Connect with existing email and password
  Given I’m already connected with "email and password"
   When I navigate to the "Connect" URL
    And I enter my "Connect" email
    And I enter my "Connect" password
    And I click the "Connect" submit button
   Then I’m taken to my dashboard
    And I am signed in

@wip @noci
Scenario: Connect with existing email using wrong password
  Given I’m already connected with "email and password"
   When I navigate to the "Connect" URL
    And I enter my "Connect" email
    And I enter a wrong password
    And I click the "Connect" submit button
   Then I see username-is-taken error message

@wip @noci
Scenario: Missing email connecting with email and password
  Given I’m not connected with "email and password"
   When I navigate to the "Connect" URL
    And I enter my "Connect" password
    And I click the "Connect" submit button
   Then I see missing-email error message

@wip @noci
Scenario: Missing password connecting with email and password
  Given I’m not connected with "email and password"
   When I navigate to the "Connect" URL
    And I enter my "Connect" email
    And I click the "Connect" submit button
   Then I see missing-password error message

Scenario: Switch to sign-in from connect
  Given I’m not signed in
   When I navigate to the "Connect" URL
    And I click the sign-in link
   Then I’m taken to the "Sign-in" URL

Scenario: Switch to connect from sign-in
  Given I’m not signed in
   When I navigate to the "Sign-in" URL
    And I click the connect link
   Then I’m taken to the "Connect" URL

@wip @noci
Scenario: Sign in with Google
  Given I’m connected with "Google"
    And I’m not signed in
   When I navigate to the "Sign-in" URL
    And I click the "Google" sign-in button
   Then I’m taken to "Google" OAuth form
   When I enter my "Google" email
    And I click the Next button
    And I enter my "Google" password
    And I click the "Google" submit button
   Then I’m taken to my dashboard
    And I am signed in

@wip @noci
Scenario: Sign in with Facebook
  Given I’m connected with "Facebook"
    And I’m not signed in
   When I navigate to the "Sign-in" URL
    And I click the "Facebook" sign-in button
   Then I’m taken to "Facebook" OAuth form
   When I enter my "Facebook" email
    And I enter my "Facebook" password
    And I click the "Facebook" submit button
   Then I’m taken to my dashboard
    And I am signed in

Scenario: Spanish sign-in
  Given My browser language is "Spanish"
    And I’m not signed in
   When I navigate to the "Sign-in" URL
   Then the title is in "Spanish"
    And the "Google button" is in "Spanish"
    And the "Facebook button" is in "Spanish"
    And the "Email label" is in "Spanish"
    And the "Password label" is in "Spanish"
    And the "Forgot password link" is in "Spanish"
    And the "Sign-in button" is in "Spanish"
    And the "Connect link" is in "Spanish"

Scenario: American English sign-in
  Given My browser language is "American English"
    And I’m not signed in
   When I navigate to the "Sign-in" URL
   Then the title is in "American English"
    And the "Google button" is in "American English"
    And the "Facebook button" is in "American English"
    And the "Email label" is in "American English"
    And the "Password label" is in "American English"
    And the "Forgot password link" is in "American English"
    And the "Sign-in button" is in "American English"
    And the "Connect link" is in "American English"
