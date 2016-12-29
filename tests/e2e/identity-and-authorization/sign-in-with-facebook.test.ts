import { NightWatchBrowser } from 'nightwatch';
import { deleteFacebookUser } from '../../e2e-common';

export = {
  after: deleteFacebookUser,

  'Given the User is connected with FACEBOOK_TEST_EMAIL': function (browser: NightWatchBrowser) {
    (browser.page as any).connect()
      .navigate()
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--facebook')
      .waitForElementPresent('#email')
      .setValue('#email', process.env.FACEBOOK_TEST_EMAIL)
      .setValue('#pass', process.env.FACEBOOK_TEST_EMAIL_PASSWORD)
      .click('button[type=submit]')
      .waitForElementPresent('#user-email');

    browser.end();
  },

  'Scenario: Sign in with Facebook': function (browser: NightWatchBrowser) {
    browser.page.signin()
      .navigate()
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--facebook')
      .api.pause(10000)
      .assert.urlContains('facebook.com/login.php') // we are on the facebook page
      .waitForElementPresent('#email')
      .setValue('#email', process.env.FACEBOOK_TEST_EMAIL)
      .setValue('#pass', process.env.FACEBOOK_TEST_EMAIL_PASSWORD)
      .click('button[type=submit]')
      .waitForElementPresent('#user-email')
      .assert.containsText('#user-email', process.env.FACEBOOK_TEST_EMAIL)
      .end();

    browser.end();
  },
};
