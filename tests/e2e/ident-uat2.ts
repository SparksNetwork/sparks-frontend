import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 2: Connect with Facebook': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('.c-btn-federated--facebook') // click the google button
      .pause(2000) // give it time to redirect
      .assert.urlContains('www.facebook.com') // we are on facebook
      .assert.urlContains('login.php') // we are on the login page
      .end();
  },
};
