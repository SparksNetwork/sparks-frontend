import {NightWatchBrowser} from 'nightwatch';

import * as admin from 'firebase-admin';

const {
        FIREBASE_DATABASE_URL,
        EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD
      } = process.env;

function getAuthAdmin() {
  const serviceAccount = require('../../../firebase.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });
  return admin.auth() as any;
}

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
  deleteUserAndReturnPromise(email)
    .catch(() => {
      // user does not exist already in the database - expected
    })
    .then(() => createUser(email, pwd))
  ;
}

function deleteUserAndReturnPromise(email: string) {
  return authAdmin.getUserByEmail(email)
    .then((userRecord: any) => {
      return authAdmin.deleteUser(userRecord.uid);
    })
}

function deleteUser(email: string) {
  deleteUserAndReturnPromise(email);
}

function execTest(browser: NightWatchBrowser) {
  browser
    .url('localhost:8080/connect')
    .waitForElementVisible('#page', 1000) // wait for the page to display
    .setValue('.c-textfield__input--email', EMAIL_AND_PASSWORD_TEST_EMAIL)
    .setValue('.c-textfield__input--password', EMAIL_AND_PASSWORD_TEST_PASSWORD)
    .click('.c-btn.c-btn--primary.c-sign-in__submit') // click submit button
    .pause(2000) // give it time to redirect
    .assert.urlContains('dash') // we are on the dashboard page
    .end();
}

export = {
  before: deleteIfExistsAndRecreateUser(EMAIL_AND_PASSWORD_TEST_EMAIL, EMAIL_AND_PASSWORD_TEST_PASSWORD),
  after: deleteUser(EMAIL_AND_PASSWORD_TEST_EMAIL),
  'IDENT UAT 3.1: Create with Email, Already Exists, used correct password': execTest
};
