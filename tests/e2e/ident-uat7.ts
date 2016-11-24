import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 7: Sign in with email from Connect': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display

    browser.end();
  },
};
