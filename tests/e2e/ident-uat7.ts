import {NightWatchBrowser} from 'nightwatch';
import firebase = require('firebase');
import * as admin from 'firebase-admin';

const stringify = JSON.stringify;

const {
        FIREBASE_DATABASE_URL, FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN,
        FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID,
        EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD
      } = process.env;

const Sparks = {
  firebase: {
    databaseURL: stringify(FIREBASE_DATABASE_URL),
    apiKey: stringify(FIREBASE_API_KEY),
    authDomain: stringify(FIREBASE_AUTH_DOMAIN),
    storageBucket: stringify(FIREBASE_STORAGE_BUCKET),
    messagingSenderId: stringify(FIREBASE_MESSAGING_SENDER_ID),
  },
};

function getAuthAdmin() {
  const serviceAccount = require('../../../firebase.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });
  return admin.auth() as any;
}

firebase.initializeApp(Sparks.firebase);
// let auth = firebase.auth();
let authAdmin: any = getAuthAdmin();

function createUser(email: string, pwd: string) {
  return authAdmin.createUser({
    email: email,
    emailVerified: false,
    password: pwd,
    displayName: email,
    disabled: false
  })
    .then(function (userRecord: any) {
      console.log("Successfully created a new user:", userRecord.emailInternal);
    })
    .catch(function (error: any) {
      console.error("Error creating new user:", error);
      throw error;
    });
}

function deleteIfExistsAndRecreateUser(email: string, pwd: string) {
  deleteUser(email)
    .catch((err: any) => {
      console.log('user does not exist already in the database - creating it', err);
    })
    .then(() => createUser(email, pwd))
    ;
}

function deleteUser(email: string) {
  return authAdmin.getUserByEmail(email)
    .then((userRecord: any) => {
      console.log('deleting user', userRecord.uid);
      return authAdmin.deleteUser(userRecord.uid);
    })
}

export = {
  before: deleteIfExistsAndRecreateUser(EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD),
  // after: deleteUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
  'IDENT UAT 7: Sign in with email from Connect': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/signin')
      .waitForElementVisible('#page', 1000) // wait for the page to display
      .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
      .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD)
      .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
      .pause(2000) // give it time to redirect
      .assert.urlContains('dash') // we are on the dashboard page
      .end();
  },
};
