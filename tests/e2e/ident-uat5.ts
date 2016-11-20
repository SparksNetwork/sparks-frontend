import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 5': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page', 1000)
      // .setValue('input[type=text]', 'nightwatch')
      // .waitForElementVisible('button[name=btnG]', 1000)
      // .click('button[name=btnG]')
      // .pause(1000)
      // .assert.containsText('#main', 'Night Watch')
      .end();
  },
};
