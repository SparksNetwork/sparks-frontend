Feature: identity and authorization

  As a User
  I want to identify myself
  So I can be authorized to use the application

Scenario: Connect with Google
  Given I’m not connected with "Google"
   When I navigate to the connect URL
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
   When I navigate to the connect URL
    And I click the "Facebook" connect button
   Then I’m taken to "Facebook" OAuth form
   When I enter my "Facebook" email
    And I enter my "Facebook" password
    And I click the "Facebook" submit button
   Then I’m taken to my dashboard
    And I am signed in

@pending
Scenario: Connect with email and password
  Given I’m not connected with "email and password"
   When I navigate to the connect URL
    And I enter my "Connect" email
    And I enter my "Connect" password
    And I click the "Connect" submit button
   Then I’m taken to my dashboard
    And I am signed in
