import { NightWatchBrowser } from 'nightwatch';
import { deleteFacebookUser } from '../../e2e-common';

export = {
  before: deleteFacebookUser,

  after: deleteFacebookUser,

  'Scenario: Connect with Facebook': function (browser: NightWatchBrowser) {
    (browser.page as any).connect()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--facebook')
      .api.pause(2000)
      .assert.urlContains('www.facebook.com/login.php') // we are on the facebook page
      .waitForElementPresent('#email', 1000)
      .setValue('#email', process.env.FACEBOOK_TEST_EMAIL)
      .setValue('#pass', process.env.FACEBOOK_TEST_EMAIL_PASSWORD)
      .click('button[type=submit]')
      .waitForElementPresent('#user-email')
      .assert.containsText('#user-email', process.env.FACEBOOK_TEST_EMAIL)
      .end();

    browser.end();
  },
};
