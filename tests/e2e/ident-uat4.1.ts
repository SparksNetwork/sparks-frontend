import { NightWatchBrowser } from 'nightwatch';

export = {
  'IDENT UAT 4.1: Switch from Connect to Sign In': switchConnectToSignIn,
  'IDENT UAT 4.1: Switch from Sign In to Connect': switchSignInToConnect,
};

function switchConnectToSignIn (browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/connect')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .click(`a[href^='/signin']`)
    .waitForElementPresent('#page', 1000)
    .assert.urlContains('/signin');
}

function switchSignInToConnect (browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/signin')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .click(`a[href^='/connect']`)
    .waitForElementPresent('#page', 1000)
    .assert.urlContains('/connect');
}