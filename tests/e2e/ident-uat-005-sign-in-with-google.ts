import { NightWatchBrowser } from 'nightwatch';
import { deleteGoogleUser } from '../e2e-common';

export = {
  afterEach: deleteGoogleUser,

  connectGoogleUser: function (browser: NightWatchBrowser) {
    (browser.page as any).connect()
      .navigate()
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--google') // click the google button
      .waitForElementPresent('#Email')
      .setValue('#Email', process.env.GOOGLE_TEST_EMAIL)
      .click('#next')
      .waitForElementPresent('#Passwd')
      .setValue('#Passwd', process.env.GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .waitForElementPresent('#user-email');

    browser.end();
  },

  'IDENT UAT 5: Sign in with google': function (browser: NightWatchBrowser) {

    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--google')
      .api.pause(2000)
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
