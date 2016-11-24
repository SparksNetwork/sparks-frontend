import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 5: Sign in with google': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('@googleButton')
      .api.pause(2000)
      .assert.urlContains('ServiceLogin') // we are on the google page

    browser.end();
  },
};
