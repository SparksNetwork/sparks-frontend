import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 1: Connect with Google': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--google') // click the google button
      .pause(5000) // give it time to redirect
      .assert.urlContains('ServiceLogin') // we are on the google page
      .waitForElementPresent('#Email')
      .setValue('#Email', process.env.GOOGLE_TEST_EMAIL)
      .click('#next')
      .waitForElementPresent('#Passwd')
      .setValue('#Passwd', process.env.GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .waitForElementPresent('#user-email')
      .assert.containsText('#user-email', process.env.GOOGLE_TEST_EMAIL)
      .end();
  },
};
