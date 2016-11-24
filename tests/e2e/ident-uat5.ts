import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 5': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .click('button.c-btn--google') // click the google button
      .pause(2000) // give it time to redirect
      .assert.urlContains('ServiceLogin') // we are on the google page
      // .assert.containsText('h1', 'Choose an account')
      // .setValue('input[type=text]', 'nightwatch')
      // .waitForElementVisible('button[name=btnG]', 1000)
      // .click('button[name=btnG]')
      // .pause(1000)
      // .assert.containsText('#main', 'Night Watch')
      .end();
  },
};
