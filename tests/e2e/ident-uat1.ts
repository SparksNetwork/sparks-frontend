import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 1: Connect with Google': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--google') // click the google button
      .pause(2000) // give it time to redirect
      .assert.urlContains('ServiceLogin') // we are on the google page
      .waitForElementPresent('#Email', 1000)
      .setValue('#Email', process.env.GOOGLE_TEST_EMAIL)
      .click('#next')
      .waitForElementPresent('#Passwd', 1000)
      .setValue('#Passwd', process.env.GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .waitForElementPresent('#page', 1000)
      .assert.urlContains('/connect')
      .end();
  },
};
