import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 5: Sign in with google': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--google')
      .api.pause(2000)
      .assert.urlContains('ServiceLogin') // we are on the google page
      .waitForElementPresent('#Email', 1000)
      .setValue('#Email', process.env.GOOGLE_TEST_EMAIL)
      .click('#next')
      .waitForElementPresent('#Passwd', 1000)
      .setValue('#Passwd', process.env.GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .waitForElementPresent('#user-email', 2000)
      .assert.containsText('#user-email', process.env.GOOGLE_TEST_EMAIL)
      .end();

    browser.end();
  },
};
