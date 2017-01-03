import "./initialize";
import * as admin from "firebase-admin";

export function deleteUserAndReturnPromise(email: string) {
  return (admin.auth() as any).getUserByEmail(email)
    .then((userRecord: any) => {
      return (admin.auth() as any).deleteUser(userRecord.uid);
    })
    .catch((x: any) => void x)
}

export function deleteFirebaseUser(email: string) {
  return function _deleteFirebaseUser(_, done: Function) {
    return deleteUserAndReturnPromise(email)
      .then(done);
  }

}
