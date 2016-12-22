import { NightWatchBrowser } from 'nightwatch';

export = {
  'Scenario: Switch to Sign In URL': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click(`a[href^='/signin']`)
      .waitForElementPresent('#page', 1000)
      .assert.urlContains('/signin')
      .end();
  },
};
