import { connectElements, emails, pages, passwords } from '../common/identity-and-authorization';

import { deleteUser } from '../common';

export = function () {

  this.Given('I’m not connected with {provider:stringInDoubleQuotes}',
    function (provider: string, done: Function) {
      deleteUser(emails[provider], done);
    });

  this.When('I navigate to the {route:stringInDoubleQuotes} URL', function (route: string) {
    pages(this)[route]
      .navigate()
      .waitForElementVisible('@page');
  });

  this.When('I click the {button:stringInDoubleQuotes} connect button', function (button: string) {
    const connect: any = this.page.connect();

    connect
      .click(connectElements[button]);
  });

  this.Then('I’m taken to {provider:stringInDoubleQuotes} OAuth form', function (provider: string) {
    pages(this)[provider]
      .waitForElementPresent('@emailField');
  });

  this.When('I enter my {provider:stringInDoubleQuotes} email', function (provider: string) {
    pages(this)[provider]
      .setValue('@emailField', emails[provider]);
  });

  this.When('I click the Next button', function () {
    const googleOauth: any = this.page.googleOauth();

    googleOauth
      .click('@nextButton');
  });

  this.When('I enter my {provider:stringInDoubleQuotes} password', function (provider: string) {
    pages(this)[provider]
      .waitForElementPresent('@passwordField')
      .setValue('@passwordField', passwords[provider]);
  });

  this.When('I click the {provider:stringInDoubleQuotes} submit button',
    function (provider: string) {
      pages(this)[provider]
        .click('@submitButton');
    });

  this.Then('I’m taken to my dashboard', function () {
    const dashboard: any = this.page.dashboard();

    dashboard
      .waitForElementPresent('@page');
  });

  this.Then('I am signed in', function () {
    const dashboard: any = this.page.dashboard();

    dashboard
      .waitForElementPresent('@userEmail');

    this.end();
  });

  this.Given('I’m not signed in', function (done: Function) {
    // As a new browser window will be opened,
    // the User will automatically not be signed in.
    done(null);
  });

  this.When('I click the sign-in link', function () {
    const connect: any = this.page.connect();

    connect
      .click('@signInLink');
  });

  this.Then('I’m taken to the {route:stringInDoubleQuotes} URL', function (route: string) {
    pages(this)[route]
      .waitForElementPresent('@page');
  });

}
