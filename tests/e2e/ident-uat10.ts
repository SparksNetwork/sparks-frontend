import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 10: Forgot Password': function (browser: NightWatchBrowser) {
    (browser.page as any).signin()
      .navigate()
      .waitForElementVisible('#page', 1000) // wait for the page to display

    browser.end();
  },
};
