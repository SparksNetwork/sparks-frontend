import './initialize';

import * as admin from 'firebase-admin';

export function deleteGoogleUser(_: any, done: Function) {
  (admin.auth() as any).getUserByEmail(process.env.GOOGLE_TEST_EMAIL)
    .then((userRecord: any) => {
      const uid: string = userRecord.uid;

      (admin.auth() as any).deleteUser(uid)
        .then(() => {
          console.log(`Deleted ${process.env.GOOGLE_TEST_EMAIL} from database`);
          done();
        })
        .catch(done);
    })
    .catch(done);
}
