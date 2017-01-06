import { pages } from '../common/identity-and-authorization';

export function switchToAFromB(context : any) {
  context.Given('I’m not signed in', function (done: Function) {
    // As a new browser window will be opened,
    // the User will automatically not be signed in.
    done(null);
  });

  context.When('I click the sign-in link', function () {
    const connect: any = context.page.connect();

    connect
      .click('@signInLink');
  });

  context.Then('I’m taken to the {route:stringInDoubleQuotes} URL', function (route: string) {
    pages(context)[route]
      .waitForElementPresent('@page');
  });

  context.When('I click the connect link', function () {
    const signIn: any = context.page.signIn();

    signIn
      .click('@connectLink');
  });

}
