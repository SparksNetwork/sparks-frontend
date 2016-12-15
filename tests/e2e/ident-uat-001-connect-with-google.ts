import * as admin from 'firebase-admin';

import { NightWatchBrowser } from 'nightwatch';

const serviceAccount = require(process.env.FIREBASE_ADMINSDK_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export = {
  afterEach: function (_: any, done: Function) {
    (admin.auth() as any).getUserByEmail(process.env.GOOGLE_TEST_EMAIL)
      .then((userRecord: any) => {
        const uid: string = userRecord.uid;

        (admin.auth() as any).deleteUser(uid)
          .then(() => {
            console.log(`Deleted ${process.env.GOOGLE_TEST_EMAIL} from database`);
            done();
          })
          .catch((error: Error) => {
            throw error;
          });
      })
      .catch((error: Error) => {
        throw error;
      });

    done();
  },

  'IDENT UAT 1: Connect with Google': function (browser: NightWatchBrowser) {
    browser
      .url('localhost:8080/connect')
      .waitForElementVisible('#page') // wait for the page to display
      .click('.c-btn-federated--google') // click the google button
      .pause(5000) // give it time to redirect
      .assert.urlContains('ServiceLogin') // we are on the google page
      .waitForElementPresent('#Email')
      .setValue('#Email', process.env.GOOGLE_TEST_EMAIL)
      .click('#next')
      .waitForElementPresent('#Passwd')
      .setValue('#Passwd', process.env.GOOGLE_TEST_EMAIL_PASSWORD)
      .click('#signIn')
      .waitForElementPresent('#user-email')
      .assert.containsText('#user-email', process.env.GOOGLE_TEST_EMAIL)
      .end();
  },
};
