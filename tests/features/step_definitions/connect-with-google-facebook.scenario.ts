import { connectElements, emails, pages, passwords } from '../common/identity-and-authorization';

import { deleteUser } from '../common';

export function connectWithGoogleOrFacebook(context : any) {
  context.Given('I’m not connected with {provider:stringInDoubleQuotes}',
    function (provider: string, done: Function) {
      deleteUser(emails[provider], done);
    });

  context.When('I navigate to the {route:stringInDoubleQuotes} URL', function (route: string) {
    pages(context)[route]
      .navigate()
      .waitForElementVisible('@page');
  });

  context.When('I click the {button:stringInDoubleQuotes} connect button', function (button: string) {
    const connect: any = context.page.connect();

    connect
      .click(connectElements[button]);
  });

  context.Then('I’m taken to {provider:stringInDoubleQuotes} OAuth form', function (provider: string) {
    pages(context)[provider]
      .waitForElementPresent('@emailField');
  });

  context.When('I enter my {provider:stringInDoubleQuotes} email', function (provider: string) {
    pages(context)[provider]
      .setValue('@emailField', emails[provider]);
  });

  context.When('I click the Next button', function () {
    const googleOauth: any = context.page.googleOauth();

    googleOauth
      .click('@nextButton');
  });

  context.When('I enter my {provider:stringInDoubleQuotes} password', function (provider: string) {
    pages(context)[provider]
      .waitForElementPresent('@passwordField')
      .setValue('@passwordField', passwords[provider]);
  });

  context.When('I click the {provider:stringInDoubleQuotes} submit button',
    function (provider: string) {
      pages(context)[provider]
        .click('@submitButton');
    });

  context.Then('I’m taken to my dashboard', function () {
    const dashboard: any = context.page.dashboard();

    dashboard
      .waitForElementPresent('@page');
  });

  context.Then('I am signed in', function () {
    const dashboard: any = context.page.dashboard();

    dashboard
      .waitForElementPresent('@userEmail');
  });

  context.end();
}
