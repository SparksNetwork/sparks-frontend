import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 8: Sign in with email, missing fields': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display

    browser.end();
  },
};
