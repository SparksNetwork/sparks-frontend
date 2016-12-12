import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 3: Create with email': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .setValue('.c-textfield__input--email', process.env.TEST_NEW_USER_EMAIL)
      .setValue('.c-textfield__input--password', process.env.TEST_NEW_USER_PASSWORD)
      .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
      .pause(2000) // give it time to redirect
      .assert.urlContains('dash') // we are on the dashboard page
      .end();
  },
};
