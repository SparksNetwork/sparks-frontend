import { NightWatchBrowser } from 'nightwatch';

export = {
  'Scenario: Switch to Sign In URL': function (browser: NightWatchBrowser) {
    browser
      .url('http://localhost:8080/connect')
      .waitForElementVisible('#page') // wait for the page to display
      .click(`a[href^='/signin']`)
      .waitForElementPresent('#page')
      .assert.urlContains('/signin')
      .end();
  },
};
