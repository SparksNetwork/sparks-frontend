import { NightWatchBrowser } from 'nightwatch';
import { deleteFirebaseUser, deleteIfExistsAndRecreateUser } from "../../e2e-common";

const { EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD } = process.env;

export = {
  before: deleteIfExistsAndRecreateUser(EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD),
  after: deleteFirebaseUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
  'IDENT UAT 7: Sign in with email from Connect': function (browser: NightWatchBrowser) {
    browser
      .url('http://localhost:8080/signin')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
      .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD)
      .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
      .pause(6000) // give it time to redirect
      .assert.urlContains('dash') // we are on the dashboard page
      .end();
  },
};
