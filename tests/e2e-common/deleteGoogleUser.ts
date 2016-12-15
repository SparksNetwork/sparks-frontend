import * as admin from 'firebase-admin';

const serviceAccount = require(process.env.FIREBASE_ADMINSDK_JSON);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export function deleteGoogleUser(_: any, done: Function) {
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
}
