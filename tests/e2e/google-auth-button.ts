import { NightWatchBrowser } from 'nightwatch';

import { googleButtonId } from '../../src/components/GoogleAuthenticationButton';

export = {
  'Clicking google authentication button should bring you to google login':
    function (browser: NightWatchBrowser) {
      browser
        .url('http://localhost:8080')
        .waitForElementVisible('body', 1000)
        .waitForElementVisible(googleButtonId, 10000)
        .click(googleButtonId)
        .pause(3000)
        .assert.urlContains('google.com')
        .end();
    },
};
