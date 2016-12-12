import {NightWatchBrowser} from 'nightwatch';
import firebase = require('firebase');
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
    .setValue('.c-textfield__input--password', TEST_EXISTING_USER_PASSWORD)
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(2000) // give it time to redirect
    .assert.urlContains('dash') // we are on the dashboard page
    .end();
}

// TODO : WIP get the setUp to run in connection with selenium
//function setUp(browser: NightWatchBrowser) {//
//  function errorHandler(error: any) {
//    // Errors while removing the profile - they are final
//    throw error.message;
//  }
//
//  firebase.auth().signInWithEmailAndPassword(TEST_EXISTING_USER_EMAIL,
// TEST_EXISTING_USER_PASSWORD)
//    .then(function (user) {
//      // TEST_EXISTING_USER exists.
//      // Remove the profile
//      user.delete()
//        .then(function () {
//          // Recreate it
//          firebase.auth().createUserWithEmailAndPassword(TEST_EXISTING_USER_EMAIL, TEST_EXISTING_USER_PASSWORD)
//            .then(function (_) {
//              // THEN execute the tests...
//              execTest(browser);
//            })
//            .catch(errorHandler)
//        })
//        .catch(errorHandler)
//    })
//    .catch(function (error: any) {
//      if (error.code !== 'auth/user-not-found') {
//        throw error.message
//      }
//      else {
//        // TEST_EXISTING_USER does not exist.
//        // Create it anew
//        firebase.auth().createUserWithEmailAndPassword(TEST_EXISTING_USER_EMAIL, TEST_EXISTING_USER_PASSWORD)
//          .then(function (_) {
//            // THEN execute the tests...
//            execTest(browser);
//          })
//          .catch(errorHandler)
//      }
//    });
//}

export = {
  'IDENT UAT 3.1: Create with Email, Already Exists, used correct password': execTest
};
