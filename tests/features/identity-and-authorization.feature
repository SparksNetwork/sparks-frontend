Feature: identity and authorization

  As a User
  I want to identify myself
  So I can be authorized to use the application

Scenario: Connect with Google
  Given I’m not connected with Google
   When I navigate to the connect URL
    And I click Connect with Google
   Then I’m taken to Google OAuth form
   When I enter my email
    And I click Next
    And I enter my password
    And I click Sign in
   Then I’m taken to the dashboard
    And I am signed in
