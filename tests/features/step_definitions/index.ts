import {
  connectElements,
  emails,
  pages,
  passwords,
  errors,
  errorFieldMap,
  errorMessageMap,
} from '../common/identity-and-authorization';
import { deleteUser, deleteIfExistsAndRecreateUser } from '../common';

export = function test() {
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

  this.When('I click the connect link', function () {
    const signIn: any = this.page.signIn();

    signIn
      .click('@connectLink');
  });

  this.Given('I’m already connected with {provider:stringInDoubleQuotes}',
    function (provider: string, done: Function) {
      deleteIfExistsAndRecreateUser(emails[provider], passwords[provider], done);
    });

  this.When('On the same {route:stringInDoubleQuotes} URL, I enter a wrong password',
    function (provider: string) {
      pages(this)[provider]
        .waitForElementPresent('@passwordField')
        .setValue('@passwordField', passwords[provider] + 'dummy');
    });

  this.Then('On the same {route:stringInDoubleQuotes} URL, I see {error:stringInDoubleQuotes}' +
    ' error message',
    function (route: string, error : string) {
      pages(this)[route]
        .waitForElementPresent('@errorField')
        .assert.containsText('@errorField', errors[errorMessageMap[error]]);

      this.end();
    });

  this.Then('On the same {route:stringInDoubleQuotes} URL, browser displays' +
    ' {error:stringInDoubleQuotes} error message',
    function (route: string, error: string) {
      console.log('error', error, route)

      pages(this)[route]
        .waitForElementPresent(errorFieldMap[error])
        .assert.containsText(errorFieldMap[error], '');

      this.end();
    });

  this.When('On the same {route:stringInDoubleQuotes} URL, I enter a wrong email',
    function (provider: string) {
      pages(this)[provider]
        .waitForElementPresent('@emailField')
        .setValue('@emailField', emails[provider] + 'dummy');
    });

}
