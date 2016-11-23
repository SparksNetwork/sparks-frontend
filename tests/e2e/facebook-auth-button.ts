import { NightWatchBrowser } from 'nightwatch';

import { facebookButtonId } from '../../src/components/FacebookAuthenticationButton';

export = {
  'Clicking facebook authentication button should bring you to facebook login':
    function (browser: NightWatchBrowser) {
      browser
        .url('http://localhost:8080')
        .waitForElementVisible('body', 1000)
        .waitForElementVisible(facebookButtonId, 10000)
        .click(facebookButtonId)
        .pause(3000)
        .assert.urlContains('facebook.com')
        .end();
    },
};
