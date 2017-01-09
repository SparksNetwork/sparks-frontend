import './initialize';
import * as admin from 'firebase-admin';

export function createUser(email: string, pwd: string) {
  return (admin.auth() as any).createUser({
    email: email,
    emailVerified: false,
    password: pwd,
    displayName: email,
    disabled: false
  })
    .then(function (userRecord: any) {
      console.log("Successfully created a new user:", userRecord.emailInternal, pwd);
    })
    .catch(function (error: any) {
      console.error("Error creating new user:", error);
      throw error;
    });
}
