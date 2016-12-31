import { NightWatchBrowser } from 'nightwatch';

export = {
  'Scenario: Switch to connect URL': function (browser: NightWatchBrowser) {
    browser
      .url('http://localhost:8080/signin')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click(`a[href^='/connect']`)
      .waitForElementPresent('#page', 1000)
      .assert.urlContains('/connect')
      .end();
  }
};

