import { NightWatchBrowser } from 'nightwatch';

const {EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD} = process.env;

function testMissingEmailField(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/signin')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', '')
    .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD)
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(100) // give it time
    .assert.urlContains('signin') // we are on same route
    .assert.containsText('.c-textfield__input--email:invalid', '');
}

function testMissingPasswordField(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/signin')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
    .setValue('.c-textfield__input--password', '')
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(100) // give it time to redirect
    .assert.urlContains('signin') // we are on same route
    .assert.containsText('.c-textfield__input--password:invalid', '') // fail in-browser validation
}

export = {
  'IDENT UAT 8: Sign in with email, missing fields': function (browser: NightWatchBrowser) {
    testMissingEmailField(browser);
    testMissingPasswordField(browser);
    browser.end();
  }
};
