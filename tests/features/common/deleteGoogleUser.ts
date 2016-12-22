import './initialize';

import * as admin from 'firebase-admin';

export function deleteGoogleUser() {
  (admin.auth() as any).getUserByEmail(process.env.GOOGLE_TEST_EMAIL)
    .then((userRecord: any) => (admin.auth() as any).deleteUser(userRecord.uid))
    .then(function () {
      console.log(`Deleted ${process.env.GOOGLE_TEST_EMAIL} from database`);
    })
    .catch(function (error: any) {
      if (error.errorInfo && error.errorInfo.code === 'auth/user-not-found')
        return;

      console.log(`An error occured. Check your FIREBASE_ADMINSDK environment variables.`);

      throw error;
    });
}
