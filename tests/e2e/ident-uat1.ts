import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 1: Connect with Google': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--google') // click the google button
      .pause(2000) // give it time to redirect
      .assert.urlContains('ServiceLogin') // we are on the google page
      .end();
  },
};
