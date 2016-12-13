import {NightWatchBrowser} from 'nightwatch';
import firebase = require('firebase');
//import {WRONG_PASSWORD_ERROR} from "../../src/main/connect/properties"
const {TEST_EXISTING_USER_EMAIL, TEST_EXISTING_USER_PASSWORD} = process.env;

const stringify = JSON.stringify;

const Sparks = {
  buildEnv: stringify(process.env.BUILD_ENV),
  firebase: {
    databaseURL: stringify(process.env.FIREBASE_DATABASE_URL),
    apiKey: stringify(process.env.FIREBASE_API_KEY),
    authDomain: stringify(process.env.FIREBASE_AUTH_DOMAIN),
    storageBucket: stringify(process.env.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  },
};

firebase.initializeApp(Sparks.firebase);

function execTest(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/connect')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', TEST_EXISTING_USER_EMAIL)
    .setValue('.c-textfield__input--password', TEST_EXISTING_USER_PASSWORD + 'dummy')
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(4000) // give it time to redirect
    .assert.urlContains('connect') // we are on the same page
    .assert.containsText('.c-textfield--errorfield', 'Wrong password')
    .end();
}


export = {
  'IDENT UAT 3.1: Create with Email, Already Exists, used correct password': execTest
};
