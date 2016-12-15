import {NightWatchBrowser} from 'nightwatch';
const {TEST_EXISTING_USER_EMAIL, TEST_EXISTING_USER_PASSWORD} = process.env;

function testMissingEmailField(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/connect')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', '')
    .setValue('.c-textfield__input--password', TEST_EXISTING_USER_PASSWORD)
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(100) // give it time
    .assert.urlContains('connect') // we are on same route
    .assert.containsText('.c-textfield__input--email:invalid', '');
}

function testMissingPasswordField(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/connect')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', TEST_EXISTING_USER_EMAIL)
    .setValue('.c-textfield__input--password', '')
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(100) // give it time to redirect
    .assert.urlContains('connect') // we are on same route
    .assert.containsText('.c-textfield__input--password:invalid', '') // fail in-browser validation
}

export = {
  'IDENT UAT 4: Create with Email, Missing Fields': function (browser: NightWatchBrowser) {
    testMissingEmailField(browser);
    testMissingPasswordField(browser);
    browser.end();
  }
};
