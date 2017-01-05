import { NightWatchBrowser } from 'nightwatch';
import { deleteFirebaseUser, deleteIfExistsAndRecreateUser } from "../../e2e-common";

const { EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD } = process.env;

function testWrongPassword(browser: NightWatchBrowser) {
  browser
    .url('http://localhost:8080/signin')
    .waitForElementVisible('#page', 2000) // wait for the page to display
    .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
    .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD + 'dummy')
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(6000) // give it time to redirect
    .assert.urlContains('signin') // we are on the same page
    .assert.containsText('.c-textfield--errorfield', 'Wrong password')
}

function testWrongEmail(browser: NightWatchBrowser) {
  browser
    .url('http://localhost:8080/signin')
    .waitForElementVisible('#page', 2000) // wait for the page to display
    .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL + 'dummy')
    .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD)
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(6000) // give it time to redirect
    .assert.urlContains('signin') // we are on the same page
    .assert.containsText('.c-textfield--errorfield', 'Wrong email')
}

export = {
  before: deleteIfExistsAndRecreateUser(EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD),
  after: deleteFirebaseUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
  'IDENT UAT 9: Sign in with email, incorrect u/p combination': function execTest(browser: NightWatchBrowser) {
    testWrongPassword(browser);
    testWrongEmail(browser);
    browser.end();
  }
};
