import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 7: Sign in with email from Connect': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/signin')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .setValue('.c-textfield__input--email', process.env.TEST_EXISTING_USER_EMAIL)
      .setValue('.c-textfield__input--password', process.env.TEST_EXISTING_USER_PASSWORD)
      .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
      .pause(2000) // give it time to redirect
      .assert.urlContains('dash') // we are on the dashboard page
      .end();
  },
};
