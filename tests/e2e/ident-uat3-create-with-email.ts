import { NightWatchBrowser } from 'nightwatch';
import firebaseAdmin = require('firebase-admin');

export = {
  'IDENT UAT 3: Create with email': function(browser: NightWatchBrowser) {
    prepareFirebase().then(() => {
      browser.page.connect()
        .navigate()
        .waitForElementVisible('.c-sign-in', 2000) // wait for the page to display
        .setValue('input[type=text]', process.env.EMAIL_TEST_EMAIL)
        .setValue('input[type=password]', process.env.EMAIL_TEST_PASSWORD)
        .click('.c-sign-in__submit')
        .waitForElementPresent('#user-email', 4000)
        .assert.containsText('#user-email', process.env.EMAIL_TEST_EMAIL)
        .end();
    });
  },
};

function prepareFirebase(): Promise<any> {
  const auth: any = getAuthAdmin();

  return auth.getUserByEmail(process.env.EMAIL_TEST_EMAIL)
      .then((userRecord: any) => {
          console.log('deleting user', userRecord.uid);
          auth.deleteUser(userRecord.uid);
      })
      .catch((err: any) => {
          console.log('not deleting', err);
          // return Promise.resolve();
      });
}

function getAuthAdmin() {
  const serviceAccount = require('../../../firebase.json');
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  return firebaseAdmin.auth();
}
