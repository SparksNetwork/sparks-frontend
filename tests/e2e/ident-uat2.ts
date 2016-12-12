import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 2: Sign in with facebook': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--facebook')
      .api.pause(2000)
      .assert.urlContains('www.facebook.com/login.php') // we are on the facebook page
      .waitForElementPresent('#email', 1000)
      .setValue('#email', process.env.FACEBOOK_TEST_EMAIL)
      .setValue('#pass', process.env.FACEBOOK_TEST_EMAIL_PASSWORD)
      .click('input[type=submit]')
      .waitForElementPresent('#user-email', 2000)
      .assert.containsText('#user-email', process.env.FACEBOOK_TEST_EMAIL)
      .end();

    browser.end();
  },
};
