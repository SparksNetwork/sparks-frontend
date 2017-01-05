import './initialize';

import * as admin from 'firebase-admin';

export function deleteUser(email: string, done: Function) {
  (admin.auth() as any).getUserByEmail(email)
    .then((userRecord: any) => (admin.auth() as any).deleteUser(userRecord.uid))
    .then(function () {
      done(null, `Deleted ${email} from database`);
    })
    .catch(function (error: any) {
      if (error.errorInfo && error.errorInfo.code === 'auth/user-not-found')
        return done(null, `Unable to find ${email}.`);

      done(error, `An error occured. Check your FIREBASE_ADMINSDK environment variables.`);
    });
}
