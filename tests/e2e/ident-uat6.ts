import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 5: Sign in with facebook': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/signin')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      // .click('.c-btn-federated--google') // click the google button
      // .pause(2000) // give it time to redirect
      // .assert.urlContains('ServiceLogin') // we are on the google page
      .end();
  },
};
