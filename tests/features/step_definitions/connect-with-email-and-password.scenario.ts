import { emails, pages, passwords } from '../common/identity-and-authorization';
import { deleteFirebaseUser as deleteUser } from '../common';

const provider = 'email and password';

export function connectWithEmailAndPassword(context: any) {
  context.Given('I’m not connected with "email and password"',
    function (done: Function) {
      deleteUser(emails[provider], done);
    });

  context.When('I navigate to the {route:stringInDoubleQuotes} URL', function (route: string) {
    pages(context)[route]
      .navigate()
      .waitForElementVisible('@page');
  });

  context.When('I enter my {route:stringInDoubleQuotes} email', function (route: string) {
    pages(context)[route]
      .setValue('@firebaseEmailField', emails[provider]);
  });

  context.When('I enter my {route:stringInDoubleQuotes} password', function (route: string) {
    pages(context)[route]
      .setValue('@firebasePasswordField', passwords[provider]);
  });

  context.When('I click the {provider:stringInDoubleQuotes} submit button',
    function (provider: string) {
      pages(context)[provider]
        .click('@firebaseSubmitButton');
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

// TODO : switch-to-a-from-b : not executed? finished strangely, check original code in feat branch
// TODO : cf I am here and finish from the feature file for that scenario the test
